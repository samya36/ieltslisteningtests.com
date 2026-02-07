#!/usr/bin/env node

/**
 * 自动为所有HTML文件添加安全HTTP头的脚本
 * 包括CSP、X-Frame-Options、X-Content-Type-Options等
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 安全头模板
const SECURITY_HEADERS = `
    <!-- 安全HTTP头 -->
    <!-- Content Security Policy - 防止XSS攻击和代码注入 -->
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
        style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
        font-src 'self' https://cdnjs.cloudflare.com data:;
        img-src 'self' data: blob:;
        audio-src 'self' data: blob:;
        connect-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    ">
    
    <!-- X-Frame-Options - 防止点击劫持攻击 -->
    <meta http-equiv="X-Frame-Options" content="DENY">
    
    <!-- X-Content-Type-Options - 防止MIME类型嗅探攻击 -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    
    <!-- Referrer Policy - 控制引用信息泄露 -->
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    
    <!-- X-XSS-Protection - 启用XSS过滤器 -->
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    
    <!-- Permissions Policy - 控制浏览器功能权限 -->
    <meta http-equiv="Permissions-Policy" content="
        geolocation=(),
        microphone=(),
        camera=(),
        payment=(),
        usb=(),
        magnetometer=(),
        gyroscope=(),
        accelerometer=()
    ">
    `;

// Font Awesome SRI配置
const FONT_AWESOME_SRI = {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    integrity: 'sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==',
    crossorigin: 'anonymous',
    referrerpolicy: 'no-referrer'
};

/**
 * 为HTML文件添加安全头
 */
function addSecurityHeaders(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否已经有安全头
        if (content.includes('Content-Security-Policy')) {
            console.log(`跳过 ${filePath} - 已包含安全头`);
            return false;
        }
        
        // 在<title>标签后添加安全头
        const titleRegex = /(<title>.*?<\/title>)/;
        if (titleRegex.test(content)) {
            content = content.replace(titleRegex, `$1${SECURITY_HEADERS}`);
            
            // 更新Font Awesome链接为带SRI的版本
            content = updateFontAwesomeWithSRI(content);
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已更新 ${filePath}`);
            return true;
        } else {
            console.log(`⚠️  跳过 ${filePath} - 未找到<title>标签`);
            return false;
        }
    } catch (error) {
        console.error(`❌ 处理 ${filePath} 时出错:`, error.message);
        return false;
    }
}

/**
 * 更新Font Awesome链接为带SRI的版本
 */
function updateFontAwesomeWithSRI(content) {
    const fontAwesomeRegex = /<link[^>]*href=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/5\.15\.4\/css\/all\.min\.css["'][^>]*>/g;
    
    const newFontAwesomeLink = `<link rel="stylesheet" 
          href="${FONT_AWESOME_SRI.url}"
          integrity="${FONT_AWESOME_SRI.integrity}"
          crossorigin="${FONT_AWESOME_SRI.crossorigin}" 
          referrerpolicy="${FONT_AWESOME_SRI.referrerpolicy}">`;
    
    return content.replace(fontAwesomeRegex, newFontAwesomeLink);
}

/**
 * 主函数
 */
function main() {
    console.log('🔒 开始为HTML文件添加安全头...\n');
    
    // 查找所有HTML文件
    const htmlFiles = [
        ...glob.sync('*.html'),
        ...glob.sync('pages/*.html')
    ];
    
    let processedCount = 0;
    let updatedCount = 0;
    
    htmlFiles.forEach(file => {
        processedCount++;
        if (addSecurityHeaders(file)) {
            updatedCount++;
        }
    });
    
    console.log(`\n📊 处理完成:`);
    console.log(`   总文件数: ${processedCount}`);
    console.log(`   已更新: ${updatedCount}`);
    console.log(`   跳过: ${processedCount - updatedCount}`);
    
    // 验证结果
    console.log('\n🔍 验证安全头配置...');
    verifySecurityHeaders(htmlFiles);
}

/**
 * 验证安全头配置
 */
function verifySecurityHeaders(files) {
    const checks = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'X-XSS-Protection'
    ];
    
    files.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const missingHeaders = checks.filter(header => !content.includes(header));
            
            if (missingHeaders.length === 0) {
                console.log(`✅ ${file} - 所有安全头已配置`);
            } else {
                console.log(`⚠️  ${file} - 缺少: ${missingHeaders.join(', ')}`);
            }
        } catch (error) {
            console.error(`❌ 验证 ${file} 时出错:`, error.message);
        }
    });
}

// 检查是否在项目根目录
if (!fs.existsSync('index.html')) {
    console.error('❌ 请在项目根目录运行此脚本');
    process.exit(1);
}

// 运行主函数
main();