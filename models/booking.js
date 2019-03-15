var mongoose = require('mongoose');

var Booking = mongoose.model('Booking', {
    location: {
        type: Number,
        required: true
        // minlength: 1,
        // trim: true
    },
    slotsAvailable: {
        type: Number,
        required: true
        // minlength: 1,
        // trim: true
    },
    from:{
        type: Number,
        required: true
    },
    to:{
        type: Number,
        required: true
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _bookee:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bookedAt:{
        type: Number,
        default: null
    },
    attended: {
        type: Boolean,
        default: false
    }
    
});

module.exports = {
    Booking: Booking
}