/**
 * Mobile Gesture Audio Controller
 * 为音频播放器提供手势控制功能
 * 支持滑动、双击、长按等移动端专用手势
 */

class MobileGestureAudio {
    constructor() {
        this.currentPlayer = null;
        this.gestureConfig = {
            swipeLeft: 'nextSection',
            swipeRight: 'prevSection', 
            swipeUp: 'increaseVolume',
            swipeDown: 'decreaseVolume',
            doubleTap: 'playPause',
            longPress: 'showSpeedMenu',
            pinch: 'adjustSpeed'
        };
        
        this.volumeStep = 0.1;
        this.seekStep = 10; // 秒
        this.speedStep = 0.25;
        this.gestureEnabled = true;
        
        this.init();
    }
    
    init() {
        this.setupAudioGestureBindings();
        this.setupProgressBarGestures();
        this.setupVolumeGestures();
        this.setupSpeedControlGestures();
        this.setupSectionNavigationGestures();
        
        console.log('Mobile Gesture Audio Controller 初始化完成');
    }
    
    setupAudioGestureBindings() {
        // 绑定全局手势事件
        window.addEventListener('mobileGesture:swipeLeft', this.handleSwipeLeft.bind(this));
        window.addEventListener('mobileGesture:swipeRight', this.handleSwipeRight.bind(this));
        window.addEventListener('mobileGesture:swipeUp', this.handleSwipeUp.bind(this));
        window.addEventListener('mobileGesture:swipeDown', this.handleSwipeDown.bind(this));
        window.addEventListener('mobileGesture:doubleTap', this.handleDoubleTap.bind(this));
        window.addEventListener('mobileGesture:longPress', this.handleLongPress.bind(this));
        window.addEventListener('mobileGesture:pinch', this.handlePinch.bind(this));
        
        // 监听音频播放器变化
        this.observePlayerChanges();
    }
    
    observePlayerChanges() {
        // 监听当前活跃的音频播放器
        document.addEventListener('click', (e) => {
            const playBtn = e.target.closest('.play-btn');
            if (playBtn) {
                const playerId = playBtn.id.replace('-play', '-player');
                this.currentPlayer = document.getElementById(playerId);
                this.updateGestureContext();
            }
        });
        
        // 监听部分切换
        document.addEventListener('click', (e) => {
            const sectionTab = e.target.closest('.section-tab');
            if (sectionTab) {
                const sectionNum = sectionTab.dataset.section;
                this.currentPlayer = document.getElementById(`section${sectionNum}-player`);
                this.updateGestureContext();
            }
        });
    }
    
    updateGestureContext() {
        if (this.currentPlayer) {
            console.log('当前音频播放器:', this.currentPlayer.id);
            
            // 为当前播放器容器添加手势识别
            const playerContainer = this.currentPlayer.closest('.audio-player');
            if (playerContainer) {
                playerContainer.classList.add('gesture-active');
                this.setupPlayerSpecificGestures(playerContainer);
            }
        }
    }
    
    setupPlayerSpecificGestures(playerContainer) {
        // 移除之前的手势监听器
        playerContainer.querySelectorAll('.gesture-zone').forEach(zone => {
            zone.remove();
        });
        
        // 创建手势识别区域
        const gestureZone = document.createElement('div');
        gestureZone.className = 'gesture-zone';
        gestureZone.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            pointer-events: none;
        `;
        
        playerContainer.style.position = 'relative';
        playerContainer.appendChild(gestureZone);
        
        // 设置播放器特定的手势区域
        this.createGestureAreas(playerContainer);
    }
    
    createGestureAreas(playerContainer) {
        const areas = [
            { name: 'seek-backward', left: '0%', width: '25%', action: 'seekBackward' },
            { name: 'play-pause', left: '25%', width: '50%', action: 'playPause' },
            { name: 'seek-forward', left: '75%', width: '25%', action: 'seekForward' }
        ];
        
        areas.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = `gesture-area gesture-${area.name}`;
            areaElement.style.cssText = `
                position: absolute;
                top: 0;
                left: ${area.left};
                width: ${area.width};
                height: 100%;
                pointer-events: auto;
                background: transparent;
                z-index: 11;
            `;
            
            areaElement.setAttribute('data-action', area.action);
            playerContainer.appendChild(areaElement);
            
            // 添加视觉提示
            this.addGestureHints(areaElement, area.name);
        });
    }
    
    addGestureHints(areaElement, areaName) {
        let hintText = '';
        let hintIcon = '';
        
        switch (areaName) {
            case 'seek-backward':
                hintText = '双击后退10秒';
                hintIcon = '⏪';
                break;
            case 'play-pause':
                hintText = '双击播放/暂停';
                hintIcon = '⏯️';
                break;
            case 'seek-forward':
                hintText = '双击前进10秒';
                hintIcon = '⏩';
                break;
        }
        
        const hint = document.createElement('div');
        hint.className = 'gesture-hint';
        hint.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
            z-index: 12;
        `;
        hint.innerHTML = `${hintIcon} ${hintText}`;
        
        areaElement.appendChild(hint);
        
        // 显示提示的逻辑
        let hintTimer = null;
        areaElement.addEventListener('touchstart', () => {
            hint.style.opacity = '1';
            if (hintTimer) clearTimeout(hintTimer);
        });
        
        areaElement.addEventListener('touchend', () => {
            hintTimer = setTimeout(() => {
                hint.style.opacity = '0';
            }, 1000);
        });
    }
    
    setupProgressBarGestures() {
        document.querySelectorAll('.progress').forEach(progressBar => {
            this.addProgressBarTouchSupport(progressBar);
        });
    }
    
    addProgressBarTouchSupport(progressBar) {
        let isDragging = false;
        let wasPlaying = false;
        
        // 获取对应的音频元素
        const playerId = progressBar.id.replace('-progress', '-player');
        const audioElement = document.getElementById(playerId);
        
        if (!audioElement) return;
        
        progressBar.addEventListener('touchstart', (e) => {
            isDragging = true;
            wasPlaying = !audioElement.paused;
            
            // 暂停播放以便拖拽
            if (wasPlaying) {
                audioElement.pause();
            }
            
            this.updateProgressFromTouch(e, progressBar, audioElement);
            e.preventDefault();
        });
        
        progressBar.addEventListener('touchmove', (e) => {
            if (isDragging) {
                this.updateProgressFromTouch(e, progressBar, audioElement);
                e.preventDefault();
            }
        });
        
        progressBar.addEventListener('touchend', (e) => {
            if (isDragging) {
                isDragging = false;
                
                // 恢复播放状态
                if (wasPlaying) {
                    audioElement.play().catch(err => {
                        console.warn('恢复播放失败:', err);
                    });
                }
                
                // 添加触觉反馈
                if (window.mobileTouchControls) {
                    window.mobileTouchControls.vibrate([50]);
                }
            }
        });
    }
    
    updateProgressFromTouch(e, progressBar, audioElement) {
        const touch = e.touches[0];
        const rect = progressBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        
        const newTime = percentage * audioElement.duration;
        if (!isNaN(newTime)) {
            audioElement.currentTime = newTime;
            progressBar.value = percentage * 100;
            
            // 更新时间显示
            const timeDisplay = document.getElementById(progressBar.id.replace('-progress', '-time'));
            if (timeDisplay) {
                const current = this.formatTime(newTime);
                const total = this.formatTime(audioElement.duration);
                timeDisplay.textContent = `${current} / ${total}`;
            }
        }
    }
    
    setupVolumeGestures() {
        // 监听音量手势（上下滑动）
        document.addEventListener('mobileGesture:swipeUp', this.handleVolumeUp.bind(this));
        document.addEventListener('mobileGesture:swipeDown', this.handleVolumeDown.bind(this));
    }
    
    handleVolumeUp(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        if (this.currentPlayer) {
            const newVolume = Math.min(1, this.currentPlayer.volume + this.volumeStep);
            this.currentPlayer.volume = newVolume;
            this.showVolumeIndicator(newVolume);
            
            // 触觉反馈
            if (window.mobileTouchControls) {
                window.mobileTouchControls.vibrate([30]);
            }
        }
    }
    
    handleVolumeDown(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        if (this.currentPlayer) {
            const newVolume = Math.max(0, this.currentPlayer.volume - this.volumeStep);
            this.currentPlayer.volume = newVolume;
            this.showVolumeIndicator(newVolume);
            
            // 触觉反馈
            if (window.mobileTouchControls) {
                window.mobileTouchControls.vibrate([30]);
            }
        }
    }
    
    showVolumeIndicator(volume) {
        let indicator = document.getElementById('volume-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'volume-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                text-align: center;
                min-width: 120px;
            `;
            document.body.appendChild(indicator);
        }
        
        const percentage = Math.round(volume * 100);
        indicator.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 8px;">🔊</div>
            <div>音量: ${percentage}%</div>
            <div style="margin-top: 8px;">
                <div style="width: 100px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: #2196F3; transition: width 0.2s ease;"></div>
                </div>
            </div>
        `;
        
        indicator.style.opacity = '1';
        
        // 自动隐藏
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 1500);
    }
    
    setupSpeedControlGestures() {
        document.addEventListener('mobileGesture:pinch', this.handleSpeedPinch.bind(this));
    }
    
    handleSpeedPinch(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        if (this.currentPlayer && e.detail.scale !== 1) {
            let newSpeed = this.currentPlayer.playbackRate;
            
            if (e.detail.scale > 1.1) {
                // 放大手势 - 加速
                newSpeed = Math.min(2, newSpeed + this.speedStep);
            } else if (e.detail.scale < 0.9) {
                // 缩小手势 - 减速
                newSpeed = Math.max(0.5, newSpeed - this.speedStep);
            }
            
            this.currentPlayer.playbackRate = newSpeed;
            this.updateSpeedSelector(newSpeed);
            this.showSpeedIndicator(newSpeed);
            
            // 触觉反馈
            if (window.mobileTouchControls) {
                window.mobileTouchControls.vibrate([50, 50]);
            }
        }
    }
    
    updateSpeedSelector(speed) {
        const playerId = this.currentPlayer.id;
        const speedSelector = document.getElementById(playerId.replace('-player', '-speed'));
        
        if (speedSelector) {
            speedSelector.value = speed.toString();
        }
    }
    
    showSpeedIndicator(speed) {
        let indicator = document.getElementById('speed-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'speed-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                text-align: center;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.innerHTML = `
            <div style="font-size: 20px; margin-bottom: 5px;">⚡</div>
            <div>播放速度</div>
            <div style="font-size: 18px; font-weight: bold;">${speed}x</div>
        `;
        
        indicator.style.opacity = '1';
        
        // 自动隐藏
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 1500);
    }
    
    setupSectionNavigationGestures() {
        // 左右滑动切换章节
        document.addEventListener('mobileGesture:swipeLeft', this.handleSwipeLeft.bind(this));
        document.addEventListener('mobileGesture:swipeRight', this.handleSwipeRight.bind(this));
    }
    
    handleSwipeLeft(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        // 滑动到下一个section
        this.navigateToNextSection();
    }
    
    handleSwipeRight(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        // 滑动到上一个section
        this.navigateToPrevSection();
    }
    
    navigateToNextSection() {
        const currentSection = document.querySelector('.section-tab.active');
        if (currentSection) {
            const currentNum = parseInt(currentSection.dataset.section);
            const nextSection = document.querySelector(`[data-section="${currentNum + 1}"]`);
            
            if (nextSection) {
                nextSection.click();
                this.showSectionChangeIndicator('下一部分', currentNum + 1);
                
                // 触觉反馈
                if (window.mobileTouchControls) {
                    window.mobileTouchControls.vibrate([100, 50, 100]);
                }
            }
        }
    }
    
    navigateToPrevSection() {
        const currentSection = document.querySelector('.section-tab.active');
        if (currentSection) {
            const currentNum = parseInt(currentSection.dataset.section);
            const prevSection = document.querySelector(`[data-section="${currentNum - 1}"]`);
            
            if (prevSection) {
                prevSection.click();
                this.showSectionChangeIndicator('上一部分', currentNum - 1);
                
                // 触觉反馈
                if (window.mobileTouchControls) {
                    window.mobileTouchControls.vibrate([100, 50, 100]);
                }
            }
        }
    }
    
    showSectionChangeIndicator(direction, sectionNum) {
        let indicator = document.getElementById('section-change-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'section-change-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(33, 150, 243, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                z-index: 10000;
                transition: all 0.3s ease;
                text-align: center;
                font-weight: 500;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = `${direction} - Section ${sectionNum}`;
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateX(-50%) translateY(0)';
        
        // 自动隐藏
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateX(-50%) translateY(-20px)';
        }, 2000);
    }
    
    handleDoubleTap(e) {
        const gestureArea = e.detail.target.closest('.gesture-area');
        if (gestureArea) {
            const action = gestureArea.dataset.action;
            this.executeGestureAction(action, e.detail);
            return;
        }
        
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        // 默认双击播放/暂停
        this.togglePlayPause();
    }
    
    handleLongPress(e) {
        if (!this.isAudioGestureTarget(e.detail.target)) return;
        
        this.showSpeedControlMenu(e.detail);
    }
    
    executeGestureAction(action, gestureData) {
        switch (action) {
            case 'playPause':
                this.togglePlayPause();
                break;
            case 'seekBackward':
                this.seekAudio(-this.seekStep);
                break;
            case 'seekForward':
                this.seekAudio(this.seekStep);
                break;
        }
    }
    
    togglePlayPause() {
        if (this.currentPlayer) {
            if (this.currentPlayer.paused) {
                this.currentPlayer.play().catch(err => {
                    console.warn('播放失败:', err);
                });
                this.showPlaybackIndicator('播放');
            } else {
                this.currentPlayer.pause();
                this.showPlaybackIndicator('暂停');
            }
            
            // 触觉反馈
            if (window.mobileTouchControls) {
                window.mobileTouchControls.vibrate([80]);
            }
        }
    }
    
    seekAudio(seconds) {
        if (this.currentPlayer) {
            const newTime = Math.max(0, Math.min(
                this.currentPlayer.duration,
                this.currentPlayer.currentTime + seconds
            ));
            
            this.currentPlayer.currentTime = newTime;
            this.showSeekIndicator(seconds);
            
            // 触觉反馈
            if (window.mobileTouchControls) {
                window.mobileTouchControls.vibrate([60]);
            }
        }
    }
    
    showPlaybackIndicator(action) {
        this.showTemporaryIndicator(`${action === '播放' ? '▶️' : '⏸️'} ${action}`, 1000);
    }
    
    showSeekIndicator(seconds) {
        const direction = seconds > 0 ? '前进' : '后退';
        const icon = seconds > 0 ? '⏩' : '⏪';
        this.showTemporaryIndicator(`${icon} ${direction} ${Math.abs(seconds)}秒`, 1000);
    }
    
    showSpeedControlMenu(gestureData) {
        // 创建速度控制菜单
        let menu = document.getElementById('speed-control-menu');
        
        if (menu) {
            menu.remove();
        }
        
        menu = document.createElement('div');
        menu.id = 'speed-control-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${gestureData.y}px;
            left: ${gestureData.x}px;
            transform: translate(-50%, -100%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 10001;
            padding: 12px;
            min-width: 200px;
        `;
        
        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        const currentSpeed = this.currentPlayer ? this.currentPlayer.playbackRate : 1.0;
        
        speeds.forEach(speed => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                width: 100%;
                padding: 12px;
                margin: 2px 0;
                border: none;
                border-radius: 8px;
                background: ${speed === currentSpeed ? '#2196F3' : '#f5f5f5'};
                color: ${speed === currentSpeed ? 'white' : '#333'};
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            btn.textContent = `${speed}x`;
            
            btn.addEventListener('click', () => {
                if (this.currentPlayer) {
                    this.currentPlayer.playbackRate = speed;
                    this.updateSpeedSelector(speed);
                }
                menu.remove();
            });
            
            menu.appendChild(btn);
        });
        
        document.body.appendChild(menu);
        
        // 点击外部关闭菜单
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
        
        // 自动关闭
        setTimeout(() => {
            if (menu.parentNode) {
                menu.remove();
            }
        }, 5000);
    }
    
    showTemporaryIndicator(text, duration = 1500) {
        let indicator = document.getElementById('temporary-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'temporary-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                text-align: center;
                font-size: 16px;
                font-weight: 500;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = text;
        indicator.style.opacity = '1';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, duration);
    }
    
    isAudioGestureTarget(target) {
        // 检查手势是否在音频控件区域内
        return target.closest('.audio-player') || 
               target.closest('.custom-player') || 
               target.closest('.audio-players-container');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 公共API方法
    enableGestures() {
        this.gestureEnabled = true;
    }
    
    disableGestures() {
        this.gestureEnabled = false;
    }
    
    setGestureConfig(config) {
        this.gestureConfig = { ...this.gestureConfig, ...config };
    }
    
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    
    setCurrentPlayer(playerId) {
        this.currentPlayer = document.getElementById(playerId);
        this.updateGestureContext();
    }
}

// 全局实例
window.mobileGestureAudio = new MobileGestureAudio();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileGestureAudio;
}