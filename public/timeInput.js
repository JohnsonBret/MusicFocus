function changeHour(event)
{
    var hour = document.getElementById("hour");
    hour.innerHTML = event.target.innerHTML;
}

function changeAmPm(event)
{
    var AmPm = document.getElementById("AmPm");
    AmPm.innerHTML = event.target.innerHTML;
}