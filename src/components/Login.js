import React, { useState } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { message, Button, Space } from 'antd';
import { setUser } from "../redux/actions";
import "../css/login.css"
import 'antd/dist/antd.css';

const URL = "http://localhost:3001"

function LoginView(props) {

  const history = useHistory();
  const [addClickedButton, setClickedButton] = useState(false)
  const [user, setUserr] = useState({
    email: "",
    password: ""
  })

  function refreshPage() {
    window.location.reload(false);
  }

  async function handleLogin() {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email: user.email,
        password: user.password
      }, [addClickedButton]); 
      const token = response.data;
      if(token === "error"){
        message.error('Error! Please try again')
      }
      else if(token === "Incorrect Password!"){
        message.error('Incorrect password! Please try again')
      }
      else if(token === "Incorrect email!!"){
        message.error("Incorrect email! Please try again")
      }
      else {
        const decodedtoken = jwtDecode(token);
        props.setUser(decodedtoken);
        localStorage.setItem("JWT", token);
        history.push("/");
        refreshPage();
      }
    } 
    catch (error) {
      message.error('Error! Please try again')
    }
  }
  function handleChange(event) {
    const { name, value } = event.target;
    setUserr(prevUser => {
      return { ...prevUser, [name]: value }
    })
  }

  return (
    <div className="login_view">
    <div className="login">
      <div className="head"><p>Login</p></div>
      <div className="credentials">
        <label for="uname">
          <b className="text">Email</b>
        </label>
        <input className="input_name" 
        type="text" 
        placeholder="Enter Email" 
        name="email" 
        required 
        value={user.email}
        onChange={handleChange}
        />

        <label for="psw">
          <b className="text">Password</b>
        </label>
        <input
          className="input_pass"
          type="password"
          placeholder="Enter Password"
          name="password"
          required
          value={user.password}
          onChange={handleChange}
        />
        <button className="login_submit"
          type="submit"
          onClick={handleLogin}
        >Login</button>
      </div>
    </div>
    </div>
  
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default connect(null, mapDispatchToProps)(LoginView);