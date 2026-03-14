// Test 2 标准答案
const standardAnswers2 = {
    1: "614381997",
    2: "post",
    3: "chemist",
    4: "garden",
    5: "balcony",
    6: "fridge",
    7: "400",
    8: "beach",
    9: "parking",
    10: "electricity",
    11: "B",
    12: "C",
    13: "A",
    14: "C",
    15: "B",
    16: "C",
    "17-18": ["B", "D"],
    "19-20": ["A", "D"],
    "21-22": ["A", "E"],
    "23-24": ["A", "D"],
    "25-26": ["C", "D"],
    27: "B",
    28: "A",
    29: "A",
    30: "C",
    31: "deserts",
    32: "seasonal",
    33: "olive oil",
    34: "camels",
    35: "square",
    36: "grass",
    37: "slaves",
    38: "blue",
    39: "herds",
    40: "guides"
};

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

function getStandardAnswers2() {
    return standardAnswers2;
}

function getIeltsScore2(correctCount) {
    return listeningScoreTable2[correctCount] || 0;
}

window.standardAnswers2 = standardAnswers2;
window.listeningScoreTable2 = listeningScoreTable2;
window.listeningScoreTable = listeningScoreTable2;
window.getStandardAnswers2 = getStandardAnswers2;
window.getIeltsScore2 = getIeltsScore2;
