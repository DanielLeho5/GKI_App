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
        required: true
    },
    emailVerificationToken: {
        type: String,
        required: true
    },
    emailVerificationExpires: {
        type: Date,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)