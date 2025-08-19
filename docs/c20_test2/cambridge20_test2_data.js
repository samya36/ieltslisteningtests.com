// js/test-data-c20-2.js - 剑桥雅思20 Test2 数据文件

const CAMBRIDGE20_TEST2_DATA = {
    testInfo: {
        title: "剑桥雅思20 Test 2",
        sections: 4,
        totalQuestions: 40,
        timeLimit: 30 // 分钟
    },
    
    audioConfig: {
        section1: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section1.mp3",
        section2: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section2.mp3",
        section3: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section3.mp3",
        section4: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section4.mp3"
    },
    
    sections: [
        {
            id: 1,
            title: "Section 1",
            subtitle: "照护老人支持服务咨询",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section1.mp3",
            questions: "1-10",
            type: "填空题",
            instructions: "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 1,
                    type: "fill_blank",
                    text: "This can give the carer: a ____",
                    answer: "break"
                },
                {
                    id: 2,
                    type: "fill_blank",
                    text: "how much ____ the caring involves",
                    answer: "time"
                },
                {
                    id: 3,
                    type: "fill_blank",
                    text: "helping her have a ____",
                    answer: "shower"
                },
                {
                    id: 4,
                    type: "fill_blank",
                    text: "dealing with ____",
                    answer: "money"
                },
                {
                    id: 5,
                    type: "fill_blank",
                    text: "loss of ____",
                    answer: "memory"
                },
                {
                    id: 6,
                    type: "fill_blank",
                    text: "____ her",
                    answer: "lifting"
                },
                {
                    id: 7,
                    type: "fill_blank",
                    text: "preventing a ____",
                    answer: "fall"
                },
                {
                    id: 8,
                    type: "fill_blank",
                    text: "transport costs, e.g. cost of a ____",
                    answer: "taxi"
                },
                {
                    id: 9,
                    type: "fill_blank",
                    text: "car-related costs, e.g. fuel and ____",
                    answer: "insurance"
                },
                {
                    id: 10,
                    type: "fill_blank",
                    text: "help to reduce ____",
                    answer: "stress"
                }
            ]
        },
        
        {
            id: 2,
            title: "Section 2",
            subtitle: "志愿者活动介绍",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section2.mp3",
            questions: "11-20",
            type: "匹配题 + 选择题",
            instructions: "What is the role of the volunteers in each of the following activities? Choose SIX answers from the box.",
            
            questions_list: [
                {
                    id: 11,
                    type: "matching",
                    text: "11. walking around the town centre",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "D"
                },
                {
                    id: 12,
                    type: "matching",
                    text: "12. helping at concerts",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "I"
                },
                {
                    id: 13,
                    type: "matching",
                    text: "13. getting involved with community groups",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "H"
                },
                {
                    id: 14,
                    type: "matching",
                    text: "14. helping with a magazine",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "E"
                },
                {
                    id: 15,
                    type: "matching",
                    text: "15. participating at lunches for retired people",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "A"
                },
                {
                    id: 16,
                    type: "matching",
                    text: "16. helping with the website",
                    options: [
                        "A. talking to members of the public",
                        "B. designing posters", 
                        "C. planning events",
                        "D. accompanying someone to look at the area",
                        "E. writing articles",
                        "F. taking photographs",
                        "G. attending training sessions",
                        "H. making contact with organizers",
                        "I. helping with equipment"
                    ],
                    answer: "B"
                },
                {
                    id: 17,
                    type: "multiple_choice",
                    text: "Which event requires the largest number of volunteers?",
                    options: [
                        "A. the music festival",
                        "B. the science festival",
                        "C. the book festival"
                    ],
                    answer: "B"
                },
                {
                    id: 18,
                    type: "multiple_choice",
                    text: "What is the most important requirement for volunteers at the festivals?",
                    options: [
                        "A. interpersonal skills",
                        "B. personal interest in the event",
                        "C. flexibility"
                    ],
                    answer: "A"
                },
                {
                    id: 19,
                    type: "multiple_choice",
                    text: "New volunteers will start working in the week beginning",
                    options: [
                        "A. 2 September.",
                        "B. 9 September.",
                        "C. 23 September."
                    ],
                    answer: "B"
                },
                {
                    id: 20,
                    type: "multiple_choice",
                    text: "What is the next annual event for volunteers?",
                    options: [
                        "A. a boat trip",
                        "B. a barbecue",
                        "C. a party"
                    ],
                    answer: "A"
                }
            ]
        },
        
        {
            id: 3,
            title: "Section 3",
            subtitle: "人文地理学讨论",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section3.mp3",
            questions: "21-30",
            type: "匹配题 + 选择题",
            instructions: "What is Rosie and Colin's opinion about each of the following aspects of human geography?",
            
            questions_list: [
                {
                    id: 21,
                    type: "matching",
                    text: "21. Population",
                    options: [
                        "A. needs more research to be done",
                        "B. is an area that the course should focus on more",
                        "C. has been covered well in the course",
                        "D. is a topic that students know little about",
                        "E. relates strongly to the economy",
                        "F. is increasing too rapidly",
                        "G. has had considerable effects on the environment"
                    ],
                    answer: "D"
                },
                {
                    id: 22,
                    type: "matching",
                    text: "22. Health",
                    options: [
                        "A. needs more research to be done",
                        "B. is an area that the course should focus on more",
                        "C. has been covered well in the course",
                        "D. is a topic that students know little about",
                        "E. relates strongly to the economy",
                        "F. is increasing too rapidly",
                        "G. has had considerable effects on the environment"
                    ],
                    answer: "G"
                },
                {
                    id: 23,
                    type: "matching",
                    text: "23. Economies",
                    options: [
                        "A. needs more research to be done",
                        "B. is an area that the course should focus on more",
                        "C. has been covered well in the course",
                        "D. is a topic that students know little about",
                        "E. relates strongly to the economy",
                        "F. is increasing too rapidly",
                        "G. has had considerable effects on the environment"
                    ],
                    answer: "B"
                },
                {
                    id: 24,
                    type: "matching",
                    text: "24. Culture",
                    options: [
                        "A. needs more research to be done",
                        "B. is an area that the course should focus on more",
                        "C. has been covered well in the course",
                        "D. is a topic that students know little about",
                        "E. relates strongly to the economy",
                        "F. is increasing too rapidly",
                        "G. has had considerable effects on the environment"
                    ],
                    answer: "A"
                },
                {
                    id: 25,
                    type: "matching",
                    text: "25. Poverty",
                    options: [
                        "A. needs more research to be done",
                        "B. is an area that the course should focus on more",
                        "C. has been covered well in the course",
                        "D. is a topic that students know little about",
                        "E. relates strongly to the economy",
                        "F. is increasing too rapidly",
                        "G. has had considerable effects on the environment"
                    ],
                    answer: "E"
                },
                {
                    id: 26,
                    type: "multiple_choice",
                    text: "Rosie says that in her own city the main problem is",
                    options: [
                        "A. crime.",
                        "B. housing.",
                        "C. unemployment."
                    ],
                    answer: "C"
                },
                {
                    id: 27,
                    type: "multiple_choice",
                    text: "What recent additions to the outskirts of their cities are both students happy about?",
                    options: [
                        "A. conference centres",
                        "B. sports centres",
                        "C. retail centres"
                    ],
                    answer: "A"
                },
                {
                    id: 28,
                    type: "multiple_choice",
                    text: "The students agree that developing disused industrial sites may",
                    options: [
                        "A. have unexpected costs.",
                        "B. damage the urban environment.",
                        "C. destroy valuable historical buildings."
                    ],
                    answer: "A"
                },
                {
                    id: 29,
                    type: "multiple_choice",
                    text: "The students will mention Masdar City as an example of an attempt to achieve",
                    options: [
                        "A. daily collections for waste recycling.",
                        "B. sustainable energy use.",
                        "C. free transport for everyone."
                    ],
                    answer: "B"
                },
                {
                    id: 30,
                    type: "multiple_choice",
                    text: "When discussing the ecotown of Greenhill Abbots, Colin is uncertain about",
                    options: [
                        "A. what its objectives were.",
                        "B. why there was opposition to it.",
                        "C. how much of it has actually been built."
                    ],
                    answer: "C"
                }
            ]
        },
        
        {
            id: 4,
            title: "Section 4",
            subtitle: "食品流行趋势发展讲座",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频Test2/Section4.mp3",
            questions: "31-40",
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            
            questions_list: [
                {
                    id: 31,
                    type: "fill_blank",
                    text: "The growth in interest in food fashions started with ____ of food being shared on social media.",
                    answer: "photos/photographs/pictures"
                },
                {
                    id: 32,
                    type: "fill_blank",
                    text: "Sales of ____ food brands have grown rapidly this way.",
                    answer: "vegan"
                },
                {
                    id: 33,
                    type: "fill_blank",
                    text: "Famous ____ are influential.",
                    answer: "chefs/cooks"
                },
                {
                    id: 34,
                    type: "fill_blank",
                    text: "____ were invited to visit growers in South Africa.",
                    answer: "journalists/reporters"
                },
                {
                    id: 35,
                    type: "fill_blank",
                    text: "Advertising focused on its ____ benefits.",
                    answer: "health"
                },
                {
                    id: 36,
                    type: "fill_blank",
                    text: "Promotion in the USA through ____ shops reduced the need for advertising.",
                    answer: "coffee"
                },
                {
                    id: 37,
                    type: "fill_blank",
                    text: "It appealed to consumers who are concerned about the ____",
                    answer: "environment"
                },
                {
                    id: 38,
                    type: "fill_blank",
                    text: "has helped strengthen the ____ of Norwegian seafood.",
                    answer: "reputation"
                },
                {
                    id: 39,
                    type: "fill_blank",
                    text: "Its success led to an increase in its ____",
                    answer: "price/cost"
                },
                {
                    id: 40,
                    type: "fill_blank",
                    text: "Overuse of resources resulted in poor quality ____",
                    answer: "soil"
                }
            ]
        }
    ],
    
    // 完整答案列表
    answers: [
        "break", "time", "shower", "money", "memory", "lifting", "fall", "taxi", "insurance", "stress",
        "D", "I", "H", "E", "A", "B", "B", "A", "B", "A",
        "D", "G", "B", "A", "E", "C", "A", "A", "B", "C",
        "photos", "vegan", "chefs", "journalists", "health", "coffee", "environment", "reputation", "price", "soil"
    ]
};

// 导出数据供测试页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAMBRIDGE20_TEST2_DATA;
}