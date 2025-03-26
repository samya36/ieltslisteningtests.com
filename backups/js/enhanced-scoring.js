/**
 * 雅思听力测试增强评分系统
 * 支持多种评分规则，包括大小写不敏感、同义词判断、标点符号容错和多选题部分得分
 */

// 导入test-answers.js中的标准答案
import { getStandardAnswers } from './test-answers.js';

// 获取标准答案
const testAnswers = getStandardAnswers();

// 格式化标准答案为评分系统需要的格式
const standardAnswers = {};

// 处理标准答案格式转换
Object.entries(testAnswers).forEach(([key, value]) => {
  const questionNumber = parseInt(key);
  let section;
  
  if (questionNumber >= 1 && questionNumber <= 10) {
    section = 'section1';
  } else if (questionNumber >= 11 && questionNumber <= 20) {
    section = 'section2';
  } else if (questionNumber >= 21 && questionNumber <= 30) {
    section = 'section3';
  } else if (questionNumber >= 31 && questionNumber <= 40) {
    section = 'section4';
  }
  
  if (section) {
    // 对于25-30题，特殊处理为多选题
    if (section === 'section3' && (questionNumber >= 25 && questionNumber <= 30)) {
      // 根据题目联动关系，将25-26设为一组，27-28设为一组，29-30设为一组
      if (questionNumber === 25 || questionNumber === 26) {
        standardAnswers[`${section}_${questionNumber}`] = ["C", "E"];
      } else if (questionNumber === 27 || questionNumber === 28) {
        standardAnswers[`${section}_${questionNumber}`] = ["A", "D"];
      } else if (questionNumber === 29 || questionNumber === 30) {
        standardAnswers[`${section}_${questionNumber}`] = ["B", "E"];
      }
    } else {
      standardAnswers[`${section}_${questionNumber}`] = value;
    }
  }
});

// 同义词词典 - 为填空题答案提供同义词
const synonymAnswers = {
  "club": ["clubhouse"],
  "male": ["man", "men"],
  "drive": ["driving", "driver"],
  "tuesday": ["tue", "tues"],
  "august": ["aug"],
  "dinner": ["evening meal"],
  "16": ["sixteen"],
  "modern": ["contemporary", "current"],
  "hospital": ["healthcare center", "medical center"],
  "flexible": ["adaptable", "elastic"],
  "film": ["thin layer", "membrane"],
  "gas": ["gases", "air"],
  "furniture": ["furnishings"],
  "insulation": ["insulating", "insulate"],
  "fabric": ["cloth", "textile", "material"],
  "trays": ["containers", "tray"],
  "sales": ["selling", "marketed"],
  "friction": ["resistance"],
  "medical": ["healthcare", "medicinal"]
};

// 数字单词映射表
const numberMapping = {
  "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
  "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
  "eleven": "11", "twelve": "12", "thirteen": "13", "fourteen": "14", "fifteen": "15",
  "sixteen": "16", "seventeen": "17", "eighteen": "18", "nineteen": "19", "twenty": "20",
  "twenty-one": "21", "twenty-two": "22", "twenty-three": "23", "twenty-four": "24", "twenty-five": "25"
};

// 填空题关键词权重表 - 允许部分匹配得分
const keywordWeights = {
  "modern": {"contemporary": 1, "new": 0.5, "recent": 0.3},
  "hospital": {"medical": 0.7, "healthcare": 0.7, "clinic": 0.5},
  "flexible": {"bendable": 0.8, "elastic": 0.8, "adaptable": 0.7},
  "insulation": {"insulating": 0.9, "thermal": 0.4}
};

/**
 * 标准化答案 - 处理大小写、空格和标点符号
 * @param {String} answer - 原始答案
 * @returns {String} - 标准化后的答案
 */
function normalizeAnswer(answer) {
  if (!answer) return "";
  
  // 转换为小写并去除首尾空格
  let normalized = answer.toLowerCase().trim();
  
  // 移除标点符号
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  // 将多个空格替换为单个空格
  normalized = normalized.replace(/\s{2,}/g, " ");
  
  // 处理数字单词
  if (numberMapping[normalized]) {
    return numberMapping[normalized];
  }
  
  return normalized;
}

/**
 * 比较填空题答案 - 支持同义词、部分匹配和拼写容错
 * @param {String} userAnswer - 用户答案
 * @param {String} correctAnswer - 正确答案
 * @returns {Object} - 评分结果
 */
function compareFillInBlank(userAnswer, correctAnswer) {
  if (!userAnswer || userAnswer.trim() === "") {
    return { score: 0, status: "unanswered", explanation: "未作答" };
  }
  
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);
  
  // 完全匹配
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return { 
      score: 1, 
      status: "correct", 
      explanation: "答案完全正确" 
    };
  }
  
  // 同义词匹配
  if (synonymAnswers[normalizedCorrectAnswer] && 
      synonymAnswers[normalizedCorrectAnswer].some(s => normalizeAnswer(s) === normalizedUserAnswer)) {
    return { 
      score: 1, 
      status: "correct", 
      explanation: "使用了有效的同义词" 
    };
  }
  
  // 对于数字答案，检查数值相等（16 vs "sixteen"）
  if (numberMapping[normalizedUserAnswer] === normalizedCorrectAnswer || 
      numberMapping[normalizedCorrectAnswer] === normalizedUserAnswer) {
    return {
      score: 1,
      status: "correct",
      explanation: "使用了有效的数字表示方式"
    };
  }
  
  // 拼写容错 - 编辑距离检查
  const distance = levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
  // 短答案(5个字符以下)容错度更低
  const toleranceThreshold = normalizedCorrectAnswer.length <= 5 ? 1 : 2;
  
  if (distance <= toleranceThreshold) {
    return { 
      score: 0, // 雅思听力中拼写错误不得分，但我们标记为接近正确
      status: "spelling_error", 
      explanation: `拼写错误（与正确答案相差${distance}个字符）` 
    };
  }
  
  // 关键词部分匹配
  if (keywordWeights[normalizedCorrectAnswer]) {
    const keywords = Object.keys(keywordWeights[normalizedCorrectAnswer]);
    for (const keyword of keywords) {
      if (normalizedUserAnswer.includes(keyword)) {
        const weight = keywordWeights[normalizedCorrectAnswer][keyword];
        // 在实际雅思听力考试中部分匹配不得分，这里只是为了分析
        return { 
          score: 0, 
          status: "partial_keyword", 
          explanation: `包含关键词但不完全正确（包含"${keyword}"）` 
        };
      }
    }
  }
  
  // 未匹配
  return { 
    score: 0, 
    status: "incorrect", 
    explanation: "答案不正确" 
  };
}

/**
 * 比较单选题答案
 * @param {String} userAnswer - 用户答案
 * @param {String} correctAnswer - 正确答案
 * @returns {Object} - 评分结果
 */
function compareRadioAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || userAnswer.trim() === "") {
    return { 
      score: 0, 
      status: "unanswered", 
      explanation: "未作答" 
    };
  }
  
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);
  
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return { 
      score: 1, 
      status: "correct", 
      explanation: "选择正确" 
    };
  }
  
  return { 
    score: 0, 
    status: "incorrect", 
    explanation: "选择错误" 
  };
}

/**
 * 比较多选题答案 - 实现部分得分逻辑
 * @param {Array|String} userAnswer - 用户答案
 * @param {Array|String} correctAnswer - 正确答案
 * @returns {Object} - 评分结果
 */
function compareMultipleChoice(userAnswer, correctAnswer) {
  // 处理未答题情况
  if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    return { 
      score: 0, 
      status: "unanswered", 
      explanation: "未作答" 
    };
  }
  
  // 确保答案是数组格式
  let userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  const correctAnswerArray = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
  
  // 处理逗号分隔的字符串（用户可能输入"C,E"这样的格式）
  if (userAnswerArray.length === 1 && typeof userAnswerArray[0] === 'string' && userAnswerArray[0].includes(',')) {
    userAnswerArray = userAnswerArray[0].split(',').map(item => item.trim());
  }
  
  // 标准化答案
  const normalizedUserAnswers = userAnswerArray.map(a => normalizeAnswer(a));
  const normalizedCorrectAnswers = correctAnswerArray.map(a => normalizeAnswer(a));
  
  // 计算正确选项数
  let correctCount = 0;
  const correctChoices = [];
  const incorrectChoices = [];
  
  normalizedUserAnswers.forEach(answer => {
    if (normalizedCorrectAnswers.includes(answer)) {
      correctCount++;
      correctChoices.push(answer.toUpperCase());
    } else {
      incorrectChoices.push(answer.toUpperCase());
    }
  });
  
  // 计算得分（雅思听力多选题中，每个正确选项得0.5分）
  const weightPerOption = 1 / normalizedCorrectAnswers.length;
  const score = correctCount * weightPerOption;
  
  // 准备评分结果
  let status, explanation;
  
  if (score === 0) {
    status = "incorrect";
    explanation = "所有选项均不正确";
    if (incorrectChoices.length > 0) {
      explanation += `（选择了 ${incorrectChoices.join(', ')}）`;
    }
  } else if (correctCount === normalizedCorrectAnswers.length && 
             normalizedUserAnswers.length === normalizedCorrectAnswers.length) {
    status = "correct";
    explanation = `所有选项均正确（${correctChoices.join(', ')}）`;
  } else {
    status = "partial";
    explanation = `部分正确（选对了${correctCount}个选项：${correctChoices.join(', ')}，每项${weightPerOption.toFixed(1)}分，得${score.toFixed(1)}分）`;
    if (incorrectChoices.length > 0) {
      explanation += `，错选了：${incorrectChoices.join(', ')}`;
    }
  }
  
  return {
    score: Math.min(score, 1), // 单题最高得分为1
    status,
    explanation
  };
}

/**
 * 计算增强评分 - 根据题型选择不同评分函数
 * @param {Object} userAnswers - 用户答案对象
 * @returns {Object} - 详细评分结果
 */
function calculateEnhancedScore(userAnswers) {
  const result = {
    totalScore: 0,
    sectionScores: {
      section1: 0,
      section2: 0,
      section3: 0,
      section4: 0
    },
    sectionAnalysis: {
      section1: [],
      section2: [],
      section3: [],
      section4: []
    },
    problemAreas: []
  };
  
  // 处理每个部分的题目
  for (let section = 1; section <= 4; section++) {
    const sectionKey = `section${section}`;
    let sectionScore = 0;
    
    // 过滤出当前部分的题目
    const sectionQuestions = Object.keys(standardAnswers)
      .filter(key => key.startsWith(sectionKey))
      .sort((a, b) => {
        // 提取问题编号并按数字排序
        const numA = parseInt(a.split('_')[1]);
        const numB = parseInt(b.split('_')[1]);
        return numA - numB;
      });
    
    // 评分每道题
    sectionQuestions.forEach(questionKey => {
      const questionNumber = questionKey.split('_')[1];
      const userAnswer = userAnswers[questionKey] || userAnswers[questionNumber]; // 兼容两种键名格式
      const correctAnswer = standardAnswers[questionKey];
      
      let questionResult;
      
      // 根据题目类型和部分选择评分函数
      if (section === 3 && (questionNumber >= 25 && questionNumber <= 30)) {
        // Section 3的25-30题是多选题
        questionResult = compareMultipleChoice(userAnswer, correctAnswer);
      } else if (section === 2) {
        // Section 2是单选题
        questionResult = compareRadioAnswer(userAnswer, correctAnswer);
      } else {
        // Section 1和4是填空题
        questionResult = compareFillInBlank(userAnswer, correctAnswer);
      }
      
      // 累加分数
      sectionScore += questionResult.score;
      
      // 记录分析结果
      result.sectionAnalysis[sectionKey].push({
        questionNumber,
        userAnswer: Array.isArray(userAnswer) ? userAnswer.join(", ") : (userAnswer || ""),
        correctAnswer: Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer,
        status: questionResult.status,
        score: questionResult.score,
        explanation: questionResult.explanation
      });
    });
    
    // 更新部分分数
    result.sectionScores[sectionKey] = sectionScore;
    result.totalScore += sectionScore;
  }
  
  // 添加问题分析和改进建议
  result.problemAreas = findProblemAreas(result.sectionAnalysis);
  result.bandScore = calculateBandScore(result.totalScore);
  
  return result;
}

/**
 * 识别问题领域 - 分析错误类型提供改进建议
 * @param {Object} sectionAnalysis - 部分分析结果
 * @returns {Array} - 问题领域和改进建议
 */
function findProblemAreas(sectionAnalysis) {
  const problemAreas = [];
  
  // 收集拼写错误
  const spellingErrors = [];
  // 收集未作答题目
  const unansweredQuestions = [];
  // 记录每个部分的问题数量
  const sectionProblems = {
    section1: { incorrect: 0, partial: 0, spelling: 0, unanswered: 0, total: 0 },
    section2: { incorrect: 0, partial: 0, spelling: 0, unanswered: 0, total: 0 },
    section3: { incorrect: 0, partial: 0, spelling: 0, unanswered: 0, total: 0, multipleChoice: { correct: 0, partial: 0, incorrect: 0, total: 0 } },
    section4: { incorrect: 0, partial: 0, spelling: 0, unanswered: 0, total: 0 }
  };
  
  // 分析每个部分
  Object.entries(sectionAnalysis).forEach(([section, questions]) => {
    questions.forEach(q => {
      sectionProblems[section].total++;
      
      // 处理多选题统计
      const questionNumber = parseInt(q.questionNumber);
      if (section === 'section3' && questionNumber >= 25 && questionNumber <= 30) {
        sectionProblems[section].multipleChoice.total++;
        if (q.status === 'correct') {
          sectionProblems[section].multipleChoice.correct++;
        } else if (q.status === 'partial') {
          sectionProblems[section].multipleChoice.partial++;
          sectionProblems[section].partial++;
        } else if (q.status === 'incorrect') {
          sectionProblems[section].multipleChoice.incorrect++;
          sectionProblems[section].incorrect++;
        } else if (q.status === 'unanswered') {
          sectionProblems[section].unanswered++;
        }
      } else {
        // 其他题型统计
        if (q.status === "spelling_error") {
          spellingErrors.push(`${section.replace('section', '部分')}_${q.questionNumber}`);
          sectionProblems[section].spelling++;
        } else if (q.status === "incorrect") {
          sectionProblems[section].incorrect++;
        } else if (q.status.includes("partial")) {
          sectionProblems[section].partial++;
        } else if (q.status === "unanswered") {
          unansweredQuestions.push(`${section.replace('section', '部分')}_${q.questionNumber}`);
          sectionProblems[section].unanswered++;
        }
      }
    });
  });
  
  // 拼写错误提示
  if (spellingErrors.length > 0) {
    problemAreas.push(`您在以下题目存在拼写错误: ${spellingErrors.join(', ')}，建议加强拼写练习。`);
  }
  
  // 未完成题目提示
  if (unansweredQuestions.length > 0) {
    problemAreas.push(`您有${unansweredQuestions.length}道题未作答: ${unansweredQuestions.join(', ')}，请确保在考试中回答所有问题。`);
  }
  
  // 针对各部分问题的具体建议
  Object.entries(sectionProblems).forEach(([section, problems]) => {
    const sectionNumber = section.replace('section', '');
    const sectionName = getSectionName(parseInt(sectionNumber));
    const incorrectRate = (problems.incorrect / problems.total) * 100;
    
    // 如果有明显问题，添加部分特定建议
    if (incorrectRate > 30) {
      problemAreas.push(`您在第${sectionNumber}部分(${sectionName})表现欠佳，错误率${incorrectRate.toFixed(0)}%。建议加强该场景的听力练习。`);
    }
    
    // 针对多选题问题的特殊建议
    if (section === 'section3' && problems.multipleChoice.total > 0) {
      const multipleChoiceCorrectRate = (problems.multipleChoice.correct / problems.multipleChoice.total) * 100;
      
      if (multipleChoiceCorrectRate < 50) {
        problemAreas.push(`您在多选题部分正确率较低(${multipleChoiceCorrectRate.toFixed(0)}%)，建议练习识别多个正确选项的能力，注意听讲者提到的所有相关信息。`);
      }
      
      if (problems.multipleChoice.partial > 0) {
        problemAreas.push(`您在多选题中有${problems.multipleChoice.partial}道题部分正确，考试中需要选择所有正确选项才能得满分。`);
      }
    }
    
    // 针对填空题的特殊建议
    if ((section === 'section1' || section === 'section4') && (problems.incorrect > 2 || problems.spelling > 0)) {
      problemAreas.push(`您在第${sectionNumber}部分(${sectionName})的填空题中有较多错误，建议加强单词拼写和关键词识别能力。`);
    }
  });
  
  return problemAreas;
}

/**
 * 获取部分名称
 * @param {Number} sectionNumber - 部分编号
 * @returns {String} - 部分名称描述
 */
function getSectionName(sectionNumber) {
  const sectionNames = {
    1: "社交对话",
    2: "日常独白",
    3: "教育/培训场景对话",
    4: "学术讲座"
  };
  return sectionNames[sectionNumber] || `部分${sectionNumber}`;
}

/**
 * 计算雅思听力分数段
 * @param {Number} rawScore - 原始分数(0-40)
 * @returns {String} - 雅思听力分数(0-9)
 */
function calculateBandScore(rawScore) {
  // 雅思听力分数换算表
  const bandScoreTable = {
    39: 9.0, // 39-40
    37: 8.5, // 37-38
    35: 8.0, // 35-36
    33: 7.5, // 33-34
    30: 7.0, // 30-32
    27: 6.5, // 27-29
    23: 6.0, // 23-26
    20: 5.5, // 20-22
    16: 5.0, // 16-19
    13: 4.5, // 13-15
    10: 4.0, // 10-12
    6: 3.5,  // 6-9
    4: 3.0,  // 4-5
    3: 2.5,  // 3
    2: 2.0,  // 2
    1: 1.0   // 1
  };
  
  // 从高到低查找适用的分数段
  const thresholds = Object.keys(bandScoreTable).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (rawScore >= parseInt(threshold)) {
      return bandScoreTable[threshold];
    }
  }
  
  return 0; // 0题正确
}

/**
 * 计算编辑距离 - 用于拼写容错
 * @param {String} str1 - 第一个字符串
 * @param {String} str2 - 第二个字符串
 * @returns {Number} - 编辑距离
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  // 初始化矩阵
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  // 填充矩阵
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替换
          matrix[i][j - 1] + 1,     // 插入
          matrix[i - 1][j] + 1      // 删除
        );
      }
    }
  }
  
  return matrix[str1.length][str2.length];
}

// 导出函数
export { 
  calculateEnhancedScore, 
  normalizeAnswer, 
  compareFillInBlank, 
  compareRadioAnswer, 
  compareMultipleChoice,
  calculateBandScore
};
