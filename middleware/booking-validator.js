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

    var desiredBooking = _.pick(req.body, ['location', 'from', 'to']);

    // desiredBooking.from = DateTime.fromISO(desiredBooking.from, {zone: 'utc'});
    // desiredBooking.to = DateTime.fromISO(desiredBooking.to, {zone: 'utc'});
    desiredBooking.from = DateTime.fromISO(desiredBooking.from, {zone: 'America/Los_Angeles'});
    desiredBooking.to = DateTime.fromISO(desiredBooking.to, {zone: 'America/Los_Angeles'});

    Booking.find({
        location: desiredBooking.location,
        from: {
            $gte: desiredBooking.from.startOf("day").toJSDate(),
            $lte: desiredBooking.to.endOf("day").toJSDate()
        }
    }).sort({from: 'asc'}).then((bookings)=>{
     
        var result = isTimeSlotAvailable(desiredBooking.from, desiredBooking.to, bookings);
        
        console.log(`is time slot available ${result}`);

        if(result)
        {
            next();
        }
        else
        {
            res.status(400).send({errorMsg: "Sorry! That time is not available."});
        }

        
    }, (e)=>{
        res.status(400).send(e);
    });
};

const isTimeSlotAvailable = (timeSlotStart, timeSlotEnd, allocatedTimes) => {

    for (let i = 0; i < allocatedTimes.length; i++) 
    {
        var allocatedTime = _.pick(allocatedTimes[i], ['location', 'from', 'to']);

        // console.log(`BEFORE allocated from ${allocatedTime.from} allocated to ${allocatedTime.to}`);
        // console.log(`BEFORE allocated from ${typeof allocatedTime.from} allocated to ${typeof allocatedTime.to}`);

        // let allocatedFrom = DateTime.fromJSDate(allocatedTime.from, {zone: 'utc'});
        // let allocatedTo = DateTime.fromJSDate(allocatedTime.to, {zone: 'utc'});

        let allocatedFrom = DateTime.fromJSDate(allocatedTime.from, {zone: 'America/Los_Angeles'});
        let allocatedTo = DateTime.fromJSDate(allocatedTime.to, {zone: 'America/Los_Angeles'});

        // I was able to book a time where the send of my desired booking (timeSlotEnd) overlapped the start of a previous booking
        // In this case i desired a 4:30pm to 5:30pm appointment when a 5:00pm to 7:00pm appointment already existed - this should have
        // returned false - This has to do with the time zone conversion I suspect - Perhaps we should try everything in LA TIME
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

const isTimeAfter = (first, second) =>{

    // console.log("First");
    // console.log(first);
    // console.log("Second");
    // console.log(second);

    // console.log(`isTimeAfter--> first ${first} second ${second}
    // First Hour ${first.hour} Second Hour ${second.hour}
    // First minute ${first.minute} Second minute ${second.minute}`)

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

const isTimeBefore = (first, second) => {

    console.log(`isTimeBefore--> first ${first} second ${second}
    First Hour ${first.hour} Second Hour ${second.hour}
    First minute ${first.minute} Second minute ${second.minute}`)

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

module.exports = {
    bookingValidator,
};

