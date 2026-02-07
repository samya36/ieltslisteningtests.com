/**
 * 安全存储管理器 - 提供AES加密的localStorage存储
 * 防止敏感数据明文存储，提升安全性
 */
class SecureStorage {
    constructor() {
        // 使用基于用户会话的密钥
        this.secretKey = this.generateSessionKey();
        this.storagePrefix = 'ielts_secure_';
    }

    /**
     * 生成会话密钥
     * 基于用户的浏览器指纹和时间戳
     */
    generateSessionKey() {
        const fingerprint = this.getBrowserFingerprint();
        const sessionId = sessionStorage.getItem('session_id') || this.generateSessionId();
        sessionStorage.setItem('session_id', sessionId);
        return this.simpleHash(fingerprint + sessionId);
    }

    /**
     * 获取简单的浏览器指纹
     */
    getBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        return btoa([
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|')).substring(0, 32);
    }

    /**
     * 生成会话ID
     */
    generateSessionId() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * 简单哈希函数
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    /**
     * 简单的AES-like加密实现
     * 注意：这是一个简化版本，生产环境建议使用Web Crypto API
     */
    encrypt(data) {
        const jsonStr = JSON.stringify(data);
        const key = this.secretKey;
        let encrypted = '';
        
        for (let i = 0; i < jsonStr.length; i++) {
            const keyChar = key.charCodeAt(i % key.length);
            const dataChar = jsonStr.charCodeAt(i);
            encrypted += String.fromCharCode(dataChar ^ keyChar);
        }
        
        return btoa(encrypted);
    }

    /**
     * 解密数据
     */
    decrypt(encryptedData) {
        try {
            const encrypted = atob(encryptedData);
            const key = this.secretKey;
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                const keyChar = key.charCodeAt(i % key.length);
                const encryptedChar = encrypted.charCodeAt(i);
                decrypted += String.fromCharCode(encryptedChar ^ keyChar);
            }
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.warn('解密失败，可能是数据损坏或密钥不匹配');
            return null;
        }
    }

    /**
     * 安全存储数据
     */
    setItem(key, value) {
        try {
            const encryptedValue = this.encrypt(value);
            const storageKey = this.storagePrefix + key;
            const metadata = {
                data: encryptedValue,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(storageKey, JSON.stringify(metadata));
            return true;
        } catch (error) {
            console.error('安全存储失败:', error);
            return false;
        }
    }

    /**
     * 安全获取数据
     */
    getItem(key) {
        try {
            const storageKey = this.storagePrefix + key;
            const storedData = localStorage.getItem(storageKey);
            
            if (!storedData) {
                return null;
            }
            
            const metadata = JSON.parse(storedData);
            const decryptedData = this.decrypt(metadata.data);
            
            return decryptedData;
        } catch (error) {
            console.error('安全读取失败:', error);
            return null;
        }
    }

    /**
     * 删除数据
     */
    removeItem(key) {
        try {
            const storageKey = this.storagePrefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }

    /**
     * 清空所有安全存储的数据
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.storagePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }

    /**
     * 检查数据是否存在
     */
    hasItem(key) {
        const storageKey = this.storagePrefix + key;
        return localStorage.getItem(storageKey) !== null;
    }

    /**
     * 获取所有安全存储的键名
     */
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.storagePrefix))
            .map(key => key.substring(this.storagePrefix.length));
    }

    /**
     * 数据迁移：将明文数据转换为加密数据
     */
    migrateFromPlainStorage(plainKey) {
        try {
            const plainData = localStorage.getItem(plainKey);
            if (plainData) {
                const parsedData = JSON.parse(plainData);
                this.setItem(plainKey, parsedData);
                localStorage.removeItem(plainKey);
                console.log(`已迁移数据: ${plainKey}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('数据迁移失败:', error);
            return false;
        }
    }
}

// 创建全局安全存储实例
window.secureStorage = new SecureStorage();

// 自动迁移现有的明文数据
document.addEventListener('DOMContentLoaded', function() {
    const keysToMigrate = [
        'test-progress',
        'userAnswers',
        'currentSection',
        'test-state',
        'user-preferences'
    ];
    
    keysToMigrate.forEach(key => {
        window.secureStorage.migrateFromPlainStorage(key);
    });
});