var runThrough = -1;
var d = new Date();
var feedbackImg = new Image(); 
var leadImages = [];
var feedbackImage = [];

function preloader() {
    // counter
    var ex_obj = 0;

    // create object
    imageObj = new Image();

    // preload images
    for (im = 0; im < 10; im++) {
        feedbackImage[im] = new Image();
        feedbackImage[im].src = '/CA_ratingTask/pictures/feedback' + (im + 1) + '.png';
    }
    feedbackImg.src = '/CA_ratingTask/pictures/empty.png';
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Experiment functions
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Start
window.onload = function () {
    $("startN").show();
    $("#next-button").hide();
    $("startButton").show();
    if (settings.fullscreen) {
        $("#yesFullScreen").show();
    }
    preloader();//preload background images
};

function loadStimuli(mapID) {
    //  Load subject-specific stimuli
    var xhttp;
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        // readyState === 4: response from server
        if (this.readyState === 4 && this.status === 200) {
            data.stimuli[mapID] = this.responseText.split(' ').map(Number);
            if (data.stimuli[mapID].length > settings.nobj) {
                data.stimuli[mapID].pop();
                preloader();
            }
        }
    };
}

function startExperiment() {
    data.exptDate.startDate = new Date;
    if (settings.fullscreen) {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };
    data.screenSize = screen.height;
    data.browserWindowSize = window.innerHeight;
    proceedInExpt();
}

function proceedInExpt() {
//runThrough is the trial counter. record time each section started and finished
    if (runThrough !== -1) {
        //add a time stamp to end the previous section
        exptTimeLine[runThrough].toEnd = new Date(); //.getTime();

        //add completed section into data structure in a way that doesn't overwrite previous sections (e.g. if participant has completed a section twice)
        data.exptTimeLine.push(JSON.parse(JSON.stringify(exptTimeLine[runThrough])));
        
        //hide all divs from current section before moving on
        for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
        $("#" + exptTimeLine[runThrough].toShow[c]).hide();
    }
    }
    //move onto next item in timeline and create start time stamp
    runThrough++;
    exptTimeLine[runThrough].toStart = new Date(); // .getTime(); 

// Switch all the screen items that we need on
    for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
        $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();
    }
// Switch all the items we don't need off    
    for (var c = 0; c < exptTimeLine[runThrough].toHide.length; c++) {
        $("#" + exptTimeLine[runThrough].toHide[c]).hide();
    }
// Run the different parts of the experiment    
    for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {
        exptTimeLine[runThrough].toRun[c]();
    }
}

function endExp() {
    data.exptDate.endDate = new Date.getTime();
    data.experimentDuration = data.exptDate.endDate - data.exptDate.startDate;
    saveData();
    data.exptTimeLine = exptTimeLine;
}

//On some screens it is necessary to check boxes before proceeding. This function checks whether the boxes are checked
function checkBoxes() {         
    if (exptTimeLine[runThrough].name === "infoSheet") {                        //for PIS, don't proceed without checking the box
        var checkBox = document.getElementById("infoSheetCheckbox");
        var nextButton = document.getElementById("next-button");
        nextButton.style.display = (checkBox.checked) ? "block" : "none";
    } else if (exptTimeLine[runThrough].name === "consent") {                //for consent screen, don't proceed without checking every box
        if ($('.consentBoxes:checked').length === $('.consentBoxes').length) {data.consent=1;} else {data.consent = 0;} //if all boxes are checked, log consent as "true" and if not set to "false"
        document.getElementById("next-button").style.display = (data.consent===1) ? "block" : "none";   //if consent is set to "true", show the "next"button so participant can proceed
    }
}

//if participant is in consent section, this allows them to return to the info page 
function returnToInfoPage() {
    runThrough--;
    i = -1;
    exptTimeLine[runThrough].toStart = new Date();//.getTime();

// Switch all the screen items that we need on
    for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
        $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();
    }
// Switch all the items we don't need off    
    for (var c = 0; c < exptTimeLine[runThrough].toHide.length; c++) {
        $("#" + exptTimeLine[runThrough].toHide[c]).hide();
    }
// Run the different parts of the experiment    
    for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {
        exptTimeLine[runThrough].toRun[c]();
    }
}

// Different codes for FINISHING THE EXPERIMENT
// Save the data to JATOS
function saveData() {
    data.exptDate.endDate = new Date;
    data.exptTimeLine = exptTimeLine;
    var resultJson = JSON.stringify(data);
    jatos.onLoad(function () {
        jatos.submitResultData(resultJson, jatos.endStudyAjax);
//        console.log('data submitted');
    });
    window.location.replace("https://www.prolific.ac/submissions/complete?cc=R5VOPY5Q");
}

// What happens if participants click button to exit the study early: ask them whether they really want to quit and if so whether we can keep the data
function exitStudyNow() {
    gameCanvas.style.display = "none";
    document.getElementById("styleSheetInUse").href = "/CA_ratingTask/CA_ratingStyles.css";
    document.getElementById("styleSheet2").href = "/CA_ratingTask/jquery-ui.css"; //https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css"; //restore original css 
    for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
        $("#" + exptTimeLine[runThrough].toShow[c]).hide().children().hide().children().hide().children().hide();
    }
    $("#submitOrQuit").show();
    $("#commentBox").show();
    $("#psychHelp").show();
}

//If participant clicks button to leave the study early, this button can take them back to the section they were just in
function returnToStudy() {
    for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {  //re-show all items from the experiment section we're still in (the "leaving the study early" page does not move to a different timeline section)
        $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();   
    }
    for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {   //re-run all functions that need to be run
        exptTimeLine[runThrough].toRun[c]();
    }
    $("#submitOrQuit").hide();
    $("#psychHelp").hide();
    $("#commentBox").hide();
}

// if participants allow us to keep their data even though they leave early, let's store the timeline
function submitDataSoFar() {
    data.exptDate.endDate = new Date;
    data.storeBehav[tSet.taskCounter]={};
    data.storeBehav[tSet.taskCounter].type = JSON.parse(JSON.stringify(tSet.taskType)); // we need to use this syntax because objects don't store variables, but references to variables, and so we have to make a copy of the variable to actually have it stored here
    data.storeBehav[tSet.taskCounter].behavior = JSON.parse(JSON.stringify(tSet.behavior));
    data.exptTimeLine = exptTimeLine;
    var resultJson = JSON.stringify(data);
    jatos.onLoad(function () {
        jatos.submitResultData(resultJson, jatos.endStudyAjax);
    });
   window.location.replace("https://www.prolific.ac/submissions/complete?cc=R5VOPY5Q"); //redirect back to prolific
}

//If a participant leaves the study early and does NOT want to submit their data, we just store their prolific ID number and the timing
function quitWithoutSaving() {
    data.exptDate.endDate = new Date; //log what time participant exits experiment
    var prolificid = (data.questions.length === 0) ? "undefined" : (data.questions[1]["introQuestions"]["Prolific-ID"]); //if they've not completed the participant info section, their ID will be undefined
    var resultJson = JSON.stringify({ProlificID: prolificid, StartTime: data.exptDate.startDate, EndTime: data.exptDate.endDate, comments: data.comments}); //save only their prolific ID, add beginning and end times for experiment
    jatos.onLoad(function () {
        jatos.submitResultData(resultJson, jatos.endStudyAjax);
    });
    window.location.replace("https://www.prolific.ac/submissions/complete?cc=R5VOPY5Q"); //redirect back to prolific so they can collect ££ earned so far
}

//if a participant enters a comment and presses submit, log it to the data structure
function submitComments(){
    if ($("#comments").val()!== "") {
        data.comments = $("#commentid")[0].value;
        document.getElementById("submitComments").style.background = "#c1c1c1";
    }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// INSTRUCTIONS
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// store all the different texts and pictures in arrays
function setupInstructions() {
    // Get a list of the instructions
    if (!pilotTest) {
        settings.instr.pics = document.querySelectorAll(".instrPicsClass");
        settings.instr.texts = document.querySelectorAll(".instrTextsClass");
    } else {
        settings.instr.pics = document.querySelectorAll(".PilotInstrPicsClass");
        settings.instr.texts = document.querySelectorAll(".PilotInstrTextsClass");
    }
    document.getElementById("instrButtonsDiv").style.display = "block";
}

// refresh the instruction texts and pictures when buttons are clicked
function showInstructions() {
//    console.log("settings.instr.pics[settings.instr.counter.id]" + settings.instr.pics[settings.instr.counter].id);
    // update the picture and the text
    if (!pilotTest) { $('.instrTextsClass').hide();} else {$('.PilotInstrTextsClass').hide();}
    if (!pilotTest) { $('.instrPicsClass').hide();} else {$('.PilotInstrPicsClass').hide();}
    $('#' + settings.instr.pics[settings.instr.counter].id).show();
    $('#' + settings.instr.texts[settings.instr.counter].id).show();

//console.log("start: " + settings.instr.start[exptTimeLine[runThrough].name] + ", stop: " + settings.instr.stop[exptTimeLine[runThrough].name] + ", current: " + settings.instr.counter);
    // update the buttons
    if (settings.instr.counter === settings.instr.start[exptTimeLine[runThrough].name] && (settings.instr.counter != settings.instr.stop[exptTimeLine[runThrough].name])) { //assign instruction parameters if we're on first instruction page
        $('#backwInstrButton').prop('disabled', true);
        $('#forwInstrButton').show();
        $('#forwInstrButton').prop('disabled', false);
        $('#startTrainingButton').hide();
    } else if (settings.instr.counter === settings.instr.stop[exptTimeLine[runThrough].name] && (settings.instr.counter != settings.instr.start[exptTimeLine[runThrough].name])) {     //last instruction page
        $('#backwInstrButton').prop('disabled', false);
        $('#forwInstrButton').hide();
        $('#startTrainingButton').show();
    } else if (settings.instr.stop[exptTimeLine[runThrough].name] === settings.instr.start[exptTimeLine[runThrough].name]) {    //if the start and stop slides are the same
        $('#backwInstrButton').hide();
        $('#forwInstrButton').hide();
        $('#startTrainingButton').show();
    } else {    
        $('#backwInstrButton').prop('disabled', false);
        $('#forwInstrButton').show();
        $('#forwInstrButton').prop('disabled', false);
        $('#startTrainingButton').hide();
    }
}

// what to do when buttons are clicked
function forwardInstr() {
    settings.instr.counter++;
    showInstructions();
}

function backwardInstr(){
    settings.instr.counter --;
    showInstructions();
}

function startTraining(){
    settings.instr.counter++;
    proceedInExpt();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SLINGSHOT TASK
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var trialNumber = 0,
        feedbackpic = new Image(),
        ratingpic = new Image(),
        trialPreview = new Image(),
        blueTick = new Image(),
        ww = window.screen.width,
        wh = window.screen.height,
        trialType =1,
        selfRating,
        setTickLimit = false,
        currTickPlacement = [715, 545]; 

//After participants play the game in each trial they rate how well they think they did 
function pilotTestRatings() {
    if (!settings.repeatInstructions) {  //don't show rating screen for practicing the slingshot task
        //reformat screen and variables, start timer
    
    ratingCanvas.style.display = "block";
    setTickLimit = false;
    currTickPlacement = [715, 545]; 
    
    //Show rating bar on canvas
    ratingpic.src = '/CA_ratingTask/pictures/feedback10.png';
    ratingpic.onload = function () {
        ctxRate.drawImage(ratingpic,
                ratingCanvas.width / 2 - ratingpic.width / 2, 
                (ratingCanvas.height / 2 - ratingpic.height / 2)-30);    
    };

    //Show blue tick mark on canvas
    blueTick.src ="/CA_ratingTask/pictures/blue_tick.png";
    blueTick.onload = function() {
        ctxRate.drawImage(blueTick, currTickPlacement[0], currTickPlacement[1]);
    };

    //Show instructions as HTML object  
    pilotRatingInstr.style.display = "block";
    pilotRatingInstr.style.left = ratingCanvas.offsetLeft + 373 + "px"; pilotRatingInstr.style.top = ratingCanvas.offsetTop + 530 + "px";
    window.addEventListener('resize', function () { //adjust the position whenever the window is resized
        pilotRatingInstr.style.left = ratingCanvas.offsetLeft + 373 + "px"; pilotRatingInstr.style.top = ratingCanvas.offsetTop + 530 + "px";
    });

    //Listen for a click on the blue tick mark
    var  isDown = false,
            clickMouseYPos,
            currTickCoords = [719, 810, 741, 688]; //x-low, x-high, y-low, y-high
   
    document.addEventListener('mousedown', function (e) {
        isDown = true;
        clickMouseYPos = e.clientY - ratingCanvas.offsetTop;
    });

    document.addEventListener('mouseup', function () {
        isDown = false;
    });

    //Set rules for moving the tick mark so that once it's on the scale it can't move off the scale again
    document.addEventListener('mousemove', function (event) {
         var currX = event.clientX - ratingCanvas.offsetLeft,   //can't add event listener to individual objects on canvas, only to canvas as a whole
                currY = (event.clientY - ratingCanvas.offsetTop) - 30,  //so this converts the mouse location into a canvas location
                tickLimit = (setTickLimit) ? 472 : 545; //583 : 700
                
        event.preventDefault();
        if (isDown) {
            if (currY > 8 && (currY < tickLimit) && (currX < currTickCoords[1]) && (currX > currTickCoords[0])) { //only move the element if it is not outside the range defined by the rating bar
                currTickPlacement[1] = currY;
                //Clear canvas (must be redrawn with tick in new location)
                ctxRate.clearRect(0, 0, ratingCanvas.width, ratingCanvas.height);

                //Redraw rating bar on canvas
                ratingpic.src = '/CA_ratingTask/pictures/feedback10.png';
                    ctxRate.drawImage(ratingpic,
                            ratingCanvas.width / 2 - ratingpic.width / 2, //400
                            (ratingCanvas.height / 2 - ratingpic.height / 2) - 30);    //300

                //Redraw blue tick mark on canvas
                blueTick.src = "/CA_ratingTask/pictures/blue_tick.png";
                    ctxRate.drawImage(blueTick, currTickPlacement[0], currTickPlacement[1]);

                //Add enter button and set up a listening event so it responds when clicked 
                ctxRate.drawImage(enterButton, 912, 260); // orig 912, 375
                ratingCanvas.addEventListener('click', on_canvas_click_Pilot, false);

                if (parseInt(currY) < 472) {
                    setTickLimit = true;    //determines whether tick mark is moving from initial position
                } 
                }
            }
        }, true);

        //Add enter button and set up a listening event so it responds when clicked 
        ctxRate.drawImage(enterButton, 912, 260); // orig 912, 375
        ratingCanvas.addEventListener('click', on_canvas_click_Pilot(), false);
    } else {
        stopEngine(engine);
        startstopbutton.src = '/CA_ratingTask/pictures/start_trial_button.png';
        currState = 0;
        gameCanvas.style.display = "none";
        if (trialNumber < settings.noOfTrials[exptTimeLine[runThrough].name] && (!settings.repeatInstructions)) {     //if there are more trials    
            ++trialNumber;
            initiateTrial();
        } else {        //if we've hit max number of trials
            trialNumber = 0;
            proceedInExpt();
        }
    }
}

//PILOT TESTING: check if the Enter button has been clicked and if a rating has been made
function on_canvas_click_Pilot(ev) { 
    if (setTickLimit) {
        var x = ev.clientX - ratingCanvas.offsetLeft,   //can't add event listener to individual objects on canvas, only to canvas as a whole
            y = ev.clientY - ratingCanvas.offsetTop;  //so this converts the click location into a canvas location
        if (1026.88 > x && (934 < x)) {                          //then define the boundaries of buttons on the canvas. x bounds must be 92.88 pixels wide
            if (912 < x && (1051 > x)) { //x bounds must be 139 pixels wide
                
                //ENTER BUTTON CLICKED
                if (260 < y && (449.88 > y)) {
                    ratingEnd = new Date().getTime();
                    ratingCanvas.style.display = "none"; 
                    ctxRate.clearRect(0, 0, ratingCanvas.width, ratingCanvas.height);
                
                //Store data
                if (exptTimeLine[runThrough].name === "game") {data.behavior[trialNumber] = {
                        trialType: trialType, 
                        selfRating: parseInt(currTickPlacement[1]), 
                    };
                };  

                //move forward
                    pilotRatingInstr.style.display = "none";
                    ratingCanvas.style.display = "none";  //remove canvases so other elements (e.g. questionnaires) will be formatted properly
                    if (trialNumber < settings.noOfTrials[exptTimeLine[runThrough].name] && (!settings.repeatInstructions)) {     //if there are more trials
                        ++trialNumber;
                        pilotTestRatings();
                    } else {        //if we've hit max number of trials
                        trialNumber = 0;
                        proceedInExpt();
                    }
                }
            }
        }
    }
}