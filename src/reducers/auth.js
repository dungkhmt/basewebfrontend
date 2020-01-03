import { LOGOUT_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESTING } from "../action/Auth";
const auth = (
  state = { token:null, isAuthenticated: false, isRequesting: false },
  action
) => {
  switch (action.type) {
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {token:null, isAuthenticated: false, isRequesting: false });

    case LOGIN_REQUESTING:
      return Object.assign({}, state, { isRequesting: true });// lay data object cu, tao object moi, assign data cho object moi
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        token: action.token,
        isAuthenticated: true,
        isRequesting: false
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticated: false,
        isRequesting: false
      });

    default:
      return state;
  }
};

export default auth;
