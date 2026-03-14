// 通用测试页面生成器
class UniversalTestGenerator {
    constructor() {
        this.testConfigs = {
            // 常规测试 1-6
            test1: {
                title: 'IELTS Listening Test 1',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test1/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test1/',
                    sections: [
                        'Part1 Amateur Dramatic Society.m4a',
                        'Part2 Talk to new employees at a strawberry farm.m4a', 
                        'Part3-Field trip to Bolton lsland.m4a',
                        'Part4 Development and use of plastics.m4a'
                    ]
                },
                dataFile: 'test-data.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '业余戏剧社团',
                    '草莓农场工作指导', 
                    '博尔顿岛实地考察',
                    '塑料的发展与应用'
                ]
            },
            test2: {
                title: 'IELTS Listening Test 2', 
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test2/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test2/',
                    sections: [
                        'Part1 Rental Property Application Form.m4a',
                        'Part2 Queensland Festival.m4a',
                        'Part3-Research for assignment of children playing outdoors.m4a', 
                        'Part4 The Berbers.m4a'
                    ]
                },
                dataFile: 'test-data-2.js',
                answersFile: 'test-answers-2.js',
                difficulty: '中等',
                themes: [
                    '租房申请表',
                    '昆士兰节庆活动',
                    '儿童户外游戏研究',
                    '柏柏尔人'
                ]
            },
            test3: {
                title: 'IELTS Listening Test 3',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test3/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test3/',
                    sections: [
                        'Part1 Kiwi Air Customer Complaint Form.m4a',
                        'Part2 Spring Festival.m4a', 
                        'Part3-Geology field trip to Iceland.m4a',
                        'Part4 Recycling Tyres in Australia.m4a'
                    ]
                },
                dataFile: 'test-data-3.js',
                answersFile: 'test-answers-3.js', 
                difficulty: '中等偏上',
                themes: [
                    '奇异航空投诉表格',
                    '春节庆典',
                    '冰岛地质考察',
                    '澳大利亚轮胎回收'
                ]
            },
            test4: {
                title: 'IELTS Listening Test 4',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test4/', 
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test4/',
                    sections: [
                        'Part 1_Windward Apartments .m4a',
                        'Part 2 .m4a',
                        'Part 3 .m4a', 
                        'Part 4.m4a'
                    ]
                },
                dataFile: 'test-data-4.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '温德沃德公寓',
                    '社区服务介绍',
                    '学术讨论',
                    '专题讲座'
                ]
            },
            test5: {
                title: 'IELTS Listening Test 5',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test5/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test5/',
                    sections: [
                        'test5_Part 1 Winsham Farm.m4a',
                        'test5_Part 2 Queensland Festival.m4a',
                        'test5_Part 3 Environmental science course.m4a',
                        'test5_Part 4-Photic sneezing.m4a'
                    ]
                },
                dataFile: 'test-data-5.js',
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '温沙姆农场',
                    '昆士兰节庆',
                    '环境科学课程', 
                    '光性喷嚏反射'
                ]
            },
            test6: {
                title: 'IELTS Listening Test 6',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/test6/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/test6/',
                    sections: [
                        'Part 1_Amateur Dramatic Society.m4a',
                        'Part2_Clifton Bird Park .m4a',
                        'Part 3.m4a',
                        'Part 4 .m4a'
                    ]
                },
                dataFile: 'test-data-6.js', 
                answersFile: 'test-answers.js',
                difficulty: '中等',
                themes: [
                    '业余戏剧社团',
                    '克利夫顿鸟类公园',
                    '学术研讨', 
                    '专业讲座'
                ]
            },
            // 剑桥雅思20测试 
            'cambridge20-test1': {
                title: 'Cambridge IELTS 20 - Test 1',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/c20-test1/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/c20-test1/',
                    sections: [
                        'c20_T1S1_64k.mp3', 
                        'c20_T1S2_64k.mp3',
                        'c20_T1S3_48k.mp3',
                        'c20_T1S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test1/cambridge20_test1_data.js',
                answersFile: 'docs/c20_test1/cambridge20_test1_answers.js',
                difficulty: '标准',
                themes: [
                    '工作申请咨询',
                    '博物馆导览介绍',
                    '学术项目讨论',
                    '海洋生物学讲座'
                ],
                official: true
            },
            'cambridge20-test2': {
                title: 'Cambridge IELTS 20 - Test 2',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/c20-test2/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/c20-test2/',
                    sections: [
                        'c20_T2S1_48k.mp3',
                        'c20_T2S2_48k.mp3', 
                        'c20_T2S3_48k.mp3',
                        'c20_T2S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test2/cambridge20_test2_data.js',
                answersFile: 'docs/c20_test2/cambridge20_test2_answers.js',
                difficulty: '标准',
                themes: [
                    '健身房会员咨询',
                    '社区花园项目',
                    '研究方法讨论',
                    '可持续建筑讲座'
                ],
                official: true
            },
            'cambridge20-test3': {
                title: 'Cambridge IELTS 20 - Test 3', 
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/c20-test3/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/c20-test3/',
                    sections: [
                        'c20_T3S1_48k.mp3',
                        'c20_T3S2_48k.mp3',
                        'c20_T3S3_48k.mp3', 
                        'c20_T3S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test3/cambridge20_test3_data.js',
                answersFile: 'docs/c20_test3/cambridge20_test3_answers.js',
                difficulty: '标准',
                themes: [
                    '图书馆服务咨询',
                    '历史博物馆介绍',
                    '心理学实验讨论',
                    '气候变化研究'
                ],
                official: true
            },
            'cambridge20-test4': {
                title: 'Cambridge IELTS 20 - Test 4',
                audioConfig: {
                    cdnPath: 'https://audio.ieltslisteningtests.com/audio/c20-test4/',
                    localPath: 'https://audio.ieltslisteningtests.com/audio/c20-test4/',
                    sections: [
                        'c20_T4S1_48k.mp3',
                        'c20_T4S2_48k.mp3',
                        'c20_T4S3_48k.mp3',
                        'c20_T4S4_48k.mp3'
                    ]
                },
                dataFile: 'docs/c20_test4/cambridge20_test4_data.js',
                answersFile: 'docs/c20_test4/cambridge20_test4_answers.js',
                difficulty: '标准',
                themes: [
                    '旅游信息咨询',
                    '艺术中心介绍', 
                    '商业案例研究',
                    '社会学理论讲座'
                ],
                official: true
            }
        };
    }

    // 生成完整的测试页面HTML
    generateTestPage(testId) {
        const config = this.testConfigs[testId];
        if (!config) {
            throw new Error(`测试 ${testId} 配置不存在`);
        }

        return this.buildTestPageHTML(testId, config);
    }

    // 构建测试页面HTML结构
    buildTestPageHTML(testId, config) {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 安全HTTP头 -->
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
        style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
        font-src 'self' https://cdnjs.cloudflare.com data:;
        img-src 'self' data: blob:;
        audio-src 'self' https://cdn.jsdelivr.net data: blob:;
        connect-src 'self' https://cdn.jsdelivr.net;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    ">
    
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    
    <title>${config.title}</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/test.css">
    <link rel="stylesheet" href="../css/accessibility.css">
    <link rel="stylesheet" href="../css/mobile-optimizations.css">
    <link rel="stylesheet" href="../css/enhanced-components.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- 跳过导航链接 -->
    <a href="#main-content" class="skip-link">跳过导航，直接到主要内容</a>
    
    <!-- 屏幕阅读器通告区域 -->
    <div id="sr-announcements" aria-live="polite" aria-atomic="true" style="position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"></div>
    
    ${this.buildNavigation()}
    ${this.buildMainContent(testId, config)}
    ${this.buildScripts(testId, config)}
</body>
</html>`;
    }

    // 构建导航栏
    buildNavigation() {
        return `
    <!-- 导航栏 -->
    <nav class="nav-bar">
        <div class="nav-container">
            <div class="logo">
                <a href="../index.html" class="home-link">
                    <img src="../images/logo.png" alt="IELTS听力评分解析" class="logo-img">
                    IELTS听力评分解析
                </a>
            </div>
            <button class="nav-toggle" aria-label="切换导航菜单" aria-expanded="false">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-menu">
                <li><a href="../index.html">首页</a></li>
                <li><a href="scoring.html">评分详解</a></li>
                <li><a href="cases.html">案例分析</a></li>
                <li><a href="practice.html">听力练习</a></li>
                <li><button onclick="keyboardNavigation?.showHelp()" class="help-btn">
                    <i class="fas fa-keyboard"></i> 快捷键
                </button></li>
            </ul>
        </div>
    </nav>`;
    }

    // 构建主要内容区域
    buildMainContent(testId, config) {
        return `
    <!-- 主要内容区 -->
    <main class="test-container" id="main-content">
        ${this.buildTestIntro(config)}
        
        <div class="test-layout">
            <!-- 左侧主要内容 -->
            <div class="test-main">
                ${this.buildEnhancedAudioPlayer(testId, config)}
                ${this.buildSectionTabs()}
                ${this.buildQuestionsContainer(testId)}
                ${this.buildTestActions()}
            </div>

            <!-- 右侧增强答题卡 -->
            <aside class="test-sidebar">
                <div class="answer-sheet-container" id="answer-sheet-container">
                    <!-- 答题卡内容将由JS动态生成 -->
                </div>
                
                <!-- 进度显示 -->
                <div class="progress-panel">
                    <h4>答题进度</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">0 / 40 题已完成</div>
                </div>
            </aside>
        </div>
    </main>

    <!-- 反馈容器 -->
    <div id="feedback-container"></div>`;
    }

    // 构建测试介绍
    buildTestIntro(config) {
        const badgeClass = config.official ? 'official' : 'standard';
        return `
        <!-- 测试说明 -->
        <div class="test-intro">
            <div class="test-header">
                <h1>${config.official ? '🏛️' : '📝'} ${config.title}</h1>
                <div class="test-badges">
                    <span class="badge ${badgeClass}">${config.official ? '官方真题' : '模拟测试'}</span>
                    <span class="badge difficulty">${config.difficulty}</span>
                    <span class="badge duration">30分钟</span>
                    <span class="badge questions">40题</span>
                </div>
            </div>
            
            <div class="test-themes">
                <h3>测试主题</h3>
                <div class="themes-grid">
                    ${config.themes.map((theme, index) => 
                        `<div class="theme-item">
                            <span class="section-num">Section ${index + 1}</span>
                            <span class="theme-text">${theme}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="enhancement-notice">
                <div class="notice-icon">🚀</div>
                <div class="notice-content">
                    <h3>增强特性</h3>
                    <ul class="feature-list">
                        <li><i class="fas fa-keyboard"></i> 全面键盘快捷键支持</li>
                        <li><i class="fas fa-play-circle"></i> 音频断点跳转功能</li>
                        <li><i class="fas fa-star"></i> 智能题目标记系统</li>
                        <li><i class="fas fa-mobile-alt"></i> 移动端优化体验</li>
                        <li><i class="fas fa-save"></i> 自动进度保存</li>
                    </ul>
                </div>
            </div>
        </div>`;
    }

    // 构建增强音频播放器
    buildEnhancedAudioPlayer(testId, config) {
        return `
                <!-- 增强音频播放器 -->
                <div class="enhanced-audio-player" data-test-id="${testId}">
                    ${config.audioConfig.sections.map((section, index) => 
                        `<div class="audio-section" id="audio-section-${index + 1}" ${index > 0 ? 'style="display: none;"' : ''}>
                            <div class="audio-player-main">
                                <audio id="section${index + 1}-player" 
                                       src="${config.audioConfig.cdnPath}${section}"
                                       data-local-src="${config.audioConfig.localPath}${section}"
                                       preload="metadata"></audio>
                            </div>
                            <div class="audio-controls">
                                <button id="section${index + 1}-play" class="play-btn" aria-label="播放/暂停Section ${index + 1}">
                                    <i class="fas fa-play"></i>
                                </button>
                                <div class="speed-control">
                                    <button class="speed-btn" onclick="enhancedAudioPlayer?.speedDown()">−</button>
                                    <span class="speed-display">1.00x</span>
                                    <button class="speed-btn" onclick="enhancedAudioPlayer?.speedUp()">+</button>
                                </div>
                            </div>
                            <div class="breakpoint-controls" id="breakpoint-controls-${index + 1}">
                                <!-- 断点按钮将由JS动态生成 -->
                            </div>
                        </div>`
                    ).join('')}
                    
                    <div class="audio-progress">
                        <input type="range" id="current-section-progress" class="progress" min="0" max="100" value="0">
                        <div class="time-display">
                            <span id="current-section-time">00:00 / 00:00</span>
                        </div>
                    </div>
                </div>`;
    }

    // 构建Section标签页
    buildSectionTabs() {
        return `
                <!-- 部分切换标签页 -->
                <div class="section-tabs" role="tablist">
                    <button class="section-tab active" data-section="1" role="tab" 
                            aria-selected="true" id="section1-tab">Section 1</button>
                    <button class="section-tab" data-section="2" role="tab" 
                            aria-selected="false" id="section2-tab">Section 2</button>
                    <button class="section-tab" data-section="3" role="tab" 
                            aria-selected="false" id="section3-tab">Section 3</button>
                    <button class="section-tab" data-section="4" role="tab" 
                            aria-selected="false" id="section4-tab">Section 4</button>
                </div>`;
    }

    // 构建题目容器
    buildQuestionsContainer(testId) {
        return `
                <!-- 题目内容区域 -->
                <div class="questions-container">
                    <div class="question-container active" id="section1-content" role="tabpanel">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 1 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section2-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 2 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section3-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 3 题目...</p>
                        </div>
                    </div>
                    
                    <div class="question-container" id="section4-content" role="tabpanel" style="display: none;">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>正在加载 Section 4 题目...</p>
                        </div>
                    </div>
                </div>`;
    }

    // 构建测试操作按钮
    buildTestActions() {
        return `
                <!-- 提交按钮 -->
                <div class="test-actions">
                    <button class="btn-secondary" onclick="resetTest()">
                        <i class="fas fa-redo"></i> 重新开始
                    </button>
                    <button class="btn-primary" onclick="submitTest()">
                        <i class="fas fa-paper-plane"></i> 提交答案
                    </button>
                </div>`;
    }

    // 构建JavaScript脚本
    buildScripts(testId, config) {
        return `
    <!-- JavaScript文件 -->
    <script src="../js/enhanced-audio-player.js"></script>
    <script src="../js/enhanced-answer-sheet.js"></script>
    <script src="../js/enhanced-keyboard-navigation.js"></script>
    <script src="../${config.dataFile}"></script>
    <script src="../${config.answersFile}"></script>
    <script src="../js/universal-test-generator.js"></script>
    
    <!-- 主初始化脚本 -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化测试页面
        const testId = '${testId}';
        const testConfig = universalTestGenerator.testConfigs[testId];
        
        // 初始化音频播放器
        if (window.enhancedAudioPlayer) {
            enhancedAudioPlayer.testId = testId;
            enhancedAudioPlayer.audioConfig = testConfig.audioConfig;
        }
        
        // 加载题目数据
        loadQuestionData(testId);
        
        // 初始化答题卡
        initializeAnswerSheet();
        
        // 绑定事件监听器
        bindEventListeners();
        
        // 显示启动提示
        setTimeout(() => {
            if (enhancedAnswerSheet) {
                enhancedAnswerSheet.showFeedback('🚀 ${config.title} 已准备就绪！按 H 查看帮助', 'info');
            }
        }, 1500);
    });
    
    // 加载题目数据
    function loadQuestionData(testId) {
        // 根据不同的测试ID加载对应的数据
        if (typeof TEST_DATA !== 'undefined') {
            renderQuestionSections(TEST_DATA);
        } else {
            // 尝试动态加载数据文件
            setTimeout(() => loadQuestionData(testId), 100);
        }
    }
    
    // 渲染题目部分
    function renderQuestionSections(data) {
        Object.keys(data).forEach((sectionKey, index) => {
            const sectionNum = index + 1;
            const container = document.getElementById(\`section\${sectionNum}-content\`);
            if (container) {
                container.innerHTML = renderSection(data[sectionKey], sectionNum);
            }
        });
    }
    
    // 渲染单个section
    function renderSection(sectionData, sectionNum) {
        let html = \`<div class="section-header">\`;
        html += \`<h2>Section \${sectionNum}</h2>\`;
        
        if (sectionData.instructions) {
            html += \`<div class="section-instructions">\${sectionData.instructions}</div>\`;
        }
        
        html += \`</div>\`;
        
        // 根据不同的题目类型渲染内容
        if (sectionData.formContent) {
            html += renderFormSection(sectionData.formContent, sectionNum);
        } else if (sectionData.parts) {
            html += renderPartsSection(sectionData.parts, sectionNum);
        } else if (sectionData.questions) {
            html += renderQuestionsSection(sectionData.questions, sectionNum);
        }
        
        return html;
    }
    
    // 渲染表单类型题目
    function renderFormSection(formData, sectionNum) {
        let html = \`<div class="form-content">\`;
        
        if (formData.title) {
            html += \`<h3>\${formData.title}</h3>\`;
        }
        
        if (formData.subtitle) {
            html += \`<div class="form-subtitle">\${formData.subtitle.replace(/\\n/g, '<br>')}</div>\`;
        }
        
        if (formData.items) {
            formData.items.forEach((item, index) => {
                const questionNum = (sectionNum - 1) * 10 + index + 1;
                if (item.text.includes('[' + (index + 1) + ']')) {
                    // 填空题
                    const processedText = item.text.replace(
                        \`[\${index + 1}]........................\`,
                        \`<input type="text" id="q\${questionNum}" class="fill-blank" placeholder="\${index + 1}" maxlength="20">\`
                    );
                    html += \`<div class="question-item" data-question="\${questionNum}">\${processedText}</div>\`;
                } else {
                    html += \`<div class="form-item \${item.type || ''}">\${item.text}</div>\`;
                }
            });
        }
        
        html += \`</div>\`;
        return html;
    }
    
    // 渲染parts类型题目
    function renderPartsSection(parts, sectionNum) {
        let html = '';
        
        parts.forEach((part, partIndex) => {
            html += \`<div class="question-part">\`;
            
            if (part.title) {
                html += \`<h3>\${part.title}</h3>\`;
            }
            
            if (part.instructions) {
                html += \`<div class="part-instructions">\${part.instructions}</div>\`;
            }
            
            if (part.questions) {
                html += renderQuestionsSection(part.questions, sectionNum, partIndex);
            }
            
            if (part.mapContent) {
                html += \`<div class="map-content">\`;
                html += \`<h4>\${part.mapContent.title}</h4>\`;
                if (part.mapContent.imageUrl) {
                    html += \`<img src="\${part.mapContent.imageUrl}" alt="地图" class="map-image">\`;
                }
                html += \`</div>\`;
            }
            
            if (part.boxContent) {
                html += \`<div class="box-content">\${part.boxContent}</div>\`;
            }
            
            html += \`</div>\`;
        });
        
        return html;
    }
    
    // 渲染问题列表
    function renderQuestionsSection(questions, sectionNum, partIndex = 0) {
        let html = \`<div class="mcq-container">\`;
        
        questions.forEach((question, qIndex) => {
            const questionId = question.id || \`q\${question.id || (sectionNum-1)*10 + qIndex + 1}\`;
            
            html += \`<div class="question-item" data-question="\${questionId}">\`;
            html += \`<h4>\${question.id || qIndex + 1}. \${question.text}</h4>\`;
            
            if (question.type === 'radio' && question.options) {
                html += \`<div class="options">\`;
                question.options.forEach((option, optIndex) => {
                    html += \`<label class="option-label">\`;
                    html += \`<input type="radio" name="\${questionId}" value="\${option.value}">\`;
                    html += \`<span class="option-text">\${option.value}. \${option.text}</span>\`;
                    html += \`</label>\`;
                });
                html += \`</div>\`;
            } else if (question.type === 'text') {
                html += \`<div class="text-input">\`;
                html += \`<input type="text" id="\${questionId}" placeholder="\${question.placeholder || ''}">\`;
                html += \`</div>\`;
            }
            
            html += \`</div>\`;
        });
        
        html += \`</div>\`;
        return html;
    }
    
    // 初始化答题卡
    function initializeAnswerSheet() {
        if (enhancedAnswerSheet) {
            // 构建题目数组
            const allQuestions = [];
            for (let i = 1; i <= 40; i++) {
                allQuestions.push({
                    id: \`q\${i}\`,
                    number: i
                });
            }
            enhancedAnswerSheet.setQuestions(allQuestions);
        }
    }
    
    // 绑定事件监听器
    function bindEventListeners() {
        // 监听答题变化
        document.addEventListener('input', function(e) {
            if (e.target.matches('input[type="text"], input[type="radio"]')) {
                const questionId = e.target.id || e.target.name;
                const value = e.target.type === 'radio' ? 
                    (e.target.checked ? e.target.value : null) : e.target.value;
                
                if (enhancedAnswerSheet && questionId) {
                    enhancedAnswerSheet.updateAnswer(questionId, value);
                }
                
                updateProgress();
            }
        });
        
        // Section切换事件
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const sectionNum = this.dataset.section;
                switchToSection(sectionNum);
            });
        });
        
        // 监听答题卡事件
        document.addEventListener('answerSheet:questionChanged', function(e) {
            console.log('切换到题目', e.detail.index + 1);
        });
    }
    
    // 切换到指定Section
    function switchToSection(sectionNum) {
        // 更新标签样式
        document.querySelectorAll('.section-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        const activeTab = document.querySelector(\`[data-section="\${sectionNum}"]\`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }
        
        // 更新内容区域
        document.querySelectorAll('.question-container').forEach(container => {
            container.style.display = 'none';
        });
        
        const activeContent = document.getElementById(\`section\${sectionNum}-content\`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
        
        // 更新音频播放器
        document.querySelectorAll('.audio-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const activeAudio = document.getElementById(\`audio-section-\${sectionNum}\`);
        if (activeAudio) {
            activeAudio.style.display = 'block';
        }
        
        // 通知音频播放器
        if (enhancedAudioPlayer) {
            enhancedAudioPlayer.currentSection = parseInt(sectionNum);
        }
    }
    
    // 更新进度
    function updateProgress() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="radio"]:checked');
        const totalQuestions = 40;
        const answeredCount = Array.from(inputs).filter(input => {
            return input.type === 'radio' ? input.checked : input.value.trim() !== '';
        }).length;
        
        const percentage = (answeredCount / totalQuestions) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) progressFill.style.width = percentage + '%';
        if (progressText) progressText.textContent = \`\${answeredCount} / \${totalQuestions} 题已完成\`;
    }
    
    // 重置测试
    function resetTest() {
        if (confirm('确定要重新开始测试吗？所有答案将被清除。')) {
            document.querySelectorAll('input').forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            
            if (enhancedAnswerSheet) {
                enhancedAnswerSheet.reset();
            }
            
            updateProgress();
        }
    }
    
    // 提交测试
    function submitTest() {
        const answers = {};
        
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'radio' && input.checked) {
                answers[input.name] = input.value;
            } else if (input.type === 'text' && input.value.trim()) {
                answers[input.id] = input.value.trim();
            }
        });
        
        console.log('提交答案:', answers);
        
        if (enhancedAnswerSheet) {
            enhancedAnswerSheet.showFeedback('答案已提交！', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'score-result.html';
        }, 2000);
    }
    
    // 初始化键盘导航系统
    if (keyboardNavigation) {
        keyboardNavigation.updateQuestionInfo(0, 40);
    }
    </script>`;
    }

    // 生成所有测试页面
    generateAllTestPages() {
        const results = {};
        
        Object.keys(this.testConfigs).forEach(testId => {
            try {
                results[testId] = this.generateTestPage(testId);
            } catch (error) {
                console.error(`生成 ${testId} 页面失败:`, error);
                results[testId] = null;
            }
        });
        
        return results;
    }

    // 获取测试列表
    getTestList() {
        return Object.keys(this.testConfigs).map(testId => ({
            id: testId,
            title: this.testConfigs[testId].title,
            difficulty: this.testConfigs[testId].difficulty,
            official: this.testConfigs[testId].official || false,
            themes: this.testConfigs[testId].themes
        }));
    }
}

// 全局初始化
const universalTestGenerator = new UniversalTestGenerator();

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.UniversalTestGenerator = UniversalTestGenerator;
    window.universalTestGenerator = universalTestGenerator;
}