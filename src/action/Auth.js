import { API_URL } from "../config/config";
import base64 from "base-64";

export const LOGIN_REQUESTING = "LOGIN_REQUESTING";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";


export const logout = ()=> {
  return (dispatch,getState) => {
    dispatch(requesting()); // create a action
    const headers = new Headers();

    
    headers.append("Content-Type", "application/json");
    headers.append("X-Auth-Token", getState().auth.token);

    fetch(`${API_URL}/logout`, {
      method: "GET",
      headers: headers
    })
      .then(res => {
        if (res.ok) {
          dispatch(logoutsuccess());
        }
        return res.json();
      })
      .then(
        res => {
          // if (res.status === "SUCCESS") {
          //     dispatch(success());
          // } else{
          //     dispatch(failed());
          // }
        },
        error => {
          dispatch(failed());
        }
      );
  };    
  
}

export const login = (username, password) => {
  return dispatch => {
    dispatch(requesting()); // create a action

    const headers = new Headers();

    //headers.append("Accept", "application/json");
    headers.set(
      "Authorization",
      "Basic " + base64.encode(username + ":" + password)
    );
    headers.append("Content-Type", "application/json");
    fetch(`${API_URL}/`, {
      method: "GET",
      headers: headers
    })
      .then(res => {
        if (res.ok) {
          dispatch(success(res.headers.get("X-Auth-Token")));
        }
        return res.json();
      })
      .then(
        res => {
          // if (res.status === "SUCCESS") {
          //     dispatch(success());
          // } else{
          //     dispatch(failed());
          // }
        },
        error => {
          dispatch(failed());
        }
      );
  };
};

const requesting = () => {
  return {
    type: LOGIN_REQUESTING
  };
};

export const failed = () => {
  return {
    type: LOGIN_FAILURE
  };
};
const success  = token => {// token la tham so cua ham success
//function success(token){   
  return {
    type: LOGIN_SUCCESS,
    token: token
  };
};
const logoutsuccess  = token => {// token la tham so cua ham success
  //function success(token){   
    return {
      type: LOGOUT_SUCCESS
    };
  };
  