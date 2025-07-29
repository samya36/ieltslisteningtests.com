// 键盘导航支持脚本

class KeyboardNavigation {
    constructor() {
        this.currentTabIndex = 0;
        this.tabs = [];
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupAudioPlayerKeyboard();
        this.setupFormNavigation();
        this.setupGlobalKeyboardShortcuts();
    }

    // Tab导航支持
    setupTabNavigation() {
        this.tabs = document.querySelectorAll('.section-tab');
        
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateTab(index - 1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateTab(index + 1);
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.navigateTab(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.navigateTab(this.tabs.length - 1);
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.activateTab(index);
                        break;
                }
            });
        });
    }

    navigateTab(index) {
        // 循环导航
        if (index < 0) index = this.tabs.length - 1;
        if (index >= this.tabs.length) index = 0;
        
        // 更新tabindex
        this.tabs.forEach((tab, i) => {
            tab.setAttribute('tabindex', i === index ? '0' : '-1');
        });
        
        // 聚焦到新tab
        this.tabs[index].focus();
        this.currentTabIndex = index;
    }

    activateTab(index) {
        // 移除所有active状态
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        // 设置新的active tab
        const activeTab = this.tabs[index];
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        // 触发tab切换事件
        const event = new CustomEvent('tabchange', {
            detail: { section: index + 1 }
        });
        document.dispatchEvent(event);
    }

    // 音频播放器键盘控制
    setupAudioPlayerKeyboard() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.toggleAudioPlay(button);
                        break;
                }
            });
        });

        // 进度条键盘控制
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(progress => {
            progress.addEventListener('keydown', (e) => {
                const step = 5; // 5%步长
                let value = parseInt(progress.value);
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        value = Math.max(0, value - step);
                        this.updateProgress(progress, value);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        value = Math.min(100, value + step);
                        this.updateProgress(progress, value);
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.updateProgress(progress, 0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.updateProgress(progress, 100);
                        break;
                }
            });
        });
    }

    toggleAudioPlay(button) {
        const audioId = button.id.replace('-play', '-player');
        const audio = document.getElementById(audioId);
        const icon = button.querySelector('i');
        
        if (audio) {
            if (audio.paused) {
                audio.play();
                icon.className = 'fas fa-pause';
                button.setAttribute('aria-pressed', 'true');
                button.setAttribute('aria-label', button.getAttribute('aria-label').replace('播放', '暂停'));
            } else {
                audio.pause();
                icon.className = 'fas fa-play';
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('aria-label', button.getAttribute('aria-label').replace('暂停', '播放'));
            }
        }
    }

    updateProgress(progressBar, value) {
        progressBar.value = value;
        progressBar.setAttribute('aria-valuenow', value);
        
        // 更新对应的音频时间
        const audioId = progressBar.id.replace('-progress', '-player');
        const audio = document.getElementById(audioId);
        
        if (audio && audio.duration) {
            const newTime = (value / 100) * audio.duration;
            audio.currentTime = newTime;
        }
    }

    // 表单导航支持
    setupFormNavigation() {
        const inputs = document.querySelectorAll('.answer-input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToNextInput(index);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToPrevInput(index);
                        break;
                }
            });
        });
    }

    navigateToNextInput(currentIndex) {
        const inputs = document.querySelectorAll('.answer-input');
        const nextIndex = (currentIndex + 1) % inputs.length;
        inputs[nextIndex].focus();
    }

    navigateToPrevInput(currentIndex) {
        const inputs = document.querySelectorAll('.answer-input');
        const prevIndex = currentIndex === 0 ? inputs.length - 1 : currentIndex - 1;
        inputs[prevIndex].focus();
    }

    // 全局键盘快捷键
    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 只在没有焦点在输入框时响应
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleCurrentSectionAudio();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    e.preventDefault();
                    const sectionIndex = parseInt(e.key) - 1;
                    this.navigateTab(sectionIndex);
                    this.activateTab(sectionIndex);
                    break;
                case 'h':
                case 'H':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.showKeyboardHelp();
                    }
                    break;
                case 'Escape':
                    this.closeModalDialogs();
                    break;
            }
        });
    }

    toggleCurrentSectionAudio() {
        const activeTab = document.querySelector('.section-tab.active');
        if (activeTab) {
            const section = activeTab.getAttribute('data-section');
            const playButton = document.getElementById(`section${section}-play`);
            if (playButton) {
                this.toggleAudioPlay(playButton);
            }
        }
    }

    showKeyboardHelp() {
        const helpModal = document.getElementById('keyboard-help-modal');
        if (helpModal) {
            helpModal.style.display = 'block';
            helpModal.focus();
        } else {
            this.createKeyboardHelpModal();
        }
    }

    createKeyboardHelpModal() {
        const modal = document.createElement('div');
        modal.id = 'keyboard-help-modal';
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'help-title');
        modal.setAttribute('aria-modal', 'true');
        
        // 安全地创建帮助模态框内容，避免XSS攻击
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // 模态框头部
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const title = document.createElement('h3');
        title.id = 'help-title';
        title.textContent = '键盘快捷键帮助';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.setAttribute('aria-label', '关闭帮助');
        closeBtn.innerHTML = '&times;'; // 这里使用实体字符是安全的
        
        modalHeader.appendChild(title);
        modalHeader.appendChild(closeBtn);
        
        // 模态框主体
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        const dl = document.createElement('dl');
        dl.className = 'keyboard-shortcuts';
        
        // 快捷键列表数据
        const shortcuts = [
            { key: '空格键', desc: '播放/暂停当前部分音频' },
            { key: '数字键 1-4', desc: '切换到对应部分' },
            { key: '左/右箭头键', desc: '在tabs间导航' },
            { key: '上/下箭头键', desc: '在答题输入框间导航' },
            { key: 'Home/End', desc: '跳到第一个/最后一个tab' },
            { key: 'Ctrl/Cmd + H', desc: '显示此帮助' },
            { key: 'ESC', desc: '关闭对话框' }
        ];
        
        // 安全地创建每个快捷键项
        shortcuts.forEach(shortcut => {
            const dt = document.createElement('dt');
            dt.textContent = shortcut.key;
            const dd = document.createElement('dd');
            dd.textContent = shortcut.desc;
            dl.appendChild(dt);
            dl.appendChild(dd);
        });
        
        modalBody.appendChild(dl);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // ESC键关闭
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
        
        modal.focus();
    }

    closeModalDialogs() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    }
}

// 焦点管理工具
class FocusManager {
    constructor() {
        this.focusStack = [];
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        // 在模态框中限制焦点
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal[aria-modal="true"]');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    pushFocus(element) {
        this.focusStack.push(document.activeElement);
        element.focus();
    }

    popFocus() {
        const element = this.focusStack.pop();
        if (element) {
            element.focus();
        }
    }
}

// 初始化键盘导航
document.addEventListener('DOMContentLoaded', () => {
    new KeyboardNavigation();
    new FocusManager();
});