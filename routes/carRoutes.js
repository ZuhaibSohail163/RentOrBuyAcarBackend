const express = require('express')
const { createCar, getCars, getCarByBrand, deleteCar, updateCar } = require('../controllers/carControllers')
const router = express.Router()

router.post("/createNewCar", createCar)
router.get("/getCars", getCars)
router.get("/car/:brand", getCarByBrand)
router.delete("/deleteCar/:id", deleteCar)
router.put("/updateCar/:id", updateCar)

module.exports = router
