// 测试界面控制类
console.log('加载 test-ui.js...');
window.TestUI = class TestUI {
    constructor() {
        console.log('创建 TestUI 实例...');
        this.currentSection = 1;
        this.testData = null;
        this.userAnswers = {};
        this.init();
        console.log('TestUI 实例创建完成');
    }

    init() {
        console.log('正在初始化测试界面...');
        try {
            this.loadTestData();
            console.log('开始渲染各部分内容...');
            this.renderSection(1);
            this.renderSection(2);
            this.renderSection(3);
            this.renderSection(4);
            this.bindEvents();
            
            // 默认显示第一个section
            this.switchSection(1);
            console.log('测试界面初始化完成');
        } catch (error) {
            console.error('测试初始化失败:', error);
            alert('初始化失败：' + error.message);
        }
    }

    loadTestData() {
        try {
            // 直接使用全局的TEST_DATA变量
            if (typeof TEST_DATA === 'undefined') {
                throw new Error('TEST_DATA 未定义，确保已加载 test-data.js');
            }
            
            this.testData = TEST_DATA;
            console.log('测试数据加载成功', this.testData);
            
            // 检查数据格式并进行适配
            this.adaptDataFormat();
            
            // 从本地存储加载用户答案
            const savedAnswers = localStorage.getItem('userAnswers');
            if (savedAnswers) {
                this.userAnswers = JSON.parse(savedAnswers);
            }
        } catch (error) {
            console.error('加载测试数据失败:', error);
            throw error;
        }
    }

    // 数据格式适配方法
    adaptDataFormat() {
        console.log('开始适配数据格式...', this.testData);
        
        // 检查是否为剑桥雅思20格式 (sections数组)
        if (this.testData.sections && Array.isArray(this.testData.sections)) {
            console.log('检测到剑桥雅思20数据格式，正在转换...');
            
            // 保留原始的sections数组
            const originalSections = this.testData.sections;
            
            // 将sections数组转换为section1, section2的格式
            originalSections.forEach((section, index) => {
                const sectionKey = `section${section.id || (index + 1)}`;
                console.log(`转换 ${sectionKey}...`);
                
                // 直接复制section数据，保留questions_list
                const convertedSection = {
                    title: section.title,
                    subtitle: section.subtitle,
                    instructions: section.instructions,
                    questions: section.questions,
                    type: section.type,
                    questions_list: section.questions_list // 保留原始的questions_list
                };
                
                // 如果有content数组，也保留它
                if (section.content) {
                    convertedSection.content = section.content;
                }
                
                // 尝试转换为parts格式（可选）
                if (section.questions_list && section.questions_list.length > 0) {
                    convertedSection.parts = [{
                        title: `Questions ${section.questions}`,
                        instructions: section.instructions,
                        questions: section.questions_list.map(q => this.convertQuestion(q))
                    }];
                }
                
                this.testData[sectionKey] = convertedSection;
                console.log(`${sectionKey} 转换完成:`, convertedSection);
            });
            
            console.log('剑桥雅思20数据格式转换完成，可用sections:', Object.keys(this.testData).filter(k => k.startsWith('section')));
        } else {
            console.log('使用标准测试数据格式，当前数据结构:', Object.keys(this.testData));
        }
    }

    // 转换剑桥雅思20的section数据为标准格式
    convertCambridgeSection(section) {
        console.log(`转换Section ${section.id}:`, section);
        
        const convertedSection = {
            title: section.title,
            subtitle: section.subtitle,
            instructions: section.instructions,
            questions: section.questions,
            questions_list: section.questions_list  // 保留原始的questions_list
        };

        // 根据section数据结构进行不同的转换
        if (section.questions_list && section.questions_list.length > 0) {
            // Test 1-4格式：使用questions_list
            console.log(`Section ${section.id} 有 ${section.questions_list.length} 个题目`);
            convertedSection.parts = [{
                title: `Questions ${section.questions}`,
                instructions: section.instructions,
                questions: section.questions_list.map(q => this.convertQuestion(q))
            }];
        } else if (section.content && Array.isArray(section.content)) {
            // Test 4格式：使用content数组
            convertedSection.parts = section.content && Array.isArray(section.content) ? section.content.map(content => {
                const part = {
                    title: content.title || `Questions ${section.questions}`,
                    instructions: content.subtitle || section.instructions,
                    questions: []
                };

                if (content.type === 'form') {
                    // 处理填空题格式
                    part.questions = content.items && Array.isArray(content.items) ? content.items.map(item => ({
                        id: item.question,
                        type: 'text',
                        text: item.text.replace('________', '____'), // 标准化填空符号
                        answer: item.answer
                    })) : [];
                } else if (content.type === 'multiple_choice') {
                    // 处理选择题格式
                    part.questions = content.items && Array.isArray(content.items) ? content.items.map(item => ({
                        id: item.question,
                        type: 'radio',
                        text: item.text,
                        options: item.options.map(opt => ({
                            value: opt.value,
                            text: opt.text
                        })),
                        answer: item.answer
                    })) : [];
                } else if (content.type === 'matching') {
                    // 处理匹配题格式
                    part.questions = content.items && Array.isArray(content.items) ? content.items.map(item => ({
                        id: item.question,
                        type: 'radio',
                        text: item.text,
                        options: content.options.map(opt => ({
                            value: opt.value,
                            text: opt.text
                        })),
                        answer: item.answer
                    })) : [];
                }

                return part;
            }).filter(part => part.questions.length > 0) : []; // 过滤掉没有题目的部分
        } else {
            console.warn(`Section ${section.id} 没有questions_list或content`, section);
            // 创建一个空的parts数组，避免后续错误
            convertedSection.parts = [];
        }

        return convertedSection;
    }

    // 转换单个题目格式
    convertQuestion(question) {
        const converted = {
            id: question.id,
            type: this.mapQuestionType(question.type),
            text: question.text
        };

        if (question.options) {
            converted.options = question.options.map(opt => {
                if (typeof opt === 'string') {
                    return {
                        value: opt.charAt(0),
                        text: opt.substring(3) // 去掉 "A. " 部分
                    };
                }
                return opt;
            });
        }

        if (question.answer) {
            converted.answer = question.answer;
        }

        return converted;
    }

    // 映射题目类型
    mapQuestionType(type) {
        const typeMap = {
            'fill_blank': 'text',
            'multiple_choice': 'radio',
            'multi_select': 'checkbox',
            'matching': 'radio',
            'map_labeling': 'radio'
        };
        return typeMap[type] || type;
    }

    bindEvents() {
        // 绑定答案输入事件
        this.bindAnswerInputs();
        
        // 绑定Section切换标签事件
        const sectionTabs = document.querySelectorAll('.section-tab');
        sectionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const sectionNumber = parseInt(e.target.dataset.section);
                this.switchSection(sectionNumber);
            });
        });

        // 绑定单选按钮事件
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const questionId = parseInt(e.target.name.replace('q', ''));
                this.userAnswers[questionId] = e.target.value;
                
                // 更新本地存储
                localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
            });
        });

        // 绑定多选框事件（支持多选题）
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const questionName = e.target.name;
                const questionId = String(questionName.replace('q', '')); // 确保转换为字符串
                
                // 检查是否为多选题组（如"q25-26"）
                if (questionId.includes('-')) {
                    // 多选题组处理
                    const groupIds = questionId.split('-');
                    const firstId = parseInt(groupIds[0]);
                    const secondId = parseInt(groupIds[1]);
                    
                    if (!this.userAnswers[firstId]) this.userAnswers[firstId] = [];
                    if (!this.userAnswers[secondId]) this.userAnswers[secondId] = [];
                    
                    if (checkbox.checked) {
                        // 添加到两个题目的答案中
                        if (!this.userAnswers[firstId].includes(checkbox.value)) {
                            this.userAnswers[firstId].push(checkbox.value);
                        }
                        if (!this.userAnswers[secondId].includes(checkbox.value)) {
                            this.userAnswers[secondId].push(checkbox.value);
                        }
                    } else {
                        // 从两个题目的答案中移除
                        this.userAnswers[firstId] = this.userAnswers[firstId].filter(v => v !== checkbox.value);
                        this.userAnswers[secondId] = this.userAnswers[secondId].filter(v => v !== checkbox.value);
                    }
                } 
                // 常规题号处理
                else {
                    const qId = parseInt(questionId); // 转换为数字作为键
                    // 如果用户答案对象中没有这个题号的数组，初始化为空数组
                    if (!this.userAnswers[qId]) {
                        this.userAnswers[qId] = [];
                    }
                    
                    // 如果选中，添加到数组中
                    if (checkbox.checked) {
                        if (!this.userAnswers[qId].includes(checkbox.value)) {
                            this.userAnswers[qId].push(checkbox.value);
                        }
                    } else {
                        // 如果取消选中，从数组中移除
                        this.userAnswers[qId] = this.userAnswers[qId].filter(v => v !== checkbox.value);
                    }
                }
                
                // 更新本地存储
                localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
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
    }

    // 绑定答案输入事件
    bindAnswerInputs() {
        // 使用事件委托监听答案输入
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('answer-input')) {
                const questionId = parseInt(e.target.dataset.question);
                this.userAnswers[questionId] = e.target.value.trim();
                
                // 更新本地存储
                localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
                
                console.log(`题目${questionId}答案已保存: ${e.target.value}`);
            }
        });
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
            
            // 处理特殊题号格式，如 "25-26"
            if (questionId.includes('-')) {
                // 对于 "25-26" 这样的题号，分别保存到25和26
                const [firstId, secondId] = questionId.split('-');
                
                if (!checkboxGroups[questionId]) {
                    checkboxGroups[questionId] = [];
                }
                
                if (checkbox.checked) {
                    checkboxGroups[questionId].push(checkbox.value);
                }
                
                // 确保同时为两个题号保存相同的答案
                this.userAnswers[firstId] = this.userAnswers[secondId] = checkboxGroups[questionId];
            } else {
                // 常规题号处理
                if (!checkboxGroups[questionId]) {
                    checkboxGroups[questionId] = [];
                }
                
                if (checkbox.checked) {
                    checkboxGroups[questionId].push(checkbox.value);
                }
                
                this.userAnswers[questionId] = checkboxGroups[questionId];
            }
        });

        // 保存到本地存储
        localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
    }

    renderSection(sectionNumber) {
        console.log(`开始渲染Section ${sectionNumber}...`);
        
        const sectionData = this.testData[`section${sectionNumber}`];
        if (!sectionData) {
            console.error(`Section ${sectionNumber} not found in testData`, this.testData);
            // 显示错误信息给用户
            const sectionElement = document.getElementById(`section-${sectionNumber}`);
            if (sectionElement) {
                const questionsContainer = sectionElement.querySelector('.questions');
                if (questionsContainer) {
                    questionsContainer.innerHTML = `
                        <div class="error-message">
                            <h3>Section ${sectionNumber} 数据加载失败</h3>
                            <p>请刷新页面重试，或联系管理员。</p>
                            <p>调试信息：${JSON.stringify(Object.keys(this.testData))}</p>
                        </div>
                    `;
                }
            }
            return;
        }

        console.log(`Section ${sectionNumber} 数据:`, sectionData);

        // 查找问题容器
        const sectionElement = document.getElementById(`section-${sectionNumber}`);
        if (!sectionElement) {
            console.error(`Section element ${sectionNumber} not found`);
            return;
        }

        const questionsContainer = sectionElement.querySelector('.questions');
        if (!questionsContainer) {
            console.error(`Questions container for section ${sectionNumber} not found`);
            return;
        }

        questionsContainer.innerHTML = '';

        // 渲染标题
        const titleElement = document.createElement('h2');
        titleElement.className = 'section-title';
        titleElement.innerHTML = sectionData.title || `Section ${sectionNumber}`;
        questionsContainer.appendChild(titleElement);

        // 如果有subtitle，也渲染出来
        if (sectionData.subtitle) {
            const subtitleElement = document.createElement('h3');
            subtitleElement.className = 'section-subtitle';
            subtitleElement.innerHTML = sectionData.subtitle;
            questionsContainer.appendChild(subtitleElement);
        }

        console.log(`检查Section ${sectionNumber}的数据格式...`);
        console.log(`有questions_list: ${!!(sectionData.questions_list)}`);
        console.log(`有parts: ${!!(sectionData.parts)}`);

        // 优先检查是否为剑桥雅思20格式 - 直接检查questions_list
        if (sectionData.questions_list && Array.isArray(sectionData.questions_list) && sectionData.questions_list.length > 0) {
            console.log(`使用剑桥雅思20格式渲染Section ${sectionNumber}`);
            this.renderCambridgeQuestions(sectionData, questionsContainer);
        }
        // 检查是否为转换后的parts格式
        else if (sectionData.parts && Array.isArray(sectionData.parts) && sectionData.parts.length > 0) {
            console.log(`使用parts格式渲染Section ${sectionNumber}`);
            
            const firstPartFirstQuestion = sectionData.parts[0]?.questions?.[0];
            if (firstPartFirstQuestion) {
                if (firstPartFirstQuestion.type === 'text' || 
                    firstPartFirstQuestion.type === 'fill_blank' ||
                    (firstPartFirstQuestion.text && firstPartFirstQuestion.text.includes('____'))) {
                    this.renderCambridgeFillBlanks(sectionData, questionsContainer);
                } else if (firstPartFirstQuestion.type === 'radio' || 
                          firstPartFirstQuestion.type === 'multiple_choice') {
                    this.renderSection2(sectionData, questionsContainer);
                } else if (firstPartFirstQuestion.type === 'checkbox' ||
                          firstPartFirstQuestion.type === 'multi_select' || 
                          firstPartFirstQuestion.type === 'matching') {
                    this.renderSection3(sectionData, questionsContainer);
                } else {
                    console.log(`使用默认Section${sectionNumber}渲染方法`);
                    this[`renderSection${sectionNumber}`](sectionData, questionsContainer);
                }
            } else {
                console.log(`使用默认Section${sectionNumber}渲染方法`);
                this[`renderSection${sectionNumber}`](sectionData, questionsContainer);
            }
        }
        // 回退到原始渲染逻辑
        else {
            console.log(`使用默认Section${sectionNumber}渲染方法`);
            if (sectionNumber === 1) {
                this.renderSection1(sectionData, questionsContainer);
            } else if (sectionNumber === 2) {
                this.renderSection2(sectionData, questionsContainer);
            } else if (sectionNumber === 3) {
                this.renderSection3(sectionData, questionsContainer);
            } else if (sectionNumber === 4) {
                this.renderSection4(sectionData, questionsContainer);
            } else {
                // 如果都没有匹配，显示错误信息
                questionsContainer.innerHTML = `
                    <div class="error-message">
                        <h3>Section ${sectionNumber} 渲染失败</h3>
                        <p>无法识别数据格式，请联系开发者。</p>
                        <pre>${JSON.stringify(sectionData, null, 2).substring(0, 500)}...</pre>
                    </div>
                `;
                return;
            }
        }

        // 添加提交按钮
        if (!sectionElement.querySelector('.submit-answers-btn')) {
            const submitBtn = document.createElement('button');
            submitBtn.className = 'submit-answers-btn';
            submitBtn.textContent = '提交答案';
            submitBtn.type = 'button';
            submitBtn.addEventListener('click', () => this.submitAnswers());
            questionsContainer.appendChild(submitBtn);
        }

        console.log(`Section ${sectionNumber} 渲染完成`);
    }

    renderSection1(sectionData, container) {
        // 渲染说明
        if (sectionData.instructions) {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'range-and-instructions';
            
            const instructionsElement = document.createElement('div');
            instructionsElement.className = 'instructions';
            instructionsElement.innerHTML = sectionData.instructions;
            instructionsDiv.appendChild(instructionsElement);

            container.appendChild(instructionsDiv);
        }

        // 渲染表单内容
        if (sectionData.formContent) {
            const formContainer = document.createElement('div');
            formContainer.className = 'form-container';

            if (sectionData.formContent.title) {
                const formTitle = document.createElement('div');
                formTitle.className = 'form-title';
                formTitle.innerHTML = sectionData.formContent.title;
                formContainer.appendChild(formTitle);
            }

            const formContentDiv = document.createElement('div');
            formContentDiv.className = 'form-content';

            sectionData.formContent.items.forEach(item => {
                const p = document.createElement('p');
                
                // 处理带有问题编号的文本
                const text = item.text.replace(/\[(\d+)\]/g, (match, num) => {
                    return `<span class="answer-placeholder"><span class="question-number">${num}</span><input type="text" class="answer-input" data-question="${num}" value="${this.userAnswers[num] || ''}"></span>`;
                });
                
                if (item.type === 'bullet') {
                    p.className = 'bullet-point';
                }
                
                p.innerHTML = text;
                formContentDiv.appendChild(p);
            });

            formContainer.appendChild(formContentDiv);
            container.appendChild(formContainer);
        }
    }

    renderSection2(sectionData, container) {
        // 渲染多个部分
        if (sectionData.parts && sectionData.parts.length > 0) {
            sectionData.parts.forEach(part => {
                // 渲染部分标题
                const partTitleElement = document.createElement('div');
                partTitleElement.className = 'question-range';
                partTitleElement.innerHTML = part.title;
                container.appendChild(partTitleElement);

                // 渲染部分说明
                if (part.instructions) {
                    const instructionsElement = document.createElement('div');
                    instructionsElement.className = 'instructions';
                    instructionsElement.innerHTML = part.instructions;
                    container.appendChild(instructionsElement);
                }

                // 渲染选择题
                if (part.questions && part.questions.length > 0) {
                    if (part.questions[0].type === 'radio') {
                        const questionsDiv = document.createElement('div');
                        questionsDiv.className = 'radio-questions';

                        part.questions.forEach(question => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = 'question-item';

                            // 问题文本
                            const questionText = document.createElement('p');
                            questionText.className = 'question-text';
                            questionText.innerHTML = `<span class="question-number">${question.id}</span> ${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

                            if (question.options && Array.isArray(question.options)) {
                                question.options.forEach(option => {
                                const label = document.createElement('label');
                                label.className = 'option-item';

                                const radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.name = `q${question.id}`;
                                radio.value = option.value;
                                
                                // 如果有保存的答案，设置选中状态
                                if (this.userAnswers[question.id] === option.value) {
                                    radio.checked = true;
                                }

                                const optionText = document.createTextNode(` ${option.value} ${option.text}`);
                                
                                label.appendChild(radio);
                                label.appendChild(optionText);
                                optionsDiv.appendChild(label);
                            });
                            }

                            questionDiv.appendChild(optionsDiv);
                            questionsDiv.appendChild(questionDiv);
                        });

                        container.appendChild(questionsDiv);
                    } else if (part.questions[0].type === 'checkbox') {
                        const questionsDiv = document.createElement('div');
                        questionsDiv.className = 'checkbox-questions';

                        part.questions.forEach(question => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = 'question-item';

                            // 问题文本
                            const questionText = document.createElement('p');
                            questionText.className = 'question-text';
                            questionText.innerHTML = `${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

                            if (question.options && Array.isArray(question.options)) {
                                question.options.forEach(option => {
                                const label = document.createElement('label');
                                label.className = 'option-item';

                                const checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.name = `q${question.id}`;
                                checkbox.value = option.value;
                                
                                // 如果有保存的答案，设置选中状态
                                if (this.userAnswers[question.id] && 
                                    Array.isArray(this.userAnswers[question.id]) && 
                                    this.userAnswers[question.id].includes(option.value)) {
                                    checkbox.checked = true;
                                }

                                const optionText = document.createTextNode(` ${option.value} ${option.text}`);
                                
                                label.appendChild(checkbox);
                                label.appendChild(optionText);
                                optionsDiv.appendChild(label);
                            });
                            }

                            questionDiv.appendChild(optionsDiv);
                            questionsDiv.appendChild(questionDiv);
                        });

                        container.appendChild(questionsDiv);
                    }
                }

                // 渲染地图内容
                if (part.mapContent) {
                    const mapContainer = document.createElement('div');
                    mapContainer.className = 'map-container';

                    if (part.mapContent.title) {
                        const mapTitle = document.createElement('div');
                        mapTitle.className = 'map-title';
                        mapTitle.innerHTML = part.mapContent.title;
                        mapContainer.appendChild(mapTitle);
                    }

                    if (part.mapContent.imageUrl) {
                        const mapImage = document.createElement('img');
                        mapImage.src = part.mapContent.imageUrl;
                        mapImage.alt = 'Test Map';
                        mapImage.className = 'map-image';
                        mapContainer.appendChild(mapImage);
                    }

                    container.appendChild(mapContainer);
                }

                // 渲染选项框内容
                if (part.boxContent) {
                    const boxDiv = document.createElement('div');
                    boxDiv.className = 'box-content';
                    boxDiv.innerHTML = part.boxContent;
                    container.appendChild(boxDiv);
                }

                // 渲染文本输入题
                if (part.questions && part.questions.length > 0 && part.questions[0].type === 'text') {
                    const buildingsDiv = document.createElement('div');
                    buildingsDiv.className = 'buildings-list';
                    buildingsDiv.innerHTML = '<h3>Buildings</h3>';

                    const listDiv = document.createElement('div');
                    listDiv.className = 'form-content';

                    part.questions.forEach(question => {
                        const p = document.createElement('p');
                        p.innerHTML = `<span class="question-number">${question.id}</span> ${question.text} <span class="answer-placeholder"><input type="text" class="answer-input" data-question="${question.id}" placeholder="${question.placeholder}" value="${this.userAnswers[question.id] || ''}"></span>`;
                        listDiv.appendChild(p);
                    });

                    buildingsDiv.appendChild(listDiv);
                    container.appendChild(buildingsDiv);
                }
            });
        }
    }

    renderSection3(sectionData, container) {
        // 渲染多个部分
        if (sectionData.parts && sectionData.parts.length > 0) {
            sectionData.parts.forEach(part => {
                // 渲染部分标题
                const partTitleElement = document.createElement('div');
                partTitleElement.className = 'question-range';
                partTitleElement.innerHTML = part.title;
                container.appendChild(partTitleElement);

                // 渲染部分说明
                if (part.instructions) {
                    const instructionsElement = document.createElement('div');
                    instructionsElement.className = 'instructions';
                    instructionsElement.innerHTML = part.instructions;
                    container.appendChild(instructionsElement);
                }

                // 渲染选择题
                if (part.questions && part.questions.length > 0) {
                    if (part.questions[0].type === 'radio') {
                        const questionsDiv = document.createElement('div');
                        questionsDiv.className = 'radio-questions';

                        part.questions.forEach(question => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = 'question-item';

                            // 问题文本
                            const questionText = document.createElement('p');
                            questionText.className = 'question-text';
                            
                            // 处理题号范围 (如 "25-26")
                            let qidDisplay = String(question.id); // 确保转换为字符串
                            if (qidDisplay.includes('-')) {
                                qidDisplay = qidDisplay.replace('-', '&');
                            }
                            
                            questionText.innerHTML = `<span class="question-number">${qidDisplay}</span> ${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

                            if (question.options && Array.isArray(question.options)) {
                                question.options.forEach(option => {
                                const label = document.createElement('label');
                                label.className = 'option-item';

                                const radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.name = `q${question.id}`;
                                radio.value = option.value;
                                
                                // 如果有保存的答案，设置选中状态
                                if (this.userAnswers[question.id] === option.value) {
                                    radio.checked = true;
                                }

                                const optionText = document.createTextNode(` ${option.value} ${option.text}`);
                                
                                label.appendChild(radio);
                                label.appendChild(optionText);
                                optionsDiv.appendChild(label);
                            });
                            }

                            questionDiv.appendChild(optionsDiv);
                            questionsDiv.appendChild(questionDiv);
                        });

                        container.appendChild(questionsDiv);
                    } else if (part.questions[0].type === 'checkbox') {
                        const questionsDiv = document.createElement('div');
                        questionsDiv.className = 'checkbox-questions';

                        // 添加多选题说明提示
                        const multiChoiceHint = document.createElement('div');
                        multiChoiceHint.className = 'multi-choice-hint';
                        multiChoiceHint.innerHTML = `<strong>注意:</strong> 这是两题一组的多选题，您必须<strong>正好选择两个</strong>选项（不能多选或少选）。${part.title.replace(/<[^>]*>/g, '')}为一组，答对得2分，部分正确不得分。`;
                        questionsDiv.appendChild(multiChoiceHint);

                        part.questions.forEach(question => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = 'question-item';

                            // 问题文本 - 解析题号范围
                            const questionText = document.createElement('p');
                            questionText.className = 'question-text';
                            
                            // 处理题号范围 (如 "25-26")
                            let qidDisplay = String(question.id); // 确保转换为字符串
                            if (qidDisplay.includes('-')) {
                                qidDisplay = qidDisplay.replace('-', '&');
                            }
                            
                            questionText.innerHTML = `<span class="question-number">${qidDisplay}</span> ${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

                            if (question.options && Array.isArray(question.options)) {
                                question.options.forEach(option => {
                                const label = document.createElement('label');
                                label.className = 'option-item';

                                const checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.name = `q${question.id}`;
                                checkbox.value = option.value;
                                
                                // 如果有保存的答案，设置选中状态
                                if (this.userAnswers[question.id] && 
                                    Array.isArray(this.userAnswers[question.id]) && 
                                    this.userAnswers[question.id].includes(option.value)) {
                                    checkbox.checked = true;
                                }

                                const optionText = document.createTextNode(` ${option.value} ${option.text}`);
                                
                                label.appendChild(checkbox);
                                label.appendChild(optionText);
                                optionsDiv.appendChild(label);
                            });
                            }

                            questionDiv.appendChild(optionsDiv);
                            questionsDiv.appendChild(questionDiv);
                        });

                        container.appendChild(questionsDiv);
                    }
                }
            });
        }
    }

    renderSection4(sectionData, container) {
        // 渲染说明
        if (sectionData.instructions) {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'range-and-instructions';
            
            const instructionsElement = document.createElement('div');
            instructionsElement.className = 'instructions';
            instructionsElement.innerHTML = sectionData.instructions;
            instructionsDiv.appendChild(instructionsElement);

            container.appendChild(instructionsDiv);
        }

        // 渲染矩形框内容
        if (sectionData.boxContent) {
            const boxContainer = document.createElement('div');
            boxContainer.className = 'ielts-box-container';

            // 创建矩形框
            const boxContent = document.createElement('div');
            boxContent.className = 'ielts-box-content';

            // 添加标题（在框内居中）
            const titleDiv = document.createElement('div');
            titleDiv.className = 'box-title-center';
            titleDiv.textContent = sectionData.boxContent.title;
            boxContent.appendChild(titleDiv);

            // 渲染内容
            sectionData.boxContent.content.forEach(item => {
                switch (item.type) {
                    case 'header':
                        // 创建标题（如 1930s）
                        const headerElement = document.createElement('div');
                        headerElement.className = 'box-header';
                        headerElement.textContent = item.text;
                        boxContent.appendChild(headerElement);
                        break;
                        
                    case 'subheader':
                        // 创建子标题（如 Polythene – two main forms:）
                        const subheaderElement = document.createElement('div');
                        subheaderElement.className = 'box-subheader';
                        
                        // 处理加粗部分
                        if (item.text.includes(' – ')) {
                            const parts = item.text.split(' – ');
                            subheaderElement.innerHTML = `<strong>${parts[0]}</strong> – ${parts.slice(1).join(' – ')}`;
                        } else {
                            subheaderElement.innerHTML = `<strong>${item.text}</strong>`;
                        }
                        
                        boxContent.appendChild(subheaderElement);
                        break;
                        
                    case 'bullet-main':
                        // 创建主要项目符号（如 • LDPE –）
                        const bulletMainElement = document.createElement('div');
                        bulletMainElement.className = 'box-bullet-main';
                        
                        // 添加项目符号和加粗文本
                        bulletMainElement.innerHTML = `• <strong>${item.text}</strong>`;
                        boxContent.appendChild(bulletMainElement);
                        
                        // 添加描述
                        if (item.description) {
                            const descElement = document.createElement('div');
                            descElement.className = 'box-description';
                            
                            // 处理带有问题编号的文本
                            const processedDesc = item.description.replace(/\[(\d+)\] \......................../g, (match, num) => {
                                return `<span class="answer-placeholder"><span class="question-number">${num}</span><input type="text" class="answer-input" data-question="${num}" value="${this.userAnswers[num] || ''}"></span>`;
                            });
                            
                            descElement.innerHTML = processedDesc;
                            boxContent.appendChild(descElement);
                        }
                        
                        // 添加示例
                        if (item.examples) {
                            const exampleElement = document.createElement('div');
                            exampleElement.className = 'box-examples';
                            
                            // 处理带有问题编号的文本
                            const processedExample = item.examples.replace(/\[(\d+)\] \......................../g, (match, num) => {
                                return `<span class="answer-placeholder"><span class="question-number">${num}</span><input type="text" class="answer-input" data-question="${num}" value="${this.userAnswers[num] || ''}"></span>`;
                            });
                            
                            exampleElement.innerHTML = processedExample;
                            boxContent.appendChild(exampleElement);
                        }
                        break;
                        
                    case 'bullet-sub':
                        // 创建次要项目符号（如 • blown form...）
                        const bulletSubElement = document.createElement('div');
                        bulletSubElement.className = 'box-bullet-sub';
                        
                        // 处理带有问题编号的文本
                        const processedBulletText = item.text.replace(/\[(\d+)\] \......................../g, (match, num) => {
                            return `<span class="answer-placeholder"><span class="question-number">${num}</span><input type="text" class="answer-input" data-question="${num}" value="${this.userAnswers[num] || ''}"></span>`;
                        });
                        
                        bulletSubElement.innerHTML = `• ${processedBulletText}`;
                        boxContent.appendChild(bulletSubElement);
                        break;
                        
                    case 'text':
                        // 创建普通文本行（如 – popular for making...）
                        const textElement = document.createElement('div');
                        textElement.className = 'box-text';
                        
                        // 处理带有问题编号的文本
                        const processedText = item.text.replace(/\[(\d+)\] \......................../g, (match, num) => {
                            return `<span class="answer-placeholder"><span class="question-number">${num}</span><input type="text" class="answer-input" data-question="${num}" value="${this.userAnswers[num] || ''}"></span>`;
                        });
                        
                        textElement.innerHTML = processedText;
                        boxContent.appendChild(textElement);
                        break;
                        
                    case 'compound':
                        // 创建复合文本行（如 Teflon – non-stick）
                        const compoundElement = document.createElement('div');
                        compoundElement.className = 'box-compound';
                        
                        // 处理加粗部分和普通文本
                        compoundElement.innerHTML = `<strong>${item.bold}</strong><span class="spacer"></span>${item.text}`;
                        
                        boxContent.appendChild(compoundElement);
                        break;
                }
            });

            boxContainer.appendChild(boxContent);
            container.appendChild(boxContainer);
        }
    }

    // 渲染剑桥雅思20格式的填空题
    renderCambridgeFillBlanks(sectionData, container) {
        if (sectionData.parts && sectionData.parts[0]) {
            const part = sectionData.parts[0];
            
            // 添加进度指示器
            this.addProgressIndicator(container, part.questions || []);
            
            // 渲染说明
            if (part.instructions) {
                const instructionsDiv = document.createElement('div');
                instructionsDiv.className = 'instructions';
                instructionsDiv.innerHTML = part.instructions;
                container.appendChild(instructionsDiv);
            }

            // 渲染题目
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'fill-blank-questions';

            if (part.questions && Array.isArray(part.questions)) {
                part.questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                
                // 检查是否已回答
                if (this.userAnswers[question.id]) {
                    questionDiv.classList.add('answered');
                }

                const questionP = document.createElement('p');
                // 处理不同的填空符号格式：____ 或 ________
                let questionText = question.text.replace(/____+/g, 
                    `<input type="text" class="answer-input fill-blank-input" data-question="${question.id}" value="${this.userAnswers[question.id] || ''}" placeholder="您的答案">`);
                
                // 如果没有找到填空符号，检查是否在题目末尾需要添加输入框
                if (!questionText.includes('<input') && questionText.includes('Question ' + question.id + ':')) {
                    questionText = questionText.replace(':', ': <input type="text" class="answer-input fill-blank-input" data-question="' + question.id + '" value="' + (this.userAnswers[question.id] || '') + '" placeholder="您的答案">');
                }
                
                questionP.innerHTML = `
                    <span class="question-number">${question.id}</span>
                    <span class="question-type-badge fill-blank">填空</span>
                    ${questionText}
                `;
                
                questionDiv.appendChild(questionP);
                questionsDiv.appendChild(questionDiv);
            });
            }

            container.appendChild(questionsDiv);
            
            // 绑定输入框事件
            this.bindFillBlankEvents(container);
        }
    }

    // 添加进度指示器
    addProgressIndicator(container, questions) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'section-progress';
        
        const answeredCount = questions.filter(q => this.userAnswers[q.id]).length;
        const totalCount = questions.length;
        const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
        
        progressDiv.innerHTML = `
            <div class="progress-text">已完成: ${answeredCount}/${totalCount}</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">${Math.round(progressPercent)}%</div>
        `;
        
        container.appendChild(progressDiv);
    }
    
    // 绑定填空题事件
    bindFillBlankEvents(container) {
        const inputs = container.querySelectorAll('.fill-blank-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const questionId = e.target.dataset.question;
                const value = e.target.value.trim();
                
                // 更新用户答案
                if (value) {
                    this.userAnswers[questionId] = value;
                    e.target.classList.add('answered');
                    e.target.closest('.question-item').classList.add('answered');
                } else {
                    delete this.userAnswers[questionId];
                    e.target.classList.remove('answered');
                    e.target.closest('.question-item').classList.remove('answered');
                }
                
                // 更新进度指示器
                this.updateProgressIndicator(container);
                
                // 保存答案
                this.saveUserAnswers();
            });
            
            input.addEventListener('blur', (e) => {
                // 失去焦点时自动保存
                this.saveUserAnswers();
            });
        });
    }
    
    // 绑定选择题事件
    bindChoiceEvents(container) {
        // 绑定单选题
        const radioInputs = container.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const questionId = e.target.name.replace('q', '');
                const value = e.target.value;
                
                // 更新用户答案
                this.userAnswers[questionId] = value;
                
                // 更新视觉状态
                const questionItem = e.target.closest('.question-item');
                questionItem.classList.add('answered');
                
                // 更新进度指示器
                this.updateProgressIndicator(container);
                
                // 保存答案
                this.saveUserAnswers();
            });
        });
        
        // 绑定多选题
        const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const questionId = e.target.name.replace('q', '');
                const value = e.target.value;
                
                // 获取当前答案数组
                let currentAnswers = this.userAnswers[questionId];
                if (!Array.isArray(currentAnswers)) {
                    currentAnswers = [];
                }
                
                // 更新答案数组
                if (e.target.checked) {
                    if (!currentAnswers.includes(value)) {
                        currentAnswers.push(value);
                    }
                } else {
                    const index = currentAnswers.indexOf(value);
                    if (index > -1) {
                        currentAnswers.splice(index, 1);
                    }
                }
                
                // 更新用户答案
                if (currentAnswers.length > 0) {
                    this.userAnswers[questionId] = currentAnswers;
                } else {
                    delete this.userAnswers[questionId];
                }
                
                // 更新视觉状态
                const questionItem = e.target.closest('.question-item');
                if (currentAnswers.length > 0) {
                    questionItem.classList.add('answered');
                } else {
                    questionItem.classList.remove('answered');
                }
                
                // 更新进度指示器
                this.updateProgressIndicator(container);
                
                // 保存答案
                this.saveUserAnswers();
            });
        });
        
        // 绑定填空题（如果有的话）
        this.bindFillBlankEvents(container);
    }
    
    // 更新进度指示器
    updateProgressIndicator(container) {
        const progressDiv = container.querySelector('.section-progress');
        if (!progressDiv) return;
        
        const inputs = container.querySelectorAll('.answer-input');
        const answeredCount = Array.from(inputs).filter(input => input.value.trim()).length;
        const totalCount = inputs.length;
        const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
        
        const progressText = progressDiv.querySelectorAll('.progress-text');
        const progressBar = progressDiv.querySelector('.progress-bar-fill');
        
        if (progressText[0]) progressText[0].textContent = `已完成: ${answeredCount}/${totalCount}`;
        if (progressText[1]) progressText[1].textContent = `${Math.round(progressPercent)}%`;
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
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
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                content.classList.remove('active');
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
        // 使用全局变量或测试数据中的答案
        let correctAnswers = null;
        
        if (typeof standardAnswers !== 'undefined') {
            correctAnswers = standardAnswers;
        } else if (this.testData && this.testData.answers) {
            correctAnswers = this.testData.answers;
        } else {
            console.error('标准答案未定义，无法计算分数');
            return { totalCorrect: 0, ieltsScore: 0, sectionResults: {} };
        }
        
        console.log('开始计算分数...', { correctAnswers, userAnswers: this.userAnswers });
        
        const sectionResults = {
            section1: { total: 10, correct: 0, details: [] },
            section2: { total: 10, correct: 0, details: [] },
            section3: { total: 10, correct: 0, details: [] },
            section4: { total: 10, correct: 0, details: [] }
        };
        
        let totalCorrect = 0;
        
        // 遍历所有40题进行通用评分
        for (let i = 1; i <= 40; i++) {
            const userAnswer = this.userAnswers[i];
            const correctAnswer = correctAnswers[i - 1]; // 数组索引从0开始
            
            // 确定题目所属section
            let sectionKey = 'section1';
            if (i >= 11 && i <= 20) sectionKey = 'section2';
            else if (i >= 21 && i <= 30) sectionKey = 'section3';
            else if (i >= 31 && i <= 40) sectionKey = 'section4';
            
            let isCorrect = false;
            
            if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                // 处理不同类型的答案比较
                if (Array.isArray(userAnswer)) {
                    // 多选题答案
                    if (Array.isArray(correctAnswer)) {
                        isCorrect = this.compareArrayAnswers(userAnswer, correctAnswer);
                    } else {
                        // 用户给出数组但标准答案是单个值，检查是否包含
                        isCorrect = userAnswer.includes(correctAnswer);
                    }
                } else if (Array.isArray(correctAnswer)) {
                    // 标准答案是数组但用户答案是单个值
                    isCorrect = correctAnswer.includes(userAnswer);
                } else {
                    // 单选题或填空题答案
                    isCorrect = this.compareAnswers(userAnswer, correctAnswer);
                }
            }
            
            // 记录详细结果
            sectionResults[sectionKey].details.push({
                questionId: i,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            });
            
            if (isCorrect) {
                sectionResults[sectionKey].correct++;
                totalCorrect++;
            }
            
            console.log(`题目${i} (${sectionKey}): 用户答案=${userAnswer}, 标准答案=${correctAnswer}, 正确=${isCorrect}`);
        }
        
        // 计算雅思分数（简化的分数表）
        const ieltsScore = this.calculateIeltsScore(totalCorrect);
        
        // 输出最终得分信息
        console.log("===== 最终得分 =====");
        console.log(`总分: ${totalCorrect}/40`);
        console.log(`雅思分数: ${ieltsScore}`);
        console.log('各部分详情:', sectionResults);
        
        return {
            totalCorrect,
            ieltsScore,
            sectionResults,
            maxScore: 40
        };
    }
    
    // 计算雅思听力分数
    calculateIeltsScore(correctCount) {
        // 雅思听力评分表（简化版）
        const scoreTable = {
            39: 9.0, 38: 8.5, 37: 8.5, 36: 8.0, 35: 8.0,
            34: 7.5, 33: 7.5, 32: 7.0, 31: 7.0, 30: 6.5,
            29: 6.5, 28: 6.0, 27: 6.0, 26: 6.0, 25: 5.5,
            24: 5.5, 23: 5.5, 22: 5.0, 21: 5.0, 20: 5.0,
            19: 4.5, 18: 4.5, 17: 4.0, 16: 4.0, 15: 4.0,
            14: 3.5, 13: 3.5, 12: 3.0, 11: 3.0, 10: 3.0
        };
        
        return scoreTable[correctCount] || (correctCount < 10 ? 2.5 : 2.5);
    }
    
    // 显示结果
    showResults(results) {
        console.log('显示测试结果:', results);

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
            
            // 获取单选题和多选题的得分情况
            const singleCorrect = results.sectionDetailCorrect?.section3?.singleChoice || 0;
            const multiCorrect = results.sectionDetailCorrect?.section3?.multiChoice || 0; 
            
            console.log(`Section 3 详细得分 - 单选题: ${singleCorrect}/4, 多选题: ${multiCorrect}/6`);
            
            section3Result.innerHTML = `
                <div class="section-name">Section 3</div>
                <div class="section-score">${singleCorrect + multiCorrect}/${results.sectionResults.section3.total}</div>
                <div class="section-detail">
                    <div class="detail-item">单选题: ${singleCorrect}/4</div>
                    <div class="detail-item">多选题: ${multiCorrect}/6 (${multiCorrect/2}组)</div>
                </div>
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
            
            // 添加详细分数提示
            const scoreDetail = document.createElement('div');
            scoreDetail.className = 'score-detail-note';
            scoreDetail.innerHTML = `
                <p>总得分: ${results.totalCorrect}/40</p>
                <p>详细得分: Section 1 (${results.sectionResults.section1.correct}) + 
                    Section 2 (${results.sectionResults.section2.correct}) + 
                    Section 3 (${singleCorrect + multiCorrect}) + 
                    Section 4 (${results.sectionResults.section4.correct})</p>
            `;
            sectionResultsElement.appendChild(scoreDetail);
        }
        
        // 显示结果弹窗
        const resultModal = document.getElementById('result-modal');
        if (resultModal) {
            resultModal.classList.add('show');
        }
    }

    // 增强的答案比较方法
    enhancedCompareAnswer(userAnswer, standardAnswer) {
        // 如果两者类型不同，尝试转换
        if (typeof userAnswer !== typeof standardAnswer) {
            // 将数字转为字符串比较
            if (typeof userAnswer === 'number') {
                userAnswer = String(userAnswer);
            }
            if (typeof standardAnswer === 'number') {
                standardAnswer = String(standardAnswer);
            }
        }
        
        // 处理数组类型（多选题）
        if (Array.isArray(standardAnswer)) {
            return this.checkMultipleChoiceAnswer(userAnswer, standardAnswer);
        }
        
        // 处理字符串类型（单选题、填空题）
        if (typeof standardAnswer === 'string') {
            if (typeof userAnswer !== 'string' && typeof userAnswer !== 'number') {
                return false; // 无法比较的类型
            }
            
            // 标准化字符串
            const stdStr = this.normalizeString(standardAnswer);
            const userStr = this.normalizeString(String(userAnswer));
            
            // 直接比较标准化后的字符串
            if (stdStr === userStr) {
                return true;
            }
            
            // 尝试更宽松的比较（去除所有空格和标点符号）
            const strictNormalize = (str) => {
                return str.replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
            };
            
            return strictNormalize(stdStr) === strictNormalize(userStr);
        }
        
        // 默认情况，简单的全等比较
        return userAnswer === standardAnswer;
    }
    
    // 多选题判断逻辑
    checkMultipleChoiceAnswer(userAnswer, correctAnswer) {
        console.log('多选题判断开始:', 
            '用户答案=', JSON.stringify(userAnswer), 
            '标准答案=', JSON.stringify(correctAnswer));
        
        // 1. 验证用户答案是否为数组
        if (!Array.isArray(userAnswer)) {
            console.log('用户答案不是数组，多选题判断失败');
            return false;
        }
        
        // 2. 检查用户答案数量是否与正确答案数量相同
        if (userAnswer.length !== correctAnswer.length) {
            console.log(`用户答案数量(${userAnswer.length})与标准答案数量(${correctAnswer.length})不同，多选题判断失败`);
            return false;
        }
        
        // 3. 标准化答案，转换为小写并去除空格
        const normalizedStdAnswers = correctAnswer.map(ans => 
            this.normalizeString(String(ans)));
        const normalizedUserAnswers = userAnswer.map(ans => 
            this.normalizeString(String(ans)));
            
        console.log('标准化后的标准答案:', normalizedStdAnswers);
        console.log('标准化后的用户答案:', normalizedUserAnswers);
            
        // 4. 检查用户所有选项是否都在正确答案中
        for (const answer of normalizedUserAnswers) {
            if (!normalizedStdAnswers.includes(answer)) {
                console.log('用户选择了错误选项:', answer);
                return false;
            }
        }
        
        // 5. 检查正确答案是否都被用户选择
        for (const answer of normalizedStdAnswers) {
            if (!normalizedUserAnswers.includes(answer)) {
                console.log('用户漏选了正确选项:', answer);
                return false;
            }
        }
        
        // 6. 无序比较：排序后检查是否完全一致
        const sortedStdAnswers = [...normalizedStdAnswers].sort();
        const sortedUserAnswers = [...normalizedUserAnswers].sort();
        
        // 转换为字符串进行比较
        const stdAnswerStr = sortedStdAnswers.join(',');
        const userAnswerStr = sortedUserAnswers.join(',');
        
        if (stdAnswerStr !== userAnswerStr) {
            console.log('排序后答案不一致:',
                '标准答案=', stdAnswerStr,
                '用户答案=', userAnswerStr);
            return false;
        }
        
        console.log('多选题判断通过');
        return true;
    }
    
    // 标准化字符串（转小写、去除前后空格）
    normalizeString(str) {
        return str.toLowerCase().trim();
    }

    // 新增：渲染剑桥雅思20格式的题目
    renderCambridgeQuestions(sectionData, container) {
        console.log('开始渲染剑桥雅思20格式题目:', sectionData);
        
        // 渲染说明
        if (sectionData.instructions) {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'instructions';
            instructionsDiv.innerHTML = sectionData.instructions;
            container.appendChild(instructionsDiv);
        }

        // 按题目类型分组渲染
        const questions = sectionData.questions_list;
        if (!questions || questions.length === 0) {
            console.warn('No questions found in section', sectionData);
            // 显示错误信息给用户
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <p>该部分暂无题目数据。</p>
                <p>调试信息：questions_list长度=${questions ? questions.length : 'undefined'}</p>
            `;
            container.appendChild(errorDiv);
            return;
        }

        console.log(`找到 ${questions.length} 个题目`);

        // 检查第一个题目的类型来决定渲染方式
        const firstQuestion = questions[0];
        console.log('第一个题目:', firstQuestion);
        
        if (firstQuestion.type === 'fill_blank') {
            console.log('渲染填空题');
            // 填空题渲染
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'fill-blank-questions';

            questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';

                const questionText = document.createElement('p');
                questionText.className = 'question-text';
                
                // 将答案位置替换为输入框
                let textWithInput = question.text;
                
                // 处理不同的填空符号格式
                if (textWithInput.includes('____')) {
                    textWithInput = textWithInput.replace(/____+/g, 
                        `<span class="answer-placeholder">
                            <input type="text" class="answer-input" data-question="${question.id}" value="${this.userAnswers[question.id] || ''}" placeholder="输入答案">
                        </span>`
                    );
                } else {
                    // 如果没有填空符，在题目末尾添加输入框
                    textWithInput += ` <span class="answer-placeholder">
                        <input type="text" class="answer-input" data-question="${question.id}" value="${this.userAnswers[question.id] || ''}" placeholder="输入答案">
                    </span>`;
                }
                
                questionText.innerHTML = `<span class="question-number">${question.id}</span> ${textWithInput}`;
                questionDiv.appendChild(questionText);
                questionsDiv.appendChild(questionDiv);
            });

            container.appendChild(questionsDiv);
        } 
        else if (firstQuestion.type === 'multiple_choice' || firstQuestion.type === 'matching') {
            console.log('渲染选择题');
            // 选择题和匹配题渲染
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'radio-questions';

            questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';

                // 问题文本
                const questionText = document.createElement('p');
                questionText.className = 'question-text';
                questionText.innerHTML = `<span class="question-number">${question.id}</span> ${question.text}`;
                questionDiv.appendChild(questionText);

                // 选项
                if (question.options && question.options.length > 0) {
                    const optionsDiv = document.createElement('div');
                    optionsDiv.className = 'options-list';

                    question.options.forEach(option => {
                        const label = document.createElement('label');
                        label.className = 'option-item';

                        const radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.name = `q${question.id}`;
                        
                        // 提取选项值 (A, B, C, etc.)
                        let optionValue = '';
                        let optionText = '';
                        
                        if (typeof option === 'string') {
                            // 格式如 "A. text"
                            optionValue = option.charAt(0);
                            optionText = option;
                        } else if (option.value && option.text) {
                            optionValue = option.value;
                            optionText = `${option.value}. ${option.text}`;
                        } else {
                            optionValue = option;
                            optionText = option;
                        }
                        
                        radio.value = optionValue;
                        
                        // 如果有保存的答案，设置选中状态
                        if (this.userAnswers[question.id] === optionValue) {
                            radio.checked = true;
                        }

                        const optionTextNode = document.createTextNode(` ${optionText}`);
                        
                        label.appendChild(radio);
                        label.appendChild(optionTextNode);
                        optionsDiv.appendChild(label);
                    });

                    questionDiv.appendChild(optionsDiv);
                } else {
                    console.warn(`题目 ${question.id} 没有选项`);
                }

                questionsDiv.appendChild(questionDiv);
            });

            container.appendChild(questionsDiv);
        }
        else if (firstQuestion.type === 'multi_select') {
            console.log('渲染多选题');
            // 多选题渲染
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'checkbox-questions';

            // 添加多选题说明提示
            const multiChoiceHint = document.createElement('div');
            multiChoiceHint.className = 'multi-choice-hint';
            multiChoiceHint.innerHTML = `<strong>注意:</strong> 这是多选题，请选择正确的选项。每题可能需要选择多个答案。`;
            questionsDiv.appendChild(multiChoiceHint);

            questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';

                // 问题文本
                const questionText = document.createElement('p');
                questionText.className = 'question-text';
                questionText.innerHTML = `<span class="question-number">${question.id}</span> ${question.text}`;
                questionDiv.appendChild(questionText);

                // 选项
                if (question.options && question.options.length > 0) {
                    const optionsDiv = document.createElement('div');
                    optionsDiv.className = 'options-list';

                    question.options.forEach(option => {
                        const label = document.createElement('label');
                        label.className = 'option-item';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = `q${question.id}`;
                        
                        // 提取选项值
                        let optionValue = '';
                        let optionText = '';
                        
                        if (typeof option === 'string') {
                            optionValue = option.charAt(0);
                            optionText = option;
                        } else if (option.value && option.text) {
                            optionValue = option.value;
                            optionText = `${option.value}. ${option.text}`;
                        } else {
                            optionValue = option;
                            optionText = option;
                        }
                        
                        checkbox.value = optionValue;
                        
                        // 如果有保存的答案，设置选中状态
                        if (this.userAnswers[question.id] && 
                            Array.isArray(this.userAnswers[question.id]) && 
                            this.userAnswers[question.id].includes(optionValue)) {
                            checkbox.checked = true;
                        }

                        const optionTextNode = document.createTextNode(` ${optionText}`);
                        
                        label.appendChild(checkbox);
                        label.appendChild(optionTextNode);
                        optionsDiv.appendChild(label);
                    });

                    questionDiv.appendChild(optionsDiv);
                } else {
                    console.warn(`题目 ${question.id} 没有选项`);
                }

                questionsDiv.appendChild(questionDiv);
            });

            container.appendChild(questionsDiv);
        } else {
            console.warn(`未识别的题目类型: ${firstQuestion.type}`);
            // 通用渲染逻辑
            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'generic-questions';
            
            // 添加进度指示器
            this.addProgressIndicator(container, questions);
            
            questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                
                // 检查是否已回答
                if (this.userAnswers[question.id]) {
                    questionDiv.classList.add('answered');
                }
                
                // 确定题目类型徽章
                const questionType = question.type || (question.options ? 'multiple-choice' : 'fill-blank');
                const typeText = {
                    'fill_blank': '填空',
                    'multiple_choice': '单选',
                    'multi_select': '多选',
                    'matching': '匹配'
                }[questionType] || '未知';
                const typeClass = {
                    'fill_blank': 'fill-blank',
                    'multiple_choice': 'multiple-choice',
                    'multi_select': 'multi-select',
                    'matching': 'matching'
                }[questionType] || 'multiple-choice';
                
                const questionText = document.createElement('p');
                questionText.innerHTML = `
                    <span class="question-number">${question.id}</span>
                    <span class="question-type-badge ${typeClass}">${typeText}</span>
                    ${question.text}
                `;
                questionDiv.appendChild(questionText);
                
                // 如果有选项，显示为选择题
                if (question.options && question.options.length > 0) {
                    const optionsDiv = document.createElement('div');
                    optionsDiv.className = question.type === 'matching' ? 'options-list matching-questions' : 'options-list';
                    
                    question.options.forEach(option => {
                        const label = document.createElement('label');
                        label.className = 'option-item';
                        
                        const input = document.createElement('input');
                        input.type = question.type === 'multi_select' ? 'checkbox' : 'radio';
                        input.name = `q${question.id}`;
                        input.value = typeof option === 'string' ? option.charAt(0) : option;
                        
                        // 设置已选中的答案
                        if (question.type === 'multi_select') {
                            const userAnswer = this.userAnswers[question.id];
                            if (userAnswer && userAnswer.includes(input.value)) {
                                input.checked = true;
                            }
                        } else {
                            if (this.userAnswers[question.id] === input.value) {
                                input.checked = true;
                            }
                        }
                        
                        const span = document.createElement('span');
                        span.textContent = ` ${option}`;
                        
                        label.appendChild(input);
                        label.appendChild(span);
                        optionsDiv.appendChild(label);
                    });
                    
                    questionDiv.appendChild(optionsDiv);
                } else {
                    // 没有选项，显示为填空题
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'answer-input fill-blank-input';
                    input.setAttribute('data-question', question.id);
                    input.value = this.userAnswers[question.id] || '';
                    input.placeholder = '输入答案';
                    if (this.userAnswers[question.id]) {
                        input.classList.add('answered');
                    }
                    questionDiv.appendChild(input);
                }
                
                questionsDiv.appendChild(questionDiv);
            });
            
            container.appendChild(questionsDiv);
            
            // 绑定选择题事件
            this.bindChoiceEvents(container);
        }
        
        console.log('剑桥雅思20格式题目渲染完成');
    }
    
    // 答案比较辅助函数
    compareAnswers(userAnswer, correctAnswer) {
        if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
            // 字符串比较（忽略大小写和前后空格）
            return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        }
        // 其他类型直接比较
        return userAnswer === correctAnswer;
    }
    
    compareArrayAnswers(userAnswers, correctAnswers) {
        if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers)) {
            return false;
        }
        
        if (userAnswers.length !== correctAnswers.length) {
            return false;
        }
        
        // 排序后比较，忽略顺序
        const sortedUser = [...userAnswers].sort();
        const sortedCorrect = [...correctAnswers].sort();
        
        return sortedUser.every((answer, index) => 
            this.compareAnswers(answer, sortedCorrect[index])
        );
    }
}

// 不需要这个初始化代码，因为我们在test.html中已经添加了初始化代码
/* document.addEventListener('DOMContentLoaded', () => {
    new TestUI();
}); */ 