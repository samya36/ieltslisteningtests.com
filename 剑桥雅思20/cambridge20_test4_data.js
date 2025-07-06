// 剑桥雅思20 Test 4 数据文件

const CAMBRIDGE20_TEST4_DATA = {
    testInfo: {
        title: "剑桥雅思20 Test 4",
        sections: 4,
        totalQuestions: 40,
        timeLimit: 30 // 分钟
    },
    
    sections: [
        {
            id: 1,
            title: "Section 1",
            subtitle: "剑桥雅思20官方听力测试第一部分",
            audioPath: "../剑桥雅思20/剑20 听力音频Test4/Section1.mp3",
            questions: "1-10",
            type: "填空题",
            instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
            content: [
                {
                    type: "form",
                    title: "Test 4 Section 1 Questions",
                    items: [
                        { question: 1, text: "Question 1: ________", answer: "" },
                        { question: 2, text: "Question 2: ________", answer: "" },
                        { question: 3, text: "Question 3: ________", answer: "" },
                        { question: 4, text: "Question 4: ________", answer: "" },
                        { question: 5, text: "Question 5: ________", answer: "" },
                        { question: 6, text: "Question 6: ________", answer: "" },
                        { question: 7, text: "Question 7: ________", answer: "" },
                        { question: 8, text: "Question 8: ________", answer: "" },
                        { question: 9, text: "Question 9: ________", answer: "" },
                        { question: 10, text: "Question 10: ________", answer: "" }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "Section 2",
            subtitle: "剑桥雅思20官方听力测试第二部分",
            audioPath: "../剑桥雅思20/剑20 听力音频Test4/Section2.mp3",
            questions: "11-20",
            type: "选择题和填空题",
            instructions: "Choose the correct letter A, B or C, and complete the sentences below.",
            content: [
                {
                    type: "multiple_choice",
                    title: "Questions 11-15",
                    subtitle: "Choose the correct letter A, B or C.",
                    items: [
                        {
                            question: 11,
                            text: "Question 11:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 12,
                            text: "Question 12:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 13,
                            text: "Question 13:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 14,
                            text: "Question 14:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 15,
                            text: "Question 15:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        }
                    ]
                },
                {
                    type: "form",
                    title: "Questions 16-20",
                    subtitle: "Complete the sentences below. Write ONE WORD ONLY for each answer.",
                    items: [
                        { question: 16, text: "Question 16: ________", answer: "" },
                        { question: 17, text: "Question 17: ________", answer: "" },
                        { question: 18, text: "Question 18: ________", answer: "" },
                        { question: 19, text: "Question 19: ________", answer: "" },
                        { question: 20, text: "Question 20: ________", answer: "" }
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Section 3",
            subtitle: "剑桥雅思20官方听力测试第三部分",
            audioPath: "../剑桥雅思20/剑20 听力音频Test4/Section3.mp3",
            questions: "21-30",
            type: "选择题和匹配题",
            instructions: "Choose the correct letter A, B or C, and complete the matching exercise.",
            content: [
                {
                    type: "multiple_choice",
                    title: "Questions 21-25",
                    subtitle: "Choose the correct letter A, B or C.",
                    items: [
                        {
                            question: 21,
                            text: "Question 21:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 22,
                            text: "Question 22:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 23,
                            text: "Question 23:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 24,
                            text: "Question 24:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        },
                        {
                            question: 25,
                            text: "Question 25:",
                            options: [
                                { value: "A", text: "Option A" },
                                { value: "B", text: "Option B" },
                                { value: "C", text: "Option C" }
                            ],
                            answer: ""
                        }
                    ]
                },
                {
                    type: "matching",
                    title: "Questions 26-30",
                    subtitle: "What does each person say about their experience?",
                    options: [
                        { value: "A", text: "Option A" },
                        { value: "B", text: "Option B" },
                        { value: "C", text: "Option C" },
                        { value: "D", text: "Option D" },
                        { value: "E", text: "Option E" },
                        { value: "F", text: "Option F" }
                    ],
                    items: [
                        { question: 26, text: "Question 26:", answer: "" },
                        { question: 27, text: "Question 27:", answer: "" },
                        { question: 28, text: "Question 28:", answer: "" },
                        { question: 29, text: "Question 29:", answer: "" },
                        { question: 30, text: "Question 30:", answer: "" }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Section 4",
            subtitle: "剑桥雅思20官方听力测试第四部分",
            audioPath: "../剑桥雅思20/剑20 听力音频Test4/Section4.mp3",
            questions: "31-40",
            type: "填空题",
            instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            content: [
                {
                    type: "form",
                    title: "Questions 31-40",
                    subtitle: "Complete the notes below. Write ONE WORD ONLY for each answer.",
                    items: [
                        { question: 31, text: "Question 31: ________", answer: "" },
                        { question: 32, text: "Question 32: ________", answer: "" },
                        { question: 33, text: "Question 33: ________", answer: "" },
                        { question: 34, text: "Question 34: ________", answer: "" },
                        { question: 35, text: "Question 35: ________", answer: "" },
                        { question: 36, text: "Question 36: ________", answer: "" },
                        { question: 37, text: "Question 37: ________", answer: "" },
                        { question: 38, text: "Question 38: ________", answer: "" },
                        { question: 39, text: "Question 39: ________", answer: "" },
                        { question: 40, text: "Question 40: ________", answer: "" }
                    ]
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAMBRIDGE20_TEST4_DATA;
}