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
import { connect, useSelector } from "react-redux";
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

const URL = "http://localhost:3001"
const user = localStorage.getItem("JWT");

const columns = [
    { id: "date", label: "Date", minWidth: 100, align: "center" },
    { id: "record", label: "", minWidth: 100, align: "center" }
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

function MissingDays(){
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [hours, setHours] = React.useState({})
    const [addButtonClicked, setButtonClicked] = React.useState(false)

    const handleMissingDays = React.useCallback(async () => {
        const response = await axios.get(`${URL}/viewMissingDays`,
        { headers : {"token" : user}});
        setRows(response.data.missingDays)
    }, [addButtonClicked]);

    React.useEffect(() => {
        setInterval(() => {
          handleMissingDays();
        }, 5000);
      }, []);

    const handleMissingExtraHours = React.useCallback(async()=> {
        const response = await axios.get(`${URL}/viewMissingExtraHours`,
        { headers : {"token" : user}});
        setHours(response.data)
    }, [addButtonClicked])

    React.useEffect(() => {
        setInterval(() => {
          handleMissingExtraHours();
        }, 5000);
      }, []);
      
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableHead >
                    <StyledTableCell align="center" width="50%">
                        Missing hours: {hours.missingHours}
                    </StyledTableCell>
                    <StyledTableCell align="center" width="60%">
                        Extra hours: {hours.extraHours}
                    </StyledTableCell>
                
            </TableHead>
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
                                                    {column.id === "date" && row}
                                                    {column.id === "record" && "Missed Day"}
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

export default connect(mapStateToProps, null)(MissingDays);