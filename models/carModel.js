const mongoose = require('mongoose')

// Define Car schema
const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Add other relevant fields like mileage, condition, etc.
});
const carModel = mongoose.model("car", carSchema)

module.exports = carModel