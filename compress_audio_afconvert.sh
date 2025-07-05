#!/bin/bash

# 雅思网站音频压缩脚本 (使用macOS系统自带的afconvert)
# 此脚本将压缩所有音频文件以减少项目大小

echo "开始音频压缩 (使用afconvert)..."
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
    
    echo "压缩: $input_file -> $output_file"
    
    # 使用afconvert压缩音频 (AAC 64kbps)
    if afconvert -f mp4f -d aac -b 64000 "$input_file" "$output_file" 2>>"$LOG_FILE"; then
        echo "✅ 成功压缩: $input_file" | tee -a "$LOG_FILE"
        COMPRESSED_FILES=$((COMPRESSED_FILES + 1))
        
        # 显示压缩前后大小
        ORIGINAL_SIZE=$(stat -f%z "$input_file" 2>/dev/null || echo "0")
        COMPRESSED_SIZE=$(stat -f%z "$output_file" 2>/dev/null || echo "0")
        
        if [ "$ORIGINAL_SIZE" -gt 0 ] && [ "$COMPRESSED_SIZE" -gt 0 ]; then
            REDUCTION=$((100 - (COMPRESSED_SIZE * 100 / ORIGINAL_SIZE)))
            echo "   原大小: $(echo $ORIGINAL_SIZE | awk '{print $1/1024/1024 " MB"}')"
            echo "   新大小: $(echo $COMPRESSED_SIZE | awk '{print $1/1024/1024 " MB"}')"
            echo "   压缩率: ${REDUCTION}%"
        fi
        
        # 替换原文件 (改为m4a扩展名)
        mv "$input_file" "${input_file}.bak"
        mv "$output_file" "${input_file%.*}.m4a"
        
    else
        echo "❌ 压缩失败: $input_file" | tee -a "$LOG_FILE"
        FAILED_FILES=$((FAILED_FILES + 1))
        # 删除失败的输出文件
        rm -f "$output_file"
    fi
    
    echo "----------------------------------------"
}

# 处理剑桥雅思20系列文件 (大文件)
echo "处理剑桥雅思20系列文件..."
find "./剑桥雅思20" -type f -name "*.mp3" | head -5 | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        temp_file="${file%.mp3}_compressed.m4a"
        compress_audio "$file" "$temp_file"
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