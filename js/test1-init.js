// Extracted from pages/test1.html inline scripts
// Part 1: main initialization and rendering helpers
document.addEventListener('DOMContentLoaded', function() {
    // 初始化测试页面
    const testId = 'test1';
    
    // 初始化音频播放器
    if (window.enhancedAudioPlayer) {
        enhancedAudioPlayer.testId = testId;
    }
    
    // 加载题目数据
    loadQuestionData(testId);
    
    // 初始化答题卡
    initializeAnswerSheet();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 显示启动提示
    setTimeout(() => {
        if (window.enhancedAnswerSheet) {
            enhancedAnswerSheet.showFeedback('🚀 IELTS Listening Test 1 已准备就绪！按 H 查看帮助', 'info');
        }
    }, 1500);
});

// 加载题目数据
function loadQuestionData(testId) {
    // 根据不同的测试ID加载对应的数据
    if (typeof TEST_DATA !== 'undefined') {
        renderQuestionSections(TEST_DATA);
    } else {
        // 尝试动态加载数据文件
        setTimeout(() => loadQuestionData(testId), 100);
    }
}

// 渲染题目部分
function renderQuestionSections(data) {
    Object.keys(data).forEach((sectionKey, index) => {
        const sectionNum = index + 1;
        const container = document.getElementById(`section${sectionNum}-content`);
        if (container) {
            container.innerHTML = renderSection(data[sectionKey], sectionNum);
        }
    });
}

// 渲染单个section
function renderSection(sectionData, sectionNum) {
    let html = `<div class="section-header">`;
    html += `<h2>Section ${sectionNum}</h2>`;
    
    if (sectionData.instructions) {
        html += `<div class="section-instructions">${sectionData.instructions}</div>`;
    }
    
    html += `</div>`;
    
    // 根据不同的题目类型渲染内容
    if (sectionData.formContent) {
        html += renderFormSection(sectionData.formContent, sectionNum);
    } else if (sectionData.parts) {
        html += renderPartsSection(sectionData.parts, sectionNum);
    } else if (sectionData.questions) {
        html += renderQuestionsSection(sectionData.questions, sectionNum);
    }
    
    return html;
}

// 渲染表单类型题目
function renderFormSection(formData, sectionNum) {
    let html = `<div class="form-content">`;
    
    if (formData.title) {
        html += `<h3>${formData.title}</h3>`;
    }
    
    if (formData.subtitle) {
        html += `<div class="form-subtitle">${formData.subtitle.replace(/\n/g, '<br>')}</div>`;
    }
    
    if (formData.items) {
        formData.items.forEach((item, index) => {
            const questionNum = (sectionNum - 1) * 10 + index + 1;
            if (item.text.includes('[' + (index + 1) + ']')) {
                // 填空题
                const processedText = item.text.replace(
                    `[${index + 1}]........................`,
                    `<input type=\"text\" id=\"q${questionNum}\" class=\"fill-blank\" placeholder=\"${index + 1}\" maxlength=\"20\">`
                );
                html += `<div class=\"question-item\" data-question=\"${questionNum}\">${processedText}</div>`;
            } else {
                html += `<div class=\"form-item ${item.type || ''}\">${item.text}</div>`;
            }
        });
    }
    
    html += `</div>`;
    return html;
}

// 渲染parts类型题目
function renderPartsSection(parts, sectionNum) {
    let html = '';
    
    parts.forEach((part) => {
        html += `<div class=\"question-part\">`;
        
        if (part.title) html += `<h3>${part.title}</h3>`;
        if (part.instructions) html += `<div class=\"part-instructions\">${part.instructions}</div>`;
        if (part.questions) html += renderQuestionsSection(part.questions, sectionNum);
        if (part.mapContent) {
            html += `<div class=\"map-content\">`;
            html += `<h4>${part.mapContent.title}</h4>`;
            if (part.mapContent.imageUrl) html += `<img src=\"${part.mapContent.imageUrl}\" alt=\"地图\" class=\"map-image\">`;
            html += `</div>`;
        }
        if (part.boxContent) html += `<div class=\"box-content\">${part.boxContent}</div>`;
        
        html += `</div>`;
    });
    return html;
}

// 渲染问题列表
function renderQuestionsSection(questions, sectionNum) {
    let html = `<div class=\"mcq-container\">`;
    
    questions.forEach((question, qIndex) => {
        const questionId = question.id || `q${question.id || (sectionNum-1)*10 + qIndex + 1}`;
        
        html += `<div class=\"question-item\" data-question=\"${questionId}\">`;
        html += `<h4>${question.id || qIndex + 1}. ${question.text}</h4>`;
        
        if (question.type === 'radio' && question.options) {
            html += `<div class=\"options\">`;
            question.options.forEach((option) => {
                html += `<label class=\"option-label\">`;
                html += `<input type=\"radio\" name=\"${questionId}\" value=\"${option.value}\">`;
                html += `<span class=\"option-text\">${option.value}. ${option.text}</span>`;
                html += `</label>`;
            });
            html += `</div>`;
        } else if (question.type === 'text') {
            html += `<div class=\"text-input\">`;
            html += `<input type=\"text\" id=\"${questionId}\" placeholder=\"${question.placeholder || ''}\">`;
            html += `</div>`;
        }
        
        html += `</div>`;
    });
    
    html += `</div>`;
    return html;
}

// 初始化答题卡
function initializeAnswerSheet() {
    if (window.enhancedAnswerSheet) {
        // 构建题目数组
        const allQuestions = [];
        for (let i = 1; i <= 40; i++) {
            allQuestions.push({ id: `q${i}`, number: i });
        }
        enhancedAnswerSheet.setQuestions(allQuestions);
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 监听答题变化
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[type="text"], input[type="radio"]')) {
            const questionId = e.target.id || e.target.name;
            const value = e.target.type === 'radio' ? (e.target.checked ? e.target.value : null) : e.target.value;
            
            if (window.enhancedAnswerSheet && questionId) {
                enhancedAnswerSheet.updateAnswer(questionId, value);
            }
            
            updateProgress();
        }
    });
    
    // Section切换事件
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionNum = this.dataset.section;
            switchToSection(sectionNum);
        });
    });
    
    // 监听答题卡事件
    document.addEventListener('answerSheet:questionChanged', function(e) {
        console.log('切换到题目', e.detail.index + 1);
    });
}

// 切换到指定Section
function switchToSection(sectionNum) {
    // 更新标签样式
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    const activeTab = document.querySelector(`[data-section="${sectionNum}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
    }
    
    // 更新内容区域
    document.querySelectorAll('.question-container').forEach(container => {
        container.style.display = 'none';
    });
    
    const activeContent = document.getElementById(`section${sectionNum}-content`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
    
    // 更新音频播放器
    document.querySelectorAll('.audio-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const activeAudio = document.getElementById(`audio-section-${sectionNum}`);
    if (activeAudio) {
        activeAudio.style.display = 'block';
    }
    
    // 通知音频播放器
    if (window.enhancedAudioPlayer) {
        enhancedAudioPlayer.currentSection = parseInt(sectionNum);
    }
}

// 更新进度
function updateProgress() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="radio"]:checked');
    const totalQuestions = 40;
    const answeredCount = Array.from(inputs).filter(input => {
        return input.type === 'radio' ? input.checked : input.value.trim() !== '';
    }).length;
    
    const percentage = (answeredCount / totalQuestions) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = `${answeredCount} / ${totalQuestions} 题已完成`;
}

// 重置测试
function resetTest() {
    if (confirm('确定要重新开始测试吗？所有答案将被清除。')) {
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        if (window.enhancedAnswerSheet) {
            enhancedAnswerSheet.reset();
        }
        
        updateProgress();
    }
}

// 提交测试
function submitTest() {
    const rawInputs = {};
    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio' && input.checked) {
            rawInputs[input.name] = input.value;
        } else if (input.type === 'text' && input.value.trim()) {
            rawInputs[input.id] = input.value.trim();
        }
    });

    // 归一化为 sectionX_Y 键
    const userAnswers = {};
    const toKey = (qNum) => {
        const n = parseInt(String(qNum), 10);
        const section = Math.min(4, Math.max(1, Math.ceil(n / 10)));
        return `section${section}_${n}`;
    };
    Object.entries(rawInputs).forEach(([k, v]) => {
        const match = String(k).match(/(\d{1,2})/);
        if (match) {
            userAnswers[toKey(match[1])] = v;
        }
    });

    // 构建答案键映射（从 1..40 到 sectionX_Y）
    const answerKey = {};
    if (typeof standardAnswers !== 'undefined') {
        Object.entries(standardAnswers).forEach(([num, ans]) => {
            answerKey[toKey(num)] = ans;
        });
    }

    // 保存以供结果页使用
    try { localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); } catch (_) {}

    // 使用统一评分引擎计算并缓存结果
    if (window.ScoreEngine && typeof window.ScoreEngine.calculate === 'function') {
        const scoreResult = window.ScoreEngine.calculate(userAnswers, answerKey);
        try {
            localStorage.setItem('latestScoreResult', JSON.stringify(scoreResult));
            localStorage.setItem('latestAnswerKey', JSON.stringify(answerKey));
        } catch (_) {}
        console.log('[ScoreEngine] 评分结果', scoreResult);
    }

    if (window.enhancedAnswerSheet) {
        enhancedAnswerSheet.showFeedback('答案已提交！即将显示评分', 'success');
    }

    setTimeout(() => {
        window.location.href = 'score-validator.html';
    }, 800);
}
