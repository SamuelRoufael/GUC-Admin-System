import React, { useState, useEffect } from "react"
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { BorderAll, BorderAllRounded } from "@material-ui/icons";
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
const user = localStorage.getItem("JWT");

const usetextStyles = makeStyles((theme) => ({
  textroot: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      width: 300
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

export default function UpdateCourseInstructor(props) {
  const textclasses = usetextStyles();
  const buttonClasses = useButtonStyles();
  const classes = useStyles()
  const [courseid, setCourseId] = useState("")
  const [staffid1, setStaffId1] = useState("")
  const [staffid2, setStaffId2] = useState("")
  const [clickResponse, setClickResponse] = useState("")
  const [isClicked, setClick] = React.useState(false);
  
  
  function handleCourseChange(event) {
    setCourseId(event.target.value)
  }

  function handleStaffChange1(event) {
    setStaffId1(event.target.value)
  }


  function handleStaffChange2(event) {
    setStaffId2(event.target.value)
  }

  async function handleClick(event) {
    setClick(true)
    try {
      const response = await axios.post("http://localhost:3001/HOD/updateCourseInstructors", 
      { courseid: courseid, staffid: staffid1, updatedstaffid: staffid2 },
      { headers : { "token" : user }});
      setClickResponse(response.data);
    } catch (error) {
      console.log("There is an error")
    }

  }

  if (isClicked)
    return (
      <Box py={13} px={8} >
        <Alert severity="info">{clickResponse}</Alert>
      </Box>
    );


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
              label="Course_ID"
              placeholder="Enter Course-ID"
              onChange={handleCourseChange}
              value={courseid}
            />

            <TextField
              required="true"
              variant="outlined"

              margin="dense"
              label="StaffMember_ID"
              placeholder="Enter StaffMember-ID"
              onChange={handleStaffChange1}
              value={staffid1}
            />
            <TextField
              required="true"
              variant="outlined"

              margin="dense"
              label="UpdatedStaffMember_ID"
              placeholder="Enter StaffMember-ID would get updated"
              onChange={handleStaffChange2}
              value={staffid2}
            />
          </Box>
          <Box py={1} px={55} >
            <Button className={buttonClasses.Buttonroot} variant="contained" color="primary" onClick={handleClick} >
              Update Course Instructor</Button>
          </Box>
        </div>
      </form>
      </Paper>
    );
  }
}
