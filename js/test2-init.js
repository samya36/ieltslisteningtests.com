document.addEventListener('DOMContentLoaded', function() {
  // Initialize Enhanced Audio Player
  if (typeof EnhancedAudioPlayer !== 'undefined') {
    const audioConfig = {
      test2: {
        cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test2/',
        localPath: '../audio/test2/',
        sections: [
          { id: 'section1', title: 'Section 1: Winsham Farm Job', duration: '10:00' },
          { id: 'section2', title: 'Section 2: Queensland Festival', duration: '10:00' },
          { id: 'section3', title: 'Section 3: Environmental Science Course', duration: '10:00' },
          { id: 'section4', title: 'Section 4: Photic Sneezing Reflex', duration: '10:00' }
        ]
      }
    };
    window.enhancedAudioPlayer = new EnhancedAudioPlayer('test2', audioConfig);
  }

  // Generate questions list for answer sheet
  const allQuestions = [];
  for (let i = 1; i <= 10; i++) {
    allQuestions.push({ id: i, section: 1, type: 'text', element: document.getElementById(`q${i}`) });
  }
  for (let i = 11; i <= 20; i++) {
    allQuestions.push({ id: i, section: 2, type: 'radio', name: `q${i}`, options: ['A', 'B', 'C'] });
  }
  for (let i = 21; i <= 24; i++) {
    allQuestions.push({ id: i, section: 3, type: 'radio', name: `q${i}`, options: ['A', 'B', 'C'] });
  }
  // Questions 25-26: Checkbox combined
  allQuestions.push({ id: '25-26', section: 3, type: 'checkbox', name: 'q25-26', options: ['A','B','C','D','E'], multiSelect: 2 });
  for (let i = 27; i <= 30; i++) {
    allQuestions.push({ id: i, section: 3, type: 'radio', name: `q${i}`, options: ['A', 'B', 'C'] });
  }
  for (let i = 31; i <= 40; i++) {
    allQuestions.push({ id: i, section: 4, type: 'text', element: document.getElementById(`q${i}`) });
  }

  if (typeof EnhancedAnswerSheet !== 'undefined') {
    window.enhancedAnswerSheet = new EnhancedAnswerSheet(allQuestions);
  }
  if (typeof EnhancedKeyboardNavigation !== 'undefined') {
    window.keyboardNavigation = new EnhancedKeyboardNavigation();
  }

  // Section Navigation
  const sectionBtns = document.querySelectorAll('.section-btn');
  const testSections = document.querySelectorAll('.test-section');
  sectionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const sectionNum = this.dataset.section;
      sectionBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      testSections.forEach(section => {
        section.classList.remove('active');
        if (section.dataset.section === sectionNum) section.classList.add('active');
      });
      if (window.enhancedAudioPlayer) window.enhancedAudioPlayer.switchToSection(parseInt(sectionNum));
    });
  });

  // Monitor answer changes for answer sheet updates
  document.addEventListener('input', function(e) {
    if (e.target.matches('input[type="text"], input[type="radio"], input[type="checkbox"]')) {
      if (window.enhancedAnswerSheet) window.enhancedAnswerSheet.updateProgress();
    }
  });

  console.log('IELTS Test 2 ready. Press H for help.');

  // Expose submitTest using ScoreEngine
  window.submitTest = function() {
    const userAnswers = {};
    const toKey = (n)=>{ const num=parseInt(String(n),10); const section=Math.min(4, Math.max(1, Math.ceil(num/10))); return `section${section}_${num}`; };
    for (let i=1;i<=40;i++){
      const txt = document.querySelector(`input#q${i}[type="text"]`);
      const r = document.querySelector(`input[name="q${i}"]:checked`);
      if (txt && txt.value.trim()) userAnswers[toKey(i)] = txt.value.trim(); else if (r) userAnswers[toKey(i)] = r.value;
    }
    const multi = Array.from(document.querySelectorAll('input[name="q25-26"]:checked')).map(cb=>cb.value);
    if (multi.length){ userAnswers[toKey(25)] = multi.slice(); userAnswers[toKey(26)] = multi.slice(); }

    const answerKey = {};
    if (typeof getTest2StandardAnswers === 'function'){
      const std = getTest2StandardAnswers();
      Object.entries(std).forEach(([n,ans])=>{ answerKey[toKey(n)] = ans; });
    }

    try { localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); } catch(_){ }
    if (window.ScoreEngine && typeof window.ScoreEngine.calculate === 'function'){
      const scoreResult = window.ScoreEngine.calculate(userAnswers, answerKey);
      try { localStorage.setItem('latestScoreResult', JSON.stringify(scoreResult)); localStorage.setItem('latestAnswerKey', JSON.stringify(answerKey)); } catch(_){ }
    }
    window.location.href = 'score-validator.html';
  };
});

