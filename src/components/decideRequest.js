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

export default function ManageReq() {
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
        "http://localhost:3001/Coordinator/viewSlotLinking",
        { headers: { "token": user } }
      );
      const res = response.data.map(({_id})=>_id)
      setselect(res);
    } catch (error) {}
  });
  React.useEffect(() => {
    viewids();
  }, [viewids]);

  
  async function AcceptReq() {
    try {
     const msg =  await axios.post("http://localhost:3001/Coordinator/acceptRequest", {
        _id: idpicked
      },{ headers: { "token": user } }
      );
      if(msg.data=="The request sender does not belong to this course"){
        setSeverity("error")
      }else if(msg.data=="Please pick an ID"||msg.data=="A TA is already assigned to this slot"||msg.data=="This request has been handeled already"){
        setSeverity("info")
      }else{
        setSeverity("success")
      }
      setmsg(msg.data);
      setDisp("block")
    } catch (error) {}
  }
  async function RejectReq() {
    try {
     const msg =  await axios.post("http://localhost:3001/Coordinator/RejectRequest", {
        _id: idpicked
      },{ headers: { "token": user } });
      if(msg.data=="The request sender does not belong to this course"){
        setSeverity("error")
      }else if(msg.data=="Please pick an ID"||msg.data=="A TA is already assigned to this slot"||msg.data=="This request has been handeled already"){
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
          selecttext={"Pick a request"}
          key={"newTypeSelector"}
          selects={selects}
          helperText="Select request"
          setSelector={pickID}
        />
      </div>
      <div className="assign_aca" style={{margin:"10px"}}>
        <Button variant="contained" color="primary" onClick={AcceptReq}>
          Accpet Request
        </Button>
      </div>
      <div className="assign_aca" style={{margin:"10px"}}>
        <Button variant="contained" color="primary" onClick={RejectReq}>
            Reject Request
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
