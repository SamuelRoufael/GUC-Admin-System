import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding : "10% 0"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 220
  }
}));

export default function DateAndTimePickers(props) {
  const [dateAndTime , setDateAndTime] = React.useState("")
  
  const handleChange = (event) => {
    setDateAndTime(event.target.value)
    props.setDateTime(event.target.value)
};

  const classes = useStyles();

  const currentDate = new Date()
  const hours = currentDate.getHours()

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="datetime-local"
        label={props.label}
        type="datetime-local"
        value = {dateAndTime}
        className={classes.textField}
        onChange = {handleChange}
        InputLabelProps={{
          shrink: true
        }}
      />
    </form>
  );
}
