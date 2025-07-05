/**
 * 雅思听力评分结果显示模块
 * 负责生成和处理评分结果的显示
 */

// 雅思听力原始分数转换表
const listeningScoreTable = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5, 32: 7.5,
    31: 7.0, 30: 7.0,
    29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5,
    25: 6.0, 24: 6.0, 23: 6.0,
    22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
    17: 5.0, 16: 5.0, 15: 5.0,
    14: 4.5, 13: 4.5, 12: 4.5, 11: 4.5,
    10: 4.0, 9: 4.0, 8: 4.0,
    7: 3.5, 6: 3.5, 5: 3.5,
    4: 3.0, 3: 3.0, 2: 3.0,
    1: 2.5, 0: 2.0
};

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
 * 获取分数颜色类名
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
 * 获取状态样式类
 * @param {String} status - 状态
 * @returns {String} - 样式类
 */
function getStatusClass(status) {
  return status;
}

/**
 * 获取状态文本
 * @param {String} status - 状态
 * @returns {String} - 状态文本
 */
function getStatusText(status) {
  const texts = {
    'correct': '正确',
    'partial': '部分正确',
    'incorrect': '错误',
    'spelling_error': '拼写错误',
    'unanswered': '未作答'
  };
  return texts[status] || status;
}

/**
 * 获取状态图标
 * @param {String} status - 状态
 * @returns {String} - 状态图标HTML
 */
function getStatusIcon(status) {
  const icons = {
    'correct': '✓',
    'partial': '◐',
    'incorrect': '✗',
    'spelling_error': '✎',
    'unanswered': '○'
  };
  return icons[status] || '';
}

/**
 * 格式化答案显示
 * @param {String|Array} answer - 答案
 * @returns {String} - 格式化后的答案HTML
 */
function formatAnswer(answer) {
  if (!answer) return '无答案';
  
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  
  return answer;
}

/**
 * 格式化用户答案显示
 * @param {String|Array} userAnswer - 用户答案
 * @param {String|Array} correctAnswer - 正确答案
 * @param {String} status - 状态
 * @returns {String} - 格式化后的用户答案HTML
 */
function formatUserAnswer(userAnswer, correctAnswer, status) {
  if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0) || userAnswer === '') {
    return '<span class="unanswered">未作答</span>';
  }
  
  let html = `<span class="user-answer ${status}">`;
  
  if (Array.isArray(userAnswer)) {
    html += userAnswer.join(', ');
  } else {
    html += userAnswer;
  }
  
  html += '</span>';
  
  return html;
}

/**
 * 计算评分统计数据
 * @param {Object} scoreResult - 评分结果对象
 * @returns {Object} - 统计数据
 */
function calculateScoreStatistics(scoreResult) {
  if (!scoreResult || !scoreResult.sectionAnalysis) {
    return {
      totalCount: 0,
      correctCount: 0,
      partialCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      correctPercentage: 0,
      partialPercentage: 0,
      incorrectPercentage: 0,
      unansweredPercentage: 0
    };
  }
  
  // 初始化计数器
  let totalCount = 0;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  
  // 遍历各部分
  for (const section in scoreResult.sectionAnalysis) {
    if (scoreResult.sectionAnalysis.hasOwnProperty(section)) {
      const sectionData = scoreResult.sectionAnalysis[section];
      
      sectionData.forEach(item => {
        totalCount++;
        
        if (item.status === 'correct') {
          correctCount++;
        } else if (item.status === 'partial') {
          partialCount++;
        } else if (item.status === 'incorrect' || item.status === 'spelling_error') {
          incorrectCount++;
        } else if (item.status === 'unanswered') {
          unansweredCount++;
        }
      });
    }
  }
  
  // 计算百分比
  const correctPercentage = totalCount === 0 ? 0 : (correctCount / totalCount * 100).toFixed(0);
  const partialPercentage = totalCount === 0 ? 0 : (partialCount / totalCount * 100).toFixed(0);
  const incorrectPercentage = totalCount === 0 ? 0 : (incorrectCount / totalCount * 100).toFixed(0);
  const unansweredPercentage = totalCount === 0 ? 0 : (unansweredCount / totalCount * 100).toFixed(0);
  
  return {
    totalCount,
    correctCount,
    partialCount,
    incorrectCount,
    unansweredCount,
    correctPercentage,
    partialPercentage,
    incorrectPercentage,
    unansweredPercentage
  };
}

/**
 * 生成评分指南HTML
 * @returns {String} - HTML字符串
 */
function generateScoringGuideHTML() {
  return `
    <div class="suggestion-card">
      <div class="suggestion-title">
        <i class="suggestion-icon tips"></i>
        <h3>雅思听力评分标准</h3>
      </div>
      <div class="suggestion-content">
        <p>雅思听力考试满分为40分，根据正确答案数量计分：</p>
        <ul>
          <li>原始分数39-40分 = 雅思9分</li>
          <li>原始分数37-38分 = 雅思8.5分</li>
          <li>原始分数35-36分 = 雅思8分</li>
          <li>原始分数32-34分 = 雅思7.5分</li>
          <li>原始分数30-31分 = 雅思7分</li>
          <li>原始分数26-29分 = 雅思6.5分</li>
          <li>原始分数23-25分 = 雅思6分</li>
          <li>原始分数18-22分 = 雅思5.5分</li>
        </ul>
        <p>本测试支持以下答题类型：</p>
        <ul>
          <li>填空题：需要拼写完全正确</li>
          <li>单选题：只有一个正确选项</li>
          <li>多选题：可能有多个正确选项，每个正确选项得到部分分数</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * 设置评分结果页面的事件处理
 */
function setupScoreResultEvents() {
    // 设置选项卡切换
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 初始化选项卡状态
    if (tabButtons.length > 0 && tabContents.length > 0) {
        // 默认显示第一个选项卡
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
        
        // 选项卡切换事件
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有活动状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 激活当前选项卡
                button.classList.add('active');
                const targetId = button.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }
    
    // 详细分析过滤器
    const sectionFilters = document.querySelectorAll('.section-filter');
    if (sectionFilters.length > 0) {
        // 默认显示所有
        document.querySelector('.section-filter[data-section="all"]').classList.add('active');
        
        // 过滤器点击事件
        sectionFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // 更新活动过滤器
                sectionFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // 获取要显示的部分
                const sectionToShow = filter.getAttribute('data-section');
                const answerCards = document.querySelectorAll('.answer-card');
                
                // 过滤答案卡片
                answerCards.forEach(card => {
                    if (sectionToShow === 'all' || card.getAttribute('data-section') === sectionToShow) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 评分详解展示/隐藏
    const scoringGuideBtn = document.getElementById('scoring-guide-btn');
    const scoringGuideContainer = document.getElementById('scoring-guide-container');
    
    if (scoringGuideBtn && scoringGuideContainer) {
        scoringGuideBtn.addEventListener('click', () => {
            // 切换显示状态
            if (scoringGuideContainer.style.display === 'none' || 
                !scoringGuideContainer.style.display) {
                scoringGuideContainer.style.display = 'block';
                scoringGuideBtn.textContent = '隐藏评分详解';
            } else {
                scoringGuideContainer.style.display = 'none';
                scoringGuideBtn.textContent = '查看评分详解';
            }
        });
    }
    
    // 打印成绩单按钮
    const printScoreBtn = document.getElementById('print-score-btn');
    if (printScoreBtn) {
        printScoreBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // 重新测试按钮
    const restartTestBtn = document.getElementById('restart-test-btn');
    if (restartTestBtn) {
        restartTestBtn.addEventListener('click', () => {
            if (confirm('确定要清除当前测试记录并重新开始测试吗？')) {
                // 清除本地存储
                localStorage.removeItem('userAnswers');
                localStorage.removeItem('testCompleted');
                localStorage.removeItem('currentSection');
                localStorage.removeItem('audioProgress');
                
                // 刷新页面
                window.location.href = 'test.html';
            }
        });
    }
}

/**
 * 保存结果为PDF（占位功能，实际需要导入PDF库）
 */
function saveResultAsPDF() {
  alert('导出PDF功能即将上线，敬请期待！');
  // 实际需要使用如jsPDF等库实现PDF导出
}

/**
 * 重置测试，清除答案和进度
 */
function resetTest() {
  if (confirm('确定要重新开始测试吗？所有答案和进度将被清除。')) {
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('testCompleted');
    localStorage.removeItem('currentSection');
    localStorage.removeItem('audioProgress');
    window.location.href = 'test.html';
  }
}
