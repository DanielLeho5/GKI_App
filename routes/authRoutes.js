const express = require("express")
const router = express.Router()
const {registerUser, loginUser, logOutUser, verifyEmail} = require("../controllers/authController.js")

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/logout", logOutUser)

router.get("/verify", verifyEmail)

module.exports = router