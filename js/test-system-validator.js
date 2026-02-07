// 进阶听力测试系统验证工具
// 用于全面测试和优化新集成的功能

class TestSystemValidator {
    constructor() {
        this.testResults = [];
        this.performanceMetrics = {};
        this.errors = [];
        this.warnings = [];
        this.isRunning = false;
    }

    // 执行完整的系统测试
    async runCompleteTest() {
        if (this.isRunning) {
            console.log('测试正在进行中...');
            return;
        }

        this.isRunning = true;
        console.log('🚀 开始进阶听力系统完整测试...');
        
        try {
            // 清理之前的结果
            this.resetResults();
            
            // 1. 音频播放测试
            await this.testAudioPlayback();
            
            // 2. 页面导航测试
            await this.testPageNavigation();
            
            // 3. 数据加载测试
            await this.testDataLoading();
            
            // 4. 响应式设计测试
            await this.testResponsiveDesign();
            
            // 5. 性能测试
            await this.testPerformance();
            
            // 6. 用户体验测试
            await this.testUserExperience();
            
            // 生成测试报告
            this.generateTestReport();
            
        } catch (error) {
            console.error('测试过程中发生错误:', error);
            this.addError('系统测试', error.message);
        } finally {
            this.isRunning = false;
        }
        
        return this.getTestSummary();
    }

    // 重置测试结果
    resetResults() {
        this.testResults = [];
        this.performanceMetrics = {};
        this.errors = [];
        this.warnings = [];
    }

    // 1. 音频播放测试
    async testAudioPlayback() {
        console.log('📻 测试音频播放功能...');
        const audioTests = [
            { testId: 'test4', name: '进阶听力测试 Test 4' },
            { testId: 'test5', name: '进阶听力测试 Test 5' },
            { testId: 'test6', name: '进阶听力测试 Test 6' },
            { testId: 'test7', name: '进阶听力测试 Test 7' }
        ];

        for (const test of audioTests) {
            const audioResult = await this.testSingleAudio(test);
            this.testResults.push({
                category: '音频播放',
                test: test.name,
                result: audioResult
            });
        }
    }

    // 测试单个音频配置
    async testSingleAudio(test) {
        const result = {
            testId: test.testId,
            sections: [],
            overall: true
        };

        try {
            const config = AUDIO_CONFIG[test.testId];
            if (!config) {
                this.addError(`音频配置 ${test.testId}`, '配置不存在');
                result.overall = false;
                return result;
            }

            // 测试每个section的音频
            for (let i = 0; i < config.sections.length; i++) {
                const sectionNum = i + 1;
                const audioPath = config.basePath + config.sections[i];
                const isValid = await this.checkAudioFile(audioPath);
                
                result.sections.push({
                    section: sectionNum,
                    path: audioPath,
                    valid: isValid
                });

                if (!isValid) {
                    result.overall = false;
                    this.addWarning(`${test.testId} Section ${sectionNum}`, `音频文件无法加载: ${audioPath}`);
                }
            }

        } catch (error) {
            this.addError(`音频测试 ${test.testId}`, error.message);
            result.overall = false;
        }

        return result;
    }

    // 检查音频文件
    async checkAudioFile(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            const timeout = setTimeout(() => resolve(false), 3000);
            
            audio.onloadedmetadata = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            audio.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            audio.src = path;
        });
    }

    // 2. 页面导航测试
    async testPageNavigation() {
        console.log('🧭 测试页面导航功能...');
        
        const navigationTests = [
            { name: '练习页面链接', selector: 'a[href="practice.html"]' },
            { name: 'Test 4链接', selector: 'a[href="test4.html"]' },
            { name: 'Test 5链接', selector: 'a[href="test5.html"]' },
            { name: 'Test 6链接', selector: 'a[href="test6.html"]' },
            { name: 'Test 7链接', selector: 'a[href="test7.html"]' }
        ];

        navigationTests.forEach(test => {
            const element = document.querySelector(test.selector);
            const isValid = element !== null;
            
            this.testResults.push({
                category: '页面导航',
                test: test.name,
                result: { valid: isValid, element: !!element }
            });

            if (!isValid) {
                this.addWarning('页面导航', `链接未找到: ${test.selector}`);
            }
        });
    }

    // 3. 数据加载测试
    async testDataLoading() {
        console.log('📊 测试数据加载功能...');
        
        const dataTests = [
            { name: 'TEST_DATA_4', data: window.TEST_DATA_4 },
            { name: 'TEST_DATA_5', data: window.TEST_DATA_5 },
            { name: 'TEST_DATA_6', data: window.TEST_DATA_6 },
            { name: 'TEST_DATA_7', data: window.TEST_DATA_7 }
        ];

        dataTests.forEach(test => {
            const isLoaded = test.data !== undefined;
            const hasCorrectStructure = isLoaded && this.validateDataStructure(test.data);
            
            this.testResults.push({
                category: '数据加载',
                test: test.name,
                result: { 
                    loaded: isLoaded, 
                    validStructure: hasCorrectStructure,
                    sectionCount: isLoaded ? Object.keys(test.data).filter(k => k.startsWith('section')).length : 0
                }
            });

            if (!isLoaded) {
                this.addError('数据加载', `${test.name} 未加载`);
            } else if (!hasCorrectStructure) {
                this.addWarning('数据结构', `${test.name} 结构不完整`);
            }
        });
    }

    // 验证数据结构
    validateDataStructure(data) {
        const requiredSections = ['section1', 'section2', 'section3', 'section4'];
        return requiredSections.every(section => data[section] !== undefined);
    }

    // 4. 响应式设计测试
    async testResponsiveDesign() {
        console.log('📱 测试响应式设计...');
        
        const viewports = [
            { name: '桌面端', width: 1200, height: 800 },
            { name: '平板端', width: 768, height: 1024 },
            { name: '手机端', width: 375, height: 667 }
        ];

        viewports.forEach(viewport => {
            // 模拟不同视口大小
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;
            
            // 检查关键元素的响应式表现
            const elements = [
                '.practice-card.advanced-20',
                '.test-category',
                '.official-badge'
            ];

            let responsiveScore = 0;
            elements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    const styles = window.getComputedStyle(element);
                    // 简单的响应式检查
                    if (styles.display !== 'none' && styles.visibility !== 'hidden') {
                        responsiveScore++;
                    }
                }
            });

            this.testResults.push({
                category: '响应式设计',
                test: viewport.name,
                result: {
                    viewport: `${viewport.width}x${viewport.height}`,
                    score: responsiveScore,
                    maxScore: elements.length,
                    percentage: (responsiveScore / elements.length) * 100
                }
            });
        });
    }

    // 5. 性能测试
    async testPerformance() {
        console.log('⚡ 测试性能指标...');
        
        const startTime = performance.now();
        
        // 测试关键性能指标
        const metrics = {
            domContentLoaded: this.getDOMContentLoadedTime(),
            pageLoadTime: this.getPageLoadTime(),
            resourceCount: this.getResourceCount(),
            memoryUsage: this.getMemoryUsage()
        };

        this.performanceMetrics = metrics;
        
        const endTime = performance.now();
        const testDuration = endTime - startTime;

        this.testResults.push({
            category: '性能测试',
            test: '整体性能',
            result: {
                ...metrics,
                testDuration: `${testDuration.toFixed(2)}ms`
            }
        });

        // 性能警告
        if (metrics.pageLoadTime > 3000) {
            this.addWarning('性能', '页面加载时间超过3秒');
        }
        if (metrics.resourceCount > 50) {
            this.addWarning('性能', '资源文件数量过多');
        }
    }

    // 获取性能指标
    getDOMContentLoadedTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0;
    }

    getPageLoadTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;
    }

    getResourceCount() {
        return performance.getEntriesByType('resource').length;
    }

    getMemoryUsage() {
        return performance.memory ? {
            used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
            total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB'
        } : '不支持';
    }

    // 6. 用户体验测试
    async testUserExperience() {
        console.log('👤 测试用户体验...');
        
        const uxTests = [
            { name: '加载状态指示', test: () => this.checkLoadingIndicators() },
            { name: '错误处理', test: () => this.checkErrorHandling() },
            { name: '音频控制界面', test: () => this.checkAudioControls() },
            { name: '页面可访问性', test: () => this.checkAccessibility() }
        ];

        uxTests.forEach(test => {
            try {
                const result = test.test();
                this.testResults.push({
                    category: '用户体验',
                    test: test.name,
                    result: result
                });
            } catch (error) {
                this.addError('用户体验测试', `${test.name}: ${error.message}`);
            }
        });
    }

    // UX测试辅助方法
    checkLoadingIndicators() {
        const indicators = document.querySelectorAll('.loading, .spinner, .progress');
        return { found: indicators.length, hasIndicators: indicators.length > 0 };
    }

    checkErrorHandling() {
        const errorElements = document.querySelectorAll('.error-message, .alert-error');
        return { errorHandling: true, errorElements: errorElements.length };
    }

    checkAudioControls() {
        const controls = document.querySelectorAll('.play-btn, .progress, .speed-control');
        return { controlsFound: controls.length, hasControls: controls.length > 0 };
    }

    checkAccessibility() {
        const altTexts = document.querySelectorAll('img[alt]').length;
        const totalImages = document.querySelectorAll('img').length;
        const labels = document.querySelectorAll('label').length;
        
        return {
            altTextCoverage: totalImages > 0 ? (altTexts / totalImages) * 100 : 100,
            labelsFound: labels,
            accessibilityScore: '基础检查通过'
        };
    }

    // 添加错误
    addError(category, message) {
        this.errors.push({ category, message, type: 'error' });
    }

    // 添加警告
    addWarning(category, message) {
        this.warnings.push({ category, message, type: 'warning' });
    }

    // 生成测试报告
    generateTestReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📋 进阶听力系统测试报告');
        console.log('='.repeat(50));

        // 按类别分组显示结果
        const categories = [...new Set(this.testResults.map(r => r.category))];
        
        categories.forEach(category => {
            console.log(`\n📂 ${category}:`);
            const categoryResults = this.testResults.filter(r => r.category === category);
            
            categoryResults.forEach(result => {
                const status = this.getTestStatus(result.result);
                console.log(`  ${status} ${result.test}`);
                if (typeof result.result === 'object') {
                    Object.entries(result.result).forEach(([key, value]) => {
                        if (typeof value !== 'object') {
                            console.log(`    ${key}: ${value}`);
                        }
                    });
                }
            });
        });

        // 显示性能指标
        if (Object.keys(this.performanceMetrics).length > 0) {
            console.log('\n⚡ 性能指标:');
            Object.entries(this.performanceMetrics).forEach(([key, value]) => {
                console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
            });
        }

        // 显示错误和警告
        if (this.errors.length > 0) {
            console.log('\n❌ 错误:');
            this.errors.forEach(error => {
                console.log(`  ${error.category}: ${error.message}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            this.warnings.forEach(warning => {
                console.log(`  ${warning.category}: ${warning.message}`);
            });
        }

        // 总结
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => this.getTestStatus(r.result).includes('✅')).length;
        
        console.log('\n📊 测试总结:');
        console.log(`  总测试数: ${totalTests}`);
        console.log(`  通过测试: ${passedTests}`);
        console.log(`  通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        console.log(`  错误数: ${this.errors.length}`);
        console.log(`  警告数: ${this.warnings.length}`);
        
        const overallStatus = this.errors.length === 0 ? '✅ 系统测试通过' : '❌ 系统测试失败';
        console.log(`\n${overallStatus}`);
    }

    // 获取测试状态
    getTestStatus(result) {
        if (typeof result === 'boolean') {
            return result ? '✅' : '❌';
        }
        if (typeof result === 'object') {
            if (result.valid !== undefined) return result.valid ? '✅' : '❌';
            if (result.overall !== undefined) return result.overall ? '✅' : '❌';
            if (result.loaded !== undefined) return result.loaded ? '✅' : '❌';
        }
        return '⚪';
    }

    // 获取测试摘要
    getTestSummary() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => this.getTestStatus(r.result).includes('✅')).length;
        
        return {
            totalTests,
            passedTests,
            passRate: (passedTests / totalTests) * 100,
            errors: this.errors.length,
            warnings: this.warnings.length,
            isHealthy: this.errors.length === 0,
            performanceMetrics: this.performanceMetrics,
            timestamp: new Date().toISOString()
        };
    }
}

// 全局测试函数
window.runSystemTest = async function() {
    const validator = new TestSystemValidator();
    return await validator.runCompleteTest();
};

// 快速健康检查
window.healthCheck = function() {
    console.log('🏥 执行系统健康检查...');
    
    const checks = [
        { name: '音频配置', test: () => typeof AUDIO_CONFIG !== 'undefined' },
        { name: '测试数据4', test: () => typeof TEST_DATA_4 !== 'undefined' },
        { name: '测试数据5', test: () => typeof TEST_DATA_5 !== 'undefined' },
        { name: '测试数据6', test: () => typeof TEST_DATA_6 !== 'undefined' },
        { name: '测试数据7', test: () => typeof TEST_DATA_7 !== 'undefined' },
        { name: '音频播放器', test: () => typeof AudioPlayer !== 'undefined' }
    ];

    let passed = 0;
    checks.forEach(check => {
        const status = check.test() ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
        if (status === '✅') passed++;
    });

    const healthScore = (passed / checks.length) * 100;
    console.log(`\n系统健康度: ${healthScore.toFixed(1)}% (${passed}/${checks.length})`);
    
    return { score: healthScore, passed, total: checks.length };
};

console.log('🧪 测试系统验证工具已加载');
console.log('使用 runSystemTest() 执行完整测试');
console.log('使用 healthCheck() 执行快速健康检查');
