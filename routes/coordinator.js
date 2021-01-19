const reqM = require("../models/Request");
const courseM = require("../models/course");
const schM = require("../models/Schedule");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// router.use(async (req, res, next) => {
//     try {
//         const role = req.body.role
//         //console.log(role)
//         if (role.includes("coordinator")) {
//             next();
//         }

//     } catch (error) {
//         res.send("You are not allowed!")
//         res.end();
//     }
// })

//done and tested
router.route("/viewSlotLinking").post(async (req, res) => {
  try {
    const results = [];
    const result = await reqM.find({
      //change
      receiver: req.user.id,
      type: "Slot Linking",
    });
    for (var i = 0; i < result.length; i++) {
      var id = result[i].schedule_ID;
      const sch = await schM.findOne({ _id: id });
      const courseName = sch.course;
      const course = await courseM.findOne({ name: courseName });
      const courseCoor = course.coordinator;
      //change
      if (courseCoor == req.user.id) {
        results.push(result[i]);
      }
    }
    if (results.length == 0) {
      res.send([]);
    } else {
      res.send(results);
    }
  } catch (err) {
    res.send(err);
  }
});
//done and tested
router.route("/acceptRequest").post(async (req, res) => {
  try {
    if (!req.body._id) {
      res.send("Please pick an ID");
    } else {
      const reqq = await reqM.findOne({ _id: req.body._id });
      const sender = reqq.sender;
      const schId = reqq.schedule_ID;
      const status = reqq.status;
      const sch = await schM.findOne({ _id: schId });
      const course = sch.course;
      if (status != "Pending") {
        res.send("This request has been handeled already");
      } else {
        if (
          (await courseM.findOne({
            $and: [({ name: course }, { TAs: sender })],
          })) &&
          sch.academicMember == null
        ) {
          const request = await reqM.findOneAndUpdate(
            { _id: req.body._id },
            { status: "Accepted" }
          );
          if (request) {
            await schM.findOneAndUpdate(
              { _id: request.schedule_ID },
              { academicMember: sender }
            );
            res.send("Request Accepted");
          } else {
            res.send("No request with this ID!");
          }
        } else {
          if (sch.academicMember != null) {
            res.send("A TA is already assigned to this slot");
          } else {
            res.send("The request sender does not belong to this course");
          }
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
});
//done and tested
router.route("/RejectRequest").post(async (req, res) => {
  try {
    if (!req.body._id) {
      res.send("Please pick an ID");
    } else {
      const reqq = await reqM.findOne({ _id: req.body._id });
      const sender = reqq.sender;
      const schId = reqq.schedule_ID;
      const status = reqq.status;
      const sch = await schM.findOne({ _id: schId });
      const course = sch.course;
      if (status != "Pending") {
        res.send("This request has been handeled already");
      } else {
        if (
          await courseM.findOne({ $and: [({ name: course }, { TAs: sender })] })
        ) {
          await reqM
            .find({ _id: req.body._id })
            .updateOne({ status: "Rejected" });
          res.send("Request has been rejected");
        } else {
          res.send("The request sender does not belong to this course");
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
});
//done and tested
router.route("/addSlot").post(async (req, res) => {
  try {
    if (!req.body.courseName) {
      res.send(
        "Please make you sure that you have entered the required fields"
      );
    } else {
      const course = await courseM.findOne({ name: req.body.courseName });
      if (!course) {
        res.send("This course does not exist");
      } else {
        //change
        if (req.user.id != course.coordinator) {
          res.send("you are not a coordinator in this course");
          return;
        }
        const takenSlot = (
          await schM.find({
            slot: req.body.slot,
            day: req.body.day,
          })
        ).filter(function (slot) {
          return slot.location == req.body.location;
        });
        if (takenSlot.length != 0) {
          res.send("This slot is already occupied");
        } else {
          const newslot = new schM({
            location: req.body.location,
            day: req.body.day,
            slot: req.body.slot,
            course: req.body.courseName,
          });
          await newslot.save();
          res.send("Slot added successfully");
        }
      }
    }
  } catch (error) {
    res.send("Please make you sure that you have entered the required fields");
  }
});
//done and tested
router.route("/updateSlot").post(async (req, res) => {
  try {
    if (!req.body.req.body._id) {
      res.send("Please pick an ID");
    } else {
        if(!req.body.day&&!req.body.location&&!req.body.slot){
            res.send("Please enter information")
        }else{
      const slot = await schM.findOne({ _id: req.body._id });
      const value = slot.course;
      const course = await courseM.findOne({ name: value });
      const coor = course.coordinator;

      if (req.body.courseName) {
        const course2 = await courseM.findOne({ name: req.body.courseName });
        if (course2) {
          const coor2 = course2.coordinator;
          if (coor2 != req.user.id || course2) {
            res.send("you are not a coordinator in one of the courses");
          }
        } else {
          res.send("This course does not exist");
        }
        //change
      } else if (req.user.id != coor) {
        res.send("you are not a coordinator in one of the courses");
      } else {
        const arr = [];
        if (req.body.courseName) {
          arr.push(req.body.courseName);
        } else {
          arr.push(slot.course);
        }
        if (req.body.day) {
          arr.push(req.body.day);
        } else {
          arr.push(slot.day);
        }
        if (req.body.slot) {
          arr.push(req.body.slot);
        } else {
          arr.push(slot.slot);
        }
        if (req.body.location) {
          arr.push(req.body.location);
        } else {
          arr.push(slot.location);
        }
        if (
          (await schM.findOne({
            $and: [
              { location: arr[3] },
              { slot: arr[2] },
              { day: arr[1] },
              { course: arr[0] },
            ],
          })) != null
        ) {
          res.send("This slot is already occupied");
        } else {
          await slot.updateOne({
            $set: {
              location: arr[3],
              slot: arr[2],
              day: arr[1],
              course: arr[0],
            },
          });
          res.send("This slot is updated!");
        }
      }
    }}
  } catch (err) {
    res.send(err);
  }
});
//done and tested
router.route("/deleteSlot").post(async (req, res) => {
  try {
    const slot = await schM.findOne({ _id: req.body.slotID });
    if (slot) {
      const course1 = slot.course;
      const course = await courseM.findOne({ name: course1 });
      const coor = course.coordinator;
      //change
      if (req.user.id != coor) {
        res.send("you are not a coordinator in this course");
      } else {
        await schM.deleteOne({ _id: req.body.slotID });
        res.send("slot has been deleted");
      }
    } else {
      res.send("Already deleted");
    }
  } catch (err) {
    res.send(err);
  }
});

router.route("/viewSlots").post(async (req, res) => {
  try {
      //change
    const courses = await courseM.find({ coordinator: req.user.id });
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

module.exports = router;
