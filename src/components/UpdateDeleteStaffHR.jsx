import React from "react";
import TxtField from "./TxtField";
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";

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
        margin: "1%"
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));


const user = localStorage.getItem("JWT")

export default function UpdateDeleteStaffHR() {
    const classes = useStyles();
    const [staffID, setStaffID] = React.useState("");
    const [deleteResponse, setDeleteResponse] = React.useState("");

    const [update, setUpdate] = React.useState(false);
    const [updateFacultyName, setUpdateFacultyName] = React.useState("");
    const [updateDepartmentName, setUpdateDepartmentName] = React.useState("");
    const [updateSalaryAmount, setUpdateSalaryAmount] = React.useState(-1);
    const [updateResponce, setUpdateResponse] = React.useState("");
    const [updateSalaryResponse, setUpdateSalaryResponse] = React.useState("");

    function assignStaffID(id) {
        setStaffID(id);
    }

    function assignFacultyName(name) {
        setUpdateFacultyName(name);
    }

    function assignDepartmentName(name) {
        setUpdateDepartmentName(name);
    }

    function assignSalary(salary) {
        setUpdateSalaryAmount(salary);
    }

    async function deleteStaff() {
        try {
            setDeleteResponse("")
            const response = await axios.post("http://localhost:3001/HR/deleteStaffMember", {
                staffMember: staffID
            }, { headers: { "token": user } })
            setUpdateResponse("")
            setUpdateSalaryResponse("")
            setUpdate(false);
            setDeleteResponse(response.data)
        } catch (error) {
            // TODO : handle error page here :(
            console.log(error)
        }
    }

    async function intializeUpdate() {
        try {
            const response = await axios.post("http://localhost:3001/HR/findStaffMember", {
                id: staffID
            }, { headers: { "token": user } })
            setUpdateResponse(response.data)
            setDeleteResponse("")
            if (response.data === `found Member!`) {
                setUpdate(true)
            }
        } catch (error) {

        }
    }

    async function updateMember() {
        let updates_ = {}
        let updateSalary = {}
        setUpdateSalaryResponse("")
        setUpdateResponse("")
        if (updateDepartmentName !== "") {
            updates_.department = updateDepartmentName
        }
        if (updateFacultyName !== "") {
            updates_.faculty = updateFacultyName
        }
        if (updateSalaryAmount >= 0 && updateSalaryAmount !== null) {
            updateSalary.id = staffID;
            updateSalary.salary = updateSalaryAmount;
        }

        try {
            const response = await axios.post("http://localhost:3001/HR/updateStaffMember", {
                id: staffID,
                updates: updates_
            }, { headers: { "token": user } })
            setUpdateResponse(response.data);
            if (updateSalaryAmount >= 0 && updateSalaryAmount !== null) {
                const responseS = await axios.post("http://localhost:3001/HR/updateSalary", updateSalary, { headers: { "token": user } })
                setUpdateSalaryResponse(responseS.data);
            }
        } catch (error) {
            // TODO : handle error page here :(
            console.log(error)
        }
    }

    return (
        <Paper className={classes.root} elevation={3}>
            <h1 className="text-HeaderHR" >Update/Delete StaffMember</h1>
            <TxtField
                key="Staff ID"
                name="Staff ID"
                helperText="Type Staff ID"
                setText={assignStaffID}
            />
            <div style={{ display: "flex", flexDirection: "row", minWidth: "100%", flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                        deleteStaff()
                    }}
                >Delete</Button>
                {!update && <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                        intializeUpdate();
                    }}
                >Update</Button>}
            </div>

            {deleteResponse === 'Staff Member does not exist!' && <Alert className="alerts" severity="info">{deleteResponse}</Alert>}
            {deleteResponse === `Staff member deleted successfully!` && <Alert className="alerts" severity="success">{deleteResponse}</Alert>}
            {updateResponce === `Member Does not exist!!` && <Alert className="alerts" severity="warning">{updateResponce}</Alert>}

            {update && <div style={{ display: "flex", flexDirection: "column", margin: "5%", alignItems: "center" }}>
                <h1 className="text-HeaderHR">Update Staff Member {staffID}</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    <TxtField
                        key="UpdateFacultyName"
                        name="Faculty"
                        helperText="Faculty Name"
                        setText={assignFacultyName}
                    />
                    <TxtField
                        key="UpdateDepartmentName"
                        name="Department Name"
                        helperText="Department name"
                        setText={assignDepartmentName}
                    />
                    <TxtField
                        key="UpdateSalary"
                        name="Salary"
                        helperText="Updated Salary"
                        setText={assignSalary}
                        type="number"
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                        updateMember();
                    }}
                >
                    Update</Button>
                {updateResponce === `StaffMember updated successfully!` && <Alert className="alerts" severity="success">{updateResponce}</Alert>}
                {(updateResponce === `Department does not exist!` || updateResponce === `Faculty does not exist!` || updateResponce === `Staff member does not exist`) && <Alert className="alerts" severity="warning">{updateResponce}</Alert>}
                {updateSalaryResponse === `Salary is updated successfully` && <Alert className="alerts" severity="success">{updateSalaryResponse}</Alert>}
                {(updateSalaryResponse === `there is no StaffMember with the given ID` || updateSalaryResponse === `please Enter a valid salary`) && <Alert className="alerts" severity="warning">{updateSalaryResponse}</Alert>}
            </div>}

        </Paper>
    )
}

