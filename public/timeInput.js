const onDateChanged = (event) =>{
    var changedDateId = event.target.getAttribute("id");
    var changedDate = event.target;
    

    if(changedDateId == "fromDate")
    {
        var toDate = document.getElementById("toDate");
        if(toDate.value == "")
        {
            toDate.value = changedDate.value;
        }
    }
    else
    {
        var fromDate = document.getElementById("fromDate");
        if(fromDate.value == "")
        {
            fromDate.value = changedDate.value;
        }
    }
}

function changeHour(event)
{
    
    var clickedHour = event.target.parentElement.getAttribute("id");
    // console.log(clickedHour, event.target.innerHTML)
    var hour;
    if(clickedHour == "fromHour")
    {
        hour = document.getElementById("displayFromHour");
    }
    else
    {
        hour = document.getElementById("displayToHour");
    }
    
    hour.innerHTML = event.target.innerHTML;
    // console.log(hour.innerHTML, event.target.innerHTML);
}

function changeMinute(event)
{
    var clickedMinute = event.target.parentElement.getAttribute("id");
    // console.log(clickedMinute, event.target.innerHTML);

    var minute;

    if(clickedMinute == "fromMinute")
    {
        minute = document.getElementById("displayFromMinute");
    }
    else
    {
        minute = document.getElementById("displayToMinute");
    }

    minute.innerHTML = event.target.innerHTML;
    // console.log(minute.innerHTML, event.target.innerHTML);
}

function changeAmPm(event)
{
    var clickedAmPm = event.target.parentElement.getAttribute("id");

    var AmPm;
    if(clickedAmPm == "fromAmPm")
    {
        AmPm = document.getElementById("displayFromAmPm");
    }
    else
    {
        AmPm = document.getElementById("displayToAmPm");
    }

    AmPm.innerHTML = event.target.innerHTML;
}

function changeLocation(event)
{
    var clickedLocation = event.target.parentElement.getAttribute("id");

    var location = document.getElementById("displayLocation");
    location.value = event.target.getAttribute("value");

    if(location.value == 2)
    {
        var dropButtons = document.getElementsByClassName("dropbtn");
        for(let i = 0; i < dropButtons.length; i++)
        {
            dropButtons[i].style = "background-color: var(--orange-color)";
        }

        var labels = document.getElementsByClassName("scheduleLabel");
        for(let i = 0; i < labels.length; i++)
        {
            if(labels[i].parentNode.classList.contains("custom-select") == false)
            {
            labels[i].style = "background-color: var(--orange-color)";
            }
        }

        var dates = document.getElementsByClassName("date");
        for(let i = 0; i < dates.length; i++)
        {
            dates[i].style = "background-color: var(--orange-color)";
        }
    }
    else{
        var dropButtons = document.getElementsByClassName("dropbtn");
        for(let i = 0; i < dropButtons.length; i++)
        {
            dropButtons[i].style = "background-color: var(--blue-color)";
        }

        var labels = document.getElementsByClassName("scheduleLabel");
        for(let i = 0; i < labels.length; i++)
        {
            if(labels[i].parentNode.classList.contains("custom-select") == false)
            {
            labels[i].style = "background-color: var(--blue-color)";
            }
        }

        var dates = document.getElementsByClassName("date");
        for(let i = 0; i < dates.length; i++)
        {
            dates[i].style = "background-color: var(--blue-color)";
        }
    }

    location.innerHTML = event.target.innerHTML;
}

const bookTime = () =>{
    var fromDate = document.getElementById("fromDate").value ;
    var fromHour = document.getElementById("displayFromHour").innerHTML;
    var fromMinute = document.getElementById("displayFromMinute").innerHTML;
    var fromAmPm = document.getElementById("displayFromAmPm").innerHTML;

    var toDate = document.getElementById("toDate").value;
    var toHour = document.getElementById("displayToHour").innerHTML;
    var toMinute = document.getElementById("displayToMinute").innerHTML;
    var toAmPm = document.getElementById("displayToAmPm").innerHTML;

    var fromDateTime = createDateTime(fromDate, fromHour, fromMinute, fromAmPm);
    var toDateTime = createDateTime(toDate, toHour, toMinute, toAmPm);



    if(validateDates(fromDateTime, toDateTime) == false)
    {
        console.log("should i be returning false?");
        return false;
    }

    var clientList = document.getElementById("bookingClientList");
    var bookee = clientList.value;
    var viewName = clientList.options[clientList.selectedIndex].text;

    var location = document.getElementById("displayLocation").value;
    

    console.log(`fromDate ${fromDateTime.toLocaleString()}, fromTime ${toDateTime.toLocaleString()}
    bookee ${bookee} - location ${location}`);

    postBooking(location, fromDateTime, toDateTime, bookee, viewName);
}

const createDateTime = (date, hour, minute, ampm) => {
    var year ;
    var month;
    var day;
    var hours;
    var minutes;
    var seconds = 0;
    var milliseconds = 0;

    year = date.substring(0, date.indexOf("-"));
    month = date.substring(date.indexOf("-") + 1,date.lastIndexOf("-"));
    month = parseInt(month) - 1;
    day = date.substring(date.lastIndexOf("-") + 1,date.length);
    minutes = minute;

    if(hour == 12)
    {
        if(ampm == "AM")
        {
            hours = 0;
        }
        else
        {
            hours = 12;
        }
    }
    else
    {
        if(ampm == "AM")
        {
            hours = hour;
        }
        else
        {
            hours = parseInt(hour) + 12;
        }
    }
    var createdDate = new Date(year, month, day, hours, minutes,seconds, milliseconds);

    // console.log(`year ${year}, month ${month}, day ${day}, hours ${hours}, minutes ${minutes}, seconds ${seconds}, milli ${milliseconds}`);
    console.log(createdDate.toLocaleDateString(), createdDate.toLocaleTimeString());

    return createdDate;
}

const validateDates = (from, to) => {

    if(dayIsNaN(from.getDate()))
    {
        showScheduleMessage("Did you pick a Start day?");
        return false;
    }

    if(dayIsNaN(to.getDate()))
    {
        showScheduleMessage("Did you pick a End day?");
        return false;
    }

    if(hourIsNaN(from.getHours()))
    {
        showScheduleMessage("Did you pick a Start hour?");
        return false;
    }

    if(hourIsNaN(to.getHours()))
    {
        showScheduleMessage("Did you pick a End hour?");
        return false;
    }

    if(!validateYear(from.getFullYear()))
    {
        showScheduleMessage("Start year is not Valid - You can only book up to 1 year in advance");
        return false;
    }
    if(!validateYear(to.getFullYear()))
    {
        showScheduleMessage("End year is not Valid - You can only book up to 1 year in advance");
        return false;
    }
    if(validateDay(from.getDate()))
    {
        showScheduleMessage("Start Day is not Valid");
        return false;
    }
    if(validateDay(to.getDate()))
    {
        showScheduleMessage("End Day is not Valid");
        return false;
    }
    if(validateHour(from.getHours()))
    {
        showScheduleMessage("Start Hour is not Valid");
        return false;
    }
    if(validateHour(to.getHours()))
    {
        showScheduleMessage("End Hour is not Valid");
        return false;
    }
    if(validateMinute(from.getMinutes()))
    {
        showScheduleMessage("Start Minutes are not Valid");
        return false;
    }
    if(validateMinute(to.getMinutes()))
    {
        showScheduleMessage("End Minutes are not Valid");
        return false;
    }

    console.log(` is time before ${validateFromIsBeforeToTime(from , to)}
    hours from: ${from.getHours()} hours to: ${to.getHours()}`);

    if(!validateFromIsBeforeToTime(from , to))
    {
        showScheduleMessage("Start booking time must be BEFORE End booking time")
        return false;
    }

    if(!validateMinimumTimeBooked(from, to))
    {
        showScheduleMessage("You must book at least minimum Time");
        return false;
    }
}

const dayIsNaN = (day) =>{
    console.log(`Day is${day}`);
    if(isNaN(day))
    {
        console.log(`Day is NaN`);
        
        return true;
    }
}

const hourIsNaN = (hour) =>{
    if(isNaN(hour))
    {
        console.log(`Hour is NaN`);
        return true;
    }
}

const minuteIsNaN = (minute)=>{
    if(isNaN(minute))
    {
        return true;
    }
}

const validateYear = (year)=>{
    //console.log(`Validate Year ${year == new Date().getFullYear() || year == new Date().getFullYear() + 1}`);
    return year == new Date().getFullYear() || year == new Date().getFullYear() + 1;
}

const validateDay = (day)=>{
    console.log(`Validate day ${day}`);
    return day < 1 || day > 31;
}

const validateHour = (hour) =>{
   
    return hour < 0 || hour > 23
}

const validateMinute = (minute)=>{

    return minute < 0 || minute > 59;
}

const validateFromIsBeforeToTime = (from, to)=>{
    return isDateTimeBefore(from, to);
}

const isTimeBefore = (first, second) => {
    if (first.getHours() < second.getHours()) 
    {
        return true;
    } 
    else if (first.getHours() === second.getHours()) 
    {
        return first.getMinutes() < second.getMinutes();
    }
    return false;
}

const isDateTimeBefore = (first, second) =>{
    if (first.getFullYear() < second.getFullYear()) 
    {
        return true;
    } 
    else if (first.getFullYear() === second.getFullYear()) 
    {
        if (first.getMonth() < second.getMonth())
        {
            return true;
        } 
        else if (first.getMonth() === second.getMonth()) 
        {
            if(first.getDate() < second.getDate())
            {
                return true;
            }
            else if(first.getDate() === second.getDate())
            {
                return isTimeBefore(first, second);
            }
        }
    }
    return false;
}

//TODO: Figure out what this should be
const validateMinimumTimeBooked = () =>{
    return true;
}

const showScheduleMessage = (errorMsg) =>{
    const scheduleError = document.getElementById("scheduleMessage");
    scheduleError.setAttribute("style", "visibility: visible;")
    scheduleError.innerHTML = errorMsg;
    setTimeout(hideScheduleMessage, 2000);
}

const hideScheduleMessage = () =>{
    const scheduleError = document.getElementById("scheduleMessage");
    scheduleError.setAttribute("style", "visibility: hidden;")
}

const postBooking = async (location, fromDateTime, toDateTime, bookee, viewName) =>{

    var auth = sessionStorage.getItem("xauth");

    const rawResponse = await fetch('/booking', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        },
        body: JSON.stringify({location: location, from: fromDateTime, to: toDateTime, _bookee: bookee, bookeeName: viewName})
    });
        const content = await rawResponse.json()
        //const content = await rawResponse;


    if(rawResponse.status == 200)
    {
        console.log(`Status 200`);
        showScheduleMessage("Booking submitted successfully");
    }
    else
    {
        showScheduleMessage(content.errorMsg);
    }
}
