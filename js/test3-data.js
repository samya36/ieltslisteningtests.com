// Test 3 数据
const TEST3_DATA = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "ADVENTURE TOURS BOOKING",
            items: [
                { text: "Customer name: [1] Thompson" },
                { text: "Tour type: [2] adventure" },
                { text: "Group size: [3] people" },
                { text: "Departure date: [4] March" },
                { text: "Duration: [5] days" },
                { text: "Accommodation type: [6]" },
                { text: "Special dietary requirements: [7] free meals" },
                { text: "Emergency contact name: [8]" },
                { text: "Insurance level: [9]" },
                { text: "Total cost: £ [10]" }
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
                        text: "What is the main attraction of the local museum?",
                        type: "radio",
                        options: [
                            { value: "A", text: "interactive science exhibits" },
                            { value: "B", text: "historical artifact collection" },
                            { value: "C", text: "modern art gallery" }
                        ]
                    },
                    {
                        id: 12,
                        text: "The museum offers guided tours",
                        type: "radio",
                        options: [
                            { value: "A", text: "every hour during weekdays." },
                            { value: "B", text: "twice daily on weekends." },
                            { value: "C", text: "by appointment only." }
                        ]
                    },
                    {
                        id: 13,
                        text: "What discount is available for students?",
                        type: "radio",
                        options: [
                            { value: "A", text: "50% off entrance fee" },
                            { value: "B", text: "free admission with valid ID" },
                            { value: "C", text: "reduced price for group bookings" }
                        ]
                    },
                    {
                        id: 14,
                        text: "The museum's newest feature is",
                        type: "radio",
                        options: [
                            { value: "A", text: "a virtual reality experience." },
                            { value: "B", text: "an outdoor sculpture garden." },
                            { value: "C", text: "a hands-on workshop space." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15- 20</strong>",
                instructions: "Choose <strong>SIX</strong> answers from the box and write the correct letter: <strong>A-J</strong>, next to Questions 15-20.",
                mapContent: {
                    title: "Museum Layout",
                    imageUrl: "../images/test3/museum.jpg"
                },
                questions: [
                    {
                        id: 15,
                        text: "Main entrance",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 16,
                        text: "Cafeteria",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 17,
                        text: "Gift shop",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 18,
                        text: "Exhibition hall",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 19,
                        text: "Library",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 20,
                        text: "Lecture theater",
                        type: "text",
                        placeholder: "A-J"
                    }
                ],
                boxContent: "Locations\nA B C D E F G H I J"
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
                        text: "What was the main objective of Lisa and Tom's research?",
                        type: "radio",
                        options: [
                            { value: "A", text: "to investigate renewable energy sources" },
                            { value: "B", text: "to study climate change effects" },
                            { value: "C", text: "to analyze water conservation methods" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Which data collection method proved most reliable?",
                        type: "radio",
                        options: [
                            { value: "A", text: "satellite imagery analysis" },
                            { value: "B", text: "field measurements" },
                            { value: "C", text: "laboratory experiments" }
                        ]
                    },
                    {
                        id: 23,
                        text: "What was the main obstacle in their research?",
                        type: "radio",
                        options: [
                            { value: "A", text: "equipment malfunction" },
                            { value: "B", text: "weather conditions" },
                            { value: "C", text: "funding constraints" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What do they recommend for future studies?",
                        type: "radio",
                        options: [
                            { value: "A", text: "increasing the research budget" },
                            { value: "B", text: "using more advanced technology" },
                            { value: "C", text: "extending the study duration" }
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
                        text: "Which TWO environmental factors had the greatest impact on their results?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "temperature variations" },
                            { value: "B", text: "rainfall patterns" },
                            { value: "C", text: "wind speed" },
                            { value: "D", text: "soil composition" },
                            { value: "E", text: "sunlight exposure" }
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
                        text: "Which TWO skills did Lisa and Tom develop during the project?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Advanced statistical analysis" },
                            { value: "B", text: "Equipment calibration" },
                            { value: "C", text: "Team leadership" },
                            { value: "D", text: "Scientific writing" },
                            { value: "E", text: "Public presentation" }
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
                        text: "Which TWO practical applications does their research have?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Environmental policy development" },
                            { value: "B", text: "Agricultural planning" },
                            { value: "C", text: "Urban construction guidelines" },
                            { value: "D", text: "Educational curriculum" },
                            { value: "E", text: "Industrial process optimization" }
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
            title: "Marine Conservation Strategies",
            content: [
                {
                    type: "header",
                    text: "Current Challenges"
                },
                {
                    type: "subheader",
                    text: "Pollution:"
                },
                {
                    type: "bullet-main",
                    text: "Plastic waste –",
                    description: "major threat to marine [31] ........................",
                    examples: "causes [32] ........................ in food chain"
                },
                {
                    type: "bullet-main",
                    text: "Chemical runoff –",
                    description: "from [33] ........................ activities",
                    examples: "leads to [34] ........................ blooms"
                },
                {
                    type: "subheader",
                    text: "Overfishing:"
                },
                {
                    type: "bullet-sub",
                    text: "depletion of [35] ........................ stocks"
                },
                {
                    type: "bullet-sub",
                    text: "disruption of marine [36] ........................"
                },
                {
                    type: "header",
                    text: "Conservation Solutions"
                },
                {
                    type: "subheader",
                    text: "Protected Areas"
                },
                {
                    type: "text",
                    text: "– establish marine [37] ........................"
                },
                {
                    type: "text",
                    text: "– restrict [38] ........................ activities"
                },
                {
                    type: "subheader",
                    text: "International Cooperation"
                },
                {
                    type: "text",
                    text: "– develop global [39] ........................"
                },
                {
                    type: "compound",
                    bold: "Success requires",
                    text: "– sustained [40] ........................ support"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTest3Data() {
    return TEST3_DATA;
}

// 导出函数
window.getTest3Data = getTest3Data;