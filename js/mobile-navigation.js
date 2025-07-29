// 移动端导航脚本

class MobileNavigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.navToggle && this.navMenu) {
            this.setupEventListeners();
            this.setupResponsiveHandling();
        }
    }

    setupEventListeners() {
        // 导航切换按钮点击事件
        this.navToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // 键盘事件
        this.navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMenu();
            }
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.navToggle.focus();
            }
        });

        // 导航链接点击后关闭菜单
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }

    setupResponsiveHandling() {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.navToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
        this.isOpen = true;

        // 焦点管理
        const firstLink = this.navMenu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }

        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        this.isOpen = false;

        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

// 触摸手势支持
class TouchGestureHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.minSwipeDistance = 50;
        this.init();
    }

    init() {
        // 音频播放器的滑动控制
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(progress => {
            this.setupProgressBarTouch(progress);
        });

        // 部分切换的滑动支持
        this.setupSectionSwipe();
    }

    setupProgressBarTouch(progressBar) {
        let isDragging = false;

        progressBar.addEventListener('touchstart', (e) => {
            isDragging = true;
            this.updateProgressFromTouch(e, progressBar);
        }, { passive: false });

        progressBar.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                this.updateProgressFromTouch(e, progressBar);
            }
        }, { passive: false });

        progressBar.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    updateProgressFromTouch(e, progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        progressBar.value = percentage;
        progressBar.setAttribute('aria-valuenow', percentage);

        // 触发进度更新事件
        const event = new CustomEvent('progresschange', {
            detail: { value: percentage }
        });
        progressBar.dispatchEvent(event);
    }

    setupSectionSwipe() {
        const testContainer = document.querySelector('.test-container');
        if (!testContainer) return;

        testContainer.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        testContainer.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].clientX;
            this.endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;

        // 只处理主要是水平方向的滑动
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            const currentTab = document.querySelector('.section-tab.active');
            if (!currentTab) return;

            const currentSection = parseInt(currentTab.getAttribute('data-section'));
            
            if (deltaX > 0) {
                // 向右滑动 - 上一个部分
                this.switchToSection(currentSection - 1);
            } else {
                // 向左滑动 - 下一个部分
                this.switchToSection(currentSection + 1);
            }
        }
    }

    switchToSection(section) {
        if (section < 1 || section > 4) return;

        const targetTab = document.querySelector(`[data-section="${section}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
}

// 移动端性能优化
class MobilePerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeScrolling();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    }

    optimizeScrolling() {
        // 使用passive listeners提高滚动性能
        document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    }

    handleTouchStart(e) {
        // 记录触摸开始位置
        this.lastTouchY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        // 防止橡皮筋效果
        const currentY = e.touches[0].clientY;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        if ((scrollTop <= 0 && currentY > this.lastTouchY) ||
            (scrollTop + windowHeight >= scrollHeight && currentY < this.lastTouchY)) {
            e.preventDefault();
        }

        this.lastTouchY = currentY;
    }

    optimizeAnimations() {
        // 检测是否支持减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
    }

    setupIntersectionObserver() {
        // 懒加载音频文件
        const audioElements = document.querySelectorAll('audio[data-src]');
        
        if ('IntersectionObserver' in window) {
            const audioObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const audio = entry.target;
                        if (audio.dataset.src) {
                            audio.src = audio.dataset.src;
                            audio.removeAttribute('data-src');
                            audioObserver.unobserve(audio);
                        }
                    }
                });
            });

            audioElements.forEach(audio => {
                audioObserver.observe(audio);
            });
        }
    }
}

// 移动端用户体验增强
class MobileUXEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.preventZoom();
        this.optimizeFormInputs();
        this.addHapticFeedback();
        this.improveAudioControls();
    }

    preventZoom() {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    optimizeFormInputs() {
        const inputs = document.querySelectorAll('.answer-input');
        
        inputs.forEach(input => {
            // 添加输入状态视觉反馈
            input.addEventListener('focus', () => {
                input.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.classList.remove('focused');
                if (input.value.trim()) {
                    input.classList.add('filled');
                } else {
                    input.classList.remove('filled');
                }
            });

            // 优化虚拟键盘体验
            input.addEventListener('input', () => {
                this.adjustViewportForKeyboard();
            });
        });
    }

    adjustViewportForKeyboard() {
        // 当虚拟键盘出现时调整视口
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('answer-input')) {
            setTimeout(() => {
                focusedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }

    addHapticFeedback() {
        // 为支持的设备添加触觉反馈
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if ('vibrate' in navigator) {
                    navigator.vibrate(50); // 轻微震动50ms
                }
            });
        });
    }

    improveAudioControls() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(button => {
            // 添加长按功能（显示音频信息）
            let pressTimer;
            
            button.addEventListener('touchstart', () => {
                pressTimer = setTimeout(() => {
                    this.showAudioInfo(button);
                }, 500);
            });

            button.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });

            button.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            });
        });
    }

    showAudioInfo(button) {
        const audioId = button.id.replace('-play', '-player');
        const audio = document.getElementById(audioId);
        
        if (audio) {
            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            
            const toast = document.createElement('div');
            toast.className = 'audio-info-toast';
            toast.textContent = `音频时长: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 2000);
        }
    }
}

// 初始化移动端优化
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new TouchGestureHandler();
    new MobilePerformanceOptimizer();
    new MobileUXEnhancer();
});