/**
 * 音频渐进加载器
 * 专门处理大音频文件的分块下载和流式播放
 */

class ProgressiveAudioLoader {
    constructor(options = {}) {
        this.chunkSize = options.chunkSize || 256 * 1024; // 256KB
        this.maxConcurrentChunks = options.maxConcurrentChunks || 3;
        this.preloadChunks = options.preloadChunks || 2; // 预加载块数
        
        // 加载队列管理
        this.activeLoads = new Map();
        this.downloadQueue = [];
        this.currentConcurrent = 0;
        
        // 缓存管理
        this.chunkCache = new Map();
        this.maxCacheSize = options.maxCacheSize || 50 * 1024 * 1024; // 50MB
        this.currentCacheSize = 0;
        
        // 重试配置
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        console.log('📦 ProgressiveAudioLoader 初始化完成');
    }
    
    /**
     * 渐进加载音频
     */
    async loadAudioProgressively(url, options = {}) {
        const {
            onProgress = null,
            onChunkLoaded = null,
            onReadyToPlay = null,
            priority = 'normal'
        } = options;
        
        console.log(`🚀 开始渐进加载: ${url}`);
        
        try {
            // 获取文件信息
            const fileInfo = await this.getFileInfo(url);
            console.log(`📄 文件信息:`, fileInfo);
            
            // 创建音频对象
            const audioData = {
                url,
                fileInfo,
                chunks: new Map(),
                loadedBytes: 0,
                isReadyForPlayback: false,
                audioElement: null
            };
            
            // 如果不支持Range请求或文件较小，直接下载
            if (!fileInfo.supportsRangeRequests || fileInfo.size <= this.chunkSize * 2) {
                return this.loadDirectly(audioData, onProgress);
            }
            
            // 计算分块策略
            const chunks = this.calculateChunkStrategy(fileInfo.size);
            console.log(`📊 分块策略: ${chunks.length} 个块`);
            
            // 开始分块下载
            await this.downloadChunksProgressively(audioData, chunks, {
                onProgress,
                onChunkLoaded,
                onReadyToPlay
            });
            
            return audioData;
            
        } catch (error) {
            console.error('渐进加载失败:', error);
            throw error;
        }
    }
    
    /**
     * 获取文件信息
     */
    async getFileInfo(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentLength = parseInt(response.headers.get('content-length') || '0');
            const supportsRangeRequests = response.headers.get('accept-ranges') === 'bytes';
            const contentType = response.headers.get('content-type') || 'audio/mpeg';
            const lastModified = response.headers.get('last-modified');
            const etag = response.headers.get('etag');
            
            return {
                size: contentLength,
                supportsRangeRequests,
                contentType,
                lastModified,
                etag
            };
            
        } catch (error) {
            console.warn('获取文件信息失败，尝试直接下载:', error);
            
            // Fallback: 尝试部分请求来检测支持
            try {
                const testResponse = await fetch(url, {
                    headers: { 'Range': 'bytes=0-1023' }
                });
                
                return {
                    size: 0, // 未知大小
                    supportsRangeRequests: testResponse.status === 206,
                    contentType: testResponse.headers.get('content-type') || 'audio/mpeg',
                    lastModified: null,
                    etag: null
                };
            } catch {
                return {
                    size: 0,
                    supportsRangeRequests: false,
                    contentType: 'audio/mpeg',
                    lastModified: null,
                    etag: null
                };
            }
        }
    }
    
    /**
     * 计算分块策略
     */
    calculateChunkStrategy(totalSize) {
        const chunks = [];
        let currentPos = 0;
        let chunkIndex = 0;
        
        while (currentPos < totalSize) {
            // 前几块使用较小的块大小以便快速开始播放
            const isHighPriority = chunkIndex < 3;
            const currentChunkSize = isHighPriority ? 
                Math.min(this.chunkSize, 128 * 1024) : // 前3块使用128KB
                this.chunkSize; // 后续块使用标准大小
                
            const end = Math.min(currentPos + currentChunkSize - 1, totalSize - 1);
            
            chunks.push({
                index: chunkIndex,
                start: currentPos,
                end: end,
                size: end - currentPos + 1,
                priority: isHighPriority ? 'high' : 'normal',
                isLoaded: false,
                data: null,
                retryCount: 0
            });
            
            currentPos = end + 1;
            chunkIndex++;
        }
        
        return chunks;
    }
    
    /**
     * 渐进下载分块
     */
    async downloadChunksProgressively(audioData, chunks, callbacks) {
        const { onProgress, onChunkLoaded, onReadyToPlay } = callbacks;
        
        // 按优先级排序
        const sortedChunks = chunks.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            return a.index - b.index;
        });
        
        // 开始下载队列
        const downloadPromises = [];
        
        for (const chunk of sortedChunks) {
            const downloadPromise = this.downloadChunkWithQueue(audioData.url, chunk)
                .then(chunkData => {
                    chunk.data = chunkData;
                    chunk.isLoaded = true;
                    audioData.chunks.set(chunk.index, chunk);
                    audioData.loadedBytes += chunkData.byteLength;
                    
                    // 触发块加载回调
                    onChunkLoaded?.(chunk, audioData);
                    
                    // 更新总体进度
                    const progress = {
                        loaded: audioData.loadedBytes,
                        total: audioData.fileInfo.size,
                        percentage: (audioData.loadedBytes / audioData.fileInfo.size) * 100,
                        chunksLoaded: audioData.chunks.size,
                        totalChunks: chunks.length
                    };
                    
                    onProgress?.(progress);
                    
                    // 检查是否可以开始播放
                    if (!audioData.isReadyForPlayback && this.canStartPlayback(audioData, chunks)) {
                        audioData.isReadyForPlayback = true;
                        this.prepareAudioForPlayback(audioData);
                        onReadyToPlay?.(audioData);
                    }
                    
                    return chunk;
                })
                .catch(error => {
                    console.error(`块 ${chunk.index} 下载失败:`, error);
                    chunk.error = error;
                    return chunk;
                });
                
            downloadPromises.push(downloadPromise);
        }
        
        // 等待所有块下载完成
        await Promise.allSettled(downloadPromises);
        
        // 验证下载完整性
        this.validateDownloadIntegrity(audioData, chunks);
        
        // 组装完整音频
        const completeAudioData = this.assembleAudioData(audioData, chunks);
        audioData.completeData = completeAudioData;
        
        console.log(`✅ 渐进下载完成: ${audioData.loadedBytes} 字节`);
    }
    
    /**
     * 带队列的分块下载
     */
    async downloadChunkWithQueue(url, chunk) {
        return new Promise((resolve, reject) => {
            const downloadTask = {
                url,
                chunk,
                resolve,
                reject,
                priority: chunk.priority
            };
            
            this.downloadQueue.push(downloadTask);
            this.processDownloadQueue();
        });
    }
    
    /**
     * 处理下载队列
     */
    async processDownloadQueue() {
        if (this.currentConcurrent >= this.maxConcurrentChunks || this.downloadQueue.length === 0) {
            return;
        }
        
        // 按优先级排序队列
        this.downloadQueue.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            return 0;
        });
        
        const task = this.downloadQueue.shift();
        this.currentConcurrent++;
        
        try {
            const data = await this.downloadSingleChunk(task.url, task.chunk);
            task.resolve(data);
        } catch (error) {
            // 重试逻辑
            if (task.chunk.retryCount < this.maxRetries) {
                task.chunk.retryCount++;
                console.log(`重试下载块 ${task.chunk.index} (${task.chunk.retryCount}/${this.maxRetries})`);
                
                // 延迟后重新加入队列
                setTimeout(() => {
                    this.downloadQueue.unshift(task);
                    this.processDownloadQueue();
                }, this.retryDelay * task.chunk.retryCount);
            } else {
                task.reject(error);
            }
        } finally {
            this.currentConcurrent--;
            // 继续处理队列
            this.processDownloadQueue();
        }
    }
    
    /**
     * 下载单个分块
     */
    async downloadSingleChunk(url, chunk) {
        const cacheKey = `${url}_${chunk.start}_${chunk.end}`;
        
        // 检查缓存
        if (this.chunkCache.has(cacheKey)) {
            console.log(`📋 从缓存获取块 ${chunk.index}`);
            return this.chunkCache.get(cacheKey);
        }
        
        const headers = {
            'Range': `bytes=${chunk.start}-${chunk.end}`
        };
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // 验证块大小
        const expectedSize = chunk.end - chunk.start + 1;
        if (arrayBuffer.byteLength !== expectedSize) {
            console.warn(`块 ${chunk.index} 大小不匹配: 期望 ${expectedSize}, 实际 ${arrayBuffer.byteLength}`);
        }
        
        // 添加到缓存
        this.addToCache(cacheKey, arrayBuffer);
        
        console.log(`📥 块 ${chunk.index} 下载完成: ${arrayBuffer.byteLength} 字节`);
        return arrayBuffer;
    }
    
    /**
     * 添加到缓存
     */
    addToCache(key, data) {
        // 检查缓存大小限制
        while (this.currentCacheSize + data.byteLength > this.maxCacheSize && this.chunkCache.size > 0) {
            // 移除最旧的缓存项
            const firstKey = this.chunkCache.keys().next().value;
            const removedData = this.chunkCache.get(firstKey);
            this.chunkCache.delete(firstKey);
            this.currentCacheSize -= removedData.byteLength;
        }
        
        this.chunkCache.set(key, data);
        this.currentCacheSize += data.byteLength;
    }
    
    /**
     * 检查是否可以开始播放
     */
    canStartPlayback(audioData, chunks) {
        // 需要前几个块已加载
        const requiredChunks = Math.min(this.preloadChunks, chunks.length);
        
        for (let i = 0; i < requiredChunks; i++) {
            if (!audioData.chunks.has(i)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 准备音频播放
     */
    prepareAudioForPlayback(audioData) {
        try {
            // 组装已加载的块
            const availableChunks = Array.from(audioData.chunks.values())
                .sort((a, b) => a.index - b.index)
                .map(chunk => chunk.data);
                
            if (availableChunks.length === 0) return;
            
            // 合并数据
            const partialData = this.combineArrayBuffers(availableChunks);
            
            // 创建Blob URL
            const blob = new Blob([partialData], { type: audioData.fileInfo.contentType });
            const blobUrl = URL.createObjectURL(blob);
            
            // 创建音频元素
            audioData.audioElement = new Audio();
            audioData.audioElement.src = blobUrl;
            audioData.audioElement.preload = 'metadata';
            
            console.log(`🎵 音频已准备播放: ${partialData.byteLength} 字节`);
            
        } catch (error) {
            console.error('准备播放失败:', error);
        }
    }
    
    /**
     * 验证下载完整性
     */
    validateDownloadIntegrity(audioData, chunks) {
        const loadedChunks = chunks.filter(chunk => chunk.isLoaded);
        const failedChunks = chunks.filter(chunk => chunk.error);
        
        console.log(`📊 下载完整性检查:`);
        console.log(`  - 成功: ${loadedChunks.length}/${chunks.length} 块`);
        console.log(`  - 失败: ${failedChunks.length} 块`);
        console.log(`  - 总大小: ${audioData.loadedBytes} 字节`);
        
        if (failedChunks.length > 0) {
            console.warn('部分块下载失败:', failedChunks.map(c => c.index));
        }
    }
    
    /**
     * 组装音频数据
     */
    assembleAudioData(audioData, chunks) {
        const sortedChunks = Array.from(audioData.chunks.values())
            .sort((a, b) => a.index - b.index);
            
        const chunkBuffers = sortedChunks.map(chunk => chunk.data);
        return this.combineArrayBuffers(chunkBuffers);
    }
    
    /**
     * 合并ArrayBuffers
     */
    combineArrayBuffers(buffers) {
        const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
        const result = new Uint8Array(totalLength);
        
        let offset = 0;
        for (const buffer of buffers) {
            result.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }
        
        return result.buffer;
    }
    
    /**
     * 直接加载（fallback）
     */
    async loadDirectly(audioData, onProgress) {
        console.log('🔄 使用直接加载模式');
        
        const response = await fetch(audioData.url);
        const reader = response.body.getReader();
        const contentLength = parseInt(response.headers.get('content-length') || '0');
        
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
                percentage: contentLength > 0 ? (loadedBytes / contentLength) * 100 : 0
            };
            
            onProgress?.(progress);
            
            // 当有足够数据时准备播放
            if (loadedBytes >= this.chunkSize && !audioData.isReadyForPlayback) {
                audioData.isReadyForPlayback = true;
                const partialData = this.combineArrayBuffers(chunks.map(c => c.buffer));
                
                const blob = new Blob([partialData], { type: audioData.fileInfo.contentType });
                const blobUrl = URL.createObjectURL(blob);
                
                audioData.audioElement = new Audio(blobUrl);
            }
        }
        
        // 组装完整数据
        audioData.completeData = this.combineArrayBuffers(chunks.map(c => c.buffer));
        audioData.loadedBytes = loadedBytes;
        
        return audioData;
    }
    
    /**
     * 清理缓存
     */
    clearCache() {
        this.chunkCache.clear();
        this.currentCacheSize = 0;
        console.log('🗑️ 分块缓存已清理');
    }
    
    /**
     * 获取缓存统计
     */
    getCacheStats() {
        return {
            cacheSize: this.currentCacheSize,
            maxCacheSize: this.maxCacheSize,
            cachedChunks: this.chunkCache.size,
            cacheUsage: ((this.currentCacheSize / this.maxCacheSize) * 100).toFixed(1) + '%'
        };
    }
    
    /**
     * 获取加载器状态
     */
    getLoaderStatus() {
        return {
            activeLoads: this.activeLoads.size,
            queueLength: this.downloadQueue.length,
            currentConcurrent: this.currentConcurrent,
            maxConcurrent: this.maxConcurrentChunks,
            cache: this.getCacheStats()
        };
    }
}

// 全局实例
window.progressiveAudioLoader = new ProgressiveAudioLoader();