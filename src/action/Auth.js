import base64 from "base-64";
import { request } from "../api";
import { API_URL } from "../config/config";
import { menuState } from "../state/MenuState";
import { errorNoti } from "../utils/notification";
export const LOGIN_REQUESTING = "LOGIN_REQUESTING";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const ERROR = "ERROR";

export const logout = () => {
  menuState.permittedFunctions.set(new Set());

  return (dispatch, getState) => {
    dispatch(logoutsuccess());
    dispatch(requesting()); // create a action

    // Don't care if this request success or not.
    request("get", "/logout", (res) => {}, {
      onError: () => dispatch(failed()),
      401: () => {},
    });
  };
};

export const login = (username, password) => {
  return (dispatch) => {
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
      headers: headers,
    })
      .then((res) => {
        if (res.ok) {
          dispatch(success(res.headers.get("X-Auth-Token")));
        } else if (res.status === 401) {
          dispatch(failed(true, "Username or password is incorrect!!"));
          errorNoti("Tài khoản hoặc mật khẩu không đúng");
        }
        return res.json();
      })
      .then(
        (res) => {
          // if (res.status === "SUCCESS") {
          //     dispatch(success());
          // } else{
          //     dispatch(failed());
          // }
        },
        (error) => {}
      );
  };
};

const requesting = () => {
  return {
    type: LOGIN_REQUESTING,
  };
};

export const failed = (errorState = false, errorMsg = null) => {
  return {
    type: LOGIN_FAILURE,
    errorState: errorState,
    errorMsg: errorMsg,
  };
};
const success = (token) => {
  // token la tham so cua ham success
  //function success(token){
  return {
    type: LOGIN_SUCCESS,
    token: token,
  };
};
const logoutsuccess = (token) => {
  // token la tham so cua ham success
  //function success(token){
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const error = (errorState = false, errorMsg = null) => {
  console.log(errorMsg);
  return {
    type: ERROR,
    errorState: errorState,
    errorMsg: errorMsg,
  };
};
