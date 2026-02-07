// 进阶听力测试 7 数据
const TEST_DATA_7 = {
    testInfo: {
        title: '进阶听力测试 7',
        description: 'Advanced Listening Practice Test 7',
        totalQuestions: 40,
        timeLimit: 30, // 分钟
        audioPath: '../audio/test7/'
    },
    
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "HOME SECURITY SYSTEM ENQUIRY",
            items: [
                { text: "Customer name: [1] ........................ Williams" },
                { text: "Property type: [2] ........................ house" },
                { text: "Number of [3] ........................: 8" },
                { text: "Security concerns:", type: "text" },
                { text: "• previous [4] ........................ in the area", type: "bullet" },
                { text: "• valuable [5] ........................ collection", type: "bullet" },
                { text: "Required features:", type: "text" },
                { text: "• [6] ........................ monitoring", type: "bullet" },
                { text: "• motion [7] ........................", type: "bullet" },
                { text: "• [8] ........................ cameras", type: "bullet" },
                { text: "Installation date: [9] ........................" },
                { text: "Total cost: £[10] ........................" }
            ]
        }
    },
    
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 16</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 11,
                        text: "The Community Garden project was started",
                        type: "radio",
                        options: [
                            { value: "A", text: "5 years ago" },
                            { value: "B", text: "3 years ago" },
                            { value: "C", text: "last year" }
                        ]
                    },
                    {
                        id: 12,
                        text: "The garden currently has",
                        type: "radio",
                        options: [
                            { value: "A", text: "25 plots" },
                            { value: "B", text: "30 plots" },
                            { value: "C", text: "35 plots" }
                        ]
                    },
                    {
                        id: 13,
                        text: "New members must attend",
                        type: "radio",
                        options: [
                            { value: "A", text: "a training session" },
                            { value: "B", text: "an information meeting" },
                            { value: "C", text: "a gardening workshop" }
                        ]
                    },
                    {
                        id: 14,
                        text: "The monthly rental fee for a plot is",
                        type: "radio",
                        options: [
                            { value: "A", text: "£15" },
                            { value: "B", text: "£20" },
                            { value: "C", text: "£25" }
                        ]
                    },
                    {
                        id: 15,
                        text: "Garden tools are",
                        type: "radio",
                        options: [
                            { value: "A", text: "provided free" },
                            { value: "B", text: "available to rent" },
                            { value: "C", text: "must be purchased" }
                        ]
                    },
                    {
                        id: 16,
                        text: "The garden is open",
                        type: "radio",
                        options: [
                            { value: "A", text: "every day" },
                            { value: "B", text: "weekdays only" },
                            { value: "C", text: "weekends and evenings" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 17 – 20</strong>",
                instructions: "Complete the schedule below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                tableData: {
                    title: "Garden Activities Schedule",
                    headers: ["Day", "Time", "Activity"],
                    rows: [
                        ["Monday", "6:00 PM", "[17] ........................ club"],
                        ["Wednesday", "10:00 AM", "[18] ........................ workshop"],
                        ["Friday", "7:00 PM", "Community [19] ........................"],
                        ["Saturday", "2:00 PM", "[20] ........................ sale"]
                    ]
                }
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
                        text: "What is the focus of Amy and Robert's dissertation?",
                        type: "radio",
                        options: [
                            { value: "A", text: "workplace stress management" },
                            { value: "B", text: "employee motivation techniques" },
                            { value: "C", text: "team building strategies" }
                        ]
                    },
                    {
                        id: 22,
                        text: "They chose this topic because they",
                        type: "radio",
                        options: [
                            { value: "A", text: "had personal experience with it" },
                            { value: "B", text: "found extensive research materials" },
                            { value: "C", text: "received supervisor encouragement" }
                        ]
                    },
                    {
                        id: 23,
                        text: "Their main research method will be",
                        type: "radio",
                        options: [
                            { value: "A", text: "online surveys" },
                            { value: "B", text: "face-to-face interviews" },
                            { value: "C", text: "observational studies" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What challenge do they anticipate?",
                        type: "radio",
                        options: [
                            { value: "A", text: "gaining access to participants" },
                            { value: "B", text: "analyzing complex data" },
                            { value: "C", text: "meeting the deadline" }
                        ]
                    },
                    {
                        id: 25,
                        text: "The supervisor's advice was to",
                        type: "radio",
                        options: [
                            { value: "A", text: "expand their research scope" },
                            { value: "B", text: "start data collection early" },
                            { value: "C", text: "review more literature" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Complete the action plan below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                tableData: {
                    title: "Research Action Plan",
                    headers: ["Phase", "Task", "Completion Date"],
                    rows: [
                        ["1", "[26] ........................ design", "March 15"],
                        ["2", "Participant [27] ........................", "April 1"],
                        ["3", "[28] ........................ collection", "May 15"],
                        ["4", "Data [29] ........................", "June 1"],
                        ["5", "[30] ........................ writing", "July 15"]
                    ]
                }
            }
        ]
    },
    
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
        boxContent: {
            title: "Sustainable Tourism Development",
            content: [
                {
                    type: "header",
                    text: "Definition and Principles"
                },
                {
                    type: "text",
                    text: "Sustainable tourism balances [31] ........................ with environmental protection"
                },
                {
                    type: "text",
                    text: "Three main pillars: economic, social, and [32] ........................ sustainability"
                },
                {
                    type: "header",
                    text: "Environmental Challenges"
                },
                {
                    type: "text",
                    text: "Tourism can cause [33] ........................ damage to natural areas"
                },
                {
                    type: "text",
                    text: "Increased [34] ........................ emissions from transportation"
                },
                {
                    type: "text",
                    text: "Pressure on local [35] ........................ supplies"
                },
                {
                    type: "header",
                    text: "Best Practices"
                },
                {
                    type: "subheader",
                    text: "Accommodation:"
                },
                {
                    type: "text",
                    text: "• Use [36] ........................ energy sources"
                },
                {
                    type: "text",
                    text: "• Implement [37] ........................ management systems"
                },
                {
                    type: "subheader",
                    text: "Transportation:"
                },
                {
                    type: "text",
                    text: "• Promote [38] ........................ transport options"
                },
                {
                    type: "header",
                    text: "Economic Benefits"
                },
                {
                    type: "text",
                    text: "Tourism provides [39] ........................ for local communities"
                },
                {
                    type: "text",
                    text: "Sustainable practices ensure [40] ........................ economic benefits"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData7() {
    return TEST_DATA_7;
}

// 导出函数
window.getTestData7 = getTestData7;
window.TEST_DATA_7 = TEST_DATA_7;
