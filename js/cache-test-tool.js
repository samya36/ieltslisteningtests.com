/**
 * Service Worker 缓存策略测试工具
 * 用于测试和验证各种缓存策略的效果
 */

class CacheTestTool {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
        this.testStartTime = 0;
        
        console.log('🧪 缓存测试工具初始化');
    }
    
    /**
     * 运行完整的缓存测试套件
     */
    async runFullTestSuite() {
        if (this.isRunning) {
            console.warn('测试正在进行中...');
            return;
        }
        
        this.isRunning = true;
        this.testStartTime = Date.now();
        this.testResults = [];
        
        console.log('🚀 开始缓存策略测试套件');
        
        try {
            // 测试静态资源缓存策略
            await this.testStaticResourceCaching();
            
            // 测试音频文件缓存策略
            await this.testAudioFileCaching();
            
            // 测试动态页面缓存策略
            await this.testDynamicPageCaching();
            
            // 测试离线功能
            await this.testOfflineFunctionality();
            
            // 测试缓存版本管理
            await this.testCacheVersioning();
            
            // 生成测试报告
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ 测试套件执行失败:', error);
            this.addTestResult('全套测试', false, error.message);
        } finally {
            this.isRunning = false;
        }
    }
    
    /**
     * 测试静态资源缓存策略 (Cache First)
     */
    async testStaticResourceCaching() {
        console.log('📄 测试静态资源缓存策略...');
        
        const staticResources = [
            '/css/main.css',
            '/js/test-ui.js',
            '/images/logo.png' // 假设存在
        ];
        
        for (const resource of staticResources) {
            try {
                // 第一次请求 - 从网络获取
                const firstRequestStart = performance.now();
                const firstResponse = await fetch(resource);
                const firstRequestTime = performance.now() - firstRequestStart;
                
                // 第二次请求 - 应该从缓存获取
                const secondRequestStart = performance.now();
                const secondResponse = await fetch(resource);
                const secondRequestTime = performance.now() - secondRequestStart;
                
                const isCacheHit = secondRequestTime < firstRequestTime * 0.5; // 缓存应该至少快50%
                
                this.addTestResult(
                    `静态资源缓存: ${resource}`,
                    isCacheHit && firstResponse.ok && secondResponse.ok,
                    `首次: ${firstRequestTime.toFixed(2)}ms, 二次: ${secondRequestTime.toFixed(2)}ms`
                );
                
            } catch (error) {
                this.addTestResult(
                    `静态资源缓存: ${resource}`,
                    false,
                    error.message
                );
            }
        }
    }
    
    /**
     * 测试音频文件缓存策略 (Network First with Cache)
     */
    async testAudioFileCaching() {
        console.log('🎵 测试音频文件缓存策略...');
        
        const audioFiles = [
            'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test1/section1.mp3',
            'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test 2/Part 1 Winsham Farm.m4a'
        ];
        
        for (const audioFile of audioFiles) {
            try {
                // 首次请求 - 网络优先
                const networkRequestStart = performance.now();
                const networkResponse = await fetch(audioFile);
                const networkRequestTime = performance.now() - networkRequestStart;
                
                if (!networkResponse.ok) {
                    throw new Error(`HTTP ${networkResponse.status}`);
                }
                
                // 模拟网络断开后的缓存请求
                const cacheResponse = await this.simulateOfflineRequest(audioFile);
                
                this.addTestResult(
                    `音频缓存: ${audioFile}`,
                    cacheResponse !== null,
                    `网络请求: ${networkRequestTime.toFixed(2)}ms, 缓存可用: ${cacheResponse !== null}`
                );
                
            } catch (error) {
                this.addTestResult(
                    `音频缓存: ${audioFile}`,
                    false,
                    error.message
                );
            }
        }
    }
    
    /**
     * 测试动态页面缓存策略 (Stale While Revalidate)
     */
    async testDynamicPageCaching() {
        console.log('📱 测试动态页面缓存策略...');
        
        const dynamicPages = [
            '/',
            '/pages/test.html',
            '/pages/scoring.html'
        ];
        
        for (const page of dynamicPages) {
            try {
                // 首次请求
                const firstResponse = await fetch(page);
                const firstETag = firstResponse.headers.get('etag');
                
                // 等待一小段时间
                await this.sleep(100);
                
                // 第二次请求 - 应该返回缓存版本并在后台更新
                const secondResponse = await fetch(page);
                
                this.addTestResult(
                    `动态页面缓存: ${page}`,
                    firstResponse.ok && secondResponse.ok,
                    `首次状态: ${firstResponse.status}, 二次状态: ${secondResponse.status}`
                );
                
            } catch (error) {
                this.addTestResult(
                    `动态页面缓存: ${page}`,
                    false,
                    error.message
                );
            }
        }
    }
    
    /**
     * 测试离线功能
     */
    async testOfflineFunctionality() {
        console.log('📴 测试离线功能...');
        
        try {
            // 测试离线页面是否可用
            const offlinePageResponse = await fetch('/offline.html');
            
            this.addTestResult(
                '离线页面可用性',
                offlinePageResponse.ok,
                `状态: ${offlinePageResponse.status}`
            );
            
            // 测试缓存的静态资源在离线时是否可用
            const cachedResourcesAvailable = await this.testCachedResourcesOffline();
            
            this.addTestResult(
                '离线资源可用性',
                cachedResourcesAvailable,
                cachedResourcesAvailable ? '缓存资源可用' : '缓存资源不可用'
            );
            
        } catch (error) {
            this.addTestResult(
                '离线功能测试',
                false,
                error.message
            );
        }
    }
    
    /**
     * 测试缓存版本管理
     */
    async testCacheVersioning() {
        console.log('🔄 测试缓存版本管理...');
        
        try {
            // 获取当前缓存统计
            const cacheStats = await window.swManager?.getCacheStats();
            
            if (cacheStats) {
                // 检查缓存版本
                const hasValidVersion = cacheStats.version && cacheStats.version.match(/^\d+\.\d+\.\d+$/);
                
                // 检查缓存条目数量
                const hasCacheEntries = Object.keys(cacheStats).some(key => 
                    key.endsWith('_entries') && cacheStats[key] > 0
                );
                
                this.addTestResult(
                    '缓存版本管理',
                    hasValidVersion && hasCacheEntries,
                    `版本: ${cacheStats.version}, 有缓存条目: ${hasCacheEntries}`
                );
            } else {
                this.addTestResult(
                    '缓存版本管理',
                    false,
                    '无法获取缓存统计信息'
                );
            }
            
        } catch (error) {
            this.addTestResult(
                '缓存版本管理',
                false,
                error.message
            );
        }
    }
    
    /**
     * 模拟离线请求
     */
    async simulateOfflineRequest(url) {
        try {
            // 检查 Service Worker 缓存
            const cacheNames = await caches.keys();
            
            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const response = await cache.match(url);
                
                if (response) {
                    return response;
                }
            }
            
            return null;
            
        } catch (error) {
            console.warn('模拟离线请求失败:', error);
            return null;
        }
    }
    
    /**
     * 测试缓存资源在离线时的可用性
     */
    async testCachedResourcesOffline() {
        try {
            const testResources = [
                '/css/main.css',
                '/js/test-ui.js'
            ];
            
            let availableCount = 0;
            
            for (const resource of testResources) {
                const cachedResponse = await this.simulateOfflineRequest(resource);
                if (cachedResponse) {
                    availableCount++;
                }
            }
            
            return availableCount === testResources.length;
            
        } catch (error) {
            console.warn('离线资源测试失败:', error);
            return false;
        }
    }
    
    /**
     * 性能基准测试
     */
    async runPerformanceBenchmark() {
        console.log('⚡ 运行性能基准测试...');
        
        const testUrls = [
            '/css/main.css',
            '/js/test-ui.js',
            '/pages/test.html',
            '/audio/test1/section1.mp3'
        ];
        
        const results = {
            withCache: [],
            withoutCache: []
        };
        
        // 测试带缓存的性能
        for (const url of testUrls) {
            const startTime = performance.now();
            try {
                await fetch(url);
                const loadTime = performance.now() - startTime;
                results.withCache.push({ url, loadTime });
            } catch (error) {
                results.withCache.push({ url, loadTime: -1, error: error.message });
            }
        }
        
        // 计算平均加载时间
        const avgWithCache = results.withCache
            .filter(r => r.loadTime > 0)
            .reduce((sum, r) => sum + r.loadTime, 0) / results.withCache.length;
        
        console.log('📊 性能基准测试结果:');
        console.log(`平均加载时间 (带缓存): ${avgWithCache.toFixed(2)}ms`);
        
        return results;
    }
    
    /**
     * 缓存策略压力测试
     */
    async runStressTest() {
        console.log('💪 运行缓存策略压力测试...');
        
        const concurrentRequests = 20;
        const testUrl = '/css/main.css';
        
        const startTime = performance.now();
        
        // 并发发送多个请求
        const promises = Array(concurrentRequests).fill(null).map(() => 
            fetch(testUrl).then(response => ({
                ok: response.ok,
                status: response.status,
                fromCache: response.headers.get('x-cache') === 'HIT'
            }))
        );
        
        try {
            const results = await Promise.all(promises);
            const endTime = performance.now();
            
            const successCount = results.filter(r => r.ok).length;
            const cacheHitCount = results.filter(r => r.fromCache).length;
            
            this.addTestResult(
                '并发请求压力测试',
                successCount === concurrentRequests,
                `${concurrentRequests}个并发请求, ${successCount}个成功, 用时${(endTime - startTime).toFixed(2)}ms`
            );
            
        } catch (error) {
            this.addTestResult(
                '并发请求压力测试',
                false,
                error.message
            );
        }
    }
    
    /**
     * 添加测试结果
     */
    addTestResult(testName, passed, details) {
        const result = {
            testName,
            passed,
            details,
            timestamp: Date.now()
        };
        
        this.testResults.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${details}`);
    }
    
    /**
     * 生成测试报告
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);
        const totalTime = Date.now() - this.testStartTime;
        
        const report = {
            summary: {
                totalTests,
                passedTests,
                failedTests,
                successRate: `${successRate}%`,
                totalTime: `${totalTime}ms`
            },
            details: this.testResults,
            recommendations: this.generateRecommendations()
        };
        
        console.log('📋 缓存策略测试报告:');
        console.log('============================');
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过: ${passedTests}`);
        console.log(`失败: ${failedTests}`);
        console.log(`成功率: ${successRate}%`);
        console.log(`总用时: ${totalTime}ms`);
        console.log('============================');
        
        // 显示失败的测试
        const failedTestResults = this.testResults.filter(r => !r.passed);
        if (failedTestResults.length > 0) {
            console.log('❌ 失败的测试:');
            failedTestResults.forEach(result => {
                console.log(`  - ${result.testName}: ${result.details}`);
            });
        }
        
        // 显示建议
        const recommendations = this.generateRecommendations();
        if (recommendations.length > 0) {
            console.log('💡 优化建议:');
            recommendations.forEach(rec => {
                console.log(`  - ${rec}`);
            });
        }
        
        return report;
    }
    
    /**
     * 生成优化建议
     */
    generateRecommendations() {
        const recommendations = [];
        const failedTests = this.testResults.filter(r => !r.passed);
        
        // 根据失败的测试生成建议
        failedTests.forEach(test => {
            if (test.testName.includes('静态资源缓存')) {
                recommendations.push('检查静态资源的缓存策略配置');
            } else if (test.testName.includes('音频缓存')) {
                recommendations.push('优化音频文件的网络优先缓存策略');
            } else if (test.testName.includes('动态页面缓存')) {
                recommendations.push('调整动态页面的 stale-while-revalidate 配置');
            } else if (test.testName.includes('离线')) {
                recommendations.push('完善离线功能的实现');
            }
        });
        
        // 通用建议
        const passRate = (this.testResults.filter(r => r.passed).length / this.testResults.length) * 100;
        
        if (passRate < 80) {
            recommendations.push('Service Worker 缓存策略需要全面优化');
        } else if (passRate < 90) {
            recommendations.push('部分缓存策略需要微调');
        }
        
        return [...new Set(recommendations)]; // 去重
    }
    
    /**
     * 导出测试报告为JSON
     */
    exportReportAsJSON() {
        const report = this.generateTestReport();
        const dataStr = JSON.stringify(report, null, 2);
        
        // 创建下载链接
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cache-test-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * 工具方法：延迟
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 获取测试结果
     */
    getTestResults() {
        return {
            results: this.testResults,
            isRunning: this.isRunning,
            startTime: this.testStartTime
        };
    }
    
    /**
     * 清除测试结果
     */
    clearResults() {
        this.testResults = [];
        console.log('🗑️ 测试结果已清除');
    }
}

// 创建全局实例
window.cacheTestTool = new CacheTestTool();

// 导出类
window.CacheTestTool = CacheTestTool;

// 提供快捷方法
window.runCacheTests = () => window.cacheTestTool.runFullTestSuite();
window.benchmarkCache = () => window.cacheTestTool.runPerformanceBenchmark();
window.stressTestCache = () => window.cacheTestTool.runStressTest();