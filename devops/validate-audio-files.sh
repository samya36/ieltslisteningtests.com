#!/bin/bash

# 音频文件验证脚本
# 验证音频文件的完整性、格式和质量

set -e

# 配置变量
AUDIO_DIR="../audio"
LOG_FILE="audio-validation-$(date +%Y%m%d_%H%M%S).log"
MAX_FILE_SIZE=50000000  # 50MB
MIN_DURATION=60         # 60秒最小时长
MAX_DURATION=1800       # 30分钟最大时长

# 支持的音频格式
ALLOWED_FORMATS=("mp3" "m4a" "wav" "ogg")
REQUIRED_TESTS=("test1" "test2" "test3" "test4" "test5" "test6" "test7")
REQUIRED_SECTIONS=("section1" "section2" "section3" "section4")

echo "=== 音频文件验证开始 ===" | tee "$LOG_FILE"
echo "时间: $(date)" | tee -a "$LOG_FILE"
echo "音频目录: $AUDIO_DIR" | tee -a "$LOG_FILE"

# 检查依赖工具
check_dependencies() {
    echo "检查依赖工具..." | tee -a "$LOG_FILE"
    
    if ! command -v ffprobe &> /dev/null; then
        echo "错误: ffprobe未安装，请安装ffmpeg" | tee -a "$LOG_FILE"
        exit 1
    fi
    
    if ! command -v mediainfo &> /dev/null; then
        echo "警告: mediainfo未安装，跳过详细信息检查" | tee -a "$LOG_FILE"
    fi
    
    echo "✓ 依赖检查完成" | tee -a "$LOG_FILE"
}

# 验证音频文件格式
validate_audio_format() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    
    # 检查文件扩展名
    local format_valid=false
    for allowed in "${ALLOWED_FORMATS[@]}"; do
        if [[ "$extension" == "$allowed" ]]; then
            format_valid=true
            break
        fi
    done
    
    if [[ "$format_valid" != true ]]; then
        echo "❌ 不支持的格式: $file (.$extension)" | tee -a "$LOG_FILE"
        return 1
    fi
    
    # 验证文件是否为真正的音频文件
    if ! ffprobe -v quiet -show_error "$file" 2>/dev/null; then
        echo "❌ 无效的音频文件: $file" | tee -a "$LOG_FILE"
        return 1
    fi
    
    # 获取音频信息
    local duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$file" 2>/dev/null)
    local bitrate=$(ffprobe -v quiet -show_entries format=bit_rate -of csv=p=0 "$file" 2>/dev/null)
    local codec=$(ffprobe -v quiet -show_entries stream=codec_name -select_streams a:0 -of csv=p=0 "$file" 2>/dev/null)
    
    # 验证时长
    if [[ -n "$duration" ]]; then
        duration_int=${duration%.*}  # 去掉小数部分
        if [[ "$duration_int" -lt "$MIN_DURATION" ]]; then
            echo "⚠️  时长过短: $file (${duration}秒 < ${MIN_DURATION}秒)" | tee -a "$LOG_FILE"
        elif [[ "$duration_int" -gt "$MAX_DURATION" ]]; then
            echo "⚠️  时长过长: $file (${duration}秒 > ${MAX_DURATION}秒)" | tee -a "$LOG_FILE"
        fi
    fi
    
    # 验证比特率
    if [[ -n "$bitrate" && "$bitrate" -lt "64000" ]]; then
        echo "⚠️  比特率过低: $file (${bitrate}bps < 64kbps)" | tee -a "$LOG_FILE"
    fi
    
    echo "✓ 音频文件有效: $file" | tee -a "$LOG_FILE"
    echo "  - 时长: ${duration}秒" | tee -a "$LOG_FILE"
    echo "  - 比特率: ${bitrate}bps" | tee -a "$LOG_FILE"
    echo "  - 编码: $codec" | tee -a "$LOG_FILE"
    
    return 0
}

# 验证文件大小
validate_file_size() {
    local file="$1"
    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    if [[ "$size" -gt "$MAX_FILE_SIZE" ]]; then
        local size_mb=$((size / 1024 / 1024))
        local max_mb=$((MAX_FILE_SIZE / 1024 / 1024))
        echo "⚠️  文件过大: $file (${size_mb}MB > ${max_mb}MB)" | tee -a "$LOG_FILE"
        return 1
    fi
    
    echo "✓ 文件大小合适: $file ($(( size / 1024 / 1024 ))MB)" | tee -a "$LOG_FILE"
    return 0
}

# 验证目录结构
validate_directory_structure() {
    echo "验证目录结构..." | tee -a "$LOG_FILE"
    
    local missing_tests=()
    local missing_sections=()
    
    # 检查测试目录
    for test in "${REQUIRED_TESTS[@]}"; do
        if [[ ! -d "$AUDIO_DIR/$test" ]]; then
            missing_tests+=("$test")
        else
            # 检查section文件
            for section in "${REQUIRED_SECTIONS[@]}"; do
                local section_file_found=false
                for ext in "${ALLOWED_FORMATS[@]}"; do
                    if [[ -f "$AUDIO_DIR/$test/${section}.${ext}" ]]; then
                        section_file_found=true
                        break
                    fi
                done
                
                if [[ "$section_file_found" != true ]]; then
                    missing_sections+=("$test/$section")
                fi
            done
        fi
    done
    
    # 报告缺失的测试
    if [[ ${#missing_tests[@]} -gt 0 ]]; then
        echo "❌ 缺失的测试目录: ${missing_tests[*]}" | tee -a "$LOG_FILE"
    fi
    
    # 报告缺失的section
    if [[ ${#missing_sections[@]} -gt 0 ]]; then
        echo "❌ 缺失的音频文件: ${missing_sections[*]}" | tee -a "$LOG_FILE"
    fi
    
    if [[ ${#missing_tests[@]} -eq 0 && ${#missing_sections[@]} -eq 0 ]]; then
        echo "✓ 目录结构完整" | tee -a "$LOG_FILE"
        return 0
    else
        return 1
    fi
}

# 验证音频文件完整性
validate_audio_integrity() {
    local file="$1"
    
    # 尝试解码音频文件的前几秒和最后几秒
    local temp_output="/tmp/audio_test_$$"
    
    # 测试前5秒
    if ! ffmpeg -v quiet -i "$file" -t 5 -f null - 2>/dev/null; then
        echo "❌ 音频文件开头损坏: $file" | tee -a "$LOG_FILE"
        return 1
    fi
    
    # 测试最后5秒
    if ! ffmpeg -v quiet -i "$file" -ss -5 -f null - 2>/dev/null; then
        echo "❌ 音频文件结尾损坏: $file" | tee -a "$LOG_FILE"
        return 1
    fi
    
    echo "✓ 音频文件完整性验证通过: $file" | tee -a "$LOG_FILE"
    return 0
}

# 生成音频文件统计信息
generate_audio_stats() {
    echo "生成音频文件统计信息..." | tee -a "$LOG_FILE"
    
    local total_files=0
    local total_size=0
    local total_duration=0
    local stats_file="audio-stats.json"
    
    echo "{" > "$stats_file"
    echo '  "validation_timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",' >> "$stats_file"
    echo '  "tests": {' >> "$stats_file"
    
    local first_test=true
    
    for test in "${REQUIRED_TESTS[@]}"; do
        if [[ -d "$AUDIO_DIR/$test" ]]; then
            if [[ "$first_test" != true ]]; then
                echo ',' >> "$stats_file"
            fi
            first_test=false
            
            echo "    \"$test\": {" >> "$stats_file"
            echo '      "sections": {' >> "$stats_file"
            
            local first_section=true
            local test_duration=0
            local test_size=0
            
            for section in "${REQUIRED_SECTIONS[@]}"; do
                for ext in "${ALLOWED_FORMATS[@]}"; do
                    local file_path="$AUDIO_DIR/$test/${section}.${ext}"
                    if [[ -f "$file_path" ]]; then
                        if [[ "$first_section" != true ]]; then
                            echo ',' >> "$stats_file"
                        fi
                        first_section=false
                        
                        local duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$file_path" 2>/dev/null || echo "0")
                        local size=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path" 2>/dev/null || echo "0")
                        local bitrate=$(ffprobe -v quiet -show_entries format=bit_rate -of csv=p=0 "$file_path" 2>/dev/null || echo "0")
                        
                        echo "        \"$section\": {" >> "$stats_file"
                        echo "          \"file\": \"$file_path\"," >> "$stats_file"
                        echo "          \"duration\": $duration," >> "$stats_file"
                        echo "          \"size\": $size," >> "$stats_file"
                        echo "          \"bitrate\": $bitrate," >> "$stats_file"
                        echo "          \"format\": \"$ext\"" >> "$stats_file"
                        echo "        }" >> "$stats_file"
                        
                        total_files=$((total_files + 1))
                        total_size=$((total_size + size))
                        test_duration=$(echo "$test_duration + $duration" | bc -l 2>/dev/null || echo "$test_duration")
                        
                        break
                    fi
                done
            done
            
            total_duration=$(echo "$total_duration + $test_duration" | bc -l 2>/dev/null || echo "$total_duration")
            
            echo '' >> "$stats_file"
            echo '      },' >> "$stats_file"
            echo "      \"total_duration\": $test_duration," >> "$stats_file"
            echo "      \"total_size\": $test_size" >> "$stats_file"
            echo "    }" >> "$stats_file"
        fi
    done
    
    echo '' >> "$stats_file"
    echo '  },' >> "$stats_file"
    echo "  \"summary\": {" >> "$stats_file"
    echo "    \"total_files\": $total_files," >> "$stats_file"
    echo "    \"total_size\": $total_size," >> "$stats_file"
    echo "    \"total_duration\": $total_duration," >> "$stats_file"
    echo "    \"average_file_size\": $((total_files > 0 ? total_size / total_files : 0))" >> "$stats_file"
    echo "  }" >> "$stats_file"
    echo "}" >> "$stats_file"
    
    echo "✓ 统计信息已生成: $stats_file" | tee -a "$LOG_FILE"
    
    # 显示摘要
    echo "音频文件摘要:" | tee -a "$LOG_FILE"
    echo "  - 总文件数: $total_files" | tee -a "$LOG_FILE"
    echo "  - 总大小: $(( total_size / 1024 / 1024 ))MB" | tee -a "$LOG_FILE"
    echo "  - 总时长: ${total_duration}秒" | tee -a "$LOG_FILE"
}

# 主验证流程
main() {
    echo "开始音频文件验证..." | tee -a "$LOG_FILE"
    
    check_dependencies
    
    if [[ ! -d "$AUDIO_DIR" ]]; then
        echo "错误: 音频目录不存在: $AUDIO_DIR" | tee -a "$LOG_FILE"
        exit 1
    fi
    
    # 验证目录结构
    validate_directory_structure
    local structure_valid=$?
    
    # 验证所有音频文件
    local files_valid=0
    local files_total=0
    
    echo "验证音频文件..." | tee -a "$LOG_FILE"
    
    while IFS= read -r -d '' file; do
        files_total=$((files_total + 1))
        echo "处理文件: $file" | tee -a "$LOG_FILE"
        
        if validate_file_size "$file" && \
           validate_audio_format "$file" && \
           validate_audio_integrity "$file"; then
            files_valid=$((files_valid + 1))
        fi
        
        echo "" | tee -a "$LOG_FILE"
    done < <(find "$AUDIO_DIR" -type f \( -name "*.mp3" -o -name "*.m4a" -o -name "*.wav" -o -name "*.ogg" \) -print0)
    
    # 生成统计信息
    generate_audio_stats
    
    # 输出验证结果
    echo "=== 验证结果 ===" | tee -a "$LOG_FILE"
    echo "目录结构: $([ $structure_valid -eq 0 ] && echo "✓ 通过" || echo "❌ 失败")" | tee -a "$LOG_FILE"
    echo "音频文件: $files_valid/$files_total 通过" | tee -a "$LOG_FILE"
    
    if [[ $structure_valid -eq 0 && $files_valid -eq $files_total ]]; then
        echo "🎉 所有验证通过！" | tee -a "$LOG_FILE"
        exit 0
    else
        echo "❌ 验证失败，请检查上述错误" | tee -a "$LOG_FILE"
        exit 1
    fi
}

# 执行主流程
main "$@"