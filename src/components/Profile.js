import React, { useState } from "react";
import axios from "axios"
import "../css/styles.css";
import TxtField from "./TxtField";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { message} from 'antd';
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";


const URL = "http://localhost:3001"

const useStyles = makeStyles({
    button: {
        width: '25ch',
    },
    root: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItem: "center"
    },
    container: {
        maxHeight: "100%"
    }
});

function Detail(props) {
    return (
        <div>
            <p className="info">ID: {props.id}</p>
            <p className="info">Email: {props.email}</p>
            <p className="info">Gender: {props.gender}</p>
            <p className="info">Salary: {props.salary}</p>
            <p className="info">Office: {props.office}</p>
            <p className="info">DayOff: {props.dayOff}</p>
            <p className="info">Role(s): {props.role}</p>
            <p className="info">Annual leaves: {props.annualLeaves}</p>
            <p className="info">Accidental leaves: {props.accidentalLeaves}</p>
            {props.department !== undefined &&
                <p className="info">Department: {props.department}</p>}
            {props.department !== undefined &&
                <p className="info">Faculty: {props.faculty}</p>}

        </div>
    );
}

function Card(props) {
    return (
        <div className="card">
            <div className="top">
                <h2 className="name">{props.name}</h2>
                <img className="circle-img" src={props.picture} alt="avatar_img" />
            </div>
            <div className="bottom">
                <Detail className="cardBody"
                    id={props.id}
                    email={props.email}
                    gender={props.gender}
                    salary={props.salary}
                    office={props.office}
                    dayOff={props.dayOff === 0 ? "Sunday" :
                            props.dayOff === 1 ? "Monday" :
                            props.dayOff === 2 ? "Tuesday" :
                            props.dayOff === 3 ? "Wednesday" :
                            props.dayOff === 4 ? "Thursday" :
                            props.dayOff === 6 ? "Saturday" :
                            "Friday"}
                    role={props.role}
                    faculty={props.faculty}
                    department={props.department}
                    annualLeaves={props.annualLeaves}
                    accidentalLeaves={props.accidentalLeaves}
                    extraInfo={props.extraInfo}
                />
            </div>
        </div>
    );
}
const user = localStorage.getItem("JWT");

function Profile() {
    const classes = useStyles();
    const [record, setRecord] = useState({})
    const [emaill, setEmail] = useState(undefined)
    const [officee, setOffice] = useState(undefined)
    const [infoo, setInfo] = useState(undefined)
    const [roles, setRoles] = useState([])
    const [passwordd, setNewPassword] = useState(undefined)
    const [addButtonClicked, setButtonClicked] = useState(false)

    const handleProfile = React.useCallback(async () => {
        const response = await axios.get(`${URL}/viewProfile`, 
        {headers: { "token" : user }});
        setRecord(response.data);
        setRoles(response.data.role.map((r,index)=>{
            return ((index!==response.data.role.length-1)? (r + ", " ): r)
        }));
    }, [addButtonClicked]);
    console.log(roles)
    React.useEffect(() => {
        setInterval(() => {
          handleProfile();
        }, 5000);
      }, []);

    function assignEmail(e){
        setEmail(e);
    }

    function assignOffice(o){
        setOffice(o);
    }

    function assignInfo(i){
        setInfo(i);
    }
    
    function assignPassword(p){
        setNewPassword(p)
    }

    async function handleUpdates(){
        let update = {
            email: emaill,
            office: officee,
            extraInfo: infoo
        }
        try {
            const response = await axios.post(`${URL}/update`, {
                updates: update
            }, { headers : {"token" : user}})
            if(passwordd){
                const response1 = await axios.post(`${URL}/updatePassword`, {
                    password: passwordd
                }, { headers : {"token" : user}})
            }
            if(response === "Location is either full or not an office"){
                message.error("The location chosen is either full or not an office!")
            }
            else {
                message.success("Updated successfully!")
            }
        } 
        catch (error) {
            message.error("Error! Please try again")
        }
        setButtonClicked(true)
    }

    const [days, setDays] = React.useState();
    const [hours, setHours] = React.useState({missingHours: 0, missingDays: 0})

    const handleMissingDays = React.useCallback(async () => {
        const response = await axios.get("http://localhost:3001/viewMissingDays", 
                         { headers : {"token" : user}});
        setDays(response.data.missingDays.length)
    },[addButtonClicked]);
    
    React.useEffect(() => {
        setInterval(() => {
          handleMissingDays();
        }, 5000);
      }, []);
    const handleMissingExtraHours = React.useCallback(async()=> {
        const response = await axios.get("http://localhost:3001/viewMissingExtraHours", 
                                        { headers : {"token" : user}});
        setHours(response.data);
    },[addButtonClicked])

    React.useEffect(() => {
        setInterval(() => {
          handleMissingExtraHours();
        }, 5000);
      }, []);

    function calculateSalary(){
        let updatedSalary = record.salary
        let deduction = 0;
        if((hours.missingHours*60) > 179){
            const updatedMissingHours = hours.missingHours - (179 + hours.extraHours)
            deduction += (updatedMissingHours-179 * (updatedSalary/10800))
        }
        deduction += (days * (updatedSalary/60))
        return updatedSalary - deduction
    }

    return (
        <Paper className={classes.root}>
            <h1 className="heading">Profile</h1>
            <Card 
                name={record.name}
                picture={record.picture}
                id={record.id}
                email={record.email}
                gender={record.gender}
                salary={calculateSalary()}
                office={record.office}
                dayOff={record.dayOff}
                role={roles}
                department={record.department}
                faculty={record.faculty}
                annualLeaves={record.annualLeaves}
                accidentalLeaves={record.accidentalLeaves}
                extraInfo={record.extraInfo}
            />
            <h1 className="updateprofile" >
                UPDATE PROFILE
            </h1>
            <div style={{ display: "flex", flexDirection: "row", justifyContent : "center"}}>
                <TxtField
                    key="updateEmail"
                    name="New Email"
                    helperText="Enter email"
                    setText={assignEmail}
                />
                <TxtField
                    key="updateOffice"
                    name="Office"
                    helperText="Enter new office"
                    setText={assignOffice}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent : "center"}}>
                <TxtField
                    key="updateEmail"
                    name="Extra Info"
                    helperText="Enter extra info"
                    setText={assignInfo}
                />
                <TxtField
                    key="updatePassword"
                    name="Password"
                    helperText="Enter new password"
                    setText={assignPassword}
                />
            </div >
            <div style={{ display: "flex", flexDirection: "row", justifyContent : "center"}}>
            <Button 
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick= {()=> handleUpdates()}
                >
                Update
            </Button>
            </div>
        </Paper>
    );
}

const mapStateToProps = (state) => {
    return {
      user: state.app.user,
    };
  };
 
  export default connect(mapStateToProps, null)(Profile)