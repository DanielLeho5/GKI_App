const mongoose = require("mongoose")

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION)
        console.log("Connected to database succesfully!")
    } catch (error) {
        console.log("Couldn't connect to database.")
        console.log(error)
        process.exit(1)
    }
}

module.exports = {connectToDatabase}