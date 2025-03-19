// 测试界面控制类
class TestUI {
    constructor() {
        this.currentSection = 1;
        this.testData = null;
        this.userAnswers = {};
        this.init();
    }

    async init() {
        try {
            await this.loadTestData();
            this.renderSection(1);
            this.renderSection(2);
            this.renderSection(3);
            this.renderSection(4);
            this.bindEvents();
        } catch (error) {
            console.error('Failed to initialize test:', error);
        }
    }

    async loadTestData() {
        try {
            this.testData = await getTestData();
            // 从本地存储加载用户答案
            const savedAnswers = localStorage.getItem('userAnswers');
            if (savedAnswers) {
                this.userAnswers = JSON.parse(savedAnswers);
            }
        } catch (error) {
            console.error('Failed to load test data:', error);
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TestUI();
}); 