// 音频播放器控制类
class AudioPlayer {
    constructor() {
        this.currentSection = 1;
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
        
        // 初始化各部分的音频播放器
        this.initPlayer(1);
        this.initPlayer(2);
        this.initPlayer(3);
        this.initPlayer(4);
        
        this.bindSectionTabs();
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

// 页面加载完成后初始化音频播放器
document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
}); 