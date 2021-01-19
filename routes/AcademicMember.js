const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const express = require('express')
const router = express.Router()
const staffModel = require('../models/StaffMember')
const scheduleModel = require('../models/Schedule')
const departmentModel = require('../models/department')
const courseModel = require('../models/course')
const requestModel = require('../models/Request')
const jwt = require('jsonwebtoken') 
const functions = require('./functions')
const { request } = require('http')
require('dotenv').config()

////////////////////////////////////////////ACADEMIC MEMBER////////////////////////////////////////////////////////////////////////////////////////////
//router.use(async (req, res, next) => {
//    try {
  //      const role = req.user.role
 ////       if (role.includes("TA")) {
        //    next();
 //       }
  //  } catch (error) {
 //       res.send("You are not allowed!")
  //      res.end();
  //  }
//})
router.route('/viewSchedule').get(async (req, res) => {
   
    try {
        const schedule = await scheduleModel.find({ academicMember: req.user.id })
        const startEndDates = functions.getStartEndDates()
        const startDate = startEndDates.startDate
        const endDate = startEndDates.endDate
        const replacementRequests = (await requestModel.find({ receiver: req.user.id , status: 'Accepted' })).filter(function (request) {
            return (functions.compareDates(startDate, request.startDate) <= 0 && functions.compareDates(endDate, request.startDate) >= 0)
        })
        let replacedSlots = []
        for (let i = 0; i < replacementRequests.length; i++) {
            let replacementSlot = {
                date: replacementRequests[i].startDate,
                slot: await scheduleModel.findOne({ _id: replacementRequests[i].schedule_ID })
            }
            replacedSlots.push(replacementSlot)
        }
        const output = {
            schedule: schedule,
            ReplacementSchedule: replacedSlots
        }
        res.send(output)
    } catch (error) {
        res.send(error)
    }
})

router.route('/slotLinking').post(async (req, res) => {
    try {
        const schedule = await scheduleModel.findOne({ _id: req.body.schedule })
        if (schedule) {
            const course = await courseModel.findOne({ name: schedule.course })
            if (course.coordinator) {
                if (course.TAs.includes(req.body.sender) || course.instructors.includes(req.body.sender) || course.coordinator == req.body.sender) {
                    const request = new requestModel({
                        type: 'Slot Linking',
                        sender: req.body.sender,
                        receiver: course.coordinator,
                        requestDate: new Date(),
                        status: 'Pending',
                        schedule_ID: req.body.schedule
                    })
                    await request.save()
                    res.send('Request sent Successfully')
                }
                else {
                    res.send(`you are not registered as an academic member in Course ${course.name}`)
                }
            }
            else {
                res.send(`Course ${course.name} does not have a coordinator`)
            }
        }
        else {
            res.send(`Schedule is invalid!`)
        }
    } catch (error) {
        res.send(error)
    }
})

router.route('/viewReplacementRequest').get(async (req, res) => {
    try {
        const request_sender = await requestModel.find({ type: 'Replacement', sender: req.user.id })
        const req_reciver = await requestModel.find({ type: 'Replacement', receiver: req.user.id })
        res.send({ sent_requests: request_sender, received_requests: req_reciver })

    } catch (error) {
        res.send(error)
    }
})

router.route('/SendRequest').post(async (req, res) => {
    try {
        const member = await staffModel.findOne({ id: req.user.id })
        const department = member.department
        const hod = (await departmentModel.findOne({ name: department })).HOD
        let startDate, endDate
        if (req.body.startDate)
            startDate = new Date(req.body.startDate)
        if (req.body.endDate)
            endDate = new Date(req.body.endDate)
        if (req.body.type == 'Annual Leaves') {
            if (member.annualLeaves < 1) {
                console.log(member.annualLeaves)
                res.send("you annual balance is insufficient")
            }
            else {
                const sched = await scheduleModel.find({ academicMember: req.user.id, day: startDate.getDay() });
                if (department) {
                    const request = new requestModel({
                        type: 'Annual Leaves',
                        sender: req.user.id,
                        receiver: hod,
                        requestDate: (new Date()).setHours(2, 0, 0),
                        status: 'Pending',
                        startDate: startDate,
                        endDate: endDate
                    })
                    await request.save();
                    res.send("Request sent with success!")
                    res.end()
                }
                else {
                    const foundReplacments = (await requestModel.find({
                        sender: req.user.id,
                        type: 'Replacement',
                        status: 'Accepted'
                    })).filter(function (request) {
                        return functions.compareDates(startDate, request.startDate) == 0
                    })
                    const receivers = foundReplacments.map(function (request) {
                        return request.receiver
                    })
                    const request = new requestModel({
                        type: 'Annual Leaves',
                        sender: req.user.id,
                        receiver: hod,
                        requestDate: (new Date()).setHours(2, 0, 0),
                        status: 'Pending',
                        startDate: startDate,
                        endDate: endDate,
                        replacementList: receivers
                    })
                    await request.save();
                    res.send("Request sent with success!")
                    res.end()
                }
            }
        }
        else if (req.body.type == 'Accidental Leaves') {
            if ((member.accidentalLeaves == 0) || (member.annualLeaves < 1)) {
                res.send("Maximum accidental Leaves reached")
            }
            else {
                const request = new requestModel({
                    type: 'Accidental Leaves',
                    sender: req.user.id,
                    receiver: hod,
                    requestDate: (new Date()).setHours(2, 0, 0),
                    status: 'Pending',
                    startDate: startDate,
                    endDate: endDate,
                    comment: req.body.comment
                })
                await request.save();
                res.send("Request sent with success!")
            }
        }
        else if (req.body.type == 'Sick Leaves') {
            const requestDate = new Date()
            if (requestDate.getDate() - startDate.getDate() > 3) {
                res.send("Invalid Request")
            } else {
                const request = new requestModel({
                    type: 'Sick Leaves',
                    sender: req.user.id,
                    receiver: hod,
                    requestDate: (new Date()).setHours(2, 0, 0),
                    status: 'Pending',
                    startDate: startDate,
                    endDate: (new Date(startDate)).setDate(startDate.getDate() + 15),
                    document: req.body.document
                })
                await request.save();
                res.send("Request sent with success!")
            }
        }
        else if (req.body.type == 'Maternity Leaves') {
            if (member.gender == 'Male') {
                res.send("Invalid Request")
            } else {
                const request = new requestModel({
                    type: 'Maternity Leaves',
                    sender: req.user.id,
                    receiver: hod,
                    requestDate: (new Date()).setHours(2, 0, 0),
                    status: 'Pending',
                    startDate: startDate,
                    endDate: (new Date(startDate)).setDate(startDate.getDate() + 15),
                    document: req.body.document
                })
                await request.save();
                res.send("Request sent with success!")
            }
        }
        else if (req.body.type == 'Compensation Leaves') {
            const dates = functions.getStartEndDates();
            const Startmonth = dates.startDate;
            const Endmonth = dates.endDate;
            const compensationDate = new Date(req.body.compensationDate)
            compensationDate.setHours(2,0,0)
            if (functions.compareDates(startDate, Startmonth) >= 0 && functions.compareDates(startDate, Endmonth) <= 0
                && functions.compareDates(compensationDate, Startmonth) >= 0 && functions.compareDates(compensationDate, Endmonth) <= 0) {   
                const foundCompensation = functions.foundAttendaceRecord(member.attendanceRecords, compensationDate)
                if (foundCompensation) {
                    const request = new requestModel({
                        type: 'Compensation Leaves',
                        sender: req.user.id,
                        receiver: hod,
                        requestDate: (new Date()).setHours(2, 0, 0),
                        status: 'Pending',
                        startDate: startDate,
                        endDate: endDate,
                        compensationDate: compensationDate
                    })
                    await request.save();
                    res.send("Request sent with success!")
                }
                 else {
                    res.send('invalid compensation request')
                }
            }
        } 
        else if (req.body.type == 'Change dayoff') {
            if(req.body.newDayOff == 5){
                res.send("You cannot choose Friday as your dayoff!")
            }
            else{
                const request = new requestModel({
                type: 'Change dayoff',
                sender: req.user.id,
                receiver: hod,
                requestDate: (new Date()).setHours(2, 0, 0),
                status: 'Pending',
                changedDayOff: req.body.newDayOff
                })
                await request.save();
                res.send("Request sent with success!")
            }
        }

        else if (req.body.type == 'Replacement') {
            const slot = await scheduleModel.findOne({ _id: req.body.slot })
            if (slot) {
                const Course = await courseModel.findOne({ name: slot.course })
                const receiver = await staffModel.findOne({ id: req.body.receiver })
                if (receiver && receiver.department == department &&
                    (Course.TAs.includes(req.body.receiver) || Course.coordinator == req.body.receiver)) {
                    if (startDate.getDay() == slot.day) {
                        const request = new requestModel({
                            type: 'Replacement',
                            sender: req.user.id,
                            receiver: req.body.receiver,
                            requestDate: (new Date()).setHours(2, 0, 0),
                            startDate: startDate,
                            status: 'Pending',
                            schedule_ID: req.body.slot

                        })
                        await request.save()
                        res.send("Request sent with success!")
                    } else {
                        res.send("No avaliable schedules on this day")
                    }

                } else {
                    res.send("Can't find a reciver")
                }
            }
            else {
                res.send("make sure to select a valid Slot")
            }
        }
        else
            res.send("there is an error sending your request")
    } 
    catch (error) {
        res.send("Invalid Date")
    }
})

router.route('/ViewRequest').get(async (req, res) => {
    try {
        if(req.query.status){
            const request = await requestModel.find({sender:req.user.id , status: req.query.status})
            res.send(request)
        }
         else {
             res.send(await requestModel.find({sender:req.user.id}))
         }
    } catch (error) {
        res.send(error)
    }
})

router.route('/CancelRequest').post(async (req, res) => {
    try {
        const request = await requestModel.findOne({ _id: req.body._id })
        if (request) {
            if (request.status == 'Pending' || request.status == 'Rejected') {
                await requestModel.deleteOne({ _id: request._id })
                res.send("Request deleted successfully!")
            }
            else if (request.status == 'Accepted' && (functions.compareDates(request.startDate, (new Date()).setHours(2, 0, 0)) == 1)){
                if (request.type == 'Annual Leaves')
                    await staffModel.findOneAndUpdate({id : req.user.id}, {$inc : {annualLeaves : 1}})
                else if (request.type == 'Accidental Leaves') 
                    await staffModel.findOneAndUpdate({id : req.user.id}, {$inc : {annualLeaves : 1, accidentalLeaves : 1}})
                await requestModel.deleteOne({ _id: request._id })
                res.send("Request deleted successfully!")
            }
            else {
                res.send("you can't cancel this request!")
            }
        } else {
            res.send("Can't find request")
        }
    }
    catch (error) {
        res.send(error)
    }
})

module.exports = router