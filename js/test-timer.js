// 测试计时器管理系统
class TestTimer {
    constructor() {
        this.totalTimeMs = 30 * 60 * 1000; // 30分钟总时间
        this.remainingTimeMs = this.totalTimeMs;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.timerInterval = null;
        
        this.onTimeUpdate = null;
        this.onTimeUp = null;
        
        this.init();
    }
    
    init() {
        this.loadSavedState();
        this.updateDisplay();
        this.bindEvents();
    }
    
    // 加载保存的计时器状态
    loadSavedState() {
        try {
            const savedState = localStorage.getItem('test-timer-state');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // 如果有保存的测试状态，恢复计时器
                if (state.isRunning && state.startTime) {
                    const elapsed = Date.now() - state.startTime - state.pausedTime;
                    this.remainingTimeMs = Math.max(0, this.totalTimeMs - elapsed);
                    this.startTime = state.startTime;
                    this.pausedTime = state.pausedTime;
                    
                    // 如果时间没有用完，可以选择继续
                    if (this.remainingTimeMs > 0) {
                        this.showResumeOption();
                    }
                }
            }
        } catch (error) {
            console.warn('加载计时器状态失败:', error);
        }
    }
    
    // 显示恢复测试选项
    showResumeOption() {
        const resumeDiv = document.createElement('div');
        resumeDiv.className = 'resume-test-notice';
        resumeDiv.innerHTML = `
            <div class="resume-content">
                <h3>发现未完成的测试</h3>
                <p>检测到您有一个未完成的测试，剩余时间 ${this.formatTime(this.remainingTimeMs)}。</p>
                <div class="resume-actions">
                    <button class="resume-existing-btn">继续测试</button>
                    <button class="start-new-btn">开始新测试</button>
                </div>
            </div>
        `;
        
        resumeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(resumeDiv);
        
        // 绑定按钮事件
        resumeDiv.querySelector('.resume-existing-btn').onclick = () => {
            this.resumeExistingTest();
            resumeDiv.remove();
        };
        
        resumeDiv.querySelector('.start-new-btn').onclick = () => {
            this.resetTimer();
            resumeDiv.remove();
        };
    }
    
    // 恢复现有测试
    resumeExistingTest() {
        this.isRunning = true;
        this.startTimer();
        this.updateControlButtons();
    }
    
    // 绑定事件
    bindEvents() {
        const startBtn = document.getElementById('start-test-btn');
        const pauseBtn = document.getElementById('pause-test-btn');
        const resumeBtn = document.getElementById('resume-test-btn');
        
        if (startBtn) {
            startBtn.onclick = () => this.startTest();
        }
        
        if (pauseBtn) {
            pauseBtn.onclick = () => this.pauseTest();
        }
        
        if (resumeBtn) {
            resumeBtn.onclick = () => this.resumeTest();
        }
        
        // 说明展开/折叠
        const toggleBtn = document.getElementById('toggle-instructions');
        const content = document.getElementById('instructions-content');
        
        if (toggleBtn && content) {
            toggleBtn.onclick = () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                }
            };
        }
    }
    
    // 开始测试
    startTest() {
        this.resetTimer();
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.pausedTime = 0;
        
        this.startTimer();
        this.updateControlButtons();
        this.saveState();
        
        // 通知测试系统测试开始
        if (this.onTestStart) {
            this.onTestStart();
        }
    }
    
    // 暂停测试
    pauseTest() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        this.pauseStartTime = Date.now();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.updateControlButtons();
        this.saveState();
        
        if (this.onTestPause) {
            this.onTestPause();
        }
    }
    
    // 恢复测试
    resumeTest() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.pausedTime += Date.now() - this.pauseStartTime;
        this.isPaused = false;
        
        this.startTimer();
        this.updateControlButtons();
        this.saveState();
        
        if (this.onTestResume) {
            this.onTestResume();
        }
    }
    
    // 启动计时器
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                const elapsed = Date.now() - this.startTime - this.pausedTime;
                this.remainingTimeMs = Math.max(0, this.totalTimeMs - elapsed);
                
                this.updateDisplay();
                this.saveState();
                
                if (this.onTimeUpdate) {
                    this.onTimeUpdate(this.remainingTimeMs);
                }
                
                // 时间到
                if (this.remainingTimeMs <= 0) {
                    this.timeUp();
                }
            }
        }, 1000);
    }
    
    // 时间到
    timeUp() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.updateControlButtons();
        this.clearSavedState();
        
        if (this.onTimeUp) {
            this.onTimeUp();
        }
        
        // 显示时间到提示
        this.showTimeUpNotice();
    }
    
    // 显示时间到提示
    showTimeUpNotice() {
        const notice = document.createElement('div');
        notice.className = 'time-up-notice';
        notice.innerHTML = `
            <div class="time-up-content">
                <h2>⏰ 测试时间到！</h2>
                <p>30分钟测试时间已结束，系统将自动提交您的答案。</p>
                <div class="time-up-actions">
                    <button class="submit-now-btn">立即提交</button>
                </div>
            </div>
        `;
        
        notice.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(notice);
        
        notice.querySelector('.submit-now-btn').onclick = () => {
            notice.remove();
            // 触发自动提交
            if (window.enhancedTestSystem) {
                window.enhancedTestSystem.autoSubmitTest();
            }
        };
        
        // 5秒后自动提交
        setTimeout(() => {
            if (document.contains(notice)) {
                notice.remove();
                if (window.enhancedTestSystem) {
                    window.enhancedTestSystem.autoSubmitTest();
                }
            }
        }, 5000);
    }
    
    // 重置计时器
    resetTimer() {
        this.remainingTimeMs = this.totalTimeMs;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.updateDisplay();
        this.updateControlButtons();
        this.clearSavedState();
    }
    
    // 更新显示
    updateDisplay() {
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        
        if (minutesEl && secondsEl) {
            const minutes = Math.floor(this.remainingTimeMs / 60000);
            const seconds = Math.floor((this.remainingTimeMs % 60000) / 1000);
            
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // 时间不足时添加警告样式
            const timerDisplay = document.querySelector('.timer-display');
            if (timerDisplay) {
                if (this.remainingTimeMs < 5 * 60 * 1000) { // 少于5分钟
                    timerDisplay.classList.add('timer-warning');
                } else if (this.remainingTimeMs < 10 * 60 * 1000) { // 少于10分钟
                    timerDisplay.classList.add('timer-caution');
                } else {
                    timerDisplay.classList.remove('timer-warning', 'timer-caution');
                }
            }
        }
    }
    
    // 更新控制按钮
    updateControlButtons() {
        const startBtn = document.getElementById('start-test-btn');
        const pauseBtn = document.getElementById('pause-test-btn');
        const resumeBtn = document.getElementById('resume-test-btn');
        const submitBtn = document.getElementById('submit-test-btn');
        
        if (!this.isRunning) {
            // 未开始状态
            if (startBtn) startBtn.style.display = 'inline-block';
            if (pauseBtn) pauseBtn.style.display = 'none';
            if (resumeBtn) resumeBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
        } else if (this.isPaused) {
            // 暂停状态
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'none';
            if (resumeBtn) resumeBtn.style.display = 'inline-block';
            if (submitBtn) submitBtn.style.display = 'inline-block';
        } else {
            // 运行状态
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'inline-block';
            if (resumeBtn) resumeBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'inline-block';
        }
    }
    
    // 格式化时间显示
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 保存状态
    saveState() {
        try {
            const state = {
                isRunning: this.isRunning,
                isPaused: this.isPaused,
                startTime: this.startTime,
                pausedTime: this.pausedTime,
                remainingTimeMs: this.remainingTimeMs
            };
            localStorage.setItem('test-timer-state', JSON.stringify(state));
        } catch (error) {
            console.warn('保存计时器状态失败:', error);
        }
    }
    
    // 清除保存的状态
    clearSavedState() {
        try {
            localStorage.removeItem('test-timer-state');
        } catch (error) {
            console.warn('清除计时器状态失败:', error);
        }
    }
    
    // 获取已用时间
    getElapsedTime() {
        return this.totalTimeMs - this.remainingTimeMs;
    }
    
    // 获取已用时间百分比
    getProgressPercentage() {
        return ((this.totalTimeMs - this.remainingTimeMs) / this.totalTimeMs) * 100;
    }
}

// 导出类
window.TestTimer = TestTimer;