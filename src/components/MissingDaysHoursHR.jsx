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
import CollapsedRow from "./CollapsedRow";
const user = localStorage.getItem("JWT")

const columns = [
    { id: "id", label: "ID", minWidth: 100, align: "center" },
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "missingHours", label: "Missing hours", minWidth: 100, align: "center" },
    { id: "extraHours", label: "Extra hours", minWidth: 100, align: "center" },
    { id: "dayOff", label: "Dayoff", minWidth: 100, align: "center" },
    { id: "missingDays", label: "Missing Days", minWidth: 100, align: "center" }
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
        alignContent: "center"
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
    }
});

function mapDay(dayNumber) {
    let day = "";
    switch (dayNumber) {
        case 0: day = "Sunday"; break;
        case 1: day = "Monday"; break;
        case 2: day = "Tuesday"; break;
        case 3: day = "Wednesday"; break;
        case 4: day = "Thursday"; break;
        case 5: day = "Friday"; break;
        case 6: day = "Saturday"; break;
    }
    return day;
}

export default function MissingDaysHoursHR() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const viewMembers = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HR/viewMissingDaysHours", { headers: { "token": user } })
            setRows(response.data)
        } catch (error) {
            // TODO : Handle error here
            console.log(error)
        }
    })

    viewMembers();

    return (
        <Paper className={classes.root} elevation={3}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => {
                                return <StyledTableCell align={column.align}>
                                    {column.label}
                                </StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => {
                                return (
                                    <CollapsedRow
                                        hover role="checkbox"
                                        tabIndex={-1}
                                        key={rowIndex}
                                        mainData={(columns.filter((column) => {
                                            return column.id !== "missingDays"
                                        })).map((head) => {
                                            return head.id === "dayOff" ? mapDay(row[head.id]) : row[head.id]
                                        })}
                                        numberOfTables={[0]}
                                        collapseTitle="missingDays"
                                        collapseHeads={[["date"]]}
                                        collapseRows={[row.missingDays]}
                                    />
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
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