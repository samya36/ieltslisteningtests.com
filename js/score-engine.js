// Unified IELTS Listening Score Engine
// Provides a centralized scoring API with tolerant matching and partial credit.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ScoreEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Basic band conversion table (raw correct -> IELTS band)
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

  const numberMapping = {
    'one': '1','two': '2','three': '3','four': '4','five': '5',
    'six': '6','seven': '7','eight': '8','nine': '9','ten': '10'
  };

  // Small synonym set; can be extended by pages as window.ScoreEngine.synonyms
  const synonymAnswers = {
    'reception': ['receptionist'],
    'parking': ['car park'],
    'library': ['libraries'],
    'cafeteria': ['café', 'cafe'],
    'gymnasium': ['gym']
  };

  function normalizeAnswer(value) {
    if (value == null) return '';
    let answer = String(value).toLowerCase().trim();
    if (numberMapping[answer]) return numberMapping[answer];
    // collapse multiple spaces and punctuation commonly ignored
    answer = answer.replace(/\s+/g, ' ').replace(/[\.\,\!\?]/g, '').trim();
    return answer;
  }

  function levenshtein(a, b) {
    a = a || ''; b = b || '';
    const m = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) m[i][0] = i;
    for (let j = 0; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        m[i][j] = Math.min(
          m[i - 1][j] + 1,        // deletion
          m[i][j - 1] + 1,        // insertion
          m[i - 1][j - 1] + cost  // substitution
        );
      }
    }
    return m[a.length][b.length];
  }

  function compareFill(userAnswer, correctAnswer) {
    const u = normalizeAnswer(userAnswer);
    const c = normalizeAnswer(correctAnswer);
    if (!c) return { score: 0, status: 'unanswered' };
    if (u === c) return { score: 1, status: 'correct' };
    const syns = (synonymAnswers[c] || []).concat((ScoreEngine.synonyms && ScoreEngine.synonyms[c]) || []);
    if (syns.includes(u)) return { score: 1, status: 'correct' };
    const dist = levenshtein(u, c);
    if (u && dist <= 2) return { score: 0.8, status: 'partial' };
    return { score: u ? 0 : 0, status: u ? 'incorrect' : 'unanswered' };
  }

  function compareChoice(userAnswers, correctAnswers) {
    const ua = Array.isArray(userAnswers) ? userAnswers.map(normalizeAnswer) : [normalizeAnswer(userAnswers)];
    const ca = Array.isArray(correctAnswers) ? correctAnswers.map(normalizeAnswer) : [normalizeAnswer(correctAnswers)];
    const set = new Set(ca);
    let correctCount = 0;
    ua.forEach(v => { if (set.has(v)) correctCount++; });
    const score = Math.min(correctCount * 0.5, 1);
    return { score, status: score === 1 ? 'correct' : score > 0 ? 'partial' : (ua[0] ? 'incorrect' : 'unanswered') };
  }

  function toBand(rawCorrect) {
    const k = Math.max(0, Math.min(40, Math.round(rawCorrect)));
    if (listeningScoreTable.hasOwnProperty(k)) return listeningScoreTable[k];
    // fallback simple interpolation
    if (k >= 35) return 8 + (k - 35) * 0.2;
    if (k >= 30) return 7 + (k - 30) * 0.2;
    if (k >= 23) return 6 + (k - 23) * 0.1;
    if (k >= 16) return 5 + (k - 16) * 0.1;
    return 2 + k * 0.1;
  }

  function calculate(userAnswers, answerKey) {
    const result = {
      totalScore: 0,
      bandScore: 0,
      sectionScores: { section1: 0, section2: 0, section3: 0, section4: 0 },
      sectionAnalysis: { section1: [], section2: [], section3: [], section4: [] },
      problemAreas: []
    };

    const sections = [1,2,3,4];
    sections.forEach(s => {
      const prefix = `section${s}_`;
      const keys = Object.keys(userAnswers || {}).filter(k => k.startsWith(prefix));
      let sum = 0;
      keys.forEach(k => {
        const qNum = k.split('_')[1];
        const u = userAnswers[k];
        const c = answerKey ? answerKey[k] : undefined;
        let r;
        if (Array.isArray(c) || Array.isArray(u)) {
          r = compareChoice(u, c);
        } else {
          r = compareFill(u, c);
        }
        sum += r.score;
        result.sectionAnalysis[`section${s}`].push({
          questionKey: k,
          questionNumber: qNum,
          userAnswer: Array.isArray(u) ? u.join(', ') : (u ?? ''),
          correctAnswer: Array.isArray(c) ? (c || []).join(', ') : (c ?? ''),
          status: r.status,
          score: r.score
        });
      });
      result.sectionScores[`section${s}`] = sum;
      result.totalScore += sum;
    });

    // derive raw-correct approximation from partial scores
    const rawCorrect = Math.round(result.totalScore);
    result.bandScore = toBand(rawCorrect);

    // derive simple problem areas
    const spelling = [];
    Object.values(result.sectionAnalysis).forEach(arr => {
      arr.forEach(q => {
        if (q.status === 'partial') {
          const d = levenshtein(normalizeAnswer(q.userAnswer), normalizeAnswer(q.correctAnswer));
          if (d <= 2) spelling.push(q.questionNumber);
        }
      });
    });
    if (spelling.length) {
      result.problemAreas.push(`可能存在拼写问题的题目: ${spelling.join(', ')}`);
    }

    return result;
  }

  const api = { calculate, normalizeAnswer };
  return api;
});

