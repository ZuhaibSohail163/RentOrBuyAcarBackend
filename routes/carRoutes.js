const express = require('express')
const { createCar, getCars, getCarByBrand, deleteCar, updateCar } = require('../controllers/carControllers')
const router = express.Router()

router.post("/carsM/createNewCar", createCar)
router.get("/carsM/getCars", getCars)
router.get("/carsM/car/:brand", getCarByBrand)
router.delete("/carsM/deleteCar/:id", deleteCar)
router.put("/carsM/updateCar/:id", updateCar)

module.exports = router