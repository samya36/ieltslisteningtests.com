// Test 5 标准答案
const standardAnswers5 = {
    1: "C",
    2: "A",
    3: "B",
    4: "A",
    5: "B",
    6: "C",
    7: "C",
    8: "A",
    9: "Cotehele",
    10: "SH121LQ",
    11: "B",
    12: "C",
    13: "A",
    14: "C",
    15: "B",
    16: "C",
    "17-18": ["B", "D"],
    "19-20": ["A", "D"],
    21: "F",
    22: "A",
    23: "C",
    24: "D",
    25: "I",
    26: "G",
    "27-28": ["D", "E"],
    "29-30": ["A", "C"],
    31: "breathing",
    32: "common",
    33: "face",
    34: "tears",
    35: "fire",
    36: "relatives",
    37: "number / times",
    38: "contrast",
    39: "time",
    40: "pilots"
};

const listeningScoreTable5 = {
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

function getStandardAnswers5() {
    return standardAnswers5;
}

function getIeltsScore5(correctCount) {
    return listeningScoreTable5[correctCount] || 0;
}

window.standardAnswers5 = standardAnswers5;
window.listeningScoreTable5 = listeningScoreTable5;
window.listeningScoreTable = listeningScoreTable5;
window.getStandardAnswers5 = getStandardAnswers5;
window.getIeltsScore5 = getIeltsScore5;
