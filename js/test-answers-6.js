// Test 6 标准答案
const standardAnswers6 = {
    1: "Club",
    2: "male",
    3: "drive",
    4: "Tuesday",
    5: "August",
    6: "dinner",
    7: "25",
    8: "16 / sixteen",
    9: "modern",
    10: "hospital",
    11: "A",
    12: "B",
    13: "B",
    14: "A",
    15: "B",
    16: "F",
    17: "H",
    18: "C",
    19: "E",
    20: "B",
    21: "C",
    22: "A",
    23: "C",
    24: "B",
    25: "B",
    26: "C",
    27: "B",
    28: "F",
    29: "E",
    30: "A",
    31: "confidence",
    32: "risks",
    33: "listening",
    34: "responsible",
    35: "therapy",
    36: "safe",
    37: "morality",
    38: "participation",
    39: "remember",
    40: "problems"
};

const listeningScoreTable6 = {
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

function getStandardAnswers6() {
    return standardAnswers6;
}

function getIeltsScore6(correctCount) {
    return listeningScoreTable6[correctCount] || 0;
}

window.standardAnswers6 = standardAnswers6;
window.listeningScoreTable6 = listeningScoreTable6;
window.listeningScoreTable = listeningScoreTable6;
window.getStandardAnswers6 = getStandardAnswers6;
window.getIeltsScore6 = getIeltsScore6;
