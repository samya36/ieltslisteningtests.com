// Test 5 测试数据 - Winsham Farm Centre, Queensland Festival, Environmental Science Modules, Photic Sneezing
const TEST_DATA_5 = {
    testInfo: {
        title: "IELTS Listening Test 5",
        description: "Winsham Farm Centre / Queensland Festival / Environmental Science / Photic Sneezing",
        totalQuestions: 40,
        timeLimit: 30,
        audioPath: "../audio/test5/"
    },
    section1: {
        title: "<strong>Section 1</strong>",
        parts: [
            {
                title: "<strong>Questions 1 – 8</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 1,
                        text: "The centre has enough accommodation for",
                        type: "radio",
                        options: [
                            { value: "A", text: "18 people." },
                            { value: "B", text: "20 people." },
                            { value: "C", text: "38 people." }
                        ]
                    },
                    {
                        id: 2,
                        text: "The meeting room is currently",
                        type: "radio",
                        options: [
                            { value: "A", text: "unavailable." },
                            { value: "B", text: "flooded." },
                            { value: "C", text: "booked." }
                        ]
                    },
                    {
                        id: 3,
                        text: "Visitors must tell the centre in advance if they want to",
                        type: "radio",
                        options: [
                            { value: "A", text: "use the centre's kitchen." },
                            { value: "B", text: "have meals cooked for them." },
                            { value: "C", text: "eat at restaurants outside." }
                        ]
                    },
                    {
                        id: 4,
                        text: "All visitors on the tour of the farm can",
                        type: "radio",
                        options: [
                            { value: "A", text: "get information about organic farming." },
                            { value: "B", text: "help to feed the animals." },
                            { value: "C", text: "watch a tractor demonstration." }
                        ]
                    },
                    {
                        id: 5,
                        text: "On the survival course people have to",
                        type: "radio",
                        options: [
                            { value: "A", text: "learn to use a map." },
                            { value: "B", text: "find their own food." },
                            { value: "C", text: "run through woodland." }
                        ]
                    },
                    {
                        id: 6,
                        text: "From the centre it is easy to walk to",
                        type: "radio",
                        options: [
                            { value: "A", text: "the Exmoor National Park." },
                            { value: "B", text: "the beach." },
                            { value: "C", text: "a cycling route." }
                        ]
                    },
                    {
                        id: 7,
                        text: "If the weather is bad visitors can go to a",
                        type: "radio",
                        options: [
                            { value: "A", text: "cinema." },
                            { value: "B", text: "theatre." },
                            { value: "C", text: "museum." }
                        ]
                    },
                    {
                        id: 8,
                        text: "Groups who wish to stay at the centre must pay",
                        type: "radio",
                        options: [
                            { value: "A", text: "part of the cost in advance." },
                            { value: "B", text: "all of the cost in advance." },
                            { value: "C", text: "all of the cost on arrival." }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 9 – 10</strong>",
                instructions: "Complete the form below.\n\nWrite <strong>ONE WORD /OR A NUMBER</strong> for each answer.",
                formContent: {
                    title: "Winsham Farm Centre",
                    items: [
                        { text: "Address: Winsham Farm, [9] ........................ Road, near Sherborne" },
                        { text: "Post code: [10] ........................" }
                    ]
                }
            }
        ]
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
                        text: "Why does Jane recommend visiting the Music Tent on Tuesday?",
                        type: "radio",
                        options: [
                            { value: "A", text: "There will be free entry." },
                            { value: "B", text: "There will be fewer people." },
                            { value: "C", text: "There will be special classes." }
                        ]
                    },
                    {
                        id: 12,
                        text: "When do the educational workshops take place in the Music Tent?",
                        type: "radio",
                        options: [
                            { value: "A", text: "weekends only" },
                            { value: "B", text: "every evening" },
                            { value: "C", text: "every afternoon" }
                        ]
                    },
                    {
                        id: 13,
                        text: "Why does Jane recommend going to the library to buy a ticket?",
                        type: "radio",
                        options: [
                            { value: "A", text: "The tickets will be cheaper there." },
                            { value: "B", text: "You can get tickets in advance there." },
                            { value: "C", text: "It's easier to get tickets there than in the city." }
                        ]
                    },
                    {
                        id: 14,
                        text: "What will history lovers find interesting about Macquarie House?",
                        type: "radio",
                        options: [
                            { value: "A", text: "its gardens" },
                            { value: "B", text: "its architecture" },
                            { value: "C", text: "its location" }
                        ]
                    },
                    {
                        id: 15,
                        text: "The Big Barbecue is different this year because",
                        type: "radio",
                        options: [
                            { value: "A", text: "it will be much larger than before." },
                            { value: "B", text: "there will be free entertainment." },
                            { value: "C", text: "the food will be cooked by international chefs." }
                        ]
                    },
                    {
                        id: 16,
                        text: "What can you do at the Railway Museum?",
                        type: "radio",
                        options: [
                            { value: "A", text: "see a steam engine working" },
                            { value: "B", text: "dress up in a railway worker's uniform" },
                            { value: "C", text: "have a meal inside an old train" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 17 – 18</strong>",
                instructions: "Choose <strong>TWO</strong> correct answers.",
                questions: [
                    {
                        id: "17-18",
                        text: "Which TWO free things does the family ticket on the steam train include?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "an educational talk" },
                            { value: "B", text: "a children's book" },
                            { value: "C", text: "a short film" },
                            { value: "D", text: "a flag" },
                            { value: "E", text: "a tour of the Ipswich Museum" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 19 – 20</strong>",
                instructions: "Choose <strong>TWO</strong> correct answers.",
                questions: [
                    {
                        id: "19-20",
                        text: "Which TWO things apply when voting for Our Favourite Place?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "People of any age may vote." },
                            { value: "B", text: "You may send in your vote by email." },
                            { value: "C", text: "Only local residents may vote." },
                            { value: "D", text: "You may vote several times." },
                            { value: "E", text: "Voting ends at midnight on Saturday." }
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
                title: "<strong>Questions 21 – 26</strong>",
                instructions: "Choose the correct letter, <strong>A-I</strong>, for each module.",
                questions: [
                    { id: 21, text: "Statistics for environmental research", type: "text", placeholder: "A-I" },
                    { id: 22, text: "Sewage and drainage systems", type: "text", placeholder: "A-I" },
                    { id: 23, text: "Agriculture and food security", type: "text", placeholder: "A-I" },
                    { id: 24, text: "Sustainable energy", type: "text", placeholder: "A-I" },
                    { id: 25, text: "Government policy", type: "text", placeholder: "A-I" },
                    { id: 26, text: "Water management", type: "text", placeholder: "A-I" }
                ],
                boxContent: {
                    title: "Opinions",
                    content: [
                        { type: "text", text: "A. was surprisingly interesting" },
                        { type: "text", text: "B. covered too many topics" },
                        { type: "text", text: "C. included out-of-date materials" },
                        { type: "text", text: "D. involved practical applications" },
                        { type: "text", text: "E. supplied useful technical information" },
                        { type: "text", text: "F. was too basic to be useful" },
                        { type: "text", text: "G. provided unnecessary detail" },
                        { type: "text", text: "H. was relevant to a topic in the news" },
                        { type: "text", text: "I. seemed too limited geographically" }
                    ]
                }
            },
            {
                title: "<strong>Questions 27 – 28</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A-E</strong>.",
                questions: [
                    {
                        id: "27-28",
                        text: "Which TWO aspects of the course organisation did both Jamie and Martha like?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "the amount of reading" },
                            { value: "B", text: "the flexibility in the length of the course" },
                            { value: "C", text: "the convenience of choosing when to take modules" },
                            { value: "D", text: "the range of different modules offered" },
                            { value: "E", text: "the relevance of the module content" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 29 – 30</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A-E</strong>.",
                questions: [
                    {
                        id: "29-30",
                        text: "Which TWO suggestions for the written assignment do Jamie and Martha agree to recommend to Dr Brown?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "The time for choosing a topic should be changed." },
                            { value: "B", text: "The permitted word limit should be increased." },
                            { value: "C", text: "Discussions with fellow students should be arranged." },
                            { value: "D", text: "Face-to-face feedback sessions with the tutor should be scheduled." },
                            { value: "E", text: "Tutors should give more help in topic selection." }
                        ]
                    }
                ]
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        instructions: "<strong>Questions 31-40</strong>\n\nComplete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
        boxContent: {
            title: "Photic sneezing",
            content: [
                { type: "header", text: "Background" },
                { type: "text", text: "Some people react to sunlight by:" },
                { type: "text", text: "• a prickle in the nose" },
                { type: "text", text: "• faster [31] ........................ relieved by a sneeze" },
                { type: "text", text: "• watery eyes" },
                { type: "text", text: "This 'photic' sneeze cannot be controlled and is a [32] ........................ reflex." },
                { type: "header", text: "Sneezing in general" },
                { type: "text", text: "• A sneeze is caused by some kind of irritation in the nose." },
                { type: "text", text: "• Nerve endings in the [33] ........................ are stimulated, leading to an explosion of air." },
                { type: "text", text: "• It is coordinated by the same mechanism that controls the production of [34] ........................ ." },
                { type: "header", text: "Research into photic sneezing" },
                { type: "text", text: "Aristotle: Why does the sun cause sneezing while a [35] ........................ does not?" },
                { type: "text", text: "Bacon showed the cause was light." },
                { type: "text", text: "Everett found 80% of photic sneezers shared the habit with [36] ........................ ." },
                { type: "header", text: "Indicators" },
                { type: "text", text: "Photic sneezers usually produce the same [37] ........................ of sneezes." },
                { type: "text", text: "The reaction is caused by a [38] ........................ in brightness." },
                { type: "text", text: "The sneeze takes [39] ........................ to recharge." },
                { type: "header", text: "Application" },
                { type: "text", text: "The condition was often ignored apart from some research on photic sneezing among [40] ........................ ." },
                { type: "text", text: "But studying it may result in breakthroughs for more serious conditions." }
            ]
        }
    }
};

function getTestData5() {
    return TEST_DATA_5;
}

window.TEST_DATA_5 = TEST_DATA_5;
window.getTestData5 = getTestData5;
