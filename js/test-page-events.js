// Attach non-inline event handlers for test pages
(function(){
  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  onReady(function(){
    function bindClick(el, handler){ if (!el) return; el.addEventListener('click', function(e){ e.preventDefault(); try{ handler(); }catch(err){ console.error(err); } }); }
    // Primary IDs
    var btnSubmit = document.getElementById('btn-submit');
    var btnReset = document.getElementById('btn-reset');
    if (btnSubmit && typeof window.submitTest === 'function') bindClick(btnSubmit, window.submitTest);
    if (btnReset && typeof window.resetTest === 'function') bindClick(btnReset, window.resetTest);
    // Fallback selectors for pages using classes or data-action
    if (typeof window.submitTest === 'function') {
      document.querySelectorAll('.submit-btn, [data-action="submit-test"]').forEach(function(el){ bindClick(el, window.submitTest); });
    }
    if (typeof window.resetTest === 'function') {
      document.querySelectorAll('.btn-reset, [data-action="reset-test"]').forEach(function(el){ bindClick(el, window.resetTest); });
    }
  });
})();
