// 测试数据验证工具
// 用于验证剑桥雅思20测试数据文件的结构和完整性

class TestDataValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.testDataSets = [
            { name: 'TEST_DATA_4', data: window.TEST_DATA_4 },
            { name: 'TEST_DATA_5', data: window.TEST_DATA_5 },
            { name: 'TEST_DATA_6', data: window.TEST_DATA_6 },
            { name: 'TEST_DATA_7', data: window.TEST_DATA_7 }
        ];
    }

    // 验证所有测试数据
    validateAllTestData() {
        console.log('开始验证测试数据结构...');
        this.errors = [];
        this.warnings = [];

        this.testDataSets.forEach(testSet => {
            this.validateSingleTestData(testSet.name, testSet.data);
        });

        this.displayResults();
        return {
            errors: this.errors,
            warnings: this.warnings,
            isValid: this.errors.length === 0
        };
    }

    // 验证单个测试数据
    validateSingleTestData(name, testData) {
        if (!testData) {
            this.addError(name, 'root', '测试数据不存在');
            return;
        }

        // 验证基本结构
        this.validateBasicStructure(name, testData);
        
        // 验证测试信息
        this.validateTestInfo(name, testData.testInfo);
        
        // 验证各个section
        this.validateSection(name, 'section1', testData.section1);
        this.validateSection(name, 'section2', testData.section2);
        this.validateSection(name, 'section3', testData.section3);
        this.validateSection(name, 'section4', testData.section4);
    }

    // 验证基本结构
    validateBasicStructure(testName, testData) {
        const requiredProperties = ['testInfo', 'section1', 'section2', 'section3', 'section4'];
        
        requiredProperties.forEach(prop => {
            if (!testData[prop]) {
                this.addError(testName, prop, `缺少必需属性: ${prop}`);
            }
        });
    }

    // 验证测试信息
    validateTestInfo(testName, testInfo) {
        if (!testInfo) return;

        const requiredFields = ['title', 'description', 'totalQuestions', 'timeLimit', 'audioPath'];
        
        requiredFields.forEach(field => {
            if (!testInfo[field]) {
                this.addError(testName, `testInfo.${field}`, `缺少字段: ${field}`);
            }
        });

        // 验证特定值
        if (testInfo.totalQuestions !== 40) {
            this.addWarning(testName, 'testInfo.totalQuestions', '总题数应该是40题');
        }

        if (testInfo.timeLimit !== 30) {
            this.addWarning(testName, 'testInfo.timeLimit', '考试时长应该是30分钟');
        }
    }

    // 验证section结构
    validateSection(testName, sectionName, sectionData) {
        if (!sectionData) {
            this.addError(testName, sectionName, 'Section数据不存在');
            return;
        }

        // 验证section基本属性
        if (!sectionData.title) {
            this.addError(testName, `${sectionName}.title`, '缺少section标题');
        }

        if (!sectionData.instructions) {
            this.addError(testName, `${sectionName}.instructions`, '缺少section说明');
        }

        // 根据不同section验证特定结构
        if (sectionName === 'section1') {
            this.validateSection1(testName, sectionData);
        } else if (sectionName === 'section2' || sectionName === 'section3') {
            this.validateMultiPartSection(testName, sectionName, sectionData);
        } else if (sectionName === 'section4') {
            this.validateSection4(testName, sectionData);
        }
    }

    // 验证Section 1 (表单填空)
    validateSection1(testName, sectionData) {
        if (!sectionData.formContent) {
            this.addError(testName, 'section1.formContent', '缺少表单内容');
            return;
        }

        if (!sectionData.formContent.title) {
            this.addWarning(testName, 'section1.formContent.title', '缺少表单标题');
        }

        if (!sectionData.formContent.items || !Array.isArray(sectionData.formContent.items)) {
            this.addError(testName, 'section1.formContent.items', '表单项目格式错误');
            return;
        }

        // 验证题目数量
        const blankCount = this.countBlanks(sectionData.formContent.items);
        if (blankCount !== 10) {
            this.addWarning(testName, 'section1', `Section 1应该有10个填空，当前有${blankCount}个`);
        }
    }

    // 验证多部分Section (2-3)
    validateMultiPartSection(testName, sectionName, sectionData) {
        if (!sectionData.parts || !Array.isArray(sectionData.parts)) {
            this.addError(testName, `${sectionName}.parts`, 'Section parts格式错误');
            return;
        }

        sectionData.parts.forEach((part, index) => {
            if (!part.title) {
                this.addWarning(testName, `${sectionName}.parts[${index}].title`, '缺少part标题');
            }

            if (!part.instructions) {
                this.addError(testName, `${sectionName}.parts[${index}].instructions`, '缺少part说明');
            }

            if (part.questions) {
                this.validateQuestions(testName, `${sectionName}.parts[${index}]`, part.questions);
            }
        });
    }

    // 验证Section 4 (笔记填空)
    validateSection4(testName, sectionData) {
        if (!sectionData.boxContent) {
            this.addError(testName, 'section4.boxContent', '缺少boxContent');
            return;
        }

        if (!sectionData.boxContent.title) {
            this.addWarning(testName, 'section4.boxContent.title', '缺少box标题');
        }

        if (!sectionData.boxContent.content || !Array.isArray(sectionData.boxContent.content)) {
            this.addError(testName, 'section4.boxContent.content', 'Box内容格式错误');
        }
    }

    // 验证问题数组
    validateQuestions(testName, partName, questions) {
        if (!Array.isArray(questions)) {
            this.addError(testName, `${partName}.questions`, '问题数组格式错误');
            return;
        }

        questions.forEach((question, index) => {
            if (!question.id) {
                this.addError(testName, `${partName}.questions[${index}].id`, '问题缺少ID');
            }

            if (!question.text) {
                this.addError(testName, `${partName}.questions[${index}].text`, '问题缺少内容');
            }

            if (!question.type) {
                this.addError(testName, `${partName}.questions[${index}].type`, '问题缺少类型');
            }

            // 验证选择题选项
            if (question.type === 'radio' && (!question.options || question.options.length !== 3)) {
                this.addWarning(testName, `${partName}.questions[${index}].options`, '选择题应该有3个选项');
            }
        });
    }

    // 计算填空题数量
    countBlanks(items) {
        let count = 0;
        items.forEach(item => {
            const matches = item.text.match(/\[\d+\]/g);
            if (matches) {
                count += matches.length;
            }
        });
        return count;
    }

    // 添加错误
    addError(testName, location, message) {
        this.errors.push({
            testName,
            location,
            message,
            type: 'error'
        });
    }

    // 添加警告
    addWarning(testName, location, message) {
        this.warnings.push({
            testName,
            location,
            message,
            type: 'warning'
        });
    }

    // 显示验证结果
    displayResults() {
        console.log('\n=== 测试数据验证结果 ===');
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ 所有测试数据验证通过！');
            return;
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ 发现 ${this.errors.length} 个错误:`);
            this.errors.forEach(error => {
                console.log(`  ${error.testName}.${error.location}: ${error.message}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️ 发现 ${this.warnings.length} 个警告:`);
            this.warnings.forEach(warning => {
                console.log(`  ${warning.testName}.${warning.location}: ${warning.message}`);
            });
        }

        console.log(`\n总结: ${this.errors.length === 0 ? '✅ 验证通过' : '❌ 验证失败'}`);
    }

    // 生成数据结构报告
    generateStructureReport() {
        const report = {};
        
        this.testDataSets.forEach(testSet => {
            if (testSet.data) {
                report[testSet.name] = {
                    sections: Object.keys(testSet.data).filter(key => key.startsWith('section')),
                    hasTestInfo: !!testSet.data.testInfo,
                    testInfo: testSet.data.testInfo || {}
                };
            }
        });

        console.log('\n=== 数据结构报告 ===');
        console.table(report);
        return report;
    }
}

// 全局验证函数
window.validateTestData = function() {
    const validator = new TestDataValidator();
    return validator.validateAllTestData();
};

window.generateTestDataReport = function() {
    const validator = new TestDataValidator();
    return validator.generateStructureReport();
};

console.log('测试数据验证工具已加载');
console.log('使用 validateTestData() 验证所有测试数据');
console.log('使用 generateTestDataReport() 生成数据结构报告');