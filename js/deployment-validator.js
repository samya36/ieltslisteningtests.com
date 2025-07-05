// 部署验证工具
// 用于验证剑桥雅思20集成后的系统完整性和部署就绪状态

class DeploymentValidator {
    constructor() {
        this.checkResults = [];
        this.errors = [];
        this.warnings = [];
        this.deploymentReady = false;
    }

    // 执行完整的部署验证
    async runDeploymentValidation() {
        console.log('🚀 开始部署验证检查...');
        
        try {
            // 清理之前的结果
            this.resetResults();
            
            // 1. 文件完整性检查
            await this.validateFileIntegrity();
            
            // 2. 音频文件验证
            await this.validateAudioFiles();
            
            // 3. 数据结构验证
            await this.validateDataStructures();
            
            // 4. 页面功能验证
            await this.validatePageFunctionality();
            
            // 5. 配置验证
            await this.validateConfigurations();
            
            // 6. 性能检查
            await this.validatePerformance();
            
            // 7. 兼容性检查
            await this.validateCompatibility();
            
            // 生成部署报告
            this.generateDeploymentReport();
            
        } catch (error) {
            console.error('部署验证过程中发生错误:', error);
            this.addError('部署验证系统', error.message);
        }
        
        return this.getValidationSummary();
    }

    // 重置验证结果
    resetResults() {
        this.checkResults = [];
        this.errors = [];
        this.warnings = [];
        this.deploymentReady = false;
    }

    // 1. 文件完整性检查
    async validateFileIntegrity() {
        console.log('📁 检查文件完整性...');
        
        const requiredFiles = [
            // 新增数据文件
            { path: 'js/test-data-4.js', type: 'script', critical: true },
            { path: 'js/test-data-5.js', type: 'script', critical: true },
            { path: 'js/test-data-6.js', type: 'script', critical: true },
            { path: 'js/test-data-7.js', type: 'script', critical: true },
            
            // 新增工具文件
            { path: 'js/audio-config-test.js', type: 'script', critical: false },
            { path: 'js/test-data-validator.js', type: 'script', critical: false },
            { path: 'js/test-system-validator.js', type: 'script', critical: false },
            
            // 样式文件
            { path: 'css/cambridge-tests.css', type: 'style', critical: true },
            
            // 文档文件
            { path: 'CHANGELOG.md', type: 'document', critical: false },
            { path: 'DEPLOYMENT_CHECKLIST.md', type: 'document', critical: false }
        ];

        for (const file of requiredFiles) {
            const exists = await this.checkFileExists(file.path, file.type);
            
            this.checkResults.push({
                category: '文件完整性',
                check: `文件存在: ${file.path}`,
                result: exists,
                critical: file.critical
            });

            if (!exists && file.critical) {
                this.addError('文件完整性', `关键文件缺失: ${file.path}`);
            } else if (!exists) {
                this.addWarning('文件完整性', `可选文件缺失: ${file.path}`);
            }
        }
    }

    // 检查文件是否存在
    async checkFileExists(path, type) {
        return new Promise((resolve) => {
            if (type === 'script') {
                // 检查JavaScript文件是否已加载
                const scripts = document.querySelectorAll('script');
                const exists = Array.from(scripts).some(script => 
                    script.src && script.src.includes(path)
                );
                resolve(exists);
            } else if (type === 'style') {
                // 检查CSS文件是否已加载
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                const exists = Array.from(links).some(link => 
                    link.href && link.href.includes(path)
                );
                resolve(exists);
            } else {
                // 对于其他文件类型，尝试发送HEAD请求
                fetch(path, { method: 'HEAD' })
                    .then(response => resolve(response.ok))
                    .catch(() => resolve(false));
            }
        });
    }

    // 2. 音频文件验证
    async validateAudioFiles() {
        console.log('🎵 验证音频文件...');
        
        const audioTests = [
            { testId: 'test4', name: '剑桥雅思20 Test 1' },
            { testId: 'test5', name: '剑桥雅思20 Test 2' },
            { testId: 'test6', name: '剑桥雅思20 Test 3' },
            { testId: 'test7', name: '剑桥雅思20 Test 4' }
        ];

        for (const test of audioTests) {
            const audioResult = await this.validateSingleTestAudio(test);
            
            this.checkResults.push({
                category: '音频文件',
                check: `${test.name} 音频完整性`,
                result: audioResult.allValid,
                details: audioResult
            });

            if (!audioResult.allValid) {
                this.addError('音频文件', `${test.name} 音频文件验证失败`);
            }
        }
    }

    // 验证单个测试的音频文件
    async validateSingleTestAudio(test) {
        const result = { testId: test.testId, sections: [], allValid: true };
        
        try {
            const config = AUDIO_CONFIG && AUDIO_CONFIG[test.testId];
            if (!config) {
                result.allValid = false;
                result.error = '音频配置不存在';
                return result;
            }

            for (let i = 0; i < 4; i++) {
                const sectionNum = i + 1;
                const audioPath = config.basePath + config.sections[i];
                const isValid = await this.checkAudioFile(audioPath);
                
                result.sections.push({
                    section: sectionNum,
                    path: audioPath,
                    valid: isValid
                });

                if (!isValid) {
                    result.allValid = false;
                }
            }
        } catch (error) {
            result.allValid = false;
            result.error = error.message;
        }

        return result;
    }

    // 检查音频文件
    async checkAudioFile(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            const timeout = setTimeout(() => resolve(false), 5000);
            
            audio.onloadedmetadata = () => {
                clearTimeout(timeout);
                resolve(audio.duration > 0);
            };
            
            audio.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            audio.src = path;
        });
    }

    // 3. 数据结构验证
    async validateDataStructures() {
        console.log('📊 验证数据结构...');
        
        const dataFiles = [
            { name: 'TEST_DATA_4', data: window.TEST_DATA_4 },
            { name: 'TEST_DATA_5', data: window.TEST_DATA_5 },
            { name: 'TEST_DATA_6', data: window.TEST_DATA_6 },
            { name: 'TEST_DATA_7', data: window.TEST_DATA_7 }
        ];

        dataFiles.forEach(dataFile => {
            const isValid = this.validateDataStructure(dataFile.data);
            
            this.checkResults.push({
                category: '数据结构',
                check: `${dataFile.name} 结构验证`,
                result: isValid,
                details: this.getDataStructureDetails(dataFile.data)
            });

            if (!isValid) {
                this.addError('数据结构', `${dataFile.name} 数据结构不完整`);
            }
        });
    }

    // 验证数据结构
    validateDataStructure(data) {
        if (!data) return false;
        
        const requiredSections = ['section1', 'section2', 'section3', 'section4'];
        const hasAllSections = requiredSections.every(section => data[section]);
        const hasTestInfo = data.testInfo && 
                          data.testInfo.title && 
                          data.testInfo.totalQuestions === 40;
        
        return hasAllSections && hasTestInfo;
    }

    // 获取数据结构详情
    getDataStructureDetails(data) {
        if (!data) return { sections: 0, hasTestInfo: false };
        
        const sections = Object.keys(data).filter(key => key.startsWith('section')).length;
        const hasTestInfo = !!data.testInfo;
        const totalQuestions = data.testInfo ? data.testInfo.totalQuestions : 0;
        
        return { sections, hasTestInfo, totalQuestions };
    }

    // 4. 页面功能验证
    async validatePageFunctionality() {
        console.log('🌐 验证页面功能...');
        
        const functionalityTests = [
            { name: '音频播放器类存在', test: () => typeof AudioPlayer !== 'undefined' },
            { name: '音频配置存在', test: () => typeof AUDIO_CONFIG !== 'undefined' },
            { name: '测试UI类存在', test: () => typeof TestUI !== 'undefined' },
            { name: '评分显示功能存在', test: () => typeof generateScoreResultHTML !== 'undefined' },
            { name: 'Cambridge样式加载', test: () => this.checkCSSLoaded('cambridge-tests.css') }
        ];

        functionalityTests.forEach(test => {
            try {
                const result = test.test();
                
                this.checkResults.push({
                    category: '页面功能',
                    check: test.name,
                    result: result
                });

                if (!result) {
                    this.addWarning('页面功能', `${test.name} 验证失败`);
                }
            } catch (error) {
                this.checkResults.push({
                    category: '页面功能',
                    check: test.name,
                    result: false
                });
                this.addError('页面功能', `${test.name} 测试出错: ${error.message}`);
            }
        });
    }

    // 检查CSS是否加载
    checkCSSLoaded(filename) {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        return Array.from(links).some(link => link.href.includes(filename));
    }

    // 5. 配置验证
    async validateConfigurations() {
        console.log('⚙️ 验证配置...');
        
        const configTests = [
            {
                name: '音频路径配置完整',
                test: () => {
                    if (!AUDIO_CONFIG) return false;
                    const requiredTests = ['test4', 'test5', 'test6', 'test7'];
                    return requiredTests.every(testId => 
                        AUDIO_CONFIG[testId] && 
                        AUDIO_CONFIG[testId].basePath && 
                        AUDIO_CONFIG[testId].sections && 
                        AUDIO_CONFIG[testId].sections.length === 4
                    );
                }
            },
            {
                name: '向后兼容性配置',
                test: () => {
                    if (!AUDIO_CONFIG) return false;
                    const legacyTests = ['test1', 'test2', 'test3'];
                    return legacyTests.every(testId => AUDIO_CONFIG[testId]);
                }
            },
            {
                name: '全局变量正确设置',
                test: () => {
                    const requiredGlobals = ['TEST_DATA_4', 'TEST_DATA_5', 'TEST_DATA_6', 'TEST_DATA_7'];
                    return requiredGlobals.every(varName => window[varName] !== undefined);
                }
            }
        ];

        configTests.forEach(test => {
            try {
                const result = test.test();
                
                this.checkResults.push({
                    category: '配置验证',
                    check: test.name,
                    result: result
                });

                if (!result) {
                    this.addError('配置验证', `${test.name} 验证失败`);
                }
            } catch (error) {
                this.addError('配置验证', `${test.name} 测试出错: ${error.message}`);
            }
        });
    }

    // 6. 性能检查
    async validatePerformance() {
        console.log('⚡ 检查性能指标...');
        
        const performanceMetrics = {
            pageLoadTime: this.getPageLoadTime(),
            resourceCount: this.getResourceCount(),
            memoryUsage: this.getMemoryUsage(),
            domElements: document.querySelectorAll('*').length
        };

        // 性能基准检查
        const performanceTests = [
            {
                name: '页面加载时间',
                value: performanceMetrics.pageLoadTime,
                threshold: 3000,
                unit: 'ms',
                test: (value) => value < 3000
            },
            {
                name: '资源文件数量',
                value: performanceMetrics.resourceCount,
                threshold: 50,
                unit: '个',
                test: (value) => value < 50
            },
            {
                name: 'DOM元素数量',
                value: performanceMetrics.domElements,
                threshold: 1000,
                unit: '个',
                test: (value) => value < 1000
            }
        ];

        performanceTests.forEach(test => {
            const passed = test.test(test.value);
            
            this.checkResults.push({
                category: '性能检查',
                check: test.name,
                result: passed,
                details: `${test.value}${test.unit} (阈值: ${test.threshold}${test.unit})`
            });

            if (!passed) {
                this.addWarning('性能检查', `${test.name} 超出阈值: ${test.value}${test.unit}`);
            }
        });
    }

    // 获取页面加载时间
    getPageLoadTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;
    }

    // 获取资源数量
    getResourceCount() {
        return performance.getEntriesByType('resource').length;
    }

    // 获取内存使用情况
    getMemoryUsage() {
        if (performance.memory) {
            return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        return 0;
    }

    // 7. 兼容性检查
    async validateCompatibility() {
        console.log('🌍 检查兼容性...');
        
        const compatibilityTests = [
            {
                name: 'HTML5 Audio支持',
                test: () => !!document.createElement('audio').canPlayType
            },
            {
                name: 'ES6特性支持',
                test: () => {
                    try {
                        eval('class Test {}; const arrow = () => {}; let test = { ...{} };');
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            },
            {
                name: 'Fetch API支持',
                test: () => typeof fetch !== 'undefined'
            },
            {
                name: 'LocalStorage支持',
                test: () => typeof Storage !== 'undefined'
            },
            {
                name: 'CSS Grid支持',
                test: () => {
                    const element = document.createElement('div');
                    return 'grid' in element.style;
                }
            }
        ];

        compatibilityTests.forEach(test => {
            try {
                const result = test.test();
                
                this.checkResults.push({
                    category: '兼容性检查',
                    check: test.name,
                    result: result
                });

                if (!result) {
                    this.addWarning('兼容性检查', `${test.name} 不支持`);
                }
            } catch (error) {
                this.addError('兼容性检查', `${test.name} 测试出错: ${error.message}`);
            }
        });
    }

    // 添加错误
    addError(category, message) {
        this.errors.push({ category, message, type: 'error' });
    }

    // 添加警告
    addWarning(category, message) {
        this.warnings.push({ category, message, type: 'warning' });
    }

    // 生成部署报告
    generateDeploymentReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 部署验证报告');
        console.log('='.repeat(60));

        // 按类别分组显示结果
        const categories = [...new Set(this.checkResults.map(r => r.category))];
        
        categories.forEach(category => {
            console.log(`\n📂 ${category}:`);
            const categoryResults = this.checkResults.filter(r => r.category === category);
            
            categoryResults.forEach(result => {
                const status = result.result ? '✅' : '❌';
                console.log(`  ${status} ${result.check}`);
                if (result.details) {
                    console.log(`    ${result.details}`);
                }
            });
        });

        // 显示错误和警告
        if (this.errors.length > 0) {
            console.log('\n❌ 关键错误:');
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

        // 部署就绪状态
        const totalChecks = this.checkResults.length;
        const passedChecks = this.checkResults.filter(r => r.result).length;
        const criticalErrors = this.errors.length;

        this.deploymentReady = criticalErrors === 0 && passedChecks >= totalChecks * 0.9;

        console.log('\n📊 验证总结:');
        console.log(`  总检查项: ${totalChecks}`);
        console.log(`  通过检查: ${passedChecks}`);
        console.log(`  通过率: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);
        console.log(`  关键错误: ${criticalErrors}`);
        console.log(`  警告数: ${this.warnings.length}`);
        
        const deploymentStatus = this.deploymentReady ? 
            '✅ 系统已准备就绪，可以部署' : 
            '❌ 系统尚未准备就绪，请修复错误后重试';
        
        console.log(`\n${deploymentStatus}`);

        return this.deploymentReady;
    }

    // 获取验证摘要
    getValidationSummary() {
        const totalChecks = this.checkResults.length;
        const passedChecks = this.checkResults.filter(r => r.result).length;
        
        return {
            totalChecks,
            passedChecks,
            passRate: (passedChecks / totalChecks) * 100,
            errors: this.errors.length,
            warnings: this.warnings.length,
            deploymentReady: this.deploymentReady,
            timestamp: new Date().toISOString(),
            checkResults: this.checkResults
        };
    }
}

// 全局部署验证函数
window.validateDeployment = async function() {
    const validator = new DeploymentValidator();
    return await validator.runDeploymentValidation();
};

// 快速部署检查
window.quickDeploymentCheck = function() {
    console.log('🏥 执行快速部署检查...');
    
    const quickChecks = [
        { name: '音频配置', test: () => typeof AUDIO_CONFIG !== 'undefined' && AUDIO_CONFIG.test4 },
        { name: '剑桥雅思数据', test: () => typeof TEST_DATA_4 !== 'undefined' },
        { name: '音频播放器', test: () => typeof AudioPlayer !== 'undefined' },
        { name: 'Cambridge样式', test: () => document.querySelector('link[href*="cambridge-tests.css"]') !== null }
    ];

    let passed = 0;
    quickChecks.forEach(check => {
        const status = check.test() ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
        if (status === '✅') passed++;
    });

    const readiness = (passed / quickChecks.length) * 100;
    const isReady = readiness >= 75;
    
    console.log(`\n部署准备度: ${readiness.toFixed(1)}% (${passed}/${quickChecks.length})`);
    console.log(isReady ? '✅ 基础检查通过，可以进行部署' : '❌ 基础检查失败，请修复问题');
    
    return { score: readiness, passed, total: quickChecks.length, ready: isReady };
};

console.log('📋 部署验证工具已加载');
console.log('使用 validateDeployment() 执行完整部署验证');
console.log('使用 quickDeploymentCheck() 执行快速部署检查');