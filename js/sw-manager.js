/**
 * Service Worker 管理器
 * 负责注册、更新、通信和监控 Service Worker
 */

class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.isUpdateAvailable = false;
        this.cacheStats = null;
        this.messageChannel = null;
        
        // 事件监听器
        this.eventListeners = {
            'sw-registered': [],
            'sw-updated': [],
            'sw-offline': [],
            'sw-online': [],
            'cache-updated': []
        };
        
        console.log('🔧 Service Worker Manager 初始化');
        this.init();
    }
    
    /**
     * 初始化 Service Worker 管理器
     */
    async init() {
        // 检查浏览器支持
        if (!this.isServiceWorkerSupported()) {
            console.warn('⚠️  浏览器不支持 Service Worker');
            return;
        }
        
        try {
            // 注册 Service Worker
            await this.registerServiceWorker();
            
            // 设置消息通道
            this.setupMessageChannel();
            
            // 监听网络状态变化
            this.setupNetworkListeners();
            
            // 定期更新缓存统计
            this.startCacheStatsPolling();
            
            console.log('✅ Service Worker Manager 初始化完成');
            
        } catch (error) {
            console.error('❌ Service Worker Manager 初始化失败:', error);
        }
    }
    
    /**
     * 检查浏览器支持
     */
    isServiceWorkerSupported() {
        return 'serviceWorker' in navigator;
    }
    
    /**
     * 注册 Service Worker
     */
    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none' // 总是检查更新
            });
            
            console.log('📦 Service Worker 注册成功:', this.swRegistration.scope);
            
            // 监听 Service Worker 状态变化
            this.setupServiceWorkerListeners();
            
            // 检查更新
            await this.checkForUpdates();
            
            // 触发注册完成事件
            this.emit('sw-registered', { registration: this.swRegistration });
            
        } catch (error) {
            console.error('❌ Service Worker 注册失败:', error);
            throw error;
        }
    }
    
    /**
     * 设置 Service Worker 事件监听
     */
    setupServiceWorkerListeners() {
        // 监听安装中的 Service Worker
        if (this.swRegistration.installing) {
            this.trackServiceWorkerState(this.swRegistration.installing);
        }
        
        // 监听等待中的 Service Worker
        if (this.swRegistration.waiting) {
            this.handleWaitingServiceWorker(this.swRegistration.waiting);
        }
        
        // 监听活动的 Service Worker
        if (this.swRegistration.active) {
            this.handleActiveServiceWorker(this.swRegistration.active);
        }
        
        // 监听 Service Worker 更新
        this.swRegistration.addEventListener('updatefound', () => {
            console.log('🔄 发现 Service Worker 更新');
            const newWorker = this.swRegistration.installing;
            this.trackServiceWorkerState(newWorker);
        });
        
        // 监听控制权变化
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker 控制权发生变化');
            window.location.reload();
        });
        
        // 监听来自 Service Worker 的消息
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event);
        });
    }
    
    /**
     * 跟踪 Service Worker 状态
     */
    trackServiceWorkerState(worker) {
        worker.addEventListener('statechange', () => {
            console.log('Service Worker 状态:', worker.state);
            
            switch (worker.state) {
                case 'installed':
                    if (navigator.serviceWorker.controller) {
                        // 有更新可用
                        this.handleUpdateAvailable(worker);
                    } else {
                        // 首次安装
                        console.log('✅ Service Worker 首次安装完成');
                    }
                    break;
                    
                case 'activated':
                    console.log('🚀 Service Worker 激活完成');
                    break;
                    
                case 'redundant':
                    console.log('🗑️ Service Worker 已被废弃');
                    break;
            }
        });
    }
    
    /**
     * 处理等待中的 Service Worker
     */
    handleWaitingServiceWorker(worker) {
        this.isUpdateAvailable = true;
        this.showUpdateNotification();
    }
    
    /**
     * 处理活动的 Service Worker
     */
    handleActiveServiceWorker(worker) {
        // Service Worker 已激活，可以开始通信
        this.startServiceWorkerCommunication();
    }
    
    /**
     * 处理更新可用
     */
    handleUpdateAvailable(worker) {
        this.isUpdateAvailable = true;
        this.emit('sw-updated', { worker });
        this.showUpdateNotification();
    }
    
    /**
     * 显示更新通知
     */
    showUpdateNotification() {
        // 创建更新通知
        const notification = document.createElement('div');
        notification.className = 'sw-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🔄</div>
                <div class="notification-text">
                    <div class="notification-title">新版本可用</div>
                    <div class="notification-message">发现网站更新，点击刷新以获得最新功能</div>
                </div>
                <div class="notification-actions">
                    <button class="update-btn">立即更新</button>
                    <button class="dismiss-btn">稍后</button>
                </div>
            </div>
        `;
        
        // 添加样式
        this.addUpdateNotificationStyles();
        
        // 绑定事件
        notification.querySelector('.update-btn').addEventListener('click', () => {
            this.activateUpdate();
            notification.remove();
        });
        
        notification.querySelector('.dismiss-btn').addEventListener('click', () => {
            notification.remove();
        });
        
        // 显示通知
        document.body.appendChild(notification);
        
        // 5秒后自动消失
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 30000);
    }
    
    /**
     * 添加更新通知样式
     */
    addUpdateNotificationStyles() {
        if (document.querySelector('#sw-notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'sw-notification-styles';
        style.textContent = `
            .sw-update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
                border-left: 4px solid #4CAF50;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }
            
            .notification-message {
                font-size: 14px;
                color: #666;
                line-height: 1.4;
            }
            
            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
            
            .update-btn, .dismiss-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .update-btn {
                background: #4CAF50;
                color: white;
            }
            
            .update-btn:hover {
                background: #45a049;
            }
            
            .dismiss-btn {
                background: #f5f5f5;
                color: #666;
            }
            
            .dismiss-btn:hover {
                background: #eeeeee;
            }
            
            @media (max-width: 768px) {
                .sw-update-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * 激活更新
     */
    async activateUpdate() {
        if (!this.swRegistration.waiting) return;
        
        try {
            // 发送消息给等待中的 Service Worker
            this.swRegistration.waiting.postMessage({ type: 'UPDATE_SW' });
            
            // 显示更新进度
            this.showUpdateProgress();
            
        } catch (error) {
            console.error('激活更新失败:', error);
        }
    }
    
    /**
     * 显示更新进度
     */
    showUpdateProgress() {
        const progressOverlay = document.createElement('div');
        progressOverlay.className = 'sw-update-progress';
        progressOverlay.innerHTML = `
            <div class="progress-content">
                <div class="progress-spinner"></div>
                <div class="progress-text">正在更新...</div>
            </div>
        `;
        
        progressOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        document.body.appendChild(progressOverlay);
    }
    
    /**
     * 设置消息通道
     */
    setupMessageChannel() {
        this.messageChannel = new MessageChannel();
        
        // 监听来自 Service Worker 的响应
        this.messageChannel.port1.addEventListener('message', (event) => {
            this.handleServiceWorkerResponse(event);
        });
        
        this.messageChannel.port1.start();
    }
    
    /**
     * 处理来自 Service Worker 的消息
     */
    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'SW_UPDATED':
                console.log('Service Worker 已更新到版本:', data.version);
                this.emit('sw-updated', data);
                break;
                
            case 'CACHE_UPDATED':
                console.log('缓存已更新:', data);
                this.emit('cache-updated', data);
                break;
                
            default:
                console.log('收到 Service Worker 消息:', type, data);
        }
    }
    
    /**
     * 处理 Service Worker 响应
     */
    handleServiceWorkerResponse(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'CACHE_STATS':
                this.cacheStats = data;
                this.updateCacheStatsDisplay();
                break;
                
            case 'CACHE_CLEARED':
                console.log('缓存清理完成');
                break;
                
            case 'AUDIO_PRELOADED':
                console.log('音频预加载完成');
                break;
        }
    }
    
    /**
     * 发送消息给 Service Worker
     */
    async sendMessageToServiceWorker(message) {
        if (!this.swRegistration || !this.swRegistration.active) {
            throw new Error('Service Worker 不可用');
        }
        
        return new Promise((resolve, reject) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data);
            };
            
            setTimeout(() => {
                reject(new Error('Service Worker 响应超时'));
            }, 5000);
            
            this.swRegistration.active.postMessage(message, [messageChannel.port2]);
        });
    }
    
    /**
     * 开始 Service Worker 通信
     */
    startServiceWorkerCommunication() {
        // 发送端口给 Service Worker
        if (this.swRegistration.active && this.messageChannel) {
            this.swRegistration.active.postMessage(
                { type: 'INIT_PORT' },
                [this.messageChannel.port2]
            );
        }
    }
    
    /**
     * 设置网络状态监听
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('🌐 网络已连接');
            this.emit('sw-online');
            this.handleNetworkStatusChange(true);
        });
        
        window.addEventListener('offline', () => {
            console.log('🌐 网络已断开');
            this.emit('sw-offline');
            this.handleNetworkStatusChange(false);
        });
    }
    
    /**
     * 处理网络状态变化
     */
    handleNetworkStatusChange(isOnline) {
        // 更新UI状态
        document.body.classList.toggle('offline', !isOnline);
        
        if (isOnline) {
            // 网络恢复，检查更新
            this.checkForUpdates();
        } else {
            // 网络断开，显示离线提示
            this.showOfflineNotification();
        }
    }
    
    /**
     * 显示离线通知
     */
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.className = 'offline-notification';
        notification.innerHTML = `
            <div class="offline-content">
                <span class="offline-icon">📴</span>
                <span class="offline-text">您处于离线状态，部分功能可能受限</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 9999;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // 网络恢复时自动隐藏
        const hideOnOnline = () => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 300);
            window.removeEventListener('online', hideOnOnline);
        };
        
        window.addEventListener('online', hideOnOnline);
    }
    
    /**
     * 检查更新
     */
    async checkForUpdates() {
        if (!this.swRegistration) return;
        
        try {
            await this.swRegistration.update();
            console.log('✅ Service Worker 更新检查完成');
        } catch (error) {
            console.warn('⚠️  Service Worker 更新检查失败:', error);
        }
    }
    
    /**
     * 开始缓存统计轮询
     */
    startCacheStatsPolling() {
        // 立即获取一次
        this.getCacheStats();
        
        // 每30秒更新一次
        setInterval(() => {
            this.getCacheStats();
        }, 30000);
    }
    
    /**
     * 获取缓存统计
     */
    async getCacheStats() {
        try {
            const stats = await this.sendMessageToServiceWorker({
                type: 'GET_CACHE_STATS'
            });
            
            this.cacheStats = stats.data;
            this.updateCacheStatsDisplay();
            
        } catch (error) {
            console.warn('获取缓存统计失败:', error);
        }
    }
    
    /**
     * 更新缓存统计显示
     */
    updateCacheStatsDisplay() {
        // 在控制台显示统计信息
        if (this.cacheStats) {
            console.log('📊 缓存统计:', this.cacheStats);
        }
        
        // 可以在页面上显示缓存统计
        const statsElement = document.querySelector('#cache-stats');
        if (statsElement && this.cacheStats) {
            statsElement.innerHTML = `
                <div class="cache-stat">
                    <span class="stat-label">缓存命中:</span>
                    <span class="stat-value">${this.cacheStats.hits}</span>
                </div>
                <div class="cache-stat">
                    <span class="stat-label">缓存未命中:</span>
                    <span class="stat-value">${this.cacheStats.misses}</span>
                </div>
                <div class="cache-stat">
                    <span class="stat-label">缓存更新:</span>
                    <span class="stat-value">${this.cacheStats.updates}</span>
                </div>
            `;
        }
    }
    
    /**
     * 清理指定缓存
     */
    async clearCache(cacheName) {
        try {
            await this.sendMessageToServiceWorker({
                type: 'CLEAR_CACHE',
                data: { cacheName }
            });
            
            console.log(`缓存已清理: ${cacheName}`);
            
        } catch (error) {
            console.error('清理缓存失败:', error);
        }
    }
    
    /**
     * 预加载音频文件
     */
    async preloadAudio(urls) {
        try {
            await this.sendMessageToServiceWorker({
                type: 'PRELOAD_AUDIO',
                data: { urls }
            });
            
            console.log('音频预加载请求已发送');
            
        } catch (error) {
            console.error('音频预加载失败:', error);
        }
    }
    
    /**
     * 获取缓存信息
     */
    getCacheInfo() {
        return {
            isServiceWorkerSupported: this.isServiceWorkerSupported(),
            isRegistered: !!this.swRegistration,
            isUpdateAvailable: this.isUpdateAvailable,
            stats: this.cacheStats
        };
    }
    
    /**
     * 事件系统
     */
    on(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
    }
    
    off(eventType, callback) {
        if (this.eventListeners[eventType]) {
            const index = this.eventListeners[eventType].indexOf(callback);
            if (index > -1) {
                this.eventListeners[eventType].splice(index, 1);
            }
        }
    }
    
    emit(eventType, data) {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('事件处理器错误:', error);
                }
            });
        }
    }
    
    /**
     * 销毁管理器
     */
    destroy() {
        // 清理事件监听器
        this.eventListeners = {};
        
        // 关闭消息通道
        if (this.messageChannel) {
            this.messageChannel.port1.close();
        }
        
        console.log('Service Worker Manager 已销毁');
    }
}

// 全局实例
window.swManager = new ServiceWorkerManager();

// 导出类
window.ServiceWorkerManager = ServiceWorkerManager;