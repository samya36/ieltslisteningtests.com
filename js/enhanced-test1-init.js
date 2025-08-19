document.addEventListener('DOMContentLoaded', function() {
  if (typeof TEST_DATA !== 'undefined') {
    const allQuestions = [];
    Object.keys(TEST_DATA).forEach(sectionKey => {
      const section = TEST_DATA[sectionKey];
      if (section.questions) {
        section.questions.forEach(q => allQuestions.push(q));
      } else if (section.parts) {
        section.parts.forEach(part => {
          if (part.questions) part.questions.forEach(q => allQuestions.push(q));
        });
      }
    });
    if (typeof enhancedAnswerSheet !== 'undefined' && enhancedAnswerSheet && typeof enhancedAnswerSheet.setQuestions === 'function') {
      enhancedAnswerSheet.setQuestions(allQuestions);
    }
  }

  document.addEventListener('input', function(e) {
    if (e.target.matches('input[type="text"], input[type="radio"]')) {
      const questionId = e.target.id || e.target.name;
      const value = e.target.type === 'radio' ? (e.target.checked ? e.target.value : null) : e.target.value;
      if (window.enhancedAnswerSheet && questionId) enhancedAnswerSheet.updateAnswer(questionId, value);
      updateProgress();
    }
  });

  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const sectionNum = this.dataset.section;
      document.querySelectorAll('.section-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      this.classList.add('active'); this.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.question-container').forEach(c => c.style.display = 'none');
      const activeContent = document.getElementById(`section${sectionNum}-content`);
      if (activeContent) activeContent.style.display = 'block';
      if (window.enhancedAudioPlayer) enhancedAudioPlayer.currentSection = parseInt(sectionNum);
    });
  });

  setTimeout(() => {
    if (window.enhancedAnswerSheet) enhancedAnswerSheet.showFeedback('🎆 增强测试系统已启动！按 H 查看帮助', 'info');
  }, 1500);
});

function updateProgress() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="radio"]:checked');
  const totalQuestions = 40;
  const answeredCount = Array.from(inputs).filter(input => input.type === 'radio' ? input.checked : input.value.trim() !== '').length;
  const percentage = (answeredCount / totalQuestions) * 100;
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  if (progressFill) progressFill.style.width = percentage + '%';
  if (progressText) progressText.textContent = `${answeredCount} / ${totalQuestions} 题已完成`;
}

function resetTest() {
  if (confirm('确定要重新开始测试吗？所有答案将被清除。')) {
    document.querySelectorAll('input').forEach(input => {
      if (input.type === 'radio' || input.type === 'checkbox') input.checked = false; else input.value = '';
    });
    if (window.enhancedAnswerSheet) enhancedAnswerSheet.reset();
    if (window.enhancedAudioPlayer && enhancedAudioPlayer.players) {
      Object.values(enhancedAudioPlayer.players).forEach(player => {
        if (player && player.audio) { player.audio.pause(); player.audio.currentTime = 0; }
      });
    }
    updateProgress();
  }
}

function submitTest() {
  const rawInputs = {};
  document.querySelectorAll('input').forEach(input => {
    if (input.type === 'radio' && input.checked) rawInputs[input.name] = input.value;
    else if (input.type === 'text' && input.value.trim()) rawInputs[input.id] = input.value.trim();
  });

  const userAnswers = {};
  const toKey = (qNum) => { const n = parseInt(String(qNum), 10); const section = Math.min(4, Math.max(1, Math.ceil(n / 10))); return `section${section}_${n}`; };
  Object.entries(rawInputs).forEach(([k, v]) => { const m = String(k).match(/(\d{1,2})/); if (m) userAnswers[toKey(m[1])] = v; });

  const answerKey = {};
  if (typeof standardAnswers !== 'undefined') {
    Object.entries(standardAnswers).forEach(([num, ans]) => { answerKey[toKey(num)] = ans; });
  }

  try { localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); } catch(_){}
  if (window.ScoreEngine && typeof window.ScoreEngine.calculate === 'function') {
    const scoreResult = window.ScoreEngine.calculate(userAnswers, answerKey);
    try { localStorage.setItem('latestScoreResult', JSON.stringify(scoreResult)); localStorage.setItem('latestAnswerKey', JSON.stringify(answerKey)); } catch(_){}
  }
  if (window.enhancedAnswerSheet) enhancedAnswerSheet.showFeedback('答案已提交！即将显示评分', 'success');
  setTimeout(() => { window.location.href = 'score-validator.html'; }, 800);
}

