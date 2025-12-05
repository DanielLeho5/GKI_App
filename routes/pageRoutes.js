const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "home.html"))
})

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "login.html"))
})

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "register.html"))
})

router.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "feedback.html"))
})

router.get("/feedback_loggedIn", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "feedback-loggedIn.html"))
})

module.exports = router