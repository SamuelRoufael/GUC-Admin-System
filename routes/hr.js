const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const express = require('express')
const router = express.Router()
const locationModel = require('../models/Location')
const staffModel = require('../models/StaffMember')
const facultyModel = require('../models/faculty')
const scheduleModel = require('../models/Schedule')
const departmentModel = require('../models/department')
const courseModel = require('../models/course')
const requestModel = require('../models/Request')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const functions = require('./functions')
require('dotenv').config()

router.use(async (req,res,next)=> {
    try {
        const role = req.user.role
        if(role.includes("HR")){
            next();
        }

    } catch (error) {
        res.send("You are not allowed!")
        res.end();
    }
})

router.route('/viewLocations').get(async (req, res) => {
    try {
        const locations = await locationModel.find();
        res.send(locations);
    } catch (error) {
        res.send(error)
    }
})

router.route('/addLocation').post(async (req, res) => {
    let room = await locationModel.findOne({ location: req.body.location })
    if (room) {
        res.send(`Location is already in use`);
    }
    else {
        const newLocation = new locationModel({
            location: req.body.location,
            type: req.body.type,
            maxCapacity: req.body.maxCapacity
        })
        try {
            await newLocation.save();
            res.send(`Location added successfully`);
        }
        catch (error) {
            res.send(error);
        }
    }
});

router.route('/deleteLocation').post(async (req, res) => {
    try {
        const deletedLocation = await locationModel.findOneAndDelete({ location: req.body.location })
        if (deletedLocation) {
            await scheduleModel.updateMany({ location: req.body.location }, { location: null })
            await staffModel.updateMany({ office: req.body.location }, { office: null })
            res.send(`location deleted successfully`)
        }
        else
            res.send(`location does not exist!`)
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateLocation').post(async (req, res) => {
    try {
        foundLocation = await locationModel.findOne({ location: req.body.updates.location })
        if (foundLocation) {
            res.send(`location is already in use`)
        }
        else {
            const prevLocation = await locationModel.findOne({ location: req.body.location })
            if (!prevLocation) {
                res.send(`Location does not exist`)
                res.end()
            }
            if (req.body.updates.maxCapacity < prevLocation.currentCapacity) {
                res.send(`new Maximum Capacity is less than the current capacity!`)
                res.end()
            }
            else {
                await locationModel.findOneAndUpdate({ location: req.body.location }, req.body.updates)
                if (req.body.updates.location) {
                    await scheduleModel.updateMany({ location: req.body.location }, { location: req.body.updates.location })
                    await staffModel.updateMany({ office: req.body.location }, { office: req.body.updates.location })
                }
                res.send(`location updated Successfully!`)
            }
        }
    }
    catch (error) {
        res.send(error)
    }
})

router.route('/viewFaculties').get(async (req, res) => {
    try {
        const faculties = await facultyModel.find()
        res.send(faculties)
    } catch (error) {
        res.send(error)
    }
})

router.route('/addFaculty').post(async (req, res) => {
    try {
        const foundFaculty = await facultyModel.findOne({ name: req.body.faculty })
        if (foundFaculty)
            res.send(`Faculty already exists!`)
        else {
            const newFaculty = new facultyModel({
                name: req.body.faculty
            })
            await newFaculty.save()
            res.send(`Faculty added successfully!`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/deleteFaculty').post(async (req, res) => {
    try {
        const deletedFaculty = await facultyModel.findOneAndDelete({ name: req.body.name })
        if (deletedFaculty) {
            await staffModel.updateMany({ faculty: req.body.name }, { faculty: null })
            res.send(`Faculty ${req.body.name} deleted successfully!`)
        }
        else
            res.send(`There is no Faculty called ${req.body.name}`)
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateFaculty').post(async (req, res) => {
    try {
        const foundFaculty = await facultyModel.findOne({ name: req.body.updates.name })
        if (foundFaculty) {
            res.send(`New name is already in use`)
        }
        else {
            const prevFaculty = await facultyModel.findOneAndUpdate({ name: req.body.name }, req.body.updates)
            if (prevFaculty) {
                if (req.body.updates.name) {
                    await staffModel.updateMany({ faculty: req.body.name }, { faculty: req.body.updates.name })
                    res.send(`updated successfuly!`)
                }
            }
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/viewDepartments').get(async (req, res) => {
    try {
        const departments = await departmentModel.find();
        res.send(departments);
    } catch (error) {
        res.send(error);
    }
})

router.route('/addDepartment').post(async (req, res) => {
    try {
        const foundFaculty = await facultyModel.findOne({ name: req.body.faculty })
        if (!foundFaculty) {
            res.send(`There is no Faculty with the given name`)
            res.end()
        } else {
            const foundDepartment = await departmentModel.findOne({ name: req.body.name })
            if (!foundDepartment) {
                const newDepartment = departmentModel({
                    name: req.body.name
                })
                await newDepartment.save()
            }
            await facultyModel.updateOne({ name: req.body.faculty },
                {
                    $addToSet:
                        { departments: req.body.name }
                })
            res.send(`Department added successfully!`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateDepartment').post(async (req, res) => {
    try {
        const foundFaculty = await facultyModel.findOne({ name: req.body.facultyName, departments: req.body.name })
        if (foundFaculty) {
            const prevDepartment = await departmentModel.findOneAndUpdate({ name: req.body.name }, req.body.updates)
            if (prevDepartment) {
                if (req.body.updates.name) {
                    await staffModel.updateMany({ department: req.body.name }, { department: req.body.updates.name })
                    await facultyModel.findOneAndUpdate({ name: req.body.facultyName }, { $addToSet: { departments: req.body.updates.name } })
                    await facultyModel.findOneAndUpdate({ name: req.body.facultyName }, { $pull: { departments: req.body.name } })
                }
                if (req.body.updates.HOD) {
                    await staffModel.updateOne({ id: req.body.updates.HOD }, { $addToSet: { role: "HOD" } })
                }
                res.send(`Department updated successfully!`)
            }
            else
                res.send(`Department not found`)
        }
        else
            res.send(`Department does not exist under the given faculty`)

    } catch (error) {
        res.send(error)
    }
})

router.route('/deleteDepartment').post(async (req, res) => {
    try {
        const foundFaculty = await facultyModel.findOneAndUpdate({ name: req.body.faculty },
            { $pull: { departments: req.body.department } }, { multi: true })
        if (!foundFaculty) {
            res.send(`Department does not exist under this faculty`)
            res.end()
        }
        else {
            const staffMembers = (await staffModel.find({ department: req.body.department }, { id: 1, _id: 0 })).map(function (staff) {
                return staff.id;
            })
            const courses = (await departmentModel.find({ name: req.body.department }, { courses: 1, _id: 0 })).map(function (obj) {
                return obj.courses;
            })[0]
            await staffModel.updateMany({ faculty: req.body.faculty, department: req.body.department }, { department: null })
            await scheduleModel.updateMany({ course: { $in: courses }, academicMember: { $in: staffMembers } }, { academicMember: null })
            await courseModel.updateMany({ name: { $in: courses } }, {
                $pull: {
                    instructors: { $in: staffMembers },
                    TAs: { $in: staffMembers },
                    coordinator: { $in: staffMembers }
                }
            })
            const faculties = await facultyModel.find({departments : req.body.department})
            if (faculties.length == 0)
                await departmentModel.findOneAndDelete({name : req.body.department},{ multi: true })
            res.send(`Department Deleted Successfully!`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/viewCourses').get(async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.send(courses);
    } catch (error) {
        res.send(error);
    }
})

router.route('/addCourse').post(async (req, res) => {
    try {
        const foundCourse = await courseModel.findOne({ name: req.body.name })
        const foundDepartment = await departmentModel.findOne({ name: req.body.department })

        if (foundDepartment) {
            if (!foundCourse) {
                const newCourse = new courseModel({
                    name: req.body.name
                })
                await newCourse.save()
            }
            await departmentModel.findOneAndUpdate(
                { name: req.body.department },
                {
                    $addToSet: { courses: req.body.name }
                })
            res.send(`Course addedd successfully!`)
        }
        else
            res.send(`Department Not Found!`)
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateCourse').post(async (req, res) => {
    try {
        if (!req.body.updates.name) {
            res.send(`please fill update field(s)`)
        }
        else {
            const foundDepartment = await departmentModel.findOne({ name: req.body.departmentName, courses: req.body.courseName })
            if (foundDepartment) {
                const foundCourse = await courseModel.findOne({ name: req.body.updates.name })
                if (foundCourse)
                    res.send(`New Course name is already in use`)
                else {
                    const prevCourse = await courseModel.findOneAndUpdate({ name: req.body.courseName }, req.body.updates)
                    if (prevCourse) {
                        await scheduleModel.findOneAndUpdate({ course: req.body.courseName }, { course: req.body.updates.name })
                        await departmentModel.updateOne({ name: req.body.departmentName }, { $pull: { courses: { $in: [req.body.courseName] } } })
                        await departmentModel.updateOne({ name: req.body.departmentName }, { $addToSet: { courses: req.body.updates.name } })
                        res.send(`Course updated successfully!`)
                    }
                    else
                        res.send(`Course does not exist!`)
                }
            }
            else
                res.send(`Course does not exist under the given department`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/deleteCourse').post(async (req, res) => {
    try {
        const foundDep = await departmentModel.findOneAndUpdate({ name: req.body.department }, { $pull: { courses: req.body.course } }, { multi: true })
        if (foundDep) {
            const staffMembers = (await staffModel.find({ department: req.body.department }, { id: 1, _id: 0 })).map(function (staff) {
                return staff.id;
            });
            await courseModel.findOneAndUpdate({ name: req.body.course }, {
                $pull: {
                    instructors: { $in: staffMembers },
                    TAs: { $in: staffMembers }
                }
            }, { multi: true })
            await courseModel.findOneAndUpdate({ name: req.body.course, coordinator: { $in: staffMembers } }, { coordinator: null })
            await scheduleModel.updateMany({ course: req.body.course, academicMember: { $in: staffMembers } }, { academicMember: null })
            const departments = await departmentModel.find({courses: req.body.course}, { multi: true })
            if (departments.length == 0){
                await courseModel.findOneAndDelete({name : req.body.course})
            }
            res.send(`Courses deleted successfully`)
        }
        else {
            res.send(`Course does not exist under the given Department`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateSalary').post(async (req, res) => {
    if (!req.body.salary)
        res.send(``)
    else if (req.body.salary < 0)
        res.send(`please Enter a valid salary`)
    else {
        try {
            const prevStaff = await staffModel.findOneAndUpdate({ id: req.body.id }, { salary: req.body.salary })
            if (prevStaff)
                res.send(`Salary is updated successfully`)
            else
                res.send(`there is no StaffMember with the given ID`)
        } catch (error) {
            res.send(error)
        }
    }
})

router.route('/viewAttendance').post(async (req, res) => {
    try {
        const staff = await staffModel.findOne({ id: req.body.id })
        if (staff) {
            res.send(staff.attendanceRecords)
        }
        else {
            res.send('staffMember Not found')
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/addAttendance').post(async (req, res) => {
    if (req.body.id.localeCompare(req.user.id) == 0) {
        res.send(`Sorry, you are not allowed to update your own Attendance!`)
    }
    else {
        try {
            const foundStaff = await staffModel.findOne({ id: req.body.id })
            if (!foundStaff) {
                res.send(`There is no staff member with ID ${req.body.id}`)
            }
            else {
                await staffModel.updateOne({ id: req.body.id },
                    {
                        $push: {
                            attendanceRecords: {
                                $each: req.body.newAttendanceRecords,
                                $sort: { date: 1 }
                            }
                        }
                    })
                res.send("Attendance updated successfully!")
            }
        } catch (error) {
            res.send(error)
        }
    }
})

router.route('/viewMissingDaysHours').get(async (req, res) => {
    try {
        let output = [];
        let missingDaysHours;
        let startEndDates = functions.getStartEndDates()
        const staffMembersRecords = (await staffModel.find({}, { id: 1, attendanceRecords: 1, name: 1, dayOff: 1, _id: 0 })).map(function (member) {
            member.attendanceRecords = member.attendanceRecords.filter(function (record) {
                return (functions.compareDates(record.date, startEndDates.startDate) >= 0 && functions.compareDates(record.date, startEndDates.endDate) <= 0)
            })
            return member;
        })
        for (let i = 0; i < staffMembersRecords.length; i++) {
            let leavesRecords = await requestModel.find({
                sender: staffMembersRecords[i].id,
                type: { $in: ['Annual Leaves', 'Sick Leaves', 'Accidental Leaves', 'Maternity Leaves', 'Compensation Leaves'] },
                status: "Accepted"
            })
            missingDaysHours = functions.missingDays_missingHours_extraHours(staffMembersRecords[i].attendanceRecords, leavesRecords, staffMembersRecords[i].dayOff, startEndDates.startDate, new Date())
            if (missingDaysHours.missingDays.length > 0 || missingDaysHours.missingHours > 0) {
                output.push(({
                    id: staffMembersRecords[i].id, name: staffMembersRecords[i].name,
                    missingHours: missingDaysHours.missingHours, extraHours: missingDaysHours.extraHours, dayOff: staffMembersRecords[i].dayOff, missingDays: missingDaysHours.missingDays
                }))
            }
        }
        res.send(output)
    } catch (error) {
        res.send(error)
    }
})

router.route('/findStaffMember').post(async (req, res) => {
    try {
        const member = await staffModel.findOne({ id: req.body.id })
        if (member)
            res.send(`found Member!`)
        else
            res.send(`Member Does not exist!!`)
    } catch (error) {
        res.send(error)
    }
})

router.route('/registerStaff').post(async (req, res) => {
    try {
        if (req.body.name && req.body.salary && req.body.office && req.body.dayOff && req.body.role.length > 0 && req.body.gender) {
            const foundDepartment = await departmentModel.findOne({ name: req.body.department })
            const fouudFaculty = await facultyModel.findOne({ name: req.body.faculty, departments: req.body.department })
            const validOffice = await locationModel.findOne({
                $and: [
                    { location: req.body.office },
                    { type: 'Office' },
                    {
                        $expr: {
                            $gt: ["$maxCapacity", "$currentCapacity"]
                        }
                    }
                ]
            })
            if (!validOffice) {
                res.send(`Location is either full or not an Office`)
            }
            else if ((req.body.role.includes("HR") && validOffice) || (fouudFaculty && foundDepartment && validOffice)) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash("123456", salt)
                let id;
                let idNumber = 1;
                if (req.body.role.includes("HR")) {
                    const staffMembers = await staffModel.find({ role: { $in: ["HR"] } })                    
                    staffMembers.forEach((staff) => {
                        let idString = staff.id
                        let idStringNumber = idString.substring(3, idString.length)
                        let idValue = parseInt(idStringNumber)
                        if (idValue > idNumber){
                            idNumber = idValue
                        }
                    })
                    idNumber++
                    id = "hr-" + idNumber
                    req.body.dayOff = 6
                }
                else { 
                    const staffMembers = await staffModel.find({ role: { $in: ['HOD', 'Coordinator', 'Instructor', 'TA'] } })
                    staffMembers.forEach((staff) => {
                        let idString = staff.id
                        let idStringNumber = idString.substring(3, idString.length)
                        let idValue = parseInt(idStringNumber)
                        if (idValue > idNumber){
                            idNumber = idValue
                        }
                    })
                    idNumber++
                    id = "ac-" + idNumber
                }
                const email = (req.body.name + "." + id + "@staff.guc.edu.eg")
                const calculatedData = {
                    email: email,
                    id: id,
                    password: hashedPassword
                }
                const fullData = { ...calculatedData, ...req.body }
                const newStaff = new staffModel(fullData)
                console.log(newStaff)
                await newStaff.save()
                await locationModel.updateOne({ location: req.body.office },
                    {
                        $inc:
                            { currentCapacity: 1 }
                    })
                if (req.body.role.includes("HOD")) {
                    await departmentModel.updateOne({ name: req.body.department }, { HOD: id })
                }
                res.send(`StaffMember Added successfully!`)
            }
            else {
                res.send(`please select a valid Faculty and Department`)
            }
        }
        else {
            res.send('please make sure to fill/choose all the required fields')
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/updateStaffMember').post(async (req, res) => {
    try {
        const member = await staffModel.findOne({ id: req.body.id })
        if (!member)
            res.send(`Staff member does not exist`)
        else {
            let response;
            if (req.body.updates.faculty) {
                const foundFaculty = await facultyModel.findOne({ name: req.body.updates.faculty })
                if (!foundFaculty)
                    response = 'Faculty does not exist!'
            }
            if (req.body.updates.department) {
                const foundDepartment = await departmentModel.findOne({ name: req.body.updates.department })
                if (!foundDepartment)
                    response = `Department does not exist!`
            }
            if (!req.body.updates.faculty && !req.body.updates.department) {
                res.send('')
            }
            else if (response)
                res.send(response)
            else {
                await staffModel.findOneAndUpdate({ id: req.body.id }, req.body.updates)
                res.send(`StaffMember updated successfully!`)
            }
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/deleteStaffMember').post(async (req, res) => {
    try {
        const member = await staffModel.findOneAndDelete({ id: req.body.staffMember })
        if (!member) {
            res.send('Staff Member does not exist!')
        }
        else {
            await scheduleModel.updateMany({ academicMember: req.body.staffMember }, { academicMember: null })
            await courseModel.updateMany({}, {
                $pull: {
                    instructors: req.body.staffMember,
                    TAs: req.body.staffMember
                }
            },
                { multi: true })
            await courseModel.updateMany({ coordinator: req.body.staffMember }, { coordinator: null })
            await requestModel.deleteMany({
                $or: [
                    { sender: req.body.staffMember },
                    { receiver: req.body.staffMember }]
            })
            await locationModel.findOneAndUpdate({ location: member.office }, { $inc: { currentCapacity: - 1 } })
            await departmentModel.updateMany({ HOD: member.id }, { HOD: null })
            res.send(`Staff member deleted successfully!`)
        }
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;