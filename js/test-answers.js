// 测试标准答案
const standardAnswers = {
    // Section 1 答案 (1-10)
    1: "reception",
    2: "friday",
    3: "identification",
    4: "student",
    5: "library",
    6: "sports",
    7: "accommodation",
    8: "parking",
    9: "restaurant",
    10: "wifi",
    
    // Section 2 答案 (11-20)
    11: "B",
    12: "A",
    13: "C",
    14: "B",
    15: "A",
    16: "D",
    17: "F",
    18: "G",
    19: "H",
    20: "J",
    
    // Section 3 答案 (21-30)
    21: "B",
    22: "C",
    23: "A",
    24: "B",
    25: ["A", "D"],
    26: ["B", "E"],
    27: ["A", "C"],
    28: ["B", "D"],
    29: ["C", "E"],
    30: ["A", "B"],
    
    // Section 4 答案 (31-40)
    31: "flexible",
    32: "bottles",
    33: "radiation",
    34: "cushions",
    35: "insulation",
    36: "fibers",
    37: "containers",
    38: "manufacturing",
    39: "friction",
    40: "medical"
};

// 雅思听力分数换算表
const listeningScoreTable = {
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
    30: 6.5,
    29: 6.5,
    28: 6.0,
    27: 6.0,
    26: 5.5,
    25: 5.5,
    24: 5.0,
    23: 5.0,
    22: 4.5,
    21: 4.5,
    20: 4.0,
    19: 4.0,
    18: 3.5,
    17: 3.5,
    16: 3.0,
    15: 3.0,
    14: 2.5,
    13: 2.5,
    12: 2.0,
    11: 2.0,
    10: 1.5,
    9: 1.5,
    8: 1.0,
    7: 1.0,
    6: 0.5,
    5: 0.5,
    4: 0.0,
    3: 0.0,
    2: 0.0,
    1: 0.0,
    0: 0.0
};

// 获取标准答案
function getStandardAnswers() {
    return standardAnswers;
}

// 获取雅思分数
function getIeltsScore(correctCount) {
    return listeningScoreTable[correctCount] || 0;
} 