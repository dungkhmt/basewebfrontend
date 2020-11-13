import {combineReducers} from "redux";
import auth from "./auth";
import menu from "./menu";
import error from "./error";
import screenSecurity from "./screen"

export default combineReducers({
  auth,
  menu,
  error,
  screenSecurity
});
