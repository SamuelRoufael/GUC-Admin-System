import DesktopView from "./components/DesktopView.js";
import MobileView from "./components/MobileView.js";
import LoginView from "./components/Login.js";
import SideBar from "./components/SideBar.js";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import AttendanceTable from "./components/AttendanceTable";
import MissingDays from "./components/MissingDays.js";
import { Authorization } from "./components/Authorization";
import AssignAcademic from "./components/assignAcademic";
import "./css/desktopView.css";
import "./css/general+media_queries.css";
import "./css/login.css";
import "./css/sideBar.css";
import "./css/styles.css";
import "./css/stylesHR.css";
import "./css/assign.css";
import "./css/requests.css";
import "./css/assign.css";

function App() {
  return (
    <Router>
      <Route path="/login">
        <Authorization component={LoginView} />
      </Route>
      <Route path="/">
        <Authorization component={DesktopView} />
      </Route>
    </Router>
  );
}

export default App;
