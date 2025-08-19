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

    // 初始化音频源（CDN优先，本地备份）
    async initializeAudioSources() {
        for (let section = 1; section <= 4; section++) {
            const player = this.players[section];
            if (!player) continue;

            const sectionIndex = section - 1;
            const fileName = this.audioConfig.sections[sectionIndex];
            
            // 优先尝试CDN
            const cdnUrl = this.audioConfig.cdnPath + fileName;
            const localUrl = this.audioConfig.localPath + fileName;

            try {
                await this.loadAudioWithFallback(player.audio, cdnUrl, localUrl);
                console.log(`Section ${section} 音频加载成功`);
            } catch (error) {
                console.error(`Section ${section} 音频加载失败:`, error);
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

    // 加载本地备份信息
    loadLocalFallbacks() {
        for (let section = 1; section <= 4; section++) {
            const audio = document.getElementById(`section${section}-player`);
            if (audio) {
                this.localFallback[section] = audio.getAttribute('data-local-src') || audio.src;
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