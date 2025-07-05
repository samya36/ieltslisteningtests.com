#!/bin/bash

# 雅思网站音频压缩脚本 (智能检测文件格式)
# 此脚本将压缩所有音频文件以减少项目大小

echo "开始音频压缩 (智能格式检测)..."
echo "================================================"

# 创建压缩日志文件
LOG_FILE="compression_log.txt"
echo "音频压缩日志 - $(date)" > "$LOG_FILE"

# 计数器
TOTAL_FILES=0
COMPRESSED_FILES=0
FAILED_FILES=0

# 压缩函数
compress_audio() {
    local input_file="$1"
    local output_file="$2"
    
    echo "压缩: $(basename "$input_file")"
    
    # 检测文件实际格式
    FILE_TYPE=$(file "$input_file" | grep -i "mp4\|m4a\|aac")
    
    if [ -n "$FILE_TYPE" ]; then
        # 如果是MP4/M4A格式，使用afconvert
        if afconvert -f mp4f -d aac -b 64000 "$input_file" "$output_file" 2>>"$LOG_FILE"; then
            echo "✅ 成功压缩: $(basename "$input_file")" | tee -a "$LOG_FILE"
            COMPRESSED_FILES=$((COMPRESSED_FILES + 1))
            
            # 显示压缩前后大小
            ORIGINAL_SIZE=$(stat -f%z "$input_file" 2>/dev/null || echo "0")
            COMPRESSED_SIZE=$(stat -f%z "$output_file" 2>/dev/null || echo "0")
            
            if [ "$ORIGINAL_SIZE" -gt 0 ] && [ "$COMPRESSED_SIZE" -gt 0 ]; then
                REDUCTION=$((100 - (COMPRESSED_SIZE * 100 / ORIGINAL_SIZE)))
                echo "   原大小: $(echo $ORIGINAL_SIZE | awk '{printf "%.1f MB", $1/1024/1024}')"
                echo "   新大小: $(echo $COMPRESSED_SIZE | awk '{printf "%.1f MB", $1/1024/1024}')"
                echo "   压缩率: ${REDUCTION}%"
            fi
            
            # 创建备份并替换原文件
            mv "$input_file" "${input_file}.bak"
            mv "$output_file" "$input_file"
            
            return 0
        else
            echo "❌ 压缩失败: $(basename "$input_file")" | tee -a "$LOG_FILE"
            FAILED_FILES=$((FAILED_FILES + 1))
            rm -f "$output_file"
            return 1
        fi
    else
        echo "⚠️  跳过不支持的格式: $(basename "$input_file")"
        return 1
    fi
}

# 处理剑桥雅思20系列文件 (大文件)
echo "处理剑桥雅思20系列文件..."
find "./剑桥雅思20" -type f -name "*.mp3" | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        # 检查文件大小，只压缩大于10MB的文件
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || echo "0")
        if [ "$FILE_SIZE" -gt 10485760 ]; then
            temp_file="${file%.mp3}_temp.m4a"
            compress_audio "$file" "$temp_file"
        else
            echo "跳过小文件: $(basename "$file")"
        fi
    fi
done

# 处理audio目录中的m4a文件
echo "处理audio目录中的m4a文件..."
find "./audio" -type f -name "*.m4a" | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        # 检查文件大小，只压缩大于1MB的文件
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || echo "0")
        if [ "$FILE_SIZE" -gt 1048576 ]; then
            temp_file="${file%.m4a}_temp.m4a"
            compress_audio "$file" "$temp_file"
        else
            echo "跳过小文件: $(basename "$file")"
        fi
    fi
done

echo "================================================"
echo "压缩完成!"
echo "成功压缩: $COMPRESSED_FILES"
echo "失败文件: $FAILED_FILES"
echo "详细日志: $LOG_FILE"
echo "================================================"

# 计算压缩后的总大小
echo "计算压缩后的项目大小..."
NEW_SIZE=$(du -sh . | awk '{print $1}')
echo "压缩后项目大小: $NEW_SIZE"