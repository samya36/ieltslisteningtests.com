#!/usr/bin/env node

/**
 * 安全头验证工具
 * 检查所有HTML文件是否正确配置了安全HTTP头
 */

const fs = require('fs');
const path = require('path');

// 安全头检查配置
const SECURITY_CHECKS = {
    'Content-Security-Policy': {
        required: true,
        description: '内容安全策略 - 防止XSS和代码注入',
        patterns: [
            /default-src\s+[^;]+/,
            /script-src\s+[^;]+/,
            /style-src\s+[^;]+/
        ]
    },
    'X-Frame-Options': {
        required: true,
        description: '防止点击劫持攻击',
        values: ['DENY', 'SAMEORIGIN']
    },
    'X-Content-Type-Options': {
        required: true,
        description: '防止MIME类型嗅探',
        values: ['nosniff']
    },
    'Referrer-Policy': {
        required: true,
        description: '控制引用信息泄露',
        values: ['strict-origin-when-cross-origin', 'no-referrer', 'same-origin']
    },
    'X-XSS-Protection': {
        required: true,
        description: 'XSS过滤器（向后兼容）',
        values: ['1; mode=block', '0']
    },
    'Permissions-Policy': {
        required: false,
        description: '控制浏览器功能权限',
        patterns: [/geolocation=\(\)/, /microphone=\(\)/, /camera=\(\)/]
    }
};

/**
 * 检查单个HTML文件的安全头
 */
function checkSecurityHeaders(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const results = {
            file: filePath,
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };

        Object.entries(SECURITY_CHECKS).forEach(([header, config]) => {
            const check = checkHeader(content, header, config);
            results.details.push(check);
            
            if (check.status === 'pass') {
                results.passed++;
            } else if (check.status === 'fail') {
                results.failed++;
            } else {
                results.warnings++;
            }
        });

        // 检查CDN资源的SRI
        const sriCheck = checkSubresourceIntegrity(content);
        results.details.push(sriCheck);
        
        if (sriCheck.status === 'pass') {
            results.passed++;
        } else if (sriCheck.status === 'fail') {
            results.failed++;
        } else {
            results.warnings++;
        }

        return results;
    } catch (error) {
        return {
            file: filePath,
            error: error.message,
            passed: 0,
            failed: 1,
            warnings: 0,
            details: [{
                header: 'File Error',
                status: 'fail',
                message: `无法读取文件: ${error.message}`
            }]
        };
    }
}

/**
 * 检查特定安全头
 */
function checkHeader(content, headerName, config) {
    const headerRegex = new RegExp(`<meta[^>]+http-equiv=["']${headerName}["'][^>]*>`, 'i');
    const match = content.match(headerRegex);

    if (!match) {
        return {
            header: headerName,
            status: config.required ? 'fail' : 'warning',
            message: config.required ? '❌ 缺少必需的安全头' : '⚠️  建议添加此安全头',
            description: config.description
        };
    }

    const headerContent = match[0];
    
    // 检查值是否符合要求
    if (config.values) {
        const hasValidValue = config.values.some(value => 
            headerContent.includes(value)
        );
        
        if (!hasValidValue) {
            return {
                header: headerName,
                status: 'warning',
                message: `⚠️  值可能不正确，建议使用: ${config.values.join(' 或 ')}`,
                description: config.description
            };
        }
    }

    // 检查模式匹配
    if (config.patterns) {
        const contentAttr = headerContent.match(/content=["']([^"']+)["']/);
        if (contentAttr) {
            const allPatternsMatch = config.patterns.every(pattern =>
                pattern.test(contentAttr[1])
            );
            
            if (!allPatternsMatch) {
                return {
                    header: headerName,
                    status: 'warning',
                    message: '⚠️  配置可能不完整',
                    description: config.description
                };
            }
        }
    }

    return {
        header: headerName,
        status: 'pass',
        message: '✅ 配置正确',
        description: config.description
    };
}

/**
 * 检查子资源完整性(SRI)
 */
function checkSubresourceIntegrity(content) {
    const cdnLinks = content.match(/<link[^>]+href=["']https:\/\/[^"']+["'][^>]*>/g) || [];
    const scriptTags = content.match(/<script[^>]+src=["']https:\/\/[^"']+["'][^>]*>/g) || [];
    
    const externalResources = [...cdnLinks, ...scriptTags];
    
    if (externalResources.length === 0) {
        return {
            header: 'Subresource Integrity',
            status: 'pass',
            message: '✅ 无外部资源或已正确配置',
            description: '子资源完整性检查'
        };
    }

    const resourcesWithoutSRI = externalResources.filter(resource => 
        !resource.includes('integrity=')
    );

    if (resourcesWithoutSRI.length > 0) {
        return {
            header: 'Subresource Integrity',
            status: 'warning',
            message: `⚠️  发现 ${resourcesWithoutSRI.length} 个外部资源未配置SRI`,
            description: '子资源完整性检查',
            details: resourcesWithoutSRI.map(resource => {
                const urlMatch = resource.match(/href=["']([^"']+)["']|src=["']([^"']+)["']/);
                return urlMatch ? (urlMatch[1] || urlMatch[2]) : 'Unknown URL';
            })
        };
    }

    return {
        header: 'Subresource Integrity',
        status: 'pass',
        message: '✅ 所有外部资源均已配置SRI',
        description: '子资源完整性检查'
    };
}

/**
 * 生成安全报告
 */
function generateSecurityReport(results) {
    console.log('🔒 雅思听力测试网站安全头检查报告');
    console.log('=' .repeat(50));
    console.log();

    let totalPassed = 0;
    let totalFailed = 0;
    let totalWarnings = 0;

    results.forEach(result => {
        const status = result.failed > 0 ? '❌' : 
                      result.warnings > 0 ? '⚠️ ' : '✅';
        
        console.log(`${status} ${result.file}`);
        
        if (result.error) {
            console.log(`   错误: ${result.error}`);
        } else {
            console.log(`   通过: ${result.passed}, 失败: ${result.failed}, 警告: ${result.warnings}`);
            
            // 显示失败和警告的详情
            result.details.forEach(detail => {
                if (detail.status !== 'pass') {
                    console.log(`   ${detail.message} (${detail.header})`);
                    if (detail.details) {
                        detail.details.forEach(d => console.log(`     - ${d}`));
                    }
                }
            });
        }
        
        console.log();
        
        totalPassed += result.passed;
        totalFailed += result.failed;
        totalWarnings += result.warnings;
    });

    // 总体统计
    console.log('📊 总体统计:');
    console.log(`   文件数量: ${results.length}`);
    console.log(`   通过检查: ${totalPassed}`);
    console.log(`   失败检查: ${totalFailed}`);
    console.log(`   警告项目: ${totalWarnings}`);
    
    const totalChecks = totalPassed + totalFailed + totalWarnings;
    const successRate = totalChecks > 0 ? ((totalPassed / totalChecks) * 100).toFixed(1) : 0;
    console.log(`   成功率: ${successRate}%`);

    // 安全建议
    console.log();
    console.log('💡 安全建议:');
    
    if (totalFailed > 0) {
        console.log('   1. 立即修复失败的安全头配置');
    }
    
    if (totalWarnings > 0) {
        console.log('   2. 检查并优化警告项目');
    }
    
    console.log('   3. 定期运行此工具检查安全配置');
    console.log('   4. 考虑在服务器级别配置安全头作为额外保护');
}

/**
 * 主函数
 */
function main() {
    // 查找所有HTML文件
    const htmlFiles = [
        'index.html',
        'pages/test.html',
        'pages/test2.html', 
        'pages/test3.html',
        'pages/scoring.html',
        'pages/practice.html'
    ].filter(file => {
        try {
            fs.accessSync(file, fs.constants.F_OK);
            return true;
        } catch {
            return false;
        }
    });

    if (htmlFiles.length === 0) {
        console.error('❌ 未找到HTML文件，请在项目根目录运行此脚本');
        return;
    }

    // 检查每个文件
    const results = htmlFiles.map(checkSecurityHeaders);
    
    // 生成报告
    generateSecurityReport(results);
}

// 运行检查
main();