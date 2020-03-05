import { combineReducers } from "redux";
import auth from "./auth";
import security from "./security";

export default combineReducers({
  auth,
  security
});
