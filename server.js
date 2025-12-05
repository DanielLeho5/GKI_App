const express = require("express")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes.js")
const gkRoutes = require("./routes/gkRoutes.js")
const pageRoutes = require("./routes/pageRoutes.js")
const {connectToDatabase} = require("./database/connectToDatabase.js")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")

const app = express()
const port = process.env.PORT

connectToDatabase()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", pageRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/gk", gkRoutes)

app.listen(port, () => console.log("Server started on port", port))