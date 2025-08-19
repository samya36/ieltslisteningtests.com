document.addEventListener('DOMContentLoaded', function(){
  try {
    if (typeof TEST_DATA_5 === 'undefined') throw new Error('TEST_DATA_5 未定义，请确保 test-data-5.js 已正确加载');
    if (typeof cambridge20Test2Answers === 'undefined') throw new Error('cambridge20Test2Answers 未定义，请确保 cambridge20_test2_answers.js 已正确加载');
    if (typeof TestUI === 'undefined') throw new Error('TestUI 类未定义，请确保 test-ui.js 已正确加载');
    window.TEST_DATA = TEST_DATA_5;
    window.standardAnswers = cambridge20Test2Answers;
    window.testUI = new TestUI();
    if (typeof AudioPlayer !== 'undefined') window.audioConfig = 'cambridge20-test2';
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 1000; text-align: center; border-left: 4px solid #e74c3c;';
    const h3 = document.createElement('h3'); h3.style.cssText = 'color: #e74c3c; margin-bottom: 10px;'; h3.textContent = '初始化失败';
    const p = document.createElement('p'); p.style.cssText = 'margin-bottom: 15px; color: #666;'; p.textContent = error.message;
    const button = document.createElement('button'); button.style.cssText = 'padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;'; button.textContent = '刷新页面'; button.onclick = () => location.reload();
    errorDiv.appendChild(h3); errorDiv.appendChild(p); errorDiv.appendChild(button); document.body.appendChild(errorDiv);
  }
});

