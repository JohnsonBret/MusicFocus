const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var CustomerInfoSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    _userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    _customerId:{
        type: String,
        required: true,
        unique: false
    },
    created:{
        type: Number
    },
    account_balance:{
        type: Number,
        required: true,
        unique: false
    },
    delinquent:{
        type: Boolean,
        required: true,
        unique: false
    },
    livemode:{
        type: Boolean,
        required: true,
        unique: false
    }

});

// UserSchema.methods adds an instance method
CustomerInfoSchema.methods.toJSON = function(){
    var customerInfo = this;
    var customerInfoObject = customerInfo.toObject();

    return _.pick(customerInfoObject, ['_id','email', '_userId', '_customerId', 'created',
                                    'accountBalance']);
};

var CustomerInfo = mongoose.model('CustomerInfo', CustomerInfoSchema);

module.exports = {
    CustomerInfo: CustomerInfo
}