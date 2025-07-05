// 音频配置测试工具
// 用于验证音频路径配置是否正确

class AudioConfigTest {
    constructor() {
        this.testResults = [];
    }

    // 测试所有音频配置
    async testAllConfigurations() {
        console.log('开始测试音频配置...');
        
        for (const testId in AUDIO_CONFIG) {
            await this.testConfiguration(testId);
        }
        
        this.displayResults();
        return this.testResults;
    }

    // 测试单个配置
    async testConfiguration(testId) {
        const config = AUDIO_CONFIG[testId];
        console.log(`测试 ${testId} 配置:`, config);
        
        const testResult = {
            testId,
            config,
            sections: [],
            allValid: true
        };

        for (let i = 0; i < config.sections.length; i++) {
            const sectionNumber = i + 1;
            const audioPath = config.basePath + config.sections[i];
            const isValid = await this.checkAudioFile(audioPath);
            
            testResult.sections.push({
                section: sectionNumber,
                path: audioPath,
                fileName: config.sections[i],
                valid: isValid
            });
            
            if (!isValid) {
                testResult.allValid = false;
            }
        }
        
        this.testResults.push(testResult);
        return testResult;
    }

    // 检查音频文件是否存在
    async checkAudioFile(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            
            const timeout = setTimeout(() => {
                resolve(false);
            }, 3000); // 3秒超时
            
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

    // 显示测试结果
    displayResults() {
        console.log('\n=== 音频配置测试结果 ===');
        
        this.testResults.forEach(result => {
            console.log(`\n${result.testId}:`);
            console.log(`  基础路径: ${result.config.basePath}`);
            console.log(`  整体状态: ${result.allValid ? '✅ 通过' : '❌ 失败'}`);
            
            result.sections.forEach(section => {
                const status = section.valid ? '✅' : '❌';
                console.log(`  Section ${section.section}: ${status} ${section.fileName}`);
                if (!section.valid) {
                    console.log(`    路径: ${section.path}`);
                }
            });
        });
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.allValid).length;
        console.log(`\n总结: ${passedTests}/${totalTests} 个测试配置通过`);
    }

    // 生成修复建议
    generateFixSuggestions() {
        const suggestions = [];
        
        this.testResults.forEach(result => {
            if (!result.allValid) {
                const failedSections = result.sections.filter(s => !s.valid);
                suggestions.push({
                    testId: result.testId,
                    issues: failedSections.map(s => ({
                        section: s.section,
                        expectedPath: s.path,
                        suggestion: `检查文件 ${s.path} 是否存在`
                    }))
                });
            }
        });
        
        return suggestions;
    }
}

// 全局测试函数
window.testAudioConfig = async function() {
    const tester = new AudioConfigTest();
    const results = await tester.testAllConfigurations();
    
    // 生成修复建议
    const suggestions = tester.generateFixSuggestions();
    if (suggestions.length > 0) {
        console.log('\n=== 修复建议 ===');
        suggestions.forEach(suggestion => {
            console.log(`\n${suggestion.testId}:`);
            suggestion.issues.forEach(issue => {
                console.log(`  Section ${issue.section}: ${issue.suggestion}`);
            });
        });
    }
    
    return results;
};

// 快速测试当前页面的音频配置
window.testCurrentPageAudio = async function() {
    if (typeof window.audioPlayerInstance !== 'undefined') {
        const testId = window.audioPlayerInstance.testId;
        const tester = new AudioConfigTest();
        console.log(`测试当前页面 (${testId}) 的音频配置...`);
        return await tester.testConfiguration(testId);
    } else {
        console.error('音频播放器实例未找到');
        return null;
    }
};

console.log('音频配置测试工具已加载');
console.log('使用 testAudioConfig() 测试所有配置');
console.log('使用 testCurrentPageAudio() 测试当前页面配置');