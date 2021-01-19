// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import axios from "axios";
import "../css/assign.css"
import Selector from "./Selector_v2";
import TxtField from "./TxtField";
import Button from "@material-ui/core/Button";
import Alerts from "./alerts"

const user = localStorage.getItem("JWT");

export default function AssignCOOR() {
  const [disp, setDisp] = React.useState("");
  const [selects, setselect] = React.useState([]);
  const [msg, setmsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [coursepicked, coursePicker] = React.useState("");
  const [updateCoorName, setCoorName] = React.useState("");
  function pickCourse(selectedCourse) {
    coursePicker(selectedCourse);
  }
  function assigncoor(name) {
    setCoorName(name);
  }
  const viewids = React.useCallback(async () => {
    try {//TODO
      const response = await axios.post(
        "http://localhost:3001/instructor/getCovNames",
        { headers: { "token": user } }
      );
      const res = response.data.map(({name})=>name)
      setselect(res);
    } catch (error) {}
  });
  React.useEffect(() => {
    viewids();
  }, [viewids]);

  
  async function assignCoordinator() {
    try {
     const msg =  await axios.post("http://localhost:3001/instructor/assignCourseC", {
        coorID: updateCoorName,
        courseName: coursepicked,
      },{ headers: { "token": user } });
      if(msg.data=="This staff member does not exist"){
        setSeverity("error")
      }else if(msg.data=="This person is already assigned as an coordinator to this course"||msg.data=="Please enter the member name"){
        setSeverity("info")
      }else if(msg.data=="Please pick a course"){
        setSeverity("info")
      }
      else{
        setSeverity("success")
      }
      setmsg(msg.data);
      setDisp("block")
    } catch (error) {}
  }
  return (
    <div>
      <div className="assign_Coor">
        <Selector
          selecttext={"Pick a Course"}
          key={"newTypeSelector"}
          selects={selects}
          helperText="Select Course"
          setSelector={pickCourse}
        />
      </div>
      <div className="assign_Coor">
        <TxtField
          key="newcoordinator"
          name="name"
          helperText="Type Coordinator Name"
          setText={assigncoor}
        />
      </div>
      <div className="assign_Coor">
        <Button variant="contained" color="primary" onClick={assignCoordinator}>
          Assign Coordinator
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
  );
}
