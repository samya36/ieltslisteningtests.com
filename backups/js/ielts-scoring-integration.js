/**
 * 雅思听力评分系统集成模块
 * 负责连接评分引擎和结果展示组件，为用户提供完整的评分功能
 */

import { calculateEnhancedScore } from './enhanced-scoring.js';
import { generateScoreResultHTML, setupScoreResultEvents } from './score-results-display.js';

/**
 * 初始化评分系统
 * 在页面加载完成后调用
 */
function initIELTSScoringSystem() {
  // 添加事件监听器
  document.addEventListener('DOMContentLoaded', () => {
    // 查找评分按钮 
    const scoreButton = document.getElementById('score-test-btn');
    if (scoreButton) {
      scoreButton.addEventListener('click', handleScoreButtonClick);
    }
    
    // 在测试结果页面上，展示已保存的评分结果
    const resultContainer = document.getElementById('score-result-container');
    if (resultContainer && !scoreButton) {
      const savedResult = getSavedScoreResult();
      if (savedResult) {
        displayScoreResult(savedResult, resultContainer);
      } else {
        resultContainer.innerHTML = `
          <div class="error-message">
            <p>未找到评分结果数据</p>
            <p>请先完成测试并点击"查看得分"按钮</p>
          </div>
        `;
      }
    }
    
    // 设置结果页面的事件处理
    setupScoreResultEvents();
  });
}

/**
 * 处理评分按钮点击事件
 * @param {Event} event - 点击事件对象
 */
async function handleScoreButtonClick(event) {
  // 阻止默认行为
  event.preventDefault();
  
  try {
    // 显示加载中状态
    const resultContainer = document.getElementById('score-result-container');
    if (resultContainer) {
      resultContainer.innerHTML = '<div class="loading-indicator">正在计算分数，请稍候...</div>';
      resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 收集用户答案
    const userAnswers = collectUserAnswers();
    
    // 计算评分
    const scoreResult = calculateEnhancedScore(userAnswers);
    
    // 保存评分结果
    saveScoreResult(scoreResult);
    
    // 显示结果
    if (resultContainer) {
      displayScoreResult(scoreResult, resultContainer);
    }
    
  } catch (error) {
    console.error('评分过程中出错:', error);
    const resultContainer = document.getElementById('score-result-container');
    if (resultContainer) {
      resultContainer.innerHTML = `<div class="error-message">评分过程出错: ${error.message}</div>`;
    }
  }
}

/**
 * 收集用户答案
 * @returns {Object} - 用户答案对象
 */
function collectUserAnswers() {
  // 从localStorage获取保存的答案
  const savedAnswers = localStorage.getItem('userAnswers');
  if (savedAnswers) {
    try {
      const answers = JSON.parse(savedAnswers);
      
      // 转换为与评分系统兼容的格式
      const formattedAnswers = {};
      
      // 处理答案格式转换
      Object.entries(answers).forEach(([key, value]) => {
        // 如果键已经是 sectionX_Y 格式，直接使用
        if (/^section\d+_\d+$/.test(key)) {
          formattedAnswers[key] = value;
        } else {
          // 否则根据题号推断部分
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
            // 特殊处理Section 3中的多选题 (25-30)
            if (section === 'section3' && questionNumber >= 25 && questionNumber <= 30) {
              // 处理多选题，确保答案是数组格式
              let answerArray = value;
              
              // 如果答案是逗号分隔的字符串，转换为数组
              if (typeof value === 'string' && value.includes(',')) {
                answerArray = value.split(',').map(item => item.trim());
              } else if (typeof value === 'string') {
                answerArray = [value];
              }
              
              formattedAnswers[`${section}_${questionNumber}`] = answerArray;
            } else {
              // 单选题和填空题直接保存
              formattedAnswers[`${section}_${questionNumber}`] = value;
            }
          }
        }
      });
      
      console.log('格式化后的用户答案:', formattedAnswers);
      return formattedAnswers;
    } catch (error) {
      console.error('解析用户答案失败:', error);
      return {};
    }
  }
  
  // 如果没有保存的答案，返回空对象
  return {};
}

/**
 * 显示评分结果
 * @param {Object} scoreResult - 评分结果对象
 * @param {HTMLElement} container - 容器元素
 */
function displayScoreResult(scoreResult, container) {
  if (!container) return;
  
  // 生成HTML并插入
  const html = generateScoreResultHTML(scoreResult);
  container.innerHTML = html;
  
  // 滚动到结果区域
  container.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 保存评分结果
 * @param {Object} scoreResult - 评分结果对象
 */
function saveScoreResult(scoreResult) {
  try {
    localStorage.setItem('ieltsScoreResult', JSON.stringify(scoreResult));
  } catch (error) {
    console.error('保存评分结果失败:', error);
  }
}

/**
 * 获取保存的评分结果
 * @returns {Object|null} - 评分结果对象或null
 */
function getSavedScoreResult() {
  try {
    const saved = localStorage.getItem('ieltsScoreResult');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('获取保存的评分结果失败:', error);
    return null;
  }
}

/**
 * 重置测试
 * 清除用户答案和评分结果
 */
function resetTest() {
  try {
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('ieltsScoreResult');
    
    // 重定向到测试页面
    window.location.href = './test.html';
  } catch (error) {
    console.error('重置测试失败:', error);
  }
}

// 导出函数
export {
  initIELTSScoringSystem,
  handleScoreButtonClick,
  displayScoreResult,
  resetTest
}; 