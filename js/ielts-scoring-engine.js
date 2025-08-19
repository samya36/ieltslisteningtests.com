// Compatibility wrapper for legacy references
(function(){
  if (typeof window !== 'undefined') {
    window.IELTSScoringEngine = window.IELTSScoringEngine || window.ScoreEngine || {};
  }
})();
