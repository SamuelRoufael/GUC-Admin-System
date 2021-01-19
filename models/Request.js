const mongoose = require('mongoose')

let requestSchema = new mongoose.Schema({
    type: {
        type: String, 
        required: true,
        enum: ['Slot Linking', 'Replacement', 'Change dayoff', 'Annual Leaves', 'Sick Leaves', 'Accidental Leaves', 'Maternity Leaves', 'Compensation Leaves']
    },
    sender: {
        type: String, 
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    requestDate : {
        type : Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Accepted', 'Rejected', 'Pending']
    }, 
    startDate: {
        type: Date
    }, 
    endDate: {
        type: Date
    },
    compensationDate : {
        type : Date
    },
    comment: {
        type: String
    },
    schedule_ID : {
        type : String
    },
    replacementList : {
        type : []
    },
    document : {
        type : String
    },
    changedDayOff : {
        type : Number
    } 
})

module.exports=mongoose.model('request', requestSchema);