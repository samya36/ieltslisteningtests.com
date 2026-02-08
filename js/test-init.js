// 统一测试初始化模块
// 整合音频播放器、Section切换、答案保存等功能
(function() {
    'use strict';

    function detectTestNumber() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('test2')) return 2;
        if (path.includes('test3')) return 3;
        if (path.includes('test4')) return 4;
        if (path.includes('test5')) return 5;
        if (path.includes('test6')) return 6;
        if (path.includes('test7')) return 7;
        return 1;
    }

    const testNumber = detectTestNumber();
    const storageKey = `ielts-test${testNumber}-answers`;

    const TEST_AUDIO_CONFIG = {
        1: {
            localPath: '../audio/test1/',
            absolutePath: '/audio/test1/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test1/',
            files: [
                'Part1 Amateur Dramatic Society.m4a',
                'Part2 Talk to new employees at a strawberry farm.m4a',
                'Part3-Field trip to Bolton lsland.m4a',
                'Part4 Development and use of plastics.m4a'
            ]
        },
        2: {
            localPath: '../audio/test2/',
            absolutePath: '/audio/test2/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test2/',
            files: [
                'Part1 Rental Property Application Form.m4a',
                'Part2 Queensland Festival.m4a',
                'Part3-Research for assignment of children playing outdoors.m4a',
                'Part4 The Berbers.m4a'
            ]
        },
        3: {
            localPath: '../audio/test3/',
            absolutePath: '/audio/test3/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test3/',
            files: [
                'Part1 Kiwi Air Customer Complaint Form.m4a',
                'Part2 Spring Festival.m4a',
                'Part3-Geology field trip to Iceland.m4a',
                'Part4 Recycling Tyres in Australia.m4a'
            ]
        },
        4: {
            localPath: '../audio/test4/',
            absolutePath: '/audio/test4/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test4/',
            files: ['Part1_Windward_Apartments.m4a', 'Part2.m4a', 'Part3.m4a', 'Part4.m4a']
        },
        5: {
            localPath: '../audio/test5/',
            absolutePath: '/audio/test5/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test5/',
            files: [
                'test5_Part1_Winsham_Farm.m4a',
                'test5_Part2_Queensland_Festival.m4a',
                'test5_Part3_Environmental_Science_Course.m4a',
                'test5_Part4_Photic_Sneezing.m4a'
            ]
        },
        6: {
            localPath: '../audio/test6/',
            absolutePath: '/audio/test6/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/test6/',
            files: [
                'Part1_Amateur_Dramatic_Society.m4a',
                'Part2_Clifton_Bird_Park.m4a',
                'Part3.m4a',
                'Part4.m4a'
            ]
        },
        7: {
            localPath: '../audio/c20-test4/',
            absolutePath: '/audio/c20-test4/',
            cdnPath: 'https://cdn.jsdelivr.net/gh/xjy-git/audio@main/c20-test4/',
            files: ['c20_T4S1_48k.mp3', 'c20_T4S2_48k.mp3', 'c20_T4S3_48k.mp3', 'c20_T4S4_48k.mp3']
        }
    };

    const audioRecoveryState = {};
    const audioBoostState = {};
    let swUpdateInFlight = false;

    document.addEventListener('DOMContentLoaded', function() {
        console.log(`IELTS听力测试 ${testNumber} 初始化开始...`);

        initAllAudioPlayers();
        initSectionTabs();
        initAnswerSaving();
        loadSavedAnswers();
        checkServiceWorkerUpdate();

        console.log(`IELTS听力测试 ${testNumber} 初始化完成`);
    });

    function initAllAudioPlayers() {
        for (let section = 1; section <= 4; section++) {
            initAudioPlayer(section);
        }
        console.log('所有音频播放器初始化完成');
    }

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

        initializeRecoveryState(section, audioPlayer);
        let isPlaying = false;

        playButton.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
                return;
            }

            pauseOtherAudios(section);
            ensureAudioBoost(section, audioPlayer);

            audioPlayer.play().then(function() {
                clearAudioError(section);
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
            }).catch(function(error) {
                console.error(`Section ${section} 音频播放失败:`, error);
                attemptAudioRecovery(section, audioPlayer, true).then(function(recovered) {
                    if (!recovered) {
                        showAudioError(section, true);
                    }
                });
            });
        });

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

        if (progressBar) {
            progressBar.addEventListener('input', function() {
                if (audioPlayer.duration) {
                    const newTime = (progressBar.value / 100) * audioPlayer.duration;
                    audioPlayer.currentTime = newTime;
                }
            });
        }

        if (speedSelect) {
            speedSelect.addEventListener('change', function() {
                audioPlayer.playbackRate = parseFloat(speedSelect.value);
            });
        }

        audioPlayer.addEventListener('ended', function() {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            if (progressBar) progressBar.value = 0;
        });

        audioPlayer.addEventListener('canplay', function() {
            clearAudioError(section);
            resetRecoveryState(section, audioPlayer);
        });

        audioPlayer.addEventListener('error', function(event) {
            console.error(`Section ${section} 音频加载失败:`, event);
            attemptAudioRecovery(section, audioPlayer, isPlaying).then(function(recovered) {
                if (!recovered) {
                    showAudioError(section, false);
                }
            });
        });

        playButton._isPlaying = function() {
            return isPlaying;
        };
        playButton._setPlaying = function(state) {
            isPlaying = state;
        };
    }

    function initializeRecoveryState(section, audioPlayer) {
        audioRecoveryState[section] = {
            attempts: 0,
            maxAttempts: 8,
            recovering: false,
            candidates: buildAudioCandidates(section, audioPlayer)
        };
    }

    function resetRecoveryState(section, audioPlayer) {
        if (!audioRecoveryState[section]) {
            initializeRecoveryState(section, audioPlayer);
            return;
        }

        audioRecoveryState[section].attempts = 0;
        audioRecoveryState[section].recovering = false;
        audioRecoveryState[section].candidates = buildAudioCandidates(section, audioPlayer);
    }

    function buildAudioCandidates(section, audioPlayer) {
        const config = TEST_AUDIO_CONFIG[testNumber];
        const candidates = [];

        const currentAttrSrc = audioPlayer.getAttribute('src');
        const currentSrc = audioPlayer.currentSrc;

        [currentAttrSrc, currentSrc].forEach(function(src) {
            const normalized = normalizeAudioUrl(src);
            if (normalized) {
                candidates.push(normalized);
            }
        });

        if (config && config.files && config.files[section - 1]) {
            const fileName = config.files[section - 1];
            const encodedFileName = encodeURIComponent(fileName);

            [
                config.localPath + encodedFileName,
                config.localPath + fileName,
                config.absolutePath + encodedFileName,
                config.absolutePath + fileName,
                config.cdnPath + encodedFileName,
                config.cdnPath + fileName
            ].forEach(function(url) {
                if (url) candidates.push(url);
            });
        }

        const unique = [];
        candidates.forEach(function(item) {
            if (!item) return;
            const cleaned = stripQuery(item);
            if (!unique.some(function(existing) { return stripQuery(existing) === cleaned; })) {
                unique.push(item);
            }
        });

        return unique;
    }

    function normalizeAudioUrl(src) {
        if (!src) return '';

        try {
            const url = new URL(src, window.location.href);
            if (url.origin === window.location.origin) {
                return url.pathname;
            }
            return url.href;
        } catch (_) {
            return src;
        }
    }

    function stripQuery(url) {
        return String(url).split('?')[0];
    }

    function withCacheBust(url, attempt) {
        const base = stripQuery(url);
        const separator = base.includes('?') ? '&' : '?';
        return `${base}${separator}sw-retry=${Date.now()}-${attempt}`;
    }

    async function attemptAudioRecovery(section, audioPlayer, resumeAfterLoad) {
        const state = audioRecoveryState[section] || {
            attempts: 0,
            maxAttempts: 8,
            recovering: false,
            candidates: buildAudioCandidates(section, audioPlayer)
        };

        audioRecoveryState[section] = state;

        if (state.recovering) {
            return true;
        }

        if (state.candidates.length === 0) {
            state.candidates = buildAudioCandidates(section, audioPlayer);
        }

        if (state.attempts >= Math.min(state.maxAttempts, state.candidates.length)) {
            return false;
        }

        state.recovering = true;
        const source = state.candidates[state.attempts];
        const nextSrc = withCacheBust(source, state.attempts + 1);
        state.attempts += 1;

        showRecoveringStatus(section, state.attempts, state.candidates.length);
        triggerServiceWorkerUpdate();

        audioPlayer.src = nextSrc;
        audioPlayer.load();

        if (resumeAfterLoad) {
            audioPlayer.addEventListener('canplay', function onCanPlay() {
                audioPlayer.removeEventListener('canplay', onCanPlay);
                audioPlayer.play().catch(function(error) {
                    console.warn(`Section ${section} 恢复后自动播放失败:`, error);
                });
            });
        }

        window.setTimeout(function() {
            state.recovering = false;
        }, 300);

        return true;
    }

    function showRecoveringStatus(section, attempt, total) {
        const container = document.getElementById(`section${section}-player-container`);
        if (!container) return;

        let statusDiv = container.querySelector('.audio-recovering');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'audio-recovering';
            statusDiv.style.cssText = 'color:#856404;font-size:12px;margin-top:6px;';
            container.appendChild(statusDiv);
        }

        statusDiv.textContent = `Section ${section} 音频异常，正在自动恢复 (${attempt}/${total})...`;
    }

    function clearAudioError(section) {
        const container = document.getElementById(`section${section}-player-container`);
        if (!container) return;

        const errorDiv = container.querySelector('.audio-error');
        if (errorDiv) errorDiv.remove();

        const recoveringDiv = container.querySelector('.audio-recovering');
        if (recoveringDiv) recoveringDiv.remove();
    }

    function showAudioError(section, playFailed) {
        const container = document.getElementById(`section${section}-player-container`);
        if (!container) return;

        clearAudioError(section);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'audio-error';
        errorDiv.style.cssText = 'color:#dc3545;font-size:12px;margin-top:6px;';
        errorDiv.textContent = playFailed
            ? `Section ${section} 音频播放失败，自动恢复未成功，请稍后重试。`
            : `Section ${section} 音频加载失败，自动恢复已尝试，请稍后重试。`;
        container.appendChild(errorDiv);
    }

    function ensureAudioBoost(section, audioPlayer) {
        audioPlayer.volume = 1;

        if (audioBoostState[section]) {
            const existing = audioBoostState[section];
            if (existing.context && existing.context.state === 'suspended') {
                existing.context.resume().catch(function() {
                    // ignore
                });
            }
            return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }

        try {
            const context = new AudioContextClass();
            const source = context.createMediaElementSource(audioPlayer);
            const compressor = context.createDynamicsCompressor();
            const gain = context.createGain();

            compressor.threshold.value = -24;
            compressor.knee.value = 30;
            compressor.ratio.value = 8;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;
            gain.gain.value = 1.5;

            source.connect(compressor);
            compressor.connect(gain);
            gain.connect(context.destination);

            if (context.state === 'suspended') {
                context.resume().catch(function() {
                    // ignore
                });
            }

            audioBoostState[section] = { context: context, gain: gain };
        } catch (error) {
            console.warn(`Section ${section} 音量增强初始化失败:`, error);
        }
    }

    function pauseOtherAudios(currentSection) {
        for (let section = 1; section <= 4; section++) {
            if (section === currentSection) continue;

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

    function initSectionTabs() {
        document.querySelectorAll('.section-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                const sectionNum = parseInt(this.dataset.section, 10);
                switchToSection(sectionNum);
            });
        });
    }

    function switchToSection(sectionNum) {
        document.querySelectorAll('.section-tab').forEach(function(tab) {
            tab.classList.toggle('active', parseInt(tab.dataset.section, 10) === sectionNum);
        });

        document.querySelectorAll('.section-content').forEach(function(content) {
            const isActive = parseInt(content.dataset.section, 10) === sectionNum;
            content.style.display = isActive ? 'block' : 'none';
            content.classList.toggle('active', isActive);
        });

        document.querySelectorAll('.audio-player').forEach(function(player) {
            player.style.display = 'none';
        });

        const targetPlayer = document.getElementById(`section${sectionNum}-player-container`);
        if (targetPlayer) {
            targetPlayer.style.display = 'block';
        }

        pauseOtherAudios(sectionNum);
        console.log(`切换到 Section ${sectionNum}`);
    }

    function initAnswerSaving() {
        document.querySelectorAll('.answer-input').forEach(function(input) {
            if (input.type === 'text') {
                input.addEventListener('input', function() {
                    saveTextAnswer(this.dataset.question, this.value);
                    this.classList.toggle('answered', this.value.trim() !== '');
                    const questionItem = this.closest('.question-item');
                    if (questionItem) questionItem.classList.toggle('answered', this.value.trim() !== '');
                });
                return;
            }

            input.addEventListener('change', function() {
                saveChoiceAnswer(this.dataset.question, this.type);
                const questionItem = this.closest('.question-item');
                if (questionItem) questionItem.classList.add('answered');
            });
        });
    }

    function saveTextAnswer(questionId, answer) {
        if (!questionId) return;
        const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        answers[questionId] = answer;
        localStorage.setItem(storageKey, JSON.stringify(answers));
    }

    function saveChoiceAnswer(questionId, inputType) {
        if (!questionId) return;

        const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (inputType === 'radio') {
            const checked = Array.from(document.querySelectorAll('.answer-input[type="radio"]')).find(function(input) {
                return input.dataset.question === questionId && input.checked;
            });
            answers[questionId] = checked ? checked.value : '';
        } else if (inputType === 'checkbox') {
            answers[questionId] = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                .filter(function(input) {
                    return input.dataset.question === questionId && input.checked;
                })
                .map(function(input) {
                    return input.value;
                });
        }

        localStorage.setItem(storageKey, JSON.stringify(answers));
    }

    function loadSavedAnswers() {
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');

        document.querySelectorAll('.answer-input').forEach(function(input) {
            const questionId = input.dataset.question;
            if (!questionId || !(questionId in savedAnswers)) return;

            const saved = savedAnswers[questionId];

            if (input.type === 'text') {
                input.value = saved;
                input.classList.toggle('answered', String(saved).trim() !== '');
            } else if (input.type === 'radio') {
                input.checked = input.value === saved;
            } else if (input.type === 'checkbox') {
                input.checked = Array.isArray(saved) ? saved.includes(input.value) : false;
            }

            const questionItem = input.closest('.question-item');
            if (questionItem) questionItem.classList.add('answered');
        });

        const count = Object.keys(savedAnswers).length;
        if (count > 0) {
            console.log(`已加载 ${count} 个保存的答案`);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    async function checkServiceWorkerUpdate() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.getRegistration('/');
            if (registration) {
                await registration.update();
            }
        } catch (error) {
            console.warn('Service Worker 更新检查失败:', error);
        }
    }

    async function triggerServiceWorkerUpdate() {
        if (!('serviceWorker' in navigator) || swUpdateInFlight) return;
        swUpdateInFlight = true;

        try {
            const registration = await navigator.serviceWorker.getRegistration('/');
            if (registration) {
                await registration.update();
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'UPDATE_SW' });
                }
            }
        } catch (error) {
            console.warn('Service Worker 强制更新失败:', error);
        } finally {
            window.setTimeout(function() {
                swUpdateInFlight = false;
            }, 3000);
        }
    }

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

    window.switchToSection = switchToSection;
})();
