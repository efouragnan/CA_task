//Experiment information
var pilotTest = true; //will turn off ratings function, average feedback, and change instructions

var settings = {
    repeatInstructions: false,     //if the participant has to re-do the instructions, change how many trials they practice
    noOfTrials: {
        rockSlidePractice1: 0 //how many trials in each training section
    },
    fullscreen: false,
    hideSkipButton: true,
    displayFeedback: true,
    addJitter: true,
    jitterMagnitude: 12, //pixel range for the jitter
    instr: {
        pics: [],
        texts: [],
        counter: 0,
        start: {//which slides are the first (for determining button function in instruction section)
            rockSlideInstr1: 0
        },
        stop: {//which slides are the last (for determining button function in instruction section)
            rockSlideInstr1: (!pilotTest) ? 5 : 4
        }
    },
    mcq: {
        maxQ: 4 // questions in multiple choice questionnaire to assess task understanding
    }
};

var data = {
    questions: [],
    consent: 0,
    exptDate: {
        startDate: [],
        endDate: []
    },
    experimentDuration: [],
    behavior: [],
    exptTimeLine: [],
    screenSize: [], //matches total screen resolution
    browserWindowSize: []   //height of the viewport that shows the website - just the content, no browser bars
};

// List of pictures for instructions screen
// Temporary counters for multiple choice quiz
var tSet = {
    taskCounter: -1, // starts at -1 for the first training, then increases by one for subsequent training or real experiment
    mcq: {
        curQ: 0,
        answers: [],
        pics: [],
        finishEnabled: 0
    }
};

// questions and answers for the multiple choice test to check understanding of the task
var MCQs = [
    {
        // Q1
        question: "During the real experiment, when will the target be hidden?",
        answers: {
            a: "Every other trial",
            b: "Every time",
            c: "Never",
            d: "Randomly"
        },
        correctAnswer: 'b'
    },
    {
        //Q2
        question: "When should you press the button in this scenario?",
        answers: {
            a: "A: Just when you expect the ball to hit the hidden target",
            b: "B: Before the ball enters the hidden area",
            c: "C: When the ball reappears and you know it has hit the target",
            d: "D: Immediately after you think the ball has hit the target"
        },
        correctAnswer: 'a'
    },
    {
        //Q3
        question: "Which of the following is true about the hidden target jitter?",
        answers: {
            a: "The game is malfunctioning",
            b: "The target is changing locations behind the screen",
            c: "The jitter means you cannot make an accurate response"
        },
        correctAnswer: 'b'
    },
    {
        // Q4
        question: "After each trial you will see a bar with a coloured gradient. What does your placement of the tick mark represent?",
        answers: {
            a: "How well you are doing on average",
            b: "How difficult the last trial was",
            c: "Your expectation of how difficult the next trial will be",
            d: "How accurate you think your last response was"
        },
        correctAnswer: 'd'
    }
];