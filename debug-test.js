// Node.js脚本来测试剑桥雅思20数据加载
const fs = require('fs');
const path = require('path');

console.log('=== 剑桥雅思20数据验证测试 ===\n');

try {
    // 读取数据文件
    const dataPath = path.join(__dirname, '剑桥雅思20', 'cambridge20_test1_data.js');
    const answersPath = path.join(__dirname, '剑桥雅思20', 'cambridge20_test1_answers.js');
    
    console.log('1. 检查文件是否存在...');
    console.log(`数据文件: ${fs.existsSync(dataPath) ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`答案文件: ${fs.existsSync(answersPath) ? '✅ 存在' : '❌ 不存在'}`);
    
    if (!fs.existsSync(dataPath) || !fs.existsSync(answersPath)) {
        console.log('文件不存在，无法继续测试');
        process.exit(1);
    }
    
    console.log('\n2. 读取并解析数据文件...');
    
    // 读取数据文件内容
    let dataContent = fs.readFileSync(dataPath, 'utf8');
    let answersContent = fs.readFileSync(answersPath, 'utf8');
    
    // 模拟浏览器环境执行JavaScript
    const vm = require('vm');
    const context = vm.createContext({
        console: console
    });
    
    // 执行数据文件
    vm.runInContext(dataContent, context);
    vm.runInContext(answersContent, context);
    
    console.log('数据文件执行成功');
    
    console.log('\n3. 验证数据结构...');
    
    const testData = context.CAMBRIDGE20_TEST1_DATA;
    const answers = context.cambridge20Test1Answers;
    
    if (!testData) {
        console.log('❌ CAMBRIDGE20_TEST1_DATA 未定义');
        process.exit(1);
    }
    
    if (!answers) {
        console.log('❌ cambridge20Test1Answers 未定义');
        process.exit(1);
    }
    
    console.log('✅ 全局变量定义正确');
    
    console.log('\n4. 检查sections数组...');
    
    if (!testData.sections || !Array.isArray(testData.sections)) {
        console.log('❌ sections 不是数组');
        process.exit(1);
    }
    
    console.log(`✅ 找到 ${testData.sections.length} 个sections`);
    
    console.log('\n5. 检查每个section的题目...');
    
    testData.sections.forEach((section, index) => {
        console.log(`\nSection ${section.id || (index + 1)}:`);
        console.log(`  标题: ${section.title}`);
        console.log(`  副标题: ${section.subtitle}`);
        console.log(`  题目范围: ${section.questions}`);
        console.log(`  题目类型: ${section.type}`);
        
        if (section.questions_list && Array.isArray(section.questions_list)) {
            console.log(`  ✅ 有 ${section.questions_list.length} 个题目`);
            
            // 显示前3个题目的信息
            section.questions_list.slice(0, 3).forEach(q => {
                console.log(`    题目${q.id}: ${q.type} - ${q.text.substring(0, 50)}${q.text.length > 50 ? '...' : ''}`);
            });
            
            if (section.questions_list.length > 3) {
                console.log(`    ... 还有 ${section.questions_list.length - 3} 个题目`);
            }
        } else {
            console.log(`  ❌ 没有questions_list或格式不正确`);
        }
    });
    
    console.log('\n6. 检查答案数据...');
    
    const answerKeys = Object.keys(answers);
    console.log(`✅ 找到 ${answerKeys.length} 个答案`);
    console.log(`答案范围: ${Math.min(...answerKeys.map(k => parseInt(k)))} - ${Math.max(...answerKeys.map(k => parseInt(k)))}`);
    
    // 显示前5个答案
    answerKeys.slice(0, 5).forEach(key => {
        const answer = answers[key];
        const answerDisplay = Array.isArray(answer) ? `[${answer.join(', ')}]` : answer;
        console.log(`  题目${key}: ${answerDisplay}`);
    });
    
    console.log('\n=== 测试完成 ===');
    console.log('✅ 剑桥雅思20数据结构正确，可以正常使用');
    
} catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error.stack);
    process.exit(1);
}