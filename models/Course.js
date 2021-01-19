const mongoose = require('mongoose')
const courseSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    instructors : {
        type : []
    },
    coordinator : {
        type : String
    },
    TAs : {
        type : []
    }
})

module.exports = mongoose.model('course',courseSchema)