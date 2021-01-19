// eslint-disable-next-line
import react from "react";
// eslint-disable-next-line
import reactDOM from "react-dom";
import {openSide} from "../js/main.js"
import "../css/mobileView.css"
import "../css/sideBar.css";
import SideBar from "./SideBar.js";
import logo from "../img/favicon.png";

function MobileView(){
  return (
    <div className="mobile">
    <div>
    <button className="mobile_btn">
          <img src={logo} className="mobile_icon4s" onClick={openSide}/>
        </button>
    </div>
    <SideBar />
  </div>)
}

export default MobileView