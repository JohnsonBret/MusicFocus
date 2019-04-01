var DateTime = luxon.DateTime;

var currentWeek = DateTime.local().weekNumber;


const getScheduleWeek = async (weekNum) => {

    console.log("Getting the weekly schedule");
        
    const rawResponse = await fetch(`/schedule/week/${weekNum}`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
    });
    const content = await rawResponse.json()

    console.log(`Get schedule week status ${rawResponse.status}`);

    if(rawResponse.status == 200)
    {
        console.log(content);
        populateWeekSchedule(content);
    }
};

const populateWeekSchedule = (weekSchedule) => {

    var weekNode = document.getElementById("scheduleRoot").children[0];
    

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

        div.appendChild(bookeeP);
        div.appendChild(timeP);

        console.log(fromLATime.weekday)

        weekNode.children[fromLATime.weekday - 1].appendChild(div);

        return current;
    });

    console.log(weekSchedule);

};

const showScheduleSubTitle = () =>{
    var subTitle = document.getElementById("scheduleSubTitle");

    var displayWeek = DateTime.fromObject({weekNumber: currentWeek});
    var startWeek = displayWeek.setZone('America/Los_Angeles').startOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    var endWeek = displayWeek.setZone('America/Los_Angeles').endOf("week").toLocaleString({ month: 'long', day: 'numeric' });

    // var startWeek = DateTime.local().setZone('America/Los_Angeles').startOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    // var endWeek = DateTime.local().setZone('America/Los_Angeles').endOf("week").toLocaleString({ month: 'long', day: 'numeric' });
    var displaySubTitle = `${startWeek} - ${endWeek}`;
    subTitle.innerHTML  = displaySubTitle;
}

const clearWeekSchedule = ()=>{
    var weekNode = document.getElementById("scheduleRoot").children[0];

    for (var i = 0; i < weekNode.children.length; i++) {

        var currentNode = weekNode.children[i];
        
        while (currentNode.childNodes.length > 2) {
            currentNode.removeChild(currentNode.lastChild);
        }

    }

}

const setupWeekChangeIcons = () =>{
    var leftArrow = document.getElementById("prevWeekIcon");
    var rightArrow = document.getElementById("nextWeekIcon");

    leftArrow.addEventListener("click", ()=>{
        currentWeek > 1 ? currentWeek-- : currentWeek;
        console.log(`Current Week ${currentWeek}`);
        clearWeekSchedule();
        displayCurrentWeekSchedule();
    });
    rightArrow.addEventListener("click", ()=>{
        currentWeek < 53 ? currentWeek++ : currentWeek;
        console.log(`Current Week ${currentWeek}`);
        clearWeekSchedule();
        displayCurrentWeekSchedule();
    });
}

const setupRefreshButton = () =>{
    var refreshBtn = document.getElementById("refreshButton");
    refreshBtn.addEventListener("click", ()=>{
        clearWeekSchedule();
        displayCurrentWeekSchedule();
    });
}

const displayCurrentWeekSchedule = () =>{
    getScheduleWeek(currentWeek);
    showScheduleSubTitle();
};

function onDashboardLoaded()
{
    displayCurrentWeekSchedule();
    setupWeekChangeIcons();
    setupRefreshButton();
    
}

window.onload = onDashboardLoaded();