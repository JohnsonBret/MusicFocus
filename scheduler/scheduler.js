
const moment = require('moment');



const firstDate = new Date();
const secondDate = new Date(1981, 2, 28, 9, 14, 54, 1);
const thirdDate = new Date(2019, 2, 14, 21, 40, 30, 30);
const fourthDate = new Date(2019, 2, 13, 21, 40, 30, 30);
const fifthDate = new Date(2019, 2, 13, 22, 40, 30, 30);
const sixthDate = new Date(2019, 2, 13, 22, 41, 30, 30);


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

// console.log(`Time is before ${isTimeBefore(firstDate, secondDate)}`);
// console.log(`Time is before ${isTimeBefore(secondDate, firstDate)}`);

const isTimeSame = (first, second) =>{
    if (first.getHours() === second.getHours()) 
    {
        return first.getMinutes() === second.getMinutes();
    }
    return false;
}

// console.log(`Time is same ${isTimeSame(firstDate, secondDate)}`);
// console.log(`Time is same ${isTimeSame(secondDate, secondDate)}`);


const isTimeAfter = (first, second) =>{
    if (first.getHours() > second.getHours()) 
    {
        return true;
    } 
    else if (first.getHours() === second.getHours()) 
    {
        return first.getMinutes() > second.getMinutes();
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

const isTimeSlotAvailable = (timeSlotStart, timeSlotEnd, allocatedTimes) =>{
    for (const allocated of allocatedTimes) 
    {
        if ((isTimeAfter(timeSlotStart, allocated.from) && isTimeSame(timeSlotStart, allocated.from)) 
            && isTimeBefore(timeSlotStart, allocated.to)) 
        {
            return false;
        } 
        else if (isTimeBefore(allocated.from, timeSlotEnd) && isTimeAfter(allocated.to, timeSlotStart)) 
        {
            return false;
        }
    }

    return true;
}

module.exports = {
    isTimeSlotAvailable,
};

// console.log(`Expecting False - ${isTimeSlotAvailable(midnight, oneThirty, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting False - ${isTimeSlotAvailable(oneAM, twoThirtyAM, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting False - ${isTimeSlotAvailable(oneFiftyNineAM, threeThirtyAM, bookedTimes)} - Is time Slot Available`);
// console.log(`Expecting True - ${isTimeSlotAvailable(fourAM, fiveAM, bookedTimes)} - Is time Slot Available`);

