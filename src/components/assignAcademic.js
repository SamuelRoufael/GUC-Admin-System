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

export default function AssignAcademic() {
  const [disp, setDisp] = React.useState("");
  const [selects, setselect] = React.useState([]);
  const [msg, setmsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [idpicked, IdPicker] = React.useState("");
  const [updateacaName, setacaname] = React.useState("");
  function pickID(selectedid) {
    IdPicker(selectedid);
  }
  function assignaca(name) {
    setacaname(name);
  }
  const viewids  = React.useCallback(async () => {
    try {//TODO
      const response = await axios.post(
        "http://localhost:3001/instructor/getSlotIDs",
        { headers: { "token": user } }
      );
      const res = response.data.map(({_id})=>_id)
      setselect(res);
    } catch (error) {}
  });
  React.useEffect(() => {
    viewids();
  }, [viewids]);

  
  async function assignAcademic() {
    try {
     const msg =  await axios.post("http://localhost:3001/instructor/assignToUnassigned", {
        id: updateacaName,
        scheduleId: idpicked,
      },{ headers: { "token": user } });
      if(msg.data=="This staff member does not exist"){
        setSeverity("error")
      }else if(msg.data=="Already taken!"){
        setSeverity("info")
      }else if(msg.data=="Please pick an ID"||msg.data=="Please enter the info"){
        setSeverity("info")
      }else{
        setSeverity("success")
      }
      setmsg(msg.data);
      setDisp("block")
    } catch (error) {}
  }
  return (
    <div>
      <div className="assign_aca">
        <Selector
          selecttext={"Pick a slot"}
          key={"newTypeSelector"}
          selects={selects}
          helperText="Select Slot"
          setSelector={pickID}
        />
      </div>
      <div className="assign_aca">
        <TxtField
          key="newcoordinator"
          name="Member ID"
          helperText="Type academic member id"
          setText={assignaca}
        />
      </div>
      <div className="assign_aca">
        <Button variant="contained" color="primary" onClick={assignAcademic}>
          Add Academic Member
        </Button>
      </div>
      <div className="assign_aca assign_aca_alert">
      <Alerts 
        disp={disp}
        title="Success"
        msg={msg}
        severity={severity}></Alerts>
      </div>
    </div>
  );
}
