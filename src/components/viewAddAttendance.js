import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import TxtField from "./TxtField";
import axios from 'axios';

const columns = [
    { id: "date", label: "Date", minWidth: 100, align: "center" },
    { id: "record", label: "Record", minWidth: 100, align: "center" }
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
        alignItems: "center"
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
    }
});

export default function AttendanceTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [staffID, setStaffID] = React.useState("");
    const [foundMember, setFoundMember] = React.useState(false);
    const [clicked,setClicked] = React.useState(false);

    async function findAttendance(){
        try {
        const response = await axios.get(`http://localhost:3001/HR/viewAttendance`, {
            id: staffID
        });
        console.log(response.data)
        if (response.data !== `There is no StaffMember with ID `) {
            setFoundMember(true)
            setRows(response.data);
        }
        console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    } 

    function assignName(name) {
        setStaffID(name);
    }

    function handleSearhClick() {
        setClicked(true);
        findAttendance();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>

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
                    rowsPerPageOptions={[5,10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />}
        </Paper>
    );
}