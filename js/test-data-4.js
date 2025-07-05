// 剑桥雅思20 Test 1 测试数据
const TEST_DATA_4 = {
    testInfo: {
        title: '剑桥雅思20 Test 1',
        description: 'Cambridge IELTS 20 Listening Test 1',
        totalQuestions: 40,
        timeLimit: 30, // 分钟
        audioPath: '../剑桥雅思20/剑20 听力音频 Test1/'
    },
    
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "SWIMMING POOL MEMBERSHIP APPLICATION",
            items: [
                { text: "Name: Jennifer [1] ........................" },
                { text: "Date of birth: [2] ........................ 1992" },
                { text: "Address: 24 [3] ........................ Road" },
                { text: "Postcode: [4] ........................" },
                { text: "Telephone: [5] ........................" },
                { text: "Occupation: [6] ........................" },
                { text: "Reason for joining:", type: "text" },
                { text: "• wants to improve [7] ........................", type: "bullet" },
                { text: "Membership type: [8] ........................" },
                { text: "Payment method: by [9] ........................" },
                { text: "Special requirements: needs parking space for [10] ........................" }
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
                        text: "The main purpose of the Local History Society is to",
                        type: "radio",
                        options: [
                            { value: "A", text: "preserve historical buildings" },
                            { value: "B", text: "research the area's past" },
                            { value: "C", text: "publish historical documents" }
                        ]
                    },
                    {
                        id: 12,
                        text: "The society's current membership is approximately",
                        type: "radio",
                        options: [
                            { value: "A", text: "300 people" },
                            { value: "B", text: "350 people" },
                            { value: "C", text: "400 people" }
                        ]
                    },
                    {
                        id: 13,
                        text: "Members pay reduced prices for",
                        type: "radio",
                        options: [
                            { value: "A", text: "magazine subscriptions" },
                            { value: "B", text: "guest speaker events" },
                            { value: "C", text: "historical tours" }
                        ]
                    },
                    {
                        id: 14,
                        text: "The society's journal is published",
                        type: "radio",
                        options: [
                            { value: "A", text: "monthly" },
                            { value: "B", text: "quarterly" },
                            { value: "C", text: "annually" }
                        ]
                    },
                    {
                        id: 15,
                        text: "This year's main project involves",
                        type: "radio",
                        options: [
                            { value: "A", text: "interviewing elderly residents" },
                            { value: "B", text: "restoring old photographs" },
                            { value: "C", text: "creating a digital archive" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 16 – 20</strong>",
                instructions: "Complete the table below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
                tableData: {
                    title: "Upcoming Events",
                    headers: ["Date", "Event", "Location", "Cost"],
                    rows: [
                        ["15th March", "Historical [16] ........................", "Town Hall", "Free"],
                        ["22nd March", "Museum Visit", "[17] ........................ Museum", "£[18] ........................"],
                        ["5th April", "[19] ........................ Tour", "Old Town", "£12"],
                        ["19th April", "Archive Workshop", "Library", "[20] ........................"]
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
                        text: "What does Sarah think about the reading list for the Environmental Science course?",
                        type: "radio",
                        options: [
                            { value: "A", text: "It contains too many books" },
                            { value: "B", text: "It should include more recent publications" },
                            { value: "C", text: "It covers the topics well" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Tom and Sarah agree that the main problem with their field trip was",
                        type: "radio",
                        options: [
                            { value: "A", text: "poor weather conditions" },
                            { value: "B", text: "lack of proper equipment" },
                            { value: "C", text: "insufficient preparation time" }
                        ]
                    },
                    {
                        id: 23,
                        text: "What does Tom suggest about the data collection?",
                        type: "radio",
                        options: [
                            { value: "A", text: "They should use digital instruments" },
                            { value: "B", text: "They need to collect more samples" },
                            { value: "C", text: "They should repeat the measurements" }
                        ]
                    },
                    {
                        id: 24,
                        text: "Sarah thinks the most difficult part of the assignment is",
                        type: "radio",
                        options: [
                            { value: "A", text: "analyzing the results" },
                            { value: "B", text: "writing the conclusion" },
                            { value: "C", text: "formatting the report" }
                        ]
                    },
                    {
                        id: 25,
                        text: "For their next assignment, Tom and Sarah decide to",
                        type: "radio",
                        options: [
                            { value: "A", text: "choose a different research topic" },
                            { value: "B", text: "work with other students" },
                            { value: "C", text: "start earlier in the semester" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Complete the table below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                tableData: {
                    title: "Assignment Timeline",
                    headers: ["Task", "Deadline", "Person Responsible"],
                    rows: [
                        ["Literature review", "[26] ........................", "Sarah"],
                        ["Data analysis", "15th May", "[27] ........................"],
                        ["[28] ........................", "22nd May", "Both"],
                        ["Final report", "[29] ........................", "Both"],
                        ["[30] ........................", "5th June", "Tom"]
                    ]
                }
            }
        ]
    },
    
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
        boxContent: {
            title: "The History and Development of Urban Planning",
            content: [
                {
                    type: "header",
                    text: "Early Urban Planning"
                },
                {
                    type: "text",
                    text: "Ancient cities often developed around [31] ........................ areas"
                },
                {
                    type: "text",
                    text: "Grid systems first used in [32] ........................ civilizations"
                },
                {
                    type: "header",
                    text: "Industrial Revolution Impact"
                },
                {
                    type: "text",
                    text: "Rapid population growth led to [33] ........................ problems"
                },
                {
                    type: "text",
                    text: "Introduction of [34] ........................ and improved sanitation"
                },
                {
                    type: "header",
                    text: "Modern Urban Planning"
                },
                {
                    type: "text",
                    text: "Garden City movement promoted [35] ........................ living"
                },
                {
                    type: "text",
                    text: "Zoning laws separated [36] ........................ and residential areas"
                },
                {
                    type: "header",
                    text: "Contemporary Challenges"
                },
                {
                    type: "text",
                    text: "Traffic congestion requires [37] ........................ solutions"
                },
                {
                    type: "text",
                    text: "Climate change demands [38] ........................ building practices"
                },
                {
                    type: "header",
                    text: "Future Trends"
                },
                {
                    type: "text",
                    text: "Smart cities will use [39] ........................ to improve efficiency"
                },
                {
                    type: "text",
                    text: "Urban planners must balance [40] ........................ with environmental protection"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData4() {
    return TEST_DATA_4;
}

// 导出函数
window.getTestData4 = getTestData4;
window.TEST_DATA_4 = TEST_DATA_4;