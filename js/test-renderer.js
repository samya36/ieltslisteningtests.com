// 题目渲染器 - 将测试数据渲染到页面
(function() {
    'use strict';

    let currentTestData = null;

    document.addEventListener('DOMContentLoaded', function() {
        window.setTimeout(renderAllSections, 100);
    });

    function renderAllSections() {
        currentTestData = resolveCurrentTestData();

        if (!currentTestData) {
            console.warn('测试数据未加载，跳过渲染');
            return;
        }

        for (let section = 1; section <= 4; section++) {
            const sectionData = currentTestData[`section${section}`];
            if (!sectionData) continue;
            renderSection(section, sectionData);
        }

        bindAnswerInputs();
        console.log('题目渲染完成');
    }

    function readGlobalBinding(name) {
        if (!name) return undefined;
        if (typeof window[name] !== 'undefined') return window[name];

        try {
            return Function(`return typeof ${name} !== "undefined" ? ${name} : undefined;`)();
        } catch (_) {
            return undefined;
        }
    }

    function resolveCurrentTestData() {
        const path = window.location.pathname.toLowerCase();
        const match = path.match(/test(\d+)/);

        if (match) {
            return readGlobalBinding(`TEST_DATA_${parseInt(match[1], 10)}`);
        }

        return readGlobalBinding('TEST_DATA');
    }

    function shouldPreserveInlineContent(container) {
        if (!container) return false;

        return Array.from(container.children).some(function(child) {
            if (!child) return false;
            if (child.classList && child.classList.contains('section-action-row')) return false;
            return child.textContent.trim() !== '';
        });
    }

    function renderSection(sectionNum, data) {
        const sectionElement = document.getElementById(`section-${sectionNum}`);
        const container = sectionElement ? sectionElement.querySelector('.questions') : null;

        if (!container) {
            console.warn(`Section ${sectionNum} 容器未找到`);
            return;
        }

        if (shouldPreserveInlineContent(container)) {
            ensureSectionSaveButton(sectionNum, sectionElement);
            return;
        }

        let html = `<h2 class="section-title">${data.title || `Section ${sectionNum}`}</h2>`;

        if (data.instructions) {
            html += `<div class="instructions">${formatMultiline(data.instructions)}</div>`;
        }

        if (Array.isArray(data.parts)) {
            data.parts.forEach(function(part) {
                html += renderPart(part);
            });
        }

        if (data.formContent) html += renderFormContent(data.formContent);
        if (data.tableData) html += renderTableData(data.tableData);
        if (data.summaryContent) html += renderSummaryContent(data.summaryContent);
        if (data.boxContent) html += renderBoxContent(data.boxContent);
        if (Array.isArray(data.questions)) html += renderQuestions(data.questions);

        container.innerHTML = html;
        ensureSectionSaveButton(sectionNum, sectionElement);
    }

    function ensureSectionSaveButton(sectionNum, sectionElement) {
        if (!sectionElement || sectionElement.querySelector('.section-save-btn')) return;

        const container = sectionElement.querySelector('.questions');
        if (!container) return;

        const actionRow = document.createElement('div');
        actionRow.className = 'section-action-row';
        actionRow.innerHTML = `<button type="button" class="submit-answers-btn section-save-btn" data-section="${sectionNum}">保存本 Section</button>`;
        container.appendChild(actionRow);

        const button = actionRow.querySelector('.section-save-btn');
        if (button) {
            button.addEventListener('click', function() {
                if (typeof window.saveSectionAnswers === 'function') {
                    window.saveSectionAnswers(sectionNum);
                }
            });
        }
    }

    function renderPart(part) {
        let html = '<div class="question-part">';

        if (part.title) html += `<h3 class="part-title">${part.title}</h3>`;
        if (part.instructions) html += `<div class="instructions">${formatMultiline(part.instructions)}</div>`;

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

        if (part.formContent) html += renderFormContent(part.formContent);
        if (part.tableData) html += renderTableData(part.tableData);
        if (part.summaryContent) html += renderSummaryContent(part.summaryContent);
        if (part.boxContent) html += renderBoxContent(part.boxContent);
        if (Array.isArray(part.questions)) html += renderQuestions(part.questions);

        html += '</div>';
        return html;
    }

    function renderFormContent(formContent) {
        let html = '<div class="form-content">';

        if (formContent.title) html += `<h3>${formContent.title}</h3>`;
        if (formContent.subtitle) html += `<div class="form-subtitle">${formatMultiline(formContent.subtitle)}</div>`;

        if (Array.isArray(formContent.items)) {
            formContent.items.forEach(function(item) {
                html += renderFormItem(item);
            });
        }

        html += '</div>';
        return html;
    }

    function renderFormItem(item) {
        let text = formatMultiline(replaceQuestionPlaceholders(item.text || ''));
        let className = 'question-item';

        if (item.type) className += ` ${item.type}-item`;
        return `<div class="${className}"><label>${text}</label></div>`;
    }

    function renderQuestions(questions) {
        let html = '<div class="questions-list">';

        questions.forEach(function(question) {
            html += '<div class="question-item">';
            html += `<label><strong>${question.id}.</strong> ${replaceQuestionPlaceholders(question.text || '')}</label>`;

            if (question.type === 'radio' && Array.isArray(question.options)) {
                html += '<div class="options">';
                question.options.forEach(function(option) {
                    html += `<label class="option">
                        <input type="radio" name="q${question.id}" value="${option.value}" class="answer-input" data-question="${question.id}">
                        <span><strong>${option.value}</strong> ${option.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (question.type === 'checkbox' && Array.isArray(question.options)) {
                const maxSelections = question.maxSelections || inferSelectionLimit(question.id);
                html += '<div class="options">';
                question.options.forEach(function(option) {
                    html += `<label class="option">
                        <input type="checkbox" name="q${question.id}" value="${option.value}" class="answer-input" data-question="${question.id}" data-max-selections="${maxSelections}">
                        <span><strong>${option.value}</strong> ${option.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else {
                html += `<input type="text" name="q${question.id}" class="answer-input" data-question="${question.id}" placeholder="${question.placeholder || 'your answer'}">`;
            }

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function inferSelectionLimit(questionId) {
        const match = String(questionId).match(/^(\d+)\s*-\s*(\d+)$/);
        if (!match) return 2;
        return Math.max(1, parseInt(match[2], 10) - parseInt(match[1], 10) + 1);
    }

    function renderTableData(tableData) {
        let html = '<div class="table-container">';

        if (tableData.title) html += `<h4>${tableData.title}</h4>`;

        html += '<table class="info-table">';

        if (Array.isArray(tableData.headers) && tableData.headers.length > 0) {
            html += '<thead><tr>';
            tableData.headers.forEach(function(header) {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';
        }

        if (Array.isArray(tableData.rows) && tableData.rows.length > 0) {
            html += '<tbody>';
            tableData.rows.forEach(function(row) {
                html += '<tr>';
                row.forEach(function(cell) {
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
        if (summaryContent.title) html += `<h4>${summaryContent.title}</h4>`;
        if (summaryContent.text) html += `<div class="summary-text">${formatMultiline(replaceQuestionPlaceholders(summaryContent.text))}</div>`;
        html += '</div>';
        return html;
    }

    function renderBoxContent(boxContent) {
        if (typeof boxContent === 'string') {
            return `<div class="box-content"><pre>${boxContent}</pre></div>`;
        }

        let html = '<div class="box-content">';
        if (boxContent.title) html += `<h4>${boxContent.title}</h4>`;

        if (Array.isArray(boxContent.content)) {
            boxContent.content.forEach(function(item) {
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
        return String(text).replace(/\[(\d+)\]/g, function(match, number) {
            return `<input type="text" name="q${number}" class="answer-input" data-question="${number}" placeholder="your answer">`;
        });
    }

    function formatMultiline(text) {
        return String(text).replace(/\n/g, '<br>');
    }

    function bindAnswerInputs() {
        const testNum = detectTestNumber();
        const storageKey = `ielts-test${testNum}-answers`;
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');

        document.querySelectorAll('.answer-input').forEach(function(input) {
            const questionId = input.dataset.question;
            if (!questionId) return;

            applySavedValue(input, savedAnswers[questionId]);

            if (input.dataset.answerBound === 'true') return;
            input.dataset.answerBound = 'true';

            if (input.type === 'text') {
                input.addEventListener('input', function() {
                    const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    answers[this.dataset.question] = this.value;
                    localStorage.setItem(storageKey, JSON.stringify(answers));
                    this.classList.toggle('answered', this.value.trim() !== '');
                });
                return;
            }

            input.addEventListener('change', function() {
                const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const qId = this.dataset.question;

                if (this.type === 'radio') {
                    answers[qId] = this.value;
                } else if (this.type === 'checkbox') {
                    const checkedValues = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(function(element) {
                            return element.dataset.question === qId && element.checked;
                        })
                        .map(function(element) {
                            return element.value;
                        });

                    const limit = parseInt(this.dataset.maxSelections || '0', 10);
                    if (limit > 0 && checkedValues.length > limit) {
                        this.checked = false;
                        return;
                    }

                    answers[qId] = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(function(element) {
                            return element.dataset.question === qId && element.checked;
                        })
                        .map(function(element) {
                            return element.value;
                        });
                }

                localStorage.setItem(storageKey, JSON.stringify(answers));
                this.classList.add('answered');
            });
        });
    }

    function applySavedValue(input, savedValue) {
        if (savedValue === undefined) return;

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

    function detectTestNumber() {
        const path = window.location.pathname.toLowerCase();
        const match = path.match(/test(\d+)/);
        if (match) return parseInt(match[1], 10);
        return 1;
    }
})();
