// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import axios from "axios";
import "../css/assign.css"
import Selector from "./Selector_v2";
import Button from "@material-ui/core/Button";
import Alerts from "./alerts"

const user = localStorage.getItem("JWT");

export default function DeleteMem() {
  const [disp, setDisp] = React.useState("");
  const [selects, setselect] = React.useState([]);
  const [msg, setmsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [idpicked, IdPicker] = React.useState("");
  function pickID(selectedid) {
    IdPicker(selectedid);
  }
 
  const viewids = React.useCallback(async () => {
    try {//TODO
      const response = await axios.post(
        "http://localhost:3001/instructor/getSlotIDs",{ headers: { "token": user } }
      );
      const res = response.data.map(({_id})=>_id)
      setselect(res);
    } catch (error) {}
  });
  React.useEffect(() => {
    viewids();
  }, [viewids]);

  
  async function DeleteMem1() {
    try {
     const msg =  await axios.post("http://localhost:3001/instructor/DelMem", {
        scheduleId: idpicked
      },{ headers: { "token": user } });
      if(msg.data=="Schedule not found!"||msg.data=="This staff member does not exist"){
        setSeverity("error")
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
        <Button variant="contained" color="primary" onClick={DeleteMem1}>
          Delete Slot assignment
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
