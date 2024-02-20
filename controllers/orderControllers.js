const orderModel = require('../models/orderModel')

const createOrder = async (req, res) => {
    try {
        const registerOrder = new orderModel({
            car: req.body.car,
            buyerType: req.body.buyerType,
            buyer: req.body.buyer,
            orderType: req.body.orderType,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            price: req.body.price,
            buyDate: req.body.buyDate
        })
        registerOrder.save()
        res.status(201).json({
            success: true,
            msg: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const getOrderByOrderType = async (req, res) => {
    try {
        const { OrdeType } = req.params
        const order = await orderModel.findById({OrdeType})
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await orderModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params
        const body = req.body
        const newData = await orderModel.findByIdAndUpdate(id, body, { new: true })
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


module.exports = { createOrder, getOrders, getOrderByOrderType, deleteOrder, updateOrder }