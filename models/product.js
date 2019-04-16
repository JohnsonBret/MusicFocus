const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    productId:{
        type: Number,
        required: true,
        unique: true,
        minlength: 4
    },
    description:{
        type: String,
        required: true,
        unique: false,
    },
    price:{
        type: Number,
        required: true,
        unique: false
    },
    productType:{
        type: String,
        required: true,
        unique: false,
    }

});

// UserSchema.methods adds an instance method
ProductSchema.methods.toJSON = function(){
    let product = this;
    let productObject = product.toObject();

    return _.pick(productObject, ['_id', 'name', 'productId', 'description', 'price', 'productType']);
};

var Product = mongoose.model('Product', ProductSchema);

module.exports = {
    Product: Product
}