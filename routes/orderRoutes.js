const express = require('express')
const { createOrder, getOrders, getOrderByOrderType, deleteOrder, updateOrder } = require('../controllers/orderControllers')
const router = express.Router()

router.post("/orders/createOrder", createOrder)
router.get("/orders/getOrders", getOrders)
router.get("/orders/order/:brand", getOrderByOrderType)
router.delete("/orders/deleteOrders/:id", deleteOrder)
router.put("/orders/updateOrder/:id", updateOrder)

module.exports = router