import { combineReducers } from "redux";
import auth from "./auth";
import security from "./security";
import notifications from "./notifications";

export default combineReducers({
  auth,
  security,
  notifications
});
