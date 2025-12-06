const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        requied: true,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)