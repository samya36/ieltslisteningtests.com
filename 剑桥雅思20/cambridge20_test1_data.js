// js/test-data-c20-1.js - 剑桥雅思20 Test1 数据文件

const CAMBRIDGE20_TEST1_DATA = {
    testInfo: {
        title: "剑桥雅思20 Test 1",
        sections: 4,
        totalQuestions: 40,
        timeLimit: 30 // 分钟
    },
    
    sections: [
        {
            id: 1,
            title: "Section 1",
            subtitle: "餐厅推荐咨询",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频 Test1/Section1.mp3",
            questions: "1-10",
            type: "填空题",
            instructions: "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 1,
                    type: "fill_blank",
                    text: "The Junction - Reason for recommendation: Good for people who are especially keen on ____",
                    answer: "fish"
                },
                {
                    id: 2,
                    type: "fill_blank", 
                    text: "The Junction - Other comments: The ____ is a good place for a drink",
                    answer: "roof"
                },
                {
                    id: 3,
                    type: "fill_blank",
                    text: "Paloma - Reason for recommendation: ____, good for sharing",
                    answer: "Spanish"
                },
                {
                    id: 4,
                    type: "fill_blank",
                    text: "Paloma - Other comments: A limited selection of ____ food on the menu",
                    answer: "vegetarian"
                },
                {
                    id: 5,
                    type: "fill_blank",
                    text: "The ____ - At the top of a ____",
                    answer: "Audley"
                },
                {
                    id: 6,
                    type: "fill_blank",
                    text: "At the top of a ____",
                    answer: "hotel"
                },
                {
                    id: 7,
                    type: "fill_blank",
                    text: "All the ____ are very good",
                    answer: "reviews"
                },
                {
                    id: 8,
                    type: "fill_blank",
                    text: "Only uses ____ ingredients",
                    answer: "local"
                },
                {
                    id: 9,
                    type: "fill_blank",
                    text: "Set lunch costs £____",
                    answer: "30/thirty"
                },
                {
                    id: 10,
                    type: "fill_blank",
                    text: "Portions probably of ____ size",
                    answer: "average"
                }
            ]
        },
        
        {
            id: 2,
            title: "Section 2", 
            subtitle: "Heather's Pottery Class",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频 Test1/Section2.mp3",
            questions: "11-20",
            type: "选择题 + 多选题",
            instructions: "Choose the correct letter, A, B or C.",
            
            questions_list: [
                {
                    id: 11,
                    type: "multiple_choice",
                    text: "Heather says pottery differs from other art forms because",
                    options: [
                        "A. it lasts longer in the ground.",
                        "B. it is practised by more people.", 
                        "C. it can be repaired more easily."
                    ],
                    answer: "A"
                },
                {
                    id: 12,
                    type: "multiple_choice", 
                    text: "Archaeologists sometimes identify the use of ancient pottery from",
                    options: [
                        "A. the clay it was made with.",
                        "B. the marks that are on it.",
                        "C. the basic shape of it."
                    ],
                    answer: "B"
                },
                {
                    id: 13,
                    type: "multiple_choice",
                    text: "Some people join Heather's pottery class because they want to",
                    options: [
                        "A. create an item that looks very old.",
                        "B. find something that they are good at.",
                        "C. make something that will outlive them."
                    ],
                    answer: "C"
                },
                {
                    id: 14,
                    type: "multiple_choice",
                    text: "What does Heather value most about being a potter?",
                    options: [
                        "A. its calming effect",
                        "B. its messy nature", 
                        "C. its physical benefits"
                    ],
                    answer: "A"
                },
                {
                    id: 15,
                    type: "multiple_choice",
                    text: "Most of the visitors to Edelman Pottery",
                    options: [
                        "A. bring friends to join courses.",
                        "B. have never made a pot before.",
                        "C. try to learn techniques too quickly."
                    ],
                    answer: "B"
                },
                {
                    id: 16,
                    type: "multiple_choice",
                    text: "Heather reminds her visitors that they should",
                    options: [
                        "A. put on their aprons.",
                        "B. change their clothes.",
                        "C. take off their jewellery."
                    ],
                    answer: "C"
                },
                {
                    id: 17,
                    type: "multi_select",
                    text: "Which TWO things does Heather explain about kilns?",
                    options: [
                        "A. what their function is",
                        "B. when they were invented", 
                        "C. ways of keeping them safe",
                        "D. where to put one in your home",
                        "E. what some people use instead of one"
                    ],
                    answer: "A"
                },
                {
                    id: 18,
                    type: "multi_select",
                    text: "Which TWO things does Heather explain about kilns?",
                    options: [
                        "A. what their function is",
                        "B. when they were invented", 
                        "C. ways of keeping them safe",
                        "D. where to put one in your home",
                        "E. what some people use instead of one"
                    ],
                    answer: "E"
                },
                {
                    id: 19,
                    type: "multi_select", 
                    text: "Which TWO points does Heather make about a potter's tools?",
                    options: [
                        "A. Some are hard to hold.",
                        "B. Some are worth buying.",
                        "C. Some are essential items.",
                        "D. Some have memorable names.",
                        "E. Some are available for use by participants."
                    ],
                    answer: "C"
                },
                {
                    id: 20,
                    type: "multi_select", 
                    text: "Which TWO points does Heather make about a potter's tools?",
                    options: [
                        "A. Some are hard to hold.",
                        "B. Some are worth buying.",
                        "C. Some are essential items.",
                        "D. Some have memorable names.",
                        "E. Some are available for use by participants."
                    ],
                    answer: "E"
                }
            ]
        },
        
        {
            id: 3,
            title: "Section 3",
            subtitle: "学生讨论：孤独感研究",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频 Test1/Section3.mp3", 
            questions: "21-30",
            type: "多选题 + 单选题",
            instructions: "Choose the correct letter, A, B or C.",
            
            questions_list: [
                {
                    id: 21,
                    type: "multi_select",
                    text: "Which TWO things do the students both believe are responsible for the increase in loneliness?",
                    options: [
                        "A. social media",
                        "B. smaller nuclear families",
                        "C. urban design", 
                        "D. longer lifespans",
                        "E. a mobile workforce"
                    ],
                    answer: "C"
                },
                {
                    id: 22,
                    type: "multi_select",
                    text: "Which TWO things do the students both believe are responsible for the increase in loneliness?",
                    options: [
                        "A. social media",
                        "B. smaller nuclear families",
                        "C. urban design", 
                        "D. longer lifespans",
                        "E. a mobile workforce"
                    ],
                    answer: "E"
                },
                {
                    id: 23,
                    type: "multi_select",
                    text: "Which TWO health risks associated with loneliness do the students agree are based on solid evidence?",
                    options: [
                        "A. a weakened immune system",
                        "B. dementia",
                        "C. cancer",
                        "D. obesity", 
                        "E. cardiovascular disease"
                    ],
                    answer: "A"
                },
                {
                    id: 24,
                    type: "multi_select",
                    text: "Which TWO health risks associated with loneliness do the students agree are based on solid evidence?",
                    options: [
                        "A. a weakened immune system",
                        "B. dementia",
                        "C. cancer",
                        "D. obesity", 
                        "E. cardiovascular disease"
                    ],
                    answer: "C"
                },
                {
                    id: 25,
                    type: "multi_select",
                    text: "Which TWO opinions do both the students express about the evolutionary theory of loneliness?",
                    options: [
                        "A. It has little practical relevance.",
                        "B. It needs further investigation.",
                        "C. It is misleading.",
                        "D. It should be more widely accepted.", 
                        "E. It is difficult to understand."
                    ],
                    answer: "A"
                },
                {
                    id: 26,
                    type: "multi_select",
                    text: "Which TWO opinions do both the students express about the evolutionary theory of loneliness?",
                    options: [
                        "A. It has little practical relevance.",
                        "B. It needs further investigation.",
                        "C. It is misleading.",
                        "D. It should be more widely accepted.", 
                        "E. It is difficult to understand."
                    ],
                    answer: "B"
                },
                {
                    id: 27,
                    type: "multiple_choice",
                    text: "What does Marcus think about the research on social media?",
                    options: [
                        "A. It shows that older people get greater benefits.",
                        "B. It hasn't produced very reliable results.",
                        "C. It shows social media is less harmful than expected."
                    ],
                    answer: "A"
                },
                {
                    id: 28,
                    type: "multiple_choice",
                    text: "What surprises the students about the research on dogs?",
                    options: [
                        "A. People who keep dogs tend to be lonely.",
                        "B. Dogs can help with depression in children.",
                        "C. Dogs provide emotional support for their owners."
                    ],
                    answer: "B"
                },
                {
                    id: 29,
                    type: "multiple_choice",
                    text: "What do the students think about meditation?",
                    options: [
                        "A. Too few people make an effort to learn it.",
                        "B. Too many people expect rapid results from it.",
                        "C. Too many claims are made about its benefits."
                    ],
                    answer: "A"
                },
                {
                    id: 30,
                    type: "multiple_choice",
                    text: "The students find it difficult to understand why solitude is considered to be",
                    options: [
                        "A. similar to loneliness.",
                        "B. necessary for mental health.",
                        "C. an enjoyable experience."
                    ],
                    answer: "C"
                }
            ]
        },
        
        {
            id: 4,
            title: "Section 4",
            subtitle: "城市河流改造讲座",
            audioPath: "https://cdn.jsdelivr.net/gh/samya36/ieltslisteningtests.com@v1.0.0-audio/剑桥雅思20/剑20 听力音频 Test1/Section4.mp3",
            questions: "31-40", 
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 31,
                    type: "fill_blank",
                    text: "In the past, the Cheonggyecheon was hidden under roads and ____",
                    answer: "factories"
                },
                {
                    id: 32,
                    type: "fill_blank",
                    text: "The stream was ____ and polluted",
                    answer: "dead"
                },
                {
                    id: 33,
                    type: "fill_blank",
                    text: "The mayor's plan was compared to feeding a ____",
                    answer: "whale"
                },
                {
                    id: 34,
                    type: "fill_blank",
                    text: "New ____ were built on the cleared land",
                    answer: "apartments"
                },
                {
                    id: 35,
                    type: "fill_blank",
                    text: "The stream is now the centrepiece of a linear ____",
                    answer: "park"
                },
                {
                    id: 36,
                    type: "fill_blank",
                    text: "The local ____ galleries and restaurants have been revitalised",
                    answer: "art"
                },
                {
                    id: 37,
                    type: "fill_blank",
                    text: "The nearby ____ have been restored as well",
                    answer: "beaches"
                },
                {
                    id: 38,
                    type: "fill_blank",
                    text: "There's now a regular ____ service on the river",
                    answer: "ferry"
                },
                {
                    id: 39,
                    type: "fill_blank",
                    text: "goods could be transported by large freight barges and electric ____",
                    answer: "bikes"
                },
                {
                    id: 40,
                    type: "fill_blank",
                    text: "or, in future, by ____.",
                    answer: "drone"
                }
            ]
        }
    ],
    
    // 答案汇总
    answers: [
        "fish", "roof", "Spanish", "vegetarian", "Audley", "hotel", "reviews", "local", "30/thirty", "average",
        "A", "B", "C", "A", "B", "C", "A", "E", "C", "E",
        "C", "E", "A", "C", "A", "B", "A", "B", "A", "C",
        "factories", "dead", "whale", "apartments", "park", "art", "beaches", "ferry", "bikes", "drone"
    ]
};

// 导出数据供测试页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAMBRIDGE20_TEST1_DATA;
}