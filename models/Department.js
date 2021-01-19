const mongoose = require('mongoose')
const departmentSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    HOD : {
        type : String,
    },
    courses :{
        type : []
    } 
})

module.exports = mongoose.model('department',departmentSchema)