// 通用测试渲染系统 - 支持所有7套卷子
console.log('🚀 加载通用测试渲染系统...');

// 通用题目渲染器
class UniversalTestRenderer {
    constructor() {
        this.currentTest = this.detectCurrentTest();
        this.testData = null;
        this.answers = {};
        console.log(`检测到当前测试: ${this.currentTest}`);
    }

    // 检测当前测试页面
    detectCurrentTest() {
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('test1') || path.includes('/test.html')) return 'test1';
        if (path.includes('test2')) return 'test2';
        if (path.includes('test3')) return 'test3';
        if (path.includes('test4')) return 'test4';
        if (path.includes('test5')) return 'test5';
        if (path.includes('test6')) return 'test6';
        if (path.includes('test7')) return 'test7';
        
        return 'test1'; // 默认
    }

    // 初始化渲染器
    async init() {
        console.log('初始化通用测试渲染器...');
        
        // 加载测试数据
        await this.loadTestData();
        
        // 渲染所有section
        this.renderAllSections();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('✅ 通用测试渲染器初始化完成');
    }

    // 加载测试数据
    async loadTestData() {
        try {
            // 尝试从全局变量获取数据
            if (typeof TEST_DATA !== 'undefined') {
                this.testData = TEST_DATA;
                console.log('✅ 从全局变量加载测试数据');
                return;
            }

            // 根据测试类型加载对应数据
            const dataMap = {
                'test1': 'TEST_DATA',
                'test2': 'TEST2_DATA', 
                'test3': 'TEST3_DATA',
                'test4': 'TEST4_DATA',
                'test5': 'TEST5_DATA',
                'test6': 'TEST6_DATA',
                'test7': 'TEST7_DATA'
            };

            const dataVarName = dataMap[this.currentTest];
            if (dataVarName && typeof window[dataVarName] !== 'undefined') {
                this.testData = window[dataVarName];
                console.log(`✅ 加载 ${dataVarName} 数据`);
            } else {
                // 使用默认题目模板
                this.useDefaultTemplate();
            }
        } catch (error) {
            console.warn('数据加载失败，使用默认模板:', error);
            this.useDefaultTemplate();
        }
    }

    // 使用默认题目模板
    useDefaultTemplate() {
        console.log('使用默认题目模板...');
        this.testData = this.createDefaultTestData();
    }

    // 创建默认测试数据
    createDefaultTestData() {
        return {
            section1: this.createSection1Template(),
            section2: this.createSection2Template(), 
            section3: this.createSection3Template(),
            section4: this.createSection4Template()
        };
    }

    // Section 1 模板 - 填空题
    createSection1Template() {
        return {
            title: "Section 1",
            instructions: "Questions 1-10\nComplete the form below.\nWrite NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
            questions: Array.from({length: 10}, (_, i) => ({
                id: i + 1,
                type: 'fill_blank',
                text: `Question ${i + 1}`,
                placeholder: 'your answer'
            }))
        };
    }

    // Section 2 模板 - 选择题
    createSection2Template() {
        return {
            title: "Section 2",
            parts: [
                {
                    title: "Questions 11-14",
                    instructions: "Choose the correct letter, A, B or C.",
                    questions: Array.from({length: 4}, (_, i) => ({
                        id: i + 11,
                        type: 'radio',
                        text: `Question ${i + 11}`,
                        options: [
                            { value: 'A', text: 'Option A' },
                            { value: 'B', text: 'Option B' },
                            { value: 'C', text: 'Option C' }
                        ]
                    }))
                },
                {
                    title: "Questions 15-20", 
                    instructions: "Choose SIX answers from the box and write the correct letter A-J.",
                    questions: Array.from({length: 6}, (_, i) => ({
                        id: i + 15,
                        type: 'text',
                        text: `Question ${i + 15}`,
                        placeholder: 'A-J'
                    }))
                }
            ]
        };
    }

    // Section 3 模板 - 混合题型
    createSection3Template() {
        return {
            title: "Section 3",
            parts: [
                {
                    title: "Questions 21-25",
                    instructions: "Choose the correct letter, A, B or C.",
                    questions: Array.from({length: 5}, (_, i) => ({
                        id: i + 21,
                        type: 'radio',
                        text: `Question ${i + 21}`,
                        options: [
                            { value: 'A', text: 'Option A' },
                            { value: 'B', text: 'Option B' }, 
                            { value: 'C', text: 'Option C' }
                        ]
                    }))
                },
                {
                    title: "Questions 26-30",
                    instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
                    questions: Array.from({length: 5}, (_, i) => ({
                        id: i + 26,
                        type: 'fill_blank',
                        text: `Question ${i + 26}`,
                        placeholder: 'your answer'
                    }))
                }
            ]
        };
    }

    // Section 4 模板 - 填空题
    createSection4Template() {
        return {
            title: "Section 4",
            instructions: "Questions 31-40\nComplete the notes below.\nWrite NO MORE THAN TWO WORDS for each answer.",
            questions: Array.from({length: 10}, (_, i) => ({
                id: i + 31,
                type: 'fill_blank', 
                text: `Question ${i + 31}`,
                placeholder: 'your answer'
            }))
        };
    }

    // 渲染所有sections
    renderAllSections() {
        console.log('开始渲染所有sections...');
        
        for (let i = 1; i <= 4; i++) {
            this.renderSection(i);
        }

        // 统计渲染结果
        const totalInputs = document.querySelectorAll('.answer-input, input[type="radio"], input[type="checkbox"]').length;
        console.log(`✅ 渲染完成，共 ${totalInputs} 个输入控件`);

        // 显示成功消息
        this.showSuccessMessage(totalInputs);
    }

    // 渲染单个section
    renderSection(sectionNum) {
        const container = document.querySelector(`#section-${sectionNum} .questions`);
        if (!container) {
            console.warn(`Section ${sectionNum} 容器未找到`);
            return;
        }

        const sectionData = this.testData[`section${sectionNum}`];
        if (!sectionData) {
            console.warn(`Section ${sectionNum} 数据未找到`);
            return;
        }

        let html = `<h2 class="section-title">${sectionData.title}</h2>`;

        // 添加说明
        if (sectionData.instructions) {
            html += `<div class="instructions">${sectionData.instructions.replace(/\n/g, '<br>')}</div>`;
        }

        // 渲染题目
        if (sectionData.questions) {
            // 简单格式 - 直接是题目数组
            html += this.renderQuestionsList(sectionData.questions);
        } else if (sectionData.parts) {
            // 复合格式 - 包含多个部分
            sectionData.parts.forEach(part => {
                html += `<div class="part">`;
                if (part.title) html += `<h3>${part.title}</h3>`;
                if (part.instructions) html += `<div class="instructions">${part.instructions}</div>`;
                if (part.questions) html += this.renderQuestionsList(part.questions);
                html += `</div>`;
            });
        } else if (sectionData.formContent) {
            // 表单格式
            html += this.renderFormContent(sectionData.formContent);
        }

        // 添加提交按钮
        html += `<button class="submit-answers-btn" onclick="window.universalRenderer.submitAnswers()">提交第${sectionNum}部分答案</button>`;

        container.innerHTML = html;
        console.log(`✅ Section ${sectionNum} 渲染完成`);
    }

    // 渲染题目列表
    renderQuestionsList(questions) {
        return questions.map(q => {
            switch (q.type) {
                case 'fill_blank':
                    return `
                        <div class="question-item">
                            <label>${q.text || `${q.id}.`} 
                                <input type="text" name="q${q.id}" class="answer-input" data-question="${q.id}" placeholder="${q.placeholder || 'your answer'}">
                            </label>
                        </div>
                    `;
                case 'radio':
                    const options = q.options?.map(opt => 
                        `<label><input type="radio" name="q${q.id}" value="${opt.value}"> ${opt.value}. ${opt.text}</label>`
                    ).join('') || '';
                    return `
                        <div class="question-item">
                            <p><strong>${q.id}.</strong> ${q.text}</p>
                            <div class="options">${options}</div>
                        </div>
                    `;
                case 'text':
                    return `
                        <div class="question-item">
                            <label>${q.id}. ${q.text}: 
                                <input type="text" name="q${q.id}" class="answer-input" data-question="${q.id}" placeholder="${q.placeholder || 'your answer'}">
                            </label>
                        </div>
                    `;
                default:
                    return `
                        <div class="question-item">
                            <label>${q.id}. ${q.text || 'Question'} 
                                <input type="text" name="q${q.id}" class="answer-input" data-question="${q.id}" placeholder="your answer">
                            </label>
                        </div>
                    `;
            }
        }).join('');
    }

    // 渲染表单内容
    renderFormContent(formContent) {
        let html = `<div class="form-content">`;
        if (formContent.title) {
            html += `<h3>${formContent.title}</h3>`;
        }
        
        if (formContent.items) {
            formContent.items.forEach((item, index) => {
                const questionNum = index + 1;
                const text = item.text.replace(/\[(\d+)\]/g, `<input type="text" name="q$1" class="answer-input" data-question="$1" placeholder="your answer">`);
                html += `<div class="question-item"><label>${text}</label></div>`;
            });
        }
        html += `</div>`;
        return html;
    }

    // 绑定事件
    bindEvents() {
        // 绑定输入框事件
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('answer-input')) {
                const questionId = e.target.getAttribute('data-question') || e.target.name.replace('q', '');
                this.saveAnswer(questionId, e.target.value);
                e.target.classList.add('answered');
                e.target.closest('.question-item').classList.add('answered');
            }
        });

        // 绑定单选框事件
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                const questionId = e.target.name.replace('q', '');
                this.saveAnswer(questionId, e.target.value);
                e.target.closest('.question-item').classList.add('answered');
            }
        });

        // 绑定section切换事件
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSection(parseInt(tab.dataset.section));
            });
        });

        console.log('✅ 事件绑定完成');
    }

    // 切换section
    switchSection(sectionNum) {
        // 更新标签状态
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.classList.toggle('active', parseInt(tab.dataset.section) === sectionNum);
        });

        // 更新内容显示
        document.querySelectorAll('.section-content').forEach(content => {
            const contentSection = parseInt(content.dataset.section);
            content.style.display = contentSection === sectionNum ? 'block' : 'none';
            content.classList.toggle('active', contentSection === sectionNum);
        });

        console.log(`切换到 Section ${sectionNum}`);
    }

    // 保存答案
    saveAnswer(questionId, answer) {
        this.answers[questionId] = answer;
        const storageKey = `ielts-answers-${this.currentTest}`;
        localStorage.setItem(storageKey, JSON.stringify(this.answers));
        console.log(`保存答案: 题目${questionId} = ${answer}`);
    }

    // 加载已保存的答案
    loadSavedAnswers() {
        const storageKey = `ielts-answers-${this.currentTest}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            this.answers = JSON.parse(saved);
            // 恢复到界面
            Object.keys(this.answers).forEach(questionId => {
                const input = document.querySelector(`[data-question="${questionId}"], [name="q${questionId}"]`);
                if (input) {
                    if (input.type === 'radio') {
                        const radioInput = document.querySelector(`[name="q${questionId}"][value="${this.answers[questionId]}"]`);
                        if (radioInput) radioInput.checked = true;
                    } else {
                        input.value = this.answers[questionId];
                    }
                    input.classList.add('answered');
                    input.closest('.question-item')?.classList.add('answered');
                }
            });
        }
    }

    // 提交答案
    submitAnswers() {
        const answeredCount = Object.keys(this.answers).length;
        const totalQuestions = 40;
        
        if (answeredCount < totalQuestions / 2) {
            if (!confirm(`您只完成了 ${answeredCount} 道题（共${totalQuestions}题），确定要提交吗？`)) {
                return;
            }
        }

        this.showResults();
    }

    // 显示结果
    showResults() {
        const answeredCount = Object.keys(this.answers).length;
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 30px; border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000;
            max-width: 500px; max-height: 80vh; overflow-y: auto;
        `;
        
        resultDiv.innerHTML = `
            <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">
                ${this.currentTest.toUpperCase()} 测试完成！
            </h2>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold; color: #007bff;">
                    已答题数: ${answeredCount}/40
                </div>
                <div style="margin-top: 10px;">
                    完成度: ${Math.round((answeredCount/40)*100)}%
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4>您的答案：</h4>
                <div style="max-height: 200px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    ${Object.keys(this.answers).map(q => `<div>题目 ${q}: ${this.answers[q]}</div>`).join('')}
                </div>
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.remove()" style="
                    padding: 10px 20px; background: #28a745; color: white; border: none;
                    border-radius: 5px; cursor: pointer; margin-right: 10px;
                ">关闭</button>
                <button onclick="location.reload()" style="
                    padding: 10px 20px; background: #007bff; color: white; border: none;
                    border-radius: 5px; cursor: pointer;
                ">重新开始</button>
            </div>
        `;
        
        document.body.appendChild(resultDiv);
    }

    // 显示成功消息
    showSuccessMessage(inputCount) {
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #28a745; color: white; padding: 15px 20px;
                border-radius: 5px; z-index: 9999; font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            msg.innerHTML = `✅ ${this.currentTest.toUpperCase()} 题目加载成功！共 ${inputCount} 个控件`;
            document.body.appendChild(msg);
            
            setTimeout(() => msg.remove(), 4000);
        }, 500);
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 DOM加载完成，启动通用渲染器...');
    
    // 等待一下确保其他脚本加载完成
    setTimeout(async () => {
        window.universalRenderer = new UniversalTestRenderer();
        await window.universalRenderer.init();
        
        // 加载已保存的答案
        setTimeout(() => {
            window.universalRenderer.loadSavedAnswers();
        }, 1000);
    }, 800);
});

console.log('✅ 通用测试渲染系统加载完成');
