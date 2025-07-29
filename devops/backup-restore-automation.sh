#!/bin/bash
# IELTS网站自动化备份和恢复脚本
# 支持增量备份、跨区域复制和快速恢复

set -euo pipefail

# 配置变量
ENVIRONMENT="${ENVIRONMENT:-production}"
PRIMARY_BUCKET="${PRIMARY_BUCKET:-ielts-website-${ENVIRONMENT}}"
BACKUP_BUCKET="${BACKUP_BUCKET:-ielts-backup-${ENVIRONMENT}}"
CROSS_REGION_BUCKET="${CROSS_REGION_BUCKET:-ielts-dr-${ENVIRONMENT}}"
PRIMARY_REGION="${AWS_DEFAULT_REGION:-ap-southeast-1}"
DR_REGION="${DR_REGION:-us-west-2}"

# 备份配置
BACKUP_PREFIX="backup-$(date +%Y%m%d-%H%M%S)"
RETENTION_DAYS=90
AUDIO_COMPRESSION_ENABLED=true

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# 检查依赖
check_dependencies() {
    local missing_deps=()
    
    command -v aws >/dev/null || missing_deps+=("aws-cli")
    command -v jq >/dev/null || missing_deps+=("jq")
    command -v rsync >/dev/null || missing_deps+=("rsync")
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        error "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    # 验证AWS凭证
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        error "AWS credentials not configured or invalid"
        exit 1
    fi
    
    log "Dependencies check passed"
}

# 创建备份清单
create_backup_manifest() {
    log "Creating backup manifest..."
    
    local manifest_file="backup-manifest-${BACKUP_PREFIX}.json"
    
    cat > "$manifest_file" << EOF
{
    "backup_info": {
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "environment": "$ENVIRONMENT",
        "backup_id": "$BACKUP_PREFIX",
        "primary_region": "$PRIMARY_REGION",
        "dr_region": "$DR_REGION",
        "backup_type": "full",
        "compression_enabled": $AUDIO_COMPRESSION_ENABLED
    },
    "sources": {
        "critical_files": [],
        "important_files": [],
        "standard_files": []
    },
    "checksums": {},
    "statistics": {
        "total_files": 0,
        "total_size": 0,
        "compressed_size": 0
    }
}
EOF
    
    echo "$manifest_file"
}

# 计算文件校验和
calculate_checksums() {
    local file_path="$1"
    local manifest_file="$2"
    
    if [[ -f "$file_path" ]]; then
        local checksum=$(md5sum "$file_path" | cut -d' ' -f1)
        local relative_path=$(realpath --relative-to=. "$file_path")
        
        # 更新manifest文件
        jq --arg path "$relative_path" --arg checksum "$checksum" \
           '.checksums[$path] = $checksum' "$manifest_file" > "$manifest_file.tmp"
        mv "$manifest_file.tmp" "$manifest_file"
    fi
}

# 分类文件
classify_files() {
    local manifest_file="$1"
    
    log "Classifying files for backup..."
    
    # 关键文件（音频和核心网页）
    local critical_files=(
        "audio/剑桥雅思20/"
        "audio/test1/"
        "audio/test2/"
        "audio/test3/"
        "index.html"
        "pages/*.html"
        "js/main.js"
        "js/test-*.js"
        "css/main.css"
    )
    
    # 重要文件（其他静态资源）
    local important_files=(
        "images/"
        "css/"
        "js/"
        "docs/"
        "*.md"
        "*.json"
    )
    
    # 标准文件（配置和其他）
    local standard_files=(
        "devops/"
        "backups/"
        ".github/"
    )
    
    # 处理关键文件
    for pattern in "${critical_files[@]}"; do
        find . -path "./$pattern" -type f 2>/dev/null | while read -r file; do
            if [[ -f "$file" ]]; then
                local relative_path=$(realpath --relative-to=. "$file")
                jq --arg path "$relative_path" \
                   '.sources.critical_files += [$path]' "$manifest_file" > "$manifest_file.tmp"
                mv "$manifest_file.tmp" "$manifest_file"
                calculate_checksums "$file" "$manifest_file"
            fi
        done
    done
    
    # 处理重要文件
    for pattern in "${important_files[@]}"; do
        find . -path "./$pattern" -type f 2>/dev/null | while read -r file; do
            # 跳过已在关键文件中的文件
            if ! jq -e --arg path "$(realpath --relative-to=. "$file")" \
                   '.sources.critical_files | index($path)' "$manifest_file" >/dev/null; then
                local relative_path=$(realpath --relative-to=. "$file")
                jq --arg path "$relative_path" \
                   '.sources.important_files += [$path]' "$manifest_file" > "$manifest_file.tmp"
                mv "$manifest_file.tmp" "$manifest_file"
                calculate_checksums "$file" "$manifest_file"
            fi
        done
    done
    
    log "File classification completed"
}

# 压缩音频文件（如果启用）
compress_audio_files() {
    local manifest_file="$1"
    
    if [[ "$AUDIO_COMPRESSION_ENABLED" != "true" ]]; then
        log "Audio compression disabled, skipping..."
        return
    fi
    
    log "Compressing audio files for backup..."
    
    local temp_dir="temp-backup-$$"
    mkdir -p "$temp_dir"
    
    # 获取关键文件中的音频文件
    jq -r '.sources.critical_files[]' "$manifest_file" | grep -E '\.(mp3|m4a)$' | while read -r audio_file; do
        if [[ -f "$audio_file" ]]; then
            local output_file="$temp_dir/${audio_file}"
            mkdir -p "$(dirname "$output_file")"
            
            # 检查文件大小，只压缩大于10MB的文件
            local file_size=$(stat -c%s "$audio_file")
            if [[ $file_size -gt 10485760 ]]; then  # 10MB
                log "Compressing: $audio_file"
                ffmpeg -i "$audio_file" -codec:a mp3 -b:a 128k "$output_file" -y >/dev/null 2>&1 || {
                    warn "Failed to compress $audio_file, using original"
                    cp "$audio_file" "$output_file"
                }
            else
                cp "$audio_file" "$output_file"
            fi
        fi
    done
    
    echo "$temp_dir"
}

# 执行备份到S3
backup_to_s3() {
    local manifest_file="$1"
    local temp_dir="$2"
    
    log "Starting backup to S3..."
    
    # 上传压缩后的音频文件
    if [[ -d "$temp_dir" && "$AUDIO_COMPRESSION_ENABLED" == "true" ]]; then
        log "Uploading compressed audio files..."
        aws s3 sync "$temp_dir/" "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/compressed/" \
            --storage-class STANDARD_IA \
            --metadata "backup-type=compressed,timestamp=$(date -u +%s)"
    fi
    
    # 上传原始文件（非音频）
    log "Uploading original files..."
    
    # 关键文件使用标准存储
    jq -r '.sources.critical_files[]' "$manifest_file" | grep -v -E '\.(mp3|m4a)$' | while read -r file; do
        if [[ -f "$file" ]]; then
            aws s3 cp "$file" "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/original/$file" \
                --storage-class STANDARD \
                --metadata "backup-type=critical,timestamp=$(date -u +%s)"
        fi
    done
    
    # 重要文件使用IA存储
    jq -r '.sources.important_files[]' "$manifest_file" | while read -r file; do
        if [[ -f "$file" ]]; then
            aws s3 cp "$file" "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/original/$file" \
                --storage-class STANDARD_IA \
                --metadata "backup-type=important,timestamp=$(date -u +%s)"
        fi
    done
    
    # 上传清单文件
    aws s3 cp "$manifest_file" "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/" \
        --storage-class STANDARD \
        --metadata "backup-type=manifest,timestamp=$(date -u +%s)"
    
    log "Backup to S3 completed"
}

# 跨区域复制
cross_region_replication() {
    local manifest_file="$1"
    
    log "Starting cross-region replication to $DR_REGION..."
    
    # 只复制关键文件到灾备区域
    AWS_DEFAULT_REGION="$DR_REGION" aws s3 sync \
        "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/" \
        "s3://$CROSS_REGION_BUCKET/$BACKUP_PREFIX/" \
        --storage-class STANDARD_IA \
        --metadata-directive COPY
    
    log "Cross-region replication completed"
}

# 清理旧备份
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
    
    # 清理主备份存储桶
    aws s3 ls "s3://$BACKUP_BUCKET/" | while read -r line; do
        local folder_date=$(echo "$line" | grep -o 'backup-[0-9]\{8\}' | cut -d'-' -f2)
        if [[ -n "$folder_date" && "$folder_date" < "$cutoff_date" ]]; then
            local folder_name=$(echo "$line" | awk '{print $2}')
            log "Deleting old backup: $folder_name"
            aws s3 rm "s3://$BACKUP_BUCKET/$folder_name" --recursive
        fi
    done
    
    # 清理跨区域备份
    AWS_DEFAULT_REGION="$DR_REGION" aws s3 ls "s3://$CROSS_REGION_BUCKET/" | while read -r line; do
        local folder_date=$(echo "$line" | grep -o 'backup-[0-9]\{8\}' | cut -d'-' -f2)
        if [[ -n "$folder_date" && "$folder_date" < "$cutoff_date" ]]; then
            local folder_name=$(echo "$line" | awk '{print $2}')
            log "Deleting old DR backup: $folder_name"
            AWS_DEFAULT_REGION="$DR_REGION" aws s3 rm "s3://$CROSS_REGION_BUCKET/$folder_name" --recursive
        fi
    done
    
    log "Cleanup completed"
}

# 验证备份完整性
verify_backup() {
    local manifest_file="$1"
    
    log "Verifying backup integrity..."
    
    local errors=0
    
    # 检查S3中的文件
    jq -r '.sources.critical_files[], .sources.important_files[]' "$manifest_file" | while read -r file; do
        local s3_path="s3://$BACKUP_BUCKET/$BACKUP_PREFIX/original/$file"
        
        if ! aws s3 ls "$s3_path" >/dev/null 2>&1; then
            error "Missing file in backup: $file"
            ((errors++))
        fi
    done
    
    # 检查清单文件
    if ! aws s3 ls "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/$manifest_file" >/dev/null 2>&1; then
        error "Missing manifest file in backup"
        ((errors++))
    fi
    
    if [[ $errors -eq 0 ]]; then
        log "Backup verification passed"
        return 0
    else
        error "Backup verification failed with $errors errors"
        return 1
    fi
}

# 发送通知
send_notification() {
    local status="$1"
    local message="$2"
    
    # 发送到CloudWatch
    aws cloudwatch put-metric-data \
        --namespace "Custom/IELTS/Backup" \
        --metric-data MetricName=BackupStatus,Value=$([[ "$status" == "success" ]] && echo 1 || echo 0),Unit=Count
    
    # 发送到SNS（如果配置了）
    if [[ -n "${SNS_TOPIC_ARN:-}" ]]; then
        aws sns publish \
            --topic-arn "$SNS_TOPIC_ARN" \
            --subject "IELTS Backup Status - $status" \
            --message "$message"
    fi
    
    log "Notification sent: $status"
}

# 恢复功能
restore_from_backup() {
    local backup_id="$1"
    local restore_target="${2:-.}"
    
    log "Starting restore from backup: $backup_id"
    
    # 下载清单文件
    local manifest_file="restore-manifest-$backup_id.json"
    aws s3 cp "s3://$BACKUP_BUCKET/$backup_id/backup-manifest-$backup_id.json" "$manifest_file"
    
    # 创建恢复目录
    mkdir -p "$restore_target"
    
    # 恢复关键文件
    jq -r '.sources.critical_files[]' "$manifest_file" | while read -r file; do
        local target_path="$restore_target/$file"
        mkdir -p "$(dirname "$target_path")"
        
        # 优先使用压缩版本（如果存在）
        if aws s3 ls "s3://$BACKUP_BUCKET/$backup_id/compressed/$file" >/dev/null 2>&1; then
            aws s3 cp "s3://$BACKUP_BUCKET/$backup_id/compressed/$file" "$target_path"
        else
            aws s3 cp "s3://$BACKUP_BUCKET/$backup_id/original/$file" "$target_path"
        fi
        
        log "Restored: $file"
    done
    
    # 恢复重要文件
    jq -r '.sources.important_files[]' "$manifest_file" | while read -r file; do
        local target_path="$restore_target/$file"
        mkdir -p "$(dirname "$target_path")"
        
        aws s3 cp "s3://$BACKUP_BUCKET/$backup_id/original/$file" "$target_path"
        log "Restored: $file"
    done
    
    log "Restore completed to: $restore_target"
}

# 主备份流程
run_backup() {
    log "Starting IELTS website backup process..."
    
    local start_time=$(date +%s)
    local manifest_file=$(create_backup_manifest)
    local temp_dir=""
    
    trap 'cleanup_temp_files "$temp_dir"' EXIT
    
    try {
        classify_files "$manifest_file"
        
        if [[ "$AUDIO_COMPRESSION_ENABLED" == "true" ]]; then
            temp_dir=$(compress_audio_files "$manifest_file")
        fi
        
        backup_to_s3 "$manifest_file" "$temp_dir"
        cross_region_replication "$manifest_file"
        cleanup_old_backups
        
        if verify_backup "$manifest_file"; then
            local end_time=$(date +%s)
            local duration=$((end_time - start_time))
            local success_message="Backup completed successfully in ${duration}s. Backup ID: $BACKUP_PREFIX"
            
            log "$success_message"
            send_notification "success" "$success_message"
        else
            error "Backup verification failed"
            send_notification "failed" "Backup verification failed for $BACKUP_PREFIX"
            exit 1
        fi
        
    } catch {
        local error_message="Backup failed: $1"
        error "$error_message"
        send_notification "failed" "$error_message"
        exit 1
    }
}

# 清理临时文件
cleanup_temp_files() {
    local temp_dir="$1"
    if [[ -n "$temp_dir" && -d "$temp_dir" ]]; then
        rm -rf "$temp_dir"
        log "Temporary files cleaned up"
    fi
}

# Try-catch实现
try() {
    [[ $- = *e* ]]; SAVED_OPT_E=$?
    set +e
}

catch() {
    export exception_code=$?
    (( SAVED_OPT_E )) && set +e
    return $exception_code
}

# 使用说明
usage() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    backup              Run full backup
    restore BACKUP_ID   Restore from backup
    list                List available backups
    verify BACKUP_ID    Verify backup integrity
    cleanup             Clean old backups

Options:
    --environment ENV   Set environment (default: production)
    --no-compression    Disable audio compression
    --help              Show this help

Examples:
    $0 backup
    $0 restore backup-20240127-143022
    $0 list
    $0 cleanup --environment staging

EOF
}

# 主函数
main() {
    case "${1:-backup}" in
        backup)
            check_dependencies
            run_backup
            ;;
        restore)
            if [[ -z "${2:-}" ]]; then
                error "Backup ID required for restore"
                usage
                exit 1
            fi
            check_dependencies
            restore_from_backup "$2" "${3:-restore-$(date +%Y%m%d-%H%M%S)}"
            ;;
        list)
            aws s3 ls "s3://$BACKUP_BUCKET/" | grep "backup-"
            ;;
        verify)
            if [[ -z "${2:-}" ]]; then
                error "Backup ID required for verification"
                exit 1
            fi
            # TODO: 实现备份验证
            ;;
        cleanup)
            check_dependencies
            cleanup_old_backups
            ;;
        --help|-h)
            usage
            ;;
        *)
            error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --no-compression)
            AUDIO_COMPRESSION_ENABLED=false
            shift
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            break
            ;;
    esac
done

# 执行主函数
main "$@"