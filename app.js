const express = require('express');
const app = express();
const login_route = require('./routes/login')
const hr_routes = require('./routes/hr')
const hod_routes = require('./routes/HOD')
const blocklist = require('./models/tokens')
const staff_routes = require('./routes/staff_routes')
const coordinator_routes = require('./routes/coordinator')
const academicMember_routes = require('./routes/AcademicMember')
const instructor_routes = require('./routes/instructor')
app.use(express.json());
const jwt = require('jsonwebtoken')
require('dotenv').config();
const cors = require('cors')

app.use(cors())

app.use('', login_route)

app.use(async (req, res, next) => {
    try {
        console.log("token:")
        const token = req.headers.token
        console.log(token)
        if (token) {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        }
    }
    catch (error) {
        res.send("Log in first!")
    }

})
app.use('', staff_routes)

app.use('/HR', hr_routes)

app.use('/HOD', hod_routes)

app.use('/Coordinator', coordinator_routes)

app.use('/AcademicMember', academicMember_routes)

app.use('/instructor', instructor_routes)

module.exports.app = app; 
