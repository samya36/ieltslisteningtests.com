/**
 * IELTS 听力测试网站 Service Worker
 * 高级缓存策略和离线功能支持
 * 
 * 版本: 2.3.0
 * 更新日期: 2024年
 */

// ==================== 配置常量 ====================

const SW_VERSION = '2.3.1';
const SW_NAME = `ielts-sw-${SW_VERSION}`;

// 缓存名称配置
const CACHE_NAMES = {
    STATIC: `ielts-static-${SW_VERSION}`,
    AUDIO: `ielts-audio-${SW_VERSION}`,
    DYNAMIC: `ielts-dynamic-${SW_VERSION}`,
    OFFLINE: `ielts-offline-${SW_VERSION}`
};

// 缓存策略配置
const CACHE_CONFIG = {
    STATIC: {
        strategy: 'cacheFirst',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
        maxEntries: 100
    },
    AUDIO: {
        strategy: 'networkFirstWithCache',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        maxEntries: 50,
        networkTimeout: 3000
    },
    DYNAMIC: {
        strategy: 'staleWhileRevalidate',
        maxAge: 60 * 60 * 1000, // 1小时
        maxEntries: 30
    }
};

// 预缓存/预加载节流配置
const PRECACHE_REQUEST_DELAY = 120; // ms
const AUDIO_PRELOAD_DELAY = 500; // ms

// 预缓存资源列表
const PRECACHE_RESOURCES = [
    // 核心HTML文件
    '/',
    '/index.html',
    '/pages/test1.html',
    '/pages/test2.html',
    '/pages/test3.html',
    '/pages/test4.html',
    '/pages/test5.html',
    '/pages/test6.html',
    '/pages/test7.html',
    '/pages/enhanced-test1.html',
    '/pages/optimization-demo.html',
    '/pages/practice.html',
    '/pages/scoring.html',
    
    // 核心CSS文件
    '/css/main.css',
    '/css/test.css',
    '/css/responsive.css',
    '/css/accessibility.css',
    '/css/mobile-optimizations.css',
    '/css/visual-feedback.css',
    
    // 核心JavaScript文件
    '/js/secure-storage.js',
    '/js/network-speed-detector.js',
    '/js/enhanced-audio.js',
    '/js/progressive-audio-loader.js',
    '/js/modern-audio-manager.js',
    '/js/modern-audio-integration.js',
    '/js/test-ui.js',
    '/js/test-player.js',
    '/js/progress-manager.js',
    
    // 测试数据文件
    '/js/test-data.js',
    '/js/test-answers.js',
    '/js/test-data-2.js',
    '/js/test-answers-2.js',
    '/js/test-data-3.js',
    '/js/test-answers-3.js'
];

// 路由匹配规则
const ROUTE_PATTERNS = {
    STATIC: [
        /\.(?:css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
        /^\/css\//,
        /^\/js\//,
        /^\/images\//,
        /^\/fonts\//
    ],
    AUDIO: [
        /\.(?:mp3|m4a|wav|ogg|aac)$/,
        /^\/audio\//
    ],
    DYNAMIC: [
        /\.html$/,
        /^\/pages\//,
        /^\/$/
    ]
};

// ==================== Service Worker 主类 ====================

class IELTSServiceWorker {
    constructor() {
        this.isOnline = true;
        this.cacheStats = {
            hits: 0,
            misses: 0,
            updates: 0,
            deletions: 0
        };
        
        console.log(`🔧 IELTS Service Worker ${SW_VERSION} 初始化`);
        this.init();
    }
    
    init() {
        // 绑定事件监听器
        self.addEventListener('install', this.handleInstall.bind(this));
        self.addEventListener('activate', this.handleActivate.bind(this));
        self.addEventListener('fetch', this.handleFetch.bind(this));
        self.addEventListener('message', this.handleMessage.bind(this));
        self.addEventListener('sync', this.handleBackgroundSync.bind(this));
        
        // 监听网络状态
        self.addEventListener('online', () => this.isOnline = true);
        self.addEventListener('offline', () => this.isOnline = false);
    }
    
    // ==================== 安装处理 ====================
    
    async handleInstall(event) {
        console.log('📦 Service Worker 安装中...');
        
        event.waitUntil(
            this.performInstallation()
        );
        
        // 强制激活新版本
        self.skipWaiting();
    }
    
    async performInstallation() {
        try {
            // 创建新的缓存
            const staticCache = await caches.open(CACHE_NAMES.STATIC);
            const offlineCache = await caches.open(CACHE_NAMES.OFFLINE);
            
            // 预缓存核心资源
            console.log('📋 预缓存核心资源...');
            await this.precacheResources(staticCache);
            
            // 缓存离线页面
            await this.cacheOfflineResources(offlineCache);
            
            console.log('✅ Service Worker 安装完成');
            
        } catch (error) {
            console.error('❌ Service Worker 安装失败:', error);
            throw error;
        }
    }
    
    async precacheResources(cache) {
        for (const url of PRECACHE_RESOURCES) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log(`✅ 预缓存: ${url}`);
                } else {
                    console.warn(`⚠️  预缓存失败: ${url} (${response.status})`);
                }
            } catch (error) {
                console.warn(`⚠️  预缓存错误: ${url}`, error);
            }

            // 节流，避免安装阶段请求风暴
            await this.sleep(PRECACHE_REQUEST_DELAY);
        }
    }
    
    async cacheOfflineResources(cache) {
        // 创建离线页面
        const offlineHTML = this.generateOfflinePage();
        const offlineResponse = new Response(offlineHTML, {
            headers: { 'Content-Type': 'text/html' }
        });
        
        await cache.put('/offline.html', offlineResponse);
        
        // 缓存离线音频文件（如果有）
        await this.cacheOfflineAudio(cache);
    }
    
    generateOfflinePage() {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>离线模式 - 雅思听力测试</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .offline-container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .offline-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        h1 {
            margin: 0 0 20px 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .offline-features {
            text-align: left;
            margin: 30px 0;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
        }
        .retry-btn {
            background: white;
            color: #667eea;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
        }
        .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .cache-info {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">🌐</div>
        <h1>离线模式</h1>
        <p>您当前处于离线状态，但仍可以使用已缓存的功能</p>
        
        <div class="offline-features">
            <div class="feature">
                <div class="feature-icon">📚</div>
                <div>浏览已缓存的测试页面</div>
            </div>
            <div class="feature">
                <div class="feature-icon">🎵</div>
                <div>播放已下载的音频文件</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📊</div>
                <div>查看历史测试记录</div>
            </div>
            <div class="feature">
                <div class="feature-icon">⚙️</div>
                <div>使用基础功能和工具</div>
            </div>
        </div>
        
        <button class="retry-btn" onclick="location.reload()">
            重新连接
        </button>
        
        <div class="cache-info">
            <div><strong>缓存状态:</strong> 已启用</div>
            <div><strong>Service Worker:</strong> v${SW_VERSION}</div>
            <div><strong>最后更新:</strong> <span id="last-update">-</span></div>
        </div>
    </div>
    
    <script>
        // 显示最后更新时间
        document.getElementById('last-update').textContent = new Date().toLocaleString();
        
        // 定期检查网络状态
        setInterval(() => {
            if (navigator.onLine) {
                location.reload();
            }
        }, 5000);
        
        // 监听网络状态变化
        window.addEventListener('online', () => {
            location.reload();
        });
    </script>
</body>
</html>`;
    }
    
    async cacheOfflineAudio(cache) {
        // 缓存一些基础音频文件供离线使用
        const offlineAudioFiles = [
            // 可以添加一些示例音频文件
        ];
        
        for (const audioFile of offlineAudioFiles) {
            try {
                const response = await fetch(audioFile);
                if (response.ok) {
                    await cache.put(audioFile, response);
                }
            } catch (error) {
                console.warn(`离线音频缓存失败: ${audioFile}`, error);
            }
        }
    }
    
    // ==================== 激活处理 ====================
    
    async handleActivate(event) {
        console.log('🚀 Service Worker 激活中...');
        
        event.waitUntil(
            this.performActivation()
        );
        
        // 立即控制所有客户端
        self.clients.claim();
    }
    
    async performActivation() {
        try {
            // 清理旧版本缓存
            await this.cleanupOldCaches();
            
            // 初始化缓存统计
            await this.initializeCacheStats();
            
            // 通知客户端Service Worker已更新
            await this.notifyClientsOfUpdate();
            
            console.log('✅ Service Worker 激活完成');
            
        } catch (error) {
            console.error('❌ Service Worker 激活失败:', error);
        }
    }
    
    async cleanupOldCaches() {
        const cacheNames = await caches.keys();
        const currentCaches = Object.values(CACHE_NAMES);
        
        const deletePromises = cacheNames
            .filter(name => name.startsWith('ielts-') && !currentCaches.includes(name))
            .map(name => {
                console.log(`🗑️ 删除旧缓存: ${name}`);
                this.cacheStats.deletions++;
                return caches.delete(name);
            });
        
        await Promise.all(deletePromises);
    }
    
    async initializeCacheStats() {
        // 重置统计信息
        this.cacheStats = { hits: 0, misses: 0, updates: 0, deletions: 0 };
        
        // 可以从 IndexedDB 恢复统计信息
        try {
            const stats = await this.loadCacheStatsFromDB();
            if (stats) {
                this.cacheStats = { ...this.cacheStats, ...stats };
            }
        } catch (error) {
            console.warn('缓存统计恢复失败:', error);
        }
    }
    
    async notifyClientsOfUpdate() {
        const clients = await self.clients.matchAll();
        
        clients.forEach(client => {
            client.postMessage({
                type: 'SW_UPDATED',
                version: SW_VERSION,
                cacheNames: CACHE_NAMES
            });
        });
    }
    
    // ==================== 请求处理 ====================
    
    async handleFetch(event) {
        const request = event.request;
        const url = new URL(request.url);
        
        // 只处理GET请求
        if (request.method !== 'GET') {
            return;
        }
        
        // 跳过chrome-extension和其他非HTTP请求
        if (!url.protocol.startsWith('http')) {
            return;
        }
        
        event.respondWith(
            this.routeRequest(request)
        );
    }
    
    async routeRequest(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        
        try {
            // 确定请求类型和对应的缓存策略
            const requestType = this.getRequestType(pathname);
            
            switch (requestType) {
                case 'STATIC':
                    return await this.handleStaticRequest(request);
                case 'AUDIO':
                    return await this.handleAudioRequest(request);
                case 'DYNAMIC':
                    return await this.handleDynamicRequest(request);
                default:
                    return await this.handleDefaultRequest(request);
            }
            
        } catch (error) {
            console.error('请求处理失败:', error);
            return await this.handleRequestError(request, error);
        }
    }
    
    getRequestType(pathname) {
        // 检查静态资源
        if (ROUTE_PATTERNS.STATIC.some(pattern => pattern.test(pathname))) {
            return 'STATIC';
        }
        
        // 检查音频文件
        if (ROUTE_PATTERNS.AUDIO.some(pattern => pattern.test(pathname))) {
            return 'AUDIO';
        }
        
        // 检查动态页面
        if (ROUTE_PATTERNS.DYNAMIC.some(pattern => pattern.test(pathname))) {
            return 'DYNAMIC';
        }
        
        return 'DEFAULT';
    }
    
    // ==================== 缓存策略实现 ====================
    
    async handleStaticRequest(request) {
        // Cache First 策略：优先从缓存获取，缓存未命中则从网络获取
        const cache = await caches.open(CACHE_NAMES.STATIC);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // 检查缓存是否过期
            if (await this.isCacheValid(cachedResponse, CACHE_CONFIG.STATIC.maxAge)) {
                this.cacheStats.hits++;
                return cachedResponse;
            } else {
                // 缓存过期，删除并从网络获取
                await cache.delete(request);
            }
        }
        
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // 克隆响应用于缓存
                const responseToCache = networkResponse.clone();
                
                // 添加缓存时间戳
                const headers = new Headers(responseToCache.headers);
                headers.set('sw-cache-time', Date.now().toString());
                
                const cachedResponse = new Response(responseToCache.body, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers: headers
                });
                
                await cache.put(request, cachedResponse);
                this.cacheStats.updates++;
            }
            
            return networkResponse;
            
        } catch (error) {
            this.cacheStats.misses++;
            
            // 网络失败，返回过期缓存（如果有）
            const staleCache = await cache.match(request);
            if (staleCache) {
                console.warn('返回过期缓存:', request.url);
                return staleCache;
            }
            
            throw error;
        }
    }
    
    async handleAudioRequest(request) {
        // Network First with Cache 策略：优先从网络获取，网络失败则使用缓存
        const cache = await caches.open(CACHE_NAMES.AUDIO);
        
        try {
            // 设置网络超时
            const networkResponse = await this.fetchWithTimeout(
                request,
                CACHE_CONFIG.AUDIO.networkTimeout
            );

            // Cross-origin media without CORS is exposed to the Service Worker as
            // an opaque response. Allow it through instead of treating it as a failure.
            if (networkResponse.type === 'opaque') {
                return networkResponse;
            }
            
            if (networkResponse.ok) {
                // 缓存音频文件（使用 clone，避免消费原响应流）
                await this.cacheAudioResponse(cache, request, networkResponse.clone());
                this.cacheStats.updates++;
                return networkResponse;
            }
            
        } catch (error) {
            console.warn('音频网络请求失败，尝试缓存:', error);
        }
        
        // 网络失败，尝试从缓存获取
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            this.cacheStats.hits++;
            console.log('从缓存提供音频:', request.url);
            return cachedResponse;
        }
        
        this.cacheStats.misses++;
        throw new Error('音频文件不可用（网络和缓存均失败）');
    }
    
    async handleDynamicRequest(request) {
        // Stale While Revalidate 策略：返回缓存，同时后台更新
        const cache = await caches.open(CACHE_NAMES.DYNAMIC);
        const cachedResponse = await cache.match(request);
        
        // 后台更新缓存
        const updateCache = async () => {
            try {
                const networkResponse = await fetch(request);
                
                if (networkResponse.ok) {
                    const headers = new Headers(networkResponse.headers);
                    headers.set('sw-cache-time', Date.now().toString());
                    
                    const responseToCache = new Response(networkResponse.body, {
                        status: networkResponse.status,
                        statusText: networkResponse.statusText,
                        headers: headers
                    });
                    
                    await cache.put(request, responseToCache);
                    this.cacheStats.updates++;
                }
            } catch (error) {
                console.warn('后台更新失败:', error);
            }
        };
        
        if (cachedResponse) {
            // 检查缓存是否需要更新
            if (!await this.isCacheValid(cachedResponse, CACHE_CONFIG.DYNAMIC.maxAge)) {
                updateCache(); // 后台更新
            }
            
            this.cacheStats.hits++;
            return cachedResponse;
        }
        
        // 没有缓存，直接从网络获取
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // 缓存响应
                const responseToCache = networkResponse.clone();
                updateCache();
            }
            
            return networkResponse;
            
        } catch (error) {
            this.cacheStats.misses++;
            
            // 返回离线页面
            return await this.getOfflinePage(request);
        }
    }
    
    async handleDefaultRequest(request) {
        // 默认处理：尝试网络，失败则返回缓存
        try {
            return await fetch(request);
        } catch (error) {
            // 尝试从任何缓存中查找
            const cacheNames = await caches.keys();
            
            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const cachedResponse = await cache.match(request);
                
                if (cachedResponse) {
                    console.log('从fallback缓存提供:', request.url);
                    return cachedResponse;
                }
            }
            
            throw error;
        }
    }
    
    // ==================== 辅助方法 ====================
    
    async fetchWithTimeout(request, timeout) {
        return Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('网络请求超时')), timeout)
            )
        ]);
    }
    
    async cacheAudioResponse(cache, request, response) {
        // Range 请求通常返回 206，Cache API 无法稳定缓存部分响应
        if (request.headers.has('range') || response.status === 206) {
            return;
        }

        // 只缓存完整成功响应
        if (response.status !== 200) {
            return;
        }

        // 检查缓存大小限制
        await this.enforceAudioCacheLimit(cache);
        
        // 添加缓存头部
        const headers = new Headers(response.headers);
        headers.set('sw-cache-time', Date.now().toString());
        headers.set('sw-cache-type', 'audio');
        
        const cachedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
        
        try {
            await cache.put(request, cachedResponse);
        } catch (error) {
            console.warn('音频缓存写入失败，已跳过:', request.url, error);
        }
    }
    
    async enforceAudioCacheLimit(cache) {
        const maxEntries = CACHE_CONFIG.AUDIO.maxEntries;
        const requests = await cache.keys();
        
        if (requests.length >= maxEntries) {
            // 删除最旧的条目
            const entriesToDelete = requests.length - maxEntries + 1;
            
            for (let i = 0; i < entriesToDelete; i++) {
                await cache.delete(requests[i]);
                this.cacheStats.deletions++;
            }
        }
    }
    
    async isCacheValid(response, maxAge) {
        if (!response) return false;
        
        const cacheTime = response.headers.get('sw-cache-time');
        if (!cacheTime) return true; // 没有时间戳，认为有效
        
        const age = Date.now() - parseInt(cacheTime);
        return age < maxAge;
    }
    
    async getOfflinePage(request) {
        const offlineCache = await caches.open(CACHE_NAMES.OFFLINE);
        const offlinePage = await offlineCache.match('/offline.html');
        
        if (offlinePage) {
            return offlinePage;
        }
        
        // 如果离线页面也没有，返回简单的错误页面
        return new Response(
            '<h1>页面不可用</h1><p>请检查网络连接</p>',
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
    
    async handleRequestError(request, error) {
        console.error('请求处理错误:', request.url, error);
        
        // 根据请求类型返回适当的错误响应
        const url = new URL(request.url);
        
        if (url.pathname.endsWith('.html') || url.pathname === '/') {
            return await this.getOfflinePage(request);
        }
        
        if (ROUTE_PATTERNS.AUDIO.some(pattern => pattern.test(url.pathname))) {
            return new Response('音频文件不可用', { 
                status: 503,
                statusText: 'Service Unavailable' 
            });
        }
        
        return new Response('资源不可用', { 
            status: 503,
            statusText: 'Service Unavailable' 
        });
    }
    
    // ==================== 消息处理 ====================
    
    async handleMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'GET_CACHE_STATS':
                event.ports[0].postMessage({
                    type: 'CACHE_STATS',
                    data: await this.getCacheStats()
                });
                break;
                
            case 'CLEAR_CACHE':
                await this.clearSpecificCache(data.cacheName);
                event.ports[0].postMessage({
                    type: 'CACHE_CLEARED',
                    data: { success: true }
                });
                break;
                
            case 'PRELOAD_AUDIO':
                await this.preloadAudioFiles(data.urls);
                event.ports[0].postMessage({
                    type: 'AUDIO_PRELOADED',
                    data: { success: true }
                });
                break;
                
            case 'UPDATE_SW':
                self.skipWaiting();
                break;
                
            default:
                console.warn('未知消息类型:', type);
        }
    }
    
    async getCacheStats() {
        const cacheNames = await caches.keys();
        const stats = { ...this.cacheStats };
        
        // 计算缓存大小
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            stats[`${cacheName}_entries`] = requests.length;
        }
        
        stats.version = SW_VERSION;
        stats.isOnline = this.isOnline;
        stats.lastUpdate = Date.now();
        
        return stats;
    }
    
    async clearSpecificCache(cacheName) {
        if (cacheName && Object.values(CACHE_NAMES).includes(cacheName)) {
            await caches.delete(cacheName);
            console.log(`缓存已清理: ${cacheName}`);
        }
    }
    
    async preloadAudioFiles(urls) {
        const cache = await caches.open(CACHE_NAMES.AUDIO);

        const uniqueUrls = [...new Set((urls || []).filter(Boolean))];

        for (const url of uniqueUrls) {
            try {
                const request = new Request(url);

                // 已缓存则跳过
                const cached = await cache.match(request);
                if (cached) {
                    continue;
                }

                const response = await fetch(url);
                if (response.ok) {
                    await this.cacheAudioResponse(cache, request, response.clone());
                }
            } catch (error) {
                console.warn(`音频预加载失败: ${url}`, error);
            }

            // 串行节流，避免并发音频请求过多导致 503
            await this.sleep(AUDIO_PRELOAD_DELAY);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==================== 后台同步 ====================
    
    async handleBackgroundSync(event) {
        if (event.tag === 'cache-cleanup') {
            event.waitUntil(this.performCacheCleanup());
        } else if (event.tag === 'update-audio-cache') {
            event.waitUntil(this.updateAudioCache());
        }
    }
    
    async performCacheCleanup() {
        console.log('🧹 执行缓存清理...');
        
        // 清理过期的动态缓存
        const dynamicCache = await caches.open(CACHE_NAMES.DYNAMIC);
        const dynamicRequests = await dynamicCache.keys();
        
        for (const request of dynamicRequests) {
            const response = await dynamicCache.match(request);
            if (!await this.isCacheValid(response, CACHE_CONFIG.DYNAMIC.maxAge)) {
                await dynamicCache.delete(request);
                this.cacheStats.deletions++;
            }
        }
        
        // 保存缓存统计到 IndexedDB
        await this.saveCacheStatsToDB();
    }
    
    async updateAudioCache() {
        console.log('🎵 更新音频缓存...');
        
        // 这里可以实现音频缓存的智能更新逻辑
        // 例如：更新频繁访问的音频文件
    }
    
    // ==================== IndexedDB 操作 ====================
    
    async saveCacheStatsToDB() {
        // 这里可以实现将缓存统计保存到 IndexedDB 的逻辑
        try {
            // 简化实现：使用 localStorage（在 SW 中不可用，需要使用 IndexedDB）
            console.log('保存缓存统计:', this.cacheStats);
        } catch (error) {
            console.warn('缓存统计保存失败:', error);
        }
    }
    
    async loadCacheStatsFromDB() {
        // 这里可以实现从 IndexedDB 恢复缓存统计的逻辑
        try {
            // 简化实现
            return null;
        } catch (error) {
            console.warn('缓存统计恢复失败:', error);
            return null;
        }
    }
}

// ==================== 初始化 Service Worker ====================

// 创建 Service Worker 实例
const swInstance = new IELTSServiceWorker();

// 导出供测试使用
self.swInstance = swInstance;
