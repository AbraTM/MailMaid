const mongoose = require("mongoose")

const classifiedMappingSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String
    },
    senderEmail: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ]
    },
    subject: {
        type: String
    },
    date: {
        type: Date
    },
    summary: {
        type: String
    },
    predictedLabel: {
        type: String
    }
})

module.exports = mongoose.model("ClassifiedMapping", classifiedMappingSchema);