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
    },
    from:{
        type: Date,
        required: true
    },
    to:{
        type: Date,
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
        type: Date,
        default: Date.now
    },
    attended: {
        type: Boolean,
        default: false
    }
    
});

module.exports = {
    Booking: Booking
}