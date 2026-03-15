/* Auto-generated bundle: test-legacy-bundle.js */
// --- js/universal-audio-player.js ---
;(function(){
// 通用音频播放器系统 - 支持所有7套卷子
console.log('🎵 加载通用音频播放器系统...');
const AUDIO_R2_BASE_URL = 'https://audio.ieltslisteningtests.com/audio/';

// 所有测试的音频配置
const UNIVERSAL_AUDIO_CONFIG = {
    test1: {
        basePath: `${AUDIO_R2_BASE_URL}test1/`,
        sections: [
            'Part1 Amateur Dramatic Society.m4a',
            'Part2 Talk to new employees at a strawberry farm.m4a',
            'Part3-Field trip to Bolton lsland.m4a',
            'Part4 Development and use of plastics.m4a'
        ]
    },
    test2: {
        basePath: `${AUDIO_R2_BASE_URL}test2/`,
        sections: [
            'Part1 Rental Property Application Form.m4a',
            'Part2 Queensland Festival.m4a',
            'Part3-Research for assignment of children playing outdoors.m4a',
            'Part4 The Berbers.m4a'
        ]
    },
    test3: {
        basePath: `${AUDIO_R2_BASE_URL}test3/`,
        sections: [
            'Part1 Kiwi Air Customer Complaint Form.m4a',
            'Part2 Spring Festival.m4a',
            'Part3-Geology field trip to Iceland.m4a',
            'Part4 Recycling Tyres in Australia.m4a'
        ]
    },
    test4: {
        basePath: `${AUDIO_R2_BASE_URL}test4/`,
        sections: [
            'Part1_Windward_Apartments.m4a',
            'Part2.m4a',
            'Part3.m4a',
            'Part4.m4a'
        ]
    },
    test5: {
        basePath: `${AUDIO_R2_BASE_URL}test5/`,
        sections: [
            'test5_Part1_Winsham_Farm.m4a',
            'test5_Part2_Queensland_Festival.m4a',
            'test5_Part3_Environmental_Science_Course.m4a',
            'test5_Part4_Photic_Sneezing.m4a'
        ]
    },
    test6: {
        basePath: `${AUDIO_R2_BASE_URL}test6/`,
        sections: [
            'Part1_Amateur_Dramatic_Society.m4a',
            'Part2_Clifton_Bird_Park.m4a',
            'Part3.m4a',
            'Part4.m4a'
        ]
    },
    test7: {
        basePath: `${AUDIO_R2_BASE_URL}c20-test4/`,
        sections: ['c20_T4S1_48k.mp3', 'c20_T4S2_48k.mp3', 'c20_T4S3_48k.mp3', 'c20_T4S4_48k.mp3']
    }
};

// 通用音频播放器类
class UniversalAudioPlayer {
    constructor() {
        this.currentTest = this.detectCurrentTest();
        this.audioConfig = UNIVERSAL_AUDIO_CONFIG[this.currentTest] || UNIVERSAL_AUDIO_CONFIG.test1;
        this.players = {};
        this.currentSection = 1;
        this.isInitialized = false;
        
        console.log(`音频播放器初始化: ${this.currentTest}`);
        console.log('音频配置:', this.audioConfig);
    }

    // 检测当前测试
    detectCurrentTest() {
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('test1') || path.includes('/test.html')) return 'test1';
        if (path.includes('test2')) return 'test2';
        if (path.includes('test3')) return 'test3';
        if (path.includes('test4')) return 'test4';
        if (path.includes('test5')) return 'test5';
        if (path.includes('test6')) return 'test6';
        if (path.includes('test7')) return 'test7';
        
        return 'test1';
    }

    // 初始化音频播放器
    async init() {
        console.log('初始化通用音频播放器...');
        
        // 等待DOM元素加载
        await this.waitForElements();
        
        // 更新音频源
        this.updateAudioSources();
        
        // 初始化所有播放器
        for (let i = 1; i <= 4; i++) {
            this.initPlayer(i);
        }
        
        // 绑定section切换事件
        this.bindSectionEvents();
        
        this.isInitialized = true;
        console.log('✅ 通用音频播放器初始化完成');
    }

    // 等待DOM元素加载
    waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                const hasAudioElements = document.querySelectorAll('audio[id*="section"]').length >= 1;
                const hasPlayerContainers = document.querySelectorAll('[id*="player-container"]').length >= 1;
                
                if (hasAudioElements || hasPlayerContainers || document.querySelectorAll('.audio-player').length > 0) {
                    resolve();
                } else {
                    setTimeout(checkElements, 100);
                }
            };
            checkElements();
        });
    }

    // 更新音频源路径
    updateAudioSources() {
        console.log('更新音频源路径...');
        
        for (let section = 1; section <= 4; section++) {
            // 尝试多种可能的audio元素ID
            const possibleIds = [
                `section${section}-player`,
                `audio-section-${section}`,
                `section-${section}-audio`,
                `player-section${section}`
            ];
            
            let audioElement = null;
            for (const id of possibleIds) {
                audioElement = document.getElementById(id);
                if (audioElement) break;
            }

            // 如果没找到，尝试通过类名或其他方式查找
            if (!audioElement) {
                const audioElements = document.querySelectorAll('audio');
                if (audioElements[section - 1]) {
                    audioElement = audioElements[section - 1];
                }
            }

            if (audioElement) {
                const audioPath = this.getAudioPath(section);
                audioElement.src = audioPath;
                console.log(`✅ Section ${section} 音频路径更新: ${audioPath}`);
            } else {
                console.warn(`❌ Section ${section} 音频元素未找到`);
            }
        }
    }

    // 获取音频路径（对文件名进行URL编码，防止空格等特殊字符导致404）
    getAudioPath(section) {
        const sectionIndex = section - 1;
        if (this.audioConfig && this.audioConfig.sections[sectionIndex]) {
            const fileName = this.audioConfig.sections[sectionIndex];
            // 对文件名进行URL编码（空格→%20），basePath不编码
            const encodedFileName = encodeURIComponent(fileName);
            return this.audioConfig.basePath + encodedFileName;
        }
        // 备用路径
        return `audio/test1/section${section}.mp3`;
    }

    // 初始化单个播放器
    initPlayer(section) {
        const audioElement = this.findAudioElement(section);
        const playButton = this.findPlayButton(section);
        const progressElement = this.findProgressElement(section);
        const timeElement = this.findTimeElement(section);
        const speedElement = this.findSpeedElement(section);

        if (!audioElement) {
            console.warn(`Section ${section} 音频元素未找到，跳过初始化`);
            return;
        }

        // 创建播放器对象
        this.players[section] = {
            audio: audioElement,
            playBtn: playButton,
            progress: progressElement,
            time: timeElement,
            speed: speedElement,
            isPlaying: false,
            section: section
        };

        // 绑定事件
        this.bindPlayerEvents(section);
        
        console.log(`✅ Section ${section} 播放器初始化完成`);
    }

    // 查找音频元素
    findAudioElement(section) {
        const possibleIds = [
            `section${section}-player`,
            `audio-section-${section}`,
            `section-${section}-audio`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        // 通过索引查找
        const audioElements = document.querySelectorAll('audio');
        return audioElements[section - 1];
    }

    // 查找播放按钮
    findPlayButton(section) {
        const possibleIds = [
            `section${section}-play`,
            `play-section-${section}`,
            `btn-play-${section}`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        // 通过类名或其他方式查找
        return document.querySelector(`[data-section="${section}"] .play-btn, .section-${section} .play-btn`);
    }

    // 查找进度条元素
    findProgressElement(section) {
        const possibleIds = [
            `section${section}-progress`,
            `progress-section-${section}`,
            `section-${section}-progress`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .progress, .section-${section} .progress`);
    }

    // 查找时间显示元素
    findTimeElement(section) {
        const possibleIds = [
            `section${section}-time`,
            `time-section-${section}`,
            `section-${section}-time`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .time, .section-${section} .time`);
    }

    // 查找速度控制元素
    findSpeedElement(section) {
        const possibleIds = [
            `section${section}-speed`,
            `speed-section-${section}`,
            `section-${section}-speed`
        ];
        
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) return element;
        }

        return document.querySelector(`[data-section="${section}"] .speed-select, .section-${section} .speed-select`);
    }

    // 绑定播放器事件
    bindPlayerEvents(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        // 播放/暂停按钮
        if (player.playBtn) {
            player.playBtn.addEventListener('click', () => {
                if (player.isPlaying) {
                    this.pauseAudio(section);
                } else {
                    this.playAudio(section);
                }
            });
        }

        // 进度条
        if (player.progress) {
            player.progress.addEventListener('input', (e) => {
                if (player.audio.duration) {
                    const value = parseFloat(e.target.value);
                    player.audio.currentTime = (value / 100) * player.audio.duration;
                }
            });

            player.progress.addEventListener('click', (e) => {
                if (player.audio.duration) {
                    const rect = player.progress.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    player.audio.currentTime = pos * player.audio.duration;
                }
            });
        }

        // 速度控制
        if (player.speed) {
            player.speed.addEventListener('change', () => {
                player.audio.playbackRate = parseFloat(player.speed.value);
            });
        }

        // 音频事件
        player.audio.addEventListener('timeupdate', () => {
            this.updateProgress(section);
            this.updateTimeDisplay(section);
        });

        player.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay(section);
        });

        player.audio.addEventListener('ended', () => {
            this.pauseAudio(section);
            player.audio.currentTime = 0;
            this.updateProgress(section);
        });

        player.audio.addEventListener('error', (e) => {
            console.error(`Section ${section} 音频加载失败:`, e);
            this.showAudioError(section);
        });
    }

    // 播放音频
    playAudio(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        // 暂停其他正在播放的音频
        Object.keys(this.players).forEach(s => {
            if (s != section) this.pauseAudio(s);
        });

        player.audio.play().then(() => {
            player.isPlaying = true;
            if (player.playBtn) {
                player.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                player.playBtn.textContent = player.playBtn.textContent || '⏸️';
            }
            console.log(`▶️ Section ${section} 开始播放`);
        }).catch(error => {
            console.error(`Section ${section} 播放失败:`, error);
            this.showAudioError(section);
        });
    }

    // 暂停音频
    pauseAudio(section) {
        const player = this.players[section];
        if (!player || !player.audio) return;

        player.audio.pause();
        player.isPlaying = false;
        if (player.playBtn) {
            player.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            player.playBtn.textContent = player.playBtn.textContent.includes('⏸️') ? '▶️' : player.playBtn.textContent;
        }
        console.log(`⏸️ Section ${section} 暂停播放`);
    }

    // 更新进度条
    updateProgress(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.progress) return;

        if (player.audio.duration) {
            const percent = (player.audio.currentTime / player.audio.duration) * 100;
            if (player.progress.type === 'range') {
                player.progress.value = percent;
            } else {
                player.progress.style.width = `${percent}%`;
            }
        }
    }

    // 更新时间显示
    updateTimeDisplay(section) {
        const player = this.players[section];
        if (!player || !player.audio || !player.time) return;

        const current = this.formatTime(player.audio.currentTime || 0);
        const total = this.formatTime(player.audio.duration || 0);
        player.time.textContent = `${current} / ${total}`;
    }

    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 绑定section切换事件
    bindSectionEvents() {
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const section = parseInt(tab.dataset.section);
                this.currentSection = section;
                
                // 暂停其他section的音频
                Object.keys(this.players).forEach(s => {
                    if (s != section) this.pauseAudio(s);
                });
                
                console.log(`切换到 Section ${section}`);
            });
        });
    }

    // 显示音频错误（增加详细调试信息）
    showAudioError(section) {
        const audioPath = this.getAudioPath(section);
        console.error(`❌ Section ${section} 音频加载失败，路径: ${audioPath}`);
        
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #dc3545; color: white; padding: 15px;
            border-radius: 5px; z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 400px;
        `;
        errorMsg.innerHTML = `❌ Section ${section} 音频加载失败<br><small>路径: ${audioPath}</small><br><small>请检查音频文件是否存在</small>`;
        document.body.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 8000);
    }

    // 检查音频可用性
    async checkAudioAvailability() {
        const results = [];
        
        for (let section = 1; section <= 4; section++) {
            const audioPath = this.getAudioPath(section);
            try {
                const response = await fetch(audioPath, { method: 'HEAD' });
                results.push({
                    section,
                    path: audioPath,
                    available: response.ok,
                    status: response.status
                });
            } catch (error) {
                results.push({
                    section,
                    path: audioPath,
                    available: false,
                    error: error.message
                });
            }
        }

        console.log('音频可用性检查结果:', results);
        return results;
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    if (window.__IELTS_USE_TEST_INIT_AUDIO__) {
        console.log('⏭️ 已启用 test-init 音频系统，跳过通用音频播放器初始化');
        return;
    }

    console.log('🎵 DOM加载完成，启动通用音频播放器...');
    
    setTimeout(async () => {
        window.universalAudioPlayer = new UniversalAudioPlayer();
        await window.universalAudioPlayer.init();
        
        // 检查音频可用性
        const audioResults = await window.universalAudioPlayer.checkAudioAvailability();
        const availableCount = audioResults.filter(r => r.available).length;
        
        console.log(`✅ 音频系统初始化完成，${availableCount}/4 个音频文件可用`);
    }, 1000);
});

console.log('✅ 通用音频播放器系统加载完成');

})();

// --- js/test-data.js ---
;(function(){
// 测试数据
const TEST_DATA = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>ONE WORD /OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "Amateur Dramatic Society",
            subtitle: "Secretary: Jane Caulfield\n\nMailing address: 117 Green Road, Prestwin",
            items: [
                { text: "Location for rehearsals: The [1]........................House, Wynn" },
                { text: "No experience necessary" },
                { text: "They need actors and [2]........................ singers" },
                { text: "Also need people who can [3]........................" },
                { text: "Meetings 6–8 p.m. every [4]........................" },
                { text: "Closed in [5]........................ (for 2 weeks)" },
                { text: "Membership costs:" },
                { text: "Standard: £ 40 (includes a [6]........................ once a year)" },
                { text: "Over 60s or unemployed: £ [7]........................" },
                { text: "Youth group: for people aged [8]........................ years old and under" },
                { text: "Shows:" },
                { text: "• mostly plays by [9]........................ authors", type: "bullet" },
                { text: "• family show in December", type: "bullet" },
                { text: "(raises money for children's [10]........................)", type: "bullet" }
            ]
        }
    },
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 14</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 11,
                        text: "What should employees bring to work?",
                        type: "radio",
                        options: [
                            { value: "A", text: "gloves" },
                            { value: "B", text: "lunch" },
                            { value: "C", text: "water" }
                        ]
                    },
                    {
                        id: 12,
                        text: "If employees can't come to work one day, they should",
                        type: "radio",
                        options: [
                            { value: "A", text: "contact the duty manager." },
                            { value: "B", text: "leave a phone message at the farm office." },
                            { value: "C", text: "call their team leader." }
                        ]
                    },
                    {
                        id: 13,
                        text: "One problem with customers that may occur now is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "they sometimes fail to return baskets." },
                            { value: "B", text: "they eat the fruit before paying." },
                            { value: "C", text: "they can be unsure about prices." }
                        ]
                    },
                    {
                        id: 14,
                        text: "One of the benefits of working at the strawberry farm is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "employees' friends are entitled to a small discount." },
                            { value: "B", text: "employees can have a quantity of fresh fruit for free." },
                            { value: "C", text: "employees don't pay the full price for gift items in the shop" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15- 20</strong>",
                instructions: "Choose <strong>SIX</strong> answers from the box and write the correct letter: <strong>A-J</strong>, next to Questions 15-20.",
                mapContent: {
                    title: "Map of Strawberry Farm",
                    imageUrl: "../images/test1/map.webp"
                },
                questions: [
                    {
                        id: 15,
                        text: "Staff room",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 16,
                        text: "Administration",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 17,
                        text: "Packing shed",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 18,
                        text: "Staff car park",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 19,
                        text: "Ripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 20,
                        text: "Unripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    }
                ],
                boxContent: "Buildings\nA B C D E F G H I J"
            }
        ]
    },
    section3: {
        title: "<strong>Section 3</strong>",
        parts: [
            {
                title: "<strong>Questions 21 – 24</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 21,
                        text: "Why were Mark and Stella attracted to Bolton Island for their field trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "because it is geologically unique" },
                            { value: "B", text: "because it is easily accessible" },
                            { value: "C", text: "because it is largely unstudied" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Which aspect of Bolton Island's physical geography did Mark and Stella focus on?",
                        type: "radio",
                        options: [
                            { value: "A", text: "its natural harbour" },
                            { value: "B", text: "its fertile soil" },
                            { value: "C", text: "its rock formations" }
                        ]
                    },
                    {
                        id: 23,
                        text: "Which problem did Mark and Stella have in studying Bolton Island's physical geography?",
                        type: "radio",
                        options: [
                            { value: "A", text: "getting useful information from the local residents" },
                            { value: "B", text: "recognising which features were man-made" },
                            { value: "C", text: "finding official data about the island" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What preparation was most useful for Mark and Stella's trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "reading previous field trip reports" },
                            { value: "B", text: "drawing up a detailed schedule for their trip" },
                            { value: "C", text: "doing online research" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 26</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "25-26",
                        text: "Which TWO mistakes did Mark and Stella make with their visuals?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "not taking enough care when making sketches" },
                            { value: "B", text: "not ensuring their photos had proper lighting" },
                            { value: "C", text: "not using anything to indicate the scale of their photos" },
                            { value: "D", text: "not making multiple photos and drawings of things of interest" },
                            { value: "E", text: "not adequately recording when and where drawings were made" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 27 – 28</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "27-28",
                        text: "Which TWO things does Stella say students need to do for a successful interview?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Guide the way in which the interview progresses." },
                            { value: "B", text: "Prepare the questions well in advance." },
                            { value: "C", text: "Check the recording equipment is working." },
                            { value: "D", text: "Explain fully the purpose of the interview." },
                            { value: "E", text: "Give a personal opinion on the topics which are covered." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 29 – 30</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "29-30",
                        text: "Which TWO things do Mark and Stella suggest doing with regard to note-taking on a field trip?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Ensure that terminology is correctly used in the notes." },
                            { value: "B", text: "Check your notes every evening." },
                            { value: "C", text: "Be highly selective in what you write down." },
                            { value: "D", text: "Have only one member's a team to write notes." },
                            { value: "E", text: "Keep your notes in an organised fashion." }
                        ]
                    }
                ]
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31- 40</strong>\n\nComplete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
        boxContent: {
            title: "Development and use of plastics",
            content: [
                {
                    type: "header",
                    text: "1930s"
                },
                {
                    type: "subheader",
                    text: "Polythene – two main forms:"
                },
                {
                    type: "bullet-main",
                    text: "LDPE –",
                    description: "distinguishing feature: it is highly [31] ........................",
                    examples: "e.g. used to make [32] ........................ , carrier bags and packaging materials"
                },
                {
                    type: "bullet-main",
                    text: "HDPE –",
                    description: "made tougher by exposure to a particular kind of [33] ........................",
                    examples: "– suitable for rigid containers, e.g. for bleach"
                },
                {
                    type: "subheader",
                    text: "Polyurethane – two main forms:"
                },
                {
                    type: "bullet-sub",
                    text: "blown form used for making [34] ........................ (padding) and in housing infrastructure to give [35] ........................"
                },
                {
                    type: "bullet-sub",
                    text: "non-blown form used mainly for sportswear"
                },
                {
                    type: "header",
                    text: "1940s – 1950s"
                },
                {
                    type: "subheader",
                    text: "PET"
                },
                {
                    type: "text",
                    text: "– used to make [36] ........................ , e.g. Dacron and Terylene"
                },
                {
                    type: "text",
                    text: "– popular for making containers for fizzy drinks"
                },
                {
                    type: "text",
                    text: "– because it resists abrasion"
                },
                {
                    type: "text",
                    text: "– used for household objects such as [37] ........................"
                },
                {
                    type: "subheader",
                    text: "Tupperware"
                },
                {
                    type: "text",
                    text: "– storage boxes"
                },
                {
                    type: "text",
                    text: "– revolution in [38] ........................ techniques"
                },
                {
                    type: "header",
                    text: "1960s"
                },
                {
                    type: "compound",
                    bold: "Teflon",
                    text: "– non-stick"
                },
                {
                    type: "text",
                    text: "– almost no [39] ........................ , so used for protective coatings, e.g. for frying pans"
                },
                {
                    type: "compound",
                    bold: "Gore-Tex",
                    text: "– best known for outdoor wear"
                },
                {
                    type: "text",
                    text: "– also used for various [40] ........................ purposes"
                }
            ]
        }
    }
};

window.TEST_DATA = TEST_DATA;

// 获取测试数据的函数
function getTestData() {
    return TEST_DATA;
}

// 导出函数
window.getTestData = getTestData; 

})();

// --- js/test-renderer.js ---
;(function(){
// 题目渲染器 - 将测试数据渲染到页面
(function() {
    'use strict';

    let currentTestData = null;

    document.addEventListener('DOMContentLoaded', function() {
        window.setTimeout(renderAllSections, 100);
    });

    function renderAllSections() {
        currentTestData = resolveCurrentTestData();

        if (!currentTestData) {
            console.warn('测试数据未加载，跳过渲染');
            return;
        }

        for (let section = 1; section <= 4; section++) {
            const sectionData = currentTestData[`section${section}`];
            if (!sectionData) continue;
            renderSection(section, sectionData);
        }

        bindAnswerInputs();
        console.log('题目渲染完成');
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

    function resolveCurrentTestData() {
        const path = window.location.pathname.toLowerCase();
        const match = path.match(/test(\d+)/);

        if (match) {
            return readGlobalBinding(`TEST_DATA_${parseInt(match[1], 10)}`);
        }

        return readGlobalBinding('TEST_DATA');
    }

    function shouldPreserveInlineContent(container) {
        if (!container) return false;

        return Array.from(container.children).some(function(child) {
            if (!child) return false;
            if (child.classList && child.classList.contains('section-action-row')) return false;
            return child.textContent.trim() !== '';
        });
    }

    function renderSection(sectionNum, data) {
        const sectionElement = document.getElementById(`section-${sectionNum}`);
        const container = sectionElement ? sectionElement.querySelector('.questions') : null;

        if (!container) {
            console.warn(`Section ${sectionNum} 容器未找到`);
            return;
        }

        if (shouldPreserveInlineContent(container)) {
            ensureSectionSaveButton(sectionNum, sectionElement);
            return;
        }

        let html = `<h2 class="section-title">${data.title || `Section ${sectionNum}`}</h2>`;

        if (data.instructions) {
            html += `<div class="instructions">${formatMultiline(data.instructions)}</div>`;
        }

        if (Array.isArray(data.parts)) {
            data.parts.forEach(function(part) {
                html += renderPart(part);
            });
        }

        if (data.formContent) html += renderFormContent(data.formContent);
        if (data.tableData) html += renderTableData(data.tableData);
        if (data.summaryContent) html += renderSummaryContent(data.summaryContent);
        if (data.boxContent) html += renderBoxContent(data.boxContent);
        if (Array.isArray(data.questions)) html += renderQuestions(data.questions);

        container.innerHTML = html;
        ensureSectionSaveButton(sectionNum, sectionElement);
    }

    function ensureSectionSaveButton(sectionNum, sectionElement) {
        if (!sectionElement || sectionElement.querySelector('.section-save-btn')) return;

        const container = sectionElement.querySelector('.questions');
        if (!container) return;

        const actionRow = document.createElement('div');
        actionRow.className = 'section-action-row';
        actionRow.innerHTML = `<button type="button" class="submit-answers-btn section-save-btn" data-section="${sectionNum}">保存本 Section</button>`;
        container.appendChild(actionRow);

        const button = actionRow.querySelector('.section-save-btn');
        if (button) {
            button.addEventListener('click', function() {
                if (typeof window.saveSectionAnswers === 'function') {
                    window.saveSectionAnswers(sectionNum);
                }
            });
        }
    }

    function renderPart(part) {
        let html = '<div class="question-part">';

        if (part.title) html += `<h3 class="part-title">${part.title}</h3>`;
        if (part.instructions) html += `<div class="instructions">${formatMultiline(part.instructions)}</div>`;

        if (part.mapContent) {
            html += '<div class="map-container">';
            html += `<h4>${part.mapContent.title || 'Map'}</h4>`;
            if (part.mapContent.imageUrl) {
                html += `<img src="${part.mapContent.imageUrl}" alt="Map" class="map-image" onerror="this.style.display='none'">`;
            } else if (part.mapContent.description) {
                html += `<p>${part.mapContent.description}</p>`;
            }
            html += '</div>';
        }

        if (part.formContent) html += renderFormContent(part.formContent);
        if (part.tableData) html += renderTableData(part.tableData);
        if (part.summaryContent) html += renderSummaryContent(part.summaryContent);
        if (part.boxContent) html += renderBoxContent(part.boxContent);
        if (Array.isArray(part.questions)) html += renderQuestions(part.questions);

        html += '</div>';
        return html;
    }

    function renderFormContent(formContent) {
        let html = '<div class="form-content">';

        if (formContent.title) html += `<h3>${formContent.title}</h3>`;
        if (formContent.subtitle) html += `<div class="form-subtitle">${formatMultiline(formContent.subtitle)}</div>`;

        if (Array.isArray(formContent.items)) {
            formContent.items.forEach(function(item) {
                html += renderFormItem(item);
            });
        }

        html += '</div>';
        return html;
    }

    function renderFormItem(item) {
        let text = formatMultiline(replaceQuestionPlaceholders(item.text || ''));
        let className = 'question-item';

        if (item.type) className += ` ${item.type}-item`;
        return `<div class="${className}"><label>${text}</label></div>`;
    }

    function renderQuestions(questions) {
        let html = '<div class="questions-list">';

        questions.forEach(function(question) {
            html += '<div class="question-item">';
            html += `<label><strong>${question.id}.</strong> ${replaceQuestionPlaceholders(question.text || '')}</label>`;

            if (question.type === 'radio' && Array.isArray(question.options)) {
                html += '<div class="options">';
                question.options.forEach(function(option) {
                    html += `<label class="option">
                        <input type="radio" name="q${question.id}" value="${option.value}" class="answer-input" data-question="${question.id}">
                        <span><strong>${option.value}</strong> ${option.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (question.type === 'checkbox' && Array.isArray(question.options)) {
                const maxSelections = question.maxSelections || inferSelectionLimit(question.id);
                html += '<div class="options">';
                question.options.forEach(function(option) {
                    html += `<label class="option">
                        <input type="checkbox" name="q${question.id}" value="${option.value}" class="answer-input" data-question="${question.id}" data-max-selections="${maxSelections}">
                        <span><strong>${option.value}</strong> ${option.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else {
                html += `<input type="text" name="q${question.id}" class="answer-input" data-question="${question.id}" placeholder="${question.placeholder || 'your answer'}">`;
            }

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function inferSelectionLimit(questionId) {
        const match = String(questionId).match(/^(\d+)\s*-\s*(\d+)$/);
        if (!match) return 2;
        return Math.max(1, parseInt(match[2], 10) - parseInt(match[1], 10) + 1);
    }

    function renderTableData(tableData) {
        let html = '<div class="table-container">';

        if (tableData.title) html += `<h4>${tableData.title}</h4>`;

        html += '<table class="info-table">';

        if (Array.isArray(tableData.headers) && tableData.headers.length > 0) {
            html += '<thead><tr>';
            tableData.headers.forEach(function(header) {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';
        }

        if (Array.isArray(tableData.rows) && tableData.rows.length > 0) {
            html += '<tbody>';
            tableData.rows.forEach(function(row) {
                html += '<tr>';
                row.forEach(function(cell) {
                    html += `<td>${replaceQuestionPlaceholders(String(cell))}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';
        }

        html += '</table></div>';
        return html;
    }

    function renderSummaryContent(summaryContent) {
        let html = '<div class="summary-content">';
        if (summaryContent.title) html += `<h4>${summaryContent.title}</h4>`;
        if (summaryContent.text) html += `<div class="summary-text">${formatMultiline(replaceQuestionPlaceholders(summaryContent.text))}</div>`;
        html += '</div>';
        return html;
    }

    function renderBoxContent(boxContent) {
        if (typeof boxContent === 'string') {
            return `<div class="box-content"><pre>${boxContent}</pre></div>`;
        }

        let html = '<div class="box-content">';
        if (boxContent.title) html += `<h4>${boxContent.title}</h4>`;

        if (Array.isArray(boxContent.content)) {
            boxContent.content.forEach(function(item) {
                if (!item) return;

                if (item.type === 'header') {
                    html += `<h5>${replaceQuestionPlaceholders(item.text || '')}</h5>`;
                    return;
                }

                if (item.type === 'subheader') {
                    html += `<h6>${replaceQuestionPlaceholders(item.text || '')}</h6>`;
                    return;
                }

                if (item.type === 'compound') {
                    html += `<div class="question-item"><strong>${item.bold || ''}</strong> ${replaceQuestionPlaceholders(item.text || '')}</div>`;
                    return;
                }

                html += `<div class="question-item">${formatMultiline(replaceQuestionPlaceholders(item.text || ''))}</div>`;
            });
        }

        html += '</div>';
        return html;
    }

    function replaceQuestionPlaceholders(text) {
        return String(text).replace(/\[(\d+)\]/g, function(match, number) {
            return `<input type="text" name="q${number}" class="answer-input" data-question="${number}" placeholder="your answer">`;
        });
    }

    function formatMultiline(text) {
        return String(text).replace(/\n/g, '<br>');
    }

    function bindAnswerInputs() {
        const testNum = detectTestNumber();
        const storageKey = `ielts-test${testNum}-answers`;
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');

        document.querySelectorAll('.answer-input').forEach(function(input) {
            const questionId = input.dataset.question;
            if (!questionId) return;

            applySavedValue(input, savedAnswers[questionId]);

            if (input.dataset.answerBound === 'true') return;
            input.dataset.answerBound = 'true';

            if (input.type === 'text') {
                input.addEventListener('input', function() {
                    const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    answers[this.dataset.question] = this.value;
                    localStorage.setItem(storageKey, JSON.stringify(answers));
                    this.classList.toggle('answered', this.value.trim() !== '');
                });
                return;
            }

            input.addEventListener('change', function() {
                const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const qId = this.dataset.question;

                if (this.type === 'radio') {
                    answers[qId] = this.value;
                } else if (this.type === 'checkbox') {
                    const checkedValues = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(function(element) {
                            return element.dataset.question === qId && element.checked;
                        })
                        .map(function(element) {
                            return element.value;
                        });

                    const limit = parseInt(this.dataset.maxSelections || '0', 10);
                    if (limit > 0 && checkedValues.length > limit) {
                        this.checked = false;
                        return;
                    }

                    answers[qId] = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(function(element) {
                            return element.dataset.question === qId && element.checked;
                        })
                        .map(function(element) {
                            return element.value;
                        });
                }

                localStorage.setItem(storageKey, JSON.stringify(answers));
                this.classList.add('answered');
            });
        });
    }

    function applySavedValue(input, savedValue) {
        if (savedValue === undefined) return;

        if (input.type === 'radio') {
            if (input.value === savedValue) input.checked = true;
        } else if (input.type === 'checkbox') {
            if (Array.isArray(savedValue) && savedValue.includes(input.value)) {
                input.checked = true;
            }
        } else {
            input.value = savedValue;
        }

        input.classList.add('answered');
    }

    function detectTestNumber() {
        const path = window.location.pathname.toLowerCase();
        const match = path.match(/test(\d+)/);
        if (match) return parseInt(match[1], 10);
        return 1;
    }
})();

})();

// --- js/test-init.js ---
;(function(){
// 统一测试初始化模块
// 整合音频播放器、Section切换、答案保存等功能
(function() {
    'use strict';

    // Signal that the newer unified test audio controller owns the page.
    window.__IELTS_USE_TEST_INIT_AUDIO__ = true;

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

        audioPlayer.crossOrigin = 'anonymous';
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

        const corsWasMissing = audioPlayer.crossOrigin !== 'anonymous';
        audioPlayer.crossOrigin = 'anonymous';

        if (corsWasMissing || stripQuery(currentAttrSrc) !== stripQuery(preferredSrc)) {
            audioPlayer.src = preferredSrc;
            audioPlayer.load();
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

})();
