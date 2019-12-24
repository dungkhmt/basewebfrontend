import { API_URL } from "../config/config";
import base64 from "base-64";

export const LOGIN_REQUESTING = "LOGIN_REQUESTING";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const login = (username, password) => {
  return dispatch => {
    dispatch(requesting());

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
const failed = () => {
  return {
    type: LOGIN_FAILURE
  };
};
const success = token => {
  return {
    type: LOGIN_SUCCESS,
    token: token
  };
};
