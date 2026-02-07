/**
 * Mobile Audio Optimizer
 * 根据网络状态、电池状态和设备性能动态优化音频质量
 * 提供移动端特有的音频体验优化
 */

class MobileAudioOptimizer {
    constructor() {
        this.deviceInfo = this.detectDeviceInfo();
        this.networkInfo = this.getNetworkInfo();
        this.batteryInfo = null;
        this.performanceProfile = 'auto';
        this.audioQuality = 'high';
        
        this.qualityProfiles = {
            low: {
                bitrate: 64,
                sampleRate: 22050,
                bufferSize: 4096,
                preloadStrategy: 'metadata'
            },
            medium: {
                bitrate: 128,
                sampleRate: 44100,
                bufferSize: 8192,
                preloadStrategy: 'auto'
            },
            high: {
                bitrate: 192,
                sampleRate: 44100,
                bufferSize: 16384,
                preloadStrategy: 'auto'
            }
        };
        
        this.init();
    }
    
    async init() {
        await this.detectBatteryInfo();
        this.setupNetworkMonitoring();
        this.setupBatteryMonitoring();
        this.optimizeInitialQuality();
        this.setupPerformanceMonitoring();
        
        console.log('MobileAudioOptimizer 初始化完成', {
            device: this.deviceInfo,
            network: this.networkInfo,
            battery: this.batteryInfo,
            quality: this.audioQuality
        });
    }
    
    detectDeviceInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        return {
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isIOS: /iPad|iPhone|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent),
            isLowEnd: this.isLowEndDevice(),
            screenSize: {
                width: window.screen.width,
                height: window.screen.height,
                density: window.devicePixelRatio || 1
            },
            memory: navigator.deviceMemory || 4,
            cores: navigator.hardwareConcurrency || 4
        };
    }
    
    isLowEndDevice() {
        // 基于设备内存和CPU核心数判断是否为低端设备
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        
        return memory <= 2 || cores <= 2;
    }
    
    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return {
                effectiveType: '4g',
                downlink: 10,
                rtt: 100,
                saveData: false
            };
        }
        
        return {
            effectiveType: connection.effectiveType || '4g',
            downlink: connection.downlink || 10,
            rtt: connection.rtt || 100,
            saveData: connection.saveData || false
        };
    }
    
    async detectBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                this.batteryInfo = await navigator.getBattery();
            } catch (error) {
                console.warn('无法获取电池信息:', error);
                this.batteryInfo = {
                    level: 1,
                    charging: true,
                    dischargingTime: Infinity,
                    chargingTime: 0
                };
            }
        } else {
            this.batteryInfo = {
                level: 1,
                charging: true,
                dischargingTime: Infinity,
                chargingTime: 0
            };
        }
    }
    
    setupNetworkMonitoring() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            connection.addEventListener('change', () => {
                this.networkInfo = this.getNetworkInfo();
                this.adjustQualityByNetwork();
                this.notifyQualityChange('network');
            });
        }
    }
    
    setupBatteryMonitoring() {
        if (this.batteryInfo && this.batteryInfo.addEventListener) {
            this.batteryInfo.addEventListener('levelchange', () => {
                this.adjustQualityByBattery();
                this.notifyQualityChange('battery');
            });
            
            this.batteryInfo.addEventListener('chargingchange', () => {
                this.adjustQualityByBattery();
                this.notifyQualityChange('battery');
            });
        }
    }
    
    setupPerformanceMonitoring() {
        // 监控页面性能指标
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'navigation') {
                            this.adjustQualityByPerformance(entry);
                        }
                    });
                });
                
                observer.observe({type: 'navigation', buffered: true});
            } catch (error) {
                console.warn('性能监控设置失败:', error);
            }
        }
    }
    
    optimizeInitialQuality() {
        let quality = 'high';
        
        // 基于设备能力调整
        if (this.deviceInfo.isLowEnd) {
            quality = 'low';
        }
        
        // 基于网络状况调整
        if (this.networkInfo.saveData || this.networkInfo.effectiveType === 'slow-2g' || this.networkInfo.effectiveType === '2g') {
            quality = 'low';
        } else if (this.networkInfo.effectiveType === '3g' || this.networkInfo.downlink < 1.5) {
            quality = 'medium';
        }
        
        // 基于电池状况调整
        if (this.batteryInfo && this.batteryInfo.level < 0.2 && !this.batteryInfo.charging) {
            quality = 'low';
        } else if (this.batteryInfo && this.batteryInfo.level < 0.5 && !this.batteryInfo.charging) {
            quality = Math.min(quality, 'medium');
        }
        
        this.setAudioQuality(quality);
    }
    
    adjustQualityByNetwork() {
        const { effectiveType, downlink, saveData } = this.networkInfo;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
            this.setAudioQuality('low');
        } else if (effectiveType === '3g' || downlink < 1.5) {
            this.setAudioQuality('medium');
        } else if (effectiveType === '4g' && downlink > 5) {
            this.setAudioQuality('high');
        }
    }
    
    adjustQualityByBattery() {
        if (!this.batteryInfo) return;
        
        const { level, charging } = this.batteryInfo;
        
        if (level < 0.15 && !charging) {
            this.setAudioQuality('low');
            this.enablePowerSavingMode();
        } else if (level < 0.3 && !charging) {
            this.setAudioQuality('medium');
        } else if (charging || level > 0.7) {
            // 充电或电量充足时可以使用高质量
            this.adjustQualityByNetwork();
        }
    }
    
    adjustQualityByPerformance(perfEntry) {
        const loadTime = perfEntry.loadEventEnd - perfEntry.navigationStart;
        
        if (loadTime > 5000) {
            // 页面加载超过5秒，降低音频质量
            this.setAudioQuality('low');
        } else if (loadTime > 3000) {
            this.setAudioQuality('medium');
        }
    }
    
    setAudioQuality(quality) {
        if (this.audioQuality === quality) return;
        
        this.audioQuality = quality;
        this.applyQualitySettings();
    }
    
    applyQualitySettings() {
        const profile = this.qualityProfiles[this.audioQuality];
        
        // 应用到所有音频元素
        document.querySelectorAll('audio').forEach(audio => {
            audio.preload = profile.preloadStrategy;
            
            // 如果支持，设置音频质量提示
            if (audio.canPlayType) {
                this.optimizeAudioElement(audio, profile);
            }
        });
        
        console.log(`音频质量已调整为: ${this.audioQuality}`, profile);
    }
    
    optimizeAudioElement(audioElement, profile) {
        // 设置缓冲区大小
        try {
            if (audioElement.audioContext) {
                audioElement.audioContext.createBuffer(2, profile.bufferSize, profile.sampleRate);
            }
        } catch (error) {
            console.warn('音频缓冲区设置失败:', error);
        }
        
        // 移动端特定优化
        if (this.deviceInfo.isMobile) {
            // 禁用自动播放
            audioElement.autoplay = false;
            
            // 优化加载策略
            if (this.audioQuality === 'low') {
                audioElement.preload = 'none';
            }
        }
    }
    
    enablePowerSavingMode() {
        console.log('启用省电模式');
        
        // 降低视觉效果
        document.body.classList.add('power-saving-mode');
        
        // 减少定时器使用
        this.reducedUpdateInterval = true;
        
        // 暂停非必要的后台处理
        this.pauseNonEssentialFeatures();
        
        this.dispatchEvent('powerSavingEnabled');
    }
    
    disablePowerSavingMode() {
        console.log('关闭省电模式');
        
        document.body.classList.remove('power-saving-mode');
        this.reducedUpdateInterval = false;
        this.resumeNonEssentialFeatures();
        
        this.dispatchEvent('powerSavingDisabled');
    }
    
    pauseNonEssentialFeatures() {
        // 暂停动画
        document.querySelectorAll('[data-animation]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        
        // 减少Service Worker同步频率
        if (window.swManager) {
            window.swManager.reduceSyncFrequency();
        }
    }
    
    resumeNonEssentialFeatures() {
        // 恢复动画
        document.querySelectorAll('[data-animation]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
        
        // 恢复Service Worker同步频率
        if (window.swManager) {
            window.swManager.normalSyncFrequency();
        }
    }
    
    getOptimalBufferSize() {
        const profile = this.qualityProfiles[this.audioQuality];
        
        if (this.deviceInfo.isLowEnd) {
            return Math.min(profile.bufferSize, 4096);
        }
        
        return profile.bufferSize;
    }
    
    shouldPreloadAudio() {
        if (this.networkInfo.saveData) return false;
        if (this.batteryInfo && this.batteryInfo.level < 0.2 && !this.batteryInfo.charging) return false;
        if (this.audioQuality === 'low') return false;
        
        return true;
    }
    
    getRecommendedChunkSize() {
        const baseSize = 256 * 1024; // 256KB
        
        if (this.audioQuality === 'low') {
            return baseSize / 2; // 128KB
        } else if (this.audioQuality === 'high' && this.networkInfo.downlink > 5) {
            return baseSize * 2; // 512KB
        }
        
        return baseSize;
    }
    
    notifyQualityChange(reason) {
        this.dispatchEvent('qualityChanged', {
            quality: this.audioQuality,
            reason: reason,
            profile: this.qualityProfiles[this.audioQuality]
        });
    }
    
    dispatchEvent(eventType, data = {}) {
        const event = new CustomEvent(`mobileAudioOptimizer:${eventType}`, {
            detail: {
                ...data,
                optimizer: this
            }
        });
        
        window.dispatchEvent(event);
    }
    
    // 公共API方法
    getCurrentQuality() {
        return {
            level: this.audioQuality,
            profile: this.qualityProfiles[this.audioQuality],
            deviceInfo: this.deviceInfo,
            networkInfo: this.networkInfo,
            batteryInfo: this.batteryInfo
        };
    }
    
    forceQuality(quality) {
        if (this.qualityProfiles[quality]) {
            this.setAudioQuality(quality);
            this.performanceProfile = 'manual';
        }
    }
    
    resetToAuto() {
        this.performanceProfile = 'auto';
        this.optimizeInitialQuality();
    }
    
    getDeviceCapabilities() {
        return {
            canPlayHQ: !this.deviceInfo.isLowEnd && this.networkInfo.downlink > 2,
            recommendedQuality: this.audioQuality,
            supportedFormats: this.getSupportedAudioFormats(),
            optimalChunkSize: this.getRecommendedChunkSize()
        };
    }
    
    getSupportedAudioFormats() {
        const audio = document.createElement('audio');
        const formats = {
            mp3: audio.canPlayType('audio/mpeg'),
            m4a: audio.canPlayType('audio/mp4'),
            ogg: audio.canPlayType('audio/ogg'),
            wav: audio.canPlayType('audio/wav')
        };
        
        return Object.keys(formats).filter(format => formats[format] !== '');
    }
}

// 全局实例
window.mobileAudioOptimizer = new MobileAudioOptimizer();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileAudioOptimizer;
}