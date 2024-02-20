const mongoose = require('mongoose');
const userModel = require('./userModel');
const carModel = require('./carModel');

const orderSchema = new mongoose.Schema({
    car: {
        type: carModel,
        ref: 'Car',
        required: true
    },
    buyerType: {
        type: String,
        enum: ['business', 'client'],
        required: true
    },
    buyer: {
        type: userModel,
        refPath: 'buyerType',
        required: true
    },
    orderType: {
        type: String,
        enum: ['buy', 'rent'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    price: {
        type: Number
    },
    buyDate: {
        type: Date
    },
    // Add other relevant fields like price, payment status, etc.
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel