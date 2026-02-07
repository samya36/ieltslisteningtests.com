/**
 * Mobile Touch Controls
 * 为移动端优化的音频控件，支持触摸手势和响应式设计
 * 确保所有触摸目标至少44px，提供流畅的移动端体验
 */

class MobileTouchControls {
    constructor() {
        this.touchStartTime = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isLongPress = false;
        this.longPressTimer = null;
        this.gestureThreshold = 50; // 手势识别阈值
        this.longPressDelay = 500; // 长按识别延迟
        
        this.gestureCallbacks = {
            swipeLeft: [],
            swipeRight: [],
            swipeUp: [],
            swipeDown: [],
            longPress: [],
            doubleTap: [],
            pinch: []
        };
        
        this.init();
    }
    
    init() {
        this.optimizeExistingControls();
        this.setupTouchGestures();
        this.setupAccessibilityFeatures();
        this.setupOrientationHandling();
        
        console.log('Mobile Touch Controls 初始化完成');
    }
    
    optimizeExistingControls() {
        // 优化所有音频控件的触摸目标大小
        this.optimizeAudioControls();
        this.optimizeNavigationControls();
        this.optimizeFormControls();
        this.addTouchFeedback();
    }
    
    optimizeAudioControls() {
        // 播放按钮优化
        document.querySelectorAll('.play-btn').forEach(btn => {
            this.makeTouchFriendly(btn, {
                minSize: 48,
                padding: 12,
                tapHighlight: true
            });
        });
        
        // 进度条优化
        document.querySelectorAll('.progress').forEach(progress => {
            this.optimizeSlider(progress);
        });
        
        // 速度选择器优化
        document.querySelectorAll('.playback-speed').forEach(select => {
            this.optimizeSelect(select);
        });
        
        // 章节切换按钮优化
        document.querySelectorAll('.section-tab').forEach(tab => {
            this.makeTouchFriendly(tab, {
                minSize: 44,
                padding: 10,
                tapHighlight: true
            });
        });
    }
    
    optimizeNavigationControls() {
        // 导航菜单按钮优化
        document.querySelectorAll('.nav-toggle').forEach(toggle => {
            this.makeTouchFriendly(toggle, {
                minSize: 48,
                padding: 12,
                tapHighlight: true
            });
        });
        
        // 菜单项优化
        document.querySelectorAll('.nav-menu a').forEach(link => {
            this.makeTouchFriendly(link, {
                minSize: 44,
                padding: 8,
                tapHighlight: false
            });
        });
    }
    
    optimizeFormControls() {
        // 表单输入框优化
        document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], textarea').forEach(input => {
            this.optimizeInput(input);
        });
        
        // 按钮优化
        document.querySelectorAll('button:not(.play-btn):not(.section-tab)').forEach(btn => {
            this.makeTouchFriendly(btn, {
                minSize: 44,
                padding: 12,
                tapHighlight: true
            });
        });
    }
    
    makeTouchFriendly(element, options = {}) {
        const {
            minSize = 44,
            padding = 8,
            tapHighlight = true
        } = options;
        
        element.classList.add('touch-optimized');
        
        // 设置最小触摸目标大小
        const styles = {
            minWidth: `${minSize}px`,
            minHeight: `${minSize}px`,
            padding: `${padding}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer'
        };
        
        Object.assign(element.style, styles);
        
        // 添加触摸高亮效果
        if (tapHighlight) {
            element.classList.add('tap-highlight');
        }
        
        // 添加触摸事件监听
        this.addTouchListeners(element);
    }
    
    optimizeSlider(slider) {
        slider.classList.add('touch-slider');
        
        // 增加滑块触摸区域
        const sliderStyles = {
            height: '44px',
            cursor: 'pointer',
            appearance: 'none',
            background: 'transparent',
            outline: 'none'
        };
        
        Object.assign(slider.style, sliderStyles);
        
        // 添加自定义滑块样式
        this.addSliderStyles(slider);
        
        // 添加触摸手势支持
        this.addSliderGestures(slider);
    }
    
    addSliderStyles(slider) {
        if (!document.getElementById('mobile-slider-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-slider-styles';
            style.textContent = `
                .touch-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #2196F3;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .touch-slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #2196F3;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .touch-slider::-webkit-slider-track {
                    height: 4px;
                    background: #ddd;
                    border-radius: 2px;
                }
                
                .touch-slider::-moz-range-track {
                    height: 4px;
                    background: #ddd;
                    border-radius: 2px;
                    border: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addSliderGestures(slider) {
        let isDragging = false;
        let startValue = 0;
        
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            startValue = parseFloat(slider.value);
            e.preventDefault();
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const rect = slider.getBoundingClientRect();
            const percentage = (touch.clientX - rect.left) / rect.width;
            const value = slider.min + (slider.max - slider.min) * percentage;
            
            slider.value = Math.max(slider.min, Math.min(slider.max, value));
            
            // 触发input事件
            const inputEvent = new Event('input', { bubbles: true });
            slider.dispatchEvent(inputEvent);
            
            e.preventDefault();
        });
        
        slider.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
    
    optimizeSelect(select) {
        select.classList.add('touch-select');
        
        const selectStyles = {
            minHeight: '44px',
            padding: '12px 16px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            background: '#fff',
            cursor: 'pointer'
        };
        
        Object.assign(select.style, selectStyles);
        
        // 防止iOS自动缩放
        select.addEventListener('focus', () => {
            if (window.devicePixelRatio && window.devicePixelRatio > 1) {
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                    viewport.setAttribute('content', 
                        'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0');
                }
            }
        });
        
        select.addEventListener('blur', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width,initial-scale=1,user-scalable=1');
            }
        });
    }
    
    optimizeInput(input) {
        input.classList.add('touch-input');
        
        const inputStyles = {
            minHeight: '44px',
            padding: '12px 16px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            outline: 'none'
        };
        
        Object.assign(input.style, inputStyles);
        
        // 添加焦点样式
        input.addEventListener('focus', () => {
            input.style.borderColor = '#2196F3';
            input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        });
    }
    
    addTouchFeedback() {
        // 添加触摸反馈样式
        if (!document.getElementById('touch-feedback-styles')) {
            const style = document.createElement('style');
            style.id = 'touch-feedback-styles';
            style.textContent = `
                .touch-optimized {
                    transition: all 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                }
                
                .tap-highlight:active {
                    transform: scale(0.95);
                    background-color: rgba(33, 150, 243, 0.1);
                }
                
                .touch-feedback {
                    position: relative;
                    overflow: hidden;
                }
                
                .touch-feedback::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: translate(-50%, -50%);
                    transition: width 0.3s ease, height 0.3s ease;
                }
                
                .touch-feedback.active::after {
                    width: 100px;
                    height: 100px;
                }
                
                @media (hover: none) {
                    .touch-optimized:hover {
                        background-color: rgba(33, 150, 243, 0.05);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addTouchListeners(element) {
        let startTime = 0;
        let endTime = 0;
        
        element.addEventListener('touchstart', (e) => {
            startTime = Date.now();
            element.classList.add('touching');
            
            // 添加触摸反馈效果
            if (element.classList.contains('tap-highlight')) {
                this.addRippleEffect(element, e.touches[0]);
            }
        });
        
        element.addEventListener('touchend', (e) => {
            endTime = Date.now();
            element.classList.remove('touching');
            
            // 检测快速点击
            const touchDuration = endTime - startTime;
            if (touchDuration < 200) {
                element.classList.add('quick-tap');
                setTimeout(() => {
                    element.classList.remove('quick-tap');
                }, 200);
            }
        });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touching');
        });
    }
    
    addRippleEffect(element, touch) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${touch.clientX - rect.left - size / 2}px;
            top: ${touch.clientY - rect.top - size / 2}px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // 添加水波纹动画
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupTouchGestures() {
        // 设置全局手势监听
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // 设置双击检测
        this.setupDoubleTapDetection();
        
        // 设置缩放手势检测
        this.setupPinchDetection();
    }
    
    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isLongPress = false;
        
        // 设置长按计时器
        this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.executeGesture('longPress', {
                x: this.touchStartX,
                y: this.touchStartY,
                target: e.target
            });
        }, this.longPressDelay);
    }
    
    handleTouchMove(e) {
        // 如果移动了，取消长按检测
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        // 防止页面滚动干扰音频播放器操作
        if (e.target.closest('.audio-player') || e.target.closest('.custom-player')) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        if (this.isLongPress) return;
        
        const touchEndTime = Date.now();
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        const deltaTime = touchEndTime - this.touchStartTime;
        
        // 检测滑动手势
        if (Math.abs(deltaX) > this.gestureThreshold || Math.abs(deltaY) > this.gestureThreshold) {
            this.detectSwipeGesture(deltaX, deltaY, deltaTime, e.target);
        }
    }
    
    detectSwipeGesture(deltaX, deltaY, deltaTime, target) {
        // 快速滑动才算手势
        if (deltaTime > 300) return;
        
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        let gesture = null;
        
        if (absDeltaX > absDeltaY) {
            // 水平滑动
            gesture = deltaX > 0 ? 'swipeRight' : 'swipeLeft';
        } else {
            // 垂直滑动
            gesture = deltaY > 0 ? 'swipeDown' : 'swipeUp';
        }
        
        if (gesture) {
            this.executeGesture(gesture, {
                deltaX,
                deltaY,
                deltaTime,
                target
            });
        }
    }
    
    setupDoubleTapDetection() {
        let lastTapTime = 0;
        let lastTapTarget = null;
        
        document.addEventListener('touchend', (e) => {
            const currentTime = Date.now();
            const currentTarget = e.target;
            
            if (currentTime - lastTapTime < 300 && currentTarget === lastTapTarget) {
                this.executeGesture('doubleTap', {
                    target: currentTarget,
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY
                });
            }
            
            lastTapTime = currentTime;
            lastTapTarget = currentTarget;
        });
    }
    
    setupPinchDetection() {
        let initialDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                
                this.executeGesture('pinch', {
                    scale,
                    target: e.target
                });
            }
        });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    executeGesture(type, data) {
        const callbacks = this.gestureCallbacks[type] || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`手势回调执行失败 (${type}):`, error);
            }
        });
        
        // 触发自定义事件
        const event = new CustomEvent(`mobileGesture:${type}`, {
            detail: data
        });
        window.dispatchEvent(event);
    }
    
    setupAccessibilityFeatures() {
        // 添加语音提示支持
        this.setupVoiceAnnouncements();
        
        // 优化焦点管理
        this.setupFocusManagement();
        
        // 添加高对比度支持
        this.setupHighContrastMode();
    }
    
    setupVoiceAnnouncements() {
        // 为重要操作添加语音提示
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const isPlaying = btn.getAttribute('aria-pressed') === 'true';
                this.announceToScreenReader(isPlaying ? '音频已暂停' : '音频开始播放');
            });
        });
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    setupFocusManagement() {
        // 确保键盘导航友好
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupHighContrastMode() {
        // 检测系统高对比度模式
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast-mode');
        }
        
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast-mode');
            } else {
                document.body.classList.remove('high-contrast-mode');
            }
        });
    }
    
    setupOrientationHandling() {
        // 处理屏幕方向变化
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // 初始化方向
        this.handleOrientationChange();
    }
    
    handleOrientationChange() {
        const orientation = window.orientation || 0;
        const isLandscape = Math.abs(orientation) === 90;
        
        document.body.classList.toggle('landscape-mode', isLandscape);
        document.body.classList.toggle('portrait-mode', !isLandscape);
        
        // 重新计算控件大小
        this.recalculateControlSizes();
    }
    
    recalculateControlSizes() {
        // 在方向变化后重新优化控件
        setTimeout(() => {
            document.querySelectorAll('.touch-optimized').forEach(element => {
                // 重新应用触摸优化
                const rect = element.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    this.makeTouchFriendly(element);
                }
            });
        }, 200);
    }
    
    // 公共API方法
    onGesture(type, callback) {
        if (!this.gestureCallbacks[type]) {
            this.gestureCallbacks[type] = [];
        }
        this.gestureCallbacks[type].push(callback);
    }
    
    offGesture(type, callback) {
        if (this.gestureCallbacks[type]) {
            const index = this.gestureCallbacks[type].indexOf(callback);
            if (index > -1) {
                this.gestureCallbacks[type].splice(index, 1);
            }
        }
    }
    
    enableVibration() {
        this.vibrationEnabled = true;
    }
    
    disableVibration() {
        this.vibrationEnabled = false;
    }
    
    vibrate(pattern = [100]) {
        if (this.vibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

// 全局实例
window.mobileTouchControls = new MobileTouchControls();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileTouchControls;
}