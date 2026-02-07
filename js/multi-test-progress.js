// 多测试进度管理系统
class MultiTestProgress {
    constructor() {
        this.storageKey = 'ielts_multi_test_progress';
        this.initializeProgress();
    }

    initializeProgress() {
        // 使用安全存储读取数据（已经是解析后的对象）
        const saved = window.secureStorage.getItem(this.storageKey);
        if (saved) {
            this.progress = saved;
        } else {
            this.progress = {
                test1: { completed: false, score: null, lastAttempt: null },
                test2: { completed: false, score: null, lastAttempt: null },
                test3: { completed: false, score: null, lastAttempt: null }
            };
            this.saveProgress();
        }
    }

    updateTestProgress(testId, score, totalQuestions = 40) {
        const ieltsScore = this.calculateIeltsScore(score);
        
        this.progress[testId] = {
            completed: true,
            score: score,
            totalQuestions: totalQuestions,
            ieltsScore: ieltsScore,
            lastAttempt: new Date().toISOString(),
            percentage: Math.round((score / totalQuestions) * 100)
        };
        
        this.saveProgress();
        return this.progress[testId];
    }

    calculateIeltsScore(correctCount) {
        const scoreTable = {
            40: 9.0, 39: 9.0, 38: 8.5, 37: 8.5, 36: 8.0, 35: 8.0,
            34: 7.5, 33: 7.5, 32: 7.0, 31: 7.0, 30: 7.0, 29: 6.5,
            28: 6.5, 27: 6.5, 26: 6.0, 25: 6.0, 24: 6.0, 23: 6.0,
            22: 5.5, 21: 5.5, 20: 5.5, 19: 5.0, 18: 5.0, 17: 5.0,
            16: 5.0, 15: 4.5, 14: 4.5, 13: 4.5, 12: 4.0, 11: 4.0,
            10: 4.0, 9: 3.5, 8: 3.5, 7: 3.5, 6: 3.5, 5: 3.0,
            4: 3.0, 3: 2.5, 2: 2.0, 1: 1.0, 0: 0.0
        };
        return scoreTable[correctCount] || 0.0;
    }

    getTestProgress(testId) {
        return this.progress[testId];
    }

    getAllProgress() {
        return this.progress;
    }

    getOverallStats() {
        const tests = Object.values(this.progress);
        const completed = tests.filter(t => t.completed);
        
        if (completed.length === 0) {
            return {
                totalCompleted: 0,
                averageScore: 0,
                averageIeltsScore: 0,
                bestTest: null,
                completionRate: 0
            };
        }

        const totalScore = completed.reduce((sum, test) => sum + test.score, 0);
        const totalIelts = completed.reduce((sum, test) => sum + test.ieltsScore, 0);
        const bestTest = completed.reduce((best, current) => 
            (current.ieltsScore > best.ieltsScore) ? current : best
        );

        return {
            totalCompleted: completed.length,
            averageScore: Math.round(totalScore / completed.length),
            averageIeltsScore: (totalIelts / completed.length).toFixed(1),
            bestTest: bestTest,
            completionRate: Math.round((completed.length / 3) * 100)
        };
    }

    saveProgress() {
        // 使用安全存储保存数据
        window.secureStorage.setItem(this.storageKey, this.progress);
    }

    resetProgress() {
        this.progress = {
            test1: { completed: false, score: null, lastAttempt: null },
            test2: { completed: false, score: null, lastAttempt: null },
            test3: { completed: false, score: null, lastAttempt: null }
        };
        this.saveProgress();
    }

    exportProgress() {
        return {
            exportDate: new Date().toISOString(),
            progress: this.progress,
            stats: this.getOverallStats()
        };
    }
}

// 创建全局实例
window.multiTestProgress = new MultiTestProgress();