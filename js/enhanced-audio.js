/**
 * 增强音频对象
 * 支持分块加载、渐进播放、缓冲管理和高级音频控制
 */

class EnhancedAudio extends EventTarget {
    constructor(url, audioContext = null) {
        super();
        
        this.url = url;
        this.audioContext = audioContext;
        this.audioElement = null;
        this.audioBuffer = null;
        this.audioData = null;
        
        // 加载状态
        this.isLoading = false;
        this.isLoaded = false;
        this.isReadyForPlayback = false;
        this.loadProgress = { loaded: 0, total: 0, percentage: 0 };
        this.totalBytes = 0;
        
        // 播放状态
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1.0;
        this.playbackRate = 1.0;
        
        // 缓冲管理
        this.bufferedRanges = [];
        this.bufferHealth = 0; // 缓冲健康度 (0-100)
        this.minBufferSize = 256 * 1024; // 最小缓冲大小
        
        // 性能监控
        this.metrics = {
            loadStartTime: 0,
            firstByteTime: 0,
            playableTime: 0,
            bufferingEvents: 0,
            stallingTime: 0
        };
        
        // 错误处理
        this.lastError = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.initializeAudio();
    }
    
    /**
     * 初始化音频元素
     */
    initializeAudio() {
        this.audioElement = new Audio();
        this.audioElement.preload = 'none';
        this.audioElement.crossOrigin = 'anonymous';
        
        // 绑定事件
        this.bindAudioEvents();
        
        this.metrics.loadStartTime = performance.now();
        this.isLoading = true;
        
        this.dispatchEvent(new CustomEvent('loadstart'));
    }
    
    /**
     * 绑定音频元素事件
     */
    bindAudioEvents() {
        const events = [
            'loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough',
            'play', 'pause', 'ended', 'timeupdate', 'progress', 'waiting', 'playing',
            'stalled', 'suspend', 'abort', 'error', 'emptied', 'seeked', 'seeking'
        ];
        
        events.forEach(eventType => {
            this.audioElement.addEventListener(eventType, (event) => {
                this.handleAudioEvent(eventType, event);
            });
        });
    }
    
    /**
     * 处理音频事件
     */
    handleAudioEvent(eventType, event) {
        switch (eventType) {
            case 'loadedmetadata':
                this.duration = this.audioElement.duration;
                this.metrics.firstByteTime = performance.now();
                this.dispatchEvent(new CustomEvent('metadataloaded', { 
                    detail: { duration: this.duration } 
                }));
                break;
                
            case 'canplay':
                if (!this.isReadyForPlayback) {
                    this.isReadyForPlayback = true;
                    this.metrics.playableTime = performance.now();
                    this.dispatchEvent(new CustomEvent('readytoplay'));
                }
                break;
                
            case 'canplaythrough':
                this.isLoaded = true;
                this.isLoading = false;
                this.dispatchEvent(new CustomEvent('fullyloaded'));
                break;
                
            case 'play':
                this.isPlaying = true;
                this.isPaused = false;
                break;
                
            case 'pause':
                this.isPlaying = false;
                this.isPaused = true;
                break;
                
            case 'ended':
                this.isPlaying = false;
                this.isPaused = false;
                break;
                
            case 'timeupdate':
                this.currentTime = this.audioElement.currentTime;
                this.updateBufferHealth();
                break;
                
            case 'progress':
                this.updateBufferedRanges();
                break;
                
            case 'waiting':
                this.metrics.bufferingEvents++;
                this.dispatchEvent(new CustomEvent('buffering'));
                break;
                
            case 'playing':
                this.dispatchEvent(new CustomEvent('bufferingend'));
                break;
                
            case 'error':
                this.handleAudioError(event);
                break;
        }
        
        // 转发所有事件
        this.dispatchEvent(new CustomEvent(eventType, { detail: event }));
    }
    
    /**
     * 处理音频错误
     */
    handleAudioError(event) {
        const error = this.audioElement.error;
        this.lastError = {
            code: error ? error.code : 0,
            message: this.getErrorMessage(error),
            timestamp: Date.now()
        };
        
        console.error('音频播放错误:', this.lastError);
        
        // 尝试重试
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`重试加载音频 (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => this.retry(), 1000 * this.retryCount);
        } else {
            this.dispatchEvent(new CustomEvent('maxretriesreached', { 
                detail: this.lastError 
            }));
        }
    }
    
    /**
     * 获取错误信息
     */
    getErrorMessage(error) {
        if (!error) return '未知错误';
        
        const errorMessages = {
            1: '音频加载被中断',
            2: '网络错误导致音频加载失败',
            3: '音频解码错误',
            4: '不支持的音频格式'
        };
        
        return errorMessages[error.code] || `错误代码: ${error.code}`;
    }
    
    /**
     * 重试加载
     */
    async retry() {
        try {
            this.audioElement.load();
        } catch (error) {
            console.error('重试失败:', error);
        }
    }
    
    /**
     * 设置音频数据
     */
    setAudioData(arrayBuffer) {
        this.audioData = arrayBuffer;
        
        // 创建Blob URL
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(blob);
        
        // 清理旧的URL
        if (this.audioElement.src && this.audioElement.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.audioElement.src);
        }
        
        this.audioElement.src = blobUrl;
        this.audioElement.load();
        
        // 如果有音频上下文，也创建AudioBuffer
        if (this.audioContext) {
            this.createAudioBuffer(arrayBuffer);
        }
    }
    
    /**
     * 准备播放（部分数据可用时）
     */
    prepareForPlayback(tempUrl) {
        if (!this.isReadyForPlayback) {
            this.audioElement.src = tempUrl;
            this.audioElement.load();
        }
    }
    
    /**
     * 创建AudioBuffer（用于高级音频处理）
     */
    async createAudioBuffer(arrayBuffer) {
        try {
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
            this.dispatchEvent(new CustomEvent('audiobuffercreated', { 
                detail: this.audioBuffer 
            }));
        } catch (error) {
            console.warn('AudioBuffer创建失败:', error);
        }
    }
    
    /**
     * 更新加载进度
     */
    updateLoadProgress(progress) {
        this.loadProgress = { ...progress };
        this.dispatchEvent(new CustomEvent('loadprogress', { 
            detail: progress 
        }));
    }
    
    /**
     * 更新缓冲范围
     */
    updateBufferedRanges() {
        const buffered = this.audioElement.buffered;
        this.bufferedRanges = [];
        
        for (let i = 0; i < buffered.length; i++) {
            this.bufferedRanges.push({
                start: buffered.start(i),
                end: buffered.end(i)
            });
        }
    }
    
    /**
     * 更新缓冲健康度
     */
    updateBufferHealth() {
        if (this.duration === 0) return;
        
        const currentTime = this.currentTime;
        let bufferEnd = currentTime;
        
        // 找到当前时间点后的缓冲结束位置
        for (const range of this.bufferedRanges) {
            if (range.start <= currentTime && range.end > currentTime) {
                bufferEnd = range.end;
                break;
            }
        }
        
        const bufferAhead = bufferEnd - currentTime;
        const idealBuffer = 30; // 理想情况下缓冲30秒
        
        this.bufferHealth = Math.min((bufferAhead / idealBuffer) * 100, 100);
    }
    
    /**
     * 播放音频
     */
    async play() {
        try {
            await this.audioElement.play();
        } catch (error) {
            console.error('播放失败:', error);
            this.dispatchEvent(new CustomEvent('playfailed', { detail: error }));
            throw error;
        }
    }
    
    /**
     * 暂停音频
     */
    pause() {
        this.audioElement.pause();
    }
    
    /**
     * 停止音频
     */
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
    
    /**
     * 跳转到指定时间
     */
    seek(time) {
        if (time >= 0 && time <= this.duration) {
            this.audioElement.currentTime = time;
        }
    }
    
    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audioElement.volume = this.volume;
    }
    
    /**
     * 设置播放速度
     */
    setPlaybackRate(rate) {
        this.playbackRate = Math.max(0.25, Math.min(4, rate));
        this.audioElement.playbackRate = this.playbackRate;
    }
    
    /**
     * 检查是否可以播放到指定时间而不缓冲
     */
    canPlayThrough(targetTime) {
        for (const range of this.bufferedRanges) {
            if (range.start <= this.currentTime && range.end >= targetTime) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 获取缓冲状态信息
     */
    getBufferInfo() {
        return {
            ranges: this.bufferedRanges,
            health: this.bufferHealth,
            currentBuffer: this.getCurrentBufferSize(),
            totalBuffered: this.getTotalBufferedTime()
        };
    }
    
    /**
     * 获取当前缓冲大小
     */
    getCurrentBufferSize() {
        const currentTime = this.currentTime;
        
        for (const range of this.bufferedRanges) {
            if (range.start <= currentTime && range.end > currentTime) {
                return range.end - currentTime;
            }
        }
        
        return 0;
    }
    
    /**
     * 获取总缓冲时间
     */
    getTotalBufferedTime() {
        return this.bufferedRanges.reduce((total, range) => {
            return total + (range.end - range.start);
        }, 0);
    }
    
    /**
     * 获取性能指标
     */
    getPerformanceMetrics() {
        const now = performance.now();
        
        return {
            loadTime: this.metrics.playableTime - this.metrics.loadStartTime,
            firstByteTime: this.metrics.firstByteTime - this.metrics.loadStartTime,
            bufferingEvents: this.metrics.bufferingEvents,
            currentBuffer: this.getCurrentBufferSize(),
            bufferHealth: this.bufferHealth,
            retryCount: this.retryCount
        };
    }
    
    /**
     * 获取音频信息
     */
    getAudioInfo() {
        return {
            url: this.url,
            duration: this.duration,
            currentTime: this.currentTime,
            volume: this.volume,
            playbackRate: this.playbackRate,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            isLoaded: this.isLoaded,
            isReadyForPlayback: this.isReadyForPlayback,
            loadProgress: this.loadProgress,
            bufferInfo: this.getBufferInfo(),
            error: this.lastError
        };
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 清理事件监听器
        if (this.audioElement) {
            this.audioElement.pause();
            
            // 清理Blob URL
            if (this.audioElement.src && this.audioElement.src.startsWith('blob:')) {
                URL.revokeObjectURL(this.audioElement.src);
            }
            
            this.audioElement.src = '';
            this.audioElement.load();
        }
        
        // 清理AudioBuffer
        if (this.audioBuffer) {
            this.audioBuffer = null;
        }
        
        // 清理数据
        this.audioData = null;
        
        console.log(`🗑️ EnhancedAudio cleaned up: ${this.url}`);
    }
    
    /**
     * 导出音频数据（用于保存或进一步处理）
     */
    exportAudioData() {
        if (!this.audioData) {
            throw new Error('音频数据不可用');
        }
        
        return {
            data: this.audioData.slice(0), // 创建副本
            format: 'audio/mpeg',
            size: this.audioData.byteLength,
            duration: this.duration
        };
    }
}

// 导出类供其他模块使用
window.EnhancedAudio = EnhancedAudio;