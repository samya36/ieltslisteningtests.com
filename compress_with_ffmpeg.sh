#!/bin/bash

# 使用ffmpeg压缩剑桥雅思20系列音频文件
echo "开始使用ffmpeg压缩音频文件..."
echo "================================================"

# 创建日志文件
LOG_FILE="ffmpeg_compression_log.txt"
echo "ffmpeg压缩日志 - $(date)" > "$LOG_FILE"

# 计数器
TOTAL_FILES=0
COMPRESSED_FILES=0
FAILED_FILES=0
TOTAL_SAVED=0

# 压缩函数
compress_audio() {
    local input_file="$1"
    local bitrate="$2"
    
    echo "压缩: $(basename "$input_file")"
    
    # 创建临时输出文件
    local temp_file="${input_file%.*}_temp.mp3"
    
    # 获取原始文件大小
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || echo "0")
    
    # 使用ffmpeg压缩
    if ffmpeg -i "$input_file" -b:a "$bitrate" -ar 44100 -ac 2 "$temp_file" -y 2>>"$LOG_FILE"; then
        # 获取压缩后文件大小
        local compressed_size=$(stat -f%z "$temp_file" 2>/dev/null || echo "0")
        
        if [ "$compressed_size" -gt 0 ]; then
            echo "✅ 成功压缩: $(basename "$input_file")" | tee -a "$LOG_FILE"
            COMPRESSED_FILES=$((COMPRESSED_FILES + 1))
            
            # 计算压缩效果
            local reduction=$((100 - (compressed_size * 100 / original_size)))
            local saved_mb=$(((original_size - compressed_size) / 1024 / 1024))
            TOTAL_SAVED=$((TOTAL_SAVED + saved_mb))
            
            echo "   原大小: $(echo $original_size | awk '{printf "%.1f MB", $1/1024/1024}')"
            echo "   新大小: $(echo $compressed_size | awk '{printf "%.1f MB", $1/1024/1024}')"
            echo "   压缩率: ${reduction}%"
            echo "   节省: ${saved_mb}MB"
            
            # 替换原文件
            mv "$input_file" "${input_file}.bak"
            mv "$temp_file" "$input_file"
            
            return 0
        else
            echo "❌ 压缩后文件为空: $(basename "$input_file")" | tee -a "$LOG_FILE"
            rm -f "$temp_file"
            return 1
        fi
    else
        echo "❌ 压缩失败: $(basename "$input_file")" | tee -a "$LOG_FILE"
        FAILED_FILES=$((FAILED_FILES + 1))
        rm -f "$temp_file"
        return 1
    fi
}

# 处理剑桥雅思20系列文件
echo "处理剑桥雅思20系列文件..."
find "./剑桥雅思20" -type f -name "*.mp3" | while read -r file; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        # 检查文件大小，只压缩大于10MB的文件
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || echo "0")
        if [ "$FILE_SIZE" -gt 10485760 ]; then
            echo "----------------------------------------"
            compress_audio "$file" "64k"
        else
            echo "跳过小文件: $(basename "$file")"
        fi
    fi
done

echo "================================================"
echo "压缩完成!"
echo "总处理文件数: $TOTAL_FILES"
echo "成功压缩: $COMPRESSED_FILES"
echo "失败文件: $FAILED_FILES"
echo "总节省空间: ${TOTAL_SAVED}MB"
echo "详细日志: $LOG_FILE"
echo "================================================"

# 计算最终项目大小
echo "计算最终项目大小..."
FINAL_SIZE=$(du -sh . | awk '{print $1}')
echo "最终项目大小: $FINAL_SIZE"

# 检查是否达到1GB目标
FINAL_SIZE_GB=$(du -s . | awk '{print $1/1024/1024}')
if (( $(echo "$FINAL_SIZE_GB < 1" | bc -l) )); then
    echo "🎉 成功! 项目大小已控制在1GB以下"
else
    echo "⚠️  项目大小仍为 ${FINAL_SIZE_GB}GB，超过1GB目标"
fi