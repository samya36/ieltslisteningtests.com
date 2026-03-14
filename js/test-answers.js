// Test 1 标准答案
const standardAnswers = {
    1: "Club",
    2: "male",
    3: "drive",
    4: "Tuesday",
    5: "August",
    6: "dinner",
    7: "25",
    8: "16",
    9: "modern",
    10: "hospital",
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
    21: "B",
    22: "A",
    23: "B",
    24: "A",
    "25-26": ["C", "E"],
    "27-28": ["A", "D"],
    "29-30": ["B", "E"],
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

function getStandardAnswers() {
    return standardAnswers;
}

function getIeltsScore(correctCount) {
    return listeningScoreTable[correctCount] || 0;
}

window.standardAnswers = standardAnswers;
window.listeningScoreTable = listeningScoreTable;
window.getStandardAnswers = getStandardAnswers;
window.getIeltsScore = getIeltsScore;
