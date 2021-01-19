const mongoose = require('mongoose')

let locationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    type: {
        type: String, 
        required: true, 
        enum :['Office', 'Lab', 'Lecture Hall', 'Tutorial Room', 'Exam Hall']
    },
    currentCapacity:{
        type: Number, 
        default: 0
    },
    maxCapacity: {
        type: Number, 
        required: true, 
        min: 1
    }
})

module.exports=mongoose.model('location', locationSchema);