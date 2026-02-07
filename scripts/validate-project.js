#!/usr/bin/env node

/**
 * 项目验证脚本
 * 检查项目完整性、文件引用、性能指标等
 */

const fs = require('fs').promises;
const path = require('path');
const util = require('util');

class ProjectValidator {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.issues = [];
        this.warnings = [];
        this.stats = {
            totalFiles: 0,
            htmlFiles: 0,
            jsFiles: 0,
            cssFiles: 0,
            audioFiles: 0,
            imageFiles: 0,
            totalSize: 0
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} ${message}`);
    }

    addIssue(message) {
        this.issues.push(message);
        this.log(message, 'error');
    }

    addWarning(message) {
        this.warnings.push(message);
        this.log(message, 'warning');
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    async validateFileReferences(filePath, content) {
        const fileName = path.basename(filePath);
        
        // 检查图片引用
        const imageRefs = content.match(/(?:src|href)=["']([^"']*\.(png|jpg|jpeg|gif|webp|svg))["']/gi);
        if (imageRefs) {
            for (const match of imageRefs) {
                const srcMatch = match.match(/["']([^"']*)["']/);
                if (srcMatch) {
                    const imagePath = srcMatch[1];
                    const absolutePath = path.resolve(path.dirname(filePath), imagePath);
                    
                    if (!(await this.fileExists(absolutePath))) {
                        this.addIssue(`${fileName}: 图片文件不存在: ${imagePath}`);
                    }
                }
            }
        }
        
        // 检查脚本引用
        const scriptRefs = content.match(/<script[^>]*src=["']([^"']*)["'][^>]*>/gi);
        if (scriptRefs) {
            for (const match of scriptRefs) {
                const srcMatch = match.match(/src=["']([^"']*)["']/);
                if (srcMatch) {
                    const scriptPath = srcMatch[1];
                    // 跳过外部链接
                    if (!scriptPath.startsWith('http')) {
                        const absolutePath = path.resolve(path.dirname(filePath), scriptPath);
                        
                        if (!(await this.fileExists(absolutePath))) {
                            this.addIssue(`${fileName}: 脚本文件不存在: ${scriptPath}`);
                        }
                    }
                }
            }
        }
        
        // 检查样式表引用
        const cssRefs = content.match(/<link[^>]*href=["']([^"']*\.css)["'][^>]*>/gi);
        if (cssRefs) {
            for (const match of cssRefs) {
                const hrefMatch = match.match(/href=["']([^"']*)["']/);
                if (hrefMatch) {
                    const cssPath = hrefMatch[1];
                    // 跳过外部链接
                    if (!cssPath.startsWith('http')) {
                        const absolutePath = path.resolve(path.dirname(filePath), cssPath);
                        
                        if (!(await this.fileExists(absolutePath))) {
                            this.addIssue(`${fileName}: 样式表文件不存在: ${cssPath}`);
                        }
                    }
                }
            }
        }
    }

    async validateJavaScript(filePath, content) {
        const fileName = path.basename(filePath);
        
        // 检查语法错误（简单检查）
        if (content.includes('console.log') && !content.includes('// console.log')) {
            this.addWarning(`${fileName}: 包含未注释的console.log语句`);
        }
        
        // 检查未定义变量（简单检查）
        const commonGlobals = ['window', 'document', 'console', 'TEST_DATA', 'ANSWERS'];
        const undefinedVars = content.match(/\b[A-Z_][A-Z_0-9]*\b/g);
        if (undefinedVars) {
            for (const variable of new Set(undefinedVars)) {
                if (!commonGlobals.includes(variable) && 
                    !content.includes(`var ${variable}`) && 
                    !content.includes(`let ${variable}`) && 
                    !content.includes(`const ${variable}`) &&
                    !content.includes(`window.${variable}`)) {
                    // 这只是一个简单的检查，可能有误报
                    // this.addWarning(`${fileName}: 可能的未定义变量: ${variable}`);
                }
            }
        }
    }

    async scanDirectory(dir, extensions = []) {
        const files = [];
        
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && 
                    !entry.name.startsWith('.') && 
                    !['node_modules', 'dist', 'logs', 'audio_backups'].includes(entry.name)) {
                    const subFiles = await this.scanDirectory(fullPath, extensions);
                    files.push(...subFiles);
                } else if (entry.isFile()) {
                    if (extensions.length === 0 || 
                        extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            this.addWarning(`无法扫描目录: ${dir} - ${error.message}`);
        }
        
        return files;
    }

    async validateProject() {
        this.log('🚀 开始项目验证...');
        
        // 检查必要文件
        const requiredFiles = [
            'index.html',
            'package.json',
            'vite.config.js',
            'audio-optimizer.sh'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.rootDir, file);
            if (!(await this.fileExists(filePath))) {
                this.addIssue(`缺少必要文件: ${file}`);
            }
        }
        
        // 扫描所有文件
        this.log('📁 扫描项目文件...');
        const allFiles = await this.scanDirectory(this.rootDir);
        this.stats.totalFiles = allFiles.length;
        
        for (const filePath of allFiles) {
            const ext = path.extname(filePath).toLowerCase();
            const size = await this.getFileSize(filePath);
            this.stats.totalSize += size;
            
            // 分类统计
            if (ext === '.html') this.stats.htmlFiles++;
            else if (ext === '.js') this.stats.jsFiles++;
            else if (ext === '.css') this.stats.cssFiles++;
            else if (['.mp3', '.m4a'].includes(ext)) this.stats.audioFiles++;
            else if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) this.stats.imageFiles++;
        }
        
        // 验证HTML文件
        this.log('🔍 验证HTML文件...');
        const htmlFiles = await this.scanDirectory(this.rootDir, ['.html']);
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = await fs.readFile(htmlFile, 'utf8');
                await this.validateFileReferences(htmlFile, content);
                
                // 检查HTML特定问题
                if (!content.includes('DOCTYPE html')) {
                    this.addWarning(`${path.basename(htmlFile)}: 缺少DOCTYPE声明`);
                }
                
                if (!content.includes('<meta charset=')) {
                    this.addWarning(`${path.basename(htmlFile)}: 缺少字符编码声明`);
                }
            } catch (error) {
                this.addIssue(`无法读取HTML文件: ${htmlFile} - ${error.message}`);
            }
        }
        
        // 验证JavaScript文件
        this.log('🔍 验证JavaScript文件...');
        const jsFiles = await this.scanDirectory(path.join(this.rootDir, 'js'), ['.js']);
        
        for (const jsFile of jsFiles) {
            try {
                const content = await fs.readFile(jsFile, 'utf8');
                await this.validateJavaScript(jsFile, content);
            } catch (error) {
                this.addIssue(`无法读取JavaScript文件: ${jsFile} - ${error.message}`);
            }
        }
        
        // 检查大文件
        this.log('📏 检查文件大小...');
        const largeFileThreshold = 5 * 1024 * 1024; // 5MB
        
        for (const filePath of allFiles) {
            const size = await this.getFileSize(filePath);
            if (size > largeFileThreshold) {
                this.addWarning(`大文件警告: ${path.basename(filePath)} (${(size / 1024 / 1024).toFixed(2)}MB)`);
            }
        }
        
        // 生成报告
        this.generateReport();
    }

    generateReport() {
        const totalSizeMB = (this.stats.totalSize / (1024 * 1024)).toFixed(2);
        
        console.log('\n==================== 项目验证报告 ====================');
        console.log(`📊 文件统计:`);
        console.log(`   总文件数: ${this.stats.totalFiles}`);
        console.log(`   HTML文件: ${this.stats.htmlFiles}`);
        console.log(`   JavaScript文件: ${this.stats.jsFiles}`);
        console.log(`   CSS文件: ${this.stats.cssFiles}`);
        console.log(`   音频文件: ${this.stats.audioFiles}`);
        console.log(`   图片文件: ${this.stats.imageFiles}`);
        console.log(`   项目总大小: ${totalSizeMB}MB`);
        
        console.log(`\n🔍 验证结果:`);
        console.log(`   错误: ${this.issues.length}个`);
        console.log(`   警告: ${this.warnings.length}个`);
        
        if (this.issues.length > 0) {
            console.log('\n❌ 发现的错误:');
            this.issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  发现的警告:');
            this.warnings.forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning}`);
            });
        }
        
        // 性能建议
        console.log('\n🚀 性能建议:');
        if (totalSizeMB > 100) {
            console.log('   - 项目大小较大，考虑进一步压缩资源');
        }
        if (this.stats.audioFiles > 20) {
            console.log('   - 音频文件较多，建议使用CDN加速');
        }
        if (this.stats.jsFiles > 50) {
            console.log('   - JavaScript文件较多，建议使用模块打包');
        }
        
        console.log('=================================================');
        
        if (this.issues.length === 0) {
            console.log('✅ 验证通过！项目结构良好。');
            process.exit(0);
        } else {
            console.log('❌ 验证失败！请修复上述错误后重试。');
            process.exit(1);
        }
    }
}

// 运行验证
if (require.main === module) {
    const validator = new ProjectValidator();
    validator.validateProject().catch(error => {
        console.error('验证过程出错:', error);
        process.exit(1);
    });
}

module.exports = ProjectValidator;