// 统一测试初始化模块
// 整合音频播放器、Section切换、答案保存等功能
(function() {
    'use strict';

    function detectTestNumber() {
        var path = window.location.pathname.toLowerCase();
        var m = path.match(/test(\d+)/);
        if (m) return parseInt(m[1], 10);
        return 1;
    }

    const testNumber = detectTestNumber();
    const storageKey = `ielts-test${testNumber}-answers`;
    const resultStorageKey = `ielts-test${testNumber}-result`;
    const AUDIO_R2_BASE_URL = 'https://audio.ieltslisteningtests.com/audio/';
    const defaultListeningScoreTable = {
        40: 9.0,
        39: 9.0,
        38: 8.5,
        37: 8.5,
        36: 8.0,
        35: 8.0,
        34: 7.5,
        33: 7.5,
        32: 7.0,
        31: 7.0,
        30: 7.0,
        29: 6.5,
        28: 6.5,
        27: 6.5,
        26: 6.0,
        25: 6.0,
        24: 6.0,
        23: 6.0,
        22: 5.5,
        21: 5.5,
        20: 5.5,
        19: 5.0,
        18: 5.0,
        17: 5.0,
        16: 5.0,
        15: 4.5,
        14: 4.5,
        13: 4.5,
        12: 4.0,
        11: 4.0,
        10: 4.0,
        9: 3.5,
        8: 3.5,
        7: 3.5,
        6: 3.5,
        5: 3.0,
        4: 3.0,
        3: 2.5,
        2: 2.0,
        1: 1.0,
        0: 0.0
    };

    const TEST_AUDIO_CONFIG = {
        1: {
            localPath: `${AUDIO_R2_BASE_URL}test1/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test1/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test1/`,
            files: [
                'Part1 Amateur Dramatic Society.m4a',
                'Part2 Talk to new employees at a strawberry farm.m4a',
                'Part3-Field trip to Bolton lsland.m4a',
                'Part4 Development and use of plastics.m4a'
            ]
        },
        2: {
            localPath: `${AUDIO_R2_BASE_URL}test2/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test2/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test2/`,
            files: [
                'Part1 Rental Property Application Form.m4a',
                'Part2 Queensland Festival.m4a',
                'Part3-Research for assignment of children playing outdoors.m4a',
                'Part4 The Berbers.m4a'
            ]
        },
        3: {
            localPath: `${AUDIO_R2_BASE_URL}test3/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test3/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test3/`,
            files: [
                'Part1 Kiwi Air Customer Complaint Form.m4a',
                'Part2 Spring Festival.m4a',
                'Part3-Geology field trip to Iceland.m4a',
                'Part4 Recycling Tyres in Australia.m4a'
            ]
        },
        4: {
            localPath: `${AUDIO_R2_BASE_URL}test4/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test4/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test4/`,
            files: ['Part1_Windward_Apartments.m4a', 'Part2.m4a', 'Part3.m4a', 'Part4.m4a']
        },
        5: {
            localPath: `${AUDIO_R2_BASE_URL}test5/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test5/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test5/`,
            files: [
                'test5_Part1_Winsham_Farm.m4a',
                'test5_Part2_Queensland_Festival.m4a',
                'test5_Part3_Environmental_Science_Course.m4a',
                'test5_Part4_Photic_Sneezing.m4a'
            ]
        },
        6: {
            localPath: `${AUDIO_R2_BASE_URL}test6/`,
            absolutePath: `${AUDIO_R2_BASE_URL}test6/`,
            cdnPath: `${AUDIO_R2_BASE_URL}test6/`,
            files: [
                'Part1_Amateur_Dramatic_Society.m4a',
                'Part2_Clifton_Bird_Park.m4a',
                'Part3.m4a',
                'Part4.m4a'
            ]
        },
        7: {
            localPath: `${AUDIO_R2_BASE_URL}c20-test4/`,
            absolutePath: `${AUDIO_R2_BASE_URL}c20-test4/`,
            cdnPath: `${AUDIO_R2_BASE_URL}c20-test4/`,
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
        injectGlobalSubmitButton();
        bindResultModal();
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

        applyPreferredAudioSource(section, audioPlayer);
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
            const remote = toR2AudioUrl(src);
            if (remote) {
                candidates.push(remote);
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

    function toR2AudioUrl(src) {
        if (!src) return '';
        const value = String(src);
        if (value.startsWith(AUDIO_R2_BASE_URL)) return value;

        const match = value.match(/(?:https?:\/\/[^/]+)?(?:\.\.\/|\/)?audio\/(.+)$/);
        if (!match) return '';

        return `${AUDIO_R2_BASE_URL}${match[1]}`;
    }

    function getConfiguredRemoteAudioUrl(section, config) {
        if (!config || !config.files || !config.files[section - 1] || !config.cdnPath) return '';
        return config.cdnPath + encodeURIComponent(config.files[section - 1]);
    }

    function applyPreferredAudioSource(section, audioPlayer) {
        const config = TEST_AUDIO_CONFIG[testNumber];
        const currentAttrSrc = audioPlayer.getAttribute('src') || '';
        const preferredSrc =
            getConfiguredRemoteAudioUrl(section, config) ||
            toR2AudioUrl(currentAttrSrc) ||
            toR2AudioUrl(audioPlayer.currentSrc);

        if (!preferredSrc) return;

        if (!audioPlayer.getAttribute('data-local-src') && currentAttrSrc) {
            audioPlayer.setAttribute('data-local-src', currentAttrSrc);
        }

        if (stripQuery(currentAttrSrc) !== stripQuery(preferredSrc)) {
            audioPlayer.src = preferredSrc;
        }
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
            if (input.dataset.answerBound === 'true') return;
            input.dataset.answerBound = 'true';

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

    function readGlobalBinding(name) {
        if (!name) return undefined;
        if (typeof window[name] !== 'undefined') return window[name];

        try {
            return Function(`return typeof ${name} !== "undefined" ? ${name} : undefined;`)();
        } catch (_) {
            return undefined;
        }
    }

    function getAnswerKeyForTest() {
        return readGlobalBinding(`standardAnswers${testNumber}`) || readGlobalBinding('standardAnswers');
    }

    function getListeningScoreTableForTest() {
        return (
            readGlobalBinding(`listeningScoreTable${testNumber}`) ||
            readGlobalBinding('listeningScoreTable') ||
            defaultListeningScoreTable
        );
    }

    function parseQuestionRange(key) {
        const text = String(key).trim();
        const rangeMatch = text.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
            return {
                start: parseInt(rangeMatch[1], 10),
                end: parseInt(rangeMatch[2], 10)
            };
        }

        const numberMatch = text.match(/^(\d+)$/);
        if (numberMatch) {
            const value = parseInt(numberMatch[1], 10);
            return { start: value, end: value };
        }

        return null;
    }

    function normalizeText(value) {
        if (value === null || value === undefined) return '';

        return String(value)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/^[,.;:()\[\]\s]+|[,.;:()\[\]\s]+$/g, '');
    }

    function parseAlternatives(value) {
        if (Array.isArray(value)) {
            return value.map(normalizeText).filter(Boolean);
        }

        const text = String(value === null || value === undefined ? '' : value);
        if (!text.trim()) return [];

        return text
            .split(/\s*\/\s*|\s*\|\s*|\s*;\s*/)
            .map(normalizeText)
            .filter(Boolean);
    }

    function splitExpectedRangeValues(expected, count) {
        if (Array.isArray(expected)) {
            if (expected.length === count) return expected;
            return expected.slice(0, count);
        }

        const alternatives = parseAlternatives(expected);
        if (alternatives.length === count) return alternatives;

        const compact = normalizeText(expected).replace(/\s+/g, '');
        if (compact.length === count) {
            return compact.split('');
        }

        return [];
    }

    function stringifyAnswer(value) {
        if (Array.isArray(value)) return value.join(', ');
        return value === null || value === undefined ? '' : String(value);
    }

    function expandAnswerKey(answerKey) {
        const entries = [];

        Object.entries(answerKey || {}).forEach(function(entry) {
            const key = entry[0];
            const expected = entry[1];
            const range = parseQuestionRange(key);

            if (!range) return;

            if (range.start !== range.end) {
                const values = splitExpectedRangeValues(expected, range.end - range.start + 1);
                for (let questionNumber = range.start; questionNumber <= range.end; questionNumber++) {
                    const index = questionNumber - range.start;
                    entries.push({
                        questionNumber: questionNumber,
                        sourceKey: key,
                        expected: values[index] !== undefined ? values[index] : expected
                    });
                }
                return;
            }

            entries.push({
                questionNumber: range.start,
                sourceKey: key,
                expected: expected
            });
        });

        return entries.sort(function(a, b) {
            return a.questionNumber - b.questionNumber;
        });
    }

    function getUserAnswerForEntry(entry, answers) {
        if (Object.prototype.hasOwnProperty.call(answers, entry.sourceKey)) {
            return answers[entry.sourceKey];
        }

        const numericKey = String(entry.questionNumber);
        if (Object.prototype.hasOwnProperty.call(answers, numericKey)) {
            return answers[numericKey];
        }

        return '';
    }

    function isAnswered(value) {
        if (Array.isArray(value)) return value.length > 0;
        return normalizeText(value) !== '';
    }

    function compareAnswer(userAnswer, expected) {
        if (Array.isArray(expected)) {
            const expectedValues = expected.map(normalizeText).filter(Boolean);
            const actualValues = Array.isArray(userAnswer)
                ? userAnswer.map(normalizeText).filter(Boolean)
                : parseAlternatives(userAnswer);

            if (actualValues.length === 0 || expectedValues.length === 0) return false;
            return expectedValues.every(function(item) {
                return actualValues.includes(item);
            });
        }

        const expectedAlternatives = parseAlternatives(expected);
        if (expectedAlternatives.length === 0) return false;

        if (Array.isArray(userAnswer)) {
            const actualValues = userAnswer.map(normalizeText).filter(Boolean);
            return actualValues.some(function(item) {
                return expectedAlternatives.includes(item);
            });
        }

        return expectedAlternatives.includes(normalizeText(userAnswer));
    }

    function getSectionForQuestion(questionNumber) {
        if (questionNumber <= 10) return 1;
        if (questionNumber <= 20) return 2;
        if (questionNumber <= 30) return 3;
        return 4;
    }

    function countAnsweredQuestions(entries, answers) {
        return entries.filter(function(entry) {
            return isAnswered(getUserAnswerForEntry(entry, answers));
        }).length;
    }

    function lookupBandScore(correctCount, table) {
        const safeScore = Math.max(0, Math.min(40, parseInt(correctCount, 10) || 0));
        if (Object.prototype.hasOwnProperty.call(table, safeScore)) {
            return table[safeScore];
        }
        return defaultListeningScoreTable[safeScore] || 0;
    }

    function buildImprovementTips(sectionScores, answeredCount) {
        const tips = [];

        if (answeredCount < 40) {
            tips.push(`还有 ${40 - answeredCount} 题未作答，建议优先优化时间分配。`);
        }

        Object.keys(sectionScores).forEach(function(key) {
            const section = sectionScores[key];
            const accuracy = section.total === 0 ? 0 : section.correct / section.total;
            if (accuracy < 0.6) {
                tips.push(`Section ${section.section} 正确率偏低，建议回放该部分音频并复盘干扰项。`);
            }
        });

        if (tips.length === 0) {
            tips.push('整体表现稳定，建议继续通过限时练习巩固节奏与拼写准确率。');
        }

        return tips;
    }

    function renderSectionResults(result) {
        const sectionResultsContainer = document.getElementById('section-results');
        if (!sectionResultsContainer) return;

        const html = result.sectionOrder.map(function(sectionKey) {
            const section = result.sectionScores[sectionKey];
            const detailsHtml = section.details.map(function(detail) {
                return `<div class="question-result ${detail.status}">
                    <div class="question-result__head">
                        <span class="question-result__number">Q${detail.questionNumber}</span>
                        <span class="question-result__status">${detail.status === 'correct' ? '对' : (detail.status === 'unanswered' ? '未答' : '错')}</span>
                    </div>
                    <div class="question-result__meta">你的答案：${escapeHtml(detail.userAnswer || '未作答')}</div>
                    <div class="question-result__meta">正确答案：${escapeHtml(detail.correctAnswer)}</div>
                </div>`;
            }).join('');

            return `<div class="section-result">
                <span class="section-name">Section ${section.section}</span>
                <span class="section-score">${section.correct}/${section.total}</span>
            </div>
            <div class="question-results">${detailsHtml}</div>`;
        }).join('');

        const tipsHtml = result.tips.map(function(tip) {
            return `<li>${escapeHtml(tip)}</li>`;
        }).join('');

        sectionResultsContainer.innerHTML = `${html}
            <div class="result-suggestions">
                <h4>改进建议</h4>
                <ul>${tipsHtml}</ul>
            </div>`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showResultModal() {
        const modal = document.getElementById('result-modal');
        if (modal) modal.classList.add('show');
    }

    function hideResultModal() {
        const modal = document.getElementById('result-modal');
        if (modal) modal.classList.remove('show');
    }

    function bindResultModal() {
        const modal = document.getElementById('result-modal');
        const closeButton = document.getElementById('close-result');
        const retryButton = document.getElementById('retry-btn');

        if (closeButton && closeButton.dataset.bound !== 'true') {
            closeButton.dataset.bound = 'true';
            closeButton.addEventListener('click', hideResultModal);
        }

        if (modal && modal.dataset.bound !== 'true') {
            modal.dataset.bound = 'true';
            modal.addEventListener('click', function(event) {
                if (event.target === modal) hideResultModal();
            });
        }

        if (retryButton && retryButton.dataset.bound !== 'true') {
            retryButton.dataset.bound = 'true';
            retryButton.addEventListener('click', function() {
                const confirmed = window.confirm('重新测试会清除当前答案和成绩，是否继续？');
                if (!confirmed) return;

                localStorage.removeItem(storageKey);
                localStorage.removeItem(resultStorageKey);
                window.location.reload();
            });
        }
    }

    function injectGlobalSubmitButton() {
        if (document.getElementById('submit-all-answers-btn')) return;

        const sectionTabs = document.querySelector('.section-tabs');
        if (!sectionTabs || !sectionTabs.parentNode) return;

        const actionWrap = document.createElement('div');
        actionWrap.className = 'test-actions';
        actionWrap.innerHTML = '<button type="button" class="submit-answers-btn submit-all-answers-btn" id="submit-all-answers-btn">提交全部答案</button>';
        sectionTabs.parentNode.insertBefore(actionWrap, sectionTabs.nextSibling);

        const button = document.getElementById('submit-all-answers-btn');
        if (button) {
            button.addEventListener('click', function() {
                window.submitAnswers();
            });
        }
    }

    window.saveSectionAnswers = function(sectionNum) {
        const sectionElement = document.getElementById(`section-${sectionNum}`);
        if (!sectionElement) return;

        const answeredCount = Array.from(sectionElement.querySelectorAll('.answer-input')).filter(function(input) {
            if (input.type === 'radio' || input.type === 'checkbox') return input.checked;
            return String(input.value || '').trim() !== '';
        }).length;

        localStorage.setItem(
            `ielts-test${testNumber}-section${sectionNum}-savedAt`,
            JSON.stringify({ answeredCount: answeredCount, savedAt: Date.now() })
        );

        const button = sectionElement.querySelector('.section-save-btn');
        if (button) {
            const originalText = button.textContent;
            button.textContent = `Section ${sectionNum} 已保存`;
            window.setTimeout(function() {
                button.textContent = originalText;
            }, 1200);
        }
    };

    window.submitAnswers = function() {
        const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const answerKey = getAnswerKeyForTest();

        if (!answerKey) {
            alert(`Test ${testNumber} 的标准答案尚未加载，无法评分。`);
            return;
        }

        const entries = expandAnswerKey(answerKey);
        const answeredCount = countAnsweredQuestions(entries, answers);

        if (answeredCount === 0) {
            alert('请先回答一些题目再提交！');
            return;
        }

        const sectionScores = {
            section1: { section: 1, correct: 0, total: 10, details: [] },
            section2: { section: 2, correct: 0, total: 10, details: [] },
            section3: { section: 3, correct: 0, total: 10, details: [] },
            section4: { section: 4, correct: 0, total: 10, details: [] }
        };

        let correctCount = 0;

        entries.forEach(function(entry) {
            const userAnswer = getUserAnswerForEntry(entry, answers);
            const isCorrect = compareAnswer(userAnswer, entry.expected);
            const sectionKey = `section${getSectionForQuestion(entry.questionNumber)}`;

            if (isCorrect) {
                correctCount += 1;
                sectionScores[sectionKey].correct += 1;
            }

            sectionScores[sectionKey].details.push({
                questionNumber: entry.questionNumber,
                userAnswer: stringifyAnswer(userAnswer),
                correctAnswer: stringifyAnswer(entry.expected),
                status: isAnswered(userAnswer) ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered'
            });
        });

        const listeningScoreTable = getListeningScoreTableForTest();
        const bandScore = lookupBandScore(correctCount, listeningScoreTable);
        const result = {
            correctCount: correctCount,
            answeredCount: answeredCount,
            bandScore: bandScore,
            sectionScores: sectionScores,
            sectionOrder: ['section1', 'section2', 'section3', 'section4'],
            tips: buildImprovementTips(sectionScores, answeredCount),
            submittedAt: new Date().toISOString()
        };

        localStorage.setItem(resultStorageKey, JSON.stringify(result));

        const correctCountEl = document.getElementById('correct-count');
        const ieltsScoreEl = document.getElementById('ielts-score');
        if (correctCountEl) correctCountEl.textContent = String(correctCount);
        if (ieltsScoreEl) ieltsScoreEl.textContent = bandScore.toFixed(1);

        renderSectionResults(result);
        bindResultModal();
        showResultModal();
    };

    window.switchToSection = switchToSection;
})();
