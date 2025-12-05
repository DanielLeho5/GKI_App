const mongoose = require("mongoose")

const gkModel = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    glucose: {
        type: Number
    },
    glucose_unit: {
        type: String,
        enum: ["mg/dL", "mmol/L"]
    },
    ketone: {
        type: Number
    },
    ketone_unit: {
        type: String,
        enum: ["mg/dL", "mmol/L"]
    },
    measurement_time: {
        type: Date,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("gk", gkModel)