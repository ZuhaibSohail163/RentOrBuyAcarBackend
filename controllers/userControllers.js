const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await userModel.findOne({ email })
        console.log('====================================');
        console.log(existingUser);
        console.log('====================================');
        if (!existingUser) {
            return res.status(404).json({
                msg: "Email not found, please register"
            })
        }
        const matchedpassword = await bcrypt.compare(password, existingUser.password)
        
        if (!matchedpassword) {
            res.status(409).json({
                msg: "Invalid Credentials"
            })
        }
        const secret = process.env.JWT_SECRET || 'fallbackSecretKey';
        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, secret)

        res.status(200).json({
            success: true,
            msg: "User logged In",
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Internal server error",
            error: error.message // Send the error message in the response
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const secret = process.env.JWT_SECRET || 'fallbackSecretKey';

        // Generate token for password reset
        const resetToken = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

        // Send email with password reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user.email,
                pass: user.password
            }
        });

        const mailOptions = {
            from: 'carzonline@gmail.com',
            to: email,
            subject: 'Reset Password',
            html: `<p>Please click <a href="http://localhost:5000/reset-password/${resetToken}">here</a> to reset your password.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send email for password reset', error });
            }
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser, loginUser, resetPassword }