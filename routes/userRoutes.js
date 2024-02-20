const express = require('express')
const {createUser, getUsers, getUserById, deleteUser, updateUser} = require('../controllers/userControllers')
const router=express.Router()

router.post("/users/signUp", createUser)
router.get("/users/users", getUsers)
router.get("/users/user/:id", getUserById)
router.delete("/users/deleteUsers/:id", deleteUser)
router.put("/users/updateUser/:id", updateUser)

module.exports=router