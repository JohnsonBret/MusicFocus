const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var UserAddressSchema = new mongoose.Schema({
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
        required: true
    },
    name:{
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    addressStreet:{
        type: String,
        required: true,
        unique: false,
        minlength: 3
    },
    addressCity:{
        type: String,
        required: true,
        unique: false,
    },
    addressZip:{
        type: String,
        required: true,
        unique: false
    },
    addressState:{
        type: String,
        required: true,
        unique: false,
        minlength: 2
    },
    addressCountry:{
        type: String,
        required: true,
        unique: false,
        minlength: 3
    }

});

// UserSchema.methods adds an instance method
UserAddressSchema.methods.toJSON = function(){
    var userAddress = this;
    var userAddressObject = userAddress.toObject();

    return _.pick(userAddressObject, ['_id', 'email', 'name', 
                                    '_userId', 'addressStreet', 'addressCity',
                                'addressZip', 'addressState']);
};

var UserAddress = mongoose.model('UserAddress', UserAddressSchema);

module.exports = {
    UserAddress: UserAddress
}