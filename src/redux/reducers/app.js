import jwtDecode from "jwt-decode";
import { SET_USER } from "../actionTypes";

const token = localStorage.getItem("JWT");

const initialState = {
  user: token ? jwtDecode(token) : {},
};

const appReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    default:
      return state;
  }
};

export default appReducer;
