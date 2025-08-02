// 音频路径配置 - 使用jsDelivr CDN
const AUDIO_CONFIG = {
    // 现有测试路径配置
    test1: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test1/',
        sections: ['section1.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3']
    },
    test2: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test 2/',
        sections: ['Part 1 Winsham Farm.m4a', 'Part 2 Queensland Festival.m4a', 'Part 3 Environmental science course.mp3', 'Part 4-Photic sneezing.m4a']
    },
    test3: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test 3/',
        sections: ['Part 1 .mp3', 'Part 2 .m4a', 'Part 3 (2).mp3', 'Part 4 .mp3']
    },
    test4: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test4/',
        sections: ['section1_compressed_256k.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3']
    },
    test5: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test5/',
        sections: ['section1.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3']
    },
    test6: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test6/',
        sections: ['section1.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3']
    },
    test7: {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test7/',
        sections: ['section1.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3']
    },
    // 剑桥雅思20配置
    'cambridge20-test1': {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频 Test1/',
        sections: ['Section1.mp3', 'Section2.mp3', 'Section3.mp3', 'Section4.mp3']
    },
    'cambridge20-test2': {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/',
        sections: ['Section1.mp3', 'Section2.mp3', 'Section3.mp3', 'Section4.mp3']
    },
    'cambridge20-test3': {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test3/',
        sections: ['Section1.mp3', 'Section2.mp3', 'Section3.mp3', 'Section4.mp3']
    },
    'cambridge20-test4': {
        basePath: 'https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/',
        sections: ['Section1.mp3', 'Section2.mp3', 'Section3.mp3', 'Section4.mp3']
    }
};

// 音频播放器控制类
class AudioPlayer {
    constructor(testId = null) {
        this.testId = testId || this.detectTestId();
        this.currentSection = 1;
        this.audioConfig = this.getAudioConfig();
        this.players = {
            1: document.getElementById('section1-player'),
            2: document.getElementById('section2-player'),
            3: document.getElementById('section3-player'),
            4: document.getElementById('section4-player')
        };
        this.playButtons = {
            1: document.getElementById('section1-play'),
            2: document.getElementById('section2-play'),
            3: document.getElementById('section3-play'),
            4: document.getElementById('section4-play')
        };
        this.progressBars = {
            1: document.getElementById('section1-progress'),
            2: document.getElementById('section2-progress'),
            3: document.getElementById('section3-progress'),
            4: document.getElementById('section4-progress')
        };
        this.speedControls = {
            1: document.getElementById('section1-speed'),
            2: document.getElementById('section2-speed'),
            3: document.getElementById('section3-speed'),
            4: document.getElementById('section4-speed')
        };
        
        // 更新音频源路径
        this.updateAudioSources();
        
        // 初始化各部分的音频播放器
        this.initPlayer(1);
        this.initPlayer(2);
        this.initPlayer(3);
        this.initPlayer(4);
        
        this.bindSectionTabs();
    }
    
    // 检测当前测试ID
    detectTestId() {
        const path = window.location.pathname;
        // 剑桥雅思20测试页面检测
        if (path.includes('test-c20-1.html')) return 'cambridge20-test1';
        if (path.includes('test-c20-2.html')) return 'cambridge20-test2';
        if (path.includes('test-c20-3.html')) return 'cambridge20-test3';
        if (path.includes('test-c20-4.html')) return 'cambridge20-test4';
        // 原有测试页面检测
        if (path.includes('test2.html')) return 'test2';
        if (path.includes('test3.html')) return 'test3';
        return 'test1'; // 默认为test1
    }
    
    // 获取音频配置
    getAudioConfig() {
        return AUDIO_CONFIG[this.testId] || AUDIO_CONFIG.test1;
    }
    
    // 构建音频文件完整路径
    getAudioPath(section) {
        const sectionIndex = section - 1;
        if (this.audioConfig && this.audioConfig.sections[sectionIndex]) {
            return this.audioConfig.basePath + this.audioConfig.sections[sectionIndex];
        }
        // 向后兼容：如果没有配置，使用CDN默认路径
        return `https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/audio/test1/section${section}.mp3`;
    }
    
    // 更新音频源路径
    updateAudioSources() {
        for (let section = 1; section <= 4; section++) {
            const audioElement = document.getElementById(`section${section}-player`);
            if (audioElement) {
                const newPath = this.getAudioPath(section);
                audioElement.src = newPath;
                console.log(`更新 Section ${section} 音频路径:`, newPath);
            }
        }
    }
    
    initPlayer(section) {
        const playerContainer = document.getElementById(`section${section}-player-container`);
        const audio = document.getElementById(`section${section}-player`);
        const playBtn = document.getElementById(`section${section}-play`);
        const progress = document.getElementById(`section${section}-progress`);
        const timeDisplay = document.getElementById(`section${section}-time`);
        const speedSelect = document.getElementById(`section${section}-speed`);
        
        if (!playerContainer || !audio || !playBtn || !progress || !timeDisplay || !speedSelect) {
            console.warn(`音频播放器元素未找到，部分 ${section}`);
            return;
        }
        
        this.players[section] = {
            container: playerContainer,
            audio,
            playBtn,
            progress,
            timeDisplay,
            speedSelect,
            isPlaying: false
        };
        
        this.bindPlayerEvents(section);
    }
    
    bindPlayerEvents(section) {
        const player = this.players[section];
        if (!player) return;
        
        // 播放/暂停按钮事件
        player.playBtn.addEventListener('click', () => {
            if (player.isPlaying) {
                this.pauseAudio(section);
            } else {
                this.playAudio(section);
            }
        });
        
        // 进度条点击事件
        const progressBar = player.playBtn.parentElement.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            player.audio.currentTime = pos * player.audio.duration;
            this.updateProgress(section);
        });
        
        // 播放速度改变事件
        player.speedSelect.addEventListener('change', () => {
            player.audio.playbackRate = parseFloat(player.speedSelect.value);
        });
        
        // 音频时间更新事件
        player.audio.addEventListener('timeupdate', () => {
            this.updateProgress(section);
            this.updateTimeDisplay(section);
        });
        
        // 音频加载完成事件
        player.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay(section);
        });
        
        // 音频结束事件
        player.audio.addEventListener('ended', () => {
            this.pauseAudio(section);
            player.audio.currentTime = 0;
            this.updateProgress(section);
        });
    }
    
    bindSectionTabs() {
        const tabs = document.querySelectorAll('.section-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const section = parseInt(tab.dataset.section);
                
                // 暂停当前播放的音频
                if (this.currentSection) {
                    this.pauseAudio(this.currentSection);
                }
                
                // 更新当前部分
                this.currentSection = section;
                
                // 更新音频播放器显示
                this.updatePlayerVisibility();
                
                // 更新部分内容显示
                this.updateSectionVisibility();
            });
        });
        
        // 初始化显示
        this.updatePlayerVisibility();
    }
    
    updatePlayerVisibility() {
        // 更新音频播放器显示
        Object.keys(this.players).forEach(section => {
            const player = this.players[section];
            if (parseInt(section) === this.currentSection) {
                player.container.style.display = 'block';
            } else {
                player.container.style.display = 'none';
            }
        });
    }
    
    updateSectionVisibility() {
        // 更新部分内容显示
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const activeSection = document.getElementById(`section-${this.currentSection}`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // 更新标签状态
        const tabs = document.querySelectorAll('.section-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (parseInt(tab.dataset.section) === this.currentSection) {
                tab.classList.add('active');
            }
        });
    }
    
    playAudio(section) {
        const player = this.players[section];
        if (!player) return;
        
        // 暂停其他部分的音频
        Object.keys(this.players).forEach(s => {
            if (s !== section.toString() && this.players[s].isPlaying) {
                this.pauseAudio(s);
            }
        });
        
        player.audio.play().then(() => {
            player.isPlaying = true;
            player.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
            console.error('播放失败:', error);
        });
    }
    
    pauseAudio(section) {
        const player = this.players[section];
        if (!player) return;
        
        player.audio.pause();
        player.isPlaying = false;
        player.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    updateProgress(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.progress) return;
        
        const percent = (player.audio.currentTime / player.audio.duration) * 100;
        player.progress.style.width = `${percent}%`;
    }
    
    updateTimeDisplay(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.timeDisplay) return;
        
        const currentMinutes = Math.floor(player.audio.currentTime / 60);
        const currentSeconds = Math.floor(player.audio.currentTime % 60);
        const durationMinutes = Math.floor(player.audio.duration / 60) || 0;
        const durationSeconds = Math.floor(player.audio.duration % 60) || 0;
        
        player.timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    }

    switchSection(sectionNumber) {
        // 暂停当前部分的音频
        this.players[this.currentSection].pause();
        this.playButtons[this.currentSection].textContent = '播放';
        
        // 更新当前部分
        this.currentSection = sectionNumber;
        
        // 重置新部分的进度条
        this.progressBars[this.currentSection].value = 0;
        
        // 显示当前部分的播放器，隐藏其他部分的播放器
        for (let i = 1; i <= 4; i++) {
            const playerContainer = document.getElementById(`section${i}-player-container`);
            if (i === sectionNumber) {
                playerContainer.style.display = 'block';
            } else {
                playerContainer.style.display = 'none';
            }
        }
    }
}

// 全局函数：创建音频播放器实例
function createAudioPlayer(testId = null) {
    return new AudioPlayer(testId);
}

// 页面加载完成后初始化音频播放器
document.addEventListener('DOMContentLoaded', () => {
    // 创建全局音频播放器实例
    window.audioPlayerInstance = new AudioPlayer();
    
    // 为了向后兼容，也创建一个不带参数的实例
    if (!window.audioPlayer) {
        window.audioPlayer = window.audioPlayerInstance;
    }
    
    console.log('音频播放器初始化完成，测试ID:', window.audioPlayerInstance.testId);
}); 