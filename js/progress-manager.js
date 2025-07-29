// 进度管理器 - 自动保存和恢复用户进度

class ProgressManager {
    constructor() {
        this.storageKey = 'ielts_test_progress';
        this.autoSaveInterval = 30000; // 30秒自动保存
        this.maxStorageItems = 10; // 最多保存10个测试进度
        this.currentTestId = this.getCurrentTestId();
        this.hasUnsavedChanges = false;
        this.lastSaveTime = null;
        this.autoSaveTimer = null;
        this.init();
    }

    init() {
        this.setupAutoSave();
        this.setupEventListeners();
        this.restoreProgress();
        this.setupBeforeUnloadWarning();
    }

    // 获取当前测试ID
    getCurrentTestId() {
        // 从URL或页面标题推断测试ID
        const path = window.location.pathname;
        const match = path.match(/test-?(\d+|c20-\d+)/);
        if (match) {
            return match[1];
        }
        
        // 从页面标题获取
        const title = document.title;
        const titleMatch = title.match(/Test\s*(\d+)/i);
        if (titleMatch) {
            return titleMatch[1];
        }
        
        return 'test1'; // 默认值
    }

    // 设置自动保存
    setupAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.saveProgress();
            }
        }, this.autoSaveInterval);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听输入变化
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('answer-input')) {
                this.markUnsavedChanges();
                this.debounceAutoSave();
            }
        });

        // 监听选择变化
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'checkbox') {
                this.markUnsavedChanges();
                this.debounceAutoSave();
            }
        });

        // 监听section切换
        document.addEventListener('tabchange', (e) => {
            this.saveProgress();
        });

        // 监听音频播放进度
        document.addEventListener('timeupdate', (e) => {
            if (e.target.tagName === 'AUDIO') {
                this.updateAudioProgress(e.target);
            }
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.hasUnsavedChanges) {
                this.saveProgress();
            }
        });
    }

    // 标记有未保存的更改
    markUnsavedChanges() {
        this.hasUnsavedChanges = true;
        this.updateSaveIndicator();
    }

    // 防抖自动保存
    debounceAutoSave() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.saveProgress();
        }, 2000); // 2秒后保存
    }

    // 保存进度
    saveProgress() {
        try {
            const progress = this.collectCurrentProgress();
            const savedData = this.getSavedData();
            
            // 更新当前测试的进度
            savedData[this.currentTestId] = {
                ...progress,
                lastSaved: Date.now(),
                version: '1.0'
            };

            // 清理旧数据
            this.cleanupOldProgress(savedData);

            // 使用安全存储替代明文localStorage
            window.secureStorage.setItem(this.storageKey, savedData);
            
            this.hasUnsavedChanges = false;
            this.lastSaveTime = Date.now();
            this.updateSaveIndicator();
            
            console.log('Progress saved successfully', progress);
            
            // 显示保存成功提示
            this.showSaveNotification('进度已自动保存');
            
        } catch (error) {
            console.error('Failed to save progress:', error);
            this.showSaveNotification('保存失败', 'error');
        }
    }

    // 收集当前进度
    collectCurrentProgress() {
        const progress = {
            testId: this.currentTestId,
            currentSection: this.getCurrentSection(),
            answers: this.collectAnswers(),
            audioProgress: this.collectAudioProgress(),
            timeSpent: this.getTimeSpent(),
            completedSections: this.getCompletedSections(),
            timestamp: Date.now()
        };

        return progress;
    }

    // 获取当前section
    getCurrentSection() {
        const activeTab = document.querySelector('.section-tab.active');
        return activeTab ? parseInt(activeTab.getAttribute('data-section')) : 1;
    }

    // 收集答案
    collectAnswers() {
        const answers = {};
        
        // 收集文本输入答案
        const textInputs = document.querySelectorAll('.answer-input');
        textInputs.forEach(input => {
            if (input.value.trim()) {
                answers[input.id || input.name] = {
                    value: input.value.trim(),
                    type: 'text'
                };
            }
        });

        // 收集选择题答案
        const radioInputs = document.querySelectorAll('input[type="radio"]:checked');
        radioInputs.forEach(radio => {
            answers[radio.name] = {
                value: radio.value,
                type: 'radio'
            };
        });

        // 收集复选框答案
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxInputs.forEach(checkbox => {
            if (!answers[checkbox.name]) {
                answers[checkbox.name] = {
                    value: [],
                    type: 'checkbox'
                };
            }
            answers[checkbox.name].value.push(checkbox.value);
        });

        return answers;
    }

    // 收集音频播放进度
    collectAudioProgress() {
        const audioProgress = {};
        
        for (let i = 1; i <= 4; i++) {
            const audio = document.getElementById(`section${i}-player`);
            if (audio && audio.duration > 0) {
                audioProgress[`section${i}`] = {
                    currentTime: audio.currentTime,
                    duration: audio.duration,
                    played: audio.currentTime > 0
                };
            }
        }

        return audioProgress;
    }

    // 获取测试时间
    getTimeSpent() {
        const startTime = sessionStorage.getItem('testStartTime');
        if (startTime) {
            return Date.now() - parseInt(startTime);
        } else {
            // 设置开始时间
            sessionStorage.setItem('testStartTime', Date.now().toString());
            return 0;
        }
    }

    // 获取已完成的sections
    getCompletedSections() {
        const completed = [];
        
        for (let i = 1; i <= 4; i++) {
            const sectionAnswers = this.getSectionAnswers(i);
            if (sectionAnswers.length > 0) {
                completed.push(i);
            }
        }

        return completed;
    }

    // 获取指定section的答案数量
    getSectionAnswers(section) {
        const sectionElement = document.getElementById(`section${section}-content`);
        if (!sectionElement) return [];

        const inputs = sectionElement.querySelectorAll('.answer-input, input[type="radio"]:checked, input[type="checkbox"]:checked');
        return Array.from(inputs).filter(input => {
            return input.value && input.value.trim() !== '';
        });
    }

    // 恢复进度
    restoreProgress() {
        try {
            const savedData = this.getSavedData();
            const progress = savedData[this.currentTestId];

            if (progress && this.shouldRestoreProgress(progress)) {
                this.showRestorePrompt(progress);
            }
        } catch (error) {
            console.error('Failed to restore progress:', error);
        }
    }

    // 判断是否应该恢复进度
    shouldRestoreProgress(progress) {
        const timeSinceLastSave = Date.now() - progress.lastSaved;
        const oneDay = 24 * 60 * 60 * 1000;
        
        // 如果保存时间超过一天，不恢复
        if (timeSinceLastSave > oneDay) {
            return false;
        }

        // 如果有答案，提示恢复
        return Object.keys(progress.answers || {}).length > 0;
    }

    // 显示恢复提示
    showRestorePrompt(progress) {
        const modal = document.createElement('div');
        modal.className = 'restore-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'restore-title');
        modal.setAttribute('aria-modal', 'true');

        const lastSaveTime = new Date(progress.lastSaved).toLocaleString();
        const answerCount = Object.keys(progress.answers || {}).length;

        // 安全地创建模态框内容，避免XSS攻击
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // 模态框头部
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        const title = document.createElement('h3');
        title.id = 'restore-title';
        title.textContent = '发现未完成的测试';
        modalHeader.appendChild(title);
        
        // 模态框主体
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        const p1 = document.createElement('p');
        p1.textContent = '我们发现您有一个未完成的测试进度：';
        modalBody.appendChild(p1);
        
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = '上次保存时间: ' + lastSaveTime;
        const li2 = document.createElement('li');
        li2.textContent = '已完成答案: ' + answerCount + ' 题';
        const li3 = document.createElement('li');
        li3.textContent = '当前部分: Section ' + progress.currentSection;
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        modalBody.appendChild(ul);
        
        const p2 = document.createElement('p');
        p2.textContent = '是否要恢复这个进度？';
        modalBody.appendChild(p2);
        
        // 模态框底部
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.id = 'restore-cancel';
        cancelBtn.textContent = '重新开始';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn btn-primary';
        confirmBtn.id = 'restore-confirm';
        confirmBtn.textContent = '恢复进度';
        
        modalFooter.appendChild(cancelBtn);
        modalFooter.appendChild(confirmBtn);
        
        // 组装模态框
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        // 事件处理
        const confirmBtn = modal.querySelector('#restore-confirm');
        const cancelBtn = modal.querySelector('#restore-cancel');

        confirmBtn.addEventListener('click', () => {
            this.restoreProgressData(progress);
            modal.remove();
        });

        cancelBtn.addEventListener('click', () => {
            this.clearProgress(this.currentTestId);
            modal.remove();
        });

        // 键盘事件
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });

        // 焦点管理
        confirmBtn.focus();
    }

    // 恢复进度数据
    restoreProgressData(progress) {
        try {
            // 恢复答案
            this.restoreAnswers(progress.answers || {});
            
            // 恢复section
            if (progress.currentSection) {
                this.switchToSection(progress.currentSection);
            }

            // 恢复音频进度
            this.restoreAudioProgress(progress.audioProgress || {});

            this.showSaveNotification('进度已恢复');
            
        } catch (error) {
            console.error('Failed to restore progress data:', error);
            this.showSaveNotification('恢复进度失败', 'error');
        }
    }

    // 恢复答案
    restoreAnswers(answers) {
        Object.entries(answers).forEach(([key, answer]) => {
            if (answer.type === 'text') {
                const input = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = answer.value;
                    input.classList.add('filled');
                }
            } else if (answer.type === 'radio') {
                const radio = document.querySelector(`input[name="${key}"][value="${answer.value}"]`);
                if (radio) {
                    radio.checked = true;
                }
            } else if (answer.type === 'checkbox') {
                answer.value.forEach(value => {
                    const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        });
    }

    // 切换到指定section
    switchToSection(section) {
        const targetTab = document.querySelector(`[data-section="${section}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }

    // 恢复音频进度
    restoreAudioProgress(audioProgress) {
        Object.entries(audioProgress).forEach(([sectionId, progress]) => {
            const audio = document.getElementById(`${sectionId}-player`);
            if (audio && progress.played && progress.currentTime > 0) {
                // 标记为已播放过
                audio.dataset.previousTime = progress.currentTime;
            }
        });
    }

    // 更新音频进度
    updateAudioProgress(audio) {
        if (audio.currentTime > 0) {
            this.markUnsavedChanges();
        }
    }

    // 获取保存的数据
    getSavedData() {
        try {
            // 使用安全存储读取数据（已经是解析后的对象）
            const data = window.secureStorage.getItem(this.storageKey);
            return data || {};
        } catch (error) {
            console.error('Failed to get saved data:', error);
            return {};
        }
    }

    // 清理旧进度
    cleanupOldProgress(savedData) {
        const entries = Object.entries(savedData);
        if (entries.length > this.maxStorageItems) {
            // 按时间排序，删除最老的
            entries.sort((a, b) => (b[1].lastSaved || 0) - (a[1].lastSaved || 0));
            
            const toKeep = entries.slice(0, this.maxStorageItems);
            const cleaned = {};
            
            toKeep.forEach(([key, value]) => {
                cleaned[key] = value;
            });
            
            Object.assign(savedData, cleaned);
            Object.keys(savedData).forEach(key => {
                if (!cleaned[key]) {
                    delete savedData[key];
                }
            });
        }
    }

    // 设置页面离开警告
    setupBeforeUnloadWarning() {
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                const message = '您有未保存的测试进度，确定要离开吗？';
                e.returnValue = message;
                return message;
            }
        });
    }

    // 更新保存指示器
    updateSaveIndicator() {
        let indicator = document.querySelector('.save-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'save-indicator';
            document.body.appendChild(indicator);
        }

        if (this.hasUnsavedChanges) {
            indicator.textContent = '有未保存的更改';
            indicator.className = 'save-indicator unsaved';
        } else {
            indicator.textContent = '已保存';
            indicator.className = 'save-indicator saved';
            
            // 3秒后隐藏
            setTimeout(() => {
                indicator.className = 'save-indicator hidden';
            }, 3000);
        }
    }

    // 显示保存通知
    showSaveNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4caf50'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);

        // 自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 清除指定测试的进度
    clearProgress(testId = null) {
        const targetId = testId || this.currentTestId;
        try {
            const savedData = this.getSavedData();
            delete savedData[targetId];
            // 使用安全存储替代明文localStorage
            window.secureStorage.setItem(this.storageKey, savedData);
            
            if (targetId === this.currentTestId) {
                this.hasUnsavedChanges = false;
                this.updateSaveIndicator();
            }
        } catch (error) {
            console.error('Failed to clear progress:', error);
        }
    }

    // 手动保存
    manualSave() {
        this.saveProgress();
        this.showSaveNotification('手动保存成功');
    }

    // 获取进度统计
    getProgressStats() {
        const progress = this.collectCurrentProgress();
        const totalQuestions = document.querySelectorAll('.answer-input, input[type="radio"], input[type="checkbox"]').length;
        const answeredQuestions = Object.keys(progress.answers).length;
        
        return {
            totalQuestions,
            answeredQuestions,
            completionPercentage: Math.round((answeredQuestions / totalQuestions) * 100),
            timeSpent: progress.timeSpent,
            currentSection: progress.currentSection,
            completedSections: progress.completedSections
        };
    }

    // 销毁管理器
    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}

// 初始化进度管理器
document.addEventListener('DOMContentLoaded', () => {
    window.progressManager = new ProgressManager();
    
    // 添加手动保存按钮（可选）
    const saveButton = document.createElement('button');
    saveButton.textContent = '手动保存';
    saveButton.className = 'manual-save-btn';
    saveButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    saveButton.addEventListener('click', () => {
        window.progressManager.manualSave();
    });
    
    saveButton.addEventListener('mouseenter', () => {
        saveButton.style.opacity = '1';
    });
    
    saveButton.addEventListener('mouseleave', () => {
        saveButton.style.opacity = '0.7';
    });
    
    document.body.appendChild(saveButton);
});