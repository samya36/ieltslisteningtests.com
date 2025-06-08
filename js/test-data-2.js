// Test 2 测试数据 - Winsham Farm, Queensland Festival, Environmental Science, Photic Sneezing
const TEST_DATA_2 = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "WINSHAM FARM - STRAWBERRY PICKING JOB",
            items: [
                { text: "Farm location: Winsham [1] ........................" },
                { text: "Main crop: [2] ........................ strawberries" },
                { text: "Season: May to [3] ........................" },
                { text: "Working hours: [4] ........................ a.m. to 4 p.m." },
                { text: "Pay rate: £[5] ........................ per hour" },
                { text: "Experience required: [6] ........................" },
                { text: "What to bring:", type: "text" },
                { text: "• [7] ........................ and water bottle", type: "bullet" },
                { text: "• protective [8] ........................", type: "bullet" },
                { text: "Accommodation: Available in [9] ........................" },
                { text: "Transport: Free [10] ........................ service provided" }
            ]
        }
    },
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 14</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 11,
                        text: "The Queensland Festival takes place",
                        type: "radio",
                        options: [
                            { value: "A", text: "every year in the same month" },
                            { value: "B", text: "twice a year" },
                            { value: "C", text: "at different times each year" }
                        ]
                    },
                    {
                        id: 12,
                        text: "This year's festival theme is",
                        type: "radio",
                        options: [
                            { value: "A", text: "Global Connections" },
                            { value: "B", text: "Cultural Heritage" },
                            { value: "C", text: "Modern Innovation" }
                        ]
                    },
                    {
                        id: 13,
                        text: "The festival's main venue is",
                        type: "radio",
                        options: [
                            { value: "A", text: "the Town Hall" },
                            { value: "B", text: "Brisbane Convention Centre" },
                            { value: "C", text: "Queensland Museum" }
                        ]
                    },
                    {
                        id: 14,
                        text: "Tickets for most events",
                        type: "radio",
                        options: [
                            { value: "A", text: "must be purchased in advance" },
                            { value: "B", text: "are available at the door" },
                            { value: "C", text: "are free of charge" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15 – 20</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 15,
                        text: "The opening ceremony will feature",
                        type: "radio",
                        options: [
                            { value: "A", text: "local musicians only" },
                            { value: "B", text: "international artists" },
                            { value: "C", text: "dance performances" }
                        ]
                    },
                    {
                        id: 16,
                        text: "Children's activities are located",
                        type: "radio",
                        options: [
                            { value: "A", text: "in the main auditorium" },
                            { value: "B", text: "in the outdoor area" },
                            { value: "C", text: "in a separate building" }
                        ]
                    },
                    {
                        id: 17,
                        text: "Food vendors will offer",
                        type: "radio",
                        options: [
                            { value: "A", text: "traditional Queensland cuisine" },
                            { value: "B", text: "international food options" },
                            { value: "C", text: "vegetarian meals only" }
                        ]
                    },
                    {
                        id: 18,
                        text: "The festival runs for",
                        type: "radio",
                        options: [
                            { value: "A", text: "three days" },
                            { value: "B", text: "one week" },
                            { value: "C", text: "two weeks" }
                        ]
                    },
                    {
                        id: 19,
                        text: "Parking is available",
                        type: "radio",
                        options: [
                            { value: "A", text: "free of charge" },
                            { value: "B", text: "for a small fee" },
                            { value: "C", text: "by reservation only" }
                        ]
                    },
                    {
                        id: 20,
                        text: "The festival finale will be",
                        type: "radio",
                        options: [
                            { value: "A", text: "a fireworks display" },
                            { value: "B", text: "a concert" },
                            { value: "C", text: "a parade" }
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
                title: "<strong>Questions 21 – 24</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 21,
                        text: "The main focus of the environmental science course is",
                        type: "radio",
                        options: [
                            { value: "A", text: "climate change research" },
                            { value: "B", text: "biodiversity conservation" },
                            { value: "C", text: "sustainable development" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Students are required to complete",
                        type: "radio",
                        options: [
                            { value: "A", text: "a research project" },
                            { value: "B", text: "field work experience" },
                            { value: "C", text: "both A and B" }
                        ]
                    },
                    {
                        id: 23,
                        text: "The course assessment includes",
                        type: "radio",
                        options: [
                            { value: "A", text: "written exams only" },
                            { value: "B", text: "practical assessments only" },
                            { value: "C", text: "both written and practical work" }
                        ]
                    },
                    {
                        id: 24,
                        text: "Field trip locations are chosen based on",
                        type: "radio",
                        options: [
                            { value: "A", text: "student preferences" },
                            { value: "B", text: "research opportunities" },
                            { value: "C", text: "accessibility and cost" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 26</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A – E</strong>",
                questions: [
                    {
                        id: "25-26",
                        text: "Which TWO equipment items are essential for field work?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "GPS devices" },
                            { value: "B", text: "Water quality testing kits" },
                            { value: "C", text: "Digital cameras" },
                            { value: "D", text: "Soil sampling tools" },
                            { value: "E", text: "Weather monitoring instruments" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 27 – 30</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 27,
                        text: "The research project deadline is",
                        type: "radio",
                        options: [
                            { value: "A", text: "end of semester" },
                            { value: "B", text: "mid-semester" },
                            { value: "C", text: "flexible depending on topic" }
                        ]
                    },
                    {
                        id: 28,
                        text: "Students can work",
                        type: "radio",
                        options: [
                            { value: "A", text: "individually only" },
                            { value: "B", text: "in groups only" },
                            { value: "C", text: "individually or in small groups" }
                        ]
                    },
                    {
                        id: 29,
                        text: "The course textbook is",
                        type: "radio",
                        options: [
                            { value: "A", text: "available in the library" },
                            { value: "B", text: "must be purchased" },
                            { value: "C", text: "provided online for free" }
                        ]
                    },
                    {
                        id: 30,
                        text: "Guest lectures are scheduled",
                        type: "radio",
                        options: [
                            { value: "A", text: "monthly" },
                            { value: "B", text: "weekly" },
                            { value: "C", text: "irregularly throughout the semester" }
                        ]
                    }
                ]
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>NO MORE THAN TWO WORDS</strong> for each answer.",
        boxContent: {
            title: "Photic Sneezing Reflex",
            content: [
                {
                    type: "header",
                    text: "Definition and Characteristics"
                },
                {
                    type: "text",
                    text: "• Also known as [31] ........................ syndrome"
                },
                {
                    type: "text", 
                    text: "• Affects approximately [32] ........................ of the population"
                },
                {
                    type: "text",
                    text: "• Causes sneezing when exposed to [33] ........................"
                },
                {
                    type: "header",
                    text: "Scientific Explanation"
                },
                {
                    type: "text",
                    text: "• Triggered by stimulation of the [34] ........................ nerve"
                },
                {
                    type: "text",
                    text: "• Brain confuses signals from eyes and [35] ........................"
                },
                {
                    type: "text",
                    text: "• Response is [36] ........................ and cannot be controlled"
                },
                {
                    type: "header",
                    text: "Research Findings"
                },
                {
                    type: "text",
                    text: "• Condition is [37] ........................ (passed from parents)"
                },
                {
                    type: "text",
                    text: "• More common in people with [38] ........................ eyes"
                },
                {
                    type: "text",
                    text: "• Can be dangerous for [39] ........................ and surgeons"
                },
                {
                    type: "text",
                    text: "• Currently no effective [40] ........................ available"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData2() {
    return TEST_DATA_2;
}

// 导出函数
window.getTestData2 = getTestData2;