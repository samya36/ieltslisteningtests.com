// Test 3 测试数据 - Kiwi Air Customer Complaint Form, Spring Festival, Geology Field Trip to Iceland, Recycling Tyres in Australia
const TEST_DATA_3 = {
    section1: {
        title: "<strong>Section 1</strong>",
        instructions: "<strong>Questions 1-10</strong>\n\nComplete the form below.\n\nWrite <strong>ONE WORD OR A NUMBER</strong> for each answer.",
        formContent: {
            title: "Kiwi Air Customer Complaint Form",
            items: [
                { text: "Customer has been trying to make booking using the internet." },
                { text: "Booking details:", type: "text" },
                { text: "Name: [1] ........................ Janet" },
                { text: "Ticket details: one adult and three children (Wellington to Christchurch) - four [2] ........................ tickets" },
                { text: "Flight dates: November 10th - 15th" },
                { text: "Time: departing at [3] ........................ a.m." },
                { text: "Details of the problem:", type: "text" },
                { text: "• the website changes the rate for one child", type: "bullet" },
                { text: "• the website keeps giving the customer [4] ........................ message", type: "bullet" },
                { text: "Customer informed that Kiwi Air policy:", type: "text" },
                { text: "• allows no more than [5] ........................ child fares per adult (applies to domestic flights only)", type: "bullet" },
                { text: "Customer's reasons for complaint:", type: "text" },
                { text: "• none of her children are [6] ........................ years old or older", type: "bullet" },
                { text: "• child passengers require less [7] ........................", type: "bullet" },
                { text: "• the rule is unfair for large families and [8] ........................ groups", type: "bullet" },
                { text: "Customer invited to send written complaint:", type: "text" },
                { text: "• letter to go to the [9] ........................", type: "bullet" },
                { text: "• reply predicted within a week", type: "bullet" },
                { text: "• reference number: [10] ........................", type: "bullet" }
            ]
        }
    },
    section2: {
        title: "<strong>Section 2</strong>",
        parts: [
            {
                title: "<strong>Questions 11 – 18</strong>",
                instructions: "Complete the form below.\n\nWrite <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.",
                tableData: {
                    title: "Spring Festival",
                    headers: ["Event", "Location", "Date and Time", "Other Information"],
                    rows: [
                        ["Firework display", "Near the: [11] ........................", "4 September, 9 p.m.", "Pack a [12] ........................ and blanket"],
                        ["Display of [13] ........................", "Central Park", "daily", "Buses run from the town centre every [14] ........................ minutes"],
                        ["The [15] ........................ Show", "Exhibition Centre", "10-15 September, 9 a.m. - 10 p.m.", ""],
                        ["'Grow Your Imagination'", "in the [16] ........................", "11-19 September", ""],
                        ["'Swing in Spring'", "in the [17] ........................", "17 & 18 September", "Saturday matinee performance at [18] ........................"]
                    ]
                }
            },
            {
                title: "<strong>Questions 19 – 20</strong>",
                instructions: "Choose the correct letter, <strong>A, B or C</strong>.",
                questions: [
                    {
                        id: 19,
                        text: "In the Spring Festival competition, you can win",
                        type: "radio",
                        options: [
                            { value: "A", text: "a family pass to 'Balloons Down Under'." },
                            { value: "B", text: "a cheque for $200." },
                            { value: "C", text: "a flight in a hot air balloon." }
                        ]
                    },
                    {
                        id: 20,
                        text: "You can get an entry form for the competition from",
                        type: "radio",
                        options: [
                            { value: "A", text: "the radio station" },
                            { value: "B", text: "the newspaper" },
                            { value: "C", text: "the Festival's website" }
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
                        text: "Why do Andrew and Sarah decide to mention the Mountain Code?",
                        type: "radio",
                        options: [
                            { value: "A", text: "It is the most relevant to their field trip." },
                            { value: "B", text: "It also applies to caves." },
                            { value: "C", text: "It covers the whole country." }
                        ]
                    },
                    {
                        id: 22,
                        text: "Andrew suggests some field trip participants harm the environment because",
                        type: "radio",
                        options: [
                            { value: "A", text: "they fail to recognise rare species of plant." },
                            { value: "B", text: "they don't realise how fragile the environment is." },
                            { value: "C", text: "they get too absorbed in their tasks." }
                        ]
                    },
                    {
                        id: 23,
                        text: "Which rule about taking samples is most important?",
                        type: "radio",
                        options: [
                            { value: "A", text: "Leave the area in its natural state." },
                            { value: "B", text: "Avoid removing fossils." },
                            { value: "C", text: "Keep collecting to a minimum." }
                        ]
                    },
                    {
                        id: 24,
                        text: "Which aspect of taking samples do they still have to find out about?",
                        type: "radio",
                        options: [
                            { value: "A", text: "taking them from private land" },
                            { value: "B", text: "taking them from rock faces" },
                            { value: "C", text: "taking them from man-made structures" }
                        ]
                    },
                    {
                        id: 25,
                        text: "What danger in coastal areas do they decide to emphasise?",
                        type: "radio",
                        options: [
                            { value: "A", text: "falling rock" },
                            { value: "B", text: "tidal movements" },
                            { value: "C", text: "unstable sand" }
                        ]
                    }
                ]
            },
            {
                title: "<strong>Questions 26 – 30</strong>",
                instructions: "Which topic does each of the following reading packs focus on?\n\nChoose the correct letter, <strong>A-G</strong>.",
                questions: [
                    { id: 26, text: "Geothermal Fields", type: "text", placeholder: "A-G" },
                    { id: 27, text: "The Hot Spot", type: "text", placeholder: "A-G" },
                    { id: 28, text: "Glaciers", type: "text", placeholder: "A-G" },
                    { id: 29, text: "Basalt Rock", type: "text", placeholder: "A-G" },
                    { id: 30, text: "Geothermal Power Plants", type: "text", placeholder: "A-G" }
                ],
                boxContent: {
                    title: "Topic Box",
                    content: [
                        { type: "text", text: "A. unique geological features of Iceland" },
                        { type: "text", text: "B. replacement of fossil fuels" },
                        { type: "text", text: "C. negative changes due to human activity" },
                        { type: "text", text: "D. energy for agriculture" },
                        { type: "text", text: "E. health risks of eruptions" },
                        { type: "text", text: "F. risk of flooding" },
                        { type: "text", text: "G. long-term effects of volcanoes" }
                    ]
                }
            }
        ]
    },
    section4: {
        title: "<strong>Section 4</strong>",
        parts: [
            {
                title: "<strong>Questions 31 – 34</strong>",
                instructions: "Complete the notes below.\n\nWrite <strong>ONE WORD ONLY</strong> for each answer.",
                boxContent: {
                    title: "Recycling Tyres in Australia",
                    content: [
                        { type: "header", text: "Background" },
                        { type: "text", text: "More than 1.5 million tyres dumped in Australia per [31] ........................" },
                        { type: "text", text: "Previous recycling attempts failed because:" },
                        { type: "text", text: "• there were pollution problems - smoke from burning" },
                        { type: "text", text: "• recycling companies didn't make any [32] ........................" },
                        { type: "header", text: "Advantages of Molectra's process" },
                        { type: "text", text: "• More economical because smaller machines are used" },
                        { type: "text", text: "• Less maintenance - tyres softened before shredding" },
                        { type: "text", text: "• No limit on the [33] ........................ of tyres recycled" },
                        { type: "header", text: "The Future" },
                        { type: "text", text: "• Ten more factories being built" },
                        { type: "text", text: "• Plans to spend 5% of income each year on [34] ........................" }
                    ]
                }
            },
            {
                title: "<strong>Questions 35 – 40</strong>",
                instructions: "Complete the flow-chart below.\n\nWrite <strong>ONE WORD ONLY</strong> in each gap.",
                summaryContent: {
                    title: "Recycling Tyres - Process Flow Chart",
                    text: "1. Removal of steel\n[35] ........................ from tyre rim -> steel pellets used in industry\n\n2. Chemicals applied to get rid of [36] ........................ and soften rubber\n-> Strengthening concrete\n\n3. Fibres, e.g. nylon, removed\n-> Sheets made of [37] ........................\n\n4. Tyres cut up into crumb rubber\n-> Asphalt for roads\n-> Insulation\n-> [38] ........................ tiles\n\n5. The MolectraVac machine microwaves rubber into hydrocarbon\n(i) Used for activated carbon:\n- [39] ........................ treatment\n- air filtration\n\n(ii) Used for carbon black:\n- batteries\n- [40] ........................\n\n(iii) Oil used for electricity"
                }
            }
        ]
    }
};

function getTestData3() {
    return TEST_DATA_3;
}

window.TEST_DATA_3 = TEST_DATA_3;
window.getTestData3 = getTestData3;
