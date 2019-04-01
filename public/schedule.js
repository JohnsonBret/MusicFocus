var DateTime = luxon.DateTime;


const getScheduleWeek = async () => {

    console.log("Getting the weekly schedule");
        
    const rawResponse = await fetch('/schedule/week', {
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
    console.log("showScheduleSubTitle")
    var subTitle = document.getElementById("scheduleSubTitle");
    var startWeek = DateTime.local().setZone('America/Los_Angeles').startOf("week").toLocaleString(DateTime.DATE_FULL);
    var endWeek = DateTime.local().setZone('America/Los_Angeles').endOf("week").toLocaleString(DateTime.DATE_FULL);
    var displaySubTitle = `${startWeek} - ${endWeek}`;
    subTitle.innerHTML  = displaySubTitle;
}

function onDashboardLoaded()
{
    showScheduleSubTitle();
    getScheduleWeek();
    
}

window.onload = onDashboardLoaded();