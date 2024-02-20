const userModel = require('../models/userModel')
const bcrypt=require('bcrypt')

const createUser = async (req, res) => {
    const hashedPassword=await bcrypt.hash(req.body.password, 10)
    try {
        const registerUser = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
            phone: req.body.phone,
            category: req.body.category,
            companyName: req.body.companyName
        })
        registerUser.save()
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

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            error
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const body = req.body
        const newData = await userModel.findByIdAndUpdate(id, body, { new: true })
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


module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser }