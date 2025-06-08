// Test 3 标准答案
const standardAnswers3 = {
    // Section 1 答案 (1-10)
    1: "Mitchell",
    2: "176",
    3: "23rd",
    4: "Auckland",
    5: "flight",
    6: "3.5",
    7: "weather",
    8: "refund",
    9: "future",
    10: "email",
    
    // Section 2 答案 (11-20)
    11: "Opening Ceremony",
    12: "Community Hall",
    13: "14:00",
    14: "Food Festival",
    15: "Park Amphitheatre",
    16: "20",
    17: "B",
    18: "A",
    19: "A",
    20: "C",
    
    // Section 3 答案 (21-30)
    21: "C",
    22: "B",
    23: "C",
    24: "A",
    25: "C",
    26: "orientation",
    27: "southern",
    28: "rock formations",
    29: "laboratory",
    30: "final reports",
    
    // Section 4 答案 (31-40)
    31: "51",
    32: "exported",
    33: "local",
    34: "mechanical",
    35: "sports surfaces",
    36: "thermal",
    37: "road durability",
    38: "concrete",
    39: "floor matting",
    40: "government"
};

// 雅思听力分数换算表
const listeningScoreTable3 = {
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

// 获取Test 3标准答案
function getStandardAnswers3() {
    return standardAnswers3;
}

// 获取雅思分数
function getIeltsScore3(correctCount) {
    return listeningScoreTable3[correctCount] || 0;
}