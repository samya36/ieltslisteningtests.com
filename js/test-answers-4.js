// Test 4 标准答案
const standardAnswers4 = {
    1: "1300",
    2: "wood",
    3: "card",
    4: "electric",
    5: "bike",
    6: "security",
    7: "7:40 / 7.40",
    8: "Kerridge",
    9: "library",
    10: "park",
    11: "B",
    12: "A",
    13: "C",
    14: "B",
    15: "A",
    16: "C",
    17: "C",
    18: "E",
    19: "B",
    20: "F",
    21: "A",
    22: "C",
    23: "C",
    24: "B",
    25: "H",
    26: "G",
    27: "A",
    28: "F",
    29: "E",
    30: "D",
    31: "power",
    32: "women",
    33: "wood",
    34: "wax",
    35: "body",
    36: "lids",
    37: "gloves",
    38: "plastic",
    39: "steel",
    40: "nylon"
};

const listeningScoreTable4 = {
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

function getStandardAnswers4() {
    return standardAnswers4;
}

function getIeltsScore4(correctCount) {
    return listeningScoreTable4[correctCount] || 0;
}

window.standardAnswers4 = standardAnswers4;
window.listeningScoreTable4 = listeningScoreTable4;
window.listeningScoreTable = listeningScoreTable4;
window.getStandardAnswers4 = getStandardAnswers4;
window.getIeltsScore4 = getIeltsScore4;
