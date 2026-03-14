// Test 4 测试数据 - Windward Apartments, Beach Races, Gender-specific Clothing, The History of Umbrellas
const TEST_DATA_4 = {
    testInfo: {
        title: "IELTS Listening Test 4",
        description: "Windward Apartments / Beach Races / Gender Clothing / Umbrellas",
        totalQuestions: 40,
        timeLimit: 30,
        audioPath: "../audio/test4/"
    },
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>ONE WORD /OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "Two-bedroom apartment",
            items: [
                { text: "The name of the owner is: Mary" },
                { text: "Details of apartment", type: "text" },
                { text: "• The apartment will be available from June.", type: "bullet" },
                { text: "• The rent is $ [1] ........................ a month.", type: "bullet" },
                { text: "• The flooring in the apartment is made of [2] ........................", type: "bullet" },
                { text: "• There is not enough space for a dishwasher in the apartment.", type: "bullet" },
                { text: "• A [3] ........................ is used to operate the laundry machines.", type: "bullet" },
                { text: "• It is OK to use [4] ........................ cookers on balcony.", type: "bullet" },
                { text: "• There is no locker to store a [5] ........................, but there are racks.", type: "bullet" },
                { text: "Facilities and services in the apartment building", type: "text" },
                { text: "• The building has full-time [6] ........................", type: "bullet" },
                { text: "• Free classes are held in the building's pool.", type: "bullet" },
                { text: "Appointment details", type: "text" },
                { text: "• Meet the owner at [7] ........................ pm on Monday", type: "bullet" },
                { text: "• Go to 236 [8] ........................ Road", type: "bullet" },
                { text: "• Take the bus west to the intersection and look for the [9] ........................", type: "bullet" },
                { text: "• Look for the building across from the [10] ........................", type: "bullet" }
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
                        text: "Which is the most popular race?",
                        type: "radio",
                        options: [
                            { value: "A", text: "bicycles" },
                            { value: "B", text: "old tractors" },
                            { value: "C", text: "motorbikes" }
                        ]
                    },
                    {
                        id: 12,
                        text: "What does the official say about the horse race?",
                        type: "radio",
                        options: [
                            { value: "A", text: "keep the finish line clear" },
                            { value: "B", text: "keep spectators off the beach" },
                            { value: "C", text: "keep boats away from the shore" }
                        ]
                    },
                    {
                        id: 13,
                        text: "The Beach Picnic is only for",
                        type: "radio",
                        options: [
                            { value: "A", text: "race competitors." },
                            { value: "B", text: "ticket holders." },
                            { value: "C", text: "children." }
                        ]
                    },
                    {
                        id: 14,
                        text: "The official says that parking",
                        type: "radio",
                        options: [
                            { value: "A", text: "is more expensive for trucks." },
                            { value: "B", text: "costs the same as last year." },
                            { value: "C", text: "is free for some vehicles." }
                        ]
                    },
                    {
                        id: 15,
                        text: "What do stall-holders need to display?",
                        type: "radio",
                        options: [
                            { value: "A", text: "a council licence" },
                            { value: "B", text: "their registration form" },
                            { value: "C", text: "an insurance certificate" }
                        ]
                    },
                    {
                        id: 16,
                        text: "What final advice does the official give the volunteers?",
                        type: "radio",
                        options: [
                            { value: "A", text: "encourage visitors to donate money" },
                            { value: "B", text: "keep strictly to the timetable" },
                            { value: "C", text: "eat and drink regularly" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 17 – 20</strong>",
                instructions: "Choose the correct letter, <strong>A-I</strong>, for each facility.",
                questions: [
                    { id: 17, text: "Admin Tent", type: "text", placeholder: "A-I" },
                    { id: 18, text: "Lost Property", type: "text", placeholder: "A-I" },
                    { id: 19, text: "Sandcastle Competition", type: "text", placeholder: "A-I" },
                    { id: 20, text: "First Aid", type: "text", placeholder: "A-I" }
                ],
                boxContent: {
                    title: "Facilities",
                    content: [
                        { type: "text", text: "Write the correct letter next to each facility." }
                    ]
                }
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
                        text: "According to John, UK retailers who differentiate between boys' and girls' products are",
                        type: "radio",
                        options: [
                            { value: "A", text: "being forced to change this approach." },
                            { value: "B", text: "only responding to what customers want." },
                            { value: "C", text: "responsible for establishing a global trend." }
                        ]
                    },
                    {
                        id: 22,
                        text: "Annie believes most parents prefer children's toys to be displayed according to",
                        type: "radio",
                        options: [
                            { value: "A", text: "theme." },
                            { value: "B", text: "brand." },
                            { value: "C", text: "age group." }
                        ]
                    },
                    {
                        id: 23,
                        text: "When discussing Lise Eliot's book on gender roles, the students agree that",
                        type: "radio",
                        options: [
                            { value: "A", text: "Eliot has overestimated the influence of advertising on children." },
                            { value: "B", text: "Eliot's book will be most popular within the USA." },
                            { value: "C", text: "Eliot makes some valid points within the book." }
                        ]
                    },
                    {
                        id: 24,
                        text: "In John's opinion, the problem of marketing toys according to gender is that a child's",
                        type: "radio",
                        options: [
                            { value: "A", text: "social development will be delayed." },
                            { value: "B", text: "career options could become limited." },
                            { value: "C", text: "academic achievement will suffer." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 30</strong>",
                instructions: "The flow-chart has five gaps. Choose the correct answer and move it into the gap.",
                summaryContent: {
                    title: "The development of gender-specific clothing in the US",
                    text: "It was because of [25] ........................ that children wore white clothes in the 19th century.\nIn the early 1900s, consumers were influenced by the choices of [26] ........................ .\nBy the 1940s, shop owners believed that [27] ........................ were 'blue for boys' and 'pink for girls'.\nIn the 1960s, teenage girls believed that [28] ........................ could be beneficial to them.\nThe [29] ........................ of the 1980s meant that people felt pressure to shop for gender-specific clothing.\nNowadays, some mothers want their daughters to have [30] ........................ as they did not have these themselves."
                },
                boxContent: {
                    title: "Options",
                    content: [
                        { type: "text", text: "A. parental preferences" },
                        { type: "text", text: "B. technological advances" },
                        { type: "text", text: "C. physical abilities" },
                        { type: "text", text: "D. feminine clothes" },
                        { type: "text", text: "E. advertising changes" },
                        { type: "text", text: "F. unisex styles" },
                        { type: "text", text: "G. well-known figures" },
                        { type: "text", text: "H. practical reasons" }
                    ]
                }
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
        boxContent: {
            title: "The History of Umbrellas",
            content: [
                { type: "header", text: "Symbolism and Status" },
                { type: "text", text: "• Umbrellas symbolized [31] ........................ for rulers, showcasing authority." },
                { type: "text", text: "• Only wealthy Roman [32] ........................ could own umbrellas, a status symbol." },
                { type: "header", text: "Materials and Construction" },
                { type: "text", text: "• In India, umbrellas were made from local [33] ........................ and in China from silk." },
                { type: "text", text: "• Umbrellas were treated with [34] ........................ to make them waterproof, improving their usefulness." },
                { type: "header", text: "Practical Enhancements" },
                { type: "text", text: "• Originally, umbrellas were designed to protect the [35] ........................ from various elements." },
                { type: "text", text: "• Early umbrellas resembled big [36] ........................ providing extensive coverage." },
                { type: "text", text: "• Umbrellas were often used with [37] ........................ especially in cold or wet climates." },
                { type: "text", text: "• The introduction of [38] ........................ in the 1850s made umbrellas lighter and more durable." },
                { type: "text", text: "• In England, umbrella frames began to be made with [39] ........................, enhancing their durability." },
                { type: "text", text: "• In Germany, the shift to using [40] ........................ for umbrellas improved their functionality and popularity." }
            ]
        }
    }
};

function getTestData4() {
    return TEST_DATA_4;
}

window.TEST_DATA_4 = TEST_DATA_4;
window.getTestData4 = getTestData4;
