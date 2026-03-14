// Test 2 测试数据 - Rental Property Application Form, Queensland Festival, Children Outdoors, The Berbers
const TEST_DATA_2 = {
    section1: {
        title: "<strong>Section 1</strong>",
        parts: [
            {
                title: "<strong>Questions 1 – 10</strong>",
                instructions: "Complete the form below.\n\nWrite <strong>ONE WORD OR A NUMBER</strong> for each answer.",
                formContent: {
                    title: "Rental Property Application Form",
                    items: [
                        { text: "Name: Susan Smith" },
                        { text: "Phone number: [1] ........................ (mobile)" },
                        { text: "Email address: susan.smith@ [2] ........................ .com" },
                        { text: "Current address: 234 Becketts Road, Brisbane. 4054" },
                        { text: "New Zealand Employer: Auckland Hospital" },
                        { text: "Occupation: a [3] ........................" },
                        { text: "Rental start date: 8th February" },
                        { text: "Preferred property type:", type: "text" },
                        { text: "• first preference: a house with a [4] ........................", type: "bullet" },
                        { text: "• second preference: an apartment with a big [5] ........................", type: "bullet" },
                        { text: "Bedrooms: two" },
                        { text: "Furnishings: a [6] ........................ is required" },
                        { text: "Maximum rent: $ [7] ........................ per week" },
                        { text: "Preferred location: near the [8] ........................" },
                        { text: "Other requirements:", type: "text" },
                        { text: "• must have [9] ........................ nearby", type: "bullet" },
                        { text: "• would like [10] ........................ included in the rent", type: "bullet" }
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
                title: "<strong>Questions 21 – 22</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A-E</strong>.",
                questions: [
                    {
                        id: "21-22",
                        text: "What do the speakers agree are the TWO reasons why children play outdoors less now than in the past?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "concerns about traffic" },
                            { value: "B", text: "limited outdoor play facilities" },
                            { value: "C", text: "increased time spent online" },
                            { value: "D", text: "preference for indoor play" },
                            { value: "E", text: "reduction in free time" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 23 – 24</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A-E</strong>.",
                questions: [
                    {
                        id: "23-24",
                        text: "In his assignment, which TWO aspects of outdoor play does Ravi want to focus on?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "how it helps children to evaluate risk" },
                            { value: "B", text: "how it broadens their horizons" },
                            { value: "C", text: "how it aids children's muscular development" },
                            { value: "D", text: "how it improves children's digestion" },
                            { value: "E", text: "how it teaches children about the environment" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 25 – 26</strong>",
                instructions: "Choose <strong>TWO</strong> letters, <strong>A-E</strong>.",
                questions: [
                    {
                        id: "25-26",
                        text: "According to Ravi, in which TWO ways are children's periods of outdoor play now different from a generation ago?",
                        type: "checkbox",
                        options: [
                            { value: "A", text: "They are less dangerous." },
                            { value: "B", text: "They involve fewer children." },
                            { value: "C", text: "They usually last a shorter time." },
                            { value: "D", text: "They include fewer made-up games." },
                            { value: "E", text: "They involve fewer chasing games." }
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
                        text: "Ravi thinks parents should be more concerned about the decline of outdoor play because",
                        type: "radio",
                        options: [
                            { value: "A", text: "it affects family relationships." },
                            { value: "B", text: "it leads to health problems later in life." },
                            { value: "C", text: "it makes childhood less enjoyable." }
                        ]
                    },
                    {
                        id: 28,
                        text: "What does Ravi say that schools should do with regard to outdoor play?",
                        type: "radio",
                        options: [
                            { value: "A", text: "revise their aims" },
                            { value: "B", text: "spend more money on it" },
                            { value: "C", text: "listen to the views of parents" }
                        ]
                    },
                    {
                        id: 29,
                        text: "What did Smith and Barker say about children in rural areas?",
                        type: "radio",
                        options: [
                            { value: "A", text: "They tend not to be allowed on farmland." },
                            { value: "B", text: "They receive more supervision out of doors." },
                            { value: "C", text: "They spend more time outdoors than city children." }
                        ]
                    },
                    {
                        id: 30,
                        text: "What problem does Dr. Chang highlight about Smith and Barker's area?",
                        type: "radio",
                        options: [
                            { value: "A", text: "Its findings are inconclusive." },
                            { value: "B", text: "It is too old to be useful." },
                            { value: "C", text: "Its focus is limited." }
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
            title: "The Berbers",
            content: [
                { type: "text", text: "• lived in various countries in North Africa" },
                { type: "text", text: "• were driven from their homes during the 12th century" },
                { type: "text", text: "• began to lead a nomadic life, moving across [31] ........................ and mountains" },
                { type: "header", text: "Different Berber Lifestyles" },
                { type: "text", text: "• Some Berbers, known as [32] ........................ nomads, moved twice a year." },
                { type: "text", text: "• Some Berbers were completely nomadic." },
                { type: "text", text: "• Some Berbers settled by oases, producing fruit, vegetables, and [33] ........................ to cook with." },
                { type: "text", text: "• People and belongings were carried by [34] ........................" },
                { type: "text", text: "• Settled communities organised themselves by holding regular meetings in the [35] ........................ of the village." },
                { type: "header", text: "The Tuaregs" },
                { type: "text", text: "• If goatskins were unavailable, tents were made from [36] ........................ or palm-leaf mats." },
                { type: "text", text: "• Tuareg labourers were the descendants of [37] ........................" },
                { type: "text", text: "• Adult men always wore a [38] ........................ veil." },
                { type: "text", text: "• Some Tuaregs moved to Burkina Faso with their [39] ........................" },
                { type: "header", text: "Tuaregs and Timbuktu" },
                { type: "text", text: "• Some Tuaregs now work as [40] ........................ for the Malian Department of Tourism." }
            ]
        }
    }
};

function getTestData2() {
    return TEST_DATA_2;
}

window.TEST_DATA_2 = TEST_DATA_2;
window.getTestData2 = getTestData2;
