// Google Analytics 4 事件埋点
// 3 个核心事件: cta_click, lead_submit, purchase
(function() {
    'use strict';

    // GA4 Measurement ID - 上线前替换为实际 ID
    var GA_ID = window.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

    // 初始化 gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    // 动态加载 GA4 脚本
    if (GA_ID !== 'G-XXXXXXXXXX') {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    // ---- 事件 1: cta_click ----
    // 跟踪所有 CTA 按钮点击（开始测试、计算分数等）
    document.addEventListener('click', function(e) {
        var el = e.target.closest('a.btn-primary, a.btn-secondary, button.btn-primary, #calculate-btn');
        if (!el) return;

        var label = el.textContent.trim().substring(0, 50);
        var href = el.getAttribute('href') || '';

        gtag('event', 'cta_click', {
            cta_text: label,
            cta_url: href,
            page_path: location.pathname
        });
    });

    // ---- 事件 2: lead_submit ----
    // 跟踪答案提交（包装原有 submitAnswers）
    var _origSubmit = window.submitAnswers;
    if (typeof _origSubmit === 'function') {
        window.submitAnswers = function() {
            var testNum = detectTest();
            var storageKey = 'ielts-test' + testNum + '-answers';
            var answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
            var count = Object.keys(answers).length;

            gtag('event', 'lead_submit', {
                test_number: testNum,
                answers_count: count,
                page_path: location.pathname
            });

            return _origSubmit.apply(this, arguments);
        };
    }

    // 延迟绑定：test-init.js 在 DOMContentLoaded 后才定义 submitAnswers
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (window.submitAnswers && window.submitAnswers !== arguments.callee) {
                var orig = window.submitAnswers;
                if (orig._analyticsWrapped) return;
                window.submitAnswers = function() {
                    var testNum = detectTest();
                    var storageKey = 'ielts-test' + testNum + '-answers';
                    var answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    var count = Object.keys(answers).length;

                    gtag('event', 'lead_submit', {
                        test_number: testNum,
                        answers_count: count,
                        page_path: location.pathname
                    });

                    return orig.apply(this, arguments);
                };
                window.submitAnswers._analyticsWrapped = true;
            }
        }, 500);
    });

    // ---- 事件 3: purchase ----
    // 预留接口，供未来付费功能调用
    window.trackPurchase = function(item, value, currency) {
        gtag('event', 'purchase', {
            currency: currency || 'CNY',
            value: value || 0,
            items: [{ item_name: item || 'premium_test' }]
        });
    };

    function detectTest() {
        var m = location.pathname.match(/test(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    }
})();
