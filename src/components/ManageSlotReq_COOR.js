// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import "../css/desktopView.css"
import ViewSlotLinking from "./ViewSlotLinking";
import ManageReq from "./decideRequest"

function ManageSlotReq_COOR() {
  return(
    <div className="desk_view">
  <div className="right_section">
    <div className="col_11">
      <div>
      <ViewSlotLinking/>
    </div>
    </div>
    <div className="col_22">
    <div className="col22_rows">
      <ManageReq/>
      </div>
      </div>
  </div>
  </div>  
  )
}

export default ManageSlotReq_COOR;
