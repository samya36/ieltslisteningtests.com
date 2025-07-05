// 测试数据
const TEST_DATA = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "AMATEUR DRAMATIC SOCIETY",
            items: [
                { text: "Location for rehearsals: The [1] House, Wynn" },
                { text: "No experience necessary\nThey need actors and [2] singers" },
                { text: "Also need people who can [3]" },
                { text: "Meetings 6–8 p.m. every [4]" },
                { text: "Closed in [5] (for 2 weeks)" },
                { text: "Membership costs:\nStandard: £40 (includes a [6] once a year)" },
                { text: "Over 60s or unemployed: £ [7]" },
                { text: "Youth group: for people aged [8] years old and under" },
                { text: "Shows:", type: "text" },
                { text: "• mostly plays by [9] authors", type: "bullet" },
                { text: "• family show in December\n(raises money for children's [10])", type: "bullet" }
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
                        text: "What should employees bring to work?",
                        type: "radio",
                        options: [
                            { value: "A", text: "gloves" },
                            { value: "B", text: "lunch" },
                            { value: "C", text: "water" }
                        ]
                    },
                    {
                        id: 12,
                        text: "If employees can't come to work one day, they should",
                        type: "radio",
                        options: [
                            { value: "A", text: "contact the duty manager." },
                            { value: "B", text: "leave a phone message at the farm office." },
                            { value: "C", text: "call their team leader." }
                        ]
                    },
                    {
                        id: 13,
                        text: "One problem with customers that may occur now is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "they sometimes fail to return baskets." },
                            { value: "B", text: "they eat the fruit before paying." },
                            { value: "C", text: "they can be unsure about prices." }
                        ]
                    },
                    {
                        id: 14,
                        text: "One of the benefits of working at the strawberry farm is that",
                        type: "radio",
                        options: [
                            { value: "A", text: "employees' friends are entitled to a small discount." },
                            { value: "B", text: "employees can have a quantity of fresh fruit for free." },
                            { value: "C", text: "employees don't pay the full price for gift items in the shop" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 15- 20</strong>",
                instructions: "Choose <strong>SIX</strong> answers from the box and write the correct letter: <strong>A-J</strong>, next to Questions 15-20.",
                mapContent: {
                    title: "Map of Strawberry Farm",
                    imageUrl: "../images/test1/map.jpg"
                },
                questions: [
                    {
                        id: 15,
                        text: "Staff room",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 16,
                        text: "Administration",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 17,
                        text: "Packing shed",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 18,
                        text: "Staff car park",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 19,
                        text: "Ripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    },
                    {
                        id: 20,
                        text: "Unripe strawberries",
                        type: "text",
                        placeholder: "A-J"
                    }
                ],
                boxContent: "Buildings\nA B C D E F G H I J"
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
                        text: "Why were Mark and Stella attracted to Bolton Island for their field trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "because it is geologically unique" },
                            { value: "B", text: "because it is easily accessible" },
                            { value: "C", text: "because it is largely unstudied" }
                        ]
                    },
                    {
                        id: 22,
                        text: "Which aspect of Bolton Island's physical geography did Mark and Stella focus on?",
                        type: "radio",
                        options: [
                            { value: "A", text: "its natural harbour" },
                            { value: "B", text: "its fertile soil" },
                            { value: "C", text: "its rock formations" }
                        ]
                    },
                    {
                        id: 23,
                        text: "Which problem did Mark and Stella have in studying Bolton Island's physical geography?",
                        type: "radio",
                        options: [
                            { value: "A", text: "getting useful information from the local residents" },
                            { value: "B", text: "recognising which features were man-made" },
                            { value: "C", text: "finding official data about the island" }
                        ]
                    },
                    {
                        id: 24,
                        text: "What preparation was most useful for Mark and Stella's trip?",
                        type: "radio",
                        options: [
                            { value: "A", text: "reading previous field trip reports" },
                            { value: "B", text: "drawing up a detailed schedule for their trip" },
                            { value: "C", text: "doing online research" }
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
                        text: "Which TWO mistakes did Mark and Stella make with their visuals?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "not taking enough care when making sketches" },
                            { value: "B", text: "not ensuring their photos had proper lighting" },
                            { value: "C", text: "not using anything to indicate the scale of their photos" },
                            { value: "D", text: "not making multiple photos and drawings of things of interest" },
                            { value: "E", text: "not adequately recording when and where drawings were made" }
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
                        text: "Which TWO things does Stella say students need to do for a successful interview?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Guide the way in which the interview progresses." },
                            { value: "B", text: "Prepare the questions well in advance." },
                            { value: "C", text: "Check the recording equipment is working." },
                            { value: "D", text: "Explain fully the purpose of the interview." },
                            { value: "E", text: "Give a personal opinion on the topics which are covered." }
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
                        text: "Which TWO things do Mark and Stella suggest doing with regard to note-taking on a field trip?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "Ensure that terminology is correctly used in the notes." },
                            { value: "B", text: "Check your notes every evening." },
                            { value: "C", text: "Be highly selective." },
                            { value: "D", text: "Record the source of all information." },
                            { value: "E", text: "Use a digital device rather than paper." }
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
            title: "Development and use of plastics",
            content: [
                {
                    type: "header",
                    text: "1930s"
                },
                {
                    type: "subheader",
                    text: "Polythene – two main forms:"
                },
                {
                    type: "bullet-main",
                    text: "LDPE –",
                    description: "distinguishing feature: it is highly [31] ........................",
                    examples: "e.g. used to make [32] ........................ , carrier bags and packaging materials"
                },
                {
                    type: "bullet-main",
                    text: "HDPE –",
                    description: "made tougher by exposure to a particular kind of [33] ........................",
                    examples: "– suitable for rigid containers, e.g. for bleach"
                },
                {
                    type: "subheader",
                    text: "Polyurethane – two main forms:"
                },
                {
                    type: "bullet-sub",
                    text: "blown form used for making [34] ........................ (padding) and in housing infrastructure to give [35] ........................"
                },
                {
                    type: "bullet-sub",
                    text: "non-blown form used mainly for sportswear"
                },
                {
                    type: "header",
                    text: "1940s – 1950s"
                },
                {
                    type: "subheader",
                    text: "PET"
                },
                {
                    type: "text",
                    text: "– used to make [36] ........................ , e.g. Dacron and Terylene"
                },
                {
                    type: "text",
                    text: "– popular for making containers for fizzy drinks"
                },
                {
                    type: "text",
                    text: "– because it resists abrasion"
                },
                {
                    type: "text",
                    text: "– used for household objects such as [37] ........................"
                },
                {
                    type: "subheader",
                    text: "Tupperware"
                },
                {
                    type: "text",
                    text: "– storage boxes"
                },
                {
                    type: "text",
                    text: "– revolution in [38] ........................ techniques"
                },
                {
                    type: "header",
                    text: "1960s"
                },
                {
                    type: "compound",
                    bold: "Teflon",
                    text: "– non-stick"
                },
                {
                    type: "text",
                    text: "– almost no [39] ........................ , so used for protective coatings, e.g. for frying pans"
                },
                {
                    type: "compound",
                    bold: "Gore-Tex",
                    text: "– best known for outdoor wear"
                },
                {
                    type: "text",
                    text: "– also used for various [40] ........................ purposes"
                }
            ]
        }
    }
};

// 获取测试数据的函数
function getTestData() {
    return TEST_DATA;
}

// 导出函数
window.getTestData = getTestData; 