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
            checkbox.addEventListener('change', (e) => {
                const questionId = checkbox.name.replace('q', '');
                
                // 处理特殊题号格式，如 "25-26"
                if (questionId.includes('-')) {
                    // 复选框组的名称
                    const checkboxName = `q${questionId}`;
                    
                    // 获取同一组的所有复选框
                    const groupCheckboxes = document.querySelectorAll(`input[name="${checkboxName}"]`);
                    
                    // 统计已选中的数量
                    const checkedCount = Array.from(groupCheckboxes).filter(cb => cb.checked).length;
                    
                    // 如果已经选择了2个选项且当前操作是选中，则阻止操作并提示
                    if (checkedCount > 2 && checkbox.checked) {
                        e.preventDefault();
                        checkbox.checked = false;
                        
                        // 显示提示信息
                        alert('多选题每组只能选择两个选项！已选择的选项数量不能超过2个。');
                        return;
                    }
                    
                    // 对于 "25-26" 这样的题号，答案将被同时保存到这两个题号
                    const [firstId, secondId] = questionId.split('-');
                    
                    // 获取当前所有选中的值
                    const selectedValues = Array.from(groupCheckboxes)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);
                    
                    // 同时更新两个题号的答案
                    this.userAnswers[firstId] = this.userAnswers[secondId] = selectedValues;
                } 
                // 常规题号处理
                else {
                    // 如果用户答案对象中没有这个题号的数组，初始化为空数组
                    if (!this.userAnswers[questionId]) {
                        this.userAnswers[questionId] = [];
                    }
                    
                    // 如果选中，添加到数组中
                    if (checkbox.checked) {
                        if (!this.userAnswers[questionId].includes(checkbox.value)) {
                            this.userAnswers[questionId].push(checkbox.value);
                        }
                    } else {
                        // 如果取消选中，从数组中移除
                        this.userAnswers[questionId] = this.userAnswers[questionId].filter(v => v !== checkbox.value);
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
        const sectionData = this.testData[`section${sectionNumber}`];
        if (!sectionData) {
            console.error(`Section ${sectionNumber} not found`);
            return;
        }

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
        titleElement.innerHTML = sectionData.title;
        questionsContainer.appendChild(titleElement);

        // Section 1 渲染逻辑
        if (sectionNumber === 1) {
            this.renderSection1(sectionData, questionsContainer);
        } 
        // Section 2 渲染逻辑
        else if (sectionNumber === 2) {
            this.renderSection2(sectionData, questionsContainer);
        }
        // Section 3 渲染逻辑
        else if (sectionNumber === 3) {
            this.renderSection3(sectionData, questionsContainer);
        }
        // Section 4 渲染逻辑
        else if (sectionNumber === 4) {
            this.renderSection4(sectionData, questionsContainer);
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
                            questionText.innerHTML = `<span class="question-number">${question.id}</span> ${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

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
                            let qidDisplay = question.id;
                            if (question.id.includes('-')) {
                                qidDisplay = question.id.replace('-', '&');
                            }
                            
                            questionText.innerHTML = `<span class="question-number">${qidDisplay}</span> ${question.text}`;
                            questionDiv.appendChild(questionText);

                            // 选项
                            const optionsDiv = document.createElement('div');
                            optionsDiv.className = 'options-list';

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
        // 使用全局变量而不是函数
        if (typeof standardAnswers === 'undefined') {
            console.error('standardAnswers未定义，无法计算分数');
            return { totalCorrect: 0, ieltsScore: 0, sectionResults: {} };
        }
        
        const sectionResults = {
            section1: { total: 10, correct: 0 },
            section2: { total: 10, correct: 0 },
            section3: { total: 10, correct: 0 },
            section4: { total: 10, correct: 0 }
        };
        
        // 添加详细的分数统计信息
        const sectionDetailCorrect = {
            section3: {
                singleChoice: 0, // 1-4题（21-24）
                multiChoice: 0   // 5-10题（25-30）
            }
        };
        
        let totalCorrect = 0;
        
        // 清晰定义多选题组
        const multiChoiceGroups = [
            { first: 25, second: 26 },
            { first: 27, second: 28 },
            { first: 29, second: 30 }
        ];
        
        // 专门处理多选题组（Section 3 的多选题）
        console.log("开始处理多选题组...");
        
        // 遍历处理每个多选题组
        for (const group of multiChoiceGroups) {
            const firstId = group.first;
            const secondId = group.second;
            
            console.log(`处理多选题组 ${firstId}&${secondId}`);
            
            // 获取用户答案和标准答案
            const firstUserAnswer = this.userAnswers[firstId];
            const secondUserAnswer = this.userAnswers[secondId];
            const firstStdAnswer = standardAnswers[firstId];
            const secondStdAnswer = standardAnswers[secondId];
            
            // 记录详细日志
            console.log(`题目${firstId}用户答案:`, firstUserAnswer);
            console.log(`题目${firstId}标准答案:`, firstStdAnswer);
            console.log(`题目${secondId}用户答案:`, secondUserAnswer);
            console.log(`题目${secondId}标准答案:`, secondStdAnswer);
            
            // 检查是否为多选题（数组类型答案）
            if (!Array.isArray(firstStdAnswer) || !Array.isArray(secondStdAnswer)) {
                console.error(`题目${firstId}或${secondId}不是多选题`);
                continue;
            }
            
            // 检查用户是否回答了问题
            if (!firstUserAnswer || !secondUserAnswer || 
                !Array.isArray(firstUserAnswer) || !Array.isArray(secondUserAnswer)) {
                console.log(`多选题组${firstId}&${secondId}：用户未完整回答`);
                continue;
            }
            
            // 使用我们的多选题判断逻辑检查答案是否正确
            const isFirstCorrect = this.checkMultipleChoiceAnswer(firstUserAnswer, firstStdAnswer);
            const isSecondCorrect = this.checkMultipleChoiceAnswer(secondUserAnswer, secondStdAnswer);
            
            console.log(`多选题${firstId}判断结果:`, isFirstCorrect);
            console.log(`多选题${secondId}判断结果:`, isSecondCorrect);
            
            // 两题都答对，整组才算对
            if (isFirstCorrect && isSecondCorrect) {
                console.log(`多选题组${firstId}&${secondId}全部正确，加2分`);
                
                // 更新Section 3的得分
                sectionResults.section3.correct += 2;
                
                // 更新多选题得分统计
                sectionDetailCorrect.section3.multiChoice += 2;
                
                // 更新总分
                totalCorrect += 2;
            }
        }
        
        // 处理单选题和填空题
        console.log("开始处理单选题和填空题...");
        
        // 记录已处理过的多选题题号
        const processedMultiChoiceIds = new Set();
        multiChoiceGroups.forEach(group => {
            processedMultiChoiceIds.add(group.first);
            processedMultiChoiceIds.add(group.second);
        });
        
        // 遍历所有题目（跳过已处理的多选题）
        for (let i = 1; i <= 40; i++) {
            // 跳过已处理的多选题
            if (processedMultiChoiceIds.has(i)) {
                console.log(`跳过已处理的多选题 ${i}`);
                continue;
            }
            
            const userAnswer = this.userAnswers[i];
            const stdAnswer = standardAnswers[i];
            
            // 如果用户没有回答，则跳过
            if (userAnswer === undefined || userAnswer === '' || 
               (Array.isArray(userAnswer) && userAnswer.length === 0)) {
                console.log(`题目 ${i}: 用户未作答`);
                continue;
            }
            
            // 检查答案类型
            console.log(`题目 ${i} 答案类型:`, Array.isArray(stdAnswer) ? '多选题' : '单选/填空题');
            
            // 使用增强的答案比较方法
            const isCorrect = this.enhancedCompareAnswer(userAnswer, stdAnswer);
            
            // 调试输出
            console.log(`题目 ${i}: 用户答案=${JSON.stringify(userAnswer)}, 标准答案=${JSON.stringify(stdAnswer)}, 是否正确=${isCorrect}`);
            
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
                    
                    // 针对Section 3，单独统计单选题得分
                    if (i <= 24) {
                        sectionDetailCorrect.section3.singleChoice++;
                    }
                } else {
                    sectionResults.section4.correct++;
                }
            }
        }
        
        // 计算雅思分数
        // 使用全局函数或变量
        let ieltsScore = 0;
        if (typeof getIeltsScore === 'function') {
            ieltsScore = getIeltsScore(totalCorrect);
        } else if (typeof listeningScoreTable !== 'undefined') {
            ieltsScore = listeningScoreTable[totalCorrect] || 0;
        }
        
        // 输出最终得分信息
        console.log("===== 最终得分 =====");
        console.log(`总分: ${totalCorrect}`);
        console.log(`雅思分数: ${ieltsScore}`);
        console.log(`Section 1: ${sectionResults.section1.correct}/${sectionResults.section1.total}`);
        console.log(`Section 2: ${sectionResults.section2.correct}/${sectionResults.section2.total}`);
        console.log(`Section 3: ${sectionResults.section3.correct}/${sectionResults.section3.total} (单选题: ${sectionDetailCorrect.section3.singleChoice}/4, 多选题: ${sectionDetailCorrect.section3.multiChoice}/6)`);
        console.log(`Section 4: ${sectionResults.section4.correct}/${sectionResults.section4.total}`);
        
        return {
            totalCorrect,
            ieltsScore,
            sectionResults,
            sectionDetailCorrect
        };
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
}

// 不需要这个初始化代码，因为我们在test.html中已经添加了初始化代码
/* document.addEventListener('DOMContentLoaded', () => {
    new TestUI();
}); */ 