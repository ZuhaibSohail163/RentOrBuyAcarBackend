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

const sendEmail = async (email, resetToken) => {
    try {
        // Send email with password reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const resetLink = `http://localhost:5000/auth/reset-password/${resetToken}`
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<p>Please click <a>${resetLink}</a> to reset your password.</p>`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                // return res.status(500).json({ message: 'Failed to send email for password reset', error });
                console.log('Failed to send email for password reset')
                error: error.message
            }
            else{
                console.log(`Email sent: ${email}`);
            }
            // res.json({ message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        // res.status(500).json({ message: 'Internal server error', error: error.message });
        console.log("Internal server error")
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body

    try {

        const findEmail = await userModel.findOne({ email })

        if (!findEmail) {
            res.status(404).json({
                success: false,
                msg: "Email not found"
            })
        }

        const resetToken = jwt.sign({
            email: findEmail.email,
            id: findEmail._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" })
        findEmail.resetpasswordToken = resetToken,

            findEmail.resetpasswordTokenExpiry = Date.now() + 3600000

        await findEmail.save()

        await sendEmail(email, resetToken)

        res.status(200).json({
            msg: "Password reset Token is sent to your Email"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Internal server error",
            error: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    try {
        const user = await userModel.findOne({
            resetpasswordToken: token,
            resetpasswordTokenExpiry:
                { $gt: Date.now() }
        })


        if (!user) {
            res.status(400).json({
                msg: "Invalid Token or  expired Token "
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        user.resetpasswordToken = null
        user.resetpasswordTokenExpiry = null


        const resentEmail = user.email

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: resentEmail,
            subject: 'Reset Password',
            html: `<h1>Password Reset successfully</h1><p>Password Reset successfully, You can now Login with new Password</p>`
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        transporter.sendMail(mailOptions)
        console.log('Reset Password Token', token)
        res.status(200).json({
            msg: "Password reset successfully"
        })

    } catch (error) {
        res.status(500).json({
            msg: "internal server error",
            error: error.message
        })

    }
}

module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser, loginUser, resetPassword, forgetPassword }