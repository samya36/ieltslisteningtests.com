/**
 * 现代化音频管理器
 * 支持分块加载、渐进播放、网络自适应音质选择
 * 
 * 特性：
 * - 256KB分块渐进加载
 * - HTTP Range请求支持
 * - 边下载边播放
 * - 网络速度自适应
 * - 音频预缓存和优先级管理
 */

class ModernAudioManager {
    constructor() {
        this.audioCache = new Map();
        this.preloadQueue = new Set();
        this.loadingPromises = new Map();
        this.chunkSize = 256 * 1024; // 256KB分块
        this.maxConcurrentLoads = 3;
        this.currentLoads = 0;
        
        // 音频质量配置
        this.qualityConfig = {
            high: { bitrate: '192k', suffix: '_192k' },
            standard: { bitrate: '128k', suffix: '_128k' },
            low: { bitrate: '96k', suffix: '_96k' },
            ultra_low: { bitrate: '64k', suffix: '_64k' }
        };
        
        // 网络检测器
        this.networkDetector = new NetworkSpeedDetector();
        this.currentQuality = 'standard';
        
        // 音频上下文（用于更好的音频处理）
        this.audioContext = null;
        this.initializeAudioContext();
        
        // 性能监控
        this.performanceMetrics = {
            totalBytesLoaded: 0,
            totalLoadTime: 0,
            averageLoadSpeed: 0,
            bufferingEvents: 0
        };
        
        console.log('🎵 ModernAudioManager 初始化完成');
    }
    
    /**
     * 初始化音频上下文
     */
    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 处理iOS Safari的音频上下文限制
            if (this.audioContext.state === 'suspended') {
                document.addEventListener('touchstart', this.resumeAudioContext.bind(this), { once: true });
                document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
            }
        } catch (error) {
            console.warn('音频上下文初始化失败，将使用基础音频功能:', error);
        }
    }
    
    /**
     * 恢复音频上下文（iOS兼容性）
     */
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            console.log('音频上下文已恢复');
        }
    }
    
    /**
     * 加载音频（主要接口）
     * @param {string} url - 音频URL
     * @param {string} priority - 优先级：'high', 'normal', 'low'
     * @param {Function} onProgress - 进度回调
     * @returns {Promise<EnhancedAudio>}
     */
    async loadAudio(url, priority = 'normal', onProgress = null) {
        const cacheKey = this.getCacheKey(url);
        
        // 检查缓存
        if (this.audioCache.has(cacheKey)) {
            console.log(`🔄 从缓存加载音频: ${url}`);
            return this.audioCache.get(cacheKey);
        }
        
        // 检查是否正在加载
        if (this.loadingPromises.has(cacheKey)) {
            console.log(`⏳ 音频加载中，等待完成: ${url}`);
            return this.loadingPromises.get(cacheKey);
        }
        
        // 开始新的加载
        const loadPromise = this.performProgressiveLoad(url, priority, onProgress);
        this.loadingPromises.set(cacheKey, loadPromise);
        
        try {
            const audioData = await loadPromise;
            this.audioCache.set(cacheKey, audioData);
            return audioData;
        } finally {
            this.loadingPromises.delete(cacheKey);
        }
    }
    
    /**
     * 执行渐进式加载
     */
    async performProgressiveLoad(url, priority, onProgress) {
        const startTime = performance.now();
        console.log(`🚀 开始渐进加载音频: ${url}`);
        
        // 等待加载槽位
        await this.waitForLoadSlot(priority);
        this.currentLoads++;
        
        try {
            // 获取网络自适应的URL
            const adaptiveUrl = await this.getAdaptiveAudioUrl(url);
            
            // 创建增强音频对象
            const enhancedAudio = new EnhancedAudio(adaptiveUrl, this.audioContext);
            
            // 执行分块加载
            await this.loadAudioInChunks(enhancedAudio, onProgress);
            
            // 记录性能指标
            const loadTime = performance.now() - startTime;
            this.updatePerformanceMetrics(enhancedAudio.totalBytes, loadTime);
            
            console.log(`✅ 音频加载完成: ${url} (${loadTime.toFixed(0)}ms)`);
            return enhancedAudio;
            
        } finally {
            this.currentLoads--;
        }
    }
    
    /**
     * 分块加载音频
     */
    async loadAudioInChunks(enhancedAudio, onProgress) {
        // 首先获取音频文件信息
        const headResponse = await fetch(enhancedAudio.url, { method: 'HEAD' });
        const contentLength = parseInt(headResponse.headers.get('content-length'));
        const supportsRangeRequests = headResponse.headers.get('accept-ranges') === 'bytes';
        
        enhancedAudio.totalBytes = contentLength;
        
        if (!supportsRangeRequests || contentLength <= this.chunkSize) {
            // 服务器不支持Range请求或文件较小，直接加载
            return this.loadAudioDirectly(enhancedAudio, onProgress);
        }
        
        console.log(`📦 开始分块加载 (${Math.ceil(contentLength / this.chunkSize)} 块)`);
        
        // 创建ArrayBuffer存储完整音频数据
        const audioBuffer = new ArrayBuffer(contentLength);
        const audioView = new Uint8Array(audioBuffer);
        let loadedBytes = 0;
        
        // 分块下载策略
        const chunks = this.calculateChunkStrategy(contentLength);
        
        for (const chunk of chunks) {
            const chunkData = await this.downloadChunk(enhancedAudio.url, chunk.start, chunk.end);
            audioView.set(new Uint8Array(chunkData), chunk.start);
            loadedBytes += chunkData.byteLength;
            
            // 更新进度
            const progress = {
                loaded: loadedBytes,
                total: contentLength,
                percentage: (loadedBytes / contentLength) * 100
            };
            
            onProgress?.(progress);
            enhancedAudio.updateLoadProgress(progress);
            
            // 当加载足够数据时，可以开始准备播放
            if (loadedBytes >= this.chunkSize * 2 && !enhancedAudio.isReadyForPlayback) {
                this.prepareForPlayback(enhancedAudio, audioBuffer.slice(0, loadedBytes));
            }
        }
        
        // 设置完整的音频数据
        enhancedAudio.setAudioData(audioBuffer);
        console.log(`✅ 分块加载完成，总计 ${loadedBytes} 字节`);
    }
    
    /**
     * 计算分块策略
     */
    calculateChunkStrategy(totalSize) {
        const chunks = [];
        const priorityChunkSize = this.chunkSize; // 前几块用于快速开始播放
        const regularChunkSize = this.chunkSize * 2; // 后续块可以更大
        
        let currentPos = 0;
        let chunkIndex = 0;
        
        while (currentPos < totalSize) {
            const isHighPriority = chunkIndex < 3; // 前3块高优先级
            const chunkSize = isHighPriority ? priorityChunkSize : regularChunkSize;
            const end = Math.min(currentPos + chunkSize - 1, totalSize - 1);
            
            chunks.push({
                start: currentPos,
                end: end,
                size: end - currentPos + 1,
                priority: isHighPriority ? 'high' : 'normal'
            });
            
            currentPos = end + 1;
            chunkIndex++;
        }
        
        return chunks;
    }
    
    /**
     * 下载单个数据块
     */
    async downloadChunk(url, start, end) {
        const headers = {
            'Range': `bytes=${start}-${end}`
        };
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`分块下载失败: ${response.status} ${response.statusText}`);
        }
        
        return response.arrayBuffer();
    }
    
    /**
     * 直接加载音频（fallback方法）
     */
    async loadAudioDirectly(enhancedAudio, onProgress) {
        console.log('📱 使用直接加载模式');
        
        const response = await fetch(enhancedAudio.url);
        const reader = response.body.getReader();
        const contentLength = parseInt(response.headers.get('content-length'));
        
        enhancedAudio.totalBytes = contentLength;
        const chunks = [];
        let loadedBytes = 0;
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            loadedBytes += value.length;
            
            const progress = {
                loaded: loadedBytes,
                total: contentLength,
                percentage: (loadedBytes / contentLength) * 100
            };
            
            onProgress?.(progress);
            enhancedAudio.updateLoadProgress(progress);
            
            // 当有足够数据时准备播放
            if (loadedBytes >= this.chunkSize && !enhancedAudio.isReadyForPlayback) {
                const partialBuffer = this.combineChunks(chunks);
                this.prepareForPlayback(enhancedAudio, partialBuffer);
            }
        }
        
        // 合并所有数据块
        const audioBuffer = this.combineChunks(chunks);
        enhancedAudio.setAudioData(audioBuffer);
    }
    
    /**
     * 合并数据块
     */
    combineChunks(chunks) {
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result.buffer;
    }
    
    /**
     * 准备播放（当有足够数据时）
     */
    prepareForPlayback(enhancedAudio, partialData) {
        try {
            // 创建临时Blob URL用于开始播放
            const blob = new Blob([partialData], { type: 'audio/mpeg' });
            const tempUrl = URL.createObjectURL(blob);
            
            enhancedAudio.prepareForPlayback(tempUrl);
            console.log('🎵 音频已准备播放（部分数据）');
            
        } catch (error) {
            console.warn('准备播放失败:', error);
        }
    }
    
    /**
     * 获取网络自适应的音频URL
     */
    async getAdaptiveAudioUrl(originalUrl) {
        // 检测当前网络速度
        const networkSpeed = await this.networkDetector.getCurrentSpeed();
        const quality = this.selectOptimalQuality(networkSpeed);
        
        if (quality !== this.currentQuality) {
            this.currentQuality = quality;
            console.log(`📡 网络自适应：切换到 ${quality} 质量`);
        }
        
        // 生成对应质量的URL
        return this.generateQualityUrl(originalUrl, quality);
    }
    
    /**
     * 选择最优音质
     */
    selectOptimalQuality(networkInfo) {
        const { effectiveType, downlink, rtt } = networkInfo;
        
        // 基于网络类型和速度选择质量
        if (effectiveType === '4g' && downlink > 10) {
            return 'high';
        } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 2)) {
            return 'standard';
        } else if (effectiveType === '3g') {
            return 'low';
        } else {
            return 'ultra_low';
        }
    }
    
    /**
     * 生成质量对应的URL
     */
    generateQualityUrl(originalUrl, quality) {
        const config = this.qualityConfig[quality];
        if (!config) return originalUrl;
        
        // 将原始URL转换为对应质量的URL
        // 例: audio/test1/section1.mp3 -> audio/test1/section1_128k.mp3
        const pathParts = originalUrl.split('/');
        const filename = pathParts.pop();
        const [name, ext] = filename.split('.');
        
        const qualityFilename = `${name}${config.suffix}.${ext}`;
        pathParts.push(qualityFilename);
        
        const qualityUrl = pathParts.join('/');
        
        // 检查质量版本是否存在，不存在则使用原始URL
        return this.checkUrlExists(qualityUrl) ? qualityUrl : originalUrl;
    }
    
    /**
     * 检查URL是否存在
     */
    async checkUrlExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    /**
     * 等待加载槽位
     */
    async waitForLoadSlot(priority) {
        if (this.currentLoads < this.maxConcurrentLoads) {
            return;
        }
        
        // 高优先级请求可以稍微超过限制
        if (priority === 'high' && this.currentLoads < this.maxConcurrentLoads + 1) {
            return;
        }
        
        // 等待有空闲槽位
        return new Promise(resolve => {
            const checkSlot = () => {
                if (this.currentLoads < this.maxConcurrentLoads) {
                    resolve();
                } else {
                    setTimeout(checkSlot, 100);
                }
            };
            checkSlot();
        });
    }
    
    /**
     * 获取缓存键
     */
    getCacheKey(url) {
        return `${url}_${this.currentQuality}`;
    }
    
    /**
     * 预加载音频
     */
    async preloadAudio(urls, priority = 'low') {
        console.log(`🔄 开始预加载 ${urls.length} 个音频文件`);
        
        const preloadPromises = urls.map(url => 
            this.loadAudio(url, priority).catch(error => {
                console.warn(`预加载失败: ${url}`, error);
                return null;
            })
        );
        
        const results = await Promise.allSettled(preloadPromises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
        
        console.log(`✅ 预加载完成: ${successful}/${urls.length}`);
        return results;
    }
    
    /**
     * 清理缓存
     */
    clearCache() {
        this.audioCache.forEach(audio => {
            if (audio.cleanup) {
                audio.cleanup();
            }
        });
        this.audioCache.clear();
        console.log('🗑️ 音频缓存已清理');
    }
    
    /**
     * 更新性能指标
     */
    updatePerformanceMetrics(bytes, loadTime) {
        this.performanceMetrics.totalBytesLoaded += bytes;
        this.performanceMetrics.totalLoadTime += loadTime;
        this.performanceMetrics.averageLoadSpeed = 
            this.performanceMetrics.totalBytesLoaded / (this.performanceMetrics.totalLoadTime / 1000);
    }
    
    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        const { totalBytesLoaded, totalLoadTime, averageLoadSpeed, bufferingEvents } = this.performanceMetrics;
        
        return {
            totalBytesLoaded: (totalBytesLoaded / 1024 / 1024).toFixed(2) + ' MB',
            totalLoadTime: (totalLoadTime / 1000).toFixed(2) + 's',
            averageLoadSpeed: (averageLoadSpeed / 1024).toFixed(2) + ' KB/s',
            bufferingEvents,
            cacheHitRate: ((this.audioCache.size / (this.audioCache.size + this.loadingPromises.size)) * 100).toFixed(1) + '%'
        };
    }
}

// 全局实例
window.modernAudioManager = new ModernAudioManager();