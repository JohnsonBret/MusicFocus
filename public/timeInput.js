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
    console.log(clickedHour, event.target.innerHTML)
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
    console.log(hour.innerHTML, event.target.innerHTML);
}

function changeMinute(event)
{
    var clickedMinute = event.target.parentElement.getAttribute("id");
    console.log(clickedMinute, event.target.innerHTML);

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
    console.log(minute.innerHTML, event.target.innerHTML);
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
    validateDates(fromDateTime, toDateTime);
    

    console.log(`fromDate ${fromDateTime.toLocaleString()}, fromTime ${toDateTime.toLocaleString()}`);
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
            hours = 11;
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

    console.log(`year ${year}, month ${month}, day ${day}, hours ${hours}, minutes ${minutes}, seconds ${seconds}, milli ${milliseconds}`);
    console.log(createdDate.toLocaleDateString(), createdDate.toLocaleTimeString());

    return createdDate;
}

const validateDates = (from, to) => {
    validateYear(from.getFullYear());
    validateYear(to.getFullYear());
    validateDay(from.getDate());
    validateDay(to.getDate());
    validateHour(from.getMinutes());
    validateHour(to.getMinutes());
    validateFromIsBeforeToTime(from , to);
    console.log(` is time before ${validateFromIsBeforeToTime(from , to)}`);
    validateMinimumTimeBooked(from, to);
}

const validateYear = (year)=>{
    //console.log(`Validate Year ${year == new Date().getFullYear() || year == new Date().getFullYear() + 1}`);
    return year == new Date().getFullYear() || year == new Date().getFullYear() + 1;
}

const validateDay = (day)=>{
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
