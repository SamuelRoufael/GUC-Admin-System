import { makeStyles } from '@material-ui/core/styles';
import { Alert} from '@material-ui/lab';
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        display:"none",
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  
 export default function Alerts(props) {
    const classes = useStyles();
    const severity = props.severity;
    const msg = props.msg;
    const disp = props.disp
    return (
        <div className={classes.root} style={{display:disp}}>
             <Alert severity={severity}>
        {msg}
      </Alert>
        </div>
    )
  }