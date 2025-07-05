#!/bin/bash

# 雅思网站音频压缩脚本
# 此脚本将压缩所有音频文件以减少项目大小

echo "开始音频压缩..."
echo "================================================"

# 检查ffmpeg是否安装
if ! command -v ffmpeg &> /dev/null; then
    echo "错误: ffmpeg 未安装"
    echo "请先安装ffmpeg: brew install ffmpeg"
    exit 1
fi

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
    local bitrate="$3"
    
    echo "压缩: $input_file -> $output_file (比特率: $bitrate)"
    
    # 使用ffmpeg压缩音频
    if ffmpeg -i "$input_file" -b:a "$bitrate" -ar 44100 -ac 2 "$output_file" -y 2>>"$LOG_FILE"; then
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
        
        # 替换原文件
        mv "$output_file" "$input_file"
        
    else
        echo "❌ 压缩失败: $input_file" | tee -a "$LOG_FILE"
        FAILED_FILES=$((FAILED_FILES + 1))
        # 删除失败的输出文件
        rm -f "$output_file"
    fi
    
    echo "----------------------------------------"
}

# 处理剑桥雅思20系列文件 (大文件，使用64kbps)
echo "处理剑桥雅思20系列文件..."
find "./剑桥雅思20" -type f -name "*.mp3" | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        temp_file="${file%.mp3}_temp.mp3"
        compress_audio "$file" "$temp_file" "64k"
    fi
done

# 处理audio目录中的m4a文件 (使用64kbps)
echo "处理audio目录中的m4a文件..."
find "./audio" -type f -name "*.m4a" | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        temp_file="${file%.m4a}_temp.mp3"
        compress_audio "$file" "$temp_file" "64k"
    fi
done

# 处理audio目录中的mp3文件 (检查文件大小，只压缩大文件)
echo "处理audio目录中的mp3文件..."
find "./audio" -type f -name "*.mp3" | while read -r file; do
    if [ -f "$file" ]; then
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || echo "0")
        # 只压缩大于1MB的文件
        if [ "$FILE_SIZE" -gt 1048576 ]; then
            TOTAL_FILES=$((TOTAL_FILES + 1))
            temp_file="${file%.mp3}_temp.mp3"
            compress_audio "$file" "$temp_file" "64k"
        else
            echo "跳过小文件: $file ($(echo $FILE_SIZE | awk '{print $1/1024 " KB"}'))"
        fi
    fi
done

echo "================================================"
echo "压缩完成!"
echo "总文件数: $TOTAL_FILES"
echo "成功压缩: $COMPRESSED_FILES"
echo "失败文件: $FAILED_FILES"
echo "详细日志: $LOG_FILE"
echo "================================================"

# 计算压缩后的总大小
echo "计算压缩后的项目大小..."
NEW_SIZE=$(du -sh . | awk '{print $1}')
echo "压缩后项目大小: $NEW_SIZE"