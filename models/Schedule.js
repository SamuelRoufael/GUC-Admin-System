const mongoose = require('mongoose')

let scheduleSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    day: {
        type: Number, 
        required: true
    },
    slot: {
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    academicMember: {
        type: String,
        default: null
    },
    location: {
        type: String,
        required: true
    }
})

module.exports=mongoose.model('schedule', scheduleSchema);