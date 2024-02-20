const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    DOB: Date,
    gender: {
        type: Boolean,
        default: true
    },
    category: String,
    CompanyName: String,
    phone: String

})
const userModel = mongoose.model("user", userSchema)

module.exports = userModel