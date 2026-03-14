/* Auto-generated bundle: test-legacy-bundle.js */
// --- js/universal-audio-player.js ---
;(function(){
// 通用音频播放器系统 - 支持所有7套卷子
console.log('🎵 加载通用音频播放器系统...');

// 所有测试的音频配置
const UNIVERSAL_AUDIO_CONFIG = {
    test1: {
        basePath: '../audio/test1/',
        sections: [
            'Part1 Amateur Dramatic Society.m4a',
            'Part2 Talk to new employees at a strawberry farm.m4a',
            'Part3-Field trip to Bolton lsland.m4a',
            'Part4 Development and use of plastics.m4a'
        ]
    },
    test2: {
        basePath: '../audio/test2/',
        sections: [
            'Part1 Rental Property Application Form.m4a',
            'Part2 Queensland Festival.m4a',
            'Part3-Research for assignment of children playing outdoors.m4a',
            'Part4 The Berbers.m4a'
        ]
    },
    test3: {
        basePath: '../audio/test3/',
        sections: [
            'Part1 Kiwi Air Customer Complaint Form.m4a',
            'Part2 Spring Festival.m4a',
            'Part3-Geology field trip to Iceland.m4a',
            'Part4 Recycling Tyres in Australia.m4a'
        ]
    },
    test4: {
        basePath: '../audio/test4/',
        sections: [
            'Part1_Windward_Apartments.m4a',
            'Part2.m4a',
            'Part3.m4a',
            'Part4.m4a'
        ]
    },
    test5: {
        basePath: '../audio/test5/',
        sections: [
            'test5_Part1_Winsham_Farm.m4a',
            'test5_Part2_Queensland_Festival.m4a',
            'test5_Part3_Environmental_Science_Course.m4a',
            'test5_Part4_Photic_Sneezing.m4a'
        ]
    },
    test6: {
        basePath: '../audio/test6/',
        sections: [
            'Part1_Amateur_Dramatic_Society.m4a',
            'Part2_Clifton_Bird_Park.m4a',
            'Part3.m4a',
            'Part4.m4a'
        ]
    },
    test7: {
        basePath: '../audio/c20-test4/',
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

    // 等待DOM和数据加载完成
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(renderAllSections, 100);
    });

    function renderAllSections() {
        currentTestData = resolveCurrentTestData();

        if (!currentTestData) {
            console.warn('测试数据未加载，跳过渲染');
            return;
        }

        console.log('开始渲染题目...');

        // 渲染全部Section（1-4）
        for (let i = 1; i <= 4; i++) {
            const sectionData = currentTestData['section' + i];
            if (sectionData) {
                renderSection(i, sectionData);
            }
        }

        // 绑定动态生成题目的保存逻辑
        bindAnswerInputs();

        console.log('题目渲染完成');
    }

    function resolveCurrentTestData() {
        var path = window.location.pathname.toLowerCase();

        // Dynamic test number detection: match testN where N is any number
        var m = path.match(/test(\d+)/);
        if (m) {
            var num = parseInt(m[1], 10);
            var varName = 'TEST_DATA_' + num;
            if (typeof window[varName] !== 'undefined') return window[varName];
        }

        // Fallback to legacy global
        if (typeof TEST_DATA !== 'undefined') return TEST_DATA;

        return null;
    }

    function renderSection(sectionNum, data) {
        const container = document.querySelector(`#section-${sectionNum} .questions`);
        if (!container) {
            console.warn(`Section ${sectionNum} 容器未找到`);
            return;
        }

        let html = `<h2 class="section-title">${data.title || 'Section ' + sectionNum}</h2>`;

        if (data.instructions) {
            html += `<div class="instructions">${formatMultiline(data.instructions)}</div>`;
        }

        // 渲染parts（如果有）
        if (Array.isArray(data.parts)) {
            data.parts.forEach(part => {
                html += renderPart(part);
            });
        }

        // 渲染formContent（如果有）
        if (data.formContent) {
            html += renderFormContent(data.formContent);
        }

        // 渲染section级别特殊结构
        if (data.tableData) {
            html += renderTableData(data.tableData);
        }

        if (data.summaryContent) {
            html += renderSummaryContent(data.summaryContent);
        }

        if (data.boxContent) {
            html += renderBoxContent(data.boxContent);
        }

        // 渲染questions（如果有）
        if (Array.isArray(data.questions)) {
            html += renderQuestions(data.questions);
        }

        container.innerHTML = html;
    }

    function renderPart(part) {
        let html = '<div class="question-part">';

        if (part.title) {
            html += `<h3 class="part-title">${part.title}</h3>`;
        }

        if (part.instructions) {
            html += `<div class="instructions">${formatMultiline(part.instructions)}</div>`;
        }

        // 渲染地图（如果有）
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

        if (part.tableData) {
            html += renderTableData(part.tableData);
        }

        if (part.summaryContent) {
            html += renderSummaryContent(part.summaryContent);
        }

        if (part.boxContent) {
            html += renderBoxContent(part.boxContent);
        }

        // 渲染问题
        if (Array.isArray(part.questions)) {
            html += renderQuestions(part.questions);
        }

        html += '</div>';
        return html;
    }

    function renderFormContent(formContent) {
        let html = '<div class="form-content">';

        if (formContent.title) {
            html += `<h3>${formContent.title}</h3>`;
        }

        if (Array.isArray(formContent.items)) {
            formContent.items.forEach(item => {
                html += renderFormItem(item);
            });
        }

        html += '</div>';
        return html;
    }

    function renderFormItem(item) {
        let text = replaceQuestionPlaceholders(item.text || '');
        text = formatMultiline(text);

        let className = 'question-item';
        if (item.type) {
            className += ` ${item.type}-item`;
        }

        return `<div class="${className}"><label>${text}</label></div>`;
    }

    function renderQuestions(questions) {
        let html = '<div class="questions-list">';

        questions.forEach(q => {
            html += '<div class="question-item">';
            html += `<label><strong>${q.id}.</strong> ${replaceQuestionPlaceholders(q.text || '')}</label>`;

            if (q.type === 'radio' && Array.isArray(q.options)) {
                html += '<div class="options">';
                q.options.forEach(opt => {
                    html += `<label class="option">
                        <input type="radio" name="q${q.id}" value="${opt.value}" class="answer-input" data-question="${q.id}">
                        <span><strong>${opt.value}</strong> ${opt.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (q.type === 'checkbox' && Array.isArray(q.options)) {
                html += '<div class="options">';
                q.options.forEach(opt => {
                    html += `<label class="option">
                        <input type="checkbox" name="q${q.id}" value="${opt.value}" class="answer-input" data-question="${q.id}">
                        <span><strong>${opt.value}</strong> ${opt.text}</span>
                    </label>`;
                });
                html += '</div>';
            } else if (q.type === 'text' || q.type === 'fill_blank' || !q.type) {
                html += `<input type="text" name="q${q.id}" class="answer-input" data-question="${q.id}" placeholder="${q.placeholder || 'your answer'}">`;
            }

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function renderTableData(tableData) {
        let html = '<div class="table-container">';

        if (tableData.title) {
            html += `<h4>${tableData.title}</h4>`;
        }

        html += '<table class="info-table">';

        if (Array.isArray(tableData.headers) && tableData.headers.length > 0) {
            html += '<thead><tr>';
            tableData.headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';
        }

        if (Array.isArray(tableData.rows) && tableData.rows.length > 0) {
            html += '<tbody>';
            tableData.rows.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
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
        if (summaryContent.title) {
            html += `<h4>${summaryContent.title}</h4>`;
        }
        if (summaryContent.text) {
            html += `<div class="summary-text">${formatMultiline(replaceQuestionPlaceholders(summaryContent.text))}</div>`;
        }
        html += '</div>';
        return html;
    }

    function renderBoxContent(boxContent) {
        // 支持字符串和对象两种结构
        if (typeof boxContent === 'string') {
            return `<div class="box-content"><pre>${boxContent}</pre></div>`;
        }

        let html = '<div class="box-content">';
        if (boxContent.title) {
            html += `<h4>${boxContent.title}</h4>`;
        }

        if (Array.isArray(boxContent.content)) {
            boxContent.content.forEach(item => {
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
        // 将 [数字] 占位符替换为输入框
        return text.replace(/\[(\d+)\]/g, function(match, num) {
            return `<input type="text" name="q${num}" class="answer-input" data-question="${num}" placeholder="your answer">`;
        });
    }

    function formatMultiline(text) {
        return String(text).replace(/\n/g, '<br>');
    }

    function bindAnswerInputs() {
        const testNum = detectTestNumber();
        const storageKey = `ielts-test${testNum}-answers`;
        const savedAnswers = JSON.parse(localStorage.getItem(storageKey) || '{}');

        document.querySelectorAll('.answer-input').forEach(input => {
            const questionId = input.dataset.question;
            const savedValue = savedAnswers[questionId];

            // 加载已保存的答案
            if (savedValue !== undefined) {
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

            // 文本输入：实时保存
            if (input.type === 'text') {
                input.addEventListener('input', function() {
                    const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    answers[this.dataset.question] = this.value;
                    localStorage.setItem(storageKey, JSON.stringify(answers));
                    this.classList.toggle('answered', this.value.trim() !== '');
                });
                return;
            }

            // 单选、多选：change 保存
            input.addEventListener('change', function() {
                const answers = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const qId = this.dataset.question;

                if (this.type === 'radio') {
                    answers[qId] = this.value;
                } else if (this.type === 'checkbox') {
                    const checkedValues = Array.from(document.querySelectorAll('.answer-input[type="checkbox"]'))
                        .filter(el => el.dataset.question === qId && el.checked)
                        .map(el => el.value);
                    answers[qId] = checkedValues;
                }

                localStorage.setItem(storageKey, JSON.stringify(answers));
                this.classList.add('answered');
            });
        });
    }

    function detectTestNumber() {
        var path = window.location.pathname.toLowerCase();
        var m = path.match(/test(\d+)/);
        if (m) return parseInt(m[1], 10);
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

    function detectTestNumber() {
        var path = window.location.pathname.toLowerCase();
        var m = path.match(/test(\d+)/);
        if (m) return parseInt(m[1], 10);
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

})();
