(function() {
  'use strict';

  const TOTAL_QUESTIONS = 40;
  const STORAGE_KEY = 'ielts-test1-answers';

  document.addEventListener('DOMContentLoaded', function() {
    initEnhancedAnswerSheet();
    bindHelpButton();
    bindInputTracking();
    bindAnswerSheetNavigation();
    syncAnswerSheetFromInputs();
    updateProgress();
    setTimeout(function() {
      syncAnswerSheetFromInputs();
      updateProgress();
    }, 240);

    if (window.keyboardNavigation && typeof window.keyboardNavigation.updateQuestionInfo === 'function') {
      window.keyboardNavigation.updateQuestionInfo(0, TOTAL_QUESTIONS);
    }

    setTimeout(function() {
      if (window.enhancedAnswerSheet && typeof window.enhancedAnswerSheet.showFeedback === 'function') {
        window.enhancedAnswerSheet.showFeedback('增强测试系统已启动', 'info');
      }
    }, 1200);
  });

  function initEnhancedAnswerSheet() {
    if (!window.enhancedAnswerSheet || typeof window.enhancedAnswerSheet.setQuestions !== 'function') return;

    const questions = Array.from({ length: TOTAL_QUESTIONS }, function(_, index) {
      return { id: 'q' + (index + 1) };
    });

    window.enhancedAnswerSheet.setQuestions(questions);
  }

  function bindHelpButton() {
    const helpBtn = document.getElementById('kb-help-btn');
    if (!helpBtn) return;

    helpBtn.addEventListener('click', function() {
      if (window.keyboardNavigation && typeof window.keyboardNavigation.showHelp === 'function') {
        window.keyboardNavigation.showHelp();
      }
    });
  }

  function parseQuestionNumbers(questionId) {
    if (!questionId) return [];

    const value = String(questionId).trim();
    const range = value.match(/(\d+)\s*-\s*(\d+)/);

    if (range) {
      const start = parseInt(range[1], 10);
      const end = parseInt(range[2], 10);
      if (Number.isNaN(start) || Number.isNaN(end) || end < start) return [];

      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    }

    const numbers = value.match(/\d+/g);
    if (!numbers || numbers.length === 0) return [];

    return numbers
      .map(function(item) { return parseInt(item, 10); })
      .filter(function(item) { return !Number.isNaN(item); });
  }

  function getInputAnswerValue(input) {
    if (!input) return '';

    if (input.type === 'radio') {
      const checked = Array.from(document.querySelectorAll('input[type="radio"]')).find(function(el) {
        return el.name === input.name && el.checked;
      });
      return checked ? checked.value : '';
    }

    if (input.type === 'checkbox') {
      const groupKey = input.dataset.question || input.name;
      const checkedValues = Array.from(document.querySelectorAll('input[type="checkbox"]'))
        .filter(function(el) {
          return (el.dataset.question || el.name) === groupKey && el.checked;
        })
        .map(function(el) { return el.value; });
      return checkedValues;
    }

    return input.value.trim();
  }

  function markQuestionAnsweredByInput(input) {
    if (!window.enhancedAnswerSheet) return;

    const questionId = input.dataset.question || input.name || input.id;
    const questionNumbers = parseQuestionNumbers(questionId);
    if (questionNumbers.length === 0) return;

    const value = getInputAnswerValue(input);
    const normalizedValue = Array.isArray(value) ? value.join(' ') : value;

    questionNumbers.forEach(function(questionNumber) {
      window.enhancedAnswerSheet.updateAnswer('q' + questionNumber, normalizedValue);
    });
  }

  function bindInputTracking() {
    document.addEventListener('input', function(event) {
      if (!event.target.matches('.answer-input, input[type="text"], input[type="radio"], input[type="checkbox"]')) return;
      markQuestionAnsweredByInput(event.target);
      updateProgress();
    });

    document.addEventListener('change', function(event) {
      if (!event.target.matches('.answer-input, input[type="radio"], input[type="checkbox"]')) return;
      markQuestionAnsweredByInput(event.target);
      updateProgress();
    });
  }

  function findQuestionElement(questionNumber) {
    const inputs = Array.from(document.querySelectorAll('.answer-input, input[type="text"], input[type="radio"], input[type="checkbox"]'));
    return inputs.find(function(input) {
      const questionId = input.dataset.question || input.name || input.id;
      return parseQuestionNumbers(questionId).includes(questionNumber);
    }) || null;
  }

  function bindAnswerSheetNavigation() {
    document.addEventListener('answerSheet:questionChanged', function(event) {
      const questionIndex = event.detail && typeof event.detail.index === 'number' ? event.detail.index : -1;
      if (questionIndex < 0) return;

      const questionNumber = questionIndex + 1;
      const sectionNumber = Math.min(4, Math.max(1, Math.ceil(questionNumber / 10)));

      if (typeof window.switchToSection === 'function') {
        window.switchToSection(sectionNumber);
      }

      setTimeout(function() {
        const target = findQuestionElement(questionNumber);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (target.type === 'text') {
          target.focus({ preventScroll: true });
        }
      }, 120);
    });
  }

  function getAnsweredQuestionCount() {
    const answered = new Set();

    const inputs = Array.from(document.querySelectorAll('.answer-input, input[type="text"], input[type="radio"], input[type="checkbox"]'));
    inputs.forEach(function(input) {
      const questionId = input.dataset.question || input.name || input.id;
      const questionNumbers = parseQuestionNumbers(questionId);
      if (questionNumbers.length === 0) return;

      let isAnswered = false;
      if (input.type === 'text') {
        isAnswered = input.value.trim() !== '';
      } else if (input.type === 'radio') {
        isAnswered = Array.from(document.querySelectorAll('input[type="radio"]')).some(function(el) {
          return el.name === input.name && el.checked;
        });
      } else if (input.type === 'checkbox') {
        const groupKey = input.dataset.question || input.name;
        isAnswered = Array.from(document.querySelectorAll('input[type="checkbox"]')).some(function(el) {
          return (el.dataset.question || el.name) === groupKey && el.checked;
        });
      }

      if (isAnswered) {
        questionNumbers.forEach(function(qNum) {
          answered.add(qNum);
        });
      }
    });

    return answered.size;
  }

  function updateProgress() {
    const answeredCount = getAnsweredQuestionCount();
    const percentage = (answeredCount / TOTAL_QUESTIONS) * 100;

    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
      progressFill.style.width = percentage.toFixed(2) + '%';
    }

    if (progressText) {
      progressText.textContent = answeredCount + ' / ' + TOTAL_QUESTIONS + ' 题已完成';
    }
  }

  function syncAnswerSheetFromInputs() {
    const inputs = document.querySelectorAll('.answer-input, input[type="text"], input[type="radio"], input[type="checkbox"]');
    inputs.forEach(function(input) {
      markQuestionAnsweredByInput(input);
    });
  }

  function buildUserAnswers() {
    const rawAnswers = {};

    document.querySelectorAll('input[type="text"]').forEach(function(input) {
      const questionId = input.dataset.question || input.name || input.id;
      const value = input.value.trim();
      if (questionId && value) {
        rawAnswers[questionId] = value;
      }
    });

    document.querySelectorAll('input[type="radio"]:checked').forEach(function(input) {
      const questionId = input.dataset.question || input.name || input.id;
      if (questionId) {
        rawAnswers[questionId] = input.value;
      }
    });

    const checkboxGroups = new Set();
    document.querySelectorAll('input[type="checkbox"]').forEach(function(input) {
      const groupKey = input.dataset.question || input.name || input.id;
      if (!groupKey || checkboxGroups.has(groupKey)) return;
      checkboxGroups.add(groupKey);

      const values = Array.from(document.querySelectorAll('input[type="checkbox"]'))
        .filter(function(el) {
          return (el.dataset.question || el.name || el.id) === groupKey && el.checked;
        })
        .map(function(el) { return el.value; });

      if (values.length > 0) {
        rawAnswers[groupKey] = values;
      }
    });

    const userAnswers = {};
    const toKey = function(questionNumber) {
      const n = parseInt(String(questionNumber), 10);
      const section = Math.min(4, Math.max(1, Math.ceil(n / 10)));
      return 'section' + section + '_' + n;
    };

    Object.entries(rawAnswers).forEach(function(entry) {
      const questionId = entry[0];
      const value = entry[1];
      parseQuestionNumbers(questionId).forEach(function(questionNumber) {
        userAnswers[toKey(questionNumber)] = value;
      });
    });

    return userAnswers;
  }

  function buildAnswerKey() {
    const answerKey = {};
    if (typeof window.standardAnswers === 'undefined') return answerKey;

    const toKey = function(questionNumber) {
      const n = parseInt(String(questionNumber), 10);
      const section = Math.min(4, Math.max(1, Math.ceil(n / 10)));
      return 'section' + section + '_' + n;
    };

    Object.entries(window.standardAnswers).forEach(function(entry) {
      answerKey[toKey(entry[0])] = entry[1];
    });

    return answerKey;
  }

  window.resetTest = function() {
    if (!window.confirm('确定要重新开始测试吗？所有答案将被清除。')) return;

    document.querySelectorAll('input').forEach(function(input) {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = false;
      } else {
        input.value = '';
      }
      input.classList.remove('answered');
    });

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }

    if (window.enhancedAnswerSheet && typeof window.enhancedAnswerSheet.reset === 'function') {
      window.enhancedAnswerSheet.reset();
      initEnhancedAnswerSheet();
    }

    updateProgress();
  };

  window.submitTest = function() {
    const userAnswers = buildUserAnswers();
    const answerKey = buildAnswerKey();

    if (Object.keys(userAnswers).length === 0) {
      if (window.enhancedAnswerSheet && typeof window.enhancedAnswerSheet.showFeedback === 'function') {
        window.enhancedAnswerSheet.showFeedback('请先作答后再提交', 'warning');
      } else {
        window.alert('请先作答后再提交');
      }
      return;
    }

    try {
      localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    } catch (_) {
      // ignore
    }

    if (window.ScoreEngine && typeof window.ScoreEngine.calculate === 'function') {
      const scoreResult = window.ScoreEngine.calculate(userAnswers, answerKey);
      try {
        localStorage.setItem('latestScoreResult', JSON.stringify(scoreResult));
        localStorage.setItem('latestAnswerKey', JSON.stringify(answerKey));
      } catch (_) {
        // ignore
      }
    }

    if (window.enhancedAnswerSheet && typeof window.enhancedAnswerSheet.showFeedback === 'function') {
      window.enhancedAnswerSheet.showFeedback('答案已提交，正在跳转评分页', 'success');
    }

    setTimeout(function() {
      window.location.href = 'score-validator.html';
    }, 700);
  };
})();
