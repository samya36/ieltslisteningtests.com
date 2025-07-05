// 剑桥雅思20 Test 3 测试数据
const TEST_DATA_6 = {
    testInfo: {
        title: '剑桥雅思20 Test 3',
        description: 'Cambridge IELTS 20 Listening Test 3',
        totalQuestions: 40,
        timeLimit: 30, // 分钟
        audioPath: '../剑桥雅思20/剑20 听力音频Test3/'
    },
    
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "LANGUAGE SCHOOL ENQUIRY",
            items: [
                { text: "Student name: Maria [1] ........................" },
                { text: "Nationality: [2] ........................" },
                { text: "Current English level: [3] ........................" },
                { text: "Course type required: [4] ........................ English" },
                { text: "Preferred start date: [5] ........................" },
                { text: "Length of course: [6] ........................ weeks" },
                { text: "Accommodation needed:", type: "text" },
                { text: "• type: [7] ........................", type: "bullet" },
                { text: "• special requirements: [8] ........................ diet", type: "bullet" },
                { text: "Additional services:", type: "text" },
                { text: "• airport [9] ........................", type: "bullet" },
                { text: "Method of payment: by [10] ........................" }
            ]
        }
    },
    
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 15</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 11,
                        text: "The Coastal Museum was originally",
                        type: "radio",
                        options: [
                            { value: "A", text: "a fish market" },
                            { value: "B", text: "a railway station" },
                            { value: "C", text: "a customs house" }
                        ]
                    },
                    {
                        id: 12,
                        text: "The museum's main exhibition focuses on",
                        type: "radio",
                        options: [
                            { value: "A", text: "local fishing industry" },
                            { value: "B", text: "maritime archaeology" },
                            { value: "C", text: "shipbuilding history" }
                        ]
                    },
                    {
                        id: 13,
                        text: "The museum shop specializes in",
                        type: "radio",
                        options: [
                            { value: "A", text: "maritime books" },
                            { value: "B", text: "nautical instruments" },
                            { value: "C", text: "local crafts" }
                        ]
                    },
                    {
                        id: 14,
                        text: "Guided tours are available",
                        type: "radio",
                        options: [
                            { value: "A", text: "every hour" },
                            { value: "B", text: "twice daily" },
                            { value: "C", text: "by appointment only" }
                        ]
                    },
                    {
                        id: 15,
                        text: "Children under 12",
                        type: "radio",
                        options: [
                            { value: "A", text: "enter free" },
                            { value: "B", text: "pay half price" },
                            { value: "C", text: "must be accompanied" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 16 – 20</strong>",
                instructions: "Complete the floor plan notes.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
                mapContent: {
                    title: "Museum Floor Plan",
                    description: "Ground Floor Layout"
                },
                questions: [
                    {
                        id: 16,
                        text: "Entrance Hall: Information desk and [16] ........................",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 17,
                        text: "Gallery 1: [17] ........................ exhibition",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 18,
                        text: "Gallery 2: Interactive [18] ........................",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 19,
                        text: "Cafe: Serves [19] ........................ and refreshments",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 20,
                        text: "Theatre: Capacity [20] ........................ people",
                        type: "text",
                        placeholder: "Enter your answer"
                    }
                ]
            }
        ]
    },
    
    section3: {
        title: "<strong>Section 3</strong>",
        parts: [
            {
                title: "<strong>Questions 21 – 25</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 21,
                        text: "What is the main purpose of Helen and David's research project?",
                        type: "radio",
                        options: [
                            { value: "A", text: "to compare different teaching methods" },
                            { value: "B", text: "to evaluate student performance" },
                            { value: "C", text: "to assess technology in education" }
                        ]
                    },
                    {
                        id: 22,
                        text: "They chose their research topic because",
                        type: "radio",
                        options: [
                            { value: "A", text: "it relates to their teaching experience" },
                            { value: "B", text: "it's an area of current debate" },
                            { value: "C", text: "it has practical applications" }
                        ]
                    },
                    {
                        id: 23,
                        text: "What does Helen say about their literature review?",
                        type: "radio",
                        options: [
                            { value: "A", text: "It took longer than expected" },
                            { value: "B", text: "It revealed conflicting opinions" },
                            { value: "C", text: "It was more extensive than needed" }
                        ]
                    },
                    {
                        id: 24,
                        text: "For their data collection, they decided to",
                        type: "radio",
                        options: [
                            { value: "A", text: "interview teachers only" },
                            { value: "B", text: "use questionnaires and interviews" },
                            { value: "C", text: "observe classroom activities" }
                        ]
                    },
                    {
                        id: 25,
                        text: "The supervisor's main suggestion was to",
                        type: "radio",
                        options: [
                            { value: "A", text: "narrow down their focus" },
                            { value: "B", text: "increase their sample size" },
                            { value: "C", text: "change their methodology" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Complete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                questions: [
                    {
                        id: 26,
                        text: "Research participants: [26] ........................ from three local schools",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 27,
                        text: "Data collection period: [27] ........................",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 28,
                        text: "Interview duration: approximately [28] ........................ each",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 29,
                        text: "Analysis software: [29] ........................ program",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 30,
                        text: "Expected completion date: [30] ........................",
                        type: "text",
                        placeholder: "Enter your answer"
                    }
                ]
            }
        ]
    },
    
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
        boxContent: {
            title: "The Impact of Social Media on Modern Communication",
            content: [
                {
                    type: "header",
                    text: "Historical Context"
                },
                {
                    type: "text",
                    text: "Traditional communication relied on [31] ........................ methods"
                },
                {
                    type: "text",
                    text: "Internet adoption accelerated in the [32] ........................"
                },
                {
                    type: "header",
                    text: "Social Media Evolution"
                },
                {
                    type: "text",
                    text: "First platforms focused on [33] ........................ connections"
                },
                {
                    type: "text",
                    text: "Mobile technology enabled [34] ........................ communication"
                },
                {
                    type: "header",
                    text: "Communication Changes"
                },
                {
                    type: "subheader",
                    text: "Positive aspects:"
                },
                {
                    type: "text",
                    text: "• Increased [35] ........................ of communication"
                },
                {
                    type: "text",
                    text: "• Global [36] ........................ building"
                },
                {
                    type: "subheader",
                    text: "Concerns:"
                },
                {
                    type: "text",
                    text: "• Reduced [37] ........................ interaction"
                },
                {
                    type: "text",
                    text: "• Information [38] ........................ problems"
                },
                {
                    type: "header",
                    text: "Future Implications"
                },
                {
                    type: "text",
                    text: "Artificial intelligence will enable [39] ........................ communication"
                },
                {
                    type: "text",
                    text: "Society must address [40] ........................ and privacy issues"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData6() {
    return TEST_DATA_6;
}

// 导出函数
window.getTestData6 = getTestData6;
window.TEST_DATA_6 = TEST_DATA_6;