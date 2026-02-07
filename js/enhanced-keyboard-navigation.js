// 增强键盘导航系统 - 基于Next.js参考优化
class KeyboardNavigationSystem {
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalQuestions = 0;
        this.currentSection = 1;
        this.isActive = true;
        this.shortcuts = new Map();
        this.focusHistory = [];
        this.lastFocusedElement = null;
        
        // 预定义快捷键映射
        this.setupDefaultShortcuts();
        this.init();
    }

    init() {
        this.bindGlobalKeyboardEvents();
        this.setupFocusManagement();
        this.setupAccessibilityFeatures();
        this.loadUserPreferences();
    }

    // 设置默认快捷键
    setupDefaultShortcuts() {
        // 音频控制
        this.registerShortcut('Space', this.toggleAudioPlay.bind(this), '播放/暂停音频');
        this.registerShortcut('ArrowLeft', this.rewindAudio.bind(this), '音频后退10秒');
        this.registerShortcut('ArrowRight', this.fastForwardAudio.bind(this), '音频前进10秒');
        this.registerShortcut('ArrowUp', this.increaseSpeed.bind(this), '提高播放速度');
        this.registerShortcut('ArrowDown', this.decreaseSpeed.bind(this), '降低播放速度');
        this.registerShortcut('KeyR', this.restartAudio.bind(this), '重新开始音频');
        
        // 题目导航
        this.registerShortcut('KeyN', this.nextQuestion.bind(this), '下一题');
        this.registerShortcut('KeyP', this.previousQuestion.bind(this), '上一题');
        this.registerShortcut('KeyJ', this.jumpToQuestion.bind(this), '跳转到题目');
        this.registerShortcut('Home', this.firstQuestion.bind(this), '第一题');
        this.registerShortcut('End', this.lastQuestion.bind(this), '最后一题');
        
        // 答题操作
        this.registerShortcut('Digit1', () => this.selectOption(0), '选择选项A');
        this.registerShortcut('Digit2', () => this.selectOption(1), '选择选项B');
        this.registerShortcut('Digit3', () => this.selectOption(2), '选择选项C');
        this.registerShortcut('Digit4', () => this.selectOption(3), '选择选项D');
        this.registerShortcut('KeyM', this.markQuestion.bind(this), '标记题目');
        this.registerShortcut('KeyC', this.clearAnswer.bind(this), '清除答案');
        
        // 界面控制
        this.registerShortcut('Tab', this.cycleInterface.bind(this), '切换界面焦点');
        this.registerShortcut('Escape', this.exitCurrentMode.bind(this), '退出当前模式');
        this.registerShortcut('KeyH', this.showHelp.bind(this), '显示帮助');
        this.registerShortcut('KeyS', this.showShortcuts.bind(this), '显示快捷键');
        
        // Section切换
        this.registerShortcut('F1', () => this.switchSection(1), '切换到Section 1');
        this.registerShortcut('F2', () => this.switchSection(2), '切换到Section 2');
        this.registerShortcut('F3', () => this.switchSection(3), '切换到Section 3');
        this.registerShortcut('F4', () => this.switchSection(4), '切换到Section 4');
        
        // 高级功能
        this.registerShortcut('KeyA', this.toggleAnswerSheet.bind(this), '切换答题卡');
        this.registerShortcut('KeyV', this.toggleReviewMode.bind(this), '切换检查模式');
        this.registerShortcut('KeyF', this.toggleFullscreen.bind(this), '全屏模式');
    }

    // 注册快捷键
    registerShortcut(key, handler, description) {
        this.shortcuts.set(key, {
            handler,
            description,
            enabled: true
        });
    }

    // 绑定全局键盘事件
    bindGlobalKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            // 检查是否在输入框中
            if (this.isInputElement(e.target)) {
                this.handleInputKeydown(e);
                return;
            }

            // 处理修饰键组合
            const key = this.getKeyString(e);
            const shortcut = this.shortcuts.get(key);
            
            if (shortcut && shortcut.enabled) {
                e.preventDefault();
                this.executeShortcut(shortcut, e);
                this.showKeyboardFeedback(key, shortcut.description);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    // 检查是否为输入元素
    isInputElement(element) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTypes.includes(element.tagName) || 
               element.contentEditable === 'true' ||
               element.hasAttribute('data-input');
    }

    // 获取按键字符串
    getKeyString(event) {
        const modifiers = [];
        if (event.ctrlKey) modifiers.push('Ctrl');
        if (event.altKey) modifiers.push('Alt');
        if (event.shiftKey) modifiers.push('Shift');
        if (event.metaKey) modifiers.push('Meta');
        
        modifiers.push(event.code);
        return modifiers.join('+');
    }

    // 处理输入框中的键盘事件
    handleInputKeydown(event) {
        // 在输入框中只处理特定快捷键
        const allowedInInput = ['Escape', 'Tab', 'Enter'];
        if (allowedInInput.includes(event.key)) {
            if (event.key === 'Escape') {
                event.target.blur();
                this.restoreFocus();
            } else if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            } else if (event.key === 'Enter') {
                this.handleEnterInInput(event);
            }
        }
    }

    // 执行快捷键
    executeShortcut(shortcut, event) {
        try {
            shortcut.handler(event);
            this.logShortcutUsage(event.code);
        } catch (error) {
            console.error('快捷键执行错误:', error);
        }
    }

    // 音频控制方法
    toggleAudioPlay() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.togglePlay();
        } else if (window.audioPlayer) {
            window.audioPlayer.togglePlay(this.currentSection);
        }
    }

    rewindAudio() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.rewind();
        }
    }

    fastForwardAudio() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.fastForward();
        }
    }

    increaseSpeed() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.speedUp();
        }
    }

    decreaseSpeed() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.speedDown();
        }
    }

    restartAudio() {
        if (window.enhancedAudioPlayer) {
            window.enhancedAudioPlayer.restart();
        }
    }

    // 题目导航方法
    nextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.navigateToQuestion(this.currentQuestionIndex + 1);
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.navigateToQuestion(this.currentQuestionIndex - 1);
        }
    }

    firstQuestion() {
        this.navigateToQuestion(0);
    }

    lastQuestion() {
        this.navigateToQuestion(this.totalQuestions - 1);
    }

    jumpToQuestion() {
        const questionNum = prompt('跳转到题目号:', this.currentQuestionIndex + 1);
        if (questionNum) {
            const index = parseInt(questionNum) - 1;
            if (index >= 0 && index < this.totalQuestions) {
                this.navigateToQuestion(index);
            }
        }
    }

    // 导航到指定题目
    navigateToQuestion(index) {
        this.currentQuestionIndex = index;
        
        // 通知答题卡组件
        if (window.enhancedAnswerSheet) {
            window.enhancedAnswerSheet.jumpToQuestion(index);
        }
        
        // 通知题目显示组件
        this.dispatchNavigationEvent('questionChanged', {
            index,
            previousIndex: this.currentQuestionIndex
        });

        // 更新界面焦点
        this.focusCurrentQuestion();
    }

    // 选择选项
    selectOption(optionIndex) {
        const currentQuestion = document.querySelector('.question-container.active');
        if (!currentQuestion) return;
        
        const options = currentQuestion.querySelectorAll('input[type="radio"], .option-button');
        if (options[optionIndex]) {
            if (options[optionIndex].tagName === 'INPUT') {
                options[optionIndex].checked = true;
                options[optionIndex].dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                options[optionIndex].click();
            }
            
            // 显示选择反馈
            this.showSelectionFeedback(optionIndex);
        }
    }

    // 标记题目
    markQuestion() {
        if (window.enhancedAnswerSheet) {
            window.enhancedAnswerSheet.toggleMark();
        }
    }

    // 清除答案
    clearAnswer() {
        const currentQuestion = document.querySelector('.question-container.active');
        if (!currentQuestion) return;
        
        const inputs = currentQuestion.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        this.showFeedback('答案已清除', 'info');
    }

    // Section切换
    switchSection(sectionNum) {
        const sectionTab = document.querySelector(`[data-section="${sectionNum}"]`);
        if (sectionTab) {
            sectionTab.click();
            this.currentSection = sectionNum;
            this.showFeedback(`切换到 Section ${sectionNum}`, 'success');
        }
    }

    // 界面控制方法
    cycleInterface(event) {
        // 不阻止默认Tab行为，但添加自定义逻辑
        this.updateFocusHistory(event.target);
    }

    exitCurrentMode() {
        // 退出当前特殊模式
        if (document.querySelector('.modal.active')) {
            this.closeModal();
        } else if (document.querySelector('.help-panel.active')) {
            this.hideHelp();
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            // 恢复默认焦点
            this.restoreFocus();
        }
    }

    showHelp() {
        this.createHelpPanel();
    }

    showShortcuts() {
        this.createShortcutsPanel();
    }

    toggleAnswerSheet() {
        const answerSheet = document.getElementById('answer-sheet-container');
        if (answerSheet) {
            answerSheet.classList.toggle('expanded');
        }
    }

    toggleReviewMode() {
        if (window.enhancedAnswerSheet) {
            window.enhancedAnswerSheet.toggleReview();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('无法进入全屏模式:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // 焦点管理
    setupFocusManagement() {
        document.addEventListener('focusin', (e) => {
            this.updateFocusHistory(e.target);
        });

        document.addEventListener('focusout', (e) => {
            this.lastFocusedElement = e.target;
        });
    }

    updateFocusHistory(element) {
        this.focusHistory.push(element);
        if (this.focusHistory.length > 10) {
            this.focusHistory.shift();
        }
    }

    restoreFocus() {
        const target = this.lastFocusedElement || 
                      document.querySelector('.question-container.active input') ||
                      document.querySelector('.question-container.active button') ||
                      document.body;
        
        if (target && target.focus) {
            target.focus();
        }
    }

    focusCurrentQuestion() {
        const currentQuestion = document.querySelector('.question-container.active');
        if (currentQuestion) {
            const focusTarget = currentQuestion.querySelector('input, button, [tabindex]');
            if (focusTarget) {
                focusTarget.focus();
            }
        }
    }

    // 无障碍功能
    setupAccessibilityFeatures() {
        // 为重要元素添加ARIA标签
        this.enhanceAccessibility();
        
        // 监听屏幕阅读器
        this.setupScreenReaderSupport();
    }

    enhanceAccessibility() {
        // 为音频控制添加标签
        const audioControls = document.querySelectorAll('.audio-control');
        audioControls.forEach((control, index) => {
            if (!control.hasAttribute('aria-label')) {
                control.setAttribute('aria-label', `音频控制 ${index + 1}`);
            }
        });

        // 为题目添加标签
        const questions = document.querySelectorAll('.question-container');
        questions.forEach((question, index) => {
            question.setAttribute('aria-label', `题目 ${index + 1}`);
        });
    }

    setupScreenReaderSupport() {
        // 创建实时通告区域
        if (!document.getElementById('sr-announcements')) {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcements';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => announcer.textContent = '', 1000);
        }
    }

    // UI反馈方法
    showKeyboardFeedback(key, description) {
        if (!this.shouldShowFeedback()) return;
        
        this.createFeedbackElement({
            type: 'keyboard',
            key: key.split('+').pop(), // 只显示主要按键
            description
        });
    }

    showSelectionFeedback(optionIndex) {
        const optionLabels = ['A', 'B', 'C', 'D'];
        const message = `已选择选项 ${optionLabels[optionIndex]}`;
        this.showFeedback(message, 'success');
        this.announceToScreenReader(message);
    }

    showFeedback(message, type = 'info') {
        this.createFeedbackElement({
            type: 'message',
            message,
            level: type
        });
    }

    createFeedbackElement(config) {
        const feedback = document.createElement('div');
        feedback.className = `keyboard-feedback ${config.type} ${config.level || ''}`;
        
        if (config.type === 'keyboard') {
            feedback.innerHTML = `
                <span class="key">${config.key}</span>
                <span class="description">${config.description}</span>
            `;
        } else {
            feedback.textContent = config.message;
        }
        
        // 添加到页面
        const container = document.getElementById('feedback-container') || document.body;
        container.appendChild(feedback);
        
        // 动画和自动移除
        requestAnimationFrame(() => feedback.classList.add('show'));
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    // 帮助面板
    createHelpPanel() {
        const existing = document.getElementById('keyboard-help-panel');
        if (existing) {
            existing.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'keyboard-help-panel';
        panel.className = 'help-panel modal-overlay';
        panel.innerHTML = `
            <div class="help-content modal-content">
                <div class="help-header">
                    <h3>键盘导航帮助</h3>
                    <button class="close-btn" onclick="this.closest('.help-panel').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <h4>音频控制</h4>
                        <div class="shortcut-list">
                            <div class="shortcut-item"><kbd>空格</kbd> 播放/暂停</div>
                            <div class="shortcut-item"><kbd>←</kbd> 后退10秒</div>
                            <div class="shortcut-item"><kbd>→</kbd> 前进10秒</div>
                            <div class="shortcut-item"><kbd>↑</kbd> 加速</div>
                            <div class="shortcut-item"><kbd>↓</kbd> 减速</div>
                            <div class="shortcut-item"><kbd>R</kbd> 重新开始</div>
                        </div>
                    </div>
                    
                    <div class="help-section">
                        <h4>题目导航</h4>
                        <div class="shortcut-list">
                            <div class="shortcut-item"><kbd>N</kbd> 下一题</div>
                            <div class="shortcut-item"><kbd>P</kbd> 上一题</div>
                            <div class="shortcut-item"><kbd>J</kbd> 跳转题目</div>
                            <div class="shortcut-item"><kbd>Home</kbd> 第一题</div>
                            <div class="shortcut-item"><kbd>End</kbd> 最后一题</div>
                        </div>
                    </div>
                    
                    <div class="help-section">
                        <h4>答题操作</h4>
                        <div class="shortcut-list">
                            <div class="shortcut-item"><kbd>1-4</kbd> 选择选项A-D</div>
                            <div class="shortcut-item"><kbd>M</kbd> 标记题目</div>
                            <div class="shortcut-item"><kbd>C</kbd> 清除答案</div>
                        </div>
                    </div>
                    
                    <div class="help-section">
                        <h4>界面控制</h4>
                        <div class="shortcut-list">
                            <div class="shortcut-item"><kbd>F1-F4</kbd> 切换Section</div>
                            <div class="shortcut-item"><kbd>A</kbd> 切换答题卡</div>
                            <div class="shortcut-item"><kbd>V</kbd> 检查模式</div>
                            <div class="shortcut-item"><kbd>F</kbd> 全屏模式</div>
                            <div class="shortcut-item"><kbd>Esc</kbd> 退出当前模式</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        panel.classList.add('active');
        
        // 焦点管理
        const closeBtn = panel.querySelector('.close-btn');
        closeBtn.focus();
    }

    // 工具方法
    shouldShowFeedback() {
        // 可以根据用户设置决定是否显示反馈
        return localStorage.getItem('keyboardFeedback') !== 'false';
    }

    logShortcutUsage(key) {
        // 记录快捷键使用情况，用于优化
        const usage = JSON.parse(localStorage.getItem('shortcutUsage') || '{}');
        usage[key] = (usage[key] || 0) + 1;
        localStorage.setItem('shortcutUsage', JSON.stringify(usage));
    }

    loadUserPreferences() {
        // 加载用户快捷键偏好设置
        const prefs = JSON.parse(localStorage.getItem('keyboardPrefs') || '{}');
        
        if (prefs.disabled) {
            prefs.disabled.forEach(key => {
                const shortcut = this.shortcuts.get(key);
                if (shortcut) shortcut.enabled = false;
            });
        }
    }

    saveUserPreferences() {
        const prefs = {
            disabled: Array.from(this.shortcuts.entries())
                .filter(([key, shortcut]) => !shortcut.enabled)
                .map(([key]) => key)
        };
        localStorage.setItem('keyboardPrefs', JSON.stringify(prefs));
    }

    // 事件分发
    dispatchNavigationEvent(eventName, detail) {
        const event = new CustomEvent(`keyboard:${eventName}`, {
            detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // 启用/禁用系统
    enable() {
        this.isActive = true;
    }

    disable() {
        this.isActive = false;
    }

    // 更新题目信息
    updateQuestionInfo(currentIndex, total) {
        this.currentQuestionIndex = currentIndex;
        this.totalQuestions = total;
    }

    // 获取当前状态
    getState() {
        return {
            currentQuestionIndex: this.currentQuestionIndex,
            totalQuestions: this.totalQuestions,
            currentSection: this.currentSection,
            isActive: this.isActive
        };
    }
}

// 全局初始化
let keyboardNavigation;

document.addEventListener('DOMContentLoaded', () => {
    keyboardNavigation = new KeyboardNavigationSystem();
    
    // 页面卸载时保存偏好设置
    window.addEventListener('beforeunload', () => {
        if (keyboardNavigation) {
            keyboardNavigation.saveUserPreferences();
        }
    });
});

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.KeyboardNavigationSystem = KeyboardNavigationSystem;
    window.keyboardNavigation = keyboardNavigation;
}