// 音频懒加载管理器

class AudioLazyLoader {
    constructor() {
        this.loadedAudio = new Map();
        this.loadingQueue = new Set();
        this.preloadQueue = new Set();
        this.currentSection = 1;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupSectionChangeListener();
        this.optimizeInitialLoad();
    }

    // 设置Intersection Observer用于懒加载
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // 降级处理：直接加载所有音频
            this.loadAllAudio();
            return;
        }

        const options = {
            root: null,
            rootMargin: '100px', // 提前100px开始加载
            threshold: 0.1
        };

        this.audioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadAudio(entry.target);
                }
            });
        }, options);

        // 观察所有音频元素
        const audioElements = document.querySelectorAll('audio[data-src]');
        audioElements.forEach(audio => {
            this.audioObserver.observe(audio);
        });
    }

    // 监听section切换事件
    setupSectionChangeListener() {
        // 监听tab切换
        document.addEventListener('tabchange', (e) => {
            const newSection = e.detail.section;
            this.currentSection = newSection;
            this.preloadCurrentAndNext();
        });

        // 监听现有的section切换
        const sectionTabs = document.querySelectorAll('.section-tab');
        sectionTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.currentSection = index + 1;
                this.preloadCurrentAndNext();
            });
        });
    }

    // 优化初始加载
    optimizeInitialLoad() {
        // 立即加载第一个section的音频
        this.loadSectionAudio(1);
        
        // 延迟预加载第二个section
        setTimeout(() => {
            this.preloadSectionAudio(2);
        }, 2000);
    }

    // 加载指定section的音频
    loadSectionAudio(section) {
        const audioElement = document.getElementById(`section${section}-player`);
        if (audioElement) {
            this.loadAudio(audioElement);
        }
    }

    // 预加载指定section的音频
    preloadSectionAudio(section) {
        if (section < 1 || section > 4) return;
        
        const audioElement = document.getElementById(`section${section}-player`);
        if (audioElement && !this.loadedAudio.has(audioElement.id)) {
            this.preloadQueue.add(audioElement);
            // 使用requestIdleCallback进行预加载
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.loadAudio(audioElement, true);
                });
            } else {
                setTimeout(() => {
                    this.loadAudio(audioElement, true);
                }, 100);
            }
        }
    }

    // 预加载当前和下一个section
    preloadCurrentAndNext() {
        this.loadSectionAudio(this.currentSection);
        
        // 预加载下一个section
        if (this.currentSection < 4) {
            this.preloadSectionAudio(this.currentSection + 1);
        }
    }

    // 加载音频文件
    loadAudio(audioElement, isPreload = false) {
        if (this.loadedAudio.has(audioElement.id) || 
            this.loadingQueue.has(audioElement.id)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.loadingQueue.add(audioElement.id);

            // 显示加载指示器
            if (!isPreload) {
                this.showLoadingIndicator(audioElement);
            }

            // 获取音频源
            const src = audioElement.dataset.src || audioElement.src;
            if (!src) {
                this.loadingQueue.delete(audioElement.id);
                reject('No audio source found');
                return;
            }

            // 创建新的Audio对象进行预加载
            const audio = new Audio();
            
            // 设置加载事件监听器
            audio.addEventListener('canplaythrough', () => {
                // 更新原始audio元素
                audioElement.src = src;
                audioElement.removeAttribute('data-src');
                
                // 标记为已加载
                this.loadedAudio.set(audioElement.id, {
                    element: audioElement,
                    loadTime: Date.now(),
                    isPreloaded: isPreload
                });

                this.loadingQueue.delete(audioElement.id);
                this.hideLoadingIndicator(audioElement);
                
                if (!isPreload) {
                    this.showSuccessIndicator(audioElement);
                }

                // 停止观察该元素
                if (this.audioObserver) {
                    this.audioObserver.unobserve(audioElement);
                }

                resolve();
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio loading failed:', src, e);
                this.loadingQueue.delete(audioElement.id);
                this.hideLoadingIndicator(audioElement);
                this.showErrorIndicator(audioElement);
                reject(e);
            });

            // 开始加载
            audio.preload = 'auto';
            audio.src = src;
        });
    }

    // 显示加载指示器
    showLoadingIndicator(audioElement) {
        const playButton = this.getPlayButton(audioElement);
        if (playButton) {
            playButton.classList.add('loading');
            playButton.disabled = true;
            
            const icon = playButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin';
            }

            // 更新aria标签
            playButton.setAttribute('aria-label', '音频加载中...');
        }
    }

    // 隐藏加载指示器
    hideLoadingIndicator(audioElement) {
        const playButton = this.getPlayButton(audioElement);
        if (playButton) {
            playButton.classList.remove('loading');
            playButton.disabled = false;
            
            const icon = playButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-play';
            }

            // 恢复aria标签
            const section = audioElement.id.replace('section', '').replace('-player', '');
            playButton.setAttribute('aria-label', `播放Section ${section}音频`);
        }
    }

    // 显示成功指示器
    showSuccessIndicator(audioElement) {
        const playButton = this.getPlayButton(audioElement);
        if (playButton) {
            playButton.classList.add('loaded');
            setTimeout(() => {
                playButton.classList.remove('loaded');
            }, 1000);
        }
    }

    // 显示错误指示器
    showErrorIndicator(audioElement) {
        const playButton = this.getPlayButton(audioElement);
        if (playButton) {
            playButton.classList.add('error');
            playButton.disabled = true;
            
            const icon = playButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-exclamation-triangle';
            }

            playButton.setAttribute('aria-label', '音频加载失败');
            
            // 添加重试功能
            playButton.addEventListener('click', () => {
                this.retryLoad(audioElement);
            }, { once: true });
        }
    }

    // 重试加载
    retryLoad(audioElement) {
        const playButton = this.getPlayButton(audioElement);
        if (playButton) {
            playButton.classList.remove('error');
        }
        
        this.loadedAudio.delete(audioElement.id);
        this.loadAudio(audioElement);
    }

    // 获取对应的播放按钮
    getPlayButton(audioElement) {
        const section = audioElement.id.replace('section', '').replace('-player', '');
        return document.getElementById(`section${section}-play`);
    }

    // 降级处理：加载所有音频
    loadAllAudio() {
        const audioElements = document.querySelectorAll('audio[data-src]');
        audioElements.forEach(audio => {
            if (audio.dataset.src) {
                audio.src = audio.dataset.src;
                audio.removeAttribute('data-src');
            }
        });
    }

    // 预加载所有音频（用于高速网络）
    preloadAllAudio() {
        if (navigator.connection && navigator.connection.effectiveType === '4g') {
            for (let i = 1; i <= 4; i++) {
                this.preloadSectionAudio(i);
            }
        }
    }

    // 获取加载统计信息
    getLoadingStats() {
        return {
            totalLoaded: this.loadedAudio.size,
            currentlyLoading: this.loadingQueue.size,
            preloadQueue: this.preloadQueue.size,
            loadedSections: Array.from(this.loadedAudio.keys())
        };
    }
}

// 网络状态检测器
class NetworkOptimizer {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }

    init() {
        this.detectNetworkSpeed();
        this.setupNetworkChangeListener();
    }

    detectNetworkSpeed() {
        if (this.connection) {
            const effectiveType = this.connection.effectiveType;
            const downlink = this.connection.downlink;
            
            console.log('Network info:', {
                effectiveType,
                downlink: downlink + ' Mbps',
                rtt: this.connection.rtt + 'ms'
            });

            // 根据网络状况调整策略
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                this.applySlowNetworkStrategy();
            } else if (effectiveType === '4g' && downlink > 10) {
                this.applyFastNetworkStrategy();
            }
        }
    }

    setupNetworkChangeListener() {
        if (this.connection) {
            this.connection.addEventListener('change', () => {
                this.detectNetworkSpeed();
            });
        }
    }

    applySlowNetworkStrategy() {
        console.log('Applying slow network strategy');
        // 只加载当前section，不预加载
        document.documentElement.classList.add('slow-network');
    }

    applyFastNetworkStrategy() {
        console.log('Applying fast network strategy');
        // 预加载所有音频
        document.documentElement.classList.add('fast-network');
        
        if (window.audioLazyLoader) {
            window.audioLazyLoader.preloadAllAudio();
        }
    }
}

// 缓存管理器
class AudioCacheManager {
    constructor() {
        this.cacheLimit = 50 * 1024 * 1024; // 50MB缓存限制
        this.init();
    }

    init() {
        this.checkCacheUsage();
        this.setupCacheCleanup();
    }

    checkCacheUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                const usage = estimate.usage;
                const quota = estimate.quota;
                
                console.log('Storage usage:', {
                    used: Math.round(usage / 1024 / 1024) + 'MB',
                    total: Math.round(quota / 1024 / 1024) + 'MB',
                    percentage: Math.round((usage / quota) * 100) + '%'
                });

                if (usage > quota * 0.8) {
                    this.cleanupCache();
                }
            });
        }
    }

    setupCacheCleanup() {
        // 定期清理缓存
        setInterval(() => {
            this.cleanupCache();
        }, 10 * 60 * 1000); // 每10分钟检查一次
    }

    cleanupCache() {
        // 清理旧的音频缓存
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (cacheName.includes('audio')) {
                        caches.open(cacheName).then(cache => {
                            cache.keys().then(requests => {
                                // 清理超过1小时的缓存
                                const oneHourAgo = Date.now() - 60 * 60 * 1000;
                                requests.forEach(request => {
                                    cache.match(request).then(response => {
                                        if (response) {
                                            const date = new Date(response.headers.get('date'));
                                            if (date.getTime() < oneHourAgo) {
                                                cache.delete(request);
                                            }
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        }
    }
}

// 初始化音频懒加载
document.addEventListener('DOMContentLoaded', () => {
    // 将音频src移动到data-src属性
    const audioElements = document.querySelectorAll('audio[src]');
    audioElements.forEach(audio => {
        if (!audio.dataset.src) {
            audio.dataset.src = audio.src;
            audio.removeAttribute('src');
        }
    });

    // 初始化管理器
    window.audioLazyLoader = new AudioLazyLoader();
    new NetworkOptimizer();
    new AudioCacheManager();
});