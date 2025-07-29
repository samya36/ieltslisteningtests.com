#!/bin/bash

# 智能音频优化脚本
# 压缩大音频文件，优化网页加载性能

AUDIO_DIR="/Users/jackyan/Desktop/03_代码项目/Code/雅思网站/audio"
MAX_SIZE_MB=5
TARGET_BITRATE="128k"
BACKUP_DIR="$AUDIO_DIR/original_backup"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 日志文件
LOG_FILE="audio_optimization_$(date +%Y%m%d_%H%M%S).log"

echo "=== 音频优化开始 ===" | tee "$LOG_FILE"
echo "目标: 将大于 ${MAX_SIZE_MB}MB 的音频文件压缩到 ${TARGET_BITRATE} 比特率" | tee -a "$LOG_FILE"
echo "时间: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 检查ffmpeg是否安装
if ! command -v ffmpeg &> /dev/null; then
    echo "错误: 未找到 ffmpeg，请先安装 ffmpeg" | tee -a "$LOG_FILE"
    echo "安装命令: brew install ffmpeg" | tee -a "$LOG_FILE"
    exit 1
fi

# 统计变量
total_files=0
processed_files=0
total_saved_mb=0

# 查找并处理大音频文件
find "$AUDIO_DIR" -name "*.mp3" -o -name "*.m4a" | while read -r file; do
    # 跳过备份目录
    if [[ "$file" == *"/original_backup/"* ]]; then
        continue
    fi
    
    total_files=$((total_files + 1))
    
    # 获取文件大小 (MB)
    size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_mb=$((size_bytes / 1024 / 1024))
    
    if [ "$size_mb" -gt "$MAX_SIZE_MB" ]; then
        echo "处理文件: $file (${size_mb}MB)" | tee -a "$LOG_FILE"
        
        # 创建备份
        backup_file="$BACKUP_DIR/$(basename "$file")"
        if [ ! -f "$backup_file" ]; then
            cp "$file" "$backup_file"
            echo "  已备份到: $backup_file" | tee -a "$LOG_FILE"
        fi
        
        # 创建临时文件
        temp_file="${file}.temp.mp3"
        
        # 使用ffmpeg压缩
        echo "  压缩中..." | tee -a "$LOG_FILE"
        if ffmpeg -i "$file" -ab "$TARGET_BITRATE" -ar 44100 -ac 2 -y "$temp_file" 2>/dev/null; then
            # 获取压缩后大小
            new_size_bytes=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null)
            new_size_mb=$((new_size_bytes / 1024 / 1024))
            saved_mb=$((size_mb - new_size_mb))
            
            # 如果压缩效果显著，替换原文件
            if [ "$saved_mb" -gt 1 ]; then
                mv "$temp_file" "$file"
                echo "  ✓ 压缩成功: ${size_mb}MB → ${new_size_mb}MB (节省 ${saved_mb}MB)" | tee -a "$LOG_FILE"
                processed_files=$((processed_files + 1))
                total_saved_mb=$((total_saved_mb + saved_mb))
            else
                rm "$temp_file"
                echo "  - 跳过: 压缩效果不明显" | tee -a "$LOG_FILE"
            fi
        else
            echo "  ✗ 压缩失败" | tee -a "$LOG_FILE"
            rm -f "$temp_file"
        fi
        
        echo "" | tee -a "$LOG_FILE"
    fi
done

echo "=== 优化完成 ===" | tee -a "$LOG_FILE"
echo "总文件数: $total_files" | tee -a "$LOG_FILE"
echo "处理文件数: $processed_files" | tee -a "$LOG_FILE"
echo "总节省空间: ${total_saved_mb}MB" | tee -a "$LOG_FILE"
echo "备份位置: $BACKUP_DIR" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 生成优化后的文件列表
echo "=== 当前音频文件大小 ===" | tee -a "$LOG_FILE"
find "$AUDIO_DIR" -name "*.mp3" -o -name "*.m4a" | grep -v "/original_backup/" | while read -r file; do
    size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_mb=$((size_bytes / 1024 / 1024))
    echo "$(basename "$file"): ${size_mb}MB" | tee -a "$LOG_FILE"
done

echo "优化日志已保存到: $LOG_FILE"