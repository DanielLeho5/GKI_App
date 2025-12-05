const express = require("express")
const router = express.Router()
const {getRecords, addRecord, updateRecord, deleteRecord} = require("../controllers/gkController")
const {authMiddleware} = require("../middleware/authMiddleware")

router.get("/", authMiddleware, getRecords)

router.post("/", authMiddleware, addRecord)

router.put("/:id", authMiddleware, updateRecord)

router.delete("/:id", authMiddleware, deleteRecord)

module.exports = router