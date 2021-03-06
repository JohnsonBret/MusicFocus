var { DateTime, Duration } = require('luxon');


//Date Manipulation - to see previous or later weeks in the schedule
var minusDate = DateTime.local().minus({weeks: 1});
console.log(`Week in the year number ${minusDate.weekNumber}`);
console.log(`Week in the year number ${minusDate}`);
console.log(`Start of week date ${minusDate.startOf("week")}`);
console.log(`Start of week date ${minusDate.endOf("week")}`);

//Start of
// console.log(`Start of week date ${DateTime.local().startOf("week")}`);

//End of
// console.log(`Start of week date ${DateTime.local().endOf("week")}`);

//Datetime trying to set it to LA timezone
// var utcTime = DateTime.fromISO("2019-03-26T18:15:00.000Z");
// var laTime = utcTime.setZone('America/Los_Angeles');
// console.log(`Datetime from ISO? ${utcTime}`)
// console.log(`Datetime LA? ${laTime}`)

// Date formatting
// console.log(`Nice Local String ${laTime.toLocaleString(DateTime.TIME_SIMPLE)}`)