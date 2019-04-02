const _ = require('lodash');
var { DateTime } = require('luxon');
var {mongoose} = require('../db/mongoose');
var {Booking} = require('../models/booking');
var {User} = require('../models/user');

const firstDate = new Date();
const secondDate = new Date(1981, 2, 28, 9, 14, 54, 1);
const thirdDate = new Date(2019, 2, 14, 21, 40, 30, 30);
const fourthDate = new Date(2019, 2, 13, 21, 40, 30, 30);
const fifthDate = new Date(2019, 2, 13, 22, 40, 30, 30);
const sixthDate = new Date(2019, 2, 13, 22, 41, 30, 30);

var bookingValidator = (req, res, next)=>{

    console.log(`Starting Booking Validator`);
    
    var desiredBooking = _.pick(req.body, ['location', 'from', 'to']);

    desiredBooking.from = DateTime.fromISO(desiredBooking.from, {zone: 'utc'});
    desiredBooking.to = DateTime.fromISO(desiredBooking.to, {zone: 'utc'});

    // console.log(desiredBooking);

    Booking.find({
        location: desiredBooking.location,
        from: {
            $gte: desiredBooking.from.startOf("day").toJSDate(),
            $lte: desiredBooking.to.endOf("day").toJSDate()
        }
    }).sort({from: 'asc'}).then((bookings)=>{

        console.log("BOOKINGS START");
        console.log(bookings);
        console.log("BOOKINGS END");
        
        var result = isTimeSlotAvailable(desiredBooking.from, desiredBooking.to, bookings);
        
        console.log(`is time slot available ${result}`);

        next();
    }, (e)=>{
        res.status(400).send(e);
    });
};

const isTimeSlotAvailable = (timeSlotStart, timeSlotEnd, allocatedTimes) =>{

    // console.log("allocatedTIMES START");
    // console.log(`type of allocated times ${typeof allocatedTimes}`);
    // console.log(allocatedTimes);
    // console.log("allocatedTIMES END");

    for (let i = 0; i < allocatedTimes.length; i++) 
    {
        // console.log("allocatedTimes[i]");
        // console.log(allocatedTimes[i]);

        // The problem is this isn't turning into a luxon it is becoming undefined - investigate how to properly turn it into a DATETIME
        let allocatedFrom = DateTime.fromString(allocatedTimes[i].from);
        let allocatedTo = DateTime.fromRFC2822(allocatedTimes[i].to);

        // console.log("Allocated from");
        // console.log(allocatedTimes[i].from);
        // console.log(`Type of allocated from ${typeof allocatedTimes[i].from}`)

        if ((isTimeAfter(timeSlotStart, allocatedFrom) && isTimeSame(timeSlotStart, allocatedFrom)) 
            && isTimeBefore(timeSlotStart, allocatedTo)) 
        {
            return false;
        } 
        else if (isTimeBefore(allocatedFrom, timeSlotEnd) && isTimeAfter(allocatedTo, timeSlotStart)) 
        {
            return false;
        }
    }

    return true;
};

// console.log(`Time is before ${isTimeBefore(firstDate, secondDate)}`);
// console.log(`Time is before ${isTimeBefore(secondDate, firstDate)}`);

const isTimeAfter = (first, second) =>{

    console.log("First");
    console.log(first);
    console.log("Second");
    console.log(second);

    console.log(`First Hour ${first.hour} Second Hour ${second.hour}
    First minute ${first.minute} Second minute ${second.minute}`)

    if (first.hour > second.hour) 
    {
        return true;
    } 
    else if (first.hour === second.hour) 
    {
        return first.minute > second.minute;
    }
    return false;
}

const isTimeSame = (first, second) =>{
    if (first.hour === second.hour) 
    {
        return first.minute === second.minute;
    }
    return false;
}

// console.log(`Time is same ${isTimeSame(firstDate, secondDate)}`);
// console.log(`Time is same ${isTimeSame(secondDate, secondDate)}`);

const isTimeBefore = (first, second) => {
    if (first.hour < second.hour) 
    {
        return true;
    } 
    else if (first.hour === second.hour) 
    {
        return first.minute < second.minute;
    }
    return false;
}

// console.log(`Time is After ${isTimeAfter(firstDate, secondDate)}`, firstDate, secondDate);
// console.log(`Time is After ${isTimeAfter(secondDate, firstDate)}`, secondDate, firstDate);


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

// console.log(`Is Date Time Before ${isDateTimeBefore(firstDate, secondDate)}`, firstDate, secondDate);
// console.log(`Is Date Time Before ${isDateTimeBefore(secondDate, firstDate)}`, secondDate, firstDate);
// console.log(`Is Date Time Before ${isDateTimeBefore(firstDate, thirdDate)}`, firstDate, thirdDate);
// console.log(`Is Date Time Before ${isDateTimeBefore(thirdDate, firstDate)}`, thirdDate, firstDate);
// console.log(`Is Date Time Before ${isDateTimeBefore(thirdDate, fourthDate)}`, thirdDate, fourthDate);
// console.log(`Is Date Time Before ${isDateTimeBefore(fourthDate, thirdDate)}`, fourthDate, thirdDate);


const isDateTimeSame = (first, second) => {
    if (first.getFullYear() === second.getFullYear()) 
    {
        if (first.getMonth() === second.getMonth()) 
        {
            if(first.getDate() === second.getDate())
            {
                return isTimeSame(first, second);
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    return false;
}

// console.log(`Is Date Time Same ${isDateTimeSame(firstDate, secondDate)}`, firstDate, secondDate);
// console.log(`Is Date Time Same ${isDateTimeSame(secondDate, firstDate)}`, secondDate, firstDate);
// console.log(`Is Date Time Same ${isDateTimeSame(firstDate, thirdDate)}`, firstDate, thirdDate);
// console.log(`Is Date Time Same ${isDateTimeSame(thirdDate, firstDate)}`, thirdDate, firstDate);
// console.log(`Is Date Time Same ${isDateTimeSame(thirdDate, fourthDate)}`, thirdDate, fourthDate);
// console.log(`Is Date Time Same ${isDateTimeSame(fourthDate, thirdDate)}`, fourthDate, thirdDate);
// console.log(`Is Date Time Same ${isDateTimeSame(secondDate, secondDate)}`, secondDate, secondDate);
// console.log(`Is Date Time Same ${isDateTimeSame(fourthDate, fifthDate)}`, fourthDate, fifthDate);
// console.log(`Is Date Time Same ${isDateTimeSame(fifthDate, fourthDate)}`, fifthDate, fourthDate);
// console.log(`Is Date Time Same ${isDateTimeSame(fifthDate, sixthDate)}`, fifthDate, sixthDate);
// console.log(`Is Date Time Same ${isDateTimeSame(sixthDate, fifthDate)}`, sixthDate, fifthDate);

const isDateTimeAfter = (first, second) =>{
    if (first.getFullYear() > second.getFullYear()) 
    {
        return true;
    } 
    else if (first.getFullYear() === second.getFullYear()) 
    {
        if (first.getMonth() > second.getMonth())
        {
            return true;
        } 
        else if (first.getMonth() === second.getMonth()) 
        {
            if(first.getDate() > second.getDate())
            {
                return true;
            }
            else if(first.getDate() === second.getDate())
            {
                return isTimeAfter(first, second);
            }
        }
    }
    return false;
}

// console.log(`Is Date Time After ${isDateTimeAfter(firstDate, secondDate)}`, firstDate, secondDate);
// console.log(`Is Date Time After ${isDateTimeAfter(secondDate, firstDate)}`, secondDate, firstDate);
// console.log(`Is Date Time After ${isDateTimeAfter(firstDate, thirdDate)}`, firstDate, thirdDate);
// console.log(`Is Date Time After ${isDateTimeAfter(thirdDate, firstDate)}`, thirdDate, firstDate);
// console.log(`Is Date Time After ${isDateTimeAfter(thirdDate, fourthDate)}`, thirdDate, fourthDate);
// console.log(`Is Date Time After ${isDateTimeAfter(fourthDate, thirdDate)}`, fourthDate, thirdDate);
// console.log(`Is Date Time After ${isDateTimeAfter(secondDate, secondDate)}`, secondDate, secondDate);
// console.log(`Is Date Time After ${isDateTimeAfter(fourthDate, fifthDate)}`, fourthDate, fifthDate);
// console.log(`Is Date Time After ${isDateTimeAfter(fifthDate, fourthDate)}`, fifthDate, fourthDate);
// console.log(`Is Date Time After ${isDateTimeAfter(fifthDate, sixthDate)}`, fifthDate, sixthDate);
// console.log(`Is Date Time After ${isDateTimeAfter(sixthDate, fifthDate)}`, sixthDate, fifthDate);


const bookedTimes = [
    {
        from: new Date(2000, 1, 1, 1, 00, 00, 00) ,
        to: new Date(2000, 1, 1, 2, 00, 00, 00)
    },
    {
        from: new Date(2000, 1, 1, 3, 00, 00, 00) ,
        to: new Date(2000, 1, 1, 3, 30, 00, 00)
    },
    {
        from: new Date(2000, 1, 1, 10, 00, 00, 00) ,
        to: new Date(2000, 1, 1, 12, 00, 00, 00)
    },
    {
        from: new Date(2000, 1, 1, 20, 00, 00, 00) ,
        to: new Date(2000, 1, 1, 22, 00, 00, 00)
    }
]

const midnight = new Date(2000, 1, 1, 0, 00, 00, 00);
const oneThirty = new Date(2000, 1, 1, 1, 30, 00, 00);

const oneAM = new Date(2000, 1, 1, 1, 00, 00, 00);
const twoThirtyAM = new Date(2000, 1, 1, 2, 30, 00, 00);

const oneFiftyNineAM = new Date(2000, 1, 1, 1, 59, 00, 00);
const threeThirtyAM = new Date(2000, 1, 1, 3, 30, 00, 00);

const fourAM = new Date(2000,1,1,4,00,00,00);
const fiveAM = new Date(2000,1,1,5,00,00,00);



module.exports = {
    bookingValidator,
};

// console.log(`Expecting False - ${isTimeSlotAvailable(midnight, oneThirty, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting False - ${isTimeSlotAvailable(oneAM, twoThirtyAM, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting False - ${isTimeSlotAvailable(oneFiftyNineAM, threeThirtyAM, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting True - ${isTimeSlotAvailable(fourAM, fiveAM, bookedTimes)} - Is time Slot Available`);

