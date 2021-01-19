import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { message } from 'antd';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
const URL = "http://localhost:3001"
const user = localStorage.getItem("JWT");

const useStyles = makeStyles({
  button: {
    width: '25ch',
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    margin: "2%"
  },
  root: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.3)"
  }
});

function Home() {
  const classes = useStyles();
  const [username, setUsername] = React.useState("")
  console.log(user)
  const [signIn, setSignIn] = useState({
    date: "", type: ""
  })
  const [signOut, setSignOut] = useState({
    date: "", type: ""
  })

  const handleProfile = React.useCallback(async () => {
    const response = await axios.get(`${URL}/viewProfile`,
      { headers: { "token": user } });
    console.log(response.data.name)
    setUsername(response.data.name)
  });
  
  React.useEffect(() => {
    setInterval(() => {
      handleProfile();
    }, 5000);
  }, []);
  async function handleSignIn() {
    const response = await axios.post(`${URL}/signIn`,
      {
        date: signIn.date,
        type: signIn.type
      }, { headers: { "token": user } });
    if (response.data === "Signed in but at 7am!") {
      message.warning('Signed in but at 7am!')
    }
    else if (response.data === "Its after 7pm!") {
      message.warning('Not recorded! Its after 7pm')
    }
    else {
      message.success('Signed in!')
    }
  }

  async function handleSignOut() {
    const response = await axios.post(`${URL}/signOut`, {
      date: signOut.date,
      type: signOut.type
    }, { headers: { "token": user } });
    if (response.data === "Signed out!") {
      message.success('Signed out!')
    }
    else {
      message.warning('Signed out but at 7pm!')
    }
  }

  return (
      <Paper className={classes.root}>
        <h1 className="updateprofile">Welcome {username}</h1>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => handleSignIn()}
        >
          SignIn
            </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => handleSignOut()}
        >
          SignOut
            </Button>
      </Paper>
    );
}


const mapStateToProps = (state) => {
  return {
    user: state.app.user,
  };
};

export default connect(mapStateToProps, null)(Home);