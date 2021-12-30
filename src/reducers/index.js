import { combineReducers } from "redux";
import auth from "./auth";
import cart from "./cart";
import classReducer from "./classReducer";
import error from "./error";
import screenSecurity from "./screen";

export default combineReducers({
  auth,
  // menu,
  error,
  screenSecurity,
  class: classReducer,
  cart,
});
