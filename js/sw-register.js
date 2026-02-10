// 轻量 Service Worker 注册器：延迟到页面稳定后再执行，避免首屏阻塞
(function() {
    'use strict';

    if (!('serviceWorker' in navigator)) {
        return;
    }

    function registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none'
        }).catch(function(error) {
            console.warn('Service Worker 注册失败:', error);
        });
    }

    window.addEventListener('load', function() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(registerServiceWorker, { timeout: 5000 });
            return;
        }

        setTimeout(registerServiceWorker, 1500);
    });
})();
