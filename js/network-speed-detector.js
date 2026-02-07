/**
 * 网络速度检测器
 * 用于检测用户的网络连接速度和类型，为音频质量自适应提供依据
 */

class NetworkSpeedDetector {
    constructor() {
        this.testImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        this.speedHistory = [];
        this.maxHistorySize = 10;
        this.lastTestTime = 0;
        this.testInterval = 30000; // 30秒重新测试一次
        
        // 缓存的网络信息
        this.cachedNetworkInfo = null;
        this.cacheTime = 0;
        this.cacheValidTime = 10000; // 10秒缓存有效期
        
        // 初始化检测
        this.initializeDetection();
    }
    
    /**
     * 初始化网络检测
     */
    async initializeDetection() {
        try {
            // 获取基础网络信息
            const basicInfo = this.getBasicNetworkInfo();
            
            // 执行速度测试
            const speedInfo = await this.performSpeedTest();
            
            // 合并信息
            this.cachedNetworkInfo = {
                ...basicInfo,
                ...speedInfo,
                timestamp: Date.now()
            };
            
            console.log('🌐 网络检测完成:', this.cachedNetworkInfo);
            
        } catch (error) {
            console.warn('网络检测失败，使用默认配置:', error);
            this.cachedNetworkInfo = this.getDefaultNetworkInfo();
        }
    }
    
    /**
     * 获取当前网络速度信息
     */
    async getCurrentSpeed() {
        const now = Date.now();
        
        // 检查缓存是否有效
        if (this.cachedNetworkInfo && 
            (now - this.cacheTime) < this.cacheValidTime) {
            return this.cachedNetworkInfo;
        }
        
        // 重新检测
        await this.initializeDetection();
        return this.cachedNetworkInfo;
    }
    
    /**
     * 获取基础网络信息
     */
    getBasicNetworkInfo() {
        const connection = navigator.connection || 
                          navigator.mozConnection || 
                          navigator.webkitConnection;
        
        if (connection) {
            return {
                effectiveType: connection.effectiveType || '4g',
                downlink: connection.downlink || 10,
                rtt: connection.rtt || 100,
                saveData: connection.saveData || false
            };
        }
        
        return this.getDefaultNetworkInfo();
    }
    
    /**
     * 执行速度测试
     */
    async performSpeedTest() {
        try {
            const testSizes = [
                { size: '100KB', bytes: 100 * 1024 },
                { size: '500KB', bytes: 500 * 1024 }
            ];
            
            let totalSpeed = 0;
            let validTests = 0;
            
            for (const test of testSizes) {
                try {
                    const speed = await this.testDownloadSpeed(test.bytes);
                    if (speed > 0) {
                        totalSpeed += speed;
                        validTests++;
                        this.addSpeedToHistory(speed);
                    }
                } catch (error) {
                    console.warn(`速度测试失败 (${test.size}):`, error);
                }
            }
            
            const averageSpeed = validTests > 0 ? totalSpeed / validTests : 1;
            const estimatedType = this.estimateConnectionType(averageSpeed);
            
            return {
                measuredSpeed: averageSpeed,
                estimatedType: estimatedType,
                reliability: validTests / testSizes.length
            };
            
        } catch (error) {
            console.warn('速度测试失败:', error);
            return {
                measuredSpeed: 1,
                estimatedType: '3g',
                reliability: 0
            };
        }
    }
    
    /**
     * 测试下载速度
     */
    async testDownloadSpeed(targetBytes) {
        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            const testImage = new Image();
            
            // 设置超时
            const timeout = setTimeout(() => {
                testImage.onload = null;
                testImage.onerror = null;
                reject(new Error('测试超时'));
            }, 10000);
            
            testImage.onload = () => {
                clearTimeout(timeout);
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000; // 转换为秒
                const speed = targetBytes / duration; // bytes per second
                resolve(speed);
            };
            
            testImage.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('图片加载失败'));
            };
            
            // 使用随机参数避免缓存
            const randomParam = Math.random().toString(36).substring(7);
            testImage.src = this.generateTestUrl(targetBytes, randomParam);
        });
    }
    
    /**
     * 生成测试URL
     */
    generateTestUrl(bytes, random) {
        // 使用httpbin.org的/bytes端点进行测试
        // 如果不可用，使用本地的占位图片
        const testUrls = [
            `https://httpbin.org/bytes/${bytes}?r=${random}`,
            `${this.testImageUrl}?size=${bytes}&r=${random}`
        ];
        
        return testUrls[0];
    }
    
    /**
     * 根据测试速度估算连接类型
     */
    estimateConnectionType(speedBps) {
        const speedKbps = speedBps * 8 / 1024; // 转换为 kbps
        
        if (speedKbps > 5000) {
            return '4g';
        } else if (speedKbps > 1000) {
            return '3g';
        } else if (speedKbps > 200) {
            return '2g';
        } else {
            return 'slow-2g';
        }
    }
    
    /**
     * 添加速度记录到历史
     */
    addSpeedToHistory(speed) {
        this.speedHistory.push({
            speed: speed,
            timestamp: Date.now()
        });
        
        // 保持历史记录大小
        if (this.speedHistory.length > this.maxHistorySize) {
            this.speedHistory.shift();
        }
    }
    
    /**
     * 获取平均速度
     */
    getAverageSpeed() {
        if (this.speedHistory.length === 0) {
            return 1024 * 1024; // 默认 1MB/s
        }
        
        const totalSpeed = this.speedHistory.reduce((sum, record) => sum + record.speed, 0);
        return totalSpeed / this.speedHistory.length;
    }
    
    /**
     * 获取速度趋势
     */
    getSpeedTrend() {
        if (this.speedHistory.length < 3) {
            return 'stable';
        }
        
        const recent = this.speedHistory.slice(-3);
        const older = this.speedHistory.slice(-6, -3);
        
        if (older.length === 0) return 'stable';
        
        const recentAvg = recent.reduce((sum, r) => sum + r.speed, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.speed, 0) / older.length;
        
        const change = (recentAvg - olderAvg) / olderAvg;
        
        if (change > 0.2) return 'improving';
        if (change < -0.2) return 'degrading';
        return 'stable';
    }
    
    /**
     * 检测是否为移动网络
     */
    isMobileConnection() {
        const connection = navigator.connection || 
                          navigator.mozConnection || 
                          navigator.webkitConnection;
        
        if (connection) {
            const mobileTypes = ['cellular', '2g', '3g', '4g'];
            return mobileTypes.includes(connection.effectiveType);
        }
        
        // 检测用户代理中的移动设备标识
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod'];
        
        return mobileKeywords.some(keyword => userAgent.includes(keyword));
    }
    
    /**
     * 检测是否启用了数据节省模式
     */
    isDataSaverEnabled() {
        const connection = navigator.connection || 
                          navigator.mozConnection || 
                          navigator.webkitConnection;
        
        return connection ? connection.saveData : false;
    }
    
    /**
     * 获取网络质量评级
     */
    getNetworkQualityRating() {
        const info = this.cachedNetworkInfo || this.getDefaultNetworkInfo();
        const { effectiveType, downlink, rtt } = info;
        
        let score = 0;
        
        // 基于连接类型评分
        switch (effectiveType) {
            case '4g': score += 40; break;
            case '3g': score += 30; break;
            case '2g': score += 15; break;
            case 'slow-2g': score += 5; break;
        }
        
        // 基于下载速度评分
        if (downlink > 10) score += 30;
        else if (downlink > 5) score += 25;
        else if (downlink > 2) score += 20;
        else if (downlink > 1) score += 15;
        else score += 10;
        
        // 基于延迟评分
        if (rtt < 50) score += 30;
        else if (rtt < 100) score += 25;
        else if (rtt < 200) score += 20;
        else if (rtt < 500) score += 15;
        else score += 10;
        
        return Math.min(score, 100);
    }
    
    /**
     * 获取推荐的音频质量
     */
    getRecommendedAudioQuality() {
        const qualityRating = this.getNetworkQualityRating();
        const isDataSaver = this.isDataSaverEnabled();
        const isMobile = this.isMobileConnection();
        
        // 数据节省模式强制使用低质量
        if (isDataSaver) {
            return 'ultra_low';
        }
        
        // 基于网络质量评级
        if (qualityRating >= 80 && !isMobile) {
            return 'high';
        } else if (qualityRating >= 60) {
            return 'standard';
        } else if (qualityRating >= 40) {
            return 'low';
        } else {
            return 'ultra_low';
        }
    }
    
    /**
     * 获取默认网络信息
     */
    getDefaultNetworkInfo() {
        return {
            effectiveType: '3g',
            downlink: 2,
            rtt: 200,
            saveData: false,
            measuredSpeed: 1024 * 512, // 512 KB/s
            estimatedType: '3g',
            reliability: 0.5
        };
    }
    
    /**
     * 生成网络诊断报告
     */
    generateDiagnosticReport() {
        const info = this.cachedNetworkInfo || this.getDefaultNetworkInfo();
        const qualityRating = this.getNetworkQualityRating();
        const recommendedQuality = this.getRecommendedAudioQuality();
        const trend = this.getSpeedTrend();
        
        return {
            connection: {
                type: info.effectiveType,
                downlink: `${info.downlink} Mbps`,
                rtt: `${info.rtt}ms`,
                isMobile: this.isMobileConnection(),
                isDataSaver: this.isDataSaverEnabled()
            },
            performance: {
                qualityRating: `${qualityRating}/100`,
                averageSpeed: `${(this.getAverageSpeed() / 1024).toFixed(2)} KB/s`,
                speedTrend: trend,
                reliability: `${(info.reliability * 100).toFixed(1)}%`
            },
            recommendations: {
                audioQuality: recommendedQuality,
                chunkSize: qualityRating > 70 ? '512KB' : '256KB',
                maxConcurrentLoads: qualityRating > 80 ? 4 : (qualityRating > 50 ? 3 : 2)
            }
        };
    }
    
    /**
     * 监听网络变化
     */
    startNetworkMonitoring() {
        const connection = navigator.connection || 
                          navigator.mozConnection || 
                          navigator.webkitConnection;
        
        if (connection) {
            connection.addEventListener('change', () => {
                console.log('🌐 网络状态变化，重新检测...');
                this.initializeDetection();
            });
        }
        
        // 定期重新检测
        setInterval(() => {
            if (Date.now() - this.lastTestTime > this.testInterval) {
                this.initializeDetection();
            }
        }, this.testInterval);
    }
}

// 全局实例
window.networkSpeedDetector = new NetworkSpeedDetector();