// js/test-data-c20-1.js - 剑桥雅思20 Test1 数据文件

const testDataC20_1 = {
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
            audioPath: "剑桥雅思20/剑20 听力音频 Test1/Section1.mp3",
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
            audioPath: "剑桥雅思20/剑20 听力音频 Test1/Section2.mp3",
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
                    text: "Which TWO things does Heather explain about kilns? (Questions 17-18)",
                    options: [
                        "A. what their function is",
                        "B. when they were invented", 
                        "C. ways of keeping them safe",
                        "D. where to put one in your home",
                        "E. what some people use instead of one"
                    ],
                    answer: ["A", "E"]
                },
                {
                    id: 19,
                    type: "multi_select", 
                    text: "Which TWO points does Heather make about a potter's tools? (Questions 19-20)",
                    options: [
                        "A. Some are hard to hold.",
                        "B. Some are worth buying.",
                        "C. Some are essential items.",
                        "D. Some have memorable names.",
                        "E. Some are available for use by participants."
                    ],
                    answer: ["C", "E"]
                }
            ]
        },
        
        {
            id: 3,
            title: "Section 3",
            subtitle: "学生讨论：孤独感研究",
            audioPath: "剑桥雅思20/剑20 听力音频 Test1/Section3.mp3", 
            questions: "21-30",
            type: "多选题 + 单选题",
            instructions: "Choose the correct letter, A, B or C.",
            
            questions_list: [
                {
                    id: 21,
                    type: "multi_select",
                    text: "Which TWO things do the students both believe are responsible for the increase in loneliness? (Questions 21-22)",
                    options: [
                        "A. social media",
                        "B. smaller nuclear families",
                        "C. urban design", 
                        "D. longer lifespans",
                        "E. a mobile workforce"
                    ],
                    answer: ["C", "E"]
                },
                {
                    id: 23,
                    type: "multi_select",
                    text: "Which TWO health risks associated with loneliness do the students agree are based on solid evidence? (Questions 23-24)",
                    options: [
                        "A. a weakened immune system",
                        "B. dementia",
                        "C. cancer",
                        "D. obesity", 
                        "E. cardiovascular disease"
                    ],
                    answer: ["A", "C"]
                },
                {
                    id: 25,
                    type: "multi_select",
                    text: "Which TWO opinions do both the students express about the evolutionary theory of loneliness? (Questions 25-26)",
                    options: [
                        "A. It has little practical relevance.",
                        "B. It needs further investigation.",
                        "C. It is misleading.",
                        "D. It should be more widely accepted.", 
                        "E. It is difficult to understand."
                    ],
                    answer: ["A", "B"]
                },
                {
                    id: 27,
                    type: "multiple_choice",
                    text: "When comparing loneliness to depression, the students",
                    options: [
                        "A. doubt that there will ever be a medical cure for loneliness.",
                        "B. claim that the link between loneliness and mental health is overstated.",
                        "C. express frustration that loneliness is not taken more seriously."
                    ],
                    answer: "A"
                },
                {
                    id: 28,
                    type: "multiple_choice",
                    text: "Why do the students decide to start their presentation with an example from their own experience?",
                    options: [
                        "A. to explain how difficult loneliness can be",
                        "B. to highlight a situation that most students will recognise", 
                        "C. to emphasise that feeling lonely is more common for men than women"
                    ],
                    answer: "B"
                },
                {
                    id: 29,
                    type: "multiple_choice",
                    text: "The students agree that talking to strangers is a good strategy for dealing with loneliness because",
                    options: [
                        "A. it creates a sense of belonging.",
                        "B. it builds self-confidence.",
                        "C. it makes people feel more positive."
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
            audioPath: "剑桥雅思20/剑20 听力音频 Test1/Section4.mp3",
            questions: "31-40", 
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 31,
                    type: "fill_blank",
                    text: "pollution from ____ on the river bank.",
                    answer: "factories"
                },
                {
                    id: 32,
                    type: "fill_blank",
                    text: "In 1957, the River Thames in London was declared biologically ____.",
                    answer: "dead"
                },
                {
                    id: 33,
                    type: "fill_blank", 
                    text: "Seals and even a ____ have been seen in the River Thames.",
                    answer: "whale"
                },
                {
                    id: 34,
                    type: "fill_blank",
                    text: "Riverside warehouses are converted to restaurants and ____.",
                    answer: "apartments"
                },
                {
                    id: 35,
                    type: "fill_blank",
                    text: "build a riverside ____.",
                    answer: "park"
                },
                {
                    id: 36,
                    type: "fill_blank",
                    text: "display ____ projects.",
                    answer: "art"
                },
                {
                    id: 37,
                    type: "fill_blank",
                    text: "In Paris, ____ are created on the sides of the river every summer.",
                    answer: "beaches"
                },
                {
                    id: 38,
                    type: "fill_blank",
                    text: "Over 2 billion passengers already travel by ____ in cities round the world.",
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
        "A", "B", "C", "A", "B", "C", "AE", "CE", 
        "CE", "AC", "AB", "A", "B", "A", "C",
        "factories", "dead", "whale", "apartments", "park", "art", "beaches", "ferry", "bikes", "drone"
    ]
};

// 导出数据供测试页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testDataC20_1;
}