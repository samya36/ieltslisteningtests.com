// 题目渲染器 - 将测试数据渲染到页面
(function() {
    'use strict';

    let currentTestData = null;

    // 等待DOM和数据加载完成
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(renderAllSections, 100);
    });

    function renderAllSections() {
        currentTestData = resolveCurrentTestData();

        if (!currentTestData) {
            console.warn('测试数据未加载，跳过渲染');
            return;
        }

        console.log('开始渲染题目...');

        // 渲染全部Section（1-4）
        for (let i = 1; i <= 4; i++) {
            const sectionData = currentTestData['section' + i];
            if (sectionData) {
                renderSection(i, sectionData);
            }
        }

        // 绑定动态生成题目的保存逻辑
        bindAnswerInputs();

        console.log('题目渲染完成');
    }

    function resolveCurrentTestData() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes('test2') && typeof TEST_DATA_2 !== 'undefined') return TEST_DATA_2;
        if (path.includes('test3') && typeof TEST_DATA_3 !== 'undefined') return TEST_DATA_3;
        if (path.includes('test4') && typeof TEST_DATA_4 !== 'undefined') return TEST_DATA_4;
        if (path.includes('test5') && typeof TEST_DATA_5 !== 'undefined') return TEST_DATA_5;
        if (path.includes('test6') && typeof TEST_DATA_6 !== 'undefined') return TEST_DATA_6;
        if (path.includes('test7') && typeof TEST_DATA_7 !== 'undefined') return TEST_DATA_7;
        if (typeof TEST_DATA !== 'undefined') return TEST_DATA;

        return null;
    }

    function renderSection(sectionNum, data) {
        const container = document.querySelector(`#section-${sectionNum} .questions`);
        if (!container) {
            console.warn(`Section ${sectionNum} 容器未找到`);
            return;
        }

        let html = `<h2 class="section-title">${data.title || 'Section ' + sectionNum}</h2>`;

        if (data.instructions) {
            html += `<div class="instructions">${formatMultiline(data.instructions)}</div>`;
        }

        // 渲染parts（如果有）
        if (Array.isArray(data.parts)) {
            data.parts.forEach(part => {
                html += renderPart(part);
            });
        }

        // 渲染formContent（如果有）
        if (data.formContent) {
            html += renderFormContent(data.formContent);
        }

        // 渲染section级别特殊结构
        if (data.tableData) {
            html += renderTableData(data.tableData);
        }

        if (data.summaryContent) {
            html += renderSummaryContent(data.summaryContent);
        }

        if (data.boxContent) {
            html += renderBoxContent(data.boxContent);
        }

        // 渲染questions（如果有）
        if (Array.isArray(data.questions)) {
            html += renderQuestions(data.questions);
        }

        container.innerHTML = html;
    }

    function renderPart(part) {
        let html = '<div class="question-part">';

        if (part.title) {
            html += `<h3 class="part-title">${part.title}</h3>`;
        }

        if (part.instructions) {
            html += `<div class="instructions">${formatMultiline(part.instructions)}</div>`;
        }

        // 渲染地图（如果有）
        if (part.mapContent) {
            html += '<div class="map-container">';
            html += `<h4>${part.mapContent.title || 'Map'}</h4>`;
            if (part.mapContent.imageUrl) {
                html += `<img src="${part.mapContent.imageUrl}" alt="Map" class="map-image" onerror="this.style.display='none'">`;
            } else if (part.mapContent.description) {
                html += `<p>${part.mapContent.description}</p>`;
            }
            html += '</div>';
        }

        if (part.tableData) {
            html += renderTableData(part.tableData);
        }

        if (part.summaryContent) {
            html += renderSummaryContent(part.summaryContent);
        }

        if (part.boxContent) {
            html += renderBoxContent(part.boxContent);
        }

        // 渲染问题
        if (Array.isArray(part.questions)) {
            html += renderQuestions(part.questions);
        }

        html += '</div>';
        return html;
    }

    function renderFormContent(formContent) {
        let html = '<div class="form-content">';

        if (formContent.title) {
            html += `<h3>${formContent.title}</h3>`;
        }

        if (Array.isArray(formContent.items)) {
            formContent.items.forEach(item => {
                html += renderFormItem(item);
            });
        }

        html += '</div>';
        return html;
    }

    function renderFormItem(item) {
        let text = replaceQuestionPlaceholders(item.text || '');
        text = formatMultiline(text);

        let className = 'question-item';
        if (item.type) {
            className += ` ${item.type}-item`;
        }

        return `<div class="${className}"><label>${text}</label></div>`;
    }

    function renderQuestions(questions) {
        let html = '<div class="questions-list">';

        questions.forEach(q => {
            html += '<div class="question-item">';
            html += `<label><strong>${q.id}.</strong> ${replaceQuestionPlaceholders(q.text || '')}</label>`;

            if (q.type === 'radio' && Array.isArray(q.options)) {
                html += '<div class="options">';
                q.options.forEach(opt => {
                    html += `<label class="option">
                        <input type="radio" name="q${q.id}" value="${opt.value}" class="answer-input" data-question="${q.id}">
                        <span><strong>${opt.value}</strong> ${opt.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (q.type === 'checkbox' && Array.isArray(q.options)) {
                html += '<div class="options">';
                q.options.forEach(opt => {
                    html += `<label class="option">
                        <input type="checkbox" name="q${q.id}" value="${opt.value}" class="answer-input" data-question="${q.id}">
                        <span><strong>${opt.value}</strong> ${opt.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (q.type === 'text' || q.type === 'fill_blank' || !q.type) {
                html += `<input type="text" name="q${q.id}" class="answer-input" data-question="${q.id}" placeholder="${q.placeholder || 'your answer'}">`;
            }

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function renderTableData(tableData) {
        let html = '<div class="table-container">';

        if (tableData.title) {
            html += `<h4>${tableData.title}</h4>`;
        }

        html += '<table class="info-table">';

        if (Array.isArray(tableData.headers) && tableData.headers.length > 0) {
            html += '<thead><tr>';
            tableData.headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';
        }

        if (Array.isArray(tableData.rows) && tableData.rows.length > 0) {
            html += '<tbody>';
            tableData.rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    html += `<td>${replaceQuestionPlaceholders(String(cell))}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';
        }

        html += '</table></div>';
        return html;
    }

    function renderSummaryContent(summaryContent) {
        let html = '<div class="summary-content">';
        if (summaryContent.title) {
            html += `<h4>${summaryContent.title}</h4>`;
        }
        if (summaryContent.text) {
            html += `<div class="summary-text">${formatMultiline(replaceQuestionPlaceholders(summaryContent.text))}</div>`;
        }
        html += '</div>';
        return html;
    }

    function renderBoxContent(boxContent) {
        // 支持字符串和对象两种结构
        if (typeof boxContent === 'string') {
            return `<div class="box-content"><pre>${boxContent}</pre></div>`;
        }

        let html = '<div class="box-content">';
        if (boxContent.title) {
            html += `<h4>${boxContent.title}</h4>`;
        }

        if (Array.isArray(boxContent.content)) {
            boxContent.content.forEach(item => {
                if (!item) return;

                if (item.type === 'header') {
                    html += `<h5>${replaceQuestionPlaceholders(item.text || '')}</h5>`;
                    return;
                }

                if (item.type === 'subheader') {
                    html += `<h6>${replaceQuestionPlaceholders(item.text || '')}</h6>`;
                    return;
                }

                if (item.type === 'compound') {
                    html += `<div class="question-item"><strong>${item.bold || ''}</strong> ${replaceQuestionPlaceholders(item.text || '')}</div>`;
                    return;
                }

                html += `<div class="question-item">${formatMultiline(replaceQuestionPlaceholders(item.text || ''))}</div>`;
            });
        }

        html += '</div>';
        return html;
    }

    function replaceQuestionPlaceholders(text) {
        // 将 [数字] 占位符替换为输入框
        return text.replace(/\[(\d+)\]/g, function(match, num) {
            return `<input type="text" name="q${num}" class="answer-input" data-question="${num}" placeholder="your answer">`;
        });
    }

    function formatMultiline(text) {
        return String(text).replace(/\n/g, '<br>');
    }

    function bindAnswerInputs() {
        const testNum = detectTestNumber();
        const storageKey = `ielts-test${testNum}-answers`;
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');

        document.querySelectorAll('.answer-input').forEach(input => {
            const questionId = input.dataset.question;
            const savedValue = savedAnswers[questionId];

            // 加载已保存的答案
            if (savedValue !== undefined) {
                if (input.type === 'radio') {
                    if (input.value === savedValue) input.checked = true;
                } else if (input.type === 'checkbox') {
                    if (Array.isArray(savedValue) && savedValue.includes(input.value)) {
                        input.checked = true;
                    }
                } else {
                    input.value = savedValue;
                }
                input.classList.add('answered');
            }

            // 文本输入：实时保存
            if (input.type === 'text') {
                input.addEventListener('input', function() {
                    const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    answers[this.dataset.question] = this.value;
                    localStorage.setItem(storageKey, JSON.stringify(answers));
                    this.classList.toggle('answered', this.value.trim() !== '');
                });
                return;
            }

            // 单选、多选：change 保存
            input.addEventListener('change', function() {
                const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const qId = this.dataset.question;

                if (this.type === 'radio') {
                    answers[qId] = this.value;
                } else if (this.type === 'checkbox') {
                    const checkedValues = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(el => el.dataset.question === qId && el.checked)
                        .map(el => el.value);
                    answers[qId] = checkedValues;
                }

                localStorage.setItem(storageKey, JSON.stringify(answers));
                this.classList.add('answered');
            });
        });
    }

    function detectTestNumber() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('test2')) return 2;
        if (path.includes('test3')) return 3;
        if (path.includes('test4')) return 4;
        if (path.includes('test5')) return 5;
        if (path.includes('test6')) return 6;
        if (path.includes('test7')) return 7;
        return 1;
    }

})();
