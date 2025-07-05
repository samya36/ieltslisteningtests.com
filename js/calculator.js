// 雅思听力分数转换表
const IELTS_SCORE_TABLE = {
    39: 9.0, 40: 9.0,
    37: 8.5, 38: 8.5,
    35: 8.0, 36: 8.0,
    33: 7.5, 34: 7.5,
    30: 7.0, 31: 7.0, 32: 7.0,
    27: 6.5, 28: 6.5, 29: 6.5,
    23: 6.0, 24: 6.0, 25: 6.0, 26: 6.0,
    20: 5.5, 21: 5.5, 22: 5.5,
    16: 5.0, 17: 5.0, 18: 5.0, 19: 5.0,
    13: 4.5, 14: 4.5, 15: 4.5,
    10: 4.0, 11: 4.0, 12: 4.0,
    6: 3.5, 7: 3.5, 8: 3.5, 9: 3.5,
    4: 3.0, 5: 3.0,
    3: 2.5,
    2: 2.0,
    1: 1.0,
    0: 0.0
};

// 计算雅思分数
function calculateIELTSScore(correctAnswers) {
    // 输入验证
    if (correctAnswers < 0 || correctAnswers > 40) {
        return '输入错误';
    }
    
    // 查找对应分数
    for (let i = correctAnswers; i >= 0; i--) {
        if (IELTS_SCORE_TABLE[i]) {
            return IELTS_SCORE_TABLE[i];
        }
    }
    
    return '计算错误';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const correctAnswersInput = document.getElementById('correct-answers');
    const calculateBtn = document.getElementById('calculate-btn');
    const scoreResult = document.getElementById('score-result');
    
    // 添加计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        const correctAnswers = parseInt(correctAnswersInput.value);
        const score = calculateIELTSScore(correctAnswers);
        
        if (score === '输入错误') {
            scoreResult.textContent = '请输入0-40之间的数字';
            scoreResult.style.color = '#f44336'; // 红色错误提示
        } else if (score === '计算错误') {
            scoreResult.textContent = '计算出错，请重试';
            scoreResult.style.color = '#f44336';
        } else {
            scoreResult.textContent = score.toFixed(1);
            scoreResult.style.color = '#1E88E5'; // 使用主题色显示结果
        }
    });
    
    // 添加输入验证
    correctAnswersInput.addEventListener('input', function() {
        let value = this.value;
        
        // 只允许输入数字
        if (!/^\d*$/.test(value)) {
            this.value = value.replace(/[^\d]/g, '');
        }
        
        // 限制数值范围
        if (value > 40) {
            this.value = 40;
        }
    });
});

class ScoreCalculator {
    constructor() {
        this.scoreTable = [
            { min: 39, max: 40, score: 9.0 },
            { min: 37, max: 38, score: 8.5 },
            { min: 35, max: 36, score: 8.0 },
            { min: 33, max: 34, score: 7.5 },
            { min: 30, max: 32, score: 7.0 },
            { min: 27, max: 29, score: 6.5 },
            { min: 23, max: 26, score: 6.0 },
            { min: 20, max: 22, score: 5.5 },
            { min: 16, max: 19, score: 5.0 },
            { min: 13, max: 15, score: 4.5 },
            { min: 10, max: 12, score: 4.0 },
            { min: 6, max: 9, score: 3.5 },
            { min: 4, max: 5, score: 3.0 },
            { min: 3, max: 3, score: 2.5 },
            { min: 2, max: 2, score: 2.0 },
            { min: 1, max: 1, score: 1.0 },
            { min: 0, max: 0, score: 0.0 }
        ];
    }

    calculateScore(correctAnswers) {
        if (correctAnswers === null || correctAnswers === undefined) {
            return 0.0;
        }

        for (const row of this.scoreTable) {
            if (correctAnswers >= row.min && correctAnswers <= row.max) {
                return row.score;
            }
        }
        return 0.0;
    }
}

// 导出计算器类和函数
window.ScoreCalculator = ScoreCalculator;
window.calculateIELTSScore = calculateIELTSScore; 