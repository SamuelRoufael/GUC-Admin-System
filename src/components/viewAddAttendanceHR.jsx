import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import Alert from '@material-ui/lab/Alert';
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import TxtField from "./TxtField";
import axios from 'axios';
import Selector from "./Selector";
import DateAndTime from "./DateAndTime"
const user = localStorage.getItem("JWT")

const columns = [
    { id: "date", label: "Date", minWidth: 250, align: "center" },
    { id: "record", label: "Record", minWidth: 250, align: "center" }
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"

    },
    container: {
        maxHeight: "100%",
        marginTop: "2%"
    },
    button: {
        width: '25ch',
        margin: "0% 0% 1% 0%"
    },
    inputArea : {
        margin: "2% 0% 1% 0%",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    } 
});

export default function AttendanceTableHR() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [staffID, setStaffID] = React.useState("");
    const [notFoundID, setNotFoundID] = React.useState("");
    const [foundMember, setFoundMember] = React.useState(false);
    const [searchClicked, setSearchClicked] = React.useState(false);
    const [addRecordType, setaddRecordType] = React.useState("signIn");
    const [addDateAndTime, setaddDateAndTime] = React.useState("");
    const [successAdd, setSuccessAdd] = React.useState(false);
    const [addClicked, setAddClicked] = React.useState(false);

    async function findAttendance() {
        try {
            const response = await axios.post(`http://localhost:3001/HR/viewAttendance`, {
                id: staffID
            }, { headers : { "token" : user }});
            if (response.data !== 'staffMember Not found') {
                setFoundMember(true);
                setRows(response.data);
            }
            else {
                setFoundMember(false);
                setNotFoundID(staffID);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function addRecord() {
        try {
            const response = await axios.post(`http://localhost:3001/HR/addAttendance`, {
                id: staffID,
                newAttendanceRecords: [{ date: addDateAndTime, type: addRecordType },
                ]
            }, { headers : { "token" : user }})
            setAddClicked(true);
            if (response.data !== `Sorry, you are not allowed to update your own Attendance!`) {
                setSuccessAdd(true);
            }
            findAttendance();
        } catch (error) {
            //TODO : handle error page here
            console.log(error)
        }
    }

    function assignName(name) {
        setStaffID(name);
    }

    function handleSearhClick() {
        setFoundMember(false);
        setSearchClicked(true);
        findAttendance();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function assignType(type) {
        setaddRecordType(type);
    }

    function assignDateAndTime(dt) {
        setaddDateAndTime(dt);
    }

    return (
        <Paper className={classes.root}>
            <div className = {classes.inputArea}>

            <h1 className="text-HeaderHR">View & Add Attendance</h1>

                <TxtField
                    key="Staff Member ID"
                    name="Staff Member ID"
                    helperText="Type Staff member's ID"
                    setText={assignName}
                />

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => (handleSearhClick())}
                >
                    Search
            </Button>
            </div>

            {!foundMember && searchClicked && <Alert className="alerts" severity="info">There is no StaffMember with ID {notFoundID}</Alert>}

            {foundMember &&
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <StyledTableCell align={column.align}>
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {columns.map((column, columnIndex) => {
                                                return (
                                                    <TableCell
                                                        key={rowIndex + "" + columnIndex}
                                                        align={column.align}
                                                    >
                                                        {column.id === "date" && row.date}
                                                        {column.id === "record" && row.type}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {foundMember && <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            { foundMember && <div style={{ display: "flex", flexDirection: "column", margin: "5%", alignItems: "center" }}>
                <h1 className="text-HeaderHR">Add Record</h1>
                <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <Selector
                        key={"Add Attendance record Type"}
                        selects={["signIn", "signOut"]}
                        name="Type"
                        helperText="Select record type"
                        setSelector={assignType}
                    />

                    <DateAndTime
                        setDateTime={assignDateAndTime}
                        label="Date & Time"
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => (addRecord())}
                >Add</Button>

                {addClicked && successAdd && <Alert className="alerts" severity="success">Attendance record added successfully!</Alert>}
                {addClicked && !successAdd && <Alert className="alerts" severity="warning">Sorry, you are not allowed to update your own Attendance!</Alert>}

            </div>}
        </Paper>
    );
}