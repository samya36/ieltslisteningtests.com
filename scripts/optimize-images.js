#!/usr/bin/env node

/**
 * 图片优化脚本
 * 自动将项目中的PNG和JPG图片转换为WebP格式
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// 配置
const CONFIG = {
    inputDir: path.resolve(__dirname, '../images'),
    outputDir: path.resolve(__dirname, '../images'),
    quality: {
        png: 85,
        jpg: 80,
        jpeg: 80
    },
    extensions: ['.png', '.jpg', '.jpeg'],
    excludePatterns: [
        /\.webp$/i,
        /favicon/i,
        /icon-/i
    ],
    logFile: path.resolve(__dirname, '../logs/image-optimization.log')
};

class ImageOptimizer {
    constructor() {
        this.stats = {
            totalFiles: 0,
            processedFiles: 0,
            failedFiles: 0,
            totalSavedBytes: 0,
            startTime: Date.now()
        };
    }

    async log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        
        console.log(message);
        
        try {
            await fs.mkdir(path.dirname(CONFIG.logFile), { recursive: true });
            await fs.appendFile(CONFIG.logFile, logMessage);
        } catch (err) {
            console.warn('日志写入失败:', err.message);
        }
    }

    async checkDependencies() {
        try {
            await execAsync('which cwebp');
            await this.log('✅ cwebp 工具已安装');
            return true;
        } catch (error) {
            await this.log('❌ cwebp 工具未安装');
            await this.log('请安装 webp 工具: brew install webp');
            return false;
        }
    }

    async findImages(dir) {
        const images = [];
        
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    const subImages = await this.findImages(fullPath);
                    images.push(...subImages);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    const shouldExclude = CONFIG.excludePatterns.some(pattern => 
                        pattern.test(entry.name)
                    );
                    
                    if (CONFIG.extensions.includes(ext) && !shouldExclude) {
                        images.push(fullPath);
                    }
                }
            }
        } catch (error) {
            await this.log(`⚠️  读取目录失败: ${dir} - ${error.message}`);
        }
        
        return images;
    }

    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch (error) {
            return 0;
        }
    }

    async convertImage(imagePath) {
        const ext = path.extname(imagePath).toLowerCase();
        const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const quality = CONFIG.quality[ext.substring(1)] || 80;
        
        // 跳过已存在的WebP文件
        try {
            await fs.access(outputPath);
            await this.log(`⏭️  跳过已存在: ${path.basename(outputPath)}`);
            return false;
        } catch (error) {
            // 文件不存在，继续处理
        }
        
        const originalSize = await this.getFileSize(imagePath);
        
        try {
            const command = `cwebp -q ${quality} "${imagePath}" -o "${outputPath}"`;
            const { stdout, stderr } = await execAsync(command);
            
            const newSize = await this.getFileSize(outputPath);
            const savedBytes = originalSize - newSize;
            const compressionRatio = ((savedBytes / originalSize) * 100).toFixed(1);
            
            this.stats.processedFiles++;
            this.stats.totalSavedBytes += savedBytes;
            
            await this.log(`✅ 转换成功: ${path.basename(imagePath)}`);
            await this.log(`   原大小: ${(originalSize / 1024).toFixed(1)}KB`);
            await this.log(`   新大小: ${(newSize / 1024).toFixed(1)}KB`);
            await this.log(`   节省: ${(savedBytes / 1024).toFixed(1)}KB (${compressionRatio}%)`);
            
            return true;
        } catch (error) {
            this.stats.failedFiles++;
            await this.log(`❌ 转换失败: ${path.basename(imagePath)} - ${error.message}`);
            return false;
        }
    }

    async updateReferences(imagePath) {
        const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const relativePath = path.relative(path.resolve(__dirname, '..'), imagePath);
        const webpRelativePath = path.relative(path.resolve(__dirname, '..'), webpPath);
        
        // 这里可以添加自动更新HTML、CSS、JS文件中图片引用的逻辑
        // 目前手动处理比较安全
        
        await this.log(`📝 需要手动更新引用: ${relativePath} -> ${webpRelativePath}`);
    }

    async generateReport() {
        const duration = (Date.now() - this.stats.startTime) / 1000;
        const savedMB = (this.stats.totalSavedBytes / (1024 * 1024)).toFixed(2);
        
        const report = `
==================== 图片优化报告 ====================
处理时间: ${duration.toFixed(2)}秒
总文件数: ${this.stats.totalFiles}
成功转换: ${this.stats.processedFiles}
失败文件: ${this.stats.failedFiles}
总节省空间: ${savedMB}MB
=================================================
        `.trim();
        
        await this.log(report);
        
        // 保存详细报告
        try {
            const reportPath = path.resolve(__dirname, '../logs/optimization-report.txt');
            await fs.writeFile(reportPath, report);
            await this.log(`📊 详细报告已保存: ${reportPath}`);
        } catch (error) {
            await this.log(`⚠️  报告保存失败: ${error.message}`);
        }
    }

    async optimize() {
        await this.log('🚀 开始图片优化...');
        
        // 检查依赖
        if (!(await this.checkDependencies())) {
            process.exit(1);
        }
        
        // 查找图片文件
        await this.log(`🔍 扫描图片文件: ${CONFIG.inputDir}`);
        const images = await this.findImages(CONFIG.inputDir);
        this.stats.totalFiles = images.length;
        
        if (images.length === 0) {
            await this.log('⚠️  未找到需要处理的图片文件');
            return;
        }
        
        await this.log(`📁 找到 ${images.length} 个图片文件`);
        
        // 处理每个图片
        for (const imagePath of images) {
            await this.convertImage(imagePath);
        }
        
        // 生成报告
        await this.generateReport();
        
        await this.log('🎉 图片优化完成!');
    }
}

// 运行优化
if (require.main === module) {
    const optimizer = new ImageOptimizer();
    optimizer.optimize().catch(error => {
        console.error('优化过程出错:', error);
        process.exit(1);
    });
}

module.exports = ImageOptimizer;