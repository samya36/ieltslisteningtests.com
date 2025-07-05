// Test 3 测试数据 - Kiwi Air Complaint, Spring Festival, Iceland Geology, Tyre Recycling
const TEST_DATA_3 = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "KIWI AIR - CUSTOMER COMPLAINT FORM",
            items: [
                { text: "Passenger name: Ms Sarah [1] ........................" },
                { text: "Flight number: KA [2] ........................" },
                { text: "Date of flight: [3] ........................ March" },
                { text: "Destination: [4] ........................" },
                { text: "Type of complaint: [5] ........................ delay" },
                { text: "Delay duration: [6] ........................ hours" },
                { text: "Reason given by airline:", type: "text" },
                { text: "• [7] ........................ conditions", type: "bullet" },
                { text: "Compensation requested:", type: "text" },
                { text: "• [8] ........................ for meals", type: "bullet" },
                { text: "• Voucher for [9] ........................ flight", type: "bullet" },
                { text: "Contact method: [10] ........................" }
            ]
        }
    },
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 16</strong>",
                instructions: "Complete the table below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
                tableData: {
                    title: "Spring Festival Events Schedule",
                    headers: ["Time", "Event", "Location", "Cost"],
                    rows: [
                        ["10:00", "[11] ........................", "Main Stage", "Free"],
                        ["12:30", "Cultural Exhibition", "[12] ........................", "$5"],
                        ["[13] ........................", "Children's Workshop", "Arts Centre", "$10"],
                        ["15:00", "[14] ........................", "Food Court", "Various"],
                        ["18:00", "Evening Concert", "[15] ........................", "$[16] ........................"]
                    ]
                }
            },
            {
                title: "<strong>Questions 17 – 20</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 17,
                        text: "The Spring Festival celebrates",
                        type: "radio",
                        options: [
                            { value: "A", text: "the beginning of spring season" },
                            { value: "B", text: "Chinese New Year traditions" },
                            { value: "C", text: "local community heritage" }
                        ]
                    },
                    {
                        id: 18,
                        text: "This year's festival is special because",
                        type: "radio",
                        options: [
                            { value: "A", text: "it's the 25th anniversary" },
                            { value: "B", text: "there are international performers" },
                            { value: "C", text: "it lasts for a longer period" }
                        ]
                    },
                    {
                        id: 19,
                        text: "Food stalls will mainly offer",
                        type: "radio",
                        options: [
                            { value: "A", text: "traditional Asian cuisine" },
                            { value: "B", text: "fusion food options" },
                            { value: "C", text: "local Australian dishes" }
                        ]
                    },
                    {
                        id: 20,
                        text: "Advanced booking is required for",
                        type: "radio",
                        options: [
                            { value: "A", text: "all events" },
                            { value: "B", text: "workshop activities only" },
                            { value: "C", text: "the evening concert only" }
                        ]
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
                        text: "The main purpose of the Iceland field trip is to study",
                        type: "radio",
                        options: [
                            { value: "A", text: "volcanic activity" },
                            { value: "B", text: "glacial formations" },
                            { value: "C", text: "geological structures" }
                        ]
                    },
                    {
                        id: 22,
                        text: "The field trip will last for",
                        type: "radio",
                        options: [
                            { value: "A", text: "one week" },
                            { value: "B", text: "ten days" },
                            { value: "C", text: "two weeks" }
                        ]
                    },
                    {
                        id: 23,
                        text: "Students need to bring",
                        type: "radio",
                        options: [
                            { value: "A", text: "sleeping bags" },
                            { value: "B", text: "cooking equipment" },
                            { value: "C", text: "warm clothing" }
                        ]
                    },
                    {
                        id: 24,
                        text: "The most challenging aspect will be",
                        type: "radio",
                        options: [
                            { value: "A", text: "the weather conditions" },
                            { value: "B", text: "the physical demands" },
                            { value: "C", text: "the technical requirements" }
                        ]
                    },
                    {
                        id: 25,
                        text: "Safety briefings will cover",
                        type: "radio",
                        options: [
                            { value: "A", text: "emergency procedures only" },
                            { value: "B", text: "equipment usage only" },
                            { value: "C", text: "both emergency and equipment procedures" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Complete the summary below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
                summaryContent: {
                    title: "Iceland Field Trip Itinerary",
                    text: "Day 1-2: Arrival and [26] ........................ in Reykjavik. Visit to the National Museum and geology department briefing.\n\nDay 3-5: Travel to the [27] ........................ region to study recent volcanic formations and collect rock samples.\n\nDay 6-8: Examination of [28] ........................ near Vatnajökull glacier and analysis of ice-carved landscapes.\n\nDay 9-10: Return to Reykjavik for [29] ........................ work and preparation of field reports.\n\nAll students must submit their [30] ........................ within two weeks of return."
                }
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
        boxContent: {
            title: "Recycling Tyres in Australia",
            content: [
                {
                    type: "header",
                    text: "Current Situation"
                },
                {
                    type: "text",
                    text: "• Australia produces [31] ........................ million waste tyres annually"
                },
                {
                    type: "text",
                    text: "• Previously, most tyres were [32] ........................ overseas"
                },
                {
                    type: "text",
                    text: "• New regulations require [33] ........................ processing"
                },
                {
                    type: "header",
                    text: "Recycling Methods"
                },
                {
                    type: "text",
                    text: "• [34] ........................ recycling: tyres are shredded into small pieces"
                },
                {
                    type: "text",
                    text: "• Used for playground surfaces and [35] ........................"
                },
                {
                    type: "text",
                    text: "• [36] ........................ recycling: tyres burned for energy production"
                },
                {
                    type: "header",
                    text: "New Applications"
                },
                {
                    type: "text",
                    text: "• Road construction: crumb rubber improves [37] ........................"
                },
                {
                    type: "text",
                    text: "• Building materials: rubber mixed with [38] ........................"
                },
                {
                    type: "text",
                    text: "• Agricultural uses: [39] ........................ for livestock areas"
                },
                {
                    type: "header",
                    text: "Future Challenges"
                },
                {
                    type: "text",
                    text: "• Need for increased [40] ........................ investment"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData3() {
    return TEST_DATA_3;
}

// 导出函数
window.getTestData3 = getTestData3;