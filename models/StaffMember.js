const mongoose = require('mongoose')

let staffSchema=new mongoose.Schema({
    id:{
        type: String, 
        required: true,
        unique: true
    },
    name:{
        type: String, 
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        password: '123456'
    },
    salary: {
        type: Number,
        required: true
    },
    department: {
        type: String
    },
    faculty: {
        type: String
    },
    office: {
        type: String
    },
    dayOff: {  // sat-0, sun-1, mon-2, tues-3, wed-4, thurs-5
        type: Number
    },
    role: {
        type: [],
        required: true
    },
    annualLeaves: {
        type: Number,
        min:0,
        max:30,
        default: 0
    },
    accidentalLeaves: {
        type: Number, 
        min: 0,
        max: 6,
        default: 6
    },
    loggedInBefore: {
        type: Boolean, 
        default: false
    },
    attendanceRecords: {
        type: [{
            date : {
                type : Date,
                required : true
            },
            type : {
                type : String,
                enum : ["signIn" ,"signOut"],
                required : true
            }
        }]   
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male","Female"]
    },
    extraInfo : {
        type : Object
    },
    picture: {
        type: String,
        default: "https://i.dlpng.com/static/png/6542357_preview.png"
    }
})

module.exports=mongoose.model('staffMember', staffSchema);
