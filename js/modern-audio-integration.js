/**
 * 现代音频系统集成器
 * 将新的音频管理系统与现有的测试播放器无缝集成
 */

class ModernAudioIntegration {
    constructor() {
        this.isInitialized = false;
        this.originalTestPlayer = null;
        this.enhancedPlayers = new Map();
        this.loadingIndicators = new Map();
        
        // 性能监控
        this.performanceMetrics = {
            loadTimes: [],
            bufferingEvents: 0,
            qualitySwitches: 0,
            cacheHits: 0
        };
        
        console.log('🔧 ModernAudioIntegration 初始化');
    }
    
    /**
     * 初始化集成系统
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            console.log('🚀 开始初始化现代音频系统...');
            
            // 等待依赖模块加载
            await this.waitForDependencies();
            
            // 备份原始播放器
            this.backupOriginalPlayer();
            
            // 增强现有播放器
            await this.enhanceExistingPlayer();
            
            // 设置全局事件监听
            this.setupGlobalEventListeners();
            
            // 初始化性能监控
            this.initializePerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('✅ 现代音频系统初始化完成');
            
            // 触发初始化完成事件
            window.dispatchEvent(new CustomEvent('modernaudio:initialized'));
            
        } catch (error) {
            console.error('❌ 现代音频系统初始化失败:', error);
            // Fallback到原始播放器
            this.fallbackToOriginal();
        }
    }
    
    /**
     * 等待依赖模块加载
     */
    async waitForDependencies() {
        const requiredModules = [
            'modernAudioManager',
            'networkSpeedDetector',
            'progressiveAudioLoader',
            'EnhancedAudio'
        ];
        
        const maxWaitTime = 10000; // 10秒超时
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            const allLoaded = requiredModules.every(module => window[module]);
            
            if (allLoaded) {
                console.log('📦 所有依赖模块已加载');
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('依赖模块加载超时');
    }
    
    /**
     * 备份原始播放器
     */
    backupOriginalPlayer() {
        if (window.testPlayer) {
            this.originalTestPlayer = { ...window.testPlayer };
            console.log('💾 原始播放器已备份');
        }
    }
    
    /**
     * 增强现有播放器
     */
    async enhanceExistingPlayer() {
        if (!window.testPlayer) {
            console.warn('⚠️  未找到testPlayer，创建新实例');
            window.testPlayer = {};
        }
        
        // 增强loadAudio方法
        const originalLoadAudio = window.testPlayer.loadAudio || function() {};
        window.testPlayer.loadAudio = this.createEnhancedLoadAudio(originalLoadAudio);
        
        // 增强playSection方法
        const originalPlaySection = window.testPlayer.playSection || function() {};
        window.testPlayer.playSection = this.createEnhancedPlaySection(originalPlaySection);
        
        // 添加新的方法
        window.testPlayer.getAudioQuality = () => window.modernAudioManager.currentQuality;
        window.testPlayer.switchAudioQuality = (quality) => this.switchAudioQuality(quality);
        window.testPlayer.getBufferHealth = (section) => this.getBufferHealth(section);
        window.testPlayer.preloadNextSection = () => this.preloadNextSection();
        window.testPlayer.getPerformanceMetrics = () => this.getPerformanceMetrics();
        
        console.log('🔧 播放器方法已增强');
    }
    
    /**
     * 创建增强的loadAudio方法
     */
    createEnhancedLoadAudio(originalMethod) {
        return async (sectionId, audioUrl, priority = 'normal') => {
            try {
                console.log(`🎵 增强加载音频: ${sectionId} -> ${audioUrl}`);
                
                // 显示加载指示器
                this.showLoadingIndicator(sectionId);
                
                // 使用现代音频管理器加载
                const enhancedAudio = await window.modernAudioManager.loadAudio(
                    audioUrl,
                    priority,
                    (progress) => this.updateLoadingProgress(sectionId, progress)
                );
                
                // 存储增强音频对象
                this.enhancedPlayers.set(sectionId, enhancedAudio);
                
                // 设置音频事件监听
                this.setupAudioEventListeners(sectionId, enhancedAudio);
                
                // 隐藏加载指示器
                this.hideLoadingIndicator(sectionId);
                
                // 更新UI
                this.updateAudioUI(sectionId, enhancedAudio);
                
                console.log(`✅ 音频加载完成: ${sectionId}`);
                return enhancedAudio;
                
            } catch (error) {
                console.error(`❌ 音频加载失败: ${sectionId}`, error);
                this.hideLoadingIndicator(sectionId);
                
                // Fallback到原始方法
                if (originalMethod && typeof originalMethod === 'function') {
                    return originalMethod.call(window.testPlayer, sectionId, audioUrl);
                }
                
                throw error;
            }
        };
    }
    
    /**
     * 创建增强的playSection方法
     */
    createEnhancedPlaySection(originalMethod) {
        return async (sectionId) => {
            try {
                const enhancedAudio = this.enhancedPlayers.get(sectionId);
                
                if (enhancedAudio) {
                    console.log(`▶️  播放增强音频: ${sectionId}`);
                    
                    // 检查缓冲健康度
                    const bufferHealth = this.getBufferHealth(sectionId);
                    if (bufferHealth < 30) {
                        console.warn(`⚠️  缓冲健康度较低: ${bufferHealth}%`);
                        this.showBufferingIndicator(sectionId);
                    }
                    
                    // 播放音频
                    await enhancedAudio.play();
                    
                    // 更新播放状态UI
                    this.updatePlaybackUI(sectionId, 'playing');
                    
                    // 开始预加载下一部分
                    this.preloadNextSection(sectionId);
                    
                } else {
                    console.log(`📻 使用原始播放方法: ${sectionId}`);
                    if (originalMethod && typeof originalMethod === 'function') {
                        return originalMethod.call(window.testPlayer, sectionId);
                    }
                }
                
            } catch (error) {
                console.error(`❌ 播放失败: ${sectionId}`, error);
                this.updatePlaybackUI(sectionId, 'error');
                
                // Fallback
                if (originalMethod && typeof originalMethod === 'function') {
                    return originalMethod.call(window.testPlayer, sectionId);
                }
            }
        };
    }
    
    /**
     * 显示加载指示器
     */
    showLoadingIndicator(sectionId) {
        const existingIndicator = document.querySelector(`#loading-${sectionId}`);
        if (existingIndicator) return;
        
        const indicator = document.createElement('div');
        indicator.id = `loading-${sectionId}`;
        indicator.className = 'modern-audio-loading';
        indicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
            <div class="loading-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">0%</div>
            </div>
            <div class="loading-details">
                <div class="network-info">检测网络速度...</div>
                <div class="quality-info">选择最佳音质...</div>
            </div>
        `;
        
        // 添加样式
        if (!document.querySelector('#modern-audio-styles')) {
            const style = document.createElement('style');
            style.id = 'modern-audio-styles';
            style.textContent = this.getLoadingIndicatorStyles();
            document.head.appendChild(style);
        }
        
        // 找到合适的位置插入
        const playerContainer = document.querySelector(`#section-${sectionId} .player-container`) ||
                              document.querySelector(`#section-${sectionId}`) ||
                              document.querySelector('.audio-player');
        
        if (playerContainer) {
            playerContainer.appendChild(indicator);
            this.loadingIndicators.set(sectionId, indicator);
        }
    }
    
    /**
     * 更新加载进度
     */
    updateLoadingProgress(sectionId, progress) {
        const indicator = this.loadingIndicators.get(sectionId);
        if (!indicator) return;
        
        const progressFill = indicator.querySelector('.progress-fill');
        const progressText = indicator.querySelector('.progress-text');
        const networkInfo = indicator.querySelector('.network-info');
        const qualityInfo = indicator.querySelector('.quality-info');
        
        if (progressFill) {
            progressFill.style.width = `${progress.percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress.percentage)}%`;
        }
        
        if (networkInfo && window.networkSpeedDetector) {
            const networkInfo = window.networkSpeedDetector.cachedNetworkInfo;
            if (networkInfo) {
                networkInfo.textContent = `网络: ${networkInfo.effectiveType.toUpperCase()} (${networkInfo.downlink} Mbps)`;
            }
        }
        
        if (qualityInfo && window.modernAudioManager) {
            qualityInfo.textContent = `音质: ${this.getQualityLabel(window.modernAudioManager.currentQuality)}`;
        }
    }
    
    /**
     * 隐藏加载指示器
     */
    hideLoadingIndicator(sectionId) {
        const indicator = this.loadingIndicators.get(sectionId);
        if (indicator) {
            indicator.remove();
            this.loadingIndicators.delete(sectionId);
        }
    }
    
    /**
     * 设置音频事件监听
     */
    setupAudioEventListeners(sectionId, enhancedAudio) {
        // 播放状态变化
        enhancedAudio.addEventListener('play', () => {
            this.updatePlaybackUI(sectionId, 'playing');
        });
        
        enhancedAudio.addEventListener('pause', () => {
            this.updatePlaybackUI(sectionId, 'paused');
        });
        
        enhancedAudio.addEventListener('ended', () => {
            this.updatePlaybackUI(sectionId, 'ended');
            this.onAudioEnded(sectionId);
        });
        
        // 缓冲事件
        enhancedAudio.addEventListener('buffering', () => {
            this.showBufferingIndicator(sectionId);
            this.performanceMetrics.bufferingEvents++;
        });
        
        enhancedAudio.addEventListener('bufferingend', () => {
            this.hideBufferingIndicator(sectionId);
        });
        
        // 进度更新
        enhancedAudio.addEventListener('timeupdate', () => {
            this.updateTimeDisplay(sectionId, enhancedAudio);
        });
        
        // 错误处理
        enhancedAudio.addEventListener('error', (event) => {
            this.handleAudioError(sectionId, event.detail);
        });
    }
    
    /**
     * 更新音频UI
     */
    updateAudioUI(sectionId, enhancedAudio) {
        const playerContainer = document.querySelector(`#section-${sectionId} .player-container`);
        if (!playerContainer) return;
        
        // 添加现代音频控件
        const modernControls = document.createElement('div');
        modernControls.className = 'modern-audio-controls';
        modernControls.innerHTML = `
            <div class="audio-info">
                <div class="quality-indicator">
                    <span class="quality-label">${this.getQualityLabel(window.modernAudioManager.currentQuality)}</span>
                    <button class="quality-switch-btn" title="切换音质">⚙️</button>
                </div>
                <div class="buffer-indicator">
                    <div class="buffer-health">
                        <div class="buffer-bar">
                            <div class="buffer-fill" style="width: 0%"></div>
                        </div>
                        <span class="buffer-text">缓冲: 0%</span>
                    </div>
                </div>
            </div>
        `;
        
        // 添加事件监听
        const qualitySwitchBtn = modernControls.querySelector('.quality-switch-btn');
        qualitySwitchBtn.addEventListener('click', () => {
            this.showQualitySelector(sectionId);
        });
        
        playerContainer.appendChild(modernControls);
        
        // 定期更新缓冲指示器
        setInterval(() => {
            this.updateBufferIndicator(sectionId);
        }, 1000);
    }
    
    /**
     * 更新播放UI
     */
    updatePlaybackUI(sectionId, state) {
        const playerContainer = document.querySelector(`#section-${sectionId}`);
        if (!playerContainer) return;
        
        // 移除所有状态类
        playerContainer.classList.remove('playing', 'paused', 'ended', 'error', 'loading');
        
        // 添加当前状态类
        playerContainer.classList.add(state);
        
        // 更新播放按钮
        const playBtn = playerContainer.querySelector('.play-btn');
        if (playBtn) {
            switch (state) {
                case 'playing':
                    playBtn.innerHTML = '⏸️';
                    playBtn.title = '暂停';
                    break;
                case 'paused':
                case 'ended':
                    playBtn.innerHTML = '▶️';
                    playBtn.title = '播放';
                    break;
                case 'error':
                    playBtn.innerHTML = '⚠️';
                    playBtn.title = '播放错误';
                    break;
                case 'loading':
                    playBtn.innerHTML = '⏳';
                    playBtn.title = '加载中';
                    break;
            }
        }
    }
    
    /**
     * 显示缓冲指示器
     */
    showBufferingIndicator(sectionId) {
        const playerContainer = document.querySelector(`#section-${sectionId}`);
        if (!playerContainer) return;
        
        let indicator = playerContainer.querySelector('.buffering-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'buffering-indicator';
            indicator.innerHTML = '🔄 缓冲中...';
            playerContainer.appendChild(indicator);
        }
        
        indicator.style.display = 'block';
    }
    
    /**
     * 隐藏缓冲指示器
     */
    hideBufferingIndicator(sectionId) {
        const indicator = document.querySelector(`#section-${sectionId} .buffering-indicator`);
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    /**
     * 更新时间显示
     */
    updateTimeDisplay(sectionId, enhancedAudio) {
        const timeDisplay = document.querySelector(`#section-${sectionId} .time-display`);
        if (timeDisplay) {
            const current = this.formatTime(enhancedAudio.currentTime);
            const duration = this.formatTime(enhancedAudio.duration);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
        
        // 更新进度条
        const progressBar = document.querySelector(`#section-${sectionId} .progress-bar`);
        if (progressBar && enhancedAudio.duration > 0) {
            const percentage = (enhancedAudio.currentTime / enhancedAudio.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    /**
     * 更新缓冲指示器
     */
    updateBufferIndicator(sectionId) {
        const enhancedAudio = this.enhancedPlayers.get(sectionId);
        if (!enhancedAudio) return;
        
        const bufferHealth = this.getBufferHealth(sectionId);
        const bufferFill = document.querySelector(`#section-${sectionId} .buffer-fill`);
        const bufferText = document.querySelector(`#section-${sectionId} .buffer-text`);
        
        if (bufferFill) {
            bufferFill.style.width = `${bufferHealth}%`;
            bufferFill.style.backgroundColor = bufferHealth > 70 ? '#4CAF50' : 
                                              bufferHealth > 30 ? '#FF9800' : '#F44336';
        }
        
        if (bufferText) {
            bufferText.textContent = `缓冲: ${Math.round(bufferHealth)}%`;
        }
    }
    
    /**
     * 获取缓冲健康度
     */
    getBufferHealth(sectionId) {
        const enhancedAudio = this.enhancedPlayers.get(sectionId);
        return enhancedAudio ? enhancedAudio.bufferHealth : 0;
    }
    
    /**
     * 切换音频质量
     */
    async switchAudioQuality(quality) {
        console.log(`🔄 切换音质到: ${quality}`);
        
        try {
            window.modernAudioManager.currentQuality = quality;
            this.performanceMetrics.qualitySwitches++;
            
            // 重新加载当前播放的音频
            for (const [sectionId, enhancedAudio] of this.enhancedPlayers) {
                if (enhancedAudio.isPlaying) {
                    const currentTime = enhancedAudio.currentTime;
                    
                    // 加载新质量的音频
                    const newAudio = await window.modernAudioManager.loadAudio(
                        enhancedAudio.url,
                        'high'
                    );
                    
                    // 替换音频对象
                    this.enhancedPlayers.set(sectionId, newAudio);
                    
                    // 继续播放
                    newAudio.seek(currentTime);
                    await newAudio.play();
                    
                    break; // 只处理当前播放的音频
                }
            }
            
            // 更新UI显示
            this.updateQualityIndicators();
            
        } catch (error) {
            console.error('切换音质失败:', error);
        }
    }
    
    /**
     * 预加载下一部分
     */
    async preloadNextSection(currentSectionId) {
        // 简单的下一部分预测逻辑
        const sectionNumber = parseInt(currentSectionId.replace('section', ''));
        const nextSectionId = `section${sectionNumber + 1}`;
        
        // 检查下一部分是否存在
        const nextSectionElement = document.querySelector(`#${nextSectionId}`);
        if (!nextSectionElement) return;
        
        // 获取下一部分的音频URL
        const nextAudioUrl = this.getAudioUrlForSection(nextSectionId);
        if (!nextAudioUrl) return;
        
        console.log(`🔄 预加载下一部分: ${nextSectionId}`);
        
        try {
            await window.modernAudioManager.loadAudio(nextAudioUrl, 'low');
            console.log(`✅ 预加载完成: ${nextSectionId}`);
        } catch (error) {
            console.warn(`预加载失败: ${nextSectionId}`, error);
        }
    }
    
    /**
     * 获取部分对应的音频URL
     */
    getAudioUrlForSection(sectionId) {
        const sectionElement = document.querySelector(`#${sectionId}`);
        if (!sectionElement) return null;
        
        const audioElement = sectionElement.querySelector('audio');
        if (audioElement && audioElement.src) {
            return audioElement.src;
        }
        
        // 从数据属性获取
        const audioUrl = sectionElement.dataset.audioUrl;
        if (audioUrl) return audioUrl;
        
        return null;
    }
    
    /**
     * 处理音频错误
     */
    handleAudioError(sectionId, error) {
        console.error(`音频错误 ${sectionId}:`, error);
        
        // 显示错误信息
        this.showErrorMessage(sectionId, error.message);
        
        // 尝试fallback到原始播放器
        if (this.originalTestPlayer && this.originalTestPlayer.loadAudio) {
            console.log('尝试使用原始播放器...');
            const audioUrl = this.getAudioUrlForSection(sectionId);
            if (audioUrl) {
                this.originalTestPlayer.loadAudio(sectionId, audioUrl);
            }
        }
    }
    
    /**
     * 显示错误信息
     */
    showErrorMessage(sectionId, message) {
        const playerContainer = document.querySelector(`#section-${sectionId}`);
        if (!playerContainer) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'audio-error-message';
        errorDiv.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="error-text">${message}</div>
            <button class="retry-btn">重试</button>
        `;
        
        errorDiv.querySelector('.retry-btn').addEventListener('click', () => {
            errorDiv.remove();
            const audioUrl = this.getAudioUrlForSection(sectionId);
            if (audioUrl) {
                window.testPlayer.loadAudio(sectionId, audioUrl);
            }
        });
        
        playerContainer.appendChild(errorDiv);
        
        // 5秒后自动移除
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    /**
     * 格式化时间
     */
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * 获取质量标签
     */
    getQualityLabel(quality) {
        const labels = {
            high: '高清',
            standard: '标准',
            low: '省流',
            ultra_low: '超省流'
        };
        return labels[quality] || quality;
    }
    
    /**
     * 获取加载指示器样式
     */
    getLoadingIndicatorStyles() {
        return `
            .modern-audio-loading {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 15px;
            }
            
            .loading-progress {
                width: 100%;
                max-width: 300px;
                margin-bottom: 15px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #f0f0f0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #45a049);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                text-align: center;
                font-size: 14px;
                color: #666;
            }
            
            .loading-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 12px;
                color: #888;
                text-align: center;
            }
            
            .modern-audio-controls {
                margin-top: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #e9ecef;
            }
            
            .audio-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            
            .quality-indicator {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .quality-label {
                font-size: 12px;
                background: #4CAF50;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
            }
            
            .quality-switch-btn {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            }
            
            .buffer-health {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .buffer-bar {
                width: 60px;
                height: 4px;
                background: #e0e0e0;
                border-radius: 2px;
                overflow: hidden;
            }
            
            .buffer-fill {
                height: 100%;
                transition: width 0.3s ease, background-color 0.3s ease;
            }
            
            .buffer-text {
                font-size: 11px;
                color: #666;
            }
            
            .buffering-indicator {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 100;
            }
            
            .audio-error-message {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 10px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 200;
            }
            
            .error-icon {
                font-size: 18px;
            }
            
            .error-text {
                flex: 1;
                font-size: 14px;
                color: #856404;
            }
            
            .retry-btn {
                background: #ffc107;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            }
        `;
    }
    
    /**
     * 设置全局事件监听
     */
    setupGlobalEventListeners() {
        // 网络状态变化监听
        window.addEventListener('online', () => {
            console.log('🌐 网络已连接，恢复音频服务');
            this.resumeAudioServices();
        });
        
        window.addEventListener('offline', () => {
            console.log('🌐 网络已断开，暂停音频加载');
            this.pauseAudioServices();
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAudioServices();
            } else {
                this.resumeAudioServices();
            }
        });
    }
    
    /**
     * 初始化性能监控
     */
    initializePerformanceMonitoring() {
        // 定期收集性能数据
        setInterval(() => {
            this.collectPerformanceMetrics();
        }, 30000); // 30秒
        
        // 页面卸载时发送性能数据
        window.addEventListener('beforeunload', () => {
            this.sendPerformanceMetrics();
        });
    }
    
    /**
     * 收集性能指标
     */
    collectPerformanceMetrics() {
        if (window.modernAudioManager) {
            const report = window.modernAudioManager.getPerformanceReport();
            this.performanceMetrics.loadTimes.push(parseFloat(report.totalLoadTime));
            this.performanceMetrics.cacheHits = parseFloat(report.cacheHitRate);
        }
    }
    
    /**
     * 获取性能指标
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            averageLoadTime: this.performanceMetrics.loadTimes.length > 0 ?
                this.performanceMetrics.loadTimes.reduce((a, b) => a + b) / this.performanceMetrics.loadTimes.length : 0,
            modernAudioManager: window.modernAudioManager ? 
                window.modernAudioManager.getPerformanceReport() : null
        };
    }
    
    /**
     * Fallback到原始播放器
     */
    fallbackToOriginal() {
        console.log('🔄 Fallback to original player');
        
        if (this.originalTestPlayer) {
            Object.assign(window.testPlayer, this.originalTestPlayer);
        }
        
        // 显示降级通知
        this.showFallbackNotification();
    }
    
    /**
     * 显示降级通知
     */
    showFallbackNotification() {
        const notification = document.createElement('div');
        notification.className = 'fallback-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>⚠️ 现代音频功能不可用，已切换到基础模式</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 10px;
            z-index: 9999;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // 5秒后自动移除
        setTimeout(() => notification.remove(), 5000);
    }
    
    /**
     * 恢复音频服务
     */
    resumeAudioServices() {
        // 恢复所有暂停的下载
        if (window.modernAudioManager) {
            console.log('🔄 恢复音频服务');
        }
    }
    
    /**
     * 暂停音频服务
     */
    pauseAudioServices() {
        // 暂停非必要的下载
        if (window.modernAudioManager) {
            console.log('⏸️ 暂停非必要音频服务');
        }
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', async () => {
    window.modernAudioIntegration = new ModernAudioIntegration();
    
    try {
        await window.modernAudioIntegration.initialize();
    } catch (error) {
        console.warn('现代音频系统初始化失败，使用基础模式:', error);
    }
});

// 全局导出
window.ModernAudioIntegration = ModernAudioIntegration;