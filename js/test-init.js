// 统一测试初始化模块
// 整合音频播放器、Section切换、答案保存等功能
(function() {
    'use strict';

    // 检测当前测试编号
    function detectTestNumber() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('test2')) return 2;
        if (path.includes('test3')) return 3;
        if (path.includes('test4')) return 4;
        if (path.includes('test5')) return 5;
        if (path.includes('test6')) return 6;
        if (path.includes('test7')) return 7;
        return 1; // 默认 test1
    }

    const testNumber = detectTestNumber();
    const storageKey = `ielts-test${testNumber}-answers`;

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        console.log(`IELTS听力测试 ${testNumber} 初始化开始...`);

        // 初始化所有功能
        initAllAudioPlayers();
        initSectionTabs();
        initAnswerSaving();
        loadSavedAnswers();

        console.log(`IELTS听力测试 ${testNumber} 初始化完成`);
    });

    // 初始化所有4个section的音频播放器
    function initAllAudioPlayers() {
        for (let section = 1; section <= 4; section++) {
            initAudioPlayer(section);
        }
        console.log('所有音频播放器初始化完成');
    }

    // 初始化单个section的音频播放器
    function initAudioPlayer(section) {
        const audioPlayer = document.getElementById(`section${section}-player`);
        const playButton = document.getElementById(`section${section}-play`);
        const progressBar = document.getElementById(`section${section}-progress`);
        const timeDisplay = document.getElementById(`section${section}-time`);
        const speedSelect = document.getElementById(`section${section}-speed`);

        if (!audioPlayer || !playButton) {
            console.warn(`Section ${section} 音频播放器元素未找到`);
            return;
        }

        let isPlaying = false;

        // 播放/暂停功能
        playButton.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
            } else {
                // 暂停其他section的音频
                pauseOtherAudios(section);

                audioPlayer.play().then(() => {
                    playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    isPlaying = true;
                }).catch(error => {
                    console.error(`Section ${section} 音频播放失败:`, error);
                    showAudioError(section);
                });
            }
        });

        // 进度条更新
        audioPlayer.addEventListener('timeupdate', function() {
            if (audioPlayer.duration && progressBar) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.value = progress;

                if (timeDisplay) {
                    const current = formatTime(audioPlayer.currentTime);
                    const total = formatTime(audioPlayer.duration);
                    timeDisplay.textContent = current + ' / ' + total;
                }
            }
        });

        // 进度条拖拽
        if (progressBar) {
            progressBar.addEventListener('input', function() {
                if (audioPlayer.duration) {
                    const newTime = (progressBar.value / 100) * audioPlayer.duration;
                    audioPlayer.currentTime = newTime;
                }
            });
        }

        // 播放速度控制
        if (speedSelect) {
            speedSelect.addEventListener('change', function() {
                audioPlayer.playbackRate = parseFloat(speedSelect.value);
            });
        }

        // 音频结束时重置
        audioPlayer.addEventListener('ended', function() {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            if (progressBar) progressBar.value = 0;
        });

        // 音频加载错误
        audioPlayer.addEventListener('error', function(e) {
            console.error(`Section ${section} 音频加载失败:`, e);
            showAudioError(section);
        });

        // 存储播放状态引用
        playButton._isPlaying = () => isPlaying;
        playButton._setPlaying = (state) => { isPlaying = state; };
    }

    // 暂停其他section的音频
    function pauseOtherAudios(currentSection) {
        for (let section = 1; section <= 4; section++) {
            if (section !== currentSection) {
                const audioPlayer = document.getElementById(`section${section}-player`);
                const playButton = document.getElementById(`section${section}-play`);

                if (audioPlayer && !audioPlayer.paused) {
                    audioPlayer.pause();
                    if (playButton) {
                        playButton.innerHTML = '<i class="fas fa-play"></i>';
                        if (playButton._setPlaying) playButton._setPlaying(false);
                    }
                }
            }
        }
    }

    // 显示音频加载错误
    function showAudioError(section) {
        const container = document.getElementById(`section${section}-player-container`);
        if (container && !container.querySelector('.audio-error')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'audio-error';
            errorDiv.innerHTML = `<span>Section ${section} 音频加载失败，请刷新页面重试</span>`;
            errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 5px;';
            container.appendChild(errorDiv);
        }
    }

    // 初始化Section切换
    function initSectionTabs() {
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const sectionNum = parseInt(this.dataset.section);
                switchToSection(sectionNum);
            });
        });
    }

    // 切换到指定Section
    function switchToSection(sectionNum) {
        // 更新标签状态
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.classList.toggle('active', parseInt(tab.dataset.section) === sectionNum);
        });

        // 更新内容显示
        document.querySelectorAll('.section-content').forEach(content => {
            const isActive = parseInt(content.dataset.section) === sectionNum;
            content.style.display = isActive ? 'block' : 'none';
            content.classList.toggle('active', isActive);
        });

        // 更新音频播放器显示
        document.querySelectorAll('.audio-player').forEach(player => {
            player.style.display = 'none';
        });
        const targetPlayer = document.getElementById(`section${sectionNum}-player-container`);
        if (targetPlayer) {
            targetPlayer.style.display = 'block';
        }

        // 暂停其他section的音频
        pauseOtherAudios(sectionNum);

        console.log(`切换到 Section ${sectionNum}`);
    }

    // 初始化答案保存
    function initAnswerSaving() {
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('input', function() {
                saveAnswer(this.dataset.question, this.value);
                this.classList.add('answered');
                const questionItem = this.closest('.question-item');
                if (questionItem) questionItem.classList.add('answered');
            });
        });
    }

    // 保存答案到localStorage
    function saveAnswer(questionId, answer) {
        const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        answers[questionId] = answer;
        localStorage.setItem(storageKey, JSON.stringify(answers));
    }

    // 加载已保存的答案
    function loadSavedAnswers() {
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        Object.keys(savedAnswers).forEach(questionId => {
            const input = document.querySelector(`[data-question="${questionId}"]`);
            if (input) {
                input.value = savedAnswers[questionId];
                input.classList.add('answered');
                const questionItem = input.closest('.question-item');
                if (questionItem) questionItem.classList.add('answered');
            }
        });

        const count = Object.keys(savedAnswers).length;
        if (count > 0) {
            console.log(`已加载 ${count} 个保存的答案`);
        }
    }

    // 时间格式化
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 提交答案（暴露为全局函数）
    window.submitAnswers = function() {
        const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const answeredCount = Object.keys(answers).length;

        if (answeredCount === 0) {
            alert('请先回答一些题目再提交！');
            return;
        }

        const result = `Test ${testNumber} 答题完成！\n\n已完成题目: ${answeredCount}/40\n\n请点击确定查看详细结果。`;
        alert(result);

        console.log('答案已提交:', answers);
    };

    // 暴露切换函数为全局
    window.switchToSection = switchToSection;

})();
