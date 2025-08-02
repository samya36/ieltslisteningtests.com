// 剑桥雅思20 Test 4 数据文件

const CAMBRIDGE20_TEST4_DATA = {
    testInfo: {
        title: "剑桥雅思20 Test 4",
        sections: 4,
        totalQuestions: 40,
        timeLimit: 30 // 分钟
    },
    
    audioConfig: {
        section1: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section1.mp3",
        section2: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section2.mp3",
        section3: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section3.mp3",
        section4: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section4.mp3"
    },
    
    sections: [
        {
            id: 1,
            title: "Section 1",
            subtitle: "音乐学院信息咨询",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section1.mp3",
            questions: "1-10",
            type: "填空题",
            instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 1,
                    type: "fill_blank",
                    text: "Full name: Sara ____",
                    answer: "Baxter"
                },
                {
                    id: 2,
                    type: "fill_blank",
                    text: "Date of birth: 25th ____",
                    answer: "February"
                },
                {
                    id: 3,
                    type: "fill_blank",
                    text: "Telephone: ____",
                    answer: "07886534291"
                },
                {
                    id: 4,
                    type: "fill_blank",
                    text: "The apartment is above a ____",
                    answer: "café"
                },
                {
                    id: 5,
                    type: "fill_blank",
                    text: "Monthly rent: £____",
                    answer: "850"
                },
                {
                    id: 6,
                    type: "fill_blank",
                    text: "Transport: close to ____ and shops",
                    answer: "station"
                },
                {
                    id: 7,
                    type: "fill_blank",
                    text: "Will need a ____ for the move",
                    answer: "van"
                },
                {
                    id: 8,
                    type: "fill_blank",
                    text: "Moving on: Saturday ____",
                    answer: "12th"
                },
                {
                    id: 9,
                    type: "fill_blank",
                    text: "Has a ____ but needs help loading it",
                    answer: "car"
                },
                {
                    id: 10,
                    type: "fill_blank",
                    text: "Will pay an extra £____ for the loading service",
                    answer: "25"
                }
            ]
        },
        {
            id: 2,
            title: "Section 2",
            subtitle: "奔宁山脉徒步介绍",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section2.mp3",
            questions: "11-20",
            type: "选择题和填空题",
            instructions: "Choose the correct letter A, B or C, and complete the sentences below.",
            
            questions_list: [
                {
                    id: 11,
                    type: "multiple_choice",
                    text: "What does the speaker say about the Pennine Way?",
                    options: [
                        "A. It was the first long-distance path in Britain",
                        "B. It passes through three different countries",
                        "C. It follows the oldest route through the mountains"
                    ],
                    answer: "A"
                },
                {
                    id: 12,
                    type: "multiple_choice",
                    text: "What is the most difficult section according to the speaker?",
                    options: [
                        "A. the route from Middleton to Harwick",
                        "B. the climb up to High Rock",
                        "C. the descent into Wilton Green"
                    ],
                    answer: "B"
                },
                {
                    id: 13,
                    type: "multiple_choice",
                    text: "What does the speaker warn people about?",
                    options: [
                        "A. deep water in the rivers",
                        "B. the danger of getting lost",
                        "C. sudden changes in the weather"
                    ],
                    answer: "C"
                },
                {
                    id: 14,
                    type: "multiple_choice",
                    text: "The speaker suggests that inexperienced walkers should",
                    options: [
                        "A. avoid walking alone",
                        "B. carry extra water and food",
                        "C. take a mobile phone"
                    ],
                    answer: "A"
                },
                {
                    id: 15,
                    type: "multiple_choice",
                    text: "What are most people not prepared for?",
                    options: [
                        "A. how tiring it will be",
                        "B. how much time it will take",
                        "C. how expensive it will be"
                    ],
                    answer: "B"
                },
                {
                    id: 16,
                    type: "fill_blank",
                    text: "Hikers must book accommodation well in advance during ____",
                    answer: "summer"
                },
                {
                    id: 17,
                    type: "fill_blank",
                    text: "The best time to see ____ is early morning",
                    answer: "deer"
                },
                {
                    id: 18,
                    type: "fill_blank",
                    text: "Many of the ____ serve excellent food",
                    answer: "pubs"
                },
                {
                    id: 19,
                    type: "fill_blank",
                    text: "Some walkers camp by the ____ which can be dangerous",
                    answer: "river"
                },
                {
                    id: 20,
                    type: "fill_blank",
                    text: "The local ____ service will help if you get into difficulties",
                    answer: "rescue"
                }
            ]
        },
        {
            id: 3,
            title: "Section 3",
            subtitle: "学生讨论：城市设计课程",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section3.mp3",
            questions: "21-30",
            type: "选择题和匹配题",
            instructions: "Choose the correct letter A, B or C, and complete the matching exercise.",
            
            questions_list: [
                {
                    id: 21,
                    type: "multiple_choice",
                    text: "How does Mike feel about doing the urban design module?",
                    options: [
                        "A. It is more difficult than he expected",
                        "B. It is helping him focus on his career",
                        "C. It is different from other modules he has done"
                    ],
                    answer: "B"
                },
                {
                    id: 22,
                    type: "multiple_choice",
                    text: "What is Kate's opinion about the cities they have studied?",
                    options: [
                        "A. Some are more successful than others",
                        "B. Most have been well-planned",
                        "C. They have many similarities"
                    ],
                    answer: "A"
                },
                {
                    id: 23,
                    type: "multiple_choice",
                    text: "According to Kate, when do urban problems increase?",
                    options: [
                        "A. when cities are built too quickly",
                        "B. when there is not enough housing",
                        "C. when planning is inappropriate"
                    ],
                    answer: "C"
                },
                {
                    id: 24,
                    type: "multiple_choice",
                    text: "What do the students agree about global urbanisation?",
                    options: [
                        "A. It is causing more problems than before",
                        "B. It is impossible to control",
                        "C. It is having both positive and negative effects"
                    ],
                    answer: "C"
                },
                {
                    id: 25,
                    type: "multiple_choice",
                    text: "What will the students focus on in their project?",
                    options: [
                        "A. how cities can become more sustainable",
                        "B. how people's lifestyles are changing",
                        "C. how technology is affecting city planning"
                    ],
                    answer: "A"
                },
                {
                    id: 26,
                    type: "matching",
                    text: "26. Barcelona",
                    answer: "E"
                },
                {
                    id: 27,
                    type: "matching",
                    text: "27. Detroit",
                    answer: "G"
                },
                {
                    id: 28,
                    type: "matching",
                    text: "28. Freiburg",
                    answer: "C"
                },
                {
                    id: 29,
                    type: "matching",
                    text: "29. Istanbul",
                    answer: "A"
                },
                {
                    id: 30,
                    type: "matching",
                    text: "30. Seville",
                    answer: "F"
                }
            ]
        },
        {
            id: 4,
            title: "Section 4",
            subtitle: "文学翻译讲座",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test4/Section4.mp3",
            questions: "31-40",
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            
            questions_list: [
                {
                    id: 31,
                    type: "fill_blank",
                    text: "Translation involves changing the ____ of a text",
                    answer: "language"
                },
                {
                    id: 32,
                    type: "fill_blank",
                    text: "A word-for-word translation can sound ____",
                    answer: "mechanical"
                },
                {
                    id: 33,
                    type: "fill_blank",
                    text: "Good translators must understand the ____ of the text",
                    answer: "culture"
                },
                {
                    id: 34,
                    type: "fill_blank",
                    text: "Poetry translation requires a ____ approach",
                    answer: "creative"
                },
                {
                    id: 35,
                    type: "fill_blank",
                    text: "It's important to maintain the ____ of the original",
                    answer: "rhythm"
                },
                {
                    id: 36,
                    type: "fill_blank",
                    text: "Drama translation needs to sound ____",
                    answer: "natural"
                },
                {
                    id: 37,
                    type: "fill_blank",
                    text: "Translators must consider the ____ of their readers",
                    answer: "expectations"
                },
                {
                    id: 38,
                    type: "fill_blank",
                    text: "Modern technology offers many ____ to translators",
                    answer: "tools"
                },
                {
                    id: 39,
                    type: "fill_blank",
                    text: "However, computers cannot understand ____",
                    answer: "context"
                },
                {
                    id: 40,
                    type: "fill_blank",
                    text: "Translation will always require human ____",
                    answer: "judgement"
                }
            ]
        }
    ],
    
    // 完整答案列表
    answers: [
        "Baxter", "February", "07886534291", "café", "850", "guitar", "drums", "intermediate", "group", "advance",
        "A", "B", "C", "C", "B", "performance", "creative", "director", "scripts", "funding",
        "B", "A", "B", "C", "A", "C", "F", "A", "B", "D",
        "automatically", "data", "pattern", "speed", "images", "grammar", "medical", "legal", "context", "judgement"
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAMBRIDGE20_TEST4_DATA;
}