import React, { useState, useEffect } from "react"
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { BorderAll, BorderAllRounded } from "@material-ui/icons";
import Box from '@material-ui/core/Box';
//import { response } from "express";

const user = localStorage.getItem("JWT")
const usetextStyles = makeStyles((theme) => ({
    textroot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: 300,

        },

        '& label.Mui-focused': {
            color: 'blue',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'blue',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'darkblue',
            },
            '&:hover fieldset': {
                borderColor: 'blue',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'darkblue',
            },
        },

    },

}));
const useButtonStyles = makeStyles((theme) => ({
    Buttonroot: {

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),



        },
    },
}));
const columns = [
    { id: "id", label: "StaffID", minWidth: 100, align: "center" },
    { id: "name", label: "StaffName", minWidth: 100, align: "center" },
    { id: "email", label: "Email", minWidth: 100, align: "center" },
    { id: "dayOff", label: "DayOff", minWidth: 100, align: "center" },

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

export default function ViewSinglestaffdayOff(props) {
    const classes = useStyles();
    const textclasses = usetextStyles();
    const buttonClasses = useButtonStyles();
    const [staffid, setStaffId] = useState("")
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [re, setRe] = useState("")
    const [checked, setChecked] = React.useState(false)
    const [isClicked, setClick] = React.useState(false);
   
    const loadCourseStaff = React.useCallback(async () => {
        try {
            console.log("hello")
            const response = await axios.post("http://localhost:3001/HOD/viewSinglestaffdayOff",
                { staffid: staffid },
                { headers: { "token": user } });
            console.log(response.data)
            if (((response.data) != "The staffid is not in our database") && ((response.data) != "That member is not in your department")) {
                setRows(response.data)
                setChecked(true)
                console.log(response.data)
            } else {
                console.log(response.data)
                setRe(response.data)
                setChecked(false)
            }
        } catch (error) {
            setRows([]);
        }
    });
    console.log(rows)
    React.useEffect(() => {
        loadCourseStaff();
    }, [loadCourseStaff]);

    function handleStaffChange(event) {
        setStaffId(event.target.value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function handleClick(event) {
        setClick(true)


    }
    if (isClicked && checked) {

        return (
            <Paper className={classes.root}>
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
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                            {columns.map((column, columnIndex) => {
                                                if (column != null ) {
                                                    return (
                                                        <TableCell
                                                            key={ columnIndex}
                                                            align={column.align}
                                                        >
                                                            {column.id === "id" && rows.id}
                                                            {column.id === "name" && rows.name}
                                                            {column.id === "email" && rows.email}
                                                            {column.id === "dayOff" && rows.dayOff}
                                                        </TableCell>
                                                    );
                                                }
                                            })}
                                        </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}

            </Paper>
        );
    }
    if (isClicked && (checked == false))
        return (<Box py={0} px={15} >
            <Alert severity="info">{re}</Alert>
        </Box>)

    if (!isClicked) {
        return (
            <Paper className={classes.root}>

                <form className={textclasses.textroot} noValidate autoComplete="off">
                    <div>
                        <Box py={10} px={8} pb={1} pt={10} >
                            <TextField
                                required="true"
                                variant="outlined"

                                margin="dense"
                                label="Staff_ID"
                                placeholder="Enter Staff-ID"
                                onChange={handleStaffChange}
                                value={staffid}
                            />
                        </Box>

                        <Box py={0} px={11} >
                            <Button className={buttonClasses.Buttonroot} variant="contained" color="primary" onClick={handleClick} >
                                View </Button>
                        </Box>
                    </div>
                </form>
            </Paper>
        );
    }
}
