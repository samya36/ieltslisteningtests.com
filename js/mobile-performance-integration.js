/**
 * Mobile Performance Integration
 * 整合所有移动端性能优化组件
 * 提供统一的初始化和管理接口
 */

class MobilePerformanceIntegration {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.performanceMetrics = {
            initTime: 0,
            audioLoadTime: 0,
            gestureResponseTime: 0,
            batteryLevel: 1.0,
            networkSpeed: 'unknown'
        };
        
        this.init();
    }
    
    async init() {
        const startTime = performance.now();
        
        try {
            // 检测移动端环境
            if (!this.isMobileDevice()) {
                console.log('非移动端环境，跳过移动端优化');
                return;
            }
            
            console.log('开始初始化移动端性能优化系统...');
            
            // 初始化各个组件
            await this.initializeComponents();
            
            // 设置组件间通信
            this.setupComponentCommunication();
            
            // 应用初始化优化
            this.applyInitialOptimizations();
            
            // 设置性能监控
            this.setupPerformanceMonitoring();
            
            // 设置事件监听
            this.setupEventListeners();
            
            // 标记初始化完成
            this.isInitialized = true;
            this.performanceMetrics.initTime = performance.now() - startTime;
            
            console.log('移动端性能优化系统初始化完成', {
                initTime: this.performanceMetrics.initTime,
                components: Object.keys(this.components)
            });
            
            // 触发初始化完成事件
            this.dispatchEvent('mobilePerformanceReady', {
                metrics: this.performanceMetrics,
                components: this.components
            });
            
        } catch (error) {
            console.error('移动端性能优化系统初始化失败:', error);
        }
    }
    
    async initializeComponents() {
        const initPromises = [];
        
        // 初始化音频优化器
        if (window.MobileAudioOptimizer) {
            initPromises.push(this.initAudioOptimizer());
        }
        
        // 初始化触摸控制
        if (window.MobileTouchControls) {
            initPromises.push(this.initTouchControls());
        }
        
        // 初始化手势音频控制
        if (window.MobileGestureAudio) {
            initPromises.push(this.initGestureAudio());
        }
        
        // 初始化电池性能管理
        if (window.BatteryPerformanceManager) {
            initPromises.push(this.initBatteryManager());
        }
        
        // 等待所有组件初始化完成
        await Promise.all(initPromises);
    }
    
    async initAudioOptimizer() {
        try {
            this.components.audioOptimizer = window.mobileAudioOptimizer || new MobileAudioOptimizer();
            console.log('音频优化器初始化完成');
        } catch (error) {
            console.error('音频优化器初始化失败:', error);
        }
    }
    
    async initTouchControls() {
        try {
            this.components.touchControls = window.mobileTouchControls || new MobileTouchControls();
            console.log('触摸控制初始化完成');
        } catch (error) {
            console.error('触摸控制初始化失败:', error);
        }
    }
    
    async initGestureAudio() {
        try {
            this.components.gestureAudio = window.mobileGestureAudio || new MobileGestureAudio();
            console.log('手势音频控制初始化完成');
        } catch (error) {
            console.error('手势音频控制初始化失败:', error);
        }
    }
    
    async initBatteryManager() {
        try {
            this.components.batteryManager = window.batteryPerformanceManager || new BatteryPerformanceManager();
            console.log('电池性能管理初始化完成');
        } catch (error) {
            console.error('电池性能管理初始化失败:', error);
        }
    }
    
    setupComponentCommunication() {
        // 音频优化器与电池管理器通信
        if (this.components.audioOptimizer && this.components.batteryManager) {
            window.addEventListener('batteryPerformanceChange', (e) => {
                const { level, profile } = e.detail;
                
                if (profile.highQualityAudio) {
                    this.components.audioOptimizer.resetToAuto();
                } else {
                    this.components.audioOptimizer.forceQuality('low');
                }
            });
        }
        
        // 触摸控制与电池管理器通信
        if (this.components.touchControls && this.components.batteryManager) {
            window.addEventListener('batteryPerformanceChange', (e) => {
                const { profile } = e.detail;
                
                if (profile.vibration && this.components.touchControls.enableVibration) {
                    this.components.touchControls.enableVibration();
                } else if (this.components.touchControls.disableVibration) {
                    this.components.touchControls.disableVibration();
                }
            });
        }
        
        // 音频优化器与网络状态通信
        if (this.components.audioOptimizer) {
            window.addEventListener('mobileAudioOptimizer:qualityChanged', (e) => {
                this.performanceMetrics.audioQuality = e.detail.quality;
                this.updatePerformanceDisplay();
            });
        }
    }
    
    applyInitialOptimizations() {
        // 应用CSS优化
        this.applyCSSOptimizations();
        
        // 优化现有音频元素
        this.optimizeExistingAudioElements();
        
        // 设置视口优化
        this.optimizeViewport();
        
        // 预加载关键资源
        this.preloadCriticalResources();
    }
    
    applyCSSOptimizations() {
        // 确保移动端CSS已加载
        if (!document.getElementById('mobile-performance-css')) {
            const link = document.createElement('link');
            link.id = 'mobile-performance-css';
            link.rel = 'stylesheet';
            link.href = '/css/mobile-performance-optimizations.css';
            document.head.appendChild(link);
        }
        
        // 添加移动端标识类
        document.body.classList.add('mobile-optimized');
        
        // 根据设备特性添加特定类
        if (this.isLowEndDevice()) {
            document.body.classList.add('low-end-device');
        }
        
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }
    
    optimizeExistingAudioElements() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            // 设置移动端友好的预加载策略
            if (this.components.audioOptimizer) {
                const shouldPreload = this.components.audioOptimizer.shouldPreloadAudio();
                audio.preload = shouldPreload ? 'metadata' : 'none';
            }
            
            // 添加音频加载性能监控
            audio.addEventListener('loadstart', () => {
                this.performanceMetrics.audioLoadStartTime = performance.now();
            });
            
            audio.addEventListener('canplaythrough', () => {
                if (this.performanceMetrics.audioLoadStartTime) {
                    this.performanceMetrics.audioLoadTime = 
                        performance.now() - this.performanceMetrics.audioLoadStartTime;
                    this.updatePerformanceDisplay();
                }
            });
        });
    }
    
    optimizeViewport() {
        // 优化视口设置防止缩放问题
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover');
        }
        
        // 防止iOS Safari地址栏导致的高度变化
        if (this.isIOS()) {
            this.setupIOSViewportFix();
        }
    }
    
    setupIOSViewportFix() {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
    }
    
    preloadCriticalResources() {
        // 预加载关键的移动端资源
        const criticalResources = [
            '/css/mobile-performance-optimizations.css',
            '/js/mobile-audio-optimizer.js',
            '/js/mobile-touch-controls.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    setupPerformanceMonitoring() {
        // 监控FPS
        this.monitorFPS();
        
        // 监控内存使用
        this.monitorMemoryUsage();
        
        // 监控网络状态
        this.monitorNetworkStatus();
        
        // 监控电池状态
        this.monitorBatteryStatus();
        
        // 设置性能报告
        this.setupPerformanceReporting();
    }
    
    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                this.performanceMetrics.fps = fps;
                
                // 如果FPS过低，考虑降级
                if (fps < 30 && this.components.batteryManager) {
                    this.components.batteryManager.considerPerformanceDowngrade();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                };
                
                // 内存使用过高时清理
                if (this.performanceMetrics.memoryUsage.percentage > 85) {
                    this.performMemoryCleanup();
                }
            }, 5000);
        }
    }
    
    monitorNetworkStatus() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const updateNetworkInfo = () => {
                this.performanceMetrics.networkSpeed = connection.effectiveType;
                this.performanceMetrics.downlink = connection.downlink;
                this.performanceMetrics.rtt = connection.rtt;
                this.performanceMetrics.saveData = connection.saveData;
                
                this.updatePerformanceDisplay();
            };
            
            updateNetworkInfo();
            connection.addEventListener('change', updateNetworkInfo);
        }
    }
    
    monitorBatteryStatus() {
        if (this.components.batteryManager) {
            const updateBatteryInfo = () => {
                const batteryInfo = this.components.batteryManager.getBatteryInfo();
                if (batteryInfo) {
                    this.performanceMetrics.batteryLevel = batteryInfo.level;
                    this.performanceMetrics.batteryCharging = batteryInfo.charging;
                    this.updatePerformanceDisplay();
                }
            };
            
            updateBatteryInfo();
            window.addEventListener('batteryPerformanceChange', updateBatteryInfo);
        }
    }
    
    setupPerformanceReporting() {
        // 创建性能显示面板（开发模式）
        if (this.isDebugMode()) {
            this.createPerformanceDisplay();
        }
        
        // 定期报告性能指标
        setInterval(() => {
            this.reportPerformanceMetrics();
        }, 30000); // 每30秒报告一次
    }
    
    setupEventListeners() {
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
        
        // 网络状态变化
        window.addEventListener('online', () => {
            this.handleNetworkOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleNetworkOffline();
        });
        
        // 方向变化
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });
        
        // 内存压力事件（如果支持）
        if ('onmemorywarning' in window) {
            window.addEventListener('memorywarning', () => {
                this.handleMemoryWarning();
            });
        }
    }
    
    handlePageHidden() {
        console.log('页面隐藏，启动节能模式');
        
        // 暂停非必要的性能监控
        this.pauseNonEssentialMonitoring();
        
        // 通知所有组件页面隐藏
        Object.values(this.components).forEach(component => {
            if (component.handlePageHidden) {
                component.handlePageHidden();
            }
        });
    }
    
    handlePageVisible() {
        console.log('页面显示，恢复正常模式');
        
        // 恢复性能监控
        this.resumeNonEssentialMonitoring();
        
        // 通知所有组件页面显示
        Object.values(this.components).forEach(component => {
            if (component.handlePageVisible) {
                component.handlePageVisible();
            }
        });
    }
    
    handleNetworkOnline() {
        console.log('网络恢复连接');
        this.performanceMetrics.isOnline = true;
        
        // 恢复网络相关功能
        if (this.components.audioOptimizer) {
            this.components.audioOptimizer.resetToAuto();
        }
    }
    
    handleNetworkOffline() {
        console.log('网络连接中断');
        this.performanceMetrics.isOnline = false;
        
        // 启用离线模式优化
        if (this.components.audioOptimizer) {
            this.components.audioOptimizer.forceQuality('low');
        }
    }
    
    handleOrientationChange() {
        console.log('屏幕方向改变');
        
        // 短暂降低性能以节省电量
        if (this.components.batteryManager) {
            this.components.batteryManager.temporarilyReducePerformance(2000);
        }
        
        // 重新计算布局
        setTimeout(() => {
            this.recalculateLayout();
        }, 100);
    }
    
    handleMemoryWarning() {
        console.warn('收到内存警告，执行紧急清理');
        this.performMemoryCleanup();
        
        // 强制降级性能
        if (this.components.batteryManager) {
            this.components.batteryManager.forcePerformanceLevel('low');
        }
    }
    
    performMemoryCleanup() {
        console.log('执行内存清理');
        
        // 清理音频缓存
        document.querySelectorAll('audio').forEach(audio => {
            if (audio.paused && audio.currentTime === 0) {
                audio.src = '';
                audio.load();
            }
        });
        
        // 清理Service Worker缓存
        if (window.swManager) {
            window.swManager.cleanupOldCaches();
        }
        
        // 强制垃圾回收（如果支持）
        if (window.gc) {
            window.gc();
        }
    }
    
    recalculateLayout() {
        // 重新计算触摸目标大小
        if (this.components.touchControls) {
            this.components.touchControls.recalculateControlSizes();
        }
        
        // 更新音频播放器布局
        document.querySelectorAll('.audio-player').forEach(player => {
            player.classList.add('layout-recalculating');
            setTimeout(() => {
                player.classList.remove('layout-recalculating');
            }, 300);
        });
    }
    
    pauseNonEssentialMonitoring() {
        this.monitoringPaused = true;
    }
    
    resumeNonEssentialMonitoring() {
        this.monitoringPaused = false;
    }
    
    createPerformanceDisplay() {
        const display = document.createElement('div');
        display.id = 'mobile-performance-display';
        display.className = 'performance-debug';
        display.style.cssText = `\n            position: fixed;\n            bottom: 10px;\n            left: 10px;\n            background: rgba(0, 0, 0, 0.8);\n            color: white;\n            padding: 10px;\n            border-radius: 4px;\n            font-size: 11px;\n            z-index: 10000;\n            font-family: monospace;\n            max-width: 200px;\n            pointer-events: none;\n        `;\n        \n        document.body.appendChild(display);\n        \n        // 双击隐藏/显示\n        display.addEventListener('dblclick', () => {\n            display.classList.toggle('hidden');\n        });\n        \n        this.performanceDisplay = display;\n    }\n    \n    updatePerformanceDisplay() {\n        if (!this.performanceDisplay || this.monitoringPaused) return;\n        \n        const metrics = this.performanceMetrics;\n        this.performanceDisplay.innerHTML = `\n            <div>FPS: ${metrics.fps || 'N/A'}</div>\n            <div>电量: ${Math.round((metrics.batteryLevel || 1) * 100)}%</div>\n            <div>网络: ${metrics.networkSpeed || 'N/A'}</div>\n            <div>音频: ${metrics.audioQuality || 'N/A'}</div>\n            <div>内存: ${metrics.memoryUsage ? Math.round(metrics.memoryUsage.percentage) + '%' : 'N/A'}</div>\n        `;\n    }\n    \n    reportPerformanceMetrics() {\n        if (this.monitoringPaused) return;\n        \n        console.log('性能指标报告:', {\n            timestamp: new Date().toISOString(),\n            metrics: this.performanceMetrics,\n            components: Object.keys(this.components),\n            deviceInfo: {\n                userAgent: navigator.userAgent,\n                viewport: {\n                    width: window.innerWidth,\n                    height: window.innerHeight\n                },\n                pixelRatio: window.devicePixelRatio,\n                memory: navigator.deviceMemory,\n                cores: navigator.hardwareConcurrency\n            }\n        });\n    }\n    \n    // 工具方法\n    isMobileDevice() {\n        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);\n    }\n    \n    isLowEndDevice() {\n        const memory = navigator.deviceMemory || 4;\n        const cores = navigator.hardwareConcurrency || 4;\n        return memory <= 2 || cores <= 2;\n    }\n    \n    isTouchDevice() {\n        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;\n    }\n    \n    isIOS() {\n        return /iPad|iPhone|iPod/.test(navigator.userAgent);\n    }\n    \n    isDebugMode() {\n        return localStorage.getItem('mobile-performance-debug') === 'true' || \n               window.location.search.includes('debug=true');\n    }\n    \n    dispatchEvent(eventType, data = {}) {\n        const event = new CustomEvent(eventType, {\n            detail: {\n                ...data,\n                integration: this\n            }\n        });\n        \n        window.dispatchEvent(event);\n    }\n    \n    // 公共API方法\n    getPerformanceMetrics() {\n        return { ...this.performanceMetrics };\n    }\n    \n    getComponents() {\n        return { ...this.components };\n    }\n    \n    enableDebugMode() {\n        localStorage.setItem('mobile-performance-debug', 'true');\n        if (!this.performanceDisplay) {\n            this.createPerformanceDisplay();\n        }\n    }\n    \n    disableDebugMode() {\n        localStorage.removeItem('mobile-performance-debug');\n        if (this.performanceDisplay) {\n            this.performanceDisplay.remove();\n            this.performanceDisplay = null;\n        }\n    }\n    \n    forceOptimizationLevel(level) {\n        if (this.components.batteryManager) {\n            this.components.batteryManager.setPerformanceLevel(level);\n        }\n        \n        if (this.components.audioOptimizer) {\n            const qualityMap = {\n                minimal: 'low',\n                low: 'low',\n                medium: 'medium',\n                high: 'high'\n            };\n            this.components.audioOptimizer.forceQuality(qualityMap[level] || 'medium');\n        }\n    }\n    \n    getOptimizationRecommendations() {\n        const recommendations = [];\n        const metrics = this.performanceMetrics;\n        \n        if (metrics.fps && metrics.fps < 30) {\n            recommendations.push('FPS过低，建议降低视觉效果');\n        }\n        \n        if (metrics.memoryUsage && metrics.memoryUsage.percentage > 80) {\n            recommendations.push('内存使用率过高，建议清理缓存');\n        }\n        \n        if (metrics.batteryLevel < 0.2 && !metrics.batteryCharging) {\n            recommendations.push('电量不足，建议启用省电模式');\n        }\n        \n        if (metrics.networkSpeed === 'slow-2g' || metrics.networkSpeed === '2g') {\n            recommendations.push('网络较慢，建议降低音频质量');\n        }\n        \n        return recommendations;\n    }\n}\n\n// 自动初始化\nif ('loading' in document && document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.mobilePerformanceIntegration = new MobilePerformanceIntegration();\n    });\n} else {\n    window.mobilePerformanceIntegration = new MobilePerformanceIntegration();\n}\n\n// 导出供其他模块使用\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = MobilePerformanceIntegration;\n}"