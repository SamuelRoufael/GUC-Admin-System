const mongoose = require('mongoose')
let facultySchema = mongoose.Schema({
     name : {
        type : String,
        required : true,
        unique : true
     },
     departments : {
        type : []
     }   
})

module.exports = mongoose.model('faculty',facultySchema)