/* Auto-generated bundle: test1-bundle.js */
// --- js/enhanced-audio-player.js ---
;(function(){
// 增强音频播放器 - 基于Next.js参考优化
class EnhancedAudioPlayer {
    constructor(testId = null) {
        this.testId = testId || this.detectTestId();
        this.currentSection = 1;
        this.audioConfig = this.getAudioConfig();
        this.playbackRate = 1.0;
        this.breakpoints = this.getBreakpoints();
        this.players = {};
        this.localFallback = {};
        this.isInitialized = false;
        
        // 键盘快捷键映射
        this.keyboardShortcuts = {
            'Space': 'togglePlay',
            'ArrowLeft': 'rewind',
            'ArrowRight': 'fastForward',
            'ArrowUp': 'speedUp',
            'ArrowDown': 'speedDown',
            'KeyR': 'restart',
            'Digit1': () => this.jumpToBreakpoint(0),
            'Digit2': () => this.jumpToBreakpoint(1),
            'Digit3': () => this.jumpToBreakpoint(2),
            'Digit4': () => this.jumpToBreakpoint(3)
        };
        
        this.init();
    }

    // 音频路径配置 - 保持CDN + 本地备份
    static AUDIO_CONFIG = {
        test1: {
            cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test1/',
            localPath: '../audio/test1/',
            sections: ['Part1 Amateur Dramatic Society.m4a', 'Part2 Talk to new employees at a strawberry farm.m4a', 'Part3-Field trip to Bolton lsland.m4a', 'Part4 Development and use of plastics.m4a']
        },
        test2: {
            cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test2/',
            localPath: '../audio/test2/',
            sections: ['Part1 Rental Property Application Form.m4a', 'Part2 Queensland Festival.m4a', 'Part3-Research for assignment of children playing outdoors.m4a', 'Part4 The Berbers.m4a']
        },
        test3: {
            cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test3/',
            localPath: '../audio/test3/',
            sections: ['Part1 Kiwi Air Customer Complaint Form.m4a', 'Part2 Spring Festival.m4a', 'Part3-Geology field trip to Iceland.m4a', 'Part4 Recycling Tyres in Australia.m4a']
        },
        'cambridge20-test1': {
            cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test1/',
            localPath: '../audio/c20-test1/',
            sections: ['c20_T1S1_64k.mp3', 'c20_T1S2_64k.mp3', 'c20_T1S3_48k.mp3', 'c20_T1S4_48k.mp3']
        },
        'cambridge20-test2': {
            cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test2/',
            localPath: '../audio/c20-test2/',
            sections: ['c20_T2S1_48k.mp3', 'c20_T2S2_48k.mp3', 'c20_T2S3_48k.mp3', 'c20_T2S4_48k.mp3']
        }
    };

    init() {
        this.setupPlayers();
        this.bindKeyboardShortcuts();
        this.setupBreakpointButtons();
        this.loadLocalFallbacks();
    }

    detectTestId() {
        const path = window.location.pathname;
        if (path.includes('test-c20-1.html')) return 'cambridge20-test1';
        if (path.includes('test-c20-2.html')) return 'cambridge20-test2';
        if (path.includes('test-c20-3.html')) return 'cambridge20-test3';
        if (path.includes('test-c20-4.html')) return 'cambridge20-test4';
        if (path.includes('test2.html')) return 'test2';
        if (path.includes('test3.html')) return 'test3';
        return 'test1';
    }

    getAudioConfig() {
        return EnhancedAudioPlayer.AUDIO_CONFIG[this.testId] || EnhancedAudioPlayer.AUDIO_CONFIG.test1;
    }

    // 获取章节断点时间 (秒)
    getBreakpoints() {
        const defaultBreakpoints = {
            test1: [0, 600, 1200, 1800], // 10分钟间隔
            test2: [0, 480, 960, 1440],  // 8分钟间隔 
            test3: [0, 540, 1080, 1620], // 9分钟间隔
            'cambridge20-test1': [0, 660, 1320, 1980], // 11分钟间隔
            'cambridge20-test2': [0, 600, 1200, 1800]
        };
        return defaultBreakpoints[this.testId] || defaultBreakpoints.test1;
    }

    setupPlayers() {
        for (let section = 1; section <= 4; section++) {
            const audio = document.getElementById(`section${section}-player`);
            const playBtn = document.getElementById(`section${section}-play`);
            const progress = document.getElementById(`section${section}-progress`);
            const timeDisplay = document.getElementById(`section${section}-time`);
            const speedControl = document.getElementById(`section${section}-speed`);

            if (!audio || !playBtn || !progress) continue;

            this.players[section] = {
                audio,
                playBtn,
                progress,
                timeDisplay,
                speedControl,
                isPlaying: false,
                currentTime: 0,
                duration: 0
            };

            this.bindPlayerEvents(section);
        }
    }

    bindPlayerEvents(section) {
        const player = this.players[section];
        if (!player) return;

        // 播放/暂停按钮
        player.playBtn.addEventListener('click', () => {
            if (!this.isInitialized) {
                this.initializeAudioSources();
                this.isInitialized = true;
            }
            this.togglePlay(section);
        });

        // 音频事件监听
        player.audio.addEventListener('loadstart', () => this.showLoadingState(section));
        player.audio.addEventListener('canplay', () => this.hideLoadingState(section));
        player.audio.addEventListener('error', () => this.handleAudioError(section));
        player.audio.addEventListener('timeupdate', () => this.updateProgress(section));
        player.audio.addEventListener('ended', () => this.onAudioEnded(section));

        // 进度条点击
        player.progress.addEventListener('click', (e) => {
            const rect = player.progress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            player.audio.currentTime = pos * player.audio.duration;
        });

        // 速度控制
        if (player.speedControl) {
            player.speedControl.addEventListener('change', (e) => {
                this.setPlaybackRate(parseFloat(e.target.value), section);
            });
        }
    }

    // 初始化音频源（本地优先，CDN备份）
    async initializeAudioSources() {
        for (let section = 1; section <= 4; section++) {
            const player = this.players[section];
            if (!player) continue;

            const sectionIndex = section - 1;
            const fileName = this.audioConfig.sections[sectionIndex];
            // 对文件名进行URL编码（空格→%20），防止路径解析失败
            const encodedFileName = encodeURIComponent(fileName);
            
            // 优先尝试本地路径（更可靠），CDN作为备份
            const localUrl = this.audioConfig.localPath + encodedFileName;
            const cdnUrl = this.audioConfig.cdnPath + encodedFileName;

            try {
                await this.loadAudioWithFallback(player.audio, localUrl, cdnUrl);
                console.log(`✅ Section ${section} 音频加载成功`);
            } catch (error) {
                console.error(`❌ Section ${section} 音频加载失败:`, error);
                console.error(`  本地路径: ${localUrl}`);
                console.error(`  CDN路径: ${cdnUrl}`);
                this.showAudioError(section);
            }
        }
    }

    // 音频加载（带备份机制）
    async loadAudioWithFallback(audioElement, primaryUrl, fallbackUrl) {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;
            const maxAttempts = 2;

            const tryLoad = (url) => {
                audioElement.src = url;
                audioElement.load();

                const onCanPlay = () => {
                    cleanup();
                    resolve(url);
                };

                const onError = () => {
                    cleanup();
                    attemptCount++;
                    
                    if (attemptCount < maxAttempts && url === primaryUrl) {
                        console.warn(`CDN加载失败，切换到本地备份: ${fallbackUrl}`);
                        tryLoad(fallbackUrl);
                    } else {
                        reject(new Error(`所有音频源加载失败`));
                    }
                };

                const cleanup = () => {
                    audioElement.removeEventListener('canplay', onCanPlay);
                    audioElement.removeEventListener('error', onError);
                };

                audioElement.addEventListener('canplay', onCanPlay, { once: true });
                audioElement.addEventListener('error', onError, { once: true });
            };

            tryLoad(primaryUrl);
        });
    }

    // 键盘快捷键绑定
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 避免在输入框中触发快捷键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            const shortcut = this.keyboardShortcuts[e.code];
            if (shortcut) {
                e.preventDefault();
                if (typeof shortcut === 'function') {
                    shortcut();
                } else {
                    this[shortcut]();
                }
            }
        });
    }

    // 设置断点按钮
    setupBreakpointButtons() {
        const container = document.getElementById('breakpoint-controls');
        if (!container) return;

        container.innerHTML = this.breakpoints.map((time, index) => 
            `<button class="breakpoint-btn" data-time="${time}">
                ${this.formatTime(time)}
            </button>`
        ).join('');

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('breakpoint-btn')) {
                const time = parseInt(e.target.dataset.time);
                this.jumpToTime(time);
            }
        });
    }

    // 播放控制方法
    async togglePlay(section = this.currentSection) {
        const player = this.players[section];
        if (!player) return;

        if (player.isPlaying) {
            this.pauseAudio(section);
        } else {
            await this.playAudio(section);
        }
    }

    async playAudio(section) {
        // 暂停其他section
        for (let i = 1; i <= 4; i++) {
            if (i !== section && this.players[i]?.isPlaying) {
                this.pauseAudio(i);
            }
        }

        const player = this.players[section];
        try {
            await player.audio.play();
            player.isPlaying = true;
            this.updatePlayButton(section, true);
            this.currentSection = section;
        } catch (error) {
            console.error(`播放错误 Section ${section}:`, error);
            this.showAudioError(section);
        }
    }

    pauseAudio(section) {
        const player = this.players[section];
        player.audio.pause();
        player.isPlaying = false;
        this.updatePlayButton(section, false);
    }

    // 速度控制
    setPlaybackRate(rate, section = null) {
        this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
        
        if (section) {
            this.players[section].audio.playbackRate = this.playbackRate;
        } else {
            // 应用到所有播放器
            Object.values(this.players).forEach(player => {
                player.audio.playbackRate = this.playbackRate;
            });
        }
        
        this.updateSpeedDisplay();
    }

    speedUp() {
        this.setPlaybackRate(this.playbackRate + 0.25);
    }

    speedDown() {
        this.setPlaybackRate(this.playbackRate - 0.25);
    }

    // 时间跳转
    jumpToTime(time) {
        const player = this.players[this.currentSection];
        if (player && player.audio.duration > time) {
            player.audio.currentTime = time;
        }
    }

    jumpToBreakpoint(index) {
        if (this.breakpoints[index] !== undefined) {
            this.jumpToTime(this.breakpoints[index]);
        }
    }

    rewind() {
        const player = this.players[this.currentSection];
        if (player) {
            player.audio.currentTime = Math.max(0, player.audio.currentTime - 10);
        }
    }

    fastForward() {
        const player = this.players[this.currentSection];
        if (player) {
            player.audio.currentTime = Math.min(player.audio.duration, player.audio.currentTime + 10);
        }
    }

    restart() {
        const player = this.players[this.currentSection];
        if (player) {
            player.audio.currentTime = 0;
        }
    }

    // UI更新方法
    updateProgress(section) {
        const player = this.players[section];
        if (!player || !player.progress) return;

        const progress = (player.audio.currentTime / player.audio.duration) * 100;
        player.progress.style.width = `${progress}%`;
        
        if (player.timeDisplay) {
            const current = this.formatTime(player.audio.currentTime);
            const duration = this.formatTime(player.audio.duration);
            player.timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    updatePlayButton(section, isPlaying) {
        const player = this.players[section];
        if (!player || !player.playBtn) return;

        const icon = player.playBtn.querySelector('i') || player.playBtn;
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        player.playBtn.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
    }

    updateSpeedDisplay() {
        const speedDisplays = document.querySelectorAll('.speed-display');
        speedDisplays.forEach(display => {
            display.textContent = `${this.playbackRate.toFixed(2)}x`;
        });
    }

    showLoadingState(section) {
        const player = this.players[section];
        if (player && player.playBtn) {
            player.playBtn.classList.add('loading');
            player.playBtn.disabled = true;
        }
    }

    hideLoadingState(section) {
        const player = this.players[section];
        if (player && player.playBtn) {
            player.playBtn.classList.remove('loading');
            player.playBtn.disabled = false;
        }
    }

    showAudioError(section) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'audio-error';
        errorMsg.textContent = `Section ${section} 音频加载失败，请检查网络连接`;
        
        const container = document.getElementById(`section${section}-player-container`);
        if (container) {
            container.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 5000);
        }
    }

    handleAudioError(section) {
        console.error(`Audio error in section ${section}`);
        this.showAudioError(section);
        
        // 尝试使用本地备份
        const player = this.players[section];
        if (player && this.localFallback[section]) {
            console.log(`尝试本地备份: ${this.localFallback[section]}`);
            player.audio.src = this.localFallback[section];
        }
    }

    onAudioEnded(section) {
        const player = this.players[section];
        player.isPlaying = false;
        this.updatePlayButton(section, false);
        
        // 自动切换到下一个section
        if (section < 4) {
            this.switchToSection(section + 1);
        }
    }

    // 加载本地备份信息（确保路径已URL编码）
    loadLocalFallbacks() {
        for (let section = 1; section <= 4; section++) {
            const audio = document.getElementById(`section${section}-player`);
            if (audio) {
                let fallbackSrc = audio.getAttribute('data-local-src') || audio.getAttribute('src') || '';
                // 确保空格被正确编码
                if (fallbackSrc && !fallbackSrc.includes('%20') && fallbackSrc.includes(' ')) {
                    // 只编码文件名部分，保留路径分隔符
                    const lastSlash = fallbackSrc.lastIndexOf('/');
                    if (lastSlash >= 0) {
                        const pathPart = fallbackSrc.substring(0, lastSlash + 1);
                        const filePart = fallbackSrc.substring(lastSlash + 1);
                        fallbackSrc = pathPart + encodeURIComponent(filePart);
                    }
                }
                this.localFallback[section] = fallbackSrc;
            }
        }
    }

    switchToSection(section) {
        // 触发section tab切换事件
        const sectionTab = document.querySelector(`[data-section="${section}"]`);
        if (sectionTab) {
            sectionTab.click();
        }
        this.currentSection = section;
    }

    // 工具方法
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 获取播放状态
    getPlaybackState() {
        return {
            currentSection: this.currentSection,
            playbackRate: this.playbackRate,
            currentTime: this.players[this.currentSection]?.audio.currentTime || 0,
            isPlaying: this.players[this.currentSection]?.isPlaying || false
        };
    }

    // 保存播放状态到localStorage
    saveState() {
        const state = this.getPlaybackState();
        localStorage.setItem(`audio-state-${this.testId}`, JSON.stringify(state));
    }

    // 恢复播放状态
    restoreState() {
        const saved = localStorage.getItem(`audio-state-${this.testId}`);
        if (saved) {
            const state = JSON.parse(saved);
            this.currentSection = state.currentSection;
            this.setPlaybackRate(state.playbackRate);
            
            // 恢复播放位置
            if (this.players[state.currentSection]) {
                this.players[state.currentSection].audio.currentTime = state.currentTime;
            }
        }
    }
}

// 全局初始化
let enhancedAudioPlayer;

document.addEventListener('DOMContentLoaded', () => {
    enhancedAudioPlayer = new EnhancedAudioPlayer();
    
    // 页面卸载时保存状态
    window.addEventListener('beforeunload', () => {
        if (enhancedAudioPlayer) {
            enhancedAudioPlayer.saveState();
        }
    });
});

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.EnhancedAudioPlayer = EnhancedAudioPlayer;
    window.enhancedAudioPlayer = enhancedAudioPlayer;
}
})();

// --- js/enhanced-answer-sheet.js ---
;(function(){
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
})();

// --- js/enhanced-keyboard-navigation.js ---
;(function(){
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
})();

// --- js/test-data.js ---
;(function(){
// 测试数据
const TEST_DATA = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>ONE WORD /OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "Amateur Dramatic Society",
            subtitle: "Secretary: Jane Caulfield\n\nMailing address: 117 Green Road, Prestwin",
            items: [
                { text: "Location for rehearsals: The [1]........................House, Wynn" },
                { text: "No experience necessary" },
                { text: "They need actors and [2]........................ singers" },
                { text: "Also need people who can [3]........................" },
                { text: "Meetings 6–8 p.m. every [4]........................" },
                { text: "Closed in [5]........................ (for 2 weeks)" },
                { text: "Membership costs:" },
                { text: "Standard: £ 40 (includes a [6]........................ once a year)" },
                { text: "Over 60s or unemployed: £ [7]........................" },
                { text: "Youth group: for people aged [8]........................ years old and under" },
                { text: "Shows:" },
                { text: "• mostly plays by [9]........................ authors", type: "bullet" },
                { text: "• family show in December", type: "bullet" },
                { text: "(raises money for children's [10]........................)", type: "bullet" }
            ]
        }
    },
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 14</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 11,
                        text: "What should employees bring to work?",
                        type: "radio",
                        options: [
                            { value: "A", text: "gloves" },
                            { value: "B", text: "lunch" },
                            { value: "C", text: "water" }
                        ]
                    },
                    {
                        id: 12,
                        text: "If employees can't come to work one day, they should",
                        type: "radio",
                        options: [
                            { value: "A", text: "contact the duty manager." },
                            { value: "B", text: "leave a phone message at the farm office." },
                            { value: "C", text: "call their team leader." }
                        ]
                    },
                    {
                        id: 13,
                        text: "One problem with customers that may occur now is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "they sometimes fail to return baskets." },
                            { value: "B", text: "they eat the fruit before paying." },
                            { value: "C", text: "they can be unsure about prices." }
                        ]
                    },
                    {
                        id: 14,
                        text: "One of the benefits of working at the strawberry farm is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "employees' friends are entitled to a small discount." },
                            { value: "B", text: "employees can have a quantity of fresh fruit for free." },
                            { value: "C", text: "employees don't pay the full price for gift items in the shop" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15- 20</strong>",
                instructions: "Choose <strong>SIX</strong> answers from the box and write the correct letter: <strong>A-J</strong>, next to Questions 15-20.",
                mapContent: {
                    title: "Map of Strawberry Farm",
                    imageUrl: "../images/test1/map.webp"
                },
                questions: [
                    {
                        id: 15,
                        text: "Staff room",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 16,
                        text: "Administration",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 17,
                        text: "Packing shed",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 18,
                        text: "Staff car park",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 19,
                        text: "Ripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 20,
                        text: "Unripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    }
                ],
                boxContent: "Buildings\nA B C D E F G H I J"
            }
        ]
    },
    section3: {
        title: "<strong>Section 3</strong>",
        parts: [
            {
                title: "<strong>Questions 21 – 24</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 21,
                        text: "Why were Mark and Stella attracted to Bolton Island for their field trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "because it is geologically unique" },
                            { value: "B", text: "because it is easily accessible" },
                            { value: "C", text: "because it is largely unstudied" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Which aspect of Bolton Island's physical geography did Mark and Stella focus on?",
                        type: "radio",
                        options: [
                            { value: "A", text: "its natural harbour" },
                            { value: "B", text: "its fertile soil" },
                            { value: "C", text: "its rock formations" }
                        ]
                    },
                    {
                        id: 23,
                        text: "Which problem did Mark and Stella have in studying Bolton Island's physical geography?",
                        type: "radio",
                        options: [
                            { value: "A", text: "getting useful information from the local residents" },
                            { value: "B", text: "recognising which features were man-made" },
                            { value: "C", text: "finding official data about the island" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What preparation was most useful for Mark and Stella's trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "reading previous field trip reports" },
                            { value: "B", text: "drawing up a detailed schedule for their trip" },
                            { value: "C", text: "doing online research" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 26</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "25-26",
                        text: "Which TWO mistakes did Mark and Stella make with their visuals?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "not taking enough care when making sketches" },
                            { value: "B", text: "not ensuring their photos had proper lighting" },
                            { value: "C", text: "not using anything to indicate the scale of their photos" },
                            { value: "D", text: "not making multiple photos and drawings of things of interest" },
                            { value: "E", text: "not adequately recording when and where drawings were made" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 27 – 28</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "27-28",
                        text: "Which TWO things does Stella say students need to do for a successful interview?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Guide the way in which the interview progresses." },
                            { value: "B", text: "Prepare the questions well in advance." },
                            { value: "C", text: "Check the recording equipment is working." },
                            { value: "D", text: "Explain fully the purpose of the interview." },
                            { value: "E", text: "Give a personal opinion on the topics which are covered." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 29 – 30</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "29-30",
                        text: "Which TWO things do Mark and Stella suggest doing with regard to note-taking on a field trip?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Ensure that terminology is correctly used in the notes." },
                            { value: "B", text: "Check your notes every evening." },
                            { value: "C", text: "Be highly selective in what you write down." },
                            { value: "D", text: "Have only one member's a team to write notes." },
                            { value: "E", text: "Keep your notes in an organised fashion." }
                        ]
                    }
                ]
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31- 40</strong>\n\nComplete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
        boxContent: {
            title: "Development and use of plastics",
            content: [
                {
                    type: "header",
                    text: "1930s"
                },
                {
                    type: "subheader",
                    text: "Polythene – two main forms:"
                },
                {
                    type: "bullet-main",
                    text: "LDPE –",
                    description: "distinguishing feature: it is highly [31] ........................",
                    examples: "e.g. used to make [32] ........................ , carrier bags and packaging materials"
                },
                {
                    type: "bullet-main",
                    text: "HDPE –",
                    description: "made tougher by exposure to a particular kind of [33] ........................",
                    examples: "– suitable for rigid containers, e.g. for bleach"
                },
                {
                    type: "subheader",
                    text: "Polyurethane – two main forms:"
                },
                {
                    type: "bullet-sub",
                    text: "blown form used for making [34] ........................ (padding) and in housing infrastructure to give [35] ........................"
                },
                {
                    type: "bullet-sub",
                    text: "non-blown form used mainly for sportswear"
                },
                {
                    type: "header",
                    text: "1940s – 1950s"
                },
                {
                    type: "subheader",
                    text: "PET"
                },
                {
                    type: "text",
                    text: "– used to make [36] ........................ , e.g. Dacron and Terylene"
                },
                {
                    type: "text",
                    text: "– popular for making containers for fizzy drinks"
                },
                {
                    type: "text",
                    text: "– because it resists abrasion"
                },
                {
                    type: "text",
                    text: "– used for household objects such as [37] ........................"
                },
                {
                    type: "subheader",
                    text: "Tupperware"
                },
                {
                    type: "text",
                    text: "– storage boxes"
                },
                {
                    type: "text",
                    text: "– revolution in [38] ........................ techniques"
                },
                {
                    type: "header",
                    text: "1960s"
                },
                {
                    type: "compound",
                    bold: "Teflon",
                    text: "– non-stick"
                },
                {
                    type: "text",
                    text: "– almost no [39] ........................ , so used for protective coatings, e.g. for frying pans"
                },
                {
                    type: "compound",
                    bold: "Gore-Tex",
                    text: "– best known for outdoor wear"
                },
                {
                    type: "text",
                    text: "– also used for various [40] ........................ purposes"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData() {
    return TEST_DATA;
}

// 导出函数
window.getTestData = getTestData; 

})();

// --- js/test-answers.js ---
;(function(){
// 测试标准答案
const standardAnswers = {
    // Section 1 答案 (1-10)
    1: "Club",
    2: "male",
    3: "drive",
    4: "Tuesday",
    5: "August",
    6: "dinner",
    7: "25",
    8: "16", // 或者设置为接受两种格式 ["16", "sixteen"]
    9: "modern",
    10: "hospital",
    
    // Section 2 答案 (11-20)
    11: "C",
    12: "A",
    13: "A",
    14: "B",
    15: "C",
    16: "H",
    17: "B",
    18: "I",
    19: "A",
    20: "E",
    
    // Section 3 答案 (21-30)
    21: "B",
    22: "A",
    23: "B",
    24: "A",
    25: ["C", "E"], // 25&26题为CE
    26: ["C", "E"],
    27: ["A", "D"], // 27&28题为AD
    28: ["A", "D"],
    29: ["B", "E"], // 29&30题为BE
    30: ["B", "E"],
    
    // Section 4 答案 (31-40)
    31: "flexible",
    32: "film",
    33: "gas",
    34: "furniture",
    35: "insulation",
    36: "fabric",
    37: "trays",
    38: "sales",
    39: "friction",
    40: "medical"
};

// 雅思听力分数换算表
const listeningScoreTable = {
    40: 9.0,
    39: 9.0,
    38: 8.5,
    37: 8.5,
    36: 8.0,
    35: 8.0,
    34: 7.5,
    33: 7.5,
    32: 7.0,
    31: 7.0,
    30: 7.0,
    29: 6.5,
    28: 6.5,
    27: 6.5,
    26: 6.0,
    25: 6.0,
    24: 6.0,
    23: 6.0,
    22: 5.5,
    21: 5.5,
    20: 5.5,
    19: 5.0,
    18: 5.0,
    17: 5.0,
    16: 5.0,
    15: 4.5,
    14: 4.5,
    13: 4.5,
    12: 4.0,
    11: 4.0,
    10: 4.0,
    9: 3.5,
    8: 3.5,
    7: 3.5,
    6: 3.5,
    5: 3.0,
    4: 3.0,
    3: 2.5,
    2: 2.0,
    1: 1.0,
    0: 0.0
};

// 获取标准答案
function getStandardAnswers() {
    return standardAnswers;
}

// 获取雅思分数
function getIeltsScore(correctCount) {
    return listeningScoreTable[correctCount] || 0;
} 
})();

// --- js/universal-test-generator.js ---
;(function(){
// 通用测试页面生成器
class UniversalTestGenerator {
    constructor() {
        this.testConfigs = {
            // 常规测试 1-6
            test1: {
                title: 'IELTS Listening Test 1',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test1/',
                    localPath: '../audio/test1/',
                    sections: [
                        'Part1 Amateur Dramatic Society.m4a',
                        'Part2 Talk to new employees at a strawberry farm.m4a', 
                        'Part3-Field trip to Bolton lsland.m4a',
                        'Part4 Development and use of plastics.m4a'
                    ]
                },
                dataFile: 'test-data.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '业余戏剧社团',
                    '草莓农场工作指导', 
                    '博尔顿岛实地考察',
                    '塑料的发展与应用'
                ]
            },
            test2: {
                title: 'IELTS Listening Test 2', 
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test2/',
                    localPath: '../audio/test2/',
                    sections: [
                        'Part1 Rental Property Application Form.m4a',
                        'Part2 Queensland Festival.m4a',
                        'Part3-Research for assignment of children playing outdoors.m4a', 
                        'Part4 The Berbers.m4a'
                    ]
                },
                dataFile: 'test-data-2.js',
                answersFile: 'test-answers-2.js',
                difficulty: '中等',
                themes: [
                    '租房申请表',
                    '昆士兰节庆活动',
                    '儿童户外游戏研究',
                    '柏柏尔人'
                ]
            },
            test3: {
                title: 'IELTS Listening Test 3',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test3/',
                    localPath: '../audio/test3/',
                    sections: [
                        'Part1 Kiwi Air Customer Complaint Form.m4a',
                        'Part2 Spring Festival.m4a', 
                        'Part3-Geology field trip to Iceland.m4a',
                        'Part4 Recycling Tyres in Australia.m4a'
                    ]
                },
                dataFile: 'test-data-3.js',
                answersFile: 'test-answers-3.js', 
                difficulty: '中等偏上',
                themes: [
                    '奇异航空投诉表格',
                    '春节庆典',
                    '冰岛地质考察',
                    '澳大利亚轮胎回收'
                ]
            },
            test4: {
                title: 'IELTS Listening Test 4',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test4/', 
                    localPath: '../audio/test4/',
                    sections: [
                        'Part 1_Windward Apartments .m4a',
                        'Part 2 .m4a',
                        'Part 3 .m4a', 
                        'Part 4.m4a'
                    ]
                },
                dataFile: 'test-data-4.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '温德沃德公寓',
                    '社区服务介绍',
                    '学术讨论',
                    '专题讲座'
                ]
            },
            test5: {
                title: 'IELTS Listening Test 5',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test5/',
                    localPath: '../audio/test5/',
                    sections: [
                        'test5_Part 1 Winsham Farm.m4a',
                        'test5_Part 2 Queensland Festival.m4a',
                        'test5_Part 3 Environmental science course.m4a',
                        'test5_Part 4-Photic sneezing.m4a'
                    ]
                },
                dataFile: 'test-data-5.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '温沙姆农场',
                    '昆士兰节庆',
                    '环境科学课程', 
                    '光性喷嚏反射'
                ]
            },
            test6: {
                title: 'IELTS Listening Test 6',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test6/',
                    localPath: '../audio/test6/',
                    sections: [
                        'Part 1_Amateur Dramatic Society.m4a',
                        'Part2_Clifton Bird Park .m4a',
                        'Part 3.m4a',
                        'Part 4 .m4a'
                    ]
                },
                dataFile: 'test-data-6.js', 
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '业余戏剧社团',
                    '克利夫顿鸟类公园',
                    '学术研讨', 
                    '专业讲座'
                ]
            },
            // 剑桥雅思20测试 
            'cambridge20-test1': {
                title: 'Cambridge IELTS 20 - Test 1',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test1/',
                    localPath: '../audio/c20-test1/',
                    sections: [
                        'c20_T1S1_64k.mp3', 
                        'c20_T1S2_64k.mp3',
                        'c20_T1S3_48k.mp3',
                        'c20_T1S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test1/cambridge20_test1_data.js',
                answersFile: 'docs/c20_test1/cambridge20_test1_answers.js',
                difficulty: '标准',
                themes: [
                    '工作申请咨询',
                    '博物馆导览介绍',
                    '学术项目讨论',
                    '海洋生物学讲座'
                ],
                official: true
            },
            'cambridge20-test2': {
                title: 'Cambridge IELTS 20 - Test 2',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test2/',
                    localPath: '../audio/c20-test2/',
                    sections: [
                        'c20_T2S1_48k.mp3',
                        'c20_T2S2_48k.mp3', 
                        'c20_T2S3_48k.mp3',
                        'c20_T2S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test2/cambridge20_test2_data.js',
                answersFile: 'docs/c20_test2/cambridge20_test2_answers.js',
                difficulty: '标准',
                themes: [
                    '健身房会员咨询',
                    '社区花园项目',
                    '研究方法讨论',
                    '可持续建筑讲座'
                ],
                official: true
            },
            'cambridge20-test3': {
                title: 'Cambridge IELTS 20 - Test 3', 
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test3/',
                    localPath: '../audio/c20-test3/',
                    sections: [
                        'c20_T3S1_48k.mp3',
                        'c20_T3S2_48k.mp3',
                        'c20_T3S3_48k.mp3', 
                        'c20_T3S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test3/cambridge20_test3_data.js',
                answersFile: 'docs/c20_test3/cambridge20_test3_answers.js',
                difficulty: '标准',
                themes: [
                    '图书馆服务咨询',
                    '历史博物馆介绍',
                    '心理学实验讨论',
                    '气候变化研究'
                ],
                official: true
            },
            'cambridge20-test4': {
                title: 'Cambridge IELTS 20 - Test 4',
                audioConfig: {
                    cdnPath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/c20-test4/',
                    localPath: '../audio/c20-test4/',
                    sections: [
                        'c20_T4S1_48k.mp3',
                        'c20_T4S2_48k.mp3',
                        'c20_T4S3_48k.mp3',
                        'c20_T4S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test4/cambridge20_test4_data.js',
                answersFile: 'docs/c20_test4/cambridge20_test4_answers.js',
                difficulty: '标准',
                themes: [
                    '旅游信息咨询',
                    '艺术中心介绍', 
                    '商业案例研究',
                    '社会学理论讲座'
                ],
                official: true
            }
        };
    }

    // 生成完整的测试页面HTML
    generateTestPage(testId) {
        const config = this.testConfigs[testId];
        if (!config) {
            throw new Error(`测试 ${testId} 配置不存在`);
        }

        return this.buildTestPageHTML(testId, config);
    }

    // 构建测试页面HTML结构
    buildTestPageHTML(testId, config) {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 安全HTTP头 -->
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
        style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
        font-src 'self' https://cdnjs.cloudflare.com data:;
        img-src 'self' data: blob:;
        audio-src 'self' https://cdn.jsdelivr.net data: blob:;
        connect-src 'self' https://cdn.jsdelivr.net;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    ">
    
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    
    <title>${config.title}</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/test.css">
    <link rel="stylesheet" href="../css/accessibility.css">
    <link rel="stylesheet" href="../css/mobile-optimizations.css">
    <link rel="stylesheet" href="../css/enhanced-components.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- 跳过导航链接 -->
    <a href="#main-content" class="skip-link">跳过导航，直接到主要内容</a>
    
    <!-- 屏幕阅读器通告区域 -->
    <div id="sr-announcements" aria-live="polite" aria-atomic="true" style="position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"></div>
    
    ${this.buildNavigation()}
    ${this.buildMainContent(testId, config)}
    ${this.buildScripts(testId, config)}
</body>
</html>`;
    }

    // 构建导航栏
    buildNavigation() {
        return `
    <!-- 导航栏 -->
    <nav class="nav-bar">
        <div class="nav-container">
            <div class="logo">
                <a href="../index.html" class="home-link">
                    <img src="../images/logo.png" alt="IELTS听力评分解析" class="logo-img">
                    IELTS听力评分解析
                </a>
            </div>
            <button class="nav-toggle" aria-label="切换导航菜单" aria-expanded="false">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-menu">
                <li><a href="../index.html">首页</a></li>
                <li><a href="scoring.html">评分详解</a></li>
                <li><a href="cases.html">案例分析</a></li>
                <li><a href="practice.html">听力练习</a></li>
                <li><button onclick="keyboardNavigation?.showHelp()" class="help-btn">
                    <i class="fas fa-keyboard"></i> 快捷键
                </button></li>
            </ul>
        </div>
    </nav>`;
    }

    // 构建主要内容区域
    buildMainContent(testId, config) {
        return `
    <!-- 主要内容区 -->
    <main class="test-container" id="main-content">
        ${this.buildTestIntro(config)}
        
        <div class="test-layout">
            <!-- 左侧主要内容 -->
            <div class="test-main">
                ${this.buildEnhancedAudioPlayer(testId, config)}
                ${this.buildSectionTabs()}
                ${this.buildQuestionsContainer(testId)}
                ${this.buildTestActions()}
            </div>

            <!-- 右侧增强答题卡 -->
            <aside class="test-sidebar">
                <div class="answer-sheet-container" id="answer-sheet-container">
                    <!-- 答题卡内容将由JS动态生成 -->
                </div>
                
                <!-- 进度显示 -->
                <div class="progress-panel">
                    <h4>答题进度</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">0 / 40 题已完成</div>
                </div>
            </aside>
        </div>
    </main>

    <!-- 反馈容器 -->
    <div id="feedback-container"></div>`;
    }

    // 构建测试介绍
    buildTestIntro(config) {
        const badgeClass = config.official ? 'official' : 'standard';
        return `
        <!-- 测试说明 -->
        <div class="test-intro">
            <div class="test-header">
                <h1>${config.official ? '🏛️' : '📝'} ${config.title}</h1>
                <div class="test-badges">
                    <span class="badge ${badgeClass}">${config.official ? '官方真题' : '模拟测试'}</span>
                    <span class="badge difficulty">${config.difficulty}</span>
                    <span class="badge duration">30分钟</span>
                    <span class="badge questions">40题</span>
                </div>
            </div>
            
            <div class="test-themes">
                <h3>测试主题</h3>
                <div class="themes-grid">
                    ${config.themes.map((theme, index) => 
                        `<div class="theme-item">
                            <span class="section-num">Section ${index + 1}</span>
                            <span class="theme-text">${theme}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="enhancement-notice">
                <div class="notice-icon">🚀</div>
                <div class="notice-content">
                    <h3>增强特性</h3>
                    <ul class="feature-list">
                        <li><i class="fas fa-keyboard"></i> 全面键盘快捷键支持</li>
                        <li><i class="fas fa-play-circle"></i> 音频断点跳转功能</li>
                        <li><i class="fas fa-star"></i> 智能题目标记系统</li>
                        <li><i class="fas fa-mobile-alt"></i> 移动端优化体验</li>
                        <li><i class="fas fa-save"></i> 自动进度保存</li>
                    </ul>
                </div>
            </div>
        </div>`;
    }

    // 构建增强音频播放器
    buildEnhancedAudioPlayer(testId, config) {
        return `
                <!-- 增强音频播放器 -->
                <div class="enhanced-audio-player" data-test-id="${testId}">
                    ${config.audioConfig.sections.map((section, index) => 
                        `<div class="audio-section" id="audio-section-${index + 1}" ${index > 0 ? 'style="display: none;"' : ''}>
                            <div class="audio-player-main">
                                <audio id="section${index + 1}-player" 
                                       src="${config.audioConfig.cdnPath}${section}"
                                       data-local-src="${config.audioConfig.localPath}${section}"
                                       preload="metadata"></audio>
                            </div>
                            <div class="audio-controls">
                                <button id="section${index + 1}-play" class="play-btn" aria-label="播放/暂停Section ${index + 1}">
                                    <i class="fas fa-play"></i>
                                </button>
                                <div class="speed-control">
                                    <button class="speed-btn" onclick="enhancedAudioPlayer?.speedDown()">−</button>
                                    <span class="speed-display">1.00x</span>
                                    <button class="speed-btn" onclick="enhancedAudioPlayer?.speedUp()">+</button>
                                </div>
                            </div>
                            <div class="breakpoint-controls" id="breakpoint-controls-${index + 1}">
                                <!-- 断点按钮将由JS动态生成 -->
                            </div>
                        </div>`
                    ).join('')}
                    
                    <div class="audio-progress">
                        <input type="range" id="current-section-progress" class="progress" min="0" max="100" value="0">
                        <div class="time-display">
                            <span id="current-section-time">00:00 / 00:00</span>
                        </div>
                    </div>
                </div>`;
    }

    // 构建Section标签页
    buildSectionTabs() {
        return `
                <!-- 部分切换标签页 -->
                <div class="section-tabs" role="tablist">
                    <button class="section-tab active" data-section="1" role="tab" 
                            aria-selected="true" id="section1-tab">Section 1</button>
                    <button class="section-tab" data-section="2" role="tab" 
                            aria-selected="false" id="section2-tab">Section 2</button>
                    <button class="section-tab" data-section="3" role="tab" 
                            aria-selected="false" id="section3-tab">Section 3</button>
                    <button class="section-tab" data-section="4" role="tab" 
                            aria-selected="false" id="section4-tab">Section 4</button>
                </div>`;
    }

    // 构建题目容器
    buildQuestionsContainer(testId) {
        return `
                <!-- 题目内容区域 -->
                <div class="questions-container">
                    <div class="question-container active" id="section1-content" role="tabpanel">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 1 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section2-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 2 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section3-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 3 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section4-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 4 题目...</p>
                        </div>
                    </div>
                </div>`;
    }

    // 构建测试操作按钮
    buildTestActions() {
        return `
                <!-- 提交按钮 -->
                <div class="test-actions">
                    <button class="btn-secondary" onclick="resetTest()">
                        <i class="fas fa-redo"></i> 重新开始
                    </button>
                    <button class="btn-primary" onclick="submitTest()">
                        <i class="fas fa-paper-plane"></i> 提交答案
                    </button>
                </div>`;
    }

    // 构建JavaScript脚本
    buildScripts(testId, config) {
        return `
    <!-- JavaScript文件 -->
    <script src="../js/enhanced-audio-player.js"></script>
    <script src="../js/enhanced-answer-sheet.js"></script>
    <script src="../js/enhanced-keyboard-navigation.js"></script>
    <script src="../${config.dataFile}"></script>
    <script src="../${config.answersFile}"></script>
    <script src="../js/universal-test-generator.js"></script>
    
    <!-- 主初始化脚本 -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化测试页面
        const testId = '${testId}';
        const testConfig = universalTestGenerator.testConfigs[testId];
        
        // 初始化音频播放器
        if (window.enhancedAudioPlayer) {
            enhancedAudioPlayer.testId = testId;
            enhancedAudioPlayer.audioConfig = testConfig.audioConfig;
        }
        
        // 加载题目数据
        loadQuestionData(testId);
        
        // 初始化答题卡
        initializeAnswerSheet();
        
        // 绑定事件监听器
        bindEventListeners();
        
        // 显示启动提示
        setTimeout(() => {
            if (enhancedAnswerSheet) {
                enhancedAnswerSheet.showFeedback('🚀 ${config.title} 已准备就绪！按 H 查看帮助', 'info');
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
            const container = document.getElementById(\`section\${sectionNum}-content\`);
            if (container) {
                container.innerHTML = renderSection(data[sectionKey], sectionNum);
            }
        });
    }
    
    // 渲染单个section
    function renderSection(sectionData, sectionNum) {
        let html = \`<div class="section-header">\`;
        html += \`<h2>Section \${sectionNum}</h2>\`;
        
        if (sectionData.instructions) {
            html += \`<div class="section-instructions">\${sectionData.instructions}</div>\`;
        }
        
        html += \`</div>\`;
        
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
        let html = \`<div class="form-content">\`;
        
        if (formData.title) {
            html += \`<h3>\${formData.title}</h3>\`;
        }
        
        if (formData.subtitle) {
            html += \`<div class="form-subtitle">\${formData.subtitle.replace(/\\n/g, '<br>')}</div>\`;
        }
        
        if (formData.items) {
            formData.items.forEach((item, index) => {
                const questionNum = (sectionNum - 1) * 10 + index + 1;
                if (item.text.includes('[' + (index + 1) + ']')) {
                    // 填空题
                    const processedText = item.text.replace(
                        \`[\${index + 1}]........................\`,
                        \`<input type="text" id="q\${questionNum}" class="fill-blank" placeholder="\${index + 1}" maxlength="20">\`
                    );
                    html += \`<div class="question-item" data-question="\${questionNum}">\${processedText}</div>\`;
                } else {
                    html += \`<div class="form-item \${item.type || ''}">\${item.text}</div>\`;
                }
            });
        }
        
        html += \`</div>\`;
        return html;
    }
    
    // 渲染parts类型题目
    function renderPartsSection(parts, sectionNum) {
        let html = '';
        
        parts.forEach((part, partIndex) => {
            html += \`<div class="question-part">\`;
            
            if (part.title) {
                html += \`<h3>\${part.title}</h3>\`;
            }
            
            if (part.instructions) {
                html += \`<div class="part-instructions">\${part.instructions}</div>\`;
            }
            
            if (part.questions) {
                html += renderQuestionsSection(part.questions, sectionNum, partIndex);
            }
            
            if (part.mapContent) {
                html += \`<div class="map-content">\`;
                html += \`<h4>\${part.mapContent.title}</h4>\`;
                if (part.mapContent.imageUrl) {
                    html += \`<img src="\${part.mapContent.imageUrl}" alt="地图" class="map-image">\`;
                }
                html += \`</div>\`;
            }
            
            if (part.boxContent) {
                html += \`<div class="box-content">\${part.boxContent}</div>\`;
            }
            
            html += \`</div>\`;
        });
        
        return html;
    }
    
    // 渲染问题列表
    function renderQuestionsSection(questions, sectionNum, partIndex = 0) {
        let html = \`<div class="mcq-container">\`;
        
        questions.forEach((question, qIndex) => {
            const questionId = question.id || \`q\${question.id || (sectionNum-1)*10 + qIndex + 1}\`;
            
            html += \`<div class="question-item" data-question="\${questionId}">\`;
            html += \`<h4>\${question.id || qIndex + 1}. \${question.text}</h4>\`;
            
            if (question.type === 'radio' && question.options) {
                html += \`<div class="options">\`;
                question.options.forEach((option, optIndex) => {
                    html += \`<label class="option-label">\`;
                    html += \`<input type="radio" name="\${questionId}" value="\${option.value}">\`;
                    html += \`<span class="option-text">\${option.value}. \${option.text}</span>\`;
                    html += \`</label>\`;
                });
                html += \`</div>\`;
            } else if (question.type === 'text') {
                html += \`<div class="text-input">\`;
                html += \`<input type="text" id="\${questionId}" placeholder="\${question.placeholder || ''}">\`;
                html += \`</div>\`;
            }
            
            html += \`</div>\`;
        });
        
        html += \`</div>\`;
        return html;
    }
    
    // 初始化答题卡
    function initializeAnswerSheet() {
        if (enhancedAnswerSheet) {
            // 构建题目数组
            const allQuestions = [];
            for (let i = 1; i <= 40; i++) {
                allQuestions.push({
                    id: \`q\${i}\`,
                    number: i
                });
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
                const value = e.target.type === 'radio' ? 
                    (e.target.checked ? e.target.value : null) : e.target.value;
                
                if (enhancedAnswerSheet && questionId) {
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
        
        const activeTab = document.querySelector(\`[data-section="\${sectionNum}"]\`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }
        
        // 更新内容区域
        document.querySelectorAll('.question-container').forEach(container => {
            container.style.display = 'none';
        });
        
        const activeContent = document.getElementById(\`section\${sectionNum}-content\`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
        
        // 更新音频播放器
        document.querySelectorAll('.audio-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const activeAudio = document.getElementById(\`audio-section-\${sectionNum}\`);
        if (activeAudio) {
            activeAudio.style.display = 'block';
        }
        
        // 通知音频播放器
        if (enhancedAudioPlayer) {
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
        if (progressText) progressText.textContent = \`\${answeredCount} / \${totalQuestions} 题已完成\`;
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
            
            if (enhancedAnswerSheet) {
                enhancedAnswerSheet.reset();
            }
            
            updateProgress();
        }
    }
    
    // 提交测试
    function submitTest() {
        const answers = {};
        
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'radio' && input.checked) {
                answers[input.name] = input.value;
            } else if (input.type === 'text' && input.value.trim()) {
                answers[input.id] = input.value.trim();
            }
        });
        
        console.log('提交答案:', answers);
        
        if (enhancedAnswerSheet) {
            enhancedAnswerSheet.showFeedback('答案已提交！', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'score-result.html';
        }, 2000);
    }
    
    // 初始化键盘导航系统
    if (keyboardNavigation) {
        keyboardNavigation.updateQuestionInfo(0, 40);
    }
    </script>`;
    }

    // 生成所有测试页面
    generateAllTestPages() {
        const results = {};
        
        Object.keys(this.testConfigs).forEach(testId => {
            try {
                results[testId] = this.generateTestPage(testId);
            } catch (error) {
                console.error(`生成 ${testId} 页面失败:`, error);
                results[testId] = null;
            }
        });
        
        return results;
    }

    // 获取测试列表
    getTestList() {
        return Object.keys(this.testConfigs).map(testId => ({
            id: testId,
            title: this.testConfigs[testId].title,
            difficulty: this.testConfigs[testId].difficulty,
            official: this.testConfigs[testId].official || false,
            themes: this.testConfigs[testId].themes
        }));
    }
}

// 全局初始化
const universalTestGenerator = new UniversalTestGenerator();

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.UniversalTestGenerator = UniversalTestGenerator;
    window.universalTestGenerator = universalTestGenerator;
}
})();

// --- js/test1-init.js ---
;(function(){
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

})();

// --- js/score-engine.js ---
;(function(){
// 统一评分引擎（兼容旧页面 window.ScoreEngine.calculate 调用）
(function () {
    'use strict';

    const NUMBER_WORDS = {
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        ten: '10'
    };

    function normalizeText(value) {
        if (value === null || value === undefined) return '';
        const text = String(value).trim().toLowerCase().replace(/\s+/g, ' ');
        return NUMBER_WORDS[text] || text;
    }

    function toArrayAnswer(value) {
        if (Array.isArray(value)) {
            return value.map(normalizeText).filter(Boolean);
        }
        const text = normalizeText(value);
        if (!text) return [];
        return text
            .split(/[,;/\s]+/)
            .map(normalizeText)
            .filter(Boolean);
    }

    function parseAlternatives(correctAnswer) {
        const text = normalizeText(correctAnswer);
        if (!text) return [];
        if (text.includes('|')) return text.split('|').map(normalizeText).filter(Boolean);
        if (text.includes('/')) return text.split('/').map(normalizeText).filter(Boolean);
        return [text];
    }

    function compareAnswer(userAnswer, correctAnswer) {
        if (Array.isArray(correctAnswer)) {
            const expected = correctAnswer.map(normalizeText).filter(Boolean);
            const actual = toArrayAnswer(userAnswer);
            if (expected.length === 0) return { score: 0, status: 'incorrect' };
            const matched = actual.filter(a => expected.includes(a)).length;
            const score = Math.min(1, matched / expected.length);
            if (score >= 1) return { score: 1, status: 'correct' };
            if (score > 0) return { score, status: 'partial' };
            return { score: 0, status: 'incorrect' };
        }

        const expectedAlternatives = parseAlternatives(correctAnswer);
        const actual = normalizeText(userAnswer);

        if (!actual || expectedAlternatives.length === 0) {
            return { score: 0, status: 'incorrect' };
        }

        if (expectedAlternatives.includes(actual)) {
            return { score: 1, status: 'correct' };
        }

        return { score: 0, status: 'incorrect' };
    }

    function parseSectionAndQuestion(key) {
        const sectionMatch = String(key).match(/section(\d+)_/i);
        const questionMatch = String(key).match(/_(\d+)/);
        const section = sectionMatch ? Math.max(1, Math.min(4, parseInt(sectionMatch[1], 10))) : 1;
        const questionNumber = questionMatch ? parseInt(questionMatch[1], 10) : 0;
        return { section, questionNumber };
    }

    function toBandScore(rawScore) {
        const score = Math.max(0, Math.min(40, Math.round(rawScore)));
        if (score >= 39) return 9.0;
        if (score >= 37) return 8.5;
        if (score >= 35) return 8.0;
        if (score >= 32) return 7.5;
        if (score >= 30) return 7.0;
        if (score >= 27) return 6.5;
        if (score >= 23) return 6.0;
        if (score >= 18) return 5.5;
        if (score >= 15) return 5.0;
        if (score >= 11) return 4.5;
        if (score >= 8) return 4.0;
        if (score >= 5) return 3.5;
        if (score >= 2) return 3.0;
        if (score >= 1) return 2.5;
        return 2.0;
    }

    function buildProblemAreas(sectionScores, sectionAnalysis) {
        const tips = [];

        for (let section = 1; section <= 4; section++) {
            const details = sectionAnalysis[`section${section}`] || [];
            if (details.length === 0) continue;

            const correctCount = details.filter(item => item.status === 'correct').length;
            const accuracy = correctCount / details.length;

            if (accuracy < 0.5) {
                tips.push(`Section ${section} 正确率偏低，建议优先复盘该部分错题。`);
            } else if (accuracy < 0.7) {
                tips.push(`Section ${section} 还有提升空间，建议加强关键词捕捉与同义替换识别。`);
            }
        }

        const partialCount = Object.values(sectionAnalysis)
            .flat()
            .filter(item => item.status === 'partial').length;
        if (partialCount > 0) {
            tips.push('存在部分得分题目，建议检查拼写与答案格式。');
        }

        return tips;
    }

    function calculate(userAnswers, answerKey) {
        const safeUserAnswers = userAnswers || {};
        const safeAnswerKey = answerKey || {};

        const result = {
            totalScore: 0,
            bandScore: 0,
            sectionScores: {
                section1: 0,
                section2: 0,
                section3: 0,
                section4: 0
            },
            sectionAnalysis: {
                section1: [],
                section2: [],
                section3: [],
                section4: []
            },
            problemAreas: []
        };

        Object.entries(safeAnswerKey).forEach(([key, correctAnswer]) => {
            const userAnswer = safeUserAnswers[key];
            const { section, questionNumber } = parseSectionAndQuestion(key);
            const compare = compareAnswer(userAnswer, correctAnswer);

            result.totalScore += compare.score;
            result.sectionScores[`section${section}`] += compare.score;
            result.sectionAnalysis[`section${section}`].push({
                questionNumber,
                userAnswer: Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer || ''),
                correctAnswer: Array.isArray(correctAnswer) ? correctAnswer.join(', ') : (correctAnswer || ''),
                status: compare.status,
                score: compare.score
            });
        });

        // 保持稳定输出
        result.totalScore = Number(result.totalScore.toFixed(1));
        for (let section = 1; section <= 4; section++) {
            const key = `section${section}`;
            result.sectionScores[key] = Number(result.sectionScores[key].toFixed(1));
        }

        result.bandScore = toBandScore(result.totalScore);
        result.problemAreas = buildProblemAreas(result.sectionScores, result.sectionAnalysis);

        return result;
    }

    window.ScoreEngine = {
        calculate
    };
})();


})();

// --- js/test-page-events.js ---
;(function(){
// Attach non-inline event handlers for test pages
(function(){
  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  onReady(function(){
    function bindClick(el, handler){ if (!el) return; el.addEventListener('click', function(e){ e.preventDefault(); try{ handler(); }catch(err){ console.error(err); } }); }
    // Primary IDs
    var btnSubmit = document.getElementById('btn-submit');
    var btnReset = document.getElementById('btn-reset');
    if (btnSubmit && typeof window.submitTest === 'function') bindClick(btnSubmit, window.submitTest);
    if (btnReset && typeof window.resetTest === 'function') bindClick(btnReset, window.resetTest);
    // Fallback selectors for pages using classes or data-action
    if (typeof window.submitTest === 'function') {
      document.querySelectorAll('.submit-btn, [data-action="submit-test"]').forEach(function(el){ bindClick(el, window.submitTest); });
    }
    if (typeof window.resetTest === 'function') {
      document.querySelectorAll('.btn-reset, [data-action="reset-test"]').forEach(function(el){ bindClick(el, window.resetTest); });
    }
  });
})();

})();
