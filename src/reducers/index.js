import { combineReducers } from "redux";
import auth from "./auth";
import menu from "./menu";

export default combineReducers({
  auth,
  menu
});
