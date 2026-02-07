// 通用音频播放器系统 - 支持所有7套卷子
console.log('🎵 加载通用音频播放器系统...');

// 所有测试的音频配置
const UNIVERSAL_AUDIO_CONFIG = {
    test1: {
        basePath: '../audio/test1/',
        sections: [
            'Part1 Amateur Dramatic Society.m4a',
            'Part2 Talk to new employees at a strawberry farm.m4a',
            'Part3-Field trip to Bolton lsland.m4a',
            'Part4 Development and use of plastics.m4a'
        ]
    },
    test2: {
        basePath: '../audio/test2/',
        sections: [
            'Part1 Rental Property Application Form.m4a',
            'Part2 Queensland Festival.m4a',
            'Part3-Research for assignment of children playing outdoors.m4a',
            'Part4 The Berbers.m4a'
        ]
    },
    test3: {
        basePath: '../audio/test3/',
        sections: [
            'Part1 Kiwi Air Customer Complaint Form.m4a',
            'Part2 Spring Festival.m4a',
            'Part3-Geology field trip to Iceland.m4a',
            'Part4 Recycling Tyres in Australia.m4a'
        ]
    },
    test4: {
        basePath: '../audio/test4/',
        sections: [
            'Part1_Windward Apartments .m4a',
            'Part2 .m4a',
            'Part 3 .m4a',
            'Part 4.m4a'
        ]
    },
    test5: {
        basePath: '../audio/test5/',
        sections: [
            'test5_Part 1 Winsham Farm.m4a',
            'test5_Part 2 Queensland Festival.m4a',
            'test5_Part 3 Environmental science course.m4a',
            'test5_Part 4-Photic sneezing.m4a'
        ]
    },
    test6: {
        basePath: '../audio/test6/',
        sections: [
            'Part 1_Amateur Dramatic Society.m4a',
            'Part2_Clifton Bird Park .m4a',
            'Part 3.m4a',
            'Part 4 .m4a'
        ]
    },
    test7: {
        basePath: '../audio/c20-test4/',
        sections: ['c20_T4S1_48k.mp3', 'c20_T4S2_48k.mp3', 'c20_T4S3_48k.mp3', 'c20_T4S4_48k.mp3']
    }
};

// 通用音频播放器类
class UniversalAudioPlayer {
    constructor() {
        this.currentTest = this.detectCurrentTest();
        this.audioConfig = UNIVERSAL_AUDIO_CONFIG[this.currentTest] || UNIVERSAL_AUDIO_CONFIG.test1;
        this.players = {};
        this.currentSection = 1;
        this.isInitialized = false;
        
        console.log(`音频播放器初始化: ${this.currentTest}`);
        console.log('音频配置:', this.audioConfig);
    }

    // 检测当前测试
    detectCurrentTest() {
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('test1') || path.includes('/test.html')) return 'test1';
        if (path.includes('test2')) return 'test2';
        if (path.includes('test3')) return 'test3';
        if (path.includes('test4')) return 'test4';
        if (path.includes('test5')) return 'test5';
        if (path.includes('test6')) return 'test6';
        if (path.includes('test7')) return 'test7';
        
        return 'test1';
    }

    // 初始化音频播放器
    async init() {
        console.log('初始化通用音频播放器...');
        
        // 等待DOM元素加载
        await this.waitForElements();
        
        // 更新音频源
        this.updateAudioSources();
        
        // 初始化所有播放器
        for (let i = 1; i <= 4; i++) {
            this.initPlayer(i);
        }
        
        // 绑定section切换事件
        this.bindSectionEvents();
        
        this.isInitialized = true;
        console.log('✅ 通用音频播放器初始化完成');
    }

    // 等待DOM元素加载
    waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                const hasAudioElements = document.querySelectorAll('audio[id*="section"]').length >= 1;
                const hasPlayerContainers = document.querySelectorAll('[id*="player-container"]').length >= 1;
                
                if (hasAudioElements || hasPlayerContainers || document.querySelectorAll('.audio-player').length > 0) {
                    resolve();
                } else {
                    setTimeout(checkElements, 100);
                }
            };
            checkElements();
        });
    }

    // 更新音频源路径
    updateAudioSources() {
        console.log('更新音频源路径...');
        
        for (let section = 1; section <= 4; section++) {
            // 尝试多种可能的audio元素ID
            const possibleIds = [
                `section${section}-player`,
                `audio-section-${section}`,
                `section-${section}-audio`,
                `player-section${section}`
            ];
            
            let audioElement = null;
            for (const id of possibleIds) {
                audioElement = document.getElementById(id);
                if (audioElement) break;
            }

            // 如果没找到，尝试通过类名或其他方式查找
            if (!audioElement) {
                const audioElements = document.querySelectorAll('audio');
                if (audioElements[section - 1]) {
                    audioElement = audioElements[section - 1];
                }
            }

            if (audioElement) {
                const audioPath = this.getAudioPath(section);
                audioElement.src = audioPath;
                console.log(`✅ Section ${section} 音频路径更新: ${audioPath}`);
            } else {
                console.warn(`❌ Section ${section} 音频元素未找到`);
            }
        }
    }

    // 获取音频路径
    getAudioPath(section) {
        const sectionIndex = section - 1;
        if (this.audioConfig && this.audioConfig.sections[sectionIndex]) {
            return this.audioConfig.basePath + this.audioConfig.sections[sectionIndex];
        }
        // 备用路径
        return `audio/test1/section${section}.mp3`;
    }

    // 初始化单个播放器
    initPlayer(section) {
        const audioElement = this.findAudioElement(section);
        const playButton = this.findPlayButton(section);
        const progressElement = this.findProgressElement(section);
        const timeElement = this.findTimeElement(section);
        const speedElement = this.findSpeedElement(section);

        if (!audioElement) {
            console.warn(`Section ${section} 音频元素未找到，跳过初始化`);
            return;
        }

        // 创建播放器对象
        this.players[section] = {
            audio: audioElement,
            playBtn: playButton,
            progress: progressElement,
            time: timeElement,
            speed: speedElement,
            isPlaying: false,
            section: section
        };

        // 绑定事件
        this.bindPlayerEvents(section);
        
        console.log(`✅ Section ${section} 播放器初始化完成`);
    }

    // 查找音频元素
    findAudioElement(section) {
        const possibleIds = [
            `section${section}-player`,
            `audio-section-${section}`,
            `section-${section}-audio`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        // 通过索引查找
        const audioElements = document.querySelectorAll('audio');
        return audioElements[section - 1];
    }

    // 查找播放按钮
    findPlayButton(section) {
        const possibleIds = [
            `section${section}-play`,
            `play-section-${section}`,
            `btn-play-${section}`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        // 通过类名或其他方式查找
        return document.querySelector(`[data-section="${section}"] .play-btn, .section-${section} .play-btn`);
    }

    // 查找进度条元素
    findProgressElement(section) {
        const possibleIds = [
            `section${section}-progress`,
            `progress-section-${section}`,
            `section-${section}-progress`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .progress, .section-${section} .progress`);
    }

    // 查找时间显示元素
    findTimeElement(section) {
        const possibleIds = [
            `section${section}-time`,
            `time-section-${section}`,
            `section-${section}-time`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .time, .section-${section} .time`);
    }

    // 查找速度控制元素
    findSpeedElement(section) {
        const possibleIds = [
            `section${section}-speed`,
            `speed-section-${section}`,
            `section-${section}-speed`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .speed-select, .section-${section} .speed-select`);
    }

    // 绑定播放器事件
    bindPlayerEvents(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        // 播放/暂停按钮
        if (player.playBtn) {
            player.playBtn.addEventListener('click', () => {
                if (player.isPlaying) {
                    this.pauseAudio(section);
                } else {
                    this.playAudio(section);
                }
            });
        }

        // 进度条
        if (player.progress) {
            player.progress.addEventListener('input', (e) => {
                if (player.audio.duration) {
                    const value = parseFloat(e.target.value);
                    player.audio.currentTime = (value / 100) * player.audio.duration;
                }
            });

            player.progress.addEventListener('click', (e) => {
                if (player.audio.duration) {
                    const rect = player.progress.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    player.audio.currentTime = pos * player.audio.duration;
                }
            });
        }

        // 速度控制
        if (player.speed) {
            player.speed.addEventListener('change', () => {
                player.audio.playbackRate = parseFloat(player.speed.value);
            });
        }

        // 音频事件
        player.audio.addEventListener('timeupdate', () => {
            this.updateProgress(section);
            this.updateTimeDisplay(section);
        });

        player.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay(section);
        });

        player.audio.addEventListener('ended', () => {
            this.pauseAudio(section);
            player.audio.currentTime = 0;
            this.updateProgress(section);
        });

        player.audio.addEventListener('error', (e) => {
            console.error(`Section ${section} 音频加载失败:`, e);
            this.showAudioError(section);
        });
    }

    // 播放音频
    playAudio(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        // 暂停其他正在播放的音频
        Object.keys(this.players).forEach(s => {
            if (s != section) this.pauseAudio(s);
        });

        player.audio.play().then(() => {
            player.isPlaying = true;
            if (player.playBtn) {
                player.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                player.playBtn.textContent = player.playBtn.textContent || '⏸️';
            }
            console.log(`▶️ Section ${section} 开始播放`);
        }).catch(error => {
            console.error(`Section ${section} 播放失败:`, error);
            this.showAudioError(section);
        });
    }

    // 暂停音频
    pauseAudio(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        player.audio.pause();
        player.isPlaying = false;
        if (player.playBtn) {
            player.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            player.playBtn.textContent = player.playBtn.textContent.includes('⏸️') ? '▶️' : player.playBtn.textContent;
        }
        console.log(`⏸️ Section ${section} 暂停播放`);
    }

    // 更新进度条
    updateProgress(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.progress) return;

        if (player.audio.duration) {
            const percent = (player.audio.currentTime / player.audio.duration) * 100;
            if (player.progress.type === 'range') {
                player.progress.value = percent;
            } else {
                player.progress.style.width = `${percent}%`;
            }
        }
    }

    // 更新时间显示
    updateTimeDisplay(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.time) return;

        const current = this.formatTime(player.audio.currentTime || 0);
        const total = this.formatTime(player.audio.duration || 0);
        player.time.textContent = `${current} / ${total}`;
    }

    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 绑定section切换事件
    bindSectionEvents() {
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const section = parseInt(tab.dataset.section);
                this.currentSection = section;
                
                // 暂停其他section的音频
                Object.keys(this.players).forEach(s => {
                    if (s != section) this.pauseAudio(s);
                });
                
                console.log(`切换到 Section ${section}`);
            });
        });
    }

    // 显示音频错误
    showAudioError(section) {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #dc3545; color: white; padding: 15px;
            border-radius: 5px; z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        errorMsg.innerHTML = `❌ Section ${section} 音频加载失败<br><small>请检查音频文件是否存在</small>`;
        document.body.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 5000);
    }

    // 检查音频可用性
    async checkAudioAvailability() {
        const results = [];
        
        for (let section = 1; section <= 4; section++) {
            const audioPath = this.getAudioPath(section);
            try {
                const response = await fetch(audioPath, { method: 'HEAD' });
                results.push({
                    section,
                    path: audioPath,
                    available: response.ok,
                    status: response.status
                });
            } catch (error) {
                results.push({
                    section,
                    path: audioPath,
                    available: false,
                    error: error.message
                });
            }
        }

        console.log('音频可用性检查结果:', results);
        return results;
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 DOM加载完成，启动通用音频播放器...');
    
    setTimeout(async () => {
        window.universalAudioPlayer = new UniversalAudioPlayer();
        await window.universalAudioPlayer.init();
        
        // 检查音频可用性
        const audioResults = await window.universalAudioPlayer.checkAudioAvailability();
        const availableCount = audioResults.filter(r => r.available).length;
        
        console.log(`✅ 音频系统初始化完成，${availableCount}/4 个音频文件可用`);
    }, 1000);
});

console.log('✅ 通用音频播放器系统加载完成');
