import { API_URL } from "../config/config";
import { failed } from "./Auth";

export const MENU_REQUESTING = "MENU_REQUESTING";
export const MENU_REQUEST_SUCCESS = "MENU_REQUEST_SUCCESS";
export const MENU_REQUEST_FAILURE = "MENU_REQUEST_FAILURE";

export const getMenu = () => {
  return (dispatch, getState) => {
    dispatch(menuRequesting());
    const headers = new Headers();

    //headers.append("Accept", "application/json");

    headers.append("X-Auth-Token", getState().auth.token);
    fetch(`${API_URL}/menu`, {
      method: "GET",
      headers: headers
    })
      .then(res => res.json())
      .then(
        res => {
          dispatch(menuRequestSuccess(res));
        },
        error => {
          dispatch(failed());
          dispatch(menuRequestFailed());
        }
      );
  };
};

const menuRequesting = () => {
  return {
    type: MENU_REQUESTING
  };
};
const menuRequestFailed = () => {
  return {
    type: MENU_REQUEST_FAILURE
  };
};
const menuRequestSuccess = menu => {
  return {
    type: MENU_REQUEST_SUCCESS,
    menu: menu
  };
};
