// js/test-data-c20-3.js - 剑桥雅思20 Test3 数据文件

const testDataC20_3 = {
    testInfo: {
        title: "剑桥雅思20 Test 3",
        sections: 4,
        totalQuestions: 40,
        timeLimit: 30 // 分钟
    },
    
    audioConfig: {
        section1: "剑桥雅思20/剑20 听力音频Test3/Section1.mp3",
        section2: "剑桥雅思20/剑20 听力音频Test3/Section2.mp3",
        section3: "剑桥雅思20/剑20 听力音频Test3/Section3.mp3",
        section4: "剑桥雅思20/剑20 听力音频Test3/Section4.mp3"
    },
    
    sections: [
        {
            id: 1,
            title: "Section 1",
            subtitle: "家具租赁公司咨询",
            audioPath: "剑桥雅思20/剑20 听力音频Test3/Section1.mp3",
            questions: "1-10",
            type: "填空题",
            instructions: "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
            
            questions_list: [
                {
                    id: 1,
                    type: "fill_blank",
                    text: "Peak Rentals - Prices range from $105 to $ ____",
                    answer: "239"
                },
                {
                    id: 2,
                    type: "fill_blank",
                    text: "The furniture is very ____",
                    answer: "modern"
                },
                {
                    id: 3,
                    type: "fill_blank",
                    text: "free ____ with every living room set",
                    answer: "lamp"
                },
                {
                    id: 4,
                    type: "fill_blank",
                    text: "____ and Oliver - Mid-range prices",
                    answer: "Aaron"
                },
                {
                    id: 5,
                    type: "fill_blank",
                    text: "12% monthly fee for ____",
                    answer: "damage"
                },
                {
                    id: 6,
                    type: "fill_blank",
                    text: "Must have own ____",
                    answer: "electronic"
                },
                {
                    id: 7,
                    type: "fill_blank",
                    text: "Must have own ____",
                    answer: "insurance"
                },
                {
                    id: 8,
                    type: "fill_blank",
                    text: "____ Rentals - Offers cheapest prices for renting furniture",
                    answer: "Space/Space"
                },
                {
                    id: 9,
                    type: "fill_blank",
                    text: "See the ____ for the most up-to-date prices",
                    answer: "app"
                },
                {
                    id: 10,
                    type: "fill_blank",
                    text: "____ are allowed within 7 days of delivery",
                    answer: "exchanges"
                }
            ]
        },
        
        {
            id: 2,
            title: "Section 2",
            subtitle: "考古挖掘项目介绍",
            audioPath: "剑桥雅思20/剑20 听力音频Test3/Section2.mp3",
            questions: "11-20",
            type: "选择题 + 地图题",
            instructions: "Choose the correct letter, A, B or C.",
            
            questions_list: [
                {
                    id: 11,
                    type: "multiple_choice",
                    text: "Who was responsible for starting the community project?",
                    options: [
                        "A. the castle owners",
                        "B. a national charity",
                        "C. the local council"
                    ],
                    answer: "B"
                },
                {
                    id: 12,
                    type: "multiple_choice",
                    text: "How was the gold coin found?",
                    options: [
                        "A. Heavy rain had removed some of the soil.",
                        "B. The ground was dug up by wild rabbits.",
                        "C. A person with a metal detector searched the area."
                    ],
                    answer: "A"
                },
                {
                    id: 13,
                    type: "multiple_choice",
                    text: "What led the archaeologists to believe there was an ancient village on this site?",
                    options: [
                        "A. the lucky discovery of old records",
                        "B. the bases of several structures visible in the grass",
                        "C. the unusual stones found near the castle"
                    ],
                    answer: "A"
                },
                {
                    id: 14,
                    type: "multiple_choice",
                    text: "What are the team still hoping to find?",
                    options: [
                        "A. everyday pottery",
                        "B. animal bones",
                        "C. pieces of jewellery"
                    ],
                    answer: "C"
                },
                {
                    id: 15,
                    type: "multiple_choice",
                    text: "What was found on the other side of the river to the castle?",
                    options: [
                        "A. the remains of a large palace",
                        "B. the outline of fields",
                        "C. a number of small huts"
                    ],
                    answer: "B"
                },
                {
                    id: 16,
                    type: "multiple_choice",
                    text: "What do the team plan to do after work ends this summer?",
                    options: [
                        "A. prepare a display for a museum",
                        "B. take part in a television programme",
                        "C. start to organise school visits"
                    ],
                    answer: "C"
                },
                {
                    id: 17,
                    type: "map_labeling",
                    text: "17. bridge foundations",
                    answer: "B"
                },
                {
                    id: 18,
                    type: "map_labeling",
                    text: "18. rubbish pit",
                    answer: "A"
                },
                {
                    id: 19,
                    type: "map_labeling",
                    text: "19. meeting hall",
                    answer: "G"
                },
                {
                    id: 20,
                    type: "map_labeling",
                    text: "20. fish pond",
                    answer: "E"
                }
            ]
        },
        
        {
            id: 3,
            title: "Section 3",
            subtitle: "戏剧项目学术讨论",
            audioPath: "剑桥雅思20/剑20 听力音频Test3/Section3.mp3",
            questions: "21-30",
            type: "选择题 + 匹配题",
            instructions: "Choose the correct letter, A, B or C.",
            
            questions_list: [
                {
                    id: 21,
                    type: "multiple_choice",
                    text: "Finn was pleased to discover that their topic",
                    options: [
                        "A. was not familiar to their module leader.",
                        "B. had not been chosen by other students.",
                        "C. did not prove to be difficult to research."
                    ],
                    answer: "B"
                },
                {
                    id: 22,
                    type: "multiple_choice",
                    text: "Maya says a mistaken belief about theatre programmes is that",
                    options: [
                        "A. theatres pay companies to produce them.",
                        "B. few theatre-goers buy them nowadays.",
                        "C. they contain far more adverts than previously."
                    ],
                    answer: "A"
                },
                {
                    id: 23,
                    type: "multiple_choice",
                    text: "Finn was surprised that, in early British theatre, programmes",
                    options: [
                        "A. were difficult for audiences to obtain.",
                        "B. were given out free of charge.",
                        "C. were seen as a kind of contract."
                    ],
                    answer: "C"
                },
                {
                    id: 24,
                    type: "multiple_choice",
                    text: "Maya feels their project should include an explanation of why companies of actors",
                    options: [
                        "A. promoted their own plays.",
                        "B. performed plays outdoors.",
                        "C. had to tour with their plays."
                    ],
                    answer: "A"
                },
                {
                    id: 25,
                    type: "multiple_choice",
                    text: "Finn and Maya both think that, compared to nineteenth-century programmes, those from the eighteenth century",
                    options: [
                        "A. were more original.",
                        "B. were more colourful.",
                        "C. were more informative."
                    ],
                    answer: "C"
                },
                {
                    id: 26,
                    type: "multiple_choice",
                    text: "Maya doesn't fully understand why, in the twentieth century,",
                    options: [
                        "A. very few theatre programmes were printed in the USA.",
                        "B. British theatre programmes failed to develop for so long.",
                        "C. theatre programmes in Britain copied fashions from the USA."
                    ],
                    answer: "B"
                },
                {
                    id: 27,
                    type: "matching",
                    text: "27. Ruy Blas",
                    answer: "F"
                },
                {
                    id: 28,
                    type: "matching",
                    text: "28. Man of La Mancha",
                    answer: "E"
                },
                {
                    id: 29,
                    type: "matching",
                    text: "29. The Tragedy of Jane Shore",
                    answer: "B"
                },
                {
                    id: 30,
                    type: "matching",
                    text: "30. The Sailors' Festival",
                    answer: "D"
                }
            ]
        },
        
        {
            id: 4,
            title: "Section 4",
            subtitle: "包容性设计讲座",
            audioPath: "剑桥雅思20/剑20 听力音频Test3/Section4.mp3",
            questions: "31-40",
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            
            questions_list: [
                {
                    id: 31,
                    type: "fill_blank",
                    text: "Designing products that can be accessed by a diverse range of people without the need for any ____",
                    answer: "adaptation"
                },
                {
                    id: 32,
                    type: "fill_blank",
                    text: "Not the same as universal design: that is design for everyone, including catering for people with ____ problems.",
                    answer: "cognitive"
                },
                {
                    id: 33,
                    type: "fill_blank",
                    text: "____ which are adjustable, avoiding back or neck problems",
                    answer: "desks"
                },
                {
                    id: 34,
                    type: "fill_blank",
                    text: "____ in public toilets which are easier to use",
                    answer: "taps"
                },
                {
                    id: 35,
                    type: "fill_blank",
                    text: "designers avoid using ____ in interfaces",
                    answer: "blue"
                },
                {
                    id: 36,
                    type: "fill_blank",
                    text: "people can make commands using a mouse, keyboard or their ____",
                    answer: "voice"
                },
                {
                    id: 37,
                    type: "fill_blank",
                    text: "Seatbelts are especially problematic for ____ women.",
                    answer: "pregnant"
                },
                {
                    id: 38,
                    type: "fill_blank",
                    text: "PPE jackets are often unsuitable because of the size of women's ____",
                    answer: "shoulders"
                },
                {
                    id: 39,
                    type: "fill_blank",
                    text: "PPE for female ____ officers dealing with emergencies is the worst.",
                    answer: "police"
                },
                {
                    id: 40,
                    type: "fill_blank",
                    text: "The ____ in offices is often too low for women.",
                    answer: "temperature"
                }
            ]
        }
    ],
    
    // 完整答案列表
    answers: [
        "239", "modern", "lamp", "Aaron", "damage", "electronic", "insurance", "Space", "app", "exchanges",
        "B", "A", "A", "C", "B", "C", "B", "A", "G", "E",
        "B", "A", "C", "A", "C", "B", "F", "E", "B", "D",
        "adaptation", "cognitive", "desks", "taps", "blue", "voice", "pregnant", "shoulders", "police", "temperature"
    ]
};

// 导出数据供测试页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testDataC20_3;
}