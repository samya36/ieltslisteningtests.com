// Test 2 数据
const TEST2_DATA = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "UNIVERSITY ACCOMMODATION OFFICE",
            items: [
                { text: "Student name: Sarah [1]" },
                { text: "Current address: [2] Road, Highfield" },
                { text: "Postcode: [3]" },
                { text: "Mobile phone: [4]" },
                { text: "Course: [5] and Politics" },
                { text: "Year of study: [6]" },
                { text: "Accommodation required from: [7] September" },
                { text: "Preferred accommodation: shared [8]" },
                { text: "Rent budget per week: £ [9]" },
                { text: "Special requirements:", type: "text" },
                { text: "• Must be [10] accessible", type: "bullet" }
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
                        text: "What is the main purpose of the library renovation?",
                        type: "radio",
                        options: [
                            { value: "A", text: "to increase book storage space" },
                            { value: "B", text: "to improve study facilities" },
                            { value: "C", text: "to modernize technology" }
                        ]
                    },
                    {
                        id: 12,
                        text: "During the renovation, students should",
                        type: "radio",
                        options: [
                            { value: "A", text: "use the temporary library in the sports center." },
                            { value: "B", text: "access resources online only." },
                            { value: "C", text: "visit the main library after 6 PM." }
                        ]
                    },
                    {
                        id: 13,
                        text: "The main challenge with the current library system is",
                        type: "radio",
                        options: [
                            { value: "A", text: "insufficient seating during exam periods." },
                            { value: "B", text: "outdated computer equipment." },
                            { value: "C", text: "limited opening hours." }
                        ]
                    },
                    {
                        id: 14,
                        text: "What will be the benefit of the new online booking system?",
                        type: "radio",
                        options: [
                            { value: "A", text: "Students can reserve study rooms in advance." },
                            { value: "B", text: "Students can extend loan periods automatically." },
                            { value: "C", text: "Students can access rare books digitally." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15- 20</strong>",
                instructions: "Choose <strong>SIX</strong> answers from the box and write the correct letter: <strong>A-J</strong>, next to Questions 15-20.",
                mapContent: {
                    title: "Library Floor Plan",
                    imageUrl: "../images/test2/floorplan.jpg"
                },
                questions: [
                    {
                        id: 15,
                        text: "Information desk",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 16,
                        text: "Silent study area",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 17,
                        text: "Group study rooms",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 18,
                        text: "Computer lab",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 19,
                        text: "Print station",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 20,
                        text: "Reference collection",
                        type: "text",
                        placeholder: "A-J"
                    }
                ],
                boxContent: "Areas\nA B C D E F G H I J"
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
                        text: "What was the main focus of Jenny and David's research project?",
                        type: "radio",
                        options: [
                            { value: "A", text: "the impact of social media on teenagers" },
                            { value: "B", text: "the effectiveness of online learning platforms" },
                            { value: "C", text: "the relationship between technology and sleep patterns" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Which research method did they find most challenging?",
                        type: "radio",
                        options: [
                            { value: "A", text: "conducting online surveys" },
                            { value: "B", text: "analyzing statistical data" },
                            { value: "C", text: "interviewing participants" }
                        ]
                    },
                    {
                        id: 23,
                        text: "What was the biggest limitation of their study?",
                        type: "radio",
                        options: [
                            { value: "A", text: "the small sample size" },
                            { value: "B", text: "the short time frame" },
                            { value: "C", text: "the lack of control group" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What do Jenny and David plan to do differently in future research?",
                        type: "radio",
                        options: [
                            { value: "A", text: "use more diverse participant groups" },
                            { value: "B", text: "extend the research period" },
                            { value: "C", text: "collaborate with other departments" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 26</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "25-26",
                        text: "Which TWO factors influenced the participants' technology usage the most?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "peer pressure" },
                            { value: "B", text: "academic requirements" },
                            { value: "C", text: "family expectations" },
                            { value: "D", text: "personal interests" },
                            { value: "E", text: "social trends" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 27 – 28</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "27-28",
                        text: "Which TWO recommendations do Jenny and David make for future researchers?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Use longitudinal study methods." },
                            { value: "B", text: "Focus on specific age groups." },
                            { value: "C", text: "Include qualitative data collection." },
                            { value: "D", text: "Partner with technology companies." },
                            { value: "E", text: "Consider cultural differences." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 29 – 30</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A— E</strong>",
                questions: [
                    {
                        id: "29-30",
                        text: "Which TWO aspects of their research do they consider most valuable?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "The innovative methodology" },
                            { value: "B", text: "The practical applications" },
                            { value: "C", text: "The theoretical framework" },
                            { value: "D", text: "The collaboration experience" },
                            { value: "E", text: "The data analysis skills" }
                        ]
                    }
                ]
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.",
        boxContent: {
            title: "Urban Planning and Sustainable Cities",
            content: [
                {
                    type: "header",
                    text: "Key Principles"
                },
                {
                    type: "subheader",
                    text: "Green Infrastructure:"
                },
                {
                    type: "bullet-main",
                    text: "Parks and green spaces –",
                    description: "provide [31] ........................ for urban wildlife",
                    examples: "help reduce urban [32] ........................ effect"
                },
                {
                    type: "bullet-main",
                    text: "Green roofs –",
                    description: "improve building [33] ........................",
                    examples: "reduce stormwater [34] ........................"
                },
                {
                    type: "subheader",
                    text: "Transportation Systems:"
                },
                {
                    type: "bullet-sub",
                    text: "promote use of [35] ........................ transport"
                },
                {
                    type: "bullet-sub",
                    text: "develop networks for [36] ........................ and walking"
                },
                {
                    type: "header",
                    text: "Implementation Challenges"
                },
                {
                    type: "subheader",
                    text: "Funding"
                },
                {
                    type: "text",
                    text: "– requires significant [37] ........................ investment"
                },
                {
                    type: "text",
                    text: "– need for long-term [38] ........................ commitment"
                },
                {
                    type: "subheader",
                    text: "Community Engagement"
                },
                {
                    type: "text",
                    text: "– importance of [39] ........................ participation"
                },
                {
                    type: "compound",
                    bold: "Success factors",
                    text: "– effective [40] ........................ between stakeholders"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTest2Data() {
    return TEST2_DATA;
}

// 导出函数
window.getTest2Data = getTest2Data;