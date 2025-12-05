const Gk = require("../models/gkModel")
const mongoose = require("mongoose")

async function getRecords(req, res) {
    try {
        const user_id = req.user.id

        const records = await Gk.find({user_id})

        if (records.length === 0) {
            res.status(200).json({
                message: "No records found for this user!"
            })
            return
        }

        res.status(200).json({
            message: "Records fetched succesfully!",
            records
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

async function addRecord(req, res) {
    try {

        if (!req.body) {
            res.status(400).json({
                message: "Body is empty"
            })
            return
        }

        const user_id = req.user.id
        let {glucose = null,
            glucose_unit = "mmol/L",
            ketone = null,
            ketone_unit = "mmol/L",
            measurement_time = new Date()} = req.body

        if (!glucose && !ketone) {
            res.status(400).json({
                message: "To create a record, you must provide at least glucose or ketone measurement"
            })
            return
        }

        const newRecord = await Gk.create({
            user_id, glucose, glucose_unit, ketone, ketone_unit, measurement_time
        })

        if (!newRecord) {
            res.status(500).json({
                message: "Unexpected error!"
            })
            return
        }

        res.status(201).json({
            message: "Record created succesfully!",
            newRecord
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error
        })
    }
}

async function updateRecord(req, res) {
    try {

        if (!req.body) {
            res.status(400).json({
                message: "Body is empty"
            })
            return
        }

        const user_id = req.user.id
        const record_id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(record_id)) {
            res.status(400).json({
                message: "Invalid id"
            })
            return
        }

        const update = {}
        
        Object.keys(req.body).forEach(key => {
            update[key] = req.body[key]
        });

        if (Object.keys(update).length === 0) {
            res.status(400).json({
                message: "Nothing to update!"
            })
            return
        }

        const updatedRecord = await Gk.findOneAndUpdate(
            {_id: record_id, user_id},
            update
        )

        if (!updatedRecord) {
            res.status(404).json({
                message: "No record found for this user with this id"
            })
            return
        }

        res.status(200).json({
            message: "Record updated succesfully!",
            updatedRecord
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error
        })
    }
}

async function deleteRecord(req, res) {
    try {
        const user_id = req.user.id
        const record_id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(record_id)) {
            res.status(400).json({
                message: "Invalid id"
            })
            return
        }

        const deletedRecord = await Gk.findOneAndDelete(
            {_id: record_id, user_id}
        )

        if (!deletedRecord) {
            res.status(404).json({
                message: "No record found for this user with this id"
            })
            return
        }

        res.status(200).json({
            message: "Record deleted succesfully!",
            deletedRecord
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error
        })
    }
}

module.exports = {getRecords, addRecord, updateRecord, deleteRecord}