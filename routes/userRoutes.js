const express = require('express')
const {createUser, getUsers, getUserById, deleteUser, updateUser, loginUser, resetPassword} = require('../controllers/userControllers')
const router=express.Router()

router.post("/signUp", createUser)
router.get("/users", getUsers)
router.get("/user/:id", getUserById)
router.delete("/deleteUsers/:id", deleteUser)
router.put("/updateUser/:id", updateUser)
router.post("/login", loginUser)
router.post("/resetPassword", resetPassword)

module.exports=router