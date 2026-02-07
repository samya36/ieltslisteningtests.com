/**
 * Battery Performance Manager
 * 根据电池状态和设备性能动态调整功能
 * 实现智能的电池感知功能降级
 */

class BatteryPerformanceManager {
    constructor() {
        this.batteryInfo = null;
        this.performanceLevel = 'high';
        this.featureState = {
            animations: true,
            visualEffects: true,
            backgroundSync: true,
            autoPreload: true,
            highQualityAudio: true,
            vibration: true,
            notifications: true
        };
        
        this.thresholds = {
            critical: 0.15,    // 15% - 关键电量
            low: 0.30,         // 30% - 低电量
            medium: 0.50,      // 50% - 中等电量
            high: 0.80         // 80% - 充足电量
        };
        
        this.performanceProfiles = {
            minimal: {
                animations: false,
                visualEffects: false,
                backgroundSync: false,
                autoPreload: false,
                highQualityAudio: false,
                vibration: false,
                notifications: false,
                updateInterval: 5000,
                maxConcurrentRequests: 1
            },
            low: {
                animations: false,
                visualEffects: false,
                backgroundSync: true,
                autoPreload: false,
                highQualityAudio: false,
                vibration: false,
                notifications: true,
                updateInterval: 3000,
                maxConcurrentRequests: 2
            },
            medium: {
                animations: true,
                visualEffects: false,
                backgroundSync: true,
                autoPreload: true,
                highQualityAudio: false,
                vibration: true,
                notifications: true,
                updateInterval: 1000,
                maxConcurrentRequests: 3
            },
            high: {
                animations: true,
                visualEffects: true,
                backgroundSync: true,
                autoPreload: true,
                highQualityAudio: true,
                vibration: true,
                notifications: true,
                updateInterval: 500,
                maxConcurrentRequests: 5
            }
        };
        
        this.init();
    }
    
    async init() {
        await this.initBatteryAPI();
        this.detectInitialPerformanceLevel();
        this.setupBatteryMonitoring();
        this.setupPerformanceMonitoring();
        this.setupPowerSavingTriggers();
        this.applyPerformanceProfile();
        
        console.log('Battery Performance Manager 初始化完成', {
            batteryLevel: this.batteryInfo?.level,
            performanceLevel: this.performanceLevel,
            charging: this.batteryInfo?.charging
        });
    }
    
    async initBatteryAPI() {
        try {
            if ('getBattery' in navigator) {
                this.batteryInfo = await navigator.getBattery();
                console.log('电池API可用', {
                    level: this.batteryInfo.level,
                    charging: this.batteryInfo.charging,
                    chargingTime: this.batteryInfo.chargingTime,
                    dischargingTime: this.batteryInfo.dischargingTime
                });
            } else {
                console.warn('电池API不可用，使用默认配置');
                this.batteryInfo = {
                    level: 1.0,
                    charging: true,
                    chargingTime: 0,
                    dischargingTime: Infinity
                };
            }
        } catch (error) {
            console.error('初始化电池API失败:', error);
            this.batteryInfo = {
                level: 1.0,
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity
            };
        }
    }
    
    detectInitialPerformanceLevel() {
        if (!this.batteryInfo) {
            this.performanceLevel = 'high';
            return;
        }
        
        const { level, charging } = this.batteryInfo;
        
        if (level <= this.thresholds.critical && !charging) {
            this.performanceLevel = 'minimal';
        } else if (level <= this.thresholds.low && !charging) {
            this.performanceLevel = 'low';
        } else if (level <= this.thresholds.medium || !charging) {
            this.performanceLevel = 'medium';
        } else {
            this.performanceLevel = 'high';
        }
        
        console.log(`初始性能等级: ${this.performanceLevel} (电量: ${Math.round(level * 100)}%, 充电: ${charging})`);
    }
    
    setupBatteryMonitoring() {
        if (!this.batteryInfo || !this.batteryInfo.addEventListener) return;
        
        // 监听电量变化
        this.batteryInfo.addEventListener('levelchange', () => {
            this.handleBatteryLevelChange();
        });
        
        // 监听充电状态变化
        this.batteryInfo.addEventListener('chargingchange', () => {
            this.handleChargingStateChange();
        });
        
        // 监听充电时间变化
        this.batteryInfo.addEventListener('chargingtimechange', () => {
            this.handleChargingTimeChange();
        });
        
        // 监听放电时间变化
        this.batteryInfo.addEventListener('dischargingtimechange', () => {
            this.handleDischargingTimeChange();
        });
    }
    
    setupPerformanceMonitoring() {
        // 监听页面性能
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    this.analyzePerformanceMetrics(entries);
                });
                
                observer.observe({type: 'measure', buffered: true});
                observer.observe({type: 'navigation', buffered: true});
            } catch (error) {
                console.warn('性能监控设置失败:', error);
            }
        }
        
        // 监听内存使用情况
        this.monitorMemoryUsage();
        
        // 监听设备温度（如果可用）
        this.monitorDeviceTemperature();
    }
    
    setupPowerSavingTriggers() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
        
        // 监听设备方向变化
        window.addEventListener('orientationchange', () => {
            // 方向变化时暂时降低性能以节省电量
            this.temporarilyReducePerformance(2000);
        });
        
        // 监听网络状态变化
        window.addEventListener('offline', () => {
            this.handleOfflineMode();
        });
        
        window.addEventListener('online', () => {
            this.handleOnlineMode();
        });
    }
    
    handleBatteryLevelChange() {
        const oldLevel = this.getPerformanceLevelFromBattery();
        this.detectInitialPerformanceLevel();
        const newLevel = this.performanceLevel;
        
        if (oldLevel !== newLevel) {
            console.log(`性能等级变化: ${oldLevel} → ${newLevel}`);
            this.applyPerformanceProfile();
            this.notifyPerformanceChange(newLevel, 'battery');
            
            // 显示电量警告
            if (this.batteryInfo.level <= this.thresholds.critical && !this.batteryInfo.charging) {
                this.showBatteryWarning();
            }
        }
    }
    
    handleChargingStateChange() {
        const wasCharging = this.batteryInfo.charging;
        
        if (wasCharging) {
            // 开始充电 - 可以适当提升性能
            this.upgradePerformanceLevel();
            this.hideBatteryWarning();
            this.showChargingIndicator();
        } else {
            // 停止充电 - 根据电量调整性能
            this.detectInitialPerformanceLevel();
            this.applyPerformanceProfile();
            this.hideChargingIndicator();
        }
        
        console.log(`充电状态变化: ${wasCharging ? '已连接充电器' : '已断开充电器'}`);
    }
    
    handleChargingTimeChange() {
        if (this.batteryInfo.charging && this.batteryInfo.chargingTime !== Infinity) {
            const hours = Math.floor(this.batteryInfo.chargingTime / 3600);
            const minutes = Math.floor((this.batteryInfo.chargingTime % 3600) / 60);
            console.log(`预计充电时间: ${hours}小时${minutes}分钟`);
        }
    }
    
    handleDischargingTimeChange() {
        if (!this.batteryInfo.charging && this.batteryInfo.dischargingTime !== Infinity) {
            const hours = Math.floor(this.batteryInfo.dischargingTime / 3600);
            const minutes = Math.floor((this.batteryInfo.dischargingTime % 3600) / 60);
            
            console.log(`预计使用时间: ${hours}小时${minutes}分钟`);
            
            // 如果剩余时间很短，主动降级性能
            if (this.batteryInfo.dischargingTime < 3600) { // 少于1小时
                this.forcePerformanceLevel('low');
            }
        }
    }
    
    analyzePerformanceMetrics(entries) {
        entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
                const loadTime = entry.loadEventEnd - entry.navigationStart;
                
                // 如果页面加载时间过长，可能设备性能不足
                if (loadTime > 5000) {
                    this.considerPerformanceDowngrade();
                }
            }
            
            if (entry.entryType === 'measure') {
                // 分析自定义性能指标
                if (entry.duration > 100) {
                    console.warn(`性能指标异常: ${entry.name} 耗时 ${entry.duration}ms`);
                }
            }
        });
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                if (usagePercent > 0.9) {
                    console.warn('内存使用率过高:', Math.round(usagePercent * 100) + '%');
                    this.considerPerformanceDowngrade();
                }
            }, 10000);
        }
    }
    
    monitorDeviceTemperature() {
        // 注意：这个API可能不被所有浏览器支持
        if ('deviceTemperature' in navigator) {
            navigator.deviceTemperature.addEventListener('change', (e) => {
                if (e.temperature > 40) { // 40°C以上
                    console.warn('设备温度过高:', e.temperature + '°C');
                    this.forcePerformanceLevel('low');
                }
            });
        }
    }
    
    applyPerformanceProfile() {
        const profile = this.performanceProfiles[this.performanceLevel];
        
        // 应用动画设置
        this.toggleAnimations(profile.animations);
        
        // 应用视觉效果设置
        this.toggleVisualEffects(profile.visualEffects);
        
        // 应用后台同步设置
        this.toggleBackgroundSync(profile.backgroundSync);
        
        // 应用自动预加载设置
        this.toggleAutoPreload(profile.autoPreload);
        
        // 应用音频质量设置
        this.toggleHighQualityAudio(profile.highQualityAudio);
        
        // 应用震动设置
        this.toggleVibration(profile.vibration);
        
        // 应用通知设置
        this.toggleNotifications(profile.notifications);
        
        // 更新Service Worker配置
        this.updateServiceWorkerConfig(profile);
        
        // 更新全局状态
        this.featureState = { ...profile };
        
        console.log(`已应用性能配置: ${this.performanceLevel}`, profile);
    }
    
    toggleAnimations(enabled) {
        document.body.classList.toggle('reduce-motion', !enabled);
        
        // 暂停/恢复CSS动画
        document.querySelectorAll('*').forEach(el => {
            if (enabled) {
                el.style.animationPlayState = 'running';
                el.style.transitionDuration = '';
            } else {
                el.style.animationPlayState = 'paused';
                el.style.transitionDuration = '0s';
            }
        });
    }
    
    toggleVisualEffects(enabled) {
        document.body.classList.toggle('no-visual-effects', !enabled);
        
        // 控制阴影、渐变等视觉效果
        if (!enabled) {
            const style = document.createElement('style');
            style.id = 'no-visual-effects-style';
            style.textContent = `
                .no-visual-effects * {
                    box-shadow: none !important;
                    text-shadow: none !important;
                    filter: none !important;
                    backdrop-filter: none !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            const existingStyle = document.getElementById('no-visual-effects-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
    }
    
    toggleBackgroundSync(enabled) {
        if (window.swManager) {
            if (enabled) {
                window.swManager.enableBackgroundSync();
            } else {
                window.swManager.disableBackgroundSync();
            }
        }
    }
    
    toggleAutoPreload(enabled) {
        document.querySelectorAll('audio').forEach(audio => {
            audio.preload = enabled ? 'auto' : 'none';
        });
        
        document.querySelectorAll('img[data-lazy]').forEach(img => {
            if (!enabled) {
                img.loading = 'lazy';
            }
        });
    }
    
    toggleHighQualityAudio(enabled) {
        if (window.mobileAudioOptimizer) {
            if (enabled) {
                window.mobileAudioOptimizer.forceQuality('high');
            } else {
                window.mobileAudioOptimizer.forceQuality('low');
            }
        }
    }
    
    toggleVibration(enabled) {
        if (window.mobileTouchControls) {
            if (enabled) {
                window.mobileTouchControls.enableVibration();
            } else {
                window.mobileTouchControls.disableVibration();
            }
        }
    }
    
    toggleNotifications(enabled) {
        this.notificationsEnabled = enabled;
        
        if (!enabled) {
            // 清除现有通知
            document.querySelectorAll('.notification').forEach(notification => {
                notification.remove();
            });
        }
    }
    
    updateServiceWorkerConfig(profile) {
        if (window.swManager) {
            window.swManager.updateConfig({
                updateInterval: profile.updateInterval,
                maxConcurrentRequests: profile.maxConcurrentRequests,
                reducedSync: !profile.backgroundSync
            });
        }
    }
    
    handlePageHidden() {
        // 页面隐藏时进入节能模式
        this.wasHiddenPerformanceLevel = this.performanceLevel;
        this.forcePerformanceLevel('minimal');
        
        // 暂停所有音频
        document.querySelectorAll('audio').forEach(audio => {
            if (!audio.paused) {
                audio.wasPlayingBeforeHidden = true;
                audio.pause();
            }
        });
    }
    
    handlePageVisible() {
        // 页面显示时恢复性能等级
        if (this.wasHiddenPerformanceLevel) {
            this.forcePerformanceLevel(this.wasHiddenPerformanceLevel);
            this.wasHiddenPerformanceLevel = null;
        } else {
            this.detectInitialPerformanceLevel();
            this.applyPerformanceProfile();
        }
        
        // 恢复音频播放
        document.querySelectorAll('audio').forEach(audio => {
            if (audio.wasPlayingBeforeHidden) {
                audio.play().catch(err => console.warn('恢复播放失败:', err));
                audio.wasPlayingBeforeHidden = false;
            }
        });
    }
    
    handleOfflineMode() {
        // 离线模式下自动降级性能
        this.wasOfflinePerformanceLevel = this.performanceLevel;
        this.forcePerformanceLevel('low');
        this.showOfflineIndicator();
    }
    
    handleOnlineMode() {
        // 恢复在线模式性能
        if (this.wasOfflinePerformanceLevel) {
            this.forcePerformanceLevel(this.wasOfflinePerformanceLevel);
            this.wasOfflinePerformanceLevel = null;
        }
        this.hideOfflineIndicator();
    }
    
    temporarilyReducePerformance(duration) {
        const originalLevel = this.performanceLevel;
        this.forcePerformanceLevel('low');
        
        setTimeout(() => {
            this.forcePerformanceLevel(originalLevel);
        }, duration);
    }
    
    considerPerformanceDowngrade() {
        const levels = ['high', 'medium', 'low', 'minimal'];
        const currentIndex = levels.indexOf(this.performanceLevel);
        
        if (currentIndex > 0) {
            const newLevel = levels[currentIndex - 1];
            this.forcePerformanceLevel(newLevel);
            console.log(`性能自动降级: ${this.performanceLevel} → ${newLevel}`);
        }
    }
    
    upgradePerformanceLevel() {
        if (this.batteryInfo && this.batteryInfo.charging) {
            this.performanceLevel = 'high';
            this.applyPerformanceProfile();
        }
    }
    
    forcePerformanceLevel(level) {
        if (this.performanceProfiles[level]) {
            this.performanceLevel = level;
            this.applyPerformanceProfile();
            this.notifyPerformanceChange(level, 'manual');
        }
    }
    
    getPerformanceLevelFromBattery() {
        if (!this.batteryInfo) return 'high';
        
        const { level, charging } = this.batteryInfo;
        
        if (level <= this.thresholds.critical && !charging) return 'minimal';
        if (level <= this.thresholds.low && !charging) return 'low';
        if (level <= this.thresholds.medium || !charging) return 'medium';
        return 'high';
    }
    
    showBatteryWarning() {
        if (!this.notificationsEnabled) return;
        
        let warning = document.getElementById('battery-warning');
        
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'battery-warning';
            warning.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff5722;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
                font-size: 14px;
                line-height: 1.4;
            `;
            document.body.appendChild(warning);
        }
        
        const batteryPercent = Math.round(this.batteryInfo.level * 100);
        warning.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 20px; margin-right: 8px;">🔋</span>
                <strong>电量不足 (${batteryPercent}%)</strong>
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                已启用省电模式以延长使用时间
            </div>
        `;
        
        warning.style.display = 'block';
    }
    
    hideBatteryWarning() {
        const warning = document.getElementById('battery-warning');
        if (warning) {
            warning.style.display = 'none';
        }
    }
    
    showChargingIndicator() {
        let indicator = document.getElementById('charging-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'charging-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                border-radius: 6px;
                z-index: 10000;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            document.body.appendChild(indicator);
        }
        
        const batteryPercent = Math.round(this.batteryInfo.level * 100);
        indicator.innerHTML = `⚡ 充电中 (${batteryPercent}%)`;
        indicator.style.display = 'flex';
        
        // 自动隐藏
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
    
    hideChargingIndicator() {
        const indicator = document.getElementById('charging-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #FF9800;
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                z-index: 10000;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.innerHTML = `📡 离线模式 - 性能已优化`;
        indicator.style.display = 'flex';
    }
    
    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    notifyPerformanceChange(level, reason) {
        const event = new CustomEvent('batteryPerformanceChange', {
            detail: {
                level,
                reason,
                profile: this.performanceProfiles[level],
                batteryInfo: this.batteryInfo,
                featureState: this.featureState
            }
        });
        
        window.dispatchEvent(event);
    }
    
    // 公共API方法
    getCurrentPerformanceLevel() {
        return {
            level: this.performanceLevel,
            profile: this.performanceProfiles[this.performanceLevel],
            batteryInfo: this.batteryInfo,
            featureState: this.featureState
        };
    }
    
    getBatteryInfo() {
        return this.batteryInfo;
    }
    
    getFeatureState() {
        return { ...this.featureState };
    }
    
    setPerformanceLevel(level) {
        this.forcePerformanceLevel(level);
    }
    
    enableFeature(featureName) {
        if (this.featureState.hasOwnProperty(featureName)) {
            this.featureState[featureName] = true;
            this.applyFeatureChange(featureName, true);
        }
    }
    
    disableFeature(featureName) {
        if (this.featureState.hasOwnProperty(featureName)) {
            this.featureState[featureName] = false;
            this.applyFeatureChange(featureName, false);
        }
    }
    
    applyFeatureChange(featureName, enabled) {
        switch (featureName) {
            case 'animations':
                this.toggleAnimations(enabled);
                break;
            case 'visualEffects':
                this.toggleVisualEffects(enabled);
                break;
            case 'backgroundSync':
                this.toggleBackgroundSync(enabled);
                break;
            case 'autoPreload':
                this.toggleAutoPreload(enabled);
                break;
            case 'highQualityAudio':
                this.toggleHighQualityAudio(enabled);
                break;
            case 'vibration':
                this.toggleVibration(enabled);
                break;
            case 'notifications':
                this.toggleNotifications(enabled);
                break;
        }
    }
    
    estimateRemainingTime() {
        if (!this.batteryInfo || this.batteryInfo.charging) {
            return null;
        }
        
        const dischargingTime = this.batteryInfo.dischargingTime;
        if (dischargingTime === Infinity) {
            return null;
        }
        
        return {
            hours: Math.floor(dischargingTime / 3600),
            minutes: Math.floor((dischargingTime % 3600) / 60),
            total: dischargingTime
        };
    }
}

// 全局实例
window.batteryPerformanceManager = new BatteryPerformanceManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BatteryPerformanceManager;
}