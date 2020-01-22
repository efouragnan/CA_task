function TimeLine(toShow, toHide, toRun, name) {
    this.toShow = toShow;
    this.toHide = toHide;
    this.toRun = toRun;
    this.name = name;
    this.toStart;
    this.toEnd;
}

var exptTimeLine = [];

//INTRO
var infoSheet = new TimeLine(["participantInfoSheet", "exitNow"], ["goBackButton", "consentForm", "returnToInfoPage", "startN"], [checkBoxes], "infoSheet");
var consent = new TimeLine(["returnToInfoPage", "exitNow", "consentForm"],["participantInfoSheet"], [checkBoxes], "consent");
var subjectInfo = new TimeLine(["surveyContainer", "exitNow"], ["goBackButton", "consentForm", "returnToInfoPage", "next-button"], [introQuestions, runQuestionnaires], "subjectInfo");

//TRAINING AND PRACTICE ROUNDS
var rockSlideInstr1 = new TimeLine([(!pilotTest) ? "instructionsDiv" : "PilotInstructionsDiv", "exitNow"],["surveyContainer", "next-button"],[setupInstructions,showInstructions], "rockSlideInstr1");
var rockSlidePractice1 = new TimeLine(["exitNow"], ["instrButtonsDiv"], [pilotTestRatings], "rockSlidePractice1");

//QUESTIONNAIRES
var questionnaireInstr = new TimeLine(["instrQuestionnaires", "next-button", "exitNow"], [], [], "questionnaireInstr");
var torontoAlexithymia = new TimeLine(["surveyContainer", "exitNow"], [ "next-button", "instrQuestionnaires"], [torontoAlexithymiaScale, runQuestionnaires], "torontoAlexithymia");
var barratt = new TimeLine(["surveyContainer", "exitNow"], ["next-button"], [barrattImpulsivenessScale, runQuestionnaires], "barrattScale");
var liebowitzSocialAnxiety = new TimeLine(["surveyContainer", "exitNow"], [], [liebowitzSocialAnxietyScale, runQuestionnaires], "liebowitzSocialAnxiety");
var endExperimentDay1 = new TimeLine(["endExperiment"], ["inviteForFollowUp", "inviteForFollowUp2"], [endExp], "endExperimentday1");    

exptTimeLine.push(infoSheet);
exptTimeLine.push(consent);
exptTimeLine.push(subjectInfo);
exptTimeLine.push(rockSlideInstr1);
exptTimeLine.push(rockSlidePractice1);
exptTimeLine.push(questionnaireInstr);
exptTimeLine.push(barratt);
exptTimeLine.push(torontoAlexithymia);
exptTimeLine.push(liebowitzSocialAnxiety);
exptTimeLine.push(endExperimentDay1);

//get canvas elements
var enterButton = document.getElementById("enterButton"),
    pilotRatingInstr = document.getElementById("pilotRatingElements");

//create and size canvas for ratings
var ratingCanvas = document.getElementById("ratingCanvas"),
    ctxRate = ratingCanvas.getContext("2d");
ratingCanvas.style.bottom = 100 * (((wh - ratingCanvas.height) / 2) / wh) + '%';
ratingCanvas.style.left = 100 * (((ww - ratingCanvas.width) / 2) / ww) + '%';