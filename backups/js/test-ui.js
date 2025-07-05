// 雅思听力分数转换表
const listeningScoreTable = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5, 32: 7.5,
    31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5,
    25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
    17: 5.0, 16: 5.0, 15: 5.0,
    14: 4.5, 13: 4.5, 12: 4.5, 11: 4.5,
    10: 4.0, 9: 4.0, 8: 4.0,
    7: 3.5, 6: 3.5, 5: 3.5,
    4: 3.0, 3: 3.0, 2: 3.0,
    1: 2.5, 0: 2.0
};

// 测试界面控制类
window.TestUI = class TestUI {
    constructor() {
        console.log('创建 TestUI 实例...');
        
        // 初始化属性
        this.currentSection = 1;
        this.testData = null;
        this.userAnswers = {};
        
        // 检查必要的全局变量
        if (typeof TEST_DATA === 'undefined') {
            throw new Error('TEST_DATA 未定义，请确保已加载 test-data.js');
        }
        
        if (typeof standardAnswers === 'undefined') {
            throw new Error('standardAnswers 未定义，请确保已加载 test-answers.js');
        }
        
        if (typeof getIeltsScore === 'undefined') {
            throw new Error('getIeltsScore 未定义，请确保已加载 test-answers.js');
        }
        
        // 初始化数据
        this.testData = TEST_DATA;
        console.log('测试数据加载成功');
        
        // 从本地存储加载用户答案
        const savedAnswers = localStorage.getItem('userAnswers');
        if (savedAnswers) {
            try {
                this.userAnswers = JSON.parse(savedAnswers);
                console.log('已加载保存的答案');
            } catch (error) {
                console.warn('加载保存的答案失败，将使用空答案');
                this.userAnswers = {};
            }
        }
        
        // 绑定事件
        this.bindEvents();
        console.log('事件绑定完成');
        
        // 渲染所有部分
        for (let i = 1; i <= 4; i++) {
            console.log(`开始渲染第 ${i} 部分...`);
            this.renderSection(i);
        }
        
        // 默认显示第一部分
        this.switchSection(1);
        
        console.log('TestUI 实例创建完成');
    }

    async init() {
        try {
            console.log('开始初始化测试界面...');
            
            // 加载测试数据
            await this.loadTestData();
            
            // 确保数据加载成功
            if (!this.testData) {
                throw new Error('测试数据加载失败');
            }
            console.log('测试数据加载成功:', this.testData);

            // 绑定事件
            this.bindEvents();
            console.log('事件绑定完成');
            
            // 渲染所有部分
            for (let i = 1; i <= 4; i++) {
                console.log(`开始渲染第 ${i} 部分...`);
                this.renderSection(i);
            }
            
            // 默认显示第一部分
            this.switchSection(1);
            
            console.log('测试界面初始化成功');
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('初始化测试失败，请刷新页面重试');
        }
    }

    async loadTestData() {
        try {
            // 直接使用全局的TEST_DATA常量
            if (typeof TEST_DATA === 'undefined') {
                throw new Error('TEST_DATA 未定义，请确保已加载 test-data.js');
            }
            
            this.testData = TEST_DATA;
            console.log('测试数据加载成功:', this.testData);
            
            // 从本地存储加载用户答案
            const savedAnswers = localStorage.getItem('userAnswers');
            if (savedAnswers) {
                this.userAnswers = JSON.parse(savedAnswers);
                console.log('已加载保存的答案:', this.userAnswers);
            }
        } catch (error) {
            console.error('加载测试数据失败:', error);
            throw error;
        }
    }

    /**
     * 绑定各种事件处理
     */
    bindEvents() {
        // 绑定部分切换事件
        const sectionTabs = document.querySelectorAll('.section-tab');
        sectionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionNumber = parseInt(tab.dataset.section);
                this.switchSection(sectionNumber);
            });
        });

        // 绑定表单提交事件
        const form = document.getElementById('test-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUserAnswers();
                alert('您的答案已保存！');
            });
        }

        // 绑定保存按钮事件
        const saveButtons = document.querySelectorAll('.submit-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.saveUserAnswers();
                alert('您的答案已保存！');
            });
        });

        // 绑定单选按钮和复选框事件
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                const questionId = radio.name.replace('q', '');
                this.userAnswers[questionId] = radio.value;
            });
        });

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const questionId = checkbox.name.replace('q', '');
                // 对于复选框，我们需要存储多个选中的值
                if (!this.userAnswers[questionId]) {
                    this.userAnswers[questionId] = [];
                }
                
                if (checkbox.checked) {
                    // 如果选中，添加到数组中
                    if (!this.userAnswers[questionId].includes(checkbox.value)) {
                        this.userAnswers[questionId].push(checkbox.value);
                    }
                } else {
                    // 如果取消选中，从数组中移除
                    this.userAnswers[questionId] = this.userAnswers[questionId].filter(v => v !== checkbox.value);
                }
            });
        });

        // 绑定关闭结果弹窗事件
        const closeResult = document.getElementById('close-result');
        if (closeResult) {
            closeResult.addEventListener('click', () => {
                const resultModal = document.getElementById('result-modal');
                resultModal.classList.remove('show');
            });
        }
        
        // 绑定重新测试按钮事件
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                const resultModal = document.getElementById('result-modal');
                resultModal.classList.remove('show');
                this.resetTest();
            });
        }

        // 绑定提交测试按钮
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                // 确认提交
                if (confirm('确定要提交测试并进行评分吗？')) {
                    this.submitTest();
                }
            });
        }
        
        // 绑定重置测试按钮
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetTest();
            });
        }
        
        // 检查是否已完成测试，如果是则显示评分结果
        const testCompleted = localStorage.getItem('testCompleted') === 'true';
        if (testCompleted) {
            const userAnswers = this.getUserAnswers();
            if (userAnswers) {
                // 重新计算并显示分数
                const scoreResult = this.calculateScore(userAnswers);
                this.showScoreResult(scoreResult);
            }
        }
    }

    saveUserAnswers() {
        // 保存文本输入框答案
        const inputs = document.querySelectorAll('.answer-input');
        inputs.forEach(input => {
            const questionId = input.dataset.question;
            if (questionId) {
                this.userAnswers[questionId] = input.value;
            }
        });

        // 保存单选按钮答案
        const checkedRadios = document.querySelectorAll('input[type="radio"]:checked');
        checkedRadios.forEach(radio => {
            const questionId = radio.name.replace('q', '');
            this.userAnswers[questionId] = radio.value;
        });

        // 保存复选框答案
        const checkboxGroups = {};
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const questionId = checkbox.name.replace('q', '');
            if (!checkboxGroups[questionId]) {
                checkboxGroups[questionId] = [];
            }
            if (checkbox.checked) {
                checkboxGroups[questionId].push(checkbox.value);
            }
        });

        // 将复选框组的答案保存到 userAnswers
        Object.keys(checkboxGroups).forEach(questionId => {
            this.userAnswers[questionId] = checkboxGroups[questionId];
        });

        // 保存到本地存储
        localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
    }

    renderSection(sectionNumber) {
        console.log(`开始渲染第 ${sectionNumber} 部分...`);
        
        const sectionData = this.testData[`section${sectionNumber}`];
        if (!sectionData) {
            console.error(`没有找到第 ${sectionNumber} 部分的数据`);
            return;
        }

        const sectionContainer = document.getElementById(`section-${sectionNumber}`);
        if (!sectionContainer) {
            console.error(`没有找到第 ${sectionNumber} 部分的容器`);
            return;
        }

        const questionsContainer = sectionContainer.querySelector('.questions');
        if (!questionsContainer) {
            console.error(`在第 ${sectionNumber} 部分中没有找到题目容器`);
            return;
        }

        // 清空现有内容
        questionsContainer.innerHTML = '';

        // 添加标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'section-title';
        titleDiv.innerHTML = sectionData.title || `Section ${sectionNumber}`;
        questionsContainer.appendChild(titleDiv);

        // 添加说明
        if (sectionData.instructions) {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'section-instructions';
            instructionsDiv.innerHTML = sectionData.instructions;
            questionsContainer.appendChild(instructionsDiv);
        }

        // Section 1 的特殊处理
        if (sectionNumber === 1 && sectionData.formContent) {
            this.renderFormContent(questionsContainer, sectionData.formContent);
        }

        // Section 2-4 的处理
        if (sectionData.parts) {
            sectionData.parts.forEach((part, index) => {
                this.renderPart(questionsContainer, part, index + 1);
            });
        }

        console.log(`第 ${sectionNumber} 部分渲染完成`);
    }

    renderFormContent(container, formContent) {
        const formDiv = document.createElement('div');
        formDiv.className = 'form-content';
        
        // 添加表单标题
        if (formContent.title) {
            const formTitleDiv = document.createElement('div');
            formTitleDiv.className = 'form-title';
            formTitleDiv.innerHTML = formContent.title;
            formDiv.appendChild(formTitleDiv);
        }
        
        // 添加表单项
        formContent.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'form-item';
            
            // 替换 [数字] 为输入框
            const text = item.text.replace(/\[(\d+)\]/g, (match, num) => {
                const value = this.userAnswers[num] || '';
                return `<input type="text" class="answer-input" data-question="${num}" value="${value}" />`;
            });
            
            itemDiv.innerHTML = text;
            formDiv.appendChild(itemDiv);
        });
        
        container.appendChild(formDiv);
    }

    renderPart(container, part, partIndex) {
        const partDiv = document.createElement('div');
        partDiv.className = 'question-part';
        
        // 添加部分标题
        if (part.title) {
            const partTitleDiv = document.createElement('div');
            partTitleDiv.className = 'part-title';
            partTitleDiv.innerHTML = part.title;
            partDiv.appendChild(partTitleDiv);
        }
        
        // 添加部分说明
        if (part.instructions) {
            const partInstructionsDiv = document.createElement('div');
            partInstructionsDiv.className = 'part-instructions';
            partInstructionsDiv.innerHTML = part.instructions;
            partDiv.appendChild(partInstructionsDiv);
        }
        
        // 添加地图内容（如果有）
        if (part.mapContent) {
            const mapDiv = document.createElement('div');
            mapDiv.className = 'map-content';
            mapDiv.innerHTML = `
                <h4>${part.mapContent.title}</h4>
                <img src="${part.mapContent.imageUrl}" alt="${part.mapContent.title}" />
            `;
            partDiv.appendChild(mapDiv);
        }

        // 添加选项框（如果有）
        if (part.boxContent) {
            const boxDiv = document.createElement('div');
            boxDiv.className = 'box-content';
            boxDiv.innerHTML = part.boxContent;
            partDiv.appendChild(boxDiv);
        }
        
        // 添加问题
        if (part.questions) {
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'questions-list';
            
            part.questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                
                // 添加问题文本
                const questionText = document.createElement('div');
                questionText.className = 'question-text';
                questionText.innerHTML = `${question.id}. ${question.text}`;
                questionDiv.appendChild(questionText);
                
                // 根据题目类型添加不同的答案输入方式
                if (question.type === 'radio') {
                    question.options.forEach(option => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option-item';
                        const checked = this.userAnswers[question.id] === option.value;
                        optionDiv.innerHTML = `
                            <input type="radio" name="q${question.id}" value="${option.value}" ${checked ? 'checked' : ''}>
                            <label>${option.value}. ${option.text}</label>
                        `;
                        questionDiv.appendChild(optionDiv);
                    });
                } else if (question.type === 'checkbox') {
                    question.options.forEach(option => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option-item';
                        const checked = this.userAnswers[question.id] && 
                                     Array.isArray(this.userAnswers[question.id]) && 
                                     this.userAnswers[question.id].includes(option.value);
                        optionDiv.innerHTML = `
                            <input type="checkbox" name="q${question.id}" value="${option.value}" ${checked ? 'checked' : ''}>
                            <label>${option.value}. ${option.text}</label>
                        `;
                        questionDiv.appendChild(optionDiv);
                    });
                } else if (question.type === 'text') {
                    const inputDiv = document.createElement('div');
                    inputDiv.className = 'text-input';
                    inputDiv.innerHTML = `
                        <input type="text" class="answer-input" data-question="${question.id}" 
                               value="${this.userAnswers[question.id] || ''}" 
                               placeholder="${question.placeholder || ''}">
                    `;
                    questionDiv.appendChild(inputDiv);
                }
                
                questionsDiv.appendChild(questionDiv);
            });
            
            partDiv.appendChild(questionsDiv);
        }
        
        container.appendChild(partDiv);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    switchSection(sectionNumber) {
        // 保存当前部分的用户答案
        this.saveUserAnswers();
        
        // 更新当前部分
        this.currentSection = sectionNumber;
        
        // 更新部分标签的活动状态
        const sectionTabs = document.querySelectorAll('.section-tab');
        sectionTabs.forEach(tab => {
            if (parseInt(tab.dataset.section) === sectionNumber) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 更新部分内容的显示状态
        const sectionContents = document.querySelectorAll('.section-content');
        sectionContents.forEach(content => {
            if (parseInt(content.dataset.section) === sectionNumber) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
        
        // 切换音频播放器
        if (window.testPlayer) {
            window.testPlayer.switchSection(sectionNumber);
        }
        
        // 渲染当前部分的内容
        this.renderCurrentSection();
    }

    renderCurrentSection() {
        // 获取当前部分的数据
        const sectionData = this.testData[`section${this.currentSection}`];
        if (!sectionData) {
            console.error(`Section ${this.currentSection} data not found`);
            return;
        }
        
        // 获取当前部分的容器
        const sectionContainer = document.querySelector(`.section-content[data-section="${this.currentSection}"]`);
        if (!sectionContainer) {
            console.error(`Section ${this.currentSection} container not found`);
            return;
        }
        
        // 清空容器
        const questionsContainer = sectionContainer.querySelector('.questions');
        if (!questionsContainer) {
            console.error(`Questions container for section ${this.currentSection} not found`);
            return;
        }
        
        questionsContainer.innerHTML = '';
        
        // 渲染标题
        const titleElement = document.createElement('h2');
        titleElement.className = 'section-title';
        titleElement.innerHTML = sectionData.title;
        questionsContainer.appendChild(titleElement);
        
        // 根据部分编号渲染不同的内容
        if (this.currentSection === 1) {
            this.renderSection1(sectionData, questionsContainer);
        } else if (this.currentSection === 2) {
            this.renderSection2(sectionData, questionsContainer);
        } else if (this.currentSection === 3) {
            this.renderSection3(sectionData, questionsContainer);
        } else if (this.currentSection === 4) {
            this.renderSection4(sectionData, questionsContainer);
        }
        
        // 添加提交按钮
        if (!questionsContainer.querySelector('.submit-answers-btn')) {
            const submitBtn = document.createElement('button');
            submitBtn.className = 'submit-answers-btn';
            submitBtn.textContent = '提交答案';
            submitBtn.type = 'button';
            submitBtn.addEventListener('click', () => this.submitAnswers());
            questionsContainer.appendChild(submitBtn);
        }
    }

    // 重置测试
    resetTest() {
        // 清空用户答案
        this.userAnswers = {};
        localStorage.removeItem('userAnswers');
        
        // 重新加载页面
        window.location.reload();
    }
    
    // 提交答案
    submitAnswers() {
        // 保存当前答案
        this.saveUserAnswers();
        
        // 计算分数
        const results = this.calculateScore();
        
        // 显示结果
        this.showResults(results);
    }
    
    // 计算分数
    calculateScore() {
        const standardAnswers = getStandardAnswers();
        const sectionResults = {
            section1: { total: 10, correct: 0 },
            section2: { total: 10, correct: 0 },
            section3: { total: 10, correct: 0 },
            section4: { total: 10, correct: 0 }
        };
        let totalCorrect = 0;
        
        // 遍历所有题目
        for (let i = 1; i <= 40; i++) {
            const userAnswer = this.userAnswers[i];
            const standardAnswer = standardAnswers[i];
            let isCorrect = false;
            
            // 如果用户没有回答，则跳过
            if (userAnswer === undefined || userAnswer === '') {
                continue;
            }
            
            // 根据题目类型进行比较
            if (Array.isArray(standardAnswer)) {
                // 多选题
                if (Array.isArray(userAnswer) && userAnswer.length === standardAnswer.length) {
                    // 检查用户选择的所有选项是否都在标准答案中
                    isCorrect = userAnswer.every(answer => standardAnswer.includes(answer)) &&
                                standardAnswer.every(answer => userAnswer.includes(answer));
                }
            } else {
                // 单选题或填空题
                if (typeof standardAnswer === 'string' && typeof userAnswer === 'string') {
                    isCorrect = userAnswer.toLowerCase() === standardAnswer.toLowerCase();
                }
            }
            
            // 更新分数
            if (isCorrect) {
                totalCorrect++;
                
                // 更新各部分分数
                if (i <= 10) {
                    sectionResults.section1.correct++;
                } else if (i <= 20) {
                    sectionResults.section2.correct++;
                } else if (i <= 30) {
                    sectionResults.section3.correct++;
                } else {
                    sectionResults.section4.correct++;
                }
            }
        }
        
        // 计算雅思分数
        const ieltsScore = getIeltsScore(totalCorrect);
        
        return {
            totalCorrect,
            ieltsScore,
            sectionResults
        };
    }
    
    // 显示结果
    showResults(results) {
        // 更新正确题数
        const correctCountElement = document.getElementById('correct-count');
        if (correctCountElement) {
            correctCountElement.textContent = results.totalCorrect;
        }
        
        // 更新雅思分数
        const ieltsScoreElement = document.getElementById('ielts-score');
        if (ieltsScoreElement) {
            ieltsScoreElement.textContent = results.ieltsScore.toFixed(1);
        }
        
        // 更新各部分得分
        const sectionResultsElement = document.getElementById('section-results');
        if (sectionResultsElement) {
            sectionResultsElement.innerHTML = '';
            
            // Section 1
            const section1Result = document.createElement('div');
            section1Result.className = 'section-result';
            section1Result.innerHTML = `
                <div class="section-name">Section 1</div>
                <div class="section-score">${results.sectionResults.section1.correct}/${results.sectionResults.section1.total}</div>
            `;
            sectionResultsElement.appendChild(section1Result);
            
            // Section 2
            const section2Result = document.createElement('div');
            section2Result.className = 'section-result';
            section2Result.innerHTML = `
                <div class="section-name">Section 2</div>
                <div class="section-score">${results.sectionResults.section2.correct}/${results.sectionResults.section2.total}</div>
            `;
            sectionResultsElement.appendChild(section2Result);
            
            // Section 3
            const section3Result = document.createElement('div');
            section3Result.className = 'section-result';
            section3Result.innerHTML = `
                <div class="section-name">Section 3</div>
                <div class="section-score">${results.sectionResults.section3.correct}/${results.sectionResults.section3.total}</div>
            `;
            sectionResultsElement.appendChild(section3Result);
            
            // Section 4
            const section4Result = document.createElement('div');
            section4Result.className = 'section-result';
            section4Result.innerHTML = `
                <div class="section-name">Section 4</div>
                <div class="section-score">${results.sectionResults.section4.correct}/${results.sectionResults.section4.total}</div>
            `;
            sectionResultsElement.appendChild(section4Result);
        }
        
        // 显示结果弹窗
        const resultModal = document.getElementById('result-modal');
        if (resultModal) {
            resultModal.classList.add('show');
        }
    }

    /**
     * 计算增强型评分结果
     * @param {Object} userAnswers - 用户答案对象
     * @returns {Object} - 评分结果对象
     */
    calculateScore(userAnswers) {
        const standardAnswers = this.getStandardAnswers();
        let totalScore = 0;
        let sectionScores = {
            section1: 0,
            section2: 0,
            section3: 0,
            section4: 0
        };
        
        // 详细分析数组
        let sectionAnalysis = {
            section1: [],
            section2: [],
            section3: [],
            section4: []
        };
        
        // 问题区域收集
        let problemAreas = [];
        
        // 统计数据
        let stats = {
            correct: 0,
            partial: 0,
            incorrect: 0,
            unanswered: 0,
            spellingErrors: 0
        };
        
        // 遍历标准答案
        for (const section in standardAnswers) {
            if (standardAnswers.hasOwnProperty(section)) {
                const sectionData = standardAnswers[section];
                
                // 遍历每个部分
                for (const partIndex in sectionData.parts) {
                    if (sectionData.parts.hasOwnProperty(partIndex)) {
                        const part = sectionData.parts[partIndex];
                        
                        // 遍历每个问题
                        for (const questionIndex in part.questions) {
                            if (part.questions.hasOwnProperty(questionIndex)) {
                                const question = part.questions[questionIndex];
                                const questionId = question.id;
                                const questionNumber = question.number;
                                const correctAnswer = question.answer;
                                const userAnswer = userAnswers[questionId] ? userAnswers[questionId] : '';
                                
                                // 使用增强评分进行对比
                                const { score, status, explanation } = this.enhancedCompareAnswer(correctAnswer, userAnswer, question.type);
                                
                                // 添加到部分分数
                                const sectionNumber = parseInt(section.replace('section', ''));
                                sectionScores[section] += score;
                                
                                // 添加到详细分析
                                sectionAnalysis[section].push({
                                    questionId,
                                    questionNumber,
                                    correctAnswer,
                                    userAnswer,
                                    score,
                                    status,
                                    explanation,
                                    type: question.type || 'text'
                                });
                                
                                // 更新统计
                                if (status === 'correct') {
                                    stats.correct++;
                                } else if (status === 'partial') {
                                    stats.partial++;
                                    
                                    // 添加部分得分问题区域
                                    if (question.type === 'checkbox') {
                                        problemAreas.push(`Section ${sectionNumber} 第${questionNumber}题: 多选题只选对了部分选项`);
                                    }
                                } else if (status === 'incorrect') {
                                    stats.incorrect++;
                                    
                                    // 添加到问题区域
                                    problemAreas.push(`Section ${sectionNumber} 第${questionNumber}题: 答案完全不正确`);
                                } else if (status === 'spelling_error') {
                                    stats.incorrect++;
                                    stats.spellingErrors++;
                                    
                                    // 添加到问题区域
                                    problemAreas.push(`Section ${sectionNumber} 第${questionNumber}题: 可能存在拼写错误，正确答案为 "${correctAnswer}"`);
                                } else if (status === 'unanswered') {
                                    stats.unanswered++;
                                    
                                    // 添加到问题区域
                                    if (stats.unanswered <= 3) { // 限制未回答的提示数量
                                        problemAreas.push(`Section ${sectionNumber} 第${questionNumber}题: 未作答`);
                                    }
                                }
                            }
                        }
                    }
                }
                
                // 四舍五入部分分数到一位小数
                sectionScores[section] = Math.round(sectionScores[section] * 10) / 10;
                
                // 添加到总分
                totalScore += sectionScores[section];
            }
        }
        
        // 四舍五入总分到一位小数
        totalScore = Math.round(totalScore * 10) / 10;
        
        // 转换为雅思分数带
        const bandScore = this.convertToBandScore(totalScore);
        
        // 限制问题区域显示数量
        if (problemAreas.length > 8) {
            problemAreas = problemAreas.slice(0, 8);
            problemAreas.push("还有其他问题，请查看详细分析...");
        }
        
        // 如果拼写错误过多，添加相关提示
        if (stats.spellingErrors >= 3) {
            problemAreas.unshift("存在多处拼写错误，建议加强单词拼写练习");
        }
        
        // 如果未回答题目过多，添加相关提示
        if (stats.unanswered >= 5) {
            problemAreas.unshift("有较多题目未作答，建议提高答题速度和时间管理");
        }
        
        return {
            totalScore,
            bandScore,
            sectionScores,
            sectionAnalysis,
            problemAreas,
            stats
        };
    }
    
    /**
     * 增强版答案比较
     * @param {String|Array} correctAnswer - 标准答案
     * @param {String|Array} userAnswer - 用户答案
     * @param {String} questionType - 问题类型
     * @returns {Object} - 比较结果
     */
    enhancedCompareAnswer(correctAnswer, userAnswer, questionType = 'text') {
        // 默认结果
        let result = {
            score: 0,
            status: 'incorrect',
            explanation: ''
        };
        
        // 未作答
        if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0) || userAnswer === '') {
            result.status = 'unanswered';
            result.explanation = '未作答';
            return result;
        }
        
        // 处理单选或填空题
        if (questionType === 'radio' || questionType === 'text' || !questionType) {
            // 处理同义词情况
            const synonyms = this.getSynonymAnswers();
            
            // 转换为小写并去除前后空格进行比较
            const normalizedCorrect = String(correctAnswer).toLowerCase().trim();
            const normalizedUser = String(userAnswer).toLowerCase().trim();
            
            // 完全匹配
            if (normalizedUser === normalizedCorrect) {
                result.score = 1;
                result.status = 'correct';
                result.explanation = '完全正确';
                return result;
            }
            
            // 检查同义词
            if (synonyms[normalizedCorrect] && synonyms[normalizedCorrect].includes(normalizedUser)) {
                result.score = 1;
                result.status = 'correct';
                result.explanation = `接受的同义词/变体: ${synonyms[normalizedCorrect].join(', ')}`;
                return result;
            }
            
            // 检查拼写错误
            const distance = this.levenshteinDistance(normalizedUser, normalizedCorrect);
            if (distance <= 1 && normalizedCorrect.length > 3) {
                result.score = 0;
                result.status = 'spelling_error';
                result.explanation = `可能是拼写错误，编辑距离: ${distance}`;
                return result;
            }
            
            // 完全不正确
            result.score = 0;
            result.status = 'incorrect';
            result.explanation = '答案不正确';
            return result;
        }
        
        // 处理多选题
        if (questionType === 'checkbox') {
            if (!Array.isArray(correctAnswer) || !Array.isArray(userAnswer)) {
                return result;
            }
            
            // 计算正确选项数
            let correctCount = 0;
            let incorrectCount = 0;
            
            // 检查用户选择的每个答案
            for (const option of userAnswer) {
                if (correctAnswer.includes(option)) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            }
            
            // 漏选的选项数
            const missedCount = correctAnswer.length - correctCount;
            
            // 根据权重计算分数
            const weights = this.getMultipleChoiceWeights();
            const weight = weights[correctAnswer.length] || 0.5;
            
            // 计算初始得分（正确选择得分）
            let score = correctCount * weight;
            
            // 错误选择扣分
            score = Math.max(0, score - (incorrectCount * weight));
            
            // 分数上限为1
            score = Math.min(1, score);
            
            // 四舍五入到两位小数
            score = Math.round(score * 100) / 100;
            
            // 确定状态
            if (score === 1) {
                result.status = 'correct';
                result.explanation = '所有选项均正确';
            } else if (score > 0) {
                result.status = 'partial';
                result.explanation = `选对${correctCount}项，错选${incorrectCount}项，漏选${missedCount}项`;
            } else {
                result.status = 'incorrect';
                result.explanation = '所有选择均不正确';
            }
            
            result.score = score;
            return result;
        }
        
        return result;
    }
    
    /**
     * 获取同义词答案映射
     * @returns {Object} - 同义词映射
     */
    getSynonymAnswers() {
        return {
            'reception': ['receptionist', 'reception desk', 'front desk'],
            'doctor': ['dr', 'dr.', 'physician'],
            'ticket': ['tickets', 'ticket counter', 'booking'],
            '18': ['eighteen', 'eighteen pounds', '18 pounds', '£18'],
            '25': ['twenty-five', 'twenty five', '25 pounds', '£25'],
            'may': ['may 2022', 'may 22'],
            'weekend': ['weekends', 'the weekend'],
            'certificate': ['certification', 'certificates'],
            'library': ['the library', 'central library'],
            'monday': ['mondays', 'monday morning', 'on monday'],
            'wilson': ['mr wilson', 'mr. wilson', 'prof wilson'],
            'lecture': ['lectures', 'the lecture', 'talk'],
            // 添加更多同义词...
        };
    }
    
    /**
     * 获取多选题权重
     * @returns {Object} - 权重映射
     */
    getMultipleChoiceWeights() {
        return {
            2: 0.5,  // 双选题每项0.5分
            3: 0.33, // 三选题每项0.33分
            4: 0.25  // 四选题每项0.25分
        };
    }
    
    /**
     * 计算Levenshtein距离 (编辑距离)
     * @param {String} a - 第一个字符串
     * @param {String} b - 第二个字符串
     * @returns {Number} - 编辑距离
     */
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
    
        const matrix = [];
    
        // 初始化矩阵
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
    
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
    
        // 填充矩阵
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // 替换
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j] + 1      // 删除
                    );
                }
            }
        }
    
        return matrix[b.length][a.length];
    }
    
    /**
     * 将原始分数转换为雅思分数带
     * @param {Number} rawScore - 原始分数 (0-40)
     * @returns {Number} - 雅思分数 (0-9)
     */
    convertToBandScore(rawScore) {
        // 获取转换表
        const scoreTable = listeningScoreTable;
        
        // 查找分数带
        for (const score in scoreTable) {
            if (rawScore == score) {
                return scoreTable[score];
            }
        }
        
        // 默认返回0
        return 0;
    }
    
    /**
     * 获取标准答案
     * @returns {Object} - 标准答案对象
     */
    getStandardAnswers() {
        return testAnswers;
    }
    
    /**
     * 获取用户答案
     * @returns {Object} - 用户答案对象
     */
    getUserAnswers() {
        const userAnswersJson = localStorage.getItem('userAnswers');
        return userAnswersJson ? JSON.parse(userAnswersJson) : null;
    }

    /**
     * 提交测试并评分
     */
    submitTest() {
        // 保存最终答案
        this.saveUserAnswers();
        
        // 获取用户答案和标准答案
        const userAnswers = this.getUserAnswers();
        
        if (!userAnswers) {
            alert('提交失败，请检查是否有答案记录！');
            return;
        }
        
        // 评分
        const scoreResult = this.calculateScore(userAnswers);
        
        // 显示评分结果
        this.showScoreResult(scoreResult);
        
        // 标记测试为已完成
        localStorage.setItem('testCompleted', 'true');
    }

    /**
     * 显示评分结果
     * @param {Object} scoreResult - 评分结果对象
     */
    showScoreResult(scoreResult) {
        // 使用新的评分结果显示组件
        const resultContainer = document.getElementById('test-container');
        const resultHTML = generateScoreResultHTML(scoreResult);
        
        // 隐藏测试UI
        document.getElementById('section-tabs').style.display = 'none';
        document.getElementById('audio-players').style.display = 'none';
        document.getElementById('test-content').style.display = 'none';
        document.getElementById('test-controls').style.display = 'none';
        
        // 显示结果
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.add('score-result-mode');
        
        // 设置结果页面的事件处理
        setupScoreResultEvents();
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }

    /**
     * 重置测试，清除答案和进度
     */
    resetTest() {
        if (confirm('确定要重新开始测试吗？所有答案和进度将被清除。')) {
            localStorage.removeItem('userAnswers');
            localStorage.removeItem('testCompleted');
            localStorage.removeItem('currentSection');
            localStorage.removeItem('audioProgress');
            window.location.href = 'test.html';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TestUI();
}); 