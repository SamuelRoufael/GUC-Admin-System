import React from "react";
import { Redirect } from "react-router-dom";
import Login from "./Login";

export const Authorization = ({ component: Component }) => {
  const token = localStorage.getItem("JWT");

  if (Component === Login) {
    if (token) {
      return <Redirect to="/" />;
    } else return <Component />;
  }
  if (token) {
    return <Component />;
  } else {
    return <Redirect to="/login" />;
  }
};
