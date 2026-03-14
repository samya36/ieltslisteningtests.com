// Test 3 标准答案
const standardAnswers3 = {
    1: "Quigley",
    2: "return",
    3: "11.45 / 11:45",
    4: "error",
    5: "two / 2",
    6: "12",
    7: "food",
    8: "school",
    9: "manager",
    10: "GBK 8422 / GBK8422",
    11: "lake",
    12: "picnic",
    13: "flowers",
    14: "20 / twenty",
    15: "Motor",
    16: "art gallery",
    17: "Concert Hall",
    18: "2:30 / 2.30",
    19: "C",
    20: "B",
    21: "A",
    22: "C",
    23: "C",
    24: "C",
    25: "B",
    26: "D",
    27: "A",
    28: "F",
    29: "G",
    30: "B",
    31: "month",
    32: "profit",
    33: "size",
    34: "research",
    35: "wire",
    36: "dirt",
    37: "panels",
    38: "floor",
    39: "water",
    40: "ink"
};

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

function getStandardAnswers3() {
    return standardAnswers3;
}

function getIeltsScore3(correctCount) {
    return listeningScoreTable3[correctCount] || 0;
}

window.standardAnswers3 = standardAnswers3;
window.listeningScoreTable3 = listeningScoreTable3;
window.listeningScoreTable = listeningScoreTable3;
window.getStandardAnswers3 = getStandardAnswers3;
window.getIeltsScore3 = getIeltsScore3;
