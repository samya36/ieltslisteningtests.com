// Test 6 测试数据 - Amateur Dramatic Society, Clifton Bird Park, Shampoo Advertising, Drama Activities in the Classroom
const TEST_DATA_6 = {
    testInfo: {
        title: 'IELTS Listening Test 6',
        description: 'Amateur Dramatic Society / Clifton Bird Park / Shampoo Advertising / Drama Activities',
        totalQuestions: 40,
        timeLimit: 30,
        audioPath: '../audio/test6/'
    },

    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>ONE WORD /OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "Amateur Dramatic Society",
            subtitle: "Secretary: Jane Caulfield\n\nMailing address: 117 Green Road, Prestwin",
            items: [
                { text: "Location for rehearsals: The [1]........................ House, Wynn" },
                { text: "No experience necessary" },
                { text: "They need actors and [2]........................ singers" },
                { text: "Also need people who can [3]........................" },
                { text: "Meetings 6-8 p.m. every [4]........................" },
                { text: "Closed in [5]........................ (for 2 weeks)" },
                { text: "Membership costs:", type: "text" },
                { text: "Standard: £ 40 (includes a [6]........................ once a year)", type: "bullet" },
                { text: "Over 60s or unemployed: £ [7]........................", type: "bullet" },
                { text: "Youth group: for people aged [8]........................ years old and under", type: "bullet" },
                { text: "Shows:", type: "text" },
                { text: "• mostly plays by [9]........................ authors", type: "bullet" },
                { text: "• family show in December", type: "bullet" },
                { text: "(raises money for children's [10]........................)", type: "bullet" }
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
                        text: "The speaker stresses the importance to Clifton Bird Park of",
                        type: "radio",
                        options: [
                            { value: "A", text: "birds that are now endangered." },
                            { value: "B", text: "birds from all over the world." },
                            { value: "C", text: "birds that are common in the local area." }
                        ]
                    },
                    {
                        id: 12,
                        text: "People who volunteer to help with gardening at the park",
                        type: "radio",
                        options: [
                            { value: "A", text: "must work at weekends." },
                            { value: "B", text: "need to come at least once a month." },
                            { value: "C", text: "will only be required in the busy season." }
                        ]
                    },
                    {
                        id: 13,
                        text: "According to the speaker, who would be the ideal gardening volunteer?",
                        type: "radio",
                        options: [
                            { value: "A", text: "someone who can work independently" },
                            { value: "B", text: "someone who is willing to work in any weather" },
                            { value: "C", text: "someone who knows a lot about plants" }
                        ]
                    },
                    {
                        id: 14,
                        text: "Volunteer guides will mainly be working with",
                        type: "radio",
                        options: [
                            { value: "A", text: "international visitors." },
                            { value: "B", text: "local people from Clifton." },
                            { value: "C", text: "school groups." }
                        ]
                    },
                    {
                        id: 15,
                        text: "What is still required for the Maintenance Day at the bird park?",
                        type: "radio",
                        options: [
                            { value: "A", text: "food and drink" },
                            { value: "B", text: "transport" },
                            { value: "C", text: "tools" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 16 – 20</strong>",
                instructions: "Choose the correct letter, <strong>A-H</strong>, for each building.",
                questions: [
                    { id: 16, text: "Wooden bridge", type: "text", placeholder: "A-H" },
                    { id: 17, text: "Observation tower", type: "text", placeholder: "A-H" },
                    { id: 18, text: "Visitor cabins", type: "text", placeholder: "A-H" },
                    { id: 19, text: "Nesting boxes", type: "text", placeholder: "A-H" },
                    { id: 20, text: "Boat sheds", type: "text", placeholder: "A-H" }
                ],
                boxContent: {
                    title: "Building",
                    content: [
                        { type: "text", text: "Write the correct letter A-H next to Questions 16-20." }
                    ]
                }
            }
        ]
    },

    section3: {
        title: "<strong>Section 3</strong>",
        parts: [
            {
                title: "<strong>Questions 21 – 26</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 21,
                        text: "Janet says that over time, shampoo has become",
                        type: "radio",
                        options: [
                            { value: "A", text: "a cheaper product." },
                            { value: "B", text: "more hygienic in its effects." },
                            { value: "C", text: "a different kind of commodity." }
                        ]
                    },
                    {
                        id: 22,
                        text: "What does Janet say about bad hair days?",
                        type: "radio",
                        options: [
                            { value: "A", text: "They really do exist." },
                            { value: "B", text: "Women worry about them more than men." },
                            { value: "C", text: "Their name is inaccurate." }
                        ]
                    },
                    {
                        id: 23,
                        text: "What do Janet and Michael say about the chemicals used in shampoos?",
                        type: "radio",
                        options: [
                            { value: "A", text: "All shampoos contain the same chemicals." },
                            { value: "B", text: "The chemicals are believed to be dangerous." },
                            { value: "C", text: "The presence of the chemicals is rarely publicised." }
                        ]
                    },
                    {
                        id: 24,
                        text: "According to Janet, printing directly onto shampoo bottles, rather than onto labels",
                        type: "radio",
                        options: [
                            { value: "A", text: "costs more." },
                            { value: "B", text: "looks less attractive." },
                            { value: "C", text: "takes a lot longer." }
                        ]
                    },
                    {
                        id: 25,
                        text: "With regard to environmental issues, Michael and Janet want to investigate",
                        type: "radio",
                        options: [
                            { value: "A", text: "the appearance of shampoo bottles." },
                            { value: "B", text: "variations in the weight of shampoo bottles." },
                            { value: "C", text: "the source of recycled plastic in shampoo bottles." }
                        ]
                    },
                    {
                        id: 26,
                        text: "Michael bases his own shampoo purchase decisions on his",
                        type: "radio",
                        options: [
                            { value: "A", text: "loyalty to certain brands." },
                            { value: "B", text: "desire to get value for money." },
                            { value: "C", text: "willingness to try new products." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 27 – 30</strong>",
                instructions: "Choose the correct answer from the box and write the correct letter, <strong>A-G</strong>.",
                questions: [
                    { id: 27, text: "Zing", type: "text", placeholder: "A-G" },
                    { id: 28, text: "Splash", type: "text", placeholder: "A-G" },
                    { id: 29, text: "Just go", type: "text", placeholder: "A-G" },
                    { id: 30, text: "Brozene", type: "text", placeholder: "A-G" }
                ],
                boxContent: {
                    title: "Advertising focuses",
                    content: [
                        { type: "text", text: "A. link to relaxation" },
                        { type: "text", text: "B. enviable lifestyle" },
                        { type: "text", text: "C. natural ingredients" },
                        { type: "text", text: "D. masculine image" },
                        { type: "text", text: "E. product reliability" },
                        { type: "text", text: "F. romantic interest" },
                        { type: "text", text: "G. use by celebrities" }
                    ]
                }
            }
        ]
    },

    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
        boxContent: {
            title: "Benefits of using drama activities in the classroom",
            content: [
                { type: "header", text: "Child's personal development" },
                { type: "text", text: "• Group participation develops [31]........................ in own ideas." },
                { type: "text", text: "• Unscripted, imaginative activities allow children to take [32]........................" },
                { type: "header", text: "Child's educational development" },
                { type: "text", text: "• Working as a group teaches the importance of [33]........................ to others." },
                { type: "text", text: "• Performing makes children [34]........................ for their learning and behavior." },
                { type: "header", text: "Role-play can be used:" },
                { type: "text", text: "• as a form of [35]........................" },
                { type: "text", text: "• for children experiencing problems" },
                { type: "text", text: "• to help children be objective about their behaviour problems" },
                { type: "text", text: "• to explore controversial issues with a class in a [36]........................ environment" },
                { type: "text", text: "• to explore children's self-knowledge and understanding of [37]........................" },
                { type: "header", text: "Advantages of using role-play in the study of history" },
                { type: "text", text: "• Drama activities increase children's [38]........................ in class" },
                { type: "text", text: "• Makes it easier for children to [39]........................ and understand historical events" },
                { type: "text", text: "• Can find answers to [40]........................ in history to see why certain decisions were made" }
            ]
        }
    }
};

function getTestData6() {
    return TEST_DATA_6;
}

window.getTestData6 = getTestData6;
window.TEST_DATA_6 = TEST_DATA_6;
