// 进阶听力测试 5 数据
const TEST_DATA_5 = {
    testInfo: {
        title: '进阶听力测试 5',
        description: 'Advanced Listening Practice Test 5',
        totalQuestions: 40,
        timeLimit: 30, // 分钟
        audioPath: '../audio/test5/'
    },
    
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "BIKE RENTAL ENQUIRY",
            items: [
                { text: "Customer name: [1] ........................ Peterson" },
                { text: "Rental period: [2] ........................ days" },
                { text: "Type of bike required: [3] ........................ bike" },
                { text: "Size: [4] ........................" },
                { text: "Accessories needed:", type: "text" },
                { text: "• [5] ........................ (essential for safety)", type: "bullet" },
                { text: "• bike [6] ........................", type: "bullet" },
                { text: "Collection time: [7] ........................ a.m." },
                { text: "Deposit required: £[8] ........................" },
                { text: "Total cost: £[9] ........................" },
                { text: "Payment method: by [10] ........................" }
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
                        text: "The Wildlife Reserve was established in",
                        type: "radio",
                        options: [
                            { value: "A", text: "1985" },
                            { value: "B", text: "1995" },
                            { value: "C", text: "2005" }
                        ]
                    },
                    {
                        id: 12,
                        text: "The reserve covers an area of",
                        type: "radio",
                        options: [
                            { value: "A", text: "200 hectares" },
                            { value: "B", text: "250 hectares" },
                            { value: "C", text: "300 hectares" }
                        ]
                    },
                    {
                        id: 13,
                        text: "The most popular activity for visitors is",
                        type: "radio",
                        options: [
                            { value: "A", text: "bird watching" },
                            { value: "B", text: "nature photography" },
                            { value: "C", text: "guided walks" }
                        ]
                    },
                    {
                        id: 14,
                        text: "The visitor center is open",
                        type: "radio",
                        options: [
                            { value: "A", text: "every day" },
                            { value: "B", text: "weekends only" },
                            { value: "C", text: "Tuesday to Sunday" }
                        ]
                    },
                    {
                        id: 15,
                        text: "School groups receive",
                        type: "radio",
                        options: [
                            { value: "A", text: "free admission" },
                            { value: "B", text: "a 50% discount" },
                            { value: "C", text: "educational materials" }
                        ]
                    },
                    {
                        id: 16,
                        text: "The reserve's main conservation focus is",
                        type: "radio",
                        options: [
                            { value: "A", text: "wetland restoration" },
                            { value: "B", text: "rare plant species" },
                            { value: "C", text: "endangered birds" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 17 – 20</strong>",
                instructions: "Complete the sentences below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
                questions: [
                    {
                        id: 17,
                        text: "The nature trail is approximately [17] ........................ long.",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 18,
                        text: "Visitors can observe wildlife from the [18] ........................ hide.",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 19,
                        text: "The reserve shop sells [19] ........................ and guidebooks.",
                        type: "text",
                        placeholder: "Enter your answer"
                    },
                    {
                        id: 20,
                        text: "Car parking costs [20] ........................ per day.",
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
                        text: "What is the main topic of James and Lisa's presentation?",
                        type: "radio",
                        options: [
                            { value: "A", text: "renewable energy sources" },
                            { value: "B", text: "sustainable transportation" },
                            { value: "C", text: "green building design" }
                        ]
                    },
                    {
                        id: 22,
                        text: "They decided to focus on this topic because",
                        type: "radio",
                        options: [
                            { value: "A", text: "it's relevant to their future careers" },
                            { value: "B", text: "they have personal experience with it" },
                            { value: "C", text: "it's currently in the news" }
                        ]
                    },
                    {
                        id: 23,
                        text: "What problem did they encounter with their research?",
                        type: "radio",
                        options: [
                            { value: "A", text: "lack of recent data" },
                            { value: "B", text: "conflicting information" },
                            { value: "C", text: "limited access to sources" }
                        ]
                    },
                    {
                        id: 24,
                        text: "For the visual aids, they plan to use",
                        type: "radio",
                        options: [
                            { value: "A", text: "charts and graphs" },
                            { value: "B", text: "photographs and videos" },
                            { value: "C", text: "maps and diagrams" }
                        ]
                    },
                    {
                        id: 25,
                        text: "The tutor suggests they should",
                        type: "radio",
                        options: [
                            { value: "A", text: "practice their timing" },
                            { value: "B", text: "simplify their content" },
                            { value: "C", text: "include more examples" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Complete the table below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                tableData: {
                    title: "Presentation Structure",
                    headers: ["Section", "Content", "Duration (minutes)"],
                    rows: [
                        ["Introduction", "[26] ........................", "3"],
                        ["Background", "Current situation", "[27] ........................"],
                        ["Main body", "[28] ........................", "8"],
                        ["[29] ........................", "Future developments", "4"],
                        ["Conclusion", "[30] ........................", "3"]
                    ]
                }
            }
        ]
    },
    
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
        boxContent: {
            title: "The Psychology of Color in Marketing",
            content: [
                {
                    type: "header",
                    text: "Introduction"
                },
                {
                    type: "text",
                    text: "Colors can influence [31] ........................ and purchasing decisions"
                },
                {
                    type: "text",
                    text: "Different cultures may have [32] ........................ color associations"
                },
                {
                    type: "header",
                    text: "Color Psychology Research"
                },
                {
                    type: "text",
                    text: "Early studies conducted in the [33] ........................"
                },
                {
                    type: "text",
                    text: "Modern research uses [34] ........................ technology to measure responses"
                },
                {
                    type: "header",
                    text: "Specific Color Effects"
                },
                {
                    type: "subheader",
                    text: "Red:"
                },
                {
                    type: "text",
                    text: "• Creates sense of [35] ........................"
                },
                {
                    type: "text",
                    text: "• Often used in [36] ........................ industry"
                },
                {
                    type: "subheader",
                    text: "Blue:"
                },
                {
                    type: "text",
                    text: "• Associated with [37] ........................ and reliability"
                },
                {
                    type: "text",
                    text: "• Popular in [38] ........................ sector"
                },
                {
                    type: "header",
                    text: "Marketing Applications"
                },
                {
                    type: "text",
                    text: "Brand logos should reflect company [39] ........................"
                },
                {
                    type: "text",
                    text: "Website design must consider [40] ........................ accessibility"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData5() {
    return TEST_DATA_5;
}

// 导出函数
window.getTestData5 = getTestData5;
window.TEST_DATA_5 = TEST_DATA_5;
