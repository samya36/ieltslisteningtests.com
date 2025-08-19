// 增强答题卡组件 - 基于Next.js参考设计
class EnhancedAnswerSheet {
    constructor() {
        this.questions = [];
        this.answers = {};
        this.currentIndex = 0;
        this.marked = new Set(); // 标记的题目
        this.reviewMode = false;
        this.container = null;
        this.shortcuts = {
            'KeyM': 'toggleMark',
            'KeyN': 'nextQuestion', 
            'KeyP': 'prevQuestion',
            'KeyR': 'toggleReview',
            'Escape': 'clearSelection'
        };
        
        this.init();
    }

    init() {
        this.container = document.getElementById('answer-sheet-container');
        if (this.container) {
            this.render();
            this.bindEvents();
            this.bindKeyboardShortcuts();
        }
    }

    // 设置题目数据
    setQuestions(questions) {
        this.questions = questions;
        this.render();
    }

    // 更新答案
    updateAnswer(questionId, answer) {
        this.answers[questionId] = answer;
        this.updateQuestionState(questionId);
    }

    // 获取题目状态
    getQuestionState(questionId, index) {
        const hasAnswer = this.answers[questionId] != null && this.answers[questionId] !== '';
        const isCurrent = index === this.currentIndex;
        const isMarked = this.marked.has(questionId);
        
        return {
            hasAnswer,
            isCurrent,
            isMarked,
            isEmpty: !hasAnswer && !isMarked
        };
    }

    // 渲染答题卡
    render() {
        if (!this.container) return;

        const html = `
            <div class="answer-sheet-header">
                <h3>答题卡</h3>
                <div class="answer-sheet-controls">
                    <button class="review-toggle-btn ${this.reviewMode ? 'active' : ''}" 
                            onclick="enhancedAnswerSheet.toggleReview()">
                        <i class="fas fa-eye"></i> ${this.reviewMode ? '退出检查' : '检查模式'}
                    </button>
                    <button class="clear-marks-btn" onclick="enhancedAnswerSheet.clearAllMarks()">
                        <i class="fas fa-eraser"></i> 清除标记
                    </button>
                </div>
            </div>
            
            <div class="answer-sheet-stats">
                <div class="stat-item">
                    <span class="stat-number">${this.getAnsweredCount()}</span>
                    <span class="stat-label">已答</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${this.getMarkedCount()}</span>
                    <span class="stat-label">标记</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${this.getUnansweredCount()}</span>
                    <span class="stat-label">未答</span>
                </div>
            </div>

            <div class="answer-sheet-grid">
                ${this.renderQuestionGrid()}
            </div>

            <div class="answer-sheet-legend">
                <div class="legend-item">
                    <span class="legend-indicator answered"></span>
                    <span class="legend-text">已答题</span>
                </div>
                <div class="legend-item">
                    <span class="legend-indicator marked"></span>
                    <span class="legend-text">已标记</span>
                </div>
                <div class="legend-item">
                    <span class="legend-indicator current"></span>
                    <span class="legend-text">当前题</span>
                </div>
                <div class="legend-item">
                    <span class="legend-indicator empty"></span>
                    <span class="legend-text">未答题</span>
                </div>
            </div>

            ${this.reviewMode ? this.renderReviewPanel() : ''}

            <div class="answer-sheet-shortcuts">
                <div class="shortcuts-title">快捷键</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item"><kbd>M</kbd> 标记题目</div>
                    <div class="shortcut-item"><kbd>N</kbd> 下一题</div>
                    <div class="shortcut-item"><kbd>P</kbd> 上一题</div>
                    <div class="shortcut-item"><kbd>R</kbd> 检查模式</div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    // 渲染题目网格
    renderQuestionGrid() {
        return this.questions.map((question, index) => {
            const state = this.getQuestionState(question.id, index);
            const classes = this.getQuestionClasses(state);
            
            return `
                <button class="answer-sheet-item ${classes}" 
                        data-question-id="${question.id}"
                        data-index="${index}"
                        onclick="enhancedAnswerSheet.jumpToQuestion(${index})"
                        oncontextmenu="enhancedAnswerSheet.toggleMark('${question.id}'); return false;"
                        aria-label="题目 ${index + 1} ${this.getStateDescription(state)}"
                        title="题目 ${index + 1}\n右键标记">
                    <span class="question-number">${index + 1}</span>
                    ${state.isMarked ? '<i class="fas fa-star mark-icon"></i>' : ''}
                    ${state.hasAnswer ? '<i class="fas fa-check answer-icon"></i>' : ''}
                </button>
            `;
        }).join('');
    }

    // 渲染检查面板
    renderReviewPanel() {
        const unanswered = this.getUnansweredQuestions();
        const marked = this.getMarkedQuestions();

        return `
            <div class="review-panel">
                <div class="review-section">
                    <h4><i class="fas fa-exclamation-circle"></i> 未答题目 (${unanswered.length})</h4>
                    <div class="review-questions">
                        ${unanswered.map(q => 
                            `<button class="review-question-btn" onclick="enhancedAnswerSheet.jumpToQuestion(${q.index})">
                                题目 ${q.index + 1}
                            </button>`
                        ).join('')}
                        ${unanswered.length === 0 ? '<span class="no-items">太棒了！所有题目都已作答</span>' : ''}
                    </div>
                </div>
                
                <div class="review-section">
                    <h4><i class="fas fa-star"></i> 标记题目 (${marked.length})</h4>
                    <div class="review-questions">
                        ${marked.map(q => 
                            `<button class="review-question-btn" onclick="enhancedAnswerSheet.jumpToQuestion(${q.index})">
                                题目 ${q.index + 1}
                            </button>`
                        ).join('')}
                        ${marked.length === 0 ? '<span class="no-items">暂无标记题目</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // 获取题目CSS类
    getQuestionClasses(state) {
        const classes = [];
        
        if (state.isCurrent) classes.push('current');
        if (state.hasAnswer) classes.push('answered');
        if (state.isMarked) classes.push('marked');
        if (state.isEmpty) classes.push('empty');
        
        return classes.join(' ');
    }

    // 获取状态描述
    getStateDescription(state) {
        const parts = [];
        if (state.isCurrent) parts.push('当前');
        if (state.hasAnswer) parts.push('已答');
        if (state.isMarked) parts.push('已标记');
        if (state.isEmpty) parts.push('未答');
        return parts.join('，') || '正常';
    }

    // 事件绑定
    bindEvents() {
        // 题目点击事件已在render中绑定
        
        // 双击标记
        this.container.addEventListener('dblclick', (e) => {
            const item = e.target.closest('.answer-sheet-item');
            if (item) {
                const questionId = item.dataset.questionId;
                this.toggleMark(questionId);
            }
        });
    }

    // 键盘快捷键
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            const shortcut = this.shortcuts[e.code];
            if (shortcut && this[shortcut]) {
                e.preventDefault();
                this[shortcut]();
            }
        });
    }

    // 跳转到指定题目
    jumpToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            this.updateCurrentQuestion();
            
            // 通知其他组件
            this.dispatchEvent('questionChanged', {
                index,
                question: this.questions[index]
            });
        }
    }

    // 下一题
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.jumpToQuestion(this.currentIndex + 1);
        }
    }

    // 上一题  
    prevQuestion() {
        if (this.currentIndex > 0) {
            this.jumpToQuestion(this.currentIndex - 1);
        }
    }

    // 切换标记
    toggleMark(questionId = null) {
        const id = questionId || this.questions[this.currentIndex]?.id;
        if (!id) return;

        if (this.marked.has(id)) {
            this.marked.delete(id);
        } else {
            this.marked.add(id);
        }
        
        this.updateQuestionState(id);
        this.updateStats();
        
        // 显示标记提示
        this.showMarkFeedback(id, this.marked.has(id));
    }

    // 切换检查模式
    toggleReview() {
        this.reviewMode = !this.reviewMode;
        this.render();
        
        // 通知其他组件
        this.dispatchEvent('reviewModeChanged', {
            reviewMode: this.reviewMode
        });
    }

    // 清除所有标记
    clearAllMarks() {
        if (this.marked.size === 0) return;
        
        if (confirm(`确定要清除所有 ${this.marked.size} 个标记吗？`)) {
            this.marked.clear();
            this.render();
            this.showFeedback('已清除所有标记', 'success');
        }
    }

    // 清除当前选择
    clearSelection() {
        // 可以添加清除逻辑
    }

    // 更新题目状态
    updateQuestionState(questionId) {
        const item = this.container.querySelector(`[data-question-id="${questionId}"]`);
        if (!item) return;

        const index = parseInt(item.dataset.index);
        const state = this.getQuestionState(questionId, index);
        
        // 更新CSS类
        item.className = `answer-sheet-item ${this.getQuestionClasses(state)}`;
        
        // 更新图标
        const markIcon = item.querySelector('.mark-icon');
        const answerIcon = item.querySelector('.answer-icon');
        
        if (state.isMarked && !markIcon) {
            item.insertAdjacentHTML('beforeend', '<i class="fas fa-star mark-icon"></i>');
        } else if (!state.isMarked && markIcon) {
            markIcon.remove();
        }
        
        if (state.hasAnswer && !answerIcon) {
            item.insertAdjacentHTML('beforeend', '<i class="fas fa-check answer-icon"></i>');
        } else if (!state.hasAnswer && answerIcon) {
            answerIcon.remove();
        }
        
        // 更新aria-label
        item.setAttribute('aria-label', `题目 ${index + 1} ${this.getStateDescription(state)}`);
    }

    // 更新当前题目
    updateCurrentQuestion() {
        // 移除所有current类
        this.container.querySelectorAll('.answer-sheet-item.current').forEach(item => {
            item.classList.remove('current');
        });
        
        // 添加到当前题目
        const currentItem = this.container.querySelector(`[data-index="${this.currentIndex}"]`);
        if (currentItem) {
            currentItem.classList.add('current');
            
            // 滚动到视图中
            currentItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    // 更新统计
    updateStats() {
        const stats = this.container.querySelectorAll('.stat-number');
        if (stats.length >= 3) {
            stats[0].textContent = this.getAnsweredCount();
            stats[1].textContent = this.getMarkedCount();
            stats[2].textContent = this.getUnansweredCount();
        }
    }

    // 获取统计数据
    getAnsweredCount() {
        return Object.keys(this.answers).filter(id => 
            this.answers[id] != null && this.answers[id] !== ''
        ).length;
    }

    getMarkedCount() {
        return this.marked.size;
    }

    getUnansweredCount() {
        return this.questions.length - this.getAnsweredCount();
    }

    getUnansweredQuestions() {
        return this.questions.filter((q, index) => {
            const hasAnswer = this.answers[q.id] != null && this.answers[q.id] !== '';
            return !hasAnswer;
        }).map((q, _, arr) => ({
            ...q,
            index: this.questions.indexOf(q)
        }));
    }

    getMarkedQuestions() {
        return this.questions.filter(q => this.marked.has(q.id))
            .map(q => ({
                ...q,
                index: this.questions.indexOf(q)
            }));
    }

    // 反馈提示
    showMarkFeedback(questionId, isMarked) {
        const index = this.questions.findIndex(q => q.id === questionId);
        const message = isMarked ? `题目 ${index + 1} 已标记` : `题目 ${index + 1} 取消标记`;
        this.showFeedback(message, 'info');
    }

    showFeedback(message, type = 'info') {
        // 创建反馈元素
        const feedback = document.createElement('div');
        feedback.className = `answer-sheet-feedback ${type}`;
        feedback.textContent = message;
        
        // 添加到容器
        this.container.appendChild(feedback);
        
        // 自动移除
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    // 事件派发
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`answerSheet:${eventName}`, {
            detail,
            bubbles: true
        });
        
        if (this.container) {
            this.container.dispatchEvent(event);
        }
    }

    // 获取答题进度
    getProgress() {
        return {
            total: this.questions.length,
            answered: this.getAnsweredCount(),
            marked: this.getMarkedCount(),
            unanswered: this.getUnansweredCount(),
            percentage: Math.round((this.getAnsweredCount() / this.questions.length) * 100)
        };
    }

    // 导出答案数据
    exportAnswers() {
        return {
            answers: { ...this.answers },
            marked: Array.from(this.marked),
            timestamp: Date.now()
        };
    }

    // 导入答案数据
    importAnswers(data) {
        if (data.answers) {
            this.answers = { ...data.answers };
        }
        if (data.marked) {
            this.marked = new Set(data.marked);
        }
        this.render();
    }

    // 重置所有数据
    reset() {
        this.answers = {};
        this.marked.clear();
        this.currentIndex = 0;
        this.reviewMode = false;
        this.render();
    }
}

// 全局初始化
let enhancedAnswerSheet;

document.addEventListener('DOMContentLoaded', () => {
    enhancedAnswerSheet = new EnhancedAnswerSheet();
});

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.EnhancedAnswerSheet = EnhancedAnswerSheet;
    window.enhancedAnswerSheet = enhancedAnswerSheet;
}