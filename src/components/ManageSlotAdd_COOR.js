// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import "../css/desktopView.css"
import ViewSlots from "./viewSlots"
import Button from "@material-ui/core/Button";
import TxtField from "./TxtField";
import axios from "axios";
import Alerts from "./alerts"
import ViewSlots_COOR from "./viewSlots_COOR"
const user = localStorage.getItem("JWT");

function ManageSlotAdd_COOR() {

  const [severity, setSeverity] = React.useState("");
  const [msg, setmsg] = React.useState("");
  const [disp, setDisp] = React.useState("");
  const [loc, setLocName] = React.useState("");
  const [day, setDay] = React.useState("");
  const [slot, setSlot] = React.useState("");
  const [course, setCourseName] = React.useState("");

  function assignloc(name) {
    setLocName(name);
  }
  function assignday(name) {
    setDay(name);
  }
  function assignSlot(name) {
    setSlot(name);
  }
  function assignCourse(name) {
    setCourseName(name);
  }

  
  
  async function addSlot(){
    try {//TODO
      const msg =  await axios.post("http://localhost:3001/Coordinator/addSlot", {
         courseName:course,
         location:loc,
         day:day,
         slot:slot
       },{ headers: { "token": user } });
       if(msg.data=="you are not a coordinator in this course"||msg.data=="This course does not exist"){
         setSeverity("error")
       }else if(msg.data=="Please make you sure that you have entered the required fields"||msg.data=="This slot is already occupied"){
         setSeverity("info")
       }
       else{
         setSeverity("success")
       }
       setmsg(msg.data);
       setDisp("block")
     } catch (error) {}
  }

  return(
    <div className="desk_view">
  <div className="right_section">
    <div className="col_11">
      <div>
      <ViewSlots_COOR />
    </div>
    </div>
    <div className="col_22" style={{width:"610px"}}>
   
      <div className="col22_rows" style={{flexDirection:"column"}}>
      <div className="col22_rows" style={{flexDirection:"column"}}>
    <div className="assign_Coor">
        <TxtField
          key="newslot"
          name="Course"
          helperText="Type Course Name"
          setText={assignCourse}
        />
      </div>
      <div className="assign_Coor">
        <TxtField
          key="newslot"
          name="Location"
          helperText="Type Location Name"
          setText={assignloc}
        />
      </div>
      <div className="assign_Coor">
        <TxtField
          key="newslot"
          name="Day"
          helperText="Type Day"
          setText={assignday}
        />
      </div>
      <div className="assign_Coor">
        <TxtField
          key="newslot"
          name="Slot"
          helperText="Type Slot"
          setText={assignSlot}
        />
      </div>
      <div className="assign_Coor">
        <Button variant="contained" color="primary" onClick={addSlot}>
          Add Slot
        </Button>
      </div>
      <div className="assign_Coor assign_coor_alert">
      <Alerts 
        disp={disp}
        title="Success"
        msg={msg}
        severity={severity}></Alerts>
      </div>
      </div>
   
      </div>
      </div>
  </div>
  </div>  
  )
}

export default ManageSlotAdd_COOR;
