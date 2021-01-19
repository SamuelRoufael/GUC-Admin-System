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
import Selector from "./Selector_v2";
import ViewSlots_COOR from "./viewSlots_COOR"

const user = localStorage.getItem("JWT")


function ManageSlotUpdateDelete_COOR() {
  const viewids = React.useCallback(async () => {
    try {//TODO
      const response = await axios.post(
        "http://localhost:3001/coordinator/viewSlots",
        { headers : { "token" : user }}
      );
      const res = response.data.map(({_id})=>_id)
      setselect(res);
    } catch (error) {}
  });
  React.useEffect(() => {
    viewids();
  }, [viewids]);
  const [selects, setselect] = React.useState([]);
  const [severity, setSeverity] = React.useState("");
  const [msg, setmsg] = React.useState("");
  const [disp, setDisp] = React.useState("");
  const [loc, setLocName] = React.useState("");
  const [day, setDay] = React.useState("");
  const [slot, setSlot] = React.useState("");
  const [course, setCourseName] = React.useState("");
  const [slotpicked, slotPicker] = React.useState("");
  function pickSlot(selectedslot) {
    slotPicker(selectedslot);
  }
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

  
  async function updateSlot(){
    try {//TODO
      const msg =  await axios.post("http://localhost:3001/Coordinator/updateSlot", {
         courseName:course,
         location:loc,
         day:day,
         slot:slot,
         id:"1",
         _id:slotpicked
       }, { headers : { "token" : user }});
       if(msg.data=="you are not a coordinator in one of the courses"||msg.data=="This course does not exist"){
         setSeverity("error")
       }else if(msg.data=="This slot is already occupied"||msg.data=="Please pick an ID"||msg.data=="Please enter information"){
         setSeverity("info")
       }
       else{
         setSeverity("success")
       }
       setmsg(msg.data);
       setDisp("block")
     } catch (error) {}
  }
  async function deleteSlot(){
    try {//TODO
      const msg =  await axios.post("http://localhost:3001/Coordinator/deleteSlot", {
         id:"1",
         slotID:slotpicked
       },{ headers: { "token": user } });
       if(msg.data=="you are not a coordinator in this course"){
         setSeverity("error")
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
      <ViewSlots_COOR/>
    </div>
    </div>
    <div className="col_22" style={{width:"610px"}}>
   
      <div className="col22_rows" style={{flexDirection:"column"}}>
      <div className="assign_Coor">
        <Selector
          selecttext={"Pick a Slot"}
          key={"newTypeSelector"}
          selects={selects}
          helperText="Select Slot"
          setSelector={pickSlot}
        />
      </div>
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
        <Button variant="contained" color="primary" onClick={updateSlot}>
          Update Slot
        </Button>
      </div>
      <div className="assign_Coor" style={{marginTop:"10px"}}>
        <Button variant="contained" color="primary" onClick={deleteSlot}>
          Delete Slot
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
  )
}

export default ManageSlotUpdateDelete_COOR;
