// 测试标准答案
const standardAnswers = {
    // Section 1 答案 (1-10)
    1: "Club",
    2: "male",
    3: "drive",
    4: "Tuesday",
    5: "August",
    6: "dinner",
    7: "25",
    8: "16", // 或者设置为接受两种格式 ["16", "sixteen"]
    9: "modern",
    10: "hospital",
    
    // Section 2 答案 (11-20)
    11: "C",
    12: "A",
    13: "A",
    14: "B",
    15: "C",
    16: "H",
    17: "B",
    18: "I",
    19: "A",
    20: "E",
    
    // Section 3 答案 (21-30)
    21: "B",
    22: "A",
    23: "B",
    24: "A",
    25: ["C", "E"], // 25&26题为CE
    26: ["C", "E"],
    27: ["A", "D"], // 27&28题为AD
    28: ["A", "D"],
    29: ["B", "E"], // 29&30题为BE
    30: ["B", "E"],
    
    // Section 4 答案 (31-40)
    31: "flexible",
    32: "film",
    33: "gas",
    34: "furniture",
    35: "insulation",
    36: "fabric",
    37: "trays",
    38: "sales",
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

// 获取标准答案
function getStandardAnswers() {
    return standardAnswers;
}

// 获取雅思分数
function getIeltsScore(correctCount) {
    return listeningScoreTable[correctCount] || 0;
} 