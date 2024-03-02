const carModel = require('../models/carModel')
// Create a new car
const createCar = async (req, res) => {
    try {
        const createNewCar = new carModel({
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            price: req.body.price,
            isAvailable: req.body.isAvailable
        })
        createNewCar.save()
        res.status(201).json({
            success: true,
            msg: "Car created successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

// Get all cars
const getCars = async (req, res) => {
    try {
        const cars = await carModel.find()
        res.status(200).json({
            success: true,
            cars
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })







        
    }
}

// Update a car by ID
const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const body = req.body
        const newData = await carModel.findByIdAndUpdate(id, body, { new: true })
        res.status(200).json({
            success: true,
            newData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const getCarByBrand = async (req, res) => {
    try {
        const { brand } = req.params
        const car = await carModel.find({ brand });
        res.status(200).json({
            success: true,
            car
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}
// Delete a car by ID
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const car = await carModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            car
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

// Similar routes for Business, Client, and Order schemas

module.exports = { createCar, getCars, getCarByBrand, deleteCar, updateCar }
