import { API_URL } from "../config/config";
import { failed } from "./Auth";
import api from "../api"

export const MENU_REQUESTING = "MENU_REQUESTING";
export const MENU_REQUEST_SUCCESS = "MENU_REQUEST_SUCCESS";
export const MENU_REQUEST_FAILURE = "MENU_REQUEST_FAILURE";

export const getMenu = () => {
  return (dispatch, getState) => {
    dispatch(menuRequesting());
   api.getMenu(dispatch,getState().auth.token).then(
        res => 
        {
          console.log(res);
          dispatch(menuRequestSuccess(res));
        },
        error => {
          console.log(error);
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
