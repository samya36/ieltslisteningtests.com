// 视觉反馈系统

class VisualFeedbackManager {
    constructor() {
        this.animations = new Map();
        this.feedbackQueue = [];
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupInputFeedback();
        this.setupAudioFeedback();
        this.setupProgressFeedback();
        this.setupSectionFeedback();
        this.createFeedbackElements();
    }

    // 创建反馈元素
    createFeedbackElements() {
        // 创建进度指示器
        this.createProgressIndicator();
        
        // 创建完成度指示器
        this.createCompletionIndicator();
        
        // 创建通知容器
        this.createNotificationContainer();
    }

    // 创建进度指示器
    createProgressIndicator() {
        const existingIndicator = document.querySelector('.progress-indicator');
        if (existingIndicator) return;

        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        
        for (let i = 1; i <= 4; i++) {
            const step = document.createElement('div');
            step.className = 'progress-step';
            step.setAttribute('data-section', i);
            step.textContent = i;
            progressIndicator.appendChild(step);
            
            if (i < 4) {
                const connector = document.createElement('div');
                connector.className = 'progress-connector';
                progressIndicator.appendChild(connector);
            }
        }

        // 插入到测试说明后面
        const testIntro = document.querySelector('.test-intro');
        if (testIntro) {
            testIntro.insertAdjacentElement('afterend', progressIndicator);
        }
    }

    // 创建完成度指示器
    createCompletionIndicator() {
        const existingIndicator = document.querySelector('.completion-indicator');
        if (existingIndicator) return;

        const completionIndicator = document.createElement('div');
        completionIndicator.className = 'completion-indicator';
        // 安全地创建DOM结构，避免XSS攻击
        const circleDiv = document.createElement('div');
        circleDiv.className = 'completion-circle';
        const percentSpan = document.createElement('span');
        percentSpan.textContent = '0%';
        circleDiv.appendChild(percentSpan);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'completion-text';
        const h4 = document.createElement('h4');
        h4.textContent = '测试完成度';
        
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('已完成 '));
        const answeredSpan = document.createElement('span');
        answeredSpan.className = 'answered-count';
        answeredSpan.textContent = '0';
        p.appendChild(answeredSpan);
        p.appendChild(document.createTextNode(' / '));
        const totalSpan = document.createElement('span');
        totalSpan.className = 'total-count';
        totalSpan.textContent = '40';
        p.appendChild(totalSpan);
        p.appendChild(document.createTextNode(' 题'));
        
        textDiv.appendChild(h4);
        textDiv.appendChild(p);
        completionIndicator.appendChild(circleDiv);
        completionIndicator.appendChild(textDiv);
        `;

        // 插入到section tabs之前
        const sectionTabs = document.querySelector('.section-tabs');
        if (sectionTabs) {
            sectionTabs.insertAdjacentElement('beforebegin', completionIndicator);
        }
    }

    // 创建通知容器
    createNotificationContainer() {
        if (document.querySelector('.notification-container')) return;

        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    // 设置输入框反馈
    setupInputFeedback() {
        // 监听所有输入变化
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('answer-input')) {
                this.handleInputFeedback(e.target);
            }
        });

        document.addEventListener('focus', (e) => {
            if (e.target.classList.contains('answer-input')) {
                this.addInputFocusEffect(e.target);
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('answer-input')) {
                this.removeInputFocusEffect(e.target);
            }
        }, true);
    }

    // 处理输入反馈
    handleInputFeedback(input) {
        // 移除之前的状态
        input.classList.remove('error', 'valid', 'filled');
        
        const value = input.value.trim();
        
        if (value === '') {
            return;
        }

        // 标记为已填写
        input.classList.add('filled');
        
        // 简单验证
        if (this.validateInput(input, value)) {
            input.classList.add('valid');
            this.showSuccessCheckmark(input);
        } else {
            input.classList.add('error');
            this.showErrorTooltip(input, this.getValidationMessage(input, value));
        }

        // 更新完成度
        this.updateCompletionIndicator();
    }

    // 输入验证
    validateInput(input, value) {
        const questionType = input.dataset.type || 'text';
        
        switch (questionType) {
            case 'number':
                return /^\d+$/.test(value);
            case 'word':
                return /^[a-zA-Z\s]+$/.test(value) && value.length >= 2;
            case 'multiple':
                return value.length >= 3; // 至少3个字符
            default:
                return value.length >= 1;
        }
    }

    // 获取验证消息
    getValidationMessage(input, value) {
        const questionType = input.dataset.type || 'text';
        
        switch (questionType) {
            case 'number':
                return '请输入数字';
            case 'word':
                return '请输入有效单词';
            case 'multiple':
                return '答案太短';
            default:
                return '请检查答案格式';
        }
    }

    // 添加输入焦点效果
    addInputFocusEffect(input) {
        input.classList.add('focused');
        
        // 高亮当前问题
        const questionItem = input.closest('.question-item');
        if (questionItem) {
            // 移除其他问题的高亮
            document.querySelectorAll('.question-item.current').forEach(item => {
                item.classList.remove('current');
            });
            
            questionItem.classList.add('current');
            questionItem.classList.add('fade-in');
            
            // 清理动画类
            setTimeout(() => {
                questionItem.classList.remove('fade-in');
            }, 500);
        }
    }

    // 移除输入焦点效果
    removeInputFocusEffect(input) {
        input.classList.remove('focused');
        
        const questionItem = input.closest('.question-item');
        if (questionItem) {
            setTimeout(() => {
                questionItem.classList.remove('current');
            }, 200);
        }
    }

    // 显示成功标记
    showSuccessCheckmark(input) {
        // 移除现有的标记
        const existing = input.parentNode.querySelector('.success-checkmark');
        if (existing) {
            existing.remove();
        }

        const checkmark = document.createElement('div');
        checkmark.className = 'success-checkmark';
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(checkmark);

        // 延迟显示动画
        setTimeout(() => {
            checkmark.classList.add('show');
        }, 100);

        // 自动移除
        setTimeout(() => {
            checkmark.remove();
        }, 3000);
    }

    // 显示错误提示
    showErrorTooltip(input, message) {
        // 移除现有提示
        const existing = input.parentNode.querySelector('.error-tooltip');
        if (existing) {
            existing.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.textContent = message;
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(tooltip);

        // 自动移除
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // 设置音频反馈
    setupAudioFeedback() {
        // 监听音频播放事件
        document.addEventListener('play', (e) => {
            if (e.target.tagName === 'AUDIO') {
                this.handleAudioPlay(e.target);
            }
        }, true);

        document.addEventListener('pause', (e) => {
            if (e.target.tagName === 'AUDIO') {
                this.handleAudioPause(e.target);
            }
        }, true);

        document.addEventListener('timeupdate', (e) => {
            if (e.target.tagName === 'AUDIO') {
                this.updateAudioProgress(e.target);
            }
        }, true);
    }

    // 处理音频播放
    handleAudioPlay(audio) {
        const playerId = audio.id;
        const playerContainer = document.getElementById(playerId.replace('-player', '-player-container'));
        
        if (playerContainer) {
            playerContainer.classList.add('playing');
            playerContainer.classList.remove('paused');
            
            // 添加音频可视化
            this.addAudioVisualizer(playerContainer);
        }
    }

    // 处理音频暂停
    handleAudioPause(audio) {
        const playerId = audio.id;
        const playerContainer = document.getElementById(playerId.replace('-player', '-player-container'));
        
        if (playerContainer) {
            playerContainer.classList.remove('playing');
            playerContainer.classList.add('paused');
            
            // 移除音频可视化
            this.removeAudioVisualizer(playerContainer);
        }
    }

    // 添加音频可视化
    addAudioVisualizer(container) {
        const existing = container.querySelector('.audio-visualizer');
        if (existing) return;

        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visualizer';
        
        for (let i = 0; i < 8; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar active';
            bar.style.height = `${Math.random() * 12 + 4}px`;
            bar.style.animationDelay = `${i * 0.1}s`;
            visualizer.appendChild(bar);
        }

        const timeDisplay = container.querySelector('.time');
        if (timeDisplay) {
            timeDisplay.insertAdjacentElement('afterend', visualizer);
        }
    }

    // 移除音频可视化
    removeAudioVisualizer(container) {
        const visualizer = container.querySelector('.audio-visualizer');
        if (visualizer) {
            visualizer.remove();
        }
    }

    // 更新音频进度
    updateAudioProgress(audio) {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        
        if (duration > 0) {
            const progressBar = document.getElementById(audio.id.replace('-player', '-progress'));
            if (progressBar) {
                const percentage = (currentTime / duration) * 100;
                progressBar.value = percentage;
                progressBar.setAttribute('aria-valuenow', percentage);
            }

            // 更新时间显示
            const timeDisplay = document.getElementById(audio.id.replace('-player', '-time'));
            if (timeDisplay) {
                const current = this.formatTime(currentTime);
                const total = this.formatTime(duration);
                // 安全地设置时间显示，避免XSS攻击
                timeDisplay.textContent = '';
                const currentSpan = document.createElement('span');
                currentSpan.className = 'current';
                currentSpan.textContent = current;
                timeDisplay.appendChild(currentSpan);
                timeDisplay.appendChild(document.createTextNode(' / ' + total));
            }
        }
    }

    // 格式化时间
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // 设置进度反馈
    setupProgressFeedback() {
        // 监听section切换
        document.addEventListener('tabchange', (e) => {
            this.updateProgressIndicator(e.detail.section);
        });

        // 初始化当前section
        this.updateProgressIndicator(1);
    }

    // 更新进度指示器
    updateProgressIndicator(currentSection) {
        const steps = document.querySelectorAll('.progress-step');
        const connectors = document.querySelectorAll('.progress-connector');

        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('current', 'completed');
            
            if (stepNumber < currentSection) {
                step.classList.add('completed');
            } else if (stepNumber === currentSection) {
                step.classList.add('current');
                step.classList.add('pulse');
                
                // 移除动画类
                setTimeout(() => {
                    step.classList.remove('pulse');
                }, 1500);
            }
        });

        connectors.forEach((connector, index) => {
            connector.classList.remove('completed');
            if (index + 1 < currentSection) {
                connector.classList.add('completed');
            }
        });
    }

    // 设置section反馈
    setupSectionFeedback() {
        // 监听section完成情况
        setInterval(() => {
            this.checkSectionCompletion();
        }, 5000); // 每5秒检查一次
    }

    // 检查section完成情况
    checkSectionCompletion() {
        for (let i = 1; i <= 4; i++) {
            const sectionElement = document.getElementById(`section${i}-content`);
            if (sectionElement) {
                const answeredInputs = sectionElement.querySelectorAll('.answer-input[value]:not([value=""]), input[type="radio"]:checked, input[type="checkbox"]:checked');
                const totalInputs = sectionElement.querySelectorAll('.answer-input, input[type="radio"], input[type="checkbox"]');
                
                const isCompleted = answeredInputs.length > 0 && (answeredInputs.length >= totalInputs.length * 0.8); // 80%完成度认为该section完成
                
                const tab = document.querySelector(`[data-section="${i}"]`);
                if (tab) {
                    if (isCompleted && !tab.classList.contains('completed')) {
                        tab.classList.add('completed');
                        tab.classList.add('bounce');
                        
                        setTimeout(() => {
                            tab.classList.remove('bounce');
                        }, 600);
                        
                        this.showNotification(`Section ${i} 已完成！`, 'success');
                    } else if (!isCompleted) {
                        tab.classList.remove('completed');
                    }
                }
            }
        }
    }

    // 更新完成度指示器
    updateCompletionIndicator() {
        const allInputs = document.querySelectorAll('.answer-input, input[type="radio"], input[type="checkbox"]');
        const answeredInputs = document.querySelectorAll('.answer-input[value]:not([value=""]), input[type="radio"]:checked, input[type="checkbox"]:checked');
        
        const total = allInputs.length;
        const answered = answeredInputs.length;
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

        // 更新圆形进度
        const circle = document.querySelector('.completion-circle');
        if (circle) {
            const span = circle.querySelector('span');
            if (span) {
                span.textContent = `${percentage}%`;
            }
            
            // 更新圆形进度条
            const degrees = (percentage / 100) * 360;
            circle.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, #ddd ${degrees}deg)`;
        }

        // 更新文本
        const answeredCount = document.querySelector('.answered-count');
        const totalCount = document.querySelector('.total-count');
        
        if (answeredCount) answeredCount.textContent = answered;
        if (totalCount) totalCount.textContent = total;

        // 完成度达到100%时的特效
        if (percentage === 100) {
            this.showCompletionCelebration();
        }
    }

    // 显示完成庆祝动画
    showCompletionCelebration() {
        const indicator = document.querySelector('.completion-indicator');
        if (indicator) {
            indicator.classList.add('pulse');
            
            setTimeout(() => {
                indicator.classList.remove('pulse');
            }, 1500);
        }

        this.showNotification('🎉 所有题目已完成！', 'success', 5000);
        
        // 创建彩带效果
        this.createConfetti();
    }

    // 创建彩带效果
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: 1;
                z-index: 10000;
                pointer-events: none;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            // 下落动画
            const fallDuration = Math.random() * 3000 + 2000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: fallDuration,
                easing: 'ease-out'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }

    // 获取随机颜色
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;

        container.appendChild(notification);

        // 滑入动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 点击关闭
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // 自动移除
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }

    // 移除通知
    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // 获取通知颜色
    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#4caf50';
            case 'error': return '#f44336';
            case 'warning': return '#ff9800';
            default: return '#2196f3';
        }
    }

    // 添加动画
    addAnimation(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        
        const animationId = Date.now() + Math.random();
        this.animations.set(animationId, {
            element,
            class: animationClass,
            timer: setTimeout(() => {
                element.classList.remove(animationClass);
                this.animations.delete(animationId);
            }, duration)
        });

        return animationId;
    }

    // 移除动画
    removeAnimation(animationId) {
        const animation = this.animations.get(animationId);
        if (animation) {
            clearTimeout(animation.timer);
            animation.element.classList.remove(animation.class);
            this.animations.delete(animationId);
        }
    }

    // 清理所有动画
    cleanup() {
        this.animations.forEach(animation => {
            clearTimeout(animation.timer);
            animation.element.classList.remove(animation.class);
        });
        this.animations.clear();
    }
}

// 初始化视觉反馈管理器
document.addEventListener('DOMContentLoaded', () => {
    window.visualFeedbackManager = new VisualFeedbackManager();
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (window.visualFeedbackManager) {
            window.visualFeedbackManager.cleanup();
        }
    });
});