const express = require('express');
const router = express.Router();
const staffMemberModel = require('../models/StaffMember')
const scheduleModel = require('../models/Schedule')
const departmentModel = require('../models/department')
const courseModel = require('../models/course')
const requestModel = require('../models/Request')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { response } = require('express');
const e = require('express');
require('dotenv').config();

/*router.use(async (req,res,next)=> {
    try {
        const role = req.user.role
        //console.log(role)
        if(role.includes("HOD")){
            next();
        }
        
    } catch (error) {
        res.send("You are not allowed!")
        res.end();
    }
})*/

/*  This route to assign an Instructor to a course*/
router.route('/assignCourse')
    .post(async (req, res) => {
        try {
            const staff_ID = req.user.id
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;   //needed
            //Course Info
            const course_ID = req.body.courseid;
            const course = await courseModel.findOne({ name: course_ID })
            if (course == null) {
                res.send("The id of the course is not in our database")
            }//else{
            const courseInstructors = course.instructors  //needed
            //}
            //Instructor Info
            const AssignedStaff_ID = req.body.staffid
            const Assignedmemberstaff = await staffMemberModel.findOne({ id: AssignedStaff_ID })
            if (Assignedmemberstaff == null) {
                res.send("The id of the member is not in our database")
            } else {
                var department_of_Assignedmemberstaff = Assignedmemberstaff.department //needed
                var role_of_Assignedmemberstaff = Assignedmemberstaff.role;  //needed
            }
            //department Info
            const depart = await departmentModel.findOne({ name: department_of_memberstaff })
            const departCourses = depart.courses
            if (role_of_memberstaff.includes("HOD")) {
                if (role_of_Assignedmemberstaff.includes("Instructor")) {
                    if (department_of_memberstaff == department_of_Assignedmemberstaff) {
                        if (departCourses.includes(course.name)) {
                            try {
                                if (courseInstructors.indexOf(Assignedmemberstaff.id) == -1) {
                                    courseInstructors.push(Assignedmemberstaff.id)
                                    console.log(courseInstructors)
                                    await courseModel.updateOne({ name: course_ID }, { instructors: courseInstructors })
                                    res.send("The instructor assigned successfully")
                                }
                                else {
                                    res.send("The instructor is already signed to that course")
                                }
                            }
                            catch (error) {
                                res.send(error)
                                console.log("There is an error")
                            }
                        }
                        else {
                            res.send("course was not found in this department as you try to access different department ")
                        }
                    }
                    else {
                        res.send("You are trying to assign one from another department")
                    }
                }
                else {
                    res.send("The role of staff_id is not a instructor")
                }
            }
            else {
                res.send("You are not allowed to do that cuz you are not an HOD")
            }
        }
        catch (error) {
            res.send(error)
            console.log("There is an error")
        }


    });

//The end of the route to assign a constructor
//This route is to update the constructor
router.route('/updateCourseInstructors')
    .post(async (req, res) => {

        try {
            const staff_ID = req.user.id
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;   //needed
            //Course Info
            const course_ID = req.body.courseid;
            const course = await courseModel.findOne({ name: course_ID })
            if (course == null) {
                res.send('The id is not in our database')
            }
            else {
                var courseInstructors = course.instructors  //needed
            }
            //Instructor Info
            const AssignedStaff_ID = req.body.staffid
            const Assignedmemberstaff = await staffMemberModel.findOne({ id: AssignedStaff_ID })
            if (Assignedmemberstaff == null) {
                res.send("The id of the member is not in our database")
            }
            else {
                var department_of_Assignedmemberstaff = Assignedmemberstaff.department //needed
                // console.log(Assignedmemberstaff.department)
                var role_of_Assignedmemberstaff = Assignedmemberstaff.role;  //needed*/
                var depart = await departmentModel.findOne({ name: department_of_Assignedmemberstaff })
                var departCourses = depart.courses
            }
            //updated Instructor
            const updatedAssignedStaff_ID = req.body.updatedstaffid
            const updatedAssignedmemberstaff = await staffMemberModel.findOne({ id: updatedAssignedStaff_ID })
            console.log(updatedAssignedmemberstaff)
            if (updatedAssignedmemberstaff == null) {
                res.send("The id is not in our database")
            }
            else {
                var department_of_updatedAssignedmemberstaff = updatedAssignedmemberstaff.department
                //console.log(department_of_updatedAssignedmemberstaff)
                //needed
                var role_of_updatedAssignedmemberstaff = updatedAssignedmemberstaff.role;
            }
            /*if(department_of_memberstaff!=department_of_Assignedmemberstaff){                   /////////////////
                res.send("you are trying to update with a member from another department")
            }*/
            if (role_of_memberstaff.includes("HOD")) {
                if (role_of_Assignedmemberstaff.includes("Instructor")) {
                    if (department_of_updatedAssignedmemberstaff === department_of_Assignedmemberstaff) {
                        if (departCourses.includes(course.name)) {
                            //try{
                            if (courseInstructors.includes(Assignedmemberstaff.id)) {
                                res.send("You are trying to update with already assigned instructor")
                            }
                            else {
                                var index = courseInstructors.indexOf(updatedAssignedStaff_ID)
                                if (index != -1) {
                                    courseInstructors[index] = Assignedmemberstaff.id
                                    await courseModel.updateOne({ name: course_ID }, { instructors: courseInstructors })
                                    res.send("The instructor updated successfully")
                                }
                                else {
                                    res.send("You are trying to update a non existant one")
                                }
                            }
                            //}/*catch(error){
                            //  console.log("There is an error")    
                            // res.send(error)
                            //}*/
                        }
                        else {
                            res.send("course was not found in this department as you try to access different department ")
                        }
                    }
                    else {
                        res.send("You are trying to assign one from another department")
                    }
                }
                else {
                    res.send("The role of staff_id is not a constructor")
                }
            }
            else {
                res.send("You are not allowed to do that cuz you are not an HOD")
            }
        }
        catch (error) {
            // console.log("You are trying to delete one from another department")    
            res.send("You are trying to update with one from another department")
        }

    });

router.route('/deleteCourseInstructors')
    .post(async (req, res) => {

        try {
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;   //needed
            //Course Info
            const course_ID = req.body.courseid;
            const course = await courseModel.findOne({ name: course_ID })
            if (course == null) {
                res.send("The id of the course is not in our database")   //needed
            }
            else {
                var courseInstructors = course.instructors
            }
            //Instructor Info
            const AssignedStaff_ID = req.body.staffid
            const Assignedmemberstaff = await staffMemberModel.findOne({ id: AssignedStaff_ID })
            if (Assignedmemberstaff == null) {
                res.send("The member is not in our database")
            }
            else {
                var department_of_Assignedmemberstaff = Assignedmemberstaff.department //needed
                var role_of_Assignedmemberstaff = Assignedmemberstaff.role;  //needed
            }
            //department Info
            const depart = await departmentModel.findOne({ name: department_of_memberstaff })
            const departCourses = depart.courses
            //needed      
            if (role_of_memberstaff.includes("HOD")) {
                if (role_of_Assignedmemberstaff.includes("Instructor")) {
                    if (department_of_memberstaff == department_of_Assignedmemberstaff) {
                        if (departCourses.includes(course.name)) {
                            try {
                                if (courseInstructors.indexOf(Assignedmemberstaff.id) != -1) {
                                    var index = courseInstructors.indexOf(Assignedmemberstaff.id)
                                    courseInstructors.splice(index, 1)
                                    await courseModel.updateOne({ name: course_ID }, { instructors: courseInstructors })
                                    res.send("The instructor was deleted successfully")
                                }
                                else {
                                    res.send("The instructor is already deleted from that course")
                                }
                            }
                            catch (error) {
                                console.log("There is an error")
                                //res.send("You are trying to delete one from another department")    
                            }
                        }
                        else {
                            res.send("course was not found in this department as you try to access different department ")
                        }
                    }
                    else {
                        res.send("You are trying to delete one from another department")
                    }
                }
                else {
                    res.send("The role of staff_id is not an Instructor")
                }
            }
            else {
                res.send("You are not allowed to do that cuz you are not an HOD")
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    });


router.route('/viewStaffdepartment')
    .get(async (req, res) => {

        try {
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;   //needed
            if (role_of_memberstaff.includes("HOD")) {
                try {
                    const staff = await staffMemberModel.find({ department: department_of_memberstaff }, { password: 0 })
                    res.send(staff)
                }
                catch (error) {
                    console.log("There is error")
                    res.send(error)
                }
            }
            else {
                res.send("You are not allowed to do this cuz it is not your department")
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    });

router.route('/viewCoursestaff')
    .post(async (req, res) => {

        try {

            //HOD ID was taken from token
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            //needed
            const role_of_memberstaff = memberstaff.role;   //needed
            //Course Info
            const course_ID = req.body.courseid;
            const course = await courseModel.findOne({ name: req.body.courseid })
            if (course == null) {
                res.send("this course doesn't exist at all")
            }
            else {
                var courseInstructors = course.instructors  //needed
                var courseCoordinator = course.coordinator
                var courseTAs = course.TAS
            }
            //res.send(course.instructors)
            //Department Info

            const depart = await departmentModel.findOne({ name: department_of_memberstaff })
            const departCourses = depart.courses
            var Info = []  //To save the information about course staff 
            if (role_of_memberstaff.includes("HOD")) {
                if (departCourses.includes(course.name)) {
                    //res.send(courseInstructors)
                    try {
                        for (var i = 0; i < (course.instructors).length; i++) {
                            const information_of_instructor = await staffMemberModel.findOne({ id: (course.instructors)[i] }, { password: 0 })
                            Info.push(information_of_instructor)
                        }
                        for (var z = 0; z < (course.TAs).length; z++) {
                            const information_of_TAS = await staffMemberModel.findOne({ id: (course.TAS)[i] }, { password: 0 })
                            Info.push(information_of_TAS)
                        }
                        const information_of_coordinator = await staffMemberModel.findOne({ id: course.coordinator }, { password: 0 })

                        Info.push(information_of_coordinator)
                        res.send(Info)
                    }
                    catch (error) {
                        console.log("There is an error")
                        res.send(error)
                    }
                }
                else {
                    res.send("You are accessing a course from another department")
                }
            }
            else {
                res.send("You are not a HOD to do that")
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })


router.route('/viewAllthestaffdayoff')
    .get(async (req, res) => {
        try {
            //HOD INFO WE GET FROM THE TOKEN
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })            
            const role_of_memberstaff = memberstaff.role;   //needed 
            if (role_of_memberstaff.includes("HOD")) {
                try {
                    const staff = await staffMemberModel.find({ department: memberstaff.department })
                    res.send(staff)
                }
                catch (error) {
                    console.log("There is an error")
                    res.send(error)
                }
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    });

router.route('/viewSinglestaffdayOff')
    .post(async (req, res) => {
        try {
            //HOD INFO WE GET FROM THE TOKEN
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;
            //Information about the staff that we would get from the req.body.id
            const staffid_dayoff = await staffMemberModel.findOne({id : req.body.staffid}, {password : 0,_id : 0, loggedInBefore : 0, attendanceRecords: 0,
            salary: 0, annualLeaves: 0, accidentalLeaves: 0, picture: 0, role: 0})
            if (staffid_dayoff) {
                var department_of_memberstaff_dayoff = staffid_dayoff.department
            }
            if (role_of_memberstaff.includes("HOD")) {
                if (department_of_memberstaff == department_of_memberstaff_dayoff) {
                    try {
                       
                        res.send(staffid_dayoff)
                    }
                    catch (error) {
                        console.log("There is an error1")
                        res.send(error)
                    }
                }
                else {
                    res.send("That member is not in your department")
                }
            }
            else {
                res.send("You are not authorized to do that cuz you are trying to access diferrent department")
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send("error")
        }

    })

router.route('/viewRequestsdayoffoRleaves')
    .get(async (req, res) => {

        try {
            //HOD INFO WE GET FROM THE TOKEN
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const role_of_memberstaff = memberstaff.role;
            const requests = await requestModel.find({ $or: [{ type: "Change dayoff" }, { type: "Annual Leaves" }, { type: "Sick Leaves" }, { type: "Accidental Leaves" }, { type: "Maternity Leaves" }, { type: "Compensation Leaves" }] })
            var request_staff = []
            //'Annual Leaves', 'Sick Leaves', 'Accidental Leaves', 'Maternity Leaves', 'Compensation Leaves'
            try {
                for (var i = 0; i < requests.length; i++) {
                    const request_sender_id = (requests[i]).sender
                    const senderstaff = await staffMemberModel.findOne({ id: request_sender_id })
                    const department_of_sender = senderstaff.department
                    if (department_of_memberstaff == department_of_sender) {
                        request_staff.push(requests[i])
                    }
                }
                res.send(request_staff)
            }
            catch (error) {
                console.log("There is an error")
                res.send(error)
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })

router.route('/AcceptRequest')
    .post(async (req, res) => {
        try {
            const req_given_type = req.body.req_id
            const reqx = await requestModel.findOne({ _id: req_given_type })
            const sender_of_the_request = reqx.sender
            if (reqx == null) {
                res.send("No request with such id")
            }
            const sendermodel = await staffMemberModel.findOne({ id: reqx.sender })
            const dayoff_of_the_sender_before_accepting = sendermodel.dayOff
            var annualLeaves_of_the_sender = sendermodel.annualLeaves
            var accidentalLeaves_of_the_sender = sendermodel.accidentalleaves
            const schedule_of_sender = await scheduleModel.find({ academicMember: reqx.sender })
            //day that you wanna change
            const dayToget = req.body.day
            try {
                if (reqx.type == "Change dayoff") {
                    if (req.body.day) {
                        await requestModel.updateOne({ _id: req_given_type }, { status: "Accepted" })
                        for (var i = 0; i < schedule_of_sender.length; i++) {
                            if (dayToget == (schedule_of_sender[i].day))
                                await scheduleModel.updateOne({ academicMember: reqx.sender, day: schedule_of_sender[i].day }, { academicMember: null })
                        }
                        await staffMemberModel.updateOne({ id: reqx.sender }, { dayOff: req.body.day })
                        res.send("Your request has been accepted")
                    }
                    else {
                        res.send("Please enter your day off!")
                    }
                }

                if (reqx.type == "Annual Leaves") {
                    if (annualLeaves_of_the_sender < 30) {
                        await requestModel.updateOne({ _id: req_given_type }, { status: "Accepted" })
                        annualLeaves_of_the_sender = annualLeaves_of_the_sender + 1;
                        await staffMemberModel.updateOne({ id: sender_of_the_request }, { annualLeaves: annualLeaves_of_the_sender })
                        res.send("Your request has been accepted")
                    }
                    else {
                        await requestModel.updateOne({ _id: req_given_type }, { status: "Rejected" })
                        res.send("Your annual leaves has exceded the limit")
                    }
                }
                if (reqx.type == "Accidental Leaves") {
                    if (accidentalLeaves_of_the_sender > 0) {
                        await requestModel.updateOne({ _id: req_given_type }, { status: "Accepted" })
                        accidentalLeaves_of_the_sender = accidentalLeaves_of_the_sender - 1;
                        await staffMemberModel.updateOne({ id: sender_of_the_request }, { accidentalLeaves: accidentalLeaves_of_the_sender })
                        res.send("Your request has been accepted")
                    }
                    else {
                        await requestModel.updateOne({ _id: req_given_type }, { status: "Rejected" })
                        res.send("Your accidental leaves has exceded the limit")
                    }
                }

                else {               //Ana 3ddlt hena bdl ma kane else bs 7atet if() w shelt else
                    await requestModel.updateOne({ _id: req_given_type }, { status: "Accepted" })
                    //res.send("done3")
                }
                res.send()



                //res.send()   //3mlt comment hena
            }
            catch (error) {
                console.log("There is an error1")
                res.send(error)
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })

router.route('/rejectRequest')
    .post(async (req, res) => {
        //Info of a Given A Request from post
        try {
            const req_given_type = req.body.req_id
            const reqx = await requestModel.findOne({ _id: req_given_type })
            const sender_of_the_request = reqx.sender
            if (reqx == null) {
                res.send("No request with such id")
            }
            //day that you wann change
            const dayToget = req.body.day
            console.log(12)
            try {
                console.log(req_given_type)
                await requestModel.updateOne({ _id: req_given_type }, { status: "Rejected" })
                res.send("Your request has been Rejected")
            }
            catch (error) {
                console.log("There is an error1")
                res.send(error)
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })

router.route('/viewCoursecoverage')
    .post(async (req, res) => {

        try {
            //The id of the course that i would take as an input 
            const course_id = req.body.id
            const course = await courseModel.findOne({ name: course_id })
            if (course == null) {
                res.send("The course id is not in our database")
            }
            else {
                var instructorsofcourse = course.instructors
                var number_of_instructors = instructorsofcourse.length
                var coordinator = course.coordinator
            }
            console.log(coordinator)
            if (coordinator != null) {
                var numberofcoordinator = 1
            }
            else {
                numberofcoordinator = 0
            }
            const tasofcourse = course.TAs
            const number_of_Tas = tasofcourse.length
            const slots = await scheduleModel.find({ course: req.body.id })
            const number_of_slots = slots.length
            //Here i would take information about schedule using courseid
            try {
                //console.log(slots)
                const total = number_of_instructors + number_of_Tas + numberofcoordinator
                console.log(total)
                var coverage = (100 * number_of_slots) / total //Anna 8yrt hena
                console.log(coverage)
                res.status(200).send((coverage).toString());
            }
            catch (error) {

                console.log("There is an error")
                res.send(error)
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })

router.route('/viewteachingassignments')
    .post(async (req, res) => {

        try {
            const staff_ID = req.user.id;
            const memberstaff = await staffMemberModel.findOne({ id: staff_ID })
            const department_of_memberstaff = memberstaff.department
            const course_given = req.body.courseid
            const departmentx = await departmentModel.findOne({ name: department_of_memberstaff })
            const courses_of_departmentx = departmentx.courses
            const coursegiven = await courseModel.findOne({ name: course_given })
            console.log(coursegiven)
            if (!coursegiven) {
                res.send("The course id is not in our database")
            }
            try {
                if (courses_of_departmentx.includes(course_given)) {
                    const teaching_assignments = await scheduleModel.find({ course: course_given })
                    res.send(teaching_assignments)
                }
                else {
                    res.send("The course is not in your department")
                }
            }
            catch (error) {
                console.log("There is an error")
                res.send(error)
            }
        }
        catch (error) {
            console.log("There is an error")
            res.send(error)
        }

    })

module.exports = router;