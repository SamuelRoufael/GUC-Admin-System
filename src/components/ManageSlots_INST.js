// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import "../css/desktopView.css";
import ViewSlots from "./viewSlots";
import AssignAcademic from "./assignAcademic";
import UpdateMem from "./UpdateMem";
import DeleteMem from "./DeleteMem";
import ViewStaffid from "./viewStaffid";
import ViewStaffdep from "./viewStaffdep";
import Button from "@material-ui/core/Button";
import Alerts from "./alerts";

function ManageSlots_INST() {
  function setDispfirst() {
    setDisp2("none");
    setDisp1("block");
    setDisp("block");
    setmsg("Staff are displayed from departments");
  }
  function setDispsec() {
    setDisp1("none");
    setDisp2("block");
    setDisp("block");
    setmsg("Staff are displayed from courses");
  }
  const [disp11, setDisp1] = React.useState("");
  const [disp22, setDisp2] = React.useState("");
  const [msg, setmsg] = React.useState("");
  const [disp, setDisp] = React.useState("");
  return (
    <div className="desk_view">
      <div className="right_section">
        <div className="col_11">
          <div>
            <ViewSlots />
          </div>
          <div>
            <ViewStaffdep disp={disp11} />
          </div>
          <div>
            <ViewStaffid disp={disp22} />
          </div>
        </div>
        <div className="col_22">
          <div
            className="col22_rows"
            style={{ flexDirection: "column", height: "200px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
                alignSelf: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={setDispfirst}
              >
                Display Staff from department
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
                alignSelf: "center",
              }}
            >
              <Button variant="contained" color="primary" onClick={setDispsec}>
                Display Staff from Courses
              </Button>
            </div>
            <div className="assign_aca assign_aca_alert">
              <Alerts
                disp={disp}
                title="Success"
                msg={msg}
                severity="info"
              ></Alerts>
            </div>
          </div>
          <div className="col22_rows">
            <AssignAcademic />
          </div>
          <div className="col22_rows">
            <UpdateMem />
          </div>
          <div className="col22_rows">
            <DeleteMem />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSlots_INST;
