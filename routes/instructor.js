const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const express = require("express");
const router = express.Router();
const courseM = require("../models/course");
const schM = require("../models/Schedule");
const staffM = require("../models/StaffMember");
const { read } = require("fs");
require("dotenv").config();

// router.use(async (req, res, next) => {
//   try {
//     const role = req.user.role
//     console.log(role)
//     if (role.includes("instructor")) {
//       next();
//     }

//   } catch (error) {
//     res.send("You are not allowed!")
//     res.end();
//   }
// })

router.route("/viewCoverage").post(async (req, res) => {
  try {
    const coverage = await courseM.find(
      //change
      { instructors: req.user.id },
      { name: 1, instructors: 1, coordinator: 1, TAs: 1, _id: 1 }
    );
    if (coverage.length == 0) {
      res.send([]);
    } else {
      res.send(coverage);
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/viewSlots").post(async (req, res) => {
  try {
      //change
    const courses = await courseM.find({ instructors: req.user.id });
    const slots = [];
    for (var i = 0; i < courses.length; i++) {
      var courseName = courses[i].name;
      var schedules = await schM.find(
        { course: courseName },
        { course: 1, day: 1, slot: 1, academicMember: 1, location: 1, _id: 1 }
      );
      for (var j = 0; j < schedules.length; j++) {
        if (schedules[j].length != 0) {
          slots.push(schedules[j]);
        }
      }
    }
    if (slots.length == 0) {
      res.send([]);
    } else {
      res.send(slots);
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/getCovNames").post(async (req, res) => {
  try {
    //change
    const coverage = await courseM.find({ instructors: req.user.id });
    if (coverage.length == 0) {
      res.send([]);
    } else {
      res.send(coverage);
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/getSlotIDs").post(async (req, res) => {
  try {
      //change
    const courses = await courseM.find({ instructors: req.user.id });
    const slots = [];
    for (var i = 0; i < courses.length; i++) {
      var courseName = courses[i].name;
      var schedules = await schM.find(
        { course: courseName },
        {
          _id: 1
        }
      );
      for (var j = 0; j < schedules.length; j++) {
        if (schedules[j].length != 0) {
          slots.push(schedules[j]);
        }
      }
    }
    if (slots.length == 0) {
      res.send([]);
    } else {
      res.send(slots);
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/viewStaffdep").post(async (req, res) => {
  try {
    //change
    const mydep = await staffM.findOne({ id: req.user.id });
    const deps = mydep.department;
    const staff = await staffM.find(
      { department: deps },
      { password: 0 }
    );
    if(staff.length==0){
      res.send([])
    }else{
    res.send(staff)
  }
  } catch (err) {
    res.send(err);
  }
});
router.route("/viewStaffid").post(async (req, res) => {
  try {
      //change
    const myrole = await staffM.findOne({ id: req.user.id });
    const role = myrole.role;
    if (!role.includes("Instructor")) {
      res.send("You shall not pass");
    } else {
      //change
      const res2 = [req.user.id];
      //change
      const info = await courseM.find({ instructors: req.user.id });
      for (var i = 0; i < info.length; i++) {
        if (!res2.includes(info[i].coordinator)) {
          res2.push(info[i].coordinator);
        }
        for (var j = 0; j < info[j].instructors.length; j++) {
          if (!res2.includes(info[j].instructors[j])) {
            res2.push(info[j].instructors[j]);
          }
        }
        for (var j = 0; j < info[j].TAs.length; j++) {
          if (!res2.includes(info[j].TAs[j])) {
            res2.push(info[j].TAs[j]);
          }
        }
      }
      const res3 = [];
      for (var i = 0; i < res2.length; i++) {
        const entry = await staffM.findOne({ id: res2[i] }, { password: 0 });
        if (entry != null) {
          res3.push(entry);
        }
      }
      if (res3.length == 0) {
        res.send([]);
      } else {
        res.send(res3);
      }
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/assignToUnassigned").post(async (req, res) => {
  try {
    if (!req.body.scheduleId||!req.body.id) {
      res.send("Please enter the info");
    } else {
      const check = await staffM.find({ id: req.body.id });
      if (check.length == 0) {
        res.send("This staff member does not exist");
      } else {
        const schedule = await schM.findOne({
          _id: req.body.scheduleId,
          academicMember: null,
        });

        if (schedule) {
          await schM.findOneAndUpdate(
            { _id: schedule._id },
            { academicMember: req.body.id }
          );
          res.send("Updated!");
        } else {
          res.send("Already taken!");
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
});
router.route("/updateMem").post(async (req, res) => {
  try {
    if (!req.body.scheduleId||!req.body.id) {
      res.send("Please enter the info");
    } else {
      const check = await staffM.find({ id: req.body.id });
      if (check.length == 0) {
        res.send("This staff member does not exist");
      } else {
        const check2 = await schM.findOne({ _id: req.body.scheduleId })
        if ( check2.academicMember==null) {
            res.send("There is no one to update")
        } else {
          const schedule = await schM.findOneAndUpdate(
            { _id: req.body.scheduleId },
            { academicMember: req.body.id }
          );
          if (schedule) {
            res.send("Updated!");
          } else {
            res.send("Schedule not found!");
          }
        }
      }
    }
  } catch (err) {
    res.send("Schedule not found!");
  }
});
router.route("/DelMem").post(async (req, res) => {
  try {
    if (!req.body.scheduleId) {
      res.send("Please pick an ID");
    } else {
      const schedule = await schM.findOneAndUpdate(
        { _id: req.body.scheduleId },
        { academicMember: null }
      );
      if (schedule) {
        res.send("Deleted!");
      } else {
        res.send("Schedule not found!");
      }
    }
  } catch (err) {
    send.res("Schedule not found!");
  }
});
router.route("/assignCourseC").post(async (req, res) => {
  try {
    if (!req.body.courseName) {
      res.send("Please pick a course");
    } else {if(! req.body.coorID){res.send("Please enter the member name")}else{
      const check = await staffM.find({ id: req.body.coorID });
      if (check.length == 0) {
        res.send("This staff member does not exist");
        return;
      }
      const temp = await courseM.findOne({ name: req.body.courseName });
      if (temp.coordinator == req.body.coorID) {
        res.send(
          "This person is already assigned as an coordinator to this course"
        );
      } else {
        const temp9 = await staffM.findOne(
          { id: req.body.coorID }
        );
        if(temp9.role.includes("Coordinator")){
        }else{
        await staffM.findOneAndUpdate(
          { id: req.body.coorID },
          { $push: { role: ["Coordinator"] } }
        )
      }
        await courseM.findOneAndUpdate(
          { name: req.body.courseName },
          { coordinator: req.body.coorID }
        );
        res.send("The coordinator has been assigned successfully");
      }
    }}
  } catch (err) {
    res.send(err);
  }
});
router.route("/removeMember").post(async (req, res) => {
  try {
    if (!req.body.courseName) {
      res.send("Please pick a Name");
    } else {if(!req.body.memID){res.send("Please enter the member ID")}else{
      const check = await staffM.find({ id: req.body.memID});
      if (check.length == 0) {
        res.send("This staff member does not exist");
      } else {
    const course = await courseM.findOne({ name: req.body.courseName });
    const sched = await schM.find({ course: req.body.courseName });
    const id = req.body.memID;
    const coor = course.coordinator;
    if (id == coor) {
      await courseM
        .findOne({ name: req.body.courseName })
        .updateOne({ coordinator: null });
      res.send("Coordinator has been removed");
    } else {
      if (course.instructors.includes(id)) {
        res.send("You cannot remove another instructor");
      } else {
        if (!course.TAs.includes(id)) {
          res.send("The ID entered was not found in this course");
          return;
        }
        await courseM
          .findOne({ name: req.body.courseName })
          .updateOne({ $pull: { TAs: id } });
        res.send("TA has been removed");
        for (var i = 0; i < sched.length; i++) {
          if (sched[i].academicMember == id) {
            await schM
              .findOne({ _id: sched[i]._id })
              .updateOne({ academicMember: null });
          }
        }
      }
    }}}}
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
