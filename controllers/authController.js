const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
    try {
        if (!req.body) {
            res.status(400).json({
                message: "Body is empty"
            })
            return
        }

        const {email, username, password} = req.body

        if (!email || !username || !password) {
            res.status(400).json({
                message: "Must enter email and username and password!"
            })
            return
        }

        const emailUnavailable = await User.findOne({email})

        if (emailUnavailable) {
            res.status(400).json({
                message: "User already registered with this email!"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email, 
            username, 
            password: hashedPassword
        })

        if (!newUser) {
            return res.status(500).json({
                message: "Unexpected error creating user."
            });
        }

        return res.status(200).json({
            message: "User registered successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error
        })
    }
}

async function loginUser(req, res) {
    try {
        if (!req.body) {
            res.status(400).json({
                message: "Body is empty"
            })
            return
        }
        
        const {email, password} = req.body

        if (!email || !password) {
            res.status(400).json({
                message: "Must provide both username and password!"
            })
            return
        }

        const user = await User.findOne({email})

        if (!user) {
            res.status(400).json({
                message: "No user with this email!"
            })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            res.status(401).json({
                message: "Password incorrect!"
            })
            return
        }

        const token = jwt.sign(
            {id: user._id, email: user.email, username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        )

        if (token) {
            res.cookie("gkiToken", token, {
                httpOnly: true,
                secure: false, // true for production version
                sameSite: "strict" // strict for production version
            })
            .status(200)
            .json({
                message: "Logged in succesfully!"
            })
            return
        }

        res.status(500).json({
            message: "Unexpected error!",
            error
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error
        })
    }
}

async function logOutUser(req, res) {
    res.clearCookie("gkiToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {registerUser, loginUser, logOutUser}