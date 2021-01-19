import React,{useState,useEffect}from "react"
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Box from '@material-ui/core/Box';
import axios from 'axios';
const user = localStorage.getItem("JWT")


const columns = [
    { id: "id", label: "StaffID", minWidth: 100, align: "center" },
    { id: "name", label: "StaffName", minWidth: 100, align: "center" },
    { id: "email", label: "Email", minWidth: 100, align: "center" },
    { id: "dayOff", label: "DayOff", minWidth: 100, align: "center"}                                                          

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
        width: "100%",
    },
    container: {
        maxHeight: "100%"
    }
});




export default function ViewAllTheStaffDayOff() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    //const [isClicked,setClick]=React.useState(false);
    
    const loadDepartmentStaffDayOff = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HOD/viewAllthestaffdayoff",
                            { headers : { "token" : user}});
            setRows(response.data);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadDepartmentStaffDayOff();}, [loadDepartmentStaffDayOff]);

    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


      return (
          <Paper className={classes.root}>
        <Box py={12} px={0}>
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
                                                           
                                                        {column.id === "id" && row.id}
                                                        {column.id === "name" && row.name}
                                                        {column.id === "email" && row.email}
                                                        {column.id === "dayOff" && row.dayOff}
                                                       
                                                    
    
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
                    rowsPerPageOptions={[5,10, 25, 100]}
                    component= "div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            
            </Paper>
            </Box>
          </Paper>
        );}
        


