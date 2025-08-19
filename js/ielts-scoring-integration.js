// Minimal integration surface for pages wanting a simple API
(function(){
  if (typeof window === 'undefined') return;
  const SE = window.ScoreEngine || {};
  window.IELTSScoring = window.IELTSScoring || {
    calculate: function(userAnswers, answerKey){
      if (SE.calculate) return SE.calculate(userAnswers, answerKey);
      console.warn('[IELTSScoring] ScoreEngine not available');
      return null;
    }
  };
})();
