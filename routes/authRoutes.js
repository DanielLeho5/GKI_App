const express = require("express")
const router = express.Router()
const {registerUser, loginUser, logOutUser, verifiyEmail} = require("../controllers/authController.js")

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/logout", logOutUser)

router.get("/verify-email", verifiyEmail)

module.exports = router