/**
 * 雅思听力评分结果展示组件
 * 负责将评分系统的结果转化为用户友好的HTML显示
 */

/**
 * 生成评分结果的HTML
 * @param {Object} scoreResult - 评分结果对象
 * @returns {String} - HTML字符串
 */
function generateScoreResultHTML(scoreResult) {
  if (!scoreResult) {
    return `<div class="error-message">未找到评分结果数据</div>`;
  }
  
  // 计算各部分和总分的百分比
  const totalPercentage = ((scoreResult.totalScore / 40) * 100).toFixed(0);
  const section1Percentage = ((scoreResult.sectionScores.section1 / 10) * 100).toFixed(0);
  const section2Percentage = ((scoreResult.sectionScores.section2 / 10) * 100).toFixed(0);
  const section3Percentage = ((scoreResult.sectionScores.section3 / 10) * 100).toFixed(0);
  const section4Percentage = ((scoreResult.sectionScores.section4 / 10) * 100).toFixed(0);
  
  // 计算统计数据
  const statistics = calculateScoreStatistics(scoreResult);
  
  let html = `
    <div class="score-container">
      <div class="main-tabs">
        <div class="tab-buttons">
          <button class="tab-button active" data-tab="score-overview">总分概览</button>
          <button class="tab-button" data-tab="detailed-analysis">详细分析</button>
          <button class="tab-button" data-tab="improvement-suggestions">提高建议</button>
        </div>
        
        <div class="tab-content active" id="score-overview">
          <div class="score-summary">
            <h2>听力测试评分结果</h2>
            <div class="score-overview">
              <div class="total-score">
                <div class="score-circle ${getScoreColorClass(totalPercentage)}">
                  <div class="score-value">${scoreResult.totalScore.toFixed(1)}</div>
                  <div class="score-max">/40</div>
                </div>
                <div class="score-label">总分</div>
              </div>
              <div class="band-score">
                <div class="score-circle ielts">
                  <div class="score-value">${scoreResult.bandScore}</div>
                </div>
                <div class="score-label">雅思分数</div>
              </div>
            </div>
            
            <div class="score-statistics">
              <div class="statistics-row">
                <div class="statistic-item">
                  <div class="statistic-value">${statistics.correctCount}</div>
                  <div class="statistic-label">正确题数</div>
                </div>
                <div class="statistic-item">
                  <div class="statistic-value">${statistics.partialCount}</div>
                  <div class="statistic-label">部分正确</div>
                </div>
                <div class="statistic-item">
                  <div class="statistic-value">${statistics.incorrectCount}</div>
                  <div class="statistic-label">错误题数</div>
                </div>
                <div class="statistic-item">
                  <div class="statistic-value">${statistics.unansweredCount}</div>
                  <div class="statistic-label">未答题数</div>
                </div>
              </div>
              <div class="statistics-progress">
                <div class="statistics-bar">
                  <div class="bar-segment correct" style="width: ${statistics.correctPercentage}%"></div>
                  <div class="bar-segment partial" style="width: ${statistics.partialPercentage}%"></div>
                  <div class="bar-segment incorrect" style="width: ${statistics.incorrectPercentage}%"></div>
                  <div class="bar-segment unanswered" style="width: ${statistics.unansweredPercentage}%"></div>
                </div>
                <div class="statistics-legend">
                  <div class="legend-item"><span class="legend-color correct"></span> 正确</div>
                  <div class="legend-item"><span class="legend-color partial"></span> 部分正确</div>
                  <div class="legend-item"><span class="legend-color incorrect"></span> 错误</div>
                  <div class="legend-item"><span class="legend-color unanswered"></span> 未答</div>
                </div>
              </div>
            </div>
            
            <div class="section-scores">
              <div class="section-score" data-section="section1">
                <div class="section-title">Section 1</div>
                <div class="progress-bar">
                  <div class="progress-fill ${getScoreColorClass(section1Percentage)}" style="width: ${section1Percentage}%"></div>
                </div>
                <div class="score-value">${scoreResult.sectionScores.section1.toFixed(1)}/10</div>
              </div>
              <div class="section-score" data-section="section2">
                <div class="section-title">Section 2</div>
                <div class="progress-bar">
                  <div class="progress-fill ${getScoreColorClass(section2Percentage)}" style="width: ${section2Percentage}%"></div>
                </div>
                <div class="score-value">${scoreResult.sectionScores.section2.toFixed(1)}/10</div>
              </div>
              <div class="section-score" data-section="section3">
                <div class="section-title">Section 3</div>
                <div class="progress-bar">
                  <div class="progress-fill ${getScoreColorClass(section3Percentage)}" style="width: ${section3Percentage}%"></div>
                </div>
                <div class="score-value">${scoreResult.sectionScores.section3.toFixed(1)}/10</div>
              </div>
              <div class="section-score" data-section="section4">
                <div class="section-title">Section 4</div>
                <div class="progress-bar">
                  <div class="progress-fill ${getScoreColorClass(section4Percentage)}" style="width: ${section4Percentage}%"></div>
                </div>
                <div class="score-value">${scoreResult.sectionScores.section4.toFixed(1)}/10</div>
              </div>
            </div>
          </div>
          
          <div class="score-explanation card">
            <h3>雅思听力评分说明</h3>
            <p>雅思听力考试总分40分，转换为雅思9分制分数。您的原始分数 <strong>${scoreResult.totalScore.toFixed(1)}</strong> 分，对应雅思分数 <strong>${scoreResult.bandScore}</strong> 分。</p>
            <div class="band-score-explanation">
              <div class="band-level level-${getBandScoreLevel(scoreResult.bandScore)}">
                <div class="level-label">水平评估：${getBandScoreDescription(scoreResult.bandScore)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="detailed-analysis">
          <div class="detailed-analysis-container">
            <div class="section-filter">
              <button class="section-filter-btn active" data-filter="all">全部</button>
              <button class="section-filter-btn" data-filter="section1">Section 1</button>
              <button class="section-filter-btn" data-filter="section2">Section 2</button>
              <button class="section-filter-btn" data-filter="section3">Section 3</button>
              <button class="section-filter-btn" data-filter="section4">Section 4</button>
            </div>
            
            ${generateDetailedAnalysisHTML(scoreResult.sectionAnalysis)}
          </div>
        </div>
        
        <div class="tab-content" id="improvement-suggestions">
          <div class="improvement-container">
            ${generateSuggestionsHTML(scoreResult.problemAreas, statistics)}
            ${generateScoringGuideHTML()}
          </div>
        </div>
      </div>
      
      <div class="result-actions">
        <button id="print-result" class="action-button">打印结果</button>
        <button id="save-result" class="action-button">保存结果</button>
        <button id="retry-test" class="action-button primary">重新测试</button>
      </div>
    </div>
  `;
  
  return html;
}

/**
 * 获取雅思分数级别
 * @param {Number} bandScore - 雅思分数
 * @returns {String} - 分数级别
 */
function getBandScoreLevel(bandScore) {
  if (bandScore >= 8.0) return 'excellent';
  if (bandScore >= 7.0) return 'good';
  if (bandScore >= 5.5) return 'average';
  return 'low';
}

/**
 * 获取雅思分数描述
 * @param {Number} bandScore - 雅思分数
 * @returns {String} - 分数描述
 */
function getBandScoreDescription(bandScore) {
  if (bandScore >= 8.5) return '专家级 (Expert)';
  if (bandScore >= 7.5) return '熟练级 (Very Good)';
  if (bandScore >= 6.5) return '良好级 (Good)';
  if (bandScore >= 5.5) return '中等级 (Moderate)';
  if (bandScore >= 4.5) return '初级水平 (Limited)';
  return '基础水平 (Basic)';
}

/**
 * 生成改进建议HTML
 * @param {Array} problemAreas - 问题数组
 * @param {Object} statistics - 统计数据
 * @returns {String} - HTML字符串
 */
function generateSuggestionsHTML(problemAreas, statistics) {
  if (!problemAreas || problemAreas.length === 0) {
    return `
      <div class="suggestion-card excellent">
        <div class="suggestion-title">
          <i class="suggestion-icon excellent"></i>
          <h3>优秀成绩</h3>
        </div>
        <div class="suggestion-content">
          <p>恭喜！您的表现非常优秀，没有明显的问题区域。</p>
          <p>继续保持这样的学习状态，进一步提升听力技巧和词汇量。</p>
        </div>
      </div>
    `;
  }
  
  // 根据正确率确定整体建议等级
  const correctRate = (statistics.correctCount / statistics.totalCount) * 100;
  let suggestionLevelClass = 'average';
  let suggestionTitle = '需要改进的地方';
  
  if (correctRate >= 80) {
    suggestionLevelClass = 'good';
    suggestionTitle = '小幅提升空间';
  } else if (correctRate < 50) {
    suggestionLevelClass = 'poor';
    suggestionTitle = '重点改进区域';
  }
  
  let html = `
    <div class="suggestion-card ${suggestionLevelClass}">
      <div class="suggestion-title">
        <i class="suggestion-icon ${suggestionLevelClass}"></i>
        <h3>${suggestionTitle}</h3>
      </div>
      <div class="suggestion-content">
        <ul class="problem-list">
  `;
  
  problemAreas.forEach(problem => {
    html += `<li>${problem}</li>`;
  });
  
  html += `
        </ul>
      </div>
    </div>
    
    <div class="suggestion-card tips">
      <div class="suggestion-title">
        <i class="suggestion-icon tips"></i>
        <h3>提升建议</h3>
      </div>
      <div class="suggestion-content">
        <div class="tip-group">
          <h4>听力策略</h4>
          <ul>
            <li>提前阅读问题，预测可能出现的信息</li>
            <li>关注信号词和数字，它们常常包含关键信息</li>
            <li>注意转折词（however, but, although等），它们往往标志着正确答案</li>
            <li>对于多选题，尤其要注意听完整段落再做选择</li>
          </ul>
        </div>
        <div class="tip-group">
          <h4>常见错误改进</h4>
          <ul>
            <li>拼写错误：多做听写练习，熟记常见单词拼写</li>
            <li>遗漏信息：提高笔记速度，使用简写和符号</li>
            <li>理解错误：扩大词汇量，尤其是同音词和近义词</li>
            <li>时间不够：提高信息捕捉速度，训练短时记忆</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  return html;
}

/**
 * 生成详细评分分析HTML
 * @param {Object} sectionAnalysis - 各部分评分分析
 * @returns {String} - HTML字符串
 */
function generateDetailedAnalysisHTML(sectionAnalysis) {
  if (!sectionAnalysis) {
    return `<div class="no-analysis">无法获取详细分析数据</div>`;
  }
  
  let html = `<div class="section-analysis-container">`;
  
  // 生成每个部分的评分详情
  for (let section = 1; section <= 4; section++) {
    const sectionKey = `section${section}`;
    const sectionData = sectionAnalysis[sectionKey];
    
    if (!sectionData || sectionData.length === 0) continue;
    
    html += `
      <div class="section-analysis" data-section="${sectionKey}">
        <div class="section-header">
          <h3>Section ${section} - ${getSectionName(section)}</h3>
          <div class="section-summary">
            <div class="correct-count">${countAnswersByStatus(sectionData, 'correct')}题正确</div>
            <div class="partial-count">${countAnswersByStatus(sectionData, 'partial')}题部分</div>
            <div class="incorrect-count">${countAnswersByStatus(sectionData, 'incorrect') + countAnswersByStatus(sectionData, 'spelling_error')}题错误</div>
          </div>
        </div>
        <div class="answer-cards">
    `;
    
    // 添加每题详情
    sectionData.forEach(item => {
      const statusClass = getStatusClass(item.status);
      const statusText = getStatusText(item.status);
      const statusIcon = getStatusIcon(item.status);
      
      html += `
        <div class="answer-card ${statusClass}">
          <div class="answer-header">
            <div class="question-number">题目 ${item.questionNumber}</div>
            <div class="status ${statusClass}">${statusIcon} ${statusText}</div>
            <div class="item-score">得分: ${item.score.toFixed(1)}</div>
          </div>
          <div class="answer-content">
            <div class="answer-pair">
              <div class="answer-label">正确答案:</div>
              <div class="correct-answer">${formatAnswer(item.correctAnswer)}</div>
            </div>
            <div class="answer-pair">
              <div class="answer-label">您的答案:</div>
              <div class="user-answer">${formatUserAnswer(item.userAnswer, item.correctAnswer, item.status)}</div>
            </div>
            <div class="answer-explanation">${item.explanation || ''}</div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  return html;
}

/**
 * 计算某状态的答案数量
 * @param {Array} sectionData - 部分数据
 * @param {String} status - 状态
 * @returns {Number} - 数量
 */
function countAnswersByStatus(sectionData, status) {
  return sectionData.filter(item => item.status === status).length;
}

/**
 * 获取部分名称
 * @param {Number} sectionNumber - 部分编号
 * @returns {String} - 部分名称
 */
function getSectionName(sectionNumber) {
  const names = {
    1: "社交对话",
    2: "日常独白",
    3: "教育/培训场景对话",
    4: "学术讲座"
  };
  return names[sectionNumber] || `部分 ${sectionNumber}`;
}

/**
 * 根据分数百分比获取颜色类名
 * @param {Number} percentage - 分数百分比
 * @returns {String} - 颜色类名
 */
function getScoreColorClass(percentage) {
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'average';
  return 'poor';
}

/**
 * 获取状态图标
 * @param {String} status - 答案状态
 * @returns {String} - HTML图标
 */
function getStatusIcon(status) {
  const iconMap = {
    'correct': '<i class="status-icon correct-icon">✓</i>',
    'partial': '<i class="status-icon partial-icon">◐</i>',
    'incorrect': '<i class="status-icon incorrect-icon">✗</i>',
    'unanswered': '<i class="status-icon unanswered-icon">○</i>',
    'spelling_error': '<i class="status-icon spelling-icon">✎</i>',
    'partial_keyword': '<i class="status-icon keyword-icon">⊕</i>'
  };
  
  return iconMap[status] || '';
}

/**
 * 格式化答案显示
 * @param {String|Array} answer - 答案
 * @returns {String} - 格式化后的HTML
 */
function formatAnswer(answer) {
  if (!answer) return '<span class="empty-answer">无答案</span>';
  
  if (Array.isArray(answer)) {
    return answer.map(a => `<span class="answer-item">${a}</span>`).join(', ');
  }
  
  return `<span class="answer-item">${answer}</span>`;
}

/**
 * 格式化用户答案显示，突出显示正确和错误部分
 * @param {String|Array} userAnswer - 用户答案
 * @param {String|Array} correctAnswer - 正确答案
 * @param {String} status - 答案状态
 * @returns {String} - 格式化后的HTML
 */
function formatUserAnswer(userAnswer, correctAnswer, status) {
  if (!userAnswer) return '<span class="empty-answer">未作答</span>';
  
  // 处理多选题答案
  if (Array.isArray(correctAnswer) || (typeof correctAnswer === 'string' && correctAnswer.includes(','))) {
    const correctArray = Array.isArray(correctAnswer) ? correctAnswer : correctAnswer.split(',').map(a => a.trim());
    const userArray = Array.isArray(userAnswer) ? userAnswer : userAnswer.split(',').map(a => a.trim());
    
    return userArray.map(answer => {
      const isCorrect = correctArray.some(c => c.toLowerCase() === answer.toLowerCase());
      return `<span class="answer-item ${isCorrect ? 'correct-item' : 'incorrect-item'}">${answer}</span>`;
    }).join(', ');
  }
  
  // 处理单选题和填空题
  if (status === 'correct') {
    return `<span class="answer-item correct-item">${userAnswer}</span>`;
  } else if (status === 'spelling_error') {
    return `<span class="answer-item spelling-error">${userAnswer}</span> <span class="hint">(应为: ${correctAnswer})</span>`;
  } else {
    return `<span class="answer-item incorrect-item">${userAnswer}</span>`;
  }
}

/**
 * 根据状态获取CSS类
 * @param {String} status - 答案状态
 * @returns {String} - CSS类名
 */
function getStatusClass(status) {
  const statusMap = {
    'correct': 'correct',
    'partial': 'partial',
    'incorrect': 'incorrect',
    'unanswered': 'unanswered',
    'spelling_error': 'spelling-error',
    'partial_keyword': 'partial-keyword'
  };
  
  return statusMap[status] || 'unknown';
}

/**
 * 根据状态获取显示文本
 * @param {String} status - 答案状态
 * @returns {String} - 状态文本
 */
function getStatusText(status) {
  const statusMap = {
    'correct': '正确',
    'partial': '部分正确',
    'incorrect': '错误',
    'unanswered': '未作答',
    'spelling_error': '拼写错误',
    'partial_keyword': '部分关键词'
  };
  
  return statusMap[status] || status;
}

/**
 * 生成评分说明HTML
 * @returns {String} - HTML字符串
 */
function generateScoringGuideHTML() {
  return `
    <div class="scoring-guide-container">
      <h3>雅思听力评分规则说明</h3>
      
      <div class="guide-section">
        <h4>总体评分规则</h4>
        <p>雅思听力考试共40道题，每道题1分，总分40分，然后转换为雅思9分制。</p>
        <table class="band-score-table">
          <tr>
            <th>原始分</th>
            <td>39-40</td>
            <td>37-38</td>
            <td>35-36</td>
            <td>32-34</td>
            <td>30-31</td>
            <td>26-29</td>
            <td>23-25</td>
            <td>18-22</td>
          </tr>
          <tr>
            <th>雅思分</th>
            <td>9.0</td>
            <td>8.5</td>
            <td>8.0</td>
            <td>7.5</td>
            <td>7.0</td>
            <td>6.5</td>
            <td>6.0</td>
            <td>5.5</td>
          </tr>
        </table>
      </div>
      
      <div class="guide-section">
        <h4>不同题型评分细则</h4>
        <div class="question-type">
          <div class="type-title">填空题</div>
          <ul>
            <li>拼写必须完全正确才能得分</li>
            <li>大小写不敏感，使用大写或小写字母均可</li>
            <li>数字可以用数字形式（如"9"）或单词形式（如"nine"）</li>
            <li>可接受指定的同义词</li>
            <li>错误拼写不得分</li>
          </ul>
        </div>
        
        <div class="question-type">
          <div class="type-title">单选题</div>
          <ul>
            <li>选择正确选项得1分</li>
            <li>选择错误选项不得分</li>
            <li>必须明确标出答案（如A、B、C、D）</li>
          </ul>
        </div>
        
        <div class="question-type highlight-type">
          <div class="type-title">多选题</div>
          <ul>
            <li>需选择所有正确答案才能得满分</li>
            <li>每个正确选项得部分分数（如两选项题中每个选对得0.5分）</li>
            <li>单题最高得分为1分</li>
            <li>选择错误选项不扣分，但也不得分</li>
          </ul>
          
          <div class="example-box">
            <div class="example-title">多选题评分示例</div>
            <p>假设一道题的正确答案是A和C：</p>
            <table class="example-table">
              <tr>
                <th>您的选择</th>
                <th>得分</th>
                <th>说明</th>
              </tr>
              <tr>
                <td>A, C</td>
                <td>1分</td>
                <td>完全正确</td>
              </tr>
              <tr>
                <td>仅A</td>
                <td>0.5分</td>
                <td>部分正确</td>
              </tr>
              <tr>
                <td>A, B</td>
                <td>0.5分</td>
                <td>选对A，但错选B</td>
              </tr>
              <tr>
                <td>B, D</td>
                <td>0分</td>
                <td>全部选错</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 计算得分统计数据
 * @param {Object} scoreResult - 评分结果对象
 * @returns {Object} - 统计数据
 */
function calculateScoreStatistics(scoreResult) {
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalCount = 0;
  
  // 遍历每个部分的题目
  Object.values(scoreResult.sectionAnalysis).forEach(questions => {
    questions.forEach(question => {
      totalCount++;
      
      if (question.status === 'correct') {
        correctCount++;
      } else if (question.status === 'partial') {
        partialCount++;
      } else if (question.status === 'incorrect') {
        incorrectCount++;
      } else if (question.status === 'unanswered') {
        unansweredCount++;
      } else if (question.status === 'spelling_error') {
        incorrectCount++; // 拼写错误计入错误
      }
    });
  });
  
  // 计算百分比
  const correctPercentage = (correctCount / totalCount) * 100;
  const partialPercentage = (partialCount / totalCount) * 100;
  const incorrectPercentage = (incorrectCount / totalCount) * 100;
  const unansweredPercentage = (unansweredCount / totalCount) * 100;
  
  return {
    correctCount,
    partialCount,
    incorrectCount,
    unansweredCount,
    totalCount,
    correctPercentage,
    partialPercentage,
    incorrectPercentage,
    unansweredPercentage
  };
}

/**
 * 设置评分结果页面的事件处理
 */
function setupScoreResultEvents() {
  document.addEventListener('click', function(event) {
    // 处理主标签切换
    if (event.target.classList.contains('tab-button')) {
      const tabId = event.target.getAttribute('data-tab');
      
      // 更新按钮状态
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      // 更新内容显示
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    }
    
    // 处理部分过滤
    if (event.target.classList.contains('section-filter-btn')) {
      const filter = event.target.getAttribute('data-filter');
      
      // 更新按钮状态
      document.querySelectorAll('.section-filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      // 更新内容显示
      if (filter === 'all') {
        document.querySelectorAll('.section-analysis').forEach(section => {
          section.style.display = 'block';
        });
      } else {
        document.querySelectorAll('.section-analysis').forEach(section => {
          if (section.getAttribute('data-section') === filter) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      }
    }
    
    // 处理部分卡片的点击
    if (event.target.closest('.section-score')) {
      const sectionCard = event.target.closest('.section-score');
      const section = sectionCard.getAttribute('data-section');
      
      // 切换到详细分析标签
      document.querySelectorAll('.tab-button').forEach(btn => {
        if (btn.getAttribute('data-tab') === 'detailed-analysis') {
          btn.click();
        }
      });
      
      // 筛选对应部分
      document.querySelectorAll('.section-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === section) {
          btn.click();
        }
      });
      
      // 滚动到相应区域
      const sectionElement = document.querySelector(`.section-analysis[data-section="${section}"]`);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // 处理打印功能
    if (event.target.id === 'print-result') {
      window.print();
    }
    
    // 处理保存功能
    if (event.target.id === 'save-result') {
      saveResultAsPDF();
    }
    
    // 处理重新测试功能
    if (event.target.id === 'retry-test') {
      resetTest();
    }
  });
}

/**
 * 保存结果为PDF（占位功能，实际需要导入PDF库）
 */
function saveResultAsPDF() {
  alert('导出PDF功能即将上线，敬请期待！');
  // 实际需要使用如jsPDF等库实现PDF导出
}

// 导出函数
export {
  generateScoreResultHTML,
  setupScoreResultEvents
}; 