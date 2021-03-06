const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var OrderSchema = new mongoose.Schema({
    customerName:{
        type: String,
        required: true,
        unique: false,
        minlength: 1
    },
    customerEmail:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: false,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    _customerId:{
        type: String,
        required: true,
        unique: false
    },
    _chargeId:{
        type: String,
        required: true,
        unique: true
    },
    productId:{
        type: Number,
        required: true,
        unique: false,
        minlength: 4
    },
    productName:{
        type: String,
        required: true,
        unique: false,
    },
    price:{
        type: Number,
        required: true,
        unique: false
    },
    created:{
        type: Date,
        default: Date.now()
    },
    billingAddress:{
        addressStreet: {type: String, required: true, unique: false},
        addressCity: {type: String, required: true, unique: false},
        addressZip: {type: String, required: true, unique: false},
        addressState: {type: String, required: true, unique: false},
        addressCountry: {type: String, required: true, unique: false}
    },
    shippingName:{
        type: String,
        required: true,
        unique: false,
        minlength: 1
    },
    shippingAddress:{
        addressStreet: {type: String, required: true, unique: false},
        addressCity: {type: String, required: true, unique: false},
        addressZip: {type: String, required: true, unique: false},
        addressState: {type: String, required: true, unique: false},
        addressCountry: {type: String, required: true, unique: false}
    },
    shippingStatus:{
        type: Boolean,
        required: false,
        default: false,
    },
    orderCancelStatus:{
        type: Boolean,
        required: false,
        default: false
    }
});

// UserSchema.methods adds an instance method
OrderSchema.methods.toJSON = function(){
    let order = this;
    let orderObject = order.toObject();

    return orderObject;
};

var Order = mongoose.model('Order', OrderSchema);

module.exports = {
    Order: Order
}