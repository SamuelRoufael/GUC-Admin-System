import React,{useState,useEffect}from "react"
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
    { id: "department", label: "Department", minWidth: 100, align: "center" },
    { id: "faculty", label: "Faculty", minWidth: 100, align: "center" },
    { id: "office", label: "Office", minWidth: 100, align: "center" },
    { id: "role", label: "Role", minWidth: 100, align: "center" },
    { id: "annualLeaves", label: "AnnualLeaves", minWidth: 100, align: "center" },
    { id: "accidentalLeaves", label: "AccidentalLeaves", minWidth: 100, align: "center" },
    { id: "gender", label: "Gender", minWidth: 100, align: "center" },
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

export default function ViewStaffPerCourse(props) {
    const classes = useStyles();
    const textclasses = usetextStyles();
    const buttonClasses = useButtonStyles(); 
    const [courseid,setCourseId] =  useState("")
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [re,setRe]=useState("")
    const[checked,setChecked] =React.useState(false)
    const [isClicked,setClick]=React.useState(false);

    const loadCourseStaff = React.useCallback(async () => {
    try {
         const response = await axios.post("http://localhost:3001/HOD/viewCoursestaff",
         {courseid:courseid},
         { headers : { "token" : user }});
            if(((response.data)!="this course doesn't exist at all")&&((response.data)!="You are accessing a course from another department")){
             setRows(response.data)
              setChecked(true) 
            }else{
                setRe(response.data)   
                 setChecked(false)
             }//else
              //alert(response)
            //.map(JSON.stringify));
               
           
    } catch (error) {   
        setRows([]);
    }              
});

    React.useEffect(() => {
     loadCourseStaff();}, [loadCourseStaff]);
    
    
    
    
    function handleCourseChange(event){
        setCourseId(event.target.value)
    }   
     
    
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    
    
    
      function handleClick(event){
        setClick(true)
        
       
    }
       if(isClicked && checked){
            
        return (
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
                                               if(column!=null&&row!=null){
                                                return (
                                                    
                                                    <TableCell
                                                        key={rowIndex + "" + columnIndex}
                                                        align={column.align}
                                                    >
                                                        
                                                        
                                                        {column.id === "id" && row.id}
                                                        {column.id === "name" && row.name}
                                                        {column.id === "email" && row.email}
                                                        {column.id === "department" && row.department}
                                                        {column.id === "faculty" && row.faculty}
                                                        {column.id === "office" && row.office}
                                                        {column.id === "role" && "["+row.role+"]"}
                                                        {column.id === "annualLeaves" && row.annualLeaves}
                                                        {column.id === "accidentalLeaves" && row.accidentalLeaves}
                                                        {column.id === "gender" && row.gender}
                                                    
    
                                                    </TableCell>
                                                );}
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
        );
     }
        if(isClicked&&(checked==false))
           return( <Box py={13} px={8} > 
                   <Alert severity="info">{re}</Alert>
                       </Box>)
    
    /* */
    
    
    
 
    if(!isClicked){
    return (
        <form className={textclasses.textroot} noValidate autoComplete="off">
            <div>
            <Box py={10} px={8} pb={1} pt={10} > 
                <TextField
                    required="true"
                    variant="outlined"
                   
                     margin = "dense"
                     label ="Course_ID"
                     placeholder="Enter Course-ID"
                    onChange  = {handleCourseChange}
                    value ={courseid}
                />
             </Box>
      
             <Box py={0} px={15} >   
                <Button className={buttonClasses.Buttonroot} variant="contained" color="primary" onClick={handleClick} >
                        View Course Staff</Button>     
           </Box>
       </div>



        </form>
    );
}
}
