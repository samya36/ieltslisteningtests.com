// Test 2 标准答案
const standardAnswers2 = {
    // Section 1 答案 (1-10)
    1: "Village",
    2: "organic",
    3: "October",
    4: "7:30",
    5: "9.50",
    6: "none",
    7: "lunch",
    8: "clothing",
    9: "hostel",
    10: "bus",
    
    // Section 2 答案 (11-20)
    11: "A",
    12: "B",
    13: "B",
    14: "C",
    15: "B",
    16: "B",
    17: "B",
    18: "B",
    19: "A",
    20: "A",
    
    // Section 3 答案 (21-30)
    21: "C",
    22: "C",
    23: "C",
    24: "B",
    25: ["A", "D"], // 25&26题为AD
    26: ["A", "D"],
    27: "A",
    28: "C",
    29: "A",
    30: "C",
    
    // Section 4 答案 (31-40)
    31: "ACHOO",
    32: "25%",
    33: "bright light",
    34: "trigeminal",
    35: "nose",
    36: "involuntary",
    37: "hereditary",
    38: "light",
    39: "pilots",
    40: "treatment"
};

// 雅思听力分数换算表
const listeningScoreTable2 = {
    40: 9.0,
    39: 9.0,
    38: 8.5,
    37: 8.5,
    36: 8.0,
    35: 8.0,
    34: 7.5,
    33: 7.5,
    32: 7.0,
    31: 7.0,
    30: 7.0,
    29: 6.5,
    28: 6.5,
    27: 6.5,
    26: 6.0,
    25: 6.0,
    24: 6.0,
    23: 6.0,
    22: 5.5,
    21: 5.5,
    20: 5.5,
    19: 5.0,
    18: 5.0,
    17: 5.0,
    16: 5.0,
    15: 4.5,
    14: 4.5,
    13: 4.5,
    12: 4.0,
    11: 4.0,
    10: 4.0,
    9: 3.5,
    8: 3.5,
    7: 3.5,
    6: 3.5,
    5: 3.0,
    4: 3.0,
    3: 2.5,
    2: 2.0,
    1: 1.0,
    0: 0.0
};

// 获取Test 2标准答案
function getStandardAnswers2() {
    return standardAnswers2;
}

// 获取雅思分数
function getIeltsScore2(correctCount) {
    return listeningScoreTable2[correctCount] || 0;
}

// 为兼容性提供全局函数和变量
function getIeltsScore(correctCount) {
    return listeningScoreTable2[correctCount] || 0;
}

// 设置全局评分表
window.listeningScoreTable = listeningScoreTable2;