import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Home from "./Home.js";
import Profile from "./Profile.js";
import AttendanceTable from "./AttendanceTable";
import MissingDays from "./MissingDays.js";
import LoginView from "./Login"
import { Authorization } from "./Authorization";
import LocationsTableHR from "./LocationsTableHR";
import CoursesHR from "./CoursesHR";
import AttendanceTableHR from "./viewAddAttendanceHR";
import MissingDaysHoursHR from "./MissingDaysHoursHR";
import FacultiesHR from "./FacultiesHR";
import DepartmentsHR from "./DepartmentsHR";
import RegisterStaffHR from "./RegisterStaffHR";
import UpdateDeleteStaffHR from "./UpdateDeleteStaffHR";
import AssignAcademic from "./assignAcademic.js"
import AssignCourseInstructor from "./AssignCourseInstructor"
import jwtDecode from "jwt-decode";
import DeleteCourseInstructor from "./DeleteCourseInstructor"
import UpdateCourseInstructor from "./UpdateCourseInstructors"
import ViewAllTheStaffDayOff from "./ViewAllTheStaffDayOff"
import ViewCourseCoverage from "./ViewCourseCoverage"
import viewDepartmentStaff from "./viewDepartmentStaff"
import ViewSingleStaffDayOff from "./ViewSingleStaffDayOff"
import ViewStaffPerCourse from "./ViewStaffPerCourse"
import ViewTeachingassignments from "./ViewTeachingassignments"
import Requests from "./Requests.js";
import ViewReq from "./ViewReq.js";
import Schedule from "./Schedule.js";
import ManageCourses_INST from "./ManageCourses_INST";
import ManageSlots_INST from "./ManageSlots_INST";
import ManageSlotAdd_COOR from "./ManageSlotAdd_COOR";
import ManageSlotReq_COOR from "./ManageSlotReq_COOR";
import ManageSlotUpdateDelete_COOR from "./ManageSlotUpdateDelete_COOR"


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));
const user = localStorage.getItem("JWT");

export default function DesktopView() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [loggedIn, setLoggedIn] = React.useState(true)

  
  const decodedToken = jwtDecode(user)
  const roles = decodedToken.role;


  function refreshPage() {
    window.location.reload(false);
  }
  function handleLogout() {
    try {
      localStorage.removeItem("JWT")
      setLoggedIn(false);
      refreshPage();
    } catch (error) {
      console.log(error)
    }
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  console.log(roles)
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            GUC Admin System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
                <ChevronRightIcon />
              )}
          </IconButton>
        </div>
        <Divider />
        <List component="nav" aria-label="mailbox folders">
          <Link to='/' >
            <ListItem button divider>
              <ListItemText align="center" primary="Home" />
            </ListItem>
          </Link>
          <Link to='/viewProfile'>
            <ListItem button divider>
              <ListItemText align="center" primary="Profile" />
            </ListItem>
          </Link>
          <Link to='/viewAttendance' >
            <ListItem button divider>
              <ListItemText align="center" primary="Attendance" />
            </ListItem>
          </Link>
          <Link to='/viewMissingDays' >
            <ListItem button divider>
              <ListItemText align="center" primary="Missing Days" />
            </ListItem>
          </Link>
          <Divider />
        </List>
        {roles.includes("HR") &&
          <List>
            <Link to='/HR/locations' >
              <ListItem button divider>
                <ListItemText align="center" primary="Locations" />
              </ListItem>
            </Link>
            <Link to='/HR/staffAttendance' >
              <ListItem button divider>
                <ListItemText align="center" primary="Staff attendance" />
              </ListItem>
            </Link>
            <Link to='/HR/staffMissingDays' >
              <ListItem button divider>
                <ListItemText align="center" primary="Staff missing days" />
              </ListItem>
            </Link>
            <Link to='/HR/faculties' >
              <ListItem button divider>
                <ListItemText align="center" primary="Faculties" />
              </ListItem>
            </Link>
            <Link to='/HR/departments' >
              <ListItem button divider>
                <ListItemText align="center" primary="Departments" />
              </ListItem>
            </Link>
            <Link to='/HR/courses' >
              <ListItem button divider>
                <ListItemText align="center" primary="Courses" />
              </ListItem>
            </Link>
            <Link to='/HR/registerstaff' >
              <ListItem button divider>
                <ListItemText align="center" primary="Register staff member" />
              </ListItem>
            </Link>
            <Link to='/HR/updateStaffMembers' >
              <ListItem button divider>
                <ListItemText align="center" primary="Update staff members" />
              </ListItem>
            </Link>
            <Divider />
          </List>
        }
        {roles.includes("Instructor") &&
          <List>
          <Link to='/Instructor/ManageCourses' >
              <ListItem button divider>
                <ListItemText align="center" primary="Manage Courses" />
              </ListItem>
            </Link>
            <Link to='/Instructor/ManageSlots' >
              <ListItem button divider>
                <ListItemText align="center" primary="Instructor Manage Slots" />
              </ListItem>
            </Link>
          </List>}
          {roles.includes("Coordinator") &&
          <List>
          <Link to='/Coordinator/ManageSlotAddition' >
              <ListItem button divider>
                <ListItemText align="center" primary= "Manage Slot Addition" />
              </ListItem>
            </Link>
            <Link to='/Coordinator/ManageSlotRequest' >
              <ListItem button divider>
                <ListItemText align="center" primary= "Manage Slot Requesting" />
              </ListItem>
            </Link>
            <Link to='/Coordinator/ManageSlotUpdateDelete'>
              <ListItem button divider>
                  <ListItemText align="center" primary="Manage Slot Update/Delete"/>
              </ListItem>
            </Link>
          </List>}
        {roles.includes("HOD") &&
          <List>
            <Link to='/HOD/assignCourseInstructor' >
              <ListItem button divider>
                <ListItemText align="center" primary="Assign course instructor" />
              </ListItem>
            </Link>
            <Link to='/HOD/deleteCourseInstructor' >
              <ListItem button divider>
                <ListItemText align="center" primary="Delete course instructor" />
              </ListItem>
            </Link>
            <Link to='/HOD/updateCourseInstructor' >
              <ListItem button divider>
                <ListItemText align="center" primary="Update course instructor" />
              </ListItem>
            </Link>
            <Link to='/HOD/staffDayOff' >
              <ListItem button divider>
                <ListItemText align="center" primary="All staff's day off" />
              </ListItem>
            </Link>
            <Link to='/HOD/viewCourseCoverage' >
              <ListItem button divider>
                <ListItemText align="center" primary="Course Coverage" />
              </ListItem>
            </Link>
            <Link to='/HOD/viewCourseStaff' >
              <ListItem button divider>
                <ListItemText align="center" primary="Course staff" />
              </ListItem>
            </Link>
            <Link to='/HOD/departmentStaff' >
              <ListItem button divider>
                <ListItemText align="center" primary="Department staff" />
              </ListItem>
            </Link>
            <Link to='/HOD/singleStaffDayOff' >
              <ListItem button divider>
                <ListItemText align="center" primary="Staff's day off" />
              </ListItem>
            </Link>
            <Link to='/HOD/teachingAssignment' >
              <ListItem button divider>
                <ListItemText align="center" primary="Teaching assignment" />
              </ListItem>
            </Link>
          </List>
        }
        {roles.includes("TA") &&
          <List>
            <Link to='/TA/sendRequest' >
              <ListItem button divider>
                <ListItemText align="center" primary="Send Request" />
              </ListItem>
            </Link>
            <Link to='/TA/viewRequest' >
              <ListItem button divider>
                <ListItemText align="center" primary="View Requests" />
              </ListItem>
            </Link>
            <Link to='/TA/viewSchedule' >
              <ListItem button divider>
                <ListItemText align="center" primary="View Schedule" />
              </ListItem>
            </Link>
          </List>
        }
        <List>
          <Link to='/login' >
            <ListItem button divider onClick={()=>handleLogout()}>
              <ListItemText align="center" primary="Logout" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        <div>
          <Switch>
            <Router exact path="/">
              <Authorization component={Home} />
            </Router>
            <Route path="/viewProfile">
              <Authorization component={Profile} />
            </Route>
            <Router path="/viewAttendance">
              <Authorization component={AttendanceTable} />
            </Router>
            <Router path="/viewMissingDays">
              <Authorization component={MissingDays} />
            </Router>
            <Router path="/HR/locations">
              <Authorization component={LocationsTableHR} />
            </Router>
            <Router path="/HR/staffAttendance">
              <Authorization component={AttendanceTableHR} />
            </Router>
            <Router path="/HR/staffMissingDays">
              <Authorization component={MissingDaysHoursHR} />
            </Router>
            <Router path="/HR/faculties">
              <Authorization component={FacultiesHR} />
            </Router>
            <Router path="/HR/departments">
              <Authorization component={DepartmentsHR} />
            </Router>
            <Router path="/HR/courses">
              <Authorization component={CoursesHR} />
            </Router>
            <Router path="/HR/registerStaff">
              <Authorization component={RegisterStaffHR} />
            </Router>
            <Router path="/HR/updateStaffMembers">
              <Authorization component={UpdateDeleteStaffHR} />
            </Router>
            <Router path="/Instructor/assignAcademic">
              <Authorization component={AssignAcademic} />
            </Router>
            <Router path="/HOD/assignCourseInstructor">
              <Authorization component={AssignCourseInstructor} />
            </Router>
            <Router path="/HOD/deleteCourseInstructor">
              <Authorization component={DeleteCourseInstructor} />
            </Router>
            <Router path="/HOD/updateCourseInstructor">
              <Authorization component={UpdateCourseInstructor} />
            </Router>
            <Router path="/HOD/staffDayOff">
              <Authorization component={ViewAllTheStaffDayOff} />
            </Router>
            <Router path="/HOD/viewCourseCoverage">
              <Authorization component={ViewCourseCoverage} />
            </Router>
            <Router path="/HOD/viewCourseStaff">
              <Authorization component={ViewStaffPerCourse} />
            </Router>
            <Router path="/HOD/departmentStaff">
              <Authorization component={viewDepartmentStaff} />
            </Router>
            <Router path="/HOD/singleStaffDayOff">
              <Authorization component={ViewSingleStaffDayOff} />
            </Router>
            <Router path="/HOD/teachingAssignment">
              <Authorization component={ViewTeachingassignments} />
            </Router>
            <Router path="/TA/sendRequest">
        <Authorization component={Requests} />
      </Router>
      <Router path="/TA/viewRequest">
        <Authorization component={ViewReq} />
      </Router>
      <Router path="/Instructor/ManageCourses">
        <Authorization component={ManageCourses_INST} />
      </Router>
      <Router path="/TA/viewSchedule">
        <Authorization component={Schedule} />
      </Router>
      <Router path="/Instructor/ManageSlots">
        <Authorization component={ManageSlots_INST} />
      </Router>
      <Router path="/Coordinator/ManageSlotAddition">
        <Authorization component={ManageSlotAdd_COOR} />
      </Router>
      <Router path="/Coordinator/ManageSlotRequest">
        <Authorization component={ManageSlotReq_COOR} />
      </Router>
      <Router path="/Coordinator/ManageSlotUpdateDelete">
        <Authorization component={ManageSlotUpdateDelete_COOR} />
      </Router>
      <Router path="/login">
        <Authorization component={LoginView} />
      </Router>
      </Switch>
        </div>
      </main>
    </div>
  );
}