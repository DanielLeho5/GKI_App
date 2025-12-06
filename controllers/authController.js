const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const path = require("path")
const host_url = process.env.host_url

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

        const token = crypto.randomBytes(32).toString("hex");

        const newUser = await User.create({
            email, 
            username, 
            password: hashedPassword, 
            verified: false,
            verificationToken: token,
            verificationTokenExpires: Date.now() + 1000 * 60 * 60 * 24
        })

        if (!newUser) {
            return res.status(500).json({
                message: "Unexpected error creating user."
            });
        }

        const verifyUrl = `${host_url}/api/auth/verify?token=${token}`;

        const sentInfo = await transporter.sendMail({
            to: email,
            subject: "Verify your email",
            html: `
                <h1>Verify Your Email</h1>
                <p>Click the link below to verify your account:</p>
                <a href="${verifyUrl}">${verifyUrl}</a>
            `
        });

        console.log(sentInfo)

        const sentSuccess =
            sentInfo.accepted &&
            sentInfo.accepted.length > 0 &&
            (!sentInfo.rejected || sentInfo.rejected.length === 0);

        if (!sentSuccess) {
            // Optional: clean up user since they cannot receive verification email
            await User.deleteOne({ _id: newUser._id });

            return res.status(500).json({
                message: "Failed to send verification email! Account not created."
            });
        }

        return res.status(200).json({
            message: "User registered successfully! Check your email to verify."
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

        if (!user.verified) {
            res.status(401).json({
                message: "Please verify account!"
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

async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send("Verification token is missing.");
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).sendFile(path.join(__dirname, "..", "static/oops.html"));
        }

        // Mark user as verified
        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).sendFile(path.join(__dirname, "..", "static/login.html"));
    } catch (error) {
        res.status(500).sendFile(path.join(__dirname, "..", "static/oops.html"));
    }
}

module.exports = {registerUser, loginUser, logOutUser, verifyEmail}