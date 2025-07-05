#!/bin/bash

# 雅思网站项目备份和恢复脚本
# 用于剑桥雅思20集成前后的版本管理

set -e  # 遇到错误立即退出

# 配置变量
PROJECT_NAME="雅思网站"
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
VERSION="v2.0.0"
PRE_VERSION="v1.3.0"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 创建备份目录
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "创建备份目录: $BACKUP_DIR"
    fi
}

# 备份当前版本
backup_current_version() {
    local backup_name="backup_${DATE}_${VERSION}"
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    log_info "开始备份当前版本..."
    
    # 创建备份目录
    mkdir -p "$backup_path"
    
    # 备份核心文件
    log_info "备份核心文件..."
    
    # HTML文件
    cp -r *.html "$backup_path/" 2>/dev/null || log_warning "没有找到HTML文件"
    cp -r pages/ "$backup_path/" 2>/dev/null || log_warning "没有找到pages目录"
    
    # CSS文件
    cp -r css/ "$backup_path/" 2>/dev/null || log_warning "没有找到css目录"
    
    # JavaScript文件
    cp -r js/ "$backup_path/" 2>/dev/null || log_warning "没有找到js目录"
    
    # 图片资源
    cp -r images/ "$backup_path/" 2>/dev/null || log_warning "没有找到images目录"
    
    # 音频文件 (可选，文件较大)
    if [ "$1" = "--include-audio" ]; then
        log_info "备份音频文件..."
        cp -r audio/ "$backup_path/" 2>/dev/null || log_warning "没有找到audio目录"
        cp -r "剑桥雅思20/" "$backup_path/" 2>/dev/null || log_warning "没有找到剑桥雅思20目录"
    else
        log_warning "跳过音频文件备份 (使用 --include-audio 参数包含音频文件)"
    fi
    
    # 文档文件
    cp -r docs/ "$backup_path/" 2>/dev/null || log_warning "没有找到docs目录"
    cp *.md "$backup_path/" 2>/dev/null || log_warning "没有找到Markdown文件"
    
    # 创建备份信息文件
    cat > "${backup_path}/backup_info.txt" << EOF
备份信息
========
项目名称: ${PROJECT_NAME}
备份时间: $(date)
版本号: ${VERSION}
备份类型: 完整备份
包含音频: $([ "$1" = "--include-audio" ] && echo "是" || echo "否")
备份大小: $(du -sh "$backup_path" | cut -f1)

备份内容:
$(find "$backup_path" -type f | wc -l) 个文件
$(find "$backup_path" -type d | wc -l) 个目录

关键文件:
$(ls -la "$backup_path"/*.html 2>/dev/null | wc -l) 个HTML文件
$(find "$backup_path/js" -name "*.js" 2>/dev/null | wc -l) 个JavaScript文件
$(find "$backup_path/css" -name "*.css" 2>/dev/null | wc -l) 个CSS文件
EOF

    # 创建文件清单
    find "$backup_path" -type f > "${backup_path}/file_list.txt"
    
    # 压缩备份（可选）
    if command -v tar >/dev/null 2>&1; then
        log_info "压缩备份文件..."
        tar -czf "${backup_path}.tar.gz" -C "$BACKUP_DIR" "$backup_name"
        
        if [ $? -eq 0 ]; then
            rm -rf "$backup_path"
            log_success "备份完成并压缩: ${backup_path}.tar.gz"
        else
            log_warning "压缩失败，保留目录形式的备份"
        fi
    else
        log_success "备份完成: $backup_path"
    fi
    
    echo "$backup_name"
}

# 列出所有备份
list_backups() {
    log_info "可用的备份列表:"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_warning "没有找到备份目录"
        return 1
    fi
    
    local count=0
    for backup in "$BACKUP_DIR"/backup_*; do
        if [ -e "$backup" ]; then
            count=$((count + 1))
            local backup_name=$(basename "$backup")
            local backup_date=$(echo "$backup_name" | cut -d'_' -f2-3)
            local backup_version=$(echo "$backup_name" | cut -d'_' -f4)
            
            echo "  $count. $backup_name"
            echo "     日期: $backup_date"
            echo "     版本: $backup_version"
            
            if [ -f "${backup}/backup_info.txt" ]; then
                local size=$(grep "备份大小:" "${backup}/backup_info.txt" | cut -d':' -f2 | xargs)
                echo "     大小: $size"
            elif [ -f "${backup}.tar.gz" ]; then
                local size=$(du -sh "${backup}.tar.gz" | cut -f1)
                echo "     大小: $size (压缩)"
            fi
            echo
        fi
    done
    
    if [ $count -eq 0 ]; then
        log_warning "没有找到任何备份"
        return 1
    fi
    
    log_info "总共找到 $count 个备份"
}

# 恢复备份
restore_backup() {
    local backup_name="$1"
    
    if [ -z "$backup_name" ]; then
        log_error "请指定要恢复的备份名称"
        log_info "使用 '$0 list' 查看可用备份"
        return 1
    fi
    
    local backup_path="${BACKUP_DIR}/${backup_name}"
    local backup_archive="${backup_path}.tar.gz"
    
    # 检查备份是否存在
    if [ ! -d "$backup_path" ] && [ ! -f "$backup_archive" ]; then
        log_error "备份不存在: $backup_name"
        return 1
    fi
    
    # 确认恢复操作
    log_warning "警告: 此操作将覆盖当前文件!"
    read -p "确定要恢复备份 '$backup_name' 吗? (y/N): " confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        log_info "恢复操作已取消"
        return 0
    fi
    
    # 创建恢复前备份
    log_info "创建恢复前的安全备份..."
    local safety_backup=$(backup_current_version)
    log_success "安全备份创建完成: $safety_backup"
    
    # 解压备份（如果是压缩文件）
    if [ -f "$backup_archive" ] && [ ! -d "$backup_path" ]; then
        log_info "解压备份文件..."
        tar -xzf "$backup_archive" -C "$BACKUP_DIR"
    fi
    
    # 开始恢复
    log_info "开始恢复备份..."
    
    # 恢复文件
    if [ -d "$backup_path" ]; then
        # HTML文件
        cp "$backup_path"/*.html . 2>/dev/null || log_warning "没有HTML文件需要恢复"
        
        # 目录恢复
        for dir in pages css js images docs; do
            if [ -d "${backup_path}/${dir}" ]; then
                log_info "恢复 $dir 目录..."
                rm -rf "./$dir" 2>/dev/null
                cp -r "${backup_path}/${dir}" .
            fi
        done
        
        # Markdown文件
        cp "$backup_path"/*.md . 2>/dev/null || log_warning "没有Markdown文件需要恢复"
        
        log_success "备份恢复完成"
        
        # 显示恢复信息
        if [ -f "${backup_path}/backup_info.txt" ]; then
            log_info "恢复的备份信息:"
            cat "${backup_path}/backup_info.txt"
        fi
    else
        log_error "备份目录不存在: $backup_path"
        return 1
    fi
}

# 验证备份完整性
verify_backup() {
    local backup_name="$1"
    
    if [ -z "$backup_name" ]; then
        log_error "请指定要验证的备份名称"
        return 1
    fi
    
    local backup_path="${BACKUP_DIR}/${backup_name}"
    local backup_archive="${backup_path}.tar.gz"
    
    log_info "验证备份完整性: $backup_name"
    
    # 检查备份是否存在
    if [ ! -d "$backup_path" ] && [ ! -f "$backup_archive" ]; then
        log_error "备份不存在: $backup_name"
        return 1
    fi
    
    # 解压进行验证（如果是压缩文件）
    local temp_extracted=false
    if [ -f "$backup_archive" ] && [ ! -d "$backup_path" ]; then
        log_info "解压备份文件进行验证..."
        tar -xzf "$backup_archive" -C "$BACKUP_DIR"
        temp_extracted=true
    fi
    
    if [ -d "$backup_path" ]; then
        # 检查关键文件
        local html_count=$(ls "$backup_path"/*.html 2>/dev/null | wc -l)
        local js_count=$(find "$backup_path/js" -name "*.js" 2>/dev/null | wc -l)
        local css_count=$(find "$backup_path/css" -name "*.css" 2>/dev/null | wc -l)
        
        log_info "备份内容统计:"
        echo "  HTML文件: $html_count"
        echo "  JavaScript文件: $js_count"
        echo "  CSS文件: $css_count"
        
        # 检查备份信息文件
        if [ -f "${backup_path}/backup_info.txt" ]; then
            log_success "备份信息文件存在"
        else
            log_warning "备份信息文件缺失"
        fi
        
        # 检查文件清单
        if [ -f "${backup_path}/file_list.txt" ]; then
            local listed_files=$(wc -l < "${backup_path}/file_list.txt")
            local actual_files=$(find "$backup_path" -type f | wc -l)
            
            if [ $listed_files -eq $actual_files ]; then
                log_success "文件清单验证通过 ($actual_files 个文件)"
            else
                log_warning "文件清单不匹配: 清单 $listed_files, 实际 $actual_files"
            fi
        else
            log_warning "文件清单缺失"
        fi
        
        log_success "备份验证完成"
    else
        log_error "无法访问备份目录"
        return 1
    fi
    
    # 清理临时解压的文件
    if [ "$temp_extracted" = true ]; then
        rm -rf "$backup_path"
        log_info "清理临时文件"
    fi
}

# 清理旧备份
cleanup_old_backups() {
    local keep_count=${1:-5}  # 默认保留5个备份
    
    log_info "清理旧备份，保留最新的 $keep_count 个..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_warning "备份目录不存在"
        return 0
    fi
    
    # 获取备份列表（按时间排序）
    local backups=($(ls -t "$BACKUP_DIR"/backup_* 2>/dev/null))
    local total_backups=${#backups[@]}
    
    if [ $total_backups -le $keep_count ]; then
        log_info "当前备份数量 ($total_backups) 不超过保留数量 ($keep_count)，无需清理"
        return 0
    fi
    
    log_info "发现 $total_backups 个备份，将删除最旧的 $((total_backups - keep_count)) 个"
    
    # 删除多余的备份
    for ((i=keep_count; i<total_backups; i++)); do
        local backup_to_delete="${backups[i]}"
        log_info "删除旧备份: $(basename "$backup_to_delete")"
        rm -rf "$backup_to_delete"
    done
    
    log_success "清理完成，保留了 $keep_count 个最新备份"
}

# 显示帮助信息
show_help() {
    cat << EOF
雅思网站备份恢复工具

用法: $0 [命令] [选项]

命令:
  backup [--include-audio]     创建当前版本的备份
  list                        列出所有可用备份
  restore <backup_name>       恢复指定的备份
  verify <backup_name>        验证备份完整性
  cleanup [keep_count]        清理旧备份（默认保留5个）
  help                        显示此帮助信息

选项:
  --include-audio             备份时包含音频文件（会增加备份大小）

示例:
  $0 backup                   创建备份（不包含音频）
  $0 backup --include-audio  创建完整备份（包含音频）
  $0 list                     查看所有备份
  $0 restore backup_20241219_123456_v2.0.0
  $0 verify backup_20241219_123456_v2.0.0
  $0 cleanup 3                只保留最新的3个备份

注意:
- 恢复操作会覆盖当前文件，请确保重要更改已保存
- 系统会在恢复前自动创建安全备份
- 音频文件较大，建议根据需要选择是否包含
EOF
}

# 主函数
main() {
    case "$1" in
        "backup")
            create_backup_dir
            backup_current_version "$2"
            ;;
        "list")
            list_backups
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "verify")
            verify_backup "$2"
            ;;
        "cleanup")
            cleanup_old_backups "$2"
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 检查依赖
check_dependencies() {
    local missing_deps=()
    
    # 检查必需的命令
    for cmd in cp rm mkdir find du; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing_deps+=("$cmd")
        fi
    done
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "缺少必需的命令: ${missing_deps[*]}"
        exit 1
    fi
}

# 脚本入口
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    check_dependencies
    main "$@"
fi