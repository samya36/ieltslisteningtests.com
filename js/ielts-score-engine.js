// Compatibility wrapper for legacy references
// Exposes unified ScoreEngine under IELTSScoreEngine namespace
(function(){
  if (typeof window !== 'undefined') {
    window.IELTSScoreEngine = window.IELTSScoreEngine || window.ScoreEngine || {};
  }
})();
