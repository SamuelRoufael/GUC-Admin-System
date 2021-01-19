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
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import userEvent from "@testing-library/user-event";

const columns = [
    { id: "type", label: "Type", minWidth: 100, align: "center" },
    { id: "sender", label: "Sender", minWidth: 100, align: "center" },
    { id: "receiver", label: "Receiver", minWidth: 100, align: "center" },
    { id: "requestDate", label: "RequestDate", minWidth: 100, align: "center" },
    { id: "status", label: "Status", minWidth: 100, align: "center" },
    { id: "startDate", label: "StartDate", minWidth: 100, align: "center" },
    { id: "endDate", label: "EndDate", minWidth: 100, align: "center" },
   // { id: "requestDate", label: "RequestDate", minWidth: 100, align: "center" },
    { id: "compensationDate", label: "CompensationDate", minWidth: 100, align: "center" },
    { id: "comment", label: "Comment", minWidth: 100, align: "center" },
    { id: "schedule_ID", label: "Schedule_ID", minWidth: 100, align: "center" },
    { id: "replacementList", label: "ReplacementList", minWidth: 100, align: "center" },
    { id: "document", label: "Document", minWidth: 100, align: "center" },
    { id: "changedDayOff", label: "ChangedDayOff", minWidth: 100, align: "center" },
    { id: "accept", label: "Accept", minWidth: 100, align: "center" },
    { id: "reject", label: "Reject", minWidth: 100, align: "center" }
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14,
        padding:40
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
const divStyle = {
    paddingLeft:'80',
    paddingRight:"80"
  
};
const user = localStorage.getItem("JWT")

export default function MyRequests() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
 

    const loadRequests = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HOD/viewRequestsdayoffoRleaves", 
            { headers : { "token" : user }});
            setRows(response.data);
        } catch (error) {   
            setRows([]);
        }
    });
    
    React.useEffect(() => {
    loadRequests();}, [loadRequests]);

   async function handleAccept(RequestRowId,RequestdayOff) {
        try {
            await axios.post("http://localhost:3001/HOD/AcceptRequest",
            {req_id : RequestRowId,day:RequestdayOff}, 
            { headers: { "token" : user}});
            loadRequests();
        } catch (error) {
            // handle Error Page here
            console.log(error)
        }
    }


    async function handleReject(RequestRowId) {
        try {
            await axios.post("http://localhost:3001/HOD/rejectRequest",
            {req_id : RequestRowId},
            { headers : { "token" : user }});
            loadRequests();
        } catch (error) {
            // handle Error Page here
            console.log(error)
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div style={divStyle}>
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

                                                  
                                                    {column.id === "accept" && (

                                                      
                                                        <CheckIcon
                                                            key={row.id}
                                                             onClick={() =>handleAccept(row._id,row.changedDayOff)}
                                                            
                                                        />
                                                    )}
                                                    {column.id === "reject" && (
                                                        <CloseIcon
                                                            key={row.id}
                                                            onClick={() =>handleReject(row._id)}
                                                        />
                                                    )}
                                                    {column.id === "type" && row.type}
                                                    {column.id === "sender" && row.sender}
                                                    {column.id === "receiver" && row.receiver}
                                                    {column.id === "requestDate" && row.requestDate}
                                                    
                                                

                                                    {column.id === "status" && row.status}
                                                    {column.id === "startDate" && row.startDate}
                                                    {column.id === "endDate" && row.endDate}
                                                    {column.id === "compensationDate" && row.compensationDate}
                                                     
                                                    {column.id === "comment" && row.comment}
                                                    {column.id === "schedule_ID" && row.schedule_ID}
                                                    {column.id === "replacementList" && row.replacementList}
                                                    {column.id === "document" && row.document}

                                                    {column.id === "changedDayOff" && row.changedDayOff}
                                                   








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
   </div>  );
}
