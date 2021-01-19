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
import axios from 'axios';
import TxtField from "./TxtField";
import { message } from 'antd';
import Button from '@material-ui/core/Button';
import { connect, useSelector } from "react-redux";
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

const URL = "http://localhost:3001"
const user = localStorage.getItem("JWT");

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
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        maxHeight: "100%"
    }
});

function AttendanceTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [addButtonClicked, setButtonClicked] = React.useState(false)
    const [monthh, setMonth] = React.useState();
    const [yearr, setYear] = React.useState();

    const handleAttendance = React.useCallback(async () => {
        const response = await axios.get("http://localhost:3001/viewAttendance",
            { headers: { "token": user } });
        setRows(response.data);
    }, [addButtonClicked]);

    React.useEffect(() => {
        setInterval(() => {
            handleAttendance();
        }, 5000);
    }, []);

    const handleMonth = React.useCallback(async () => {
        console.log(13)
        const response = await axios.get("http://localhost:3001/viewAttendance",
            { month: monthh, year: yearr },
            { headers: { "token": user } });
        console.log(response.data)
        setRows(response.data);
        console.log(response)
    }, [addButtonClicked])

    React.useEffect(() => {
        setInterval(() => {
            handleMonth();
        }, 10000);
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function assignMonth(m) {
        setMonth(m);
    }

    function assignYear(y) {
        setYear(y);
    }

    return (
        <Paper className={classes.root}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TxtField
                    key="month"
                    name="Month"
                    helperText="Enter a month"
                    setText={assignMonth}
                />
                <TxtField
                    key="year"
                    name="Year"
                    helperText="Enter a year"
                    setText={assignYear}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleMonth()}
                >
                    Submit
            </Button>
            </div>
            <TableContainer className={classes.container} size="500px">
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
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.app.user,
    };
};

export default connect(mapStateToProps, null)(AttendanceTable)