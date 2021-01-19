import React from "react";
import Checkbox from "./CheckBox";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TxtField from "./TxtField";
import Selector from "./Selector";
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: 'column',
        minWidth: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
        margin : "1%"
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

const user = localStorage.getItem("JWT")
export default function RegisterStaffHR() {
    const classes = useStyles();
    const [dayOff, setDayOff] = React.useState("Saturday");
    const [name, setName] = React.useState("");
    const [faculty, setFaculty] = React.useState("");
    const [department, setDepartment] = React.useState("");
    const [salary, setSalary] = React.useState(0);
    const [office, setOffice] = React.useState("");
    const [gender, setGender] = React.useState("Male");
    const [roles, setRoles] = React.useState({
        HR: false,
        HOD: false,
        Instructor: false,
        Coordinator: false,
        TA: false
    });
    const [addResponse,setAddResponse] = React.useState("");

    function assignName(name_) {
        setName(name_);
    }

    function assignFacutly(faculty_) {
        setFaculty(faculty_);
    }

    function assignDeartment(dep_) {
        setDepartment(dep_);
    }

    function assignSalary(salary_) {
        setSalary(salary_);
    }

    function assignOffice(office_) {
        setOffice(office_);
    }

    function assignDayOff(dayoff_) {
        setDayOff(dayoff_);
    }

    function assignGender(gender_) {
        setGender(gender_);
    }

    function updateRoles(state, id) {
        setRoles((prevState) => {
            return { ...prevState, [id]: state }
        })
    }

    function roleCategory() {
        if (roles.HR == true) {
            return -1;
        }
        else if (roles.HOD === true || roles.Instructor === true || roles.TA === true || roles.Coordinator === true) {
            return 1;
        }
        else {
            return 0;
        }

    }

    function mapDay(){
        let dayNumber = 0;
        switch(dayOff){
            case 'Sunday' : dayNumber = 0 ; break;
            case 'Monday' : dayNumber = 1 ; break;
            case 'Tuesday' : dayNumber = 2 ; break;
            case 'Wednesday' : dayNumber = 3 ; break;
            case 'Thursday' : dayNumber = 4 ; break;
            case 'Friday' : dayNumber = 5 ; break;
            default : dayNumber = 6;break;
        }
        return dayNumber;
    }

    function getArrayRole(){
        let rolesArray = []
        if (roles.HR === true){
            rolesArray.push('HR');
        }
        else{
            if (roles.HOD === true){
                rolesArray.push('HOD');
            }
            if (roles.TA === true){
                rolesArray.push('TA');
            }
            if (roles.Instructor === true){
                rolesArray.push('Instructor');
            }
            if (roles.Coordinator === true){
                rolesArray.push('Coordinator');
            }
        }
        return rolesArray;
    }

    async function register(){
        try {
            const response = await axios.post("http://localhost:3001/HR/registerStaff", {
                name : name,
                salary : salary,
                role : getArrayRole(),
                dayOff : mapDay(), 
                faculty : faculty,
                department : department,
                office : office,
                gender : gender
            },{ headers : { "token" : user }});
            setAddResponse(response.data);
        } catch (error) {
            // TODO : Handle Error page here
            console.log(error)
        }
    }

    return (
        <Paper className={classes.root} elevation={3}>
            <h1 className = "text-HeaderHR">Register StaffMember</h1>
            <TxtField
                key="StaffMemberName"
                name="Staff member name"
                helperText="type name here"
                setText={assignName}
                value={name}
            />
            <TxtField
                key="Faculty"
                name="Faculty"
                helperText="Type faculty Name"
                setText={assignFacutly}
                value={faculty}
            />
            <TxtField
                key="Department"
                name="Department"
                helperText="Type department Name"
                setText={assignDeartment}
                value={department}
            />
            <TxtField
                key="Salary"
                name="Salary"
                type="number"
                helperText="Type salary"
                setText={assignSalary}
                value={salary}
            />
            <TxtField
                key="Office"
                name="Office"
                helperText="Type Office Name"
                setText={assignOffice}
                value={office}
            />
            <Selector
                key={"DayOff"}
                selects={roleCategory() == -1 ? ['Saturday'] : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']}
                name="Day Off"
                helperText="Select second Day Off"
                setSelector={assignDayOff}
                value={dayOff}
            />
            <Selector
                key={"Gender"}
                selects={["Male", "Female"]}
                name="Gender"
                helperText="Select gender"
                setSelector={assignGender}
                value={gender}
            />
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Assign Role : </FormLabel>
                <FormGroup style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", }}>
                    <Checkbox disable_={roleCategory() === 1} label_="HR" id="HR" key="HR" onChange={updateRoles} />
                    <Checkbox disable_={roleCategory() === -1} label_="HOD" id="HOD" key="HOD" onChange={updateRoles} />
                    <Checkbox disable_={roleCategory() === -1} label_="Instructor " id="Instructor" key="Instructor" onChange={updateRoles} />
                    <Checkbox disable_={roleCategory() === -1} label_="Coordinator" id="Coordinator" key="Coordinator" onChange={updateRoles} />
                    <Checkbox disable_={roleCategory() === -1} label_="TA" id="TA" key="TA" onChange={updateRoles} />
                </FormGroup>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                    register()
                }}
            >Register</Button>
                {addResponse === `StaffMember Added successfully!` && <Alert className="alerts" severity="success">{addResponse}</Alert>}
                {addResponse === `please select a valid Faculty and Department` && <Alert className="alerts" severity="warning">{addResponse}</Alert>}
                {addResponse === 'please make sure to fill/choose all the required fields' && <Alert className="alerts" severity="warning">{addResponse}</Alert>}
                {addResponse === `Location is either full or not an Office` && <Alert className="alerts" severity="warning">{addResponse}</Alert>}
        </Paper>
    )
}