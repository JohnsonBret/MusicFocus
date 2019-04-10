var DateTime = luxon.DateTime;

var currentWeekLesson = DateTime.local().weekNumber;
var currentWeekRehearsal = DateTime.local().weekNumber;

var lessonLocationData;
var rehearsalLocationData;


const getScheduleWeek = async (weekNum, location) => {

    console.log("Getting the weekly schedule");
        
    const rawResponse = await fetch(`/schedule/week/${weekNum}/${location}`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
    });
    const content = await rawResponse.json();

    console.log(`Get schedule week status ${rawResponse.status}`);

    if(rawResponse.status == 200)
    {
        console.log(content);
        
        populateWeekSchedule(content, location);
    }
};

const populateWeekSchedule = (weekSchedule, location) => {

    //Duplicate break out into function
    if(location == 1)
    {
        var weekNode = document.getElementById("lessonScheduleRoot").children[0];
    }
    else if(location == 2)
    {
        var weekNode = document.getElementById("rehearsalScheduleRoot").children[0];
    }
    
    weekSchedule.pickedBookings.map((current) =>{
        var fromUTCTime = DateTime.fromISO(current.from);
        var fromLATime = fromUTCTime.setZone('America/Los_Angeles');
        var displayFromTime = fromLATime.toLocaleString(DateTime.TIME_SIMPLE);

        var toUTCTime = DateTime.fromISO(current.to);
        var toLATime = toUTCTime.setZone('America/Los_Angeles');
        var displayToTime = toLATime.toLocaleString(DateTime.TIME_SIMPLE);

        var timeDisplayStr = `${displayFromTime} - ${displayToTime}`;

        var div = document.createElement("div");
        var bookeeP = document.createElement("p");
        var timeP = document.createElement("p");
       

        bookeeP.innerHTML = current.bookeeName;
        timeP.innerHTML = timeDisplayStr;

        div.classList.add("booking");

        div.appendChild(bookeeP);
        div.appendChild(timeP);

        weekNode.children[fromLATime.weekday - 1].appendChild(div);

        return current;
    });

    console.log(weekSchedule);

};

const showScheduleSubTitle = (location) =>{
    
    console.log(`showScheduleSubTitle-> location ${location}`);

    if(location === "1")
    {
        var subTitle = document.getElementById("lessonScheduleSubTitle");
        var displayWeek = DateTime.fromObject({weekNumber: currentWeekLesson});
    }
    else if(location === "2")
    {
        var subTitle = document.getElementById("rehearsalScheduleSubTitle");
        var displayWeek = DateTime.fromObject({weekNumber: currentWeekRehearsal});
    }

    var startWeek = displayWeek.setZone('America/Los_Angeles').startOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    var endWeek = displayWeek.setZone('America/Los_Angeles').endOf("week").toLocaleString({ month: 'long', day: 'numeric' });

    // var startWeek = DateTime.local().setZone('America/Los_Angeles').startOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    // var endWeek = DateTime.local().setZone('America/Los_Angeles').endOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    var displaySubTitle = `${startWeek} - ${endWeek}`;
    subTitle.innerHTML  = displaySubTitle;
}

const clearWeekSchedule = (location)=>{

    //Duplicate break out into function
    if(location === "1")
    {
        var weekNode = document.getElementById("lessonScheduleRoot").children[0];
    }
    else if(location === "2")
    {
        var weekNode = document.getElementById("rehearsalScheduleRoot").children[0];
    }

    for (var i = 0; i < weekNode.children.length; i++) {

        var currentNode = weekNode.children[i];
        
        while (currentNode.childNodes.length > 2) {
            currentNode.removeChild(currentNode.lastChild);
        }

    }

}

const setupWeekChangeIcons = () =>{

    if(document.getElementById("lessonScheduleRoot") !== null)
    {
        var leftArrow = document.getElementById("prevWeekIcon");
        var rightArrow = document.getElementById("nextWeekIcon");

        leftArrow.addEventListener("click", ()=>{
            currentWeekLesson > 1 ? currentWeekLesson-- : currentWeekLesson;
            console.log(`Current Week Lesson ${currentWeekLesson}`);
            clearWeekSchedule(lessonLocationData);
            displayCurrentWeekSchedule(lessonLocationData);
        });
        rightArrow.addEventListener("click", ()=>{
            currentWeekLesson < 53 ? currentWeekLesson++ : currentWeekLesson;
            console.log(`Current Week ${currentWeekLesson}`);
            clearWeekSchedule(lessonLocationData);
            displayCurrentWeekSchedule(lessonLocationData);
        });
    }

    if(document.getElementById("rehearsalScheduleRoot") !== null)
    {

        var leftArrow = document.getElementById("prevWeekIconRehearsal");
        var rightArrow = document.getElementById("nextWeekIconRehearsal");

        leftArrow.addEventListener("click", ()=>{
            currentWeekRehearsal > 1 ? currentWeekRehearsal-- : currentWeekRehearsal;
            console.log(`Current Week ${currentWeekRehearsal}`);
            clearWeekSchedule(rehearsalLocationData);
            displayCurrentWeekSchedule(rehearsalLocationData);
        });
        rightArrow.addEventListener("click", ()=>{
            currentWeekRehearsal < 53 ? currentWeekRehearsal++ : currentWeekRehearsal;
            console.log(`Current Week ${currentWeekRehearsal}`);
            clearWeekSchedule(rehearsalLocationData);
            displayCurrentWeekSchedule(rehearsalLocationData);
        });
    }
}

const setupRefreshButton = () =>{

    if(document.getElementById("lessonScheduleRoot") !== null)
    {
        var refreshBtn = document.getElementById("refreshButton");
        refreshBtn.addEventListener("click", ()=>{
            clearWeekSchedule(lessonLocationData);
            displayCurrentWeekSchedule(lessonLocationData);
        });
    }

    if(document.getElementById("rehearsalScheduleRoot") !== null)
    {
        var refreshBtn = document.getElementById("refreshButtonRehearsal");
        refreshBtn.addEventListener("click", ()=>{
            clearWeekSchedule(rehearsalLocationData);
            displayCurrentWeekSchedule(rehearsalLocationData);
        });
    }

    
}

const displayCurrentWeekSchedule = (location) =>{

    if(document.getElementById("lessonScheduleRoot") !== null  && location == lessonLocationData)
    {
        getScheduleWeek(currentWeekLesson, location);
        showScheduleSubTitle(location);
    }

    if(document.getElementById("rehearsalScheduleRoot") !== null && location == rehearsalLocationData)
    {
        getScheduleWeek(currentWeekRehearsal, location);
        showScheduleSubTitle(location);
    }
};

function onDashboardLoaded()
{
    if(document.getElementById("lessonScheduleRoot") !== null)
    {
        lessonLocationData = document.getElementById("lessonScheduleRoot").getAttribute("data-schedule-type");
        displayCurrentWeekSchedule(lessonLocationData);
    }

    if(document.getElementById("rehearsalScheduleRoot") !== null)
    {
        rehearsalLocationData = document.getElementById("rehearsalScheduleRoot").getAttribute("data-schedule-type");
        displayCurrentWeekSchedule(rehearsalLocationData);
    }
    
    console.log(`Lesson Location Data - ${lessonLocationData} Rehearsal Location Data - ${rehearsalLocationData}`);


    setupWeekChangeIcons();
    setupRefreshButton();
}

window.onload = onDashboardLoaded();