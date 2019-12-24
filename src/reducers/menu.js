import {
  MENU_REQUEST_FAILURE,
  MENU_REQUEST_SUCCESS,
  MENU_REQUESTING
} from "../action/Menu";
const menu = (state = { menu: new Set(), isRequesting: false }, action) => {
  switch (action.type) {
    case MENU_REQUESTING:
      return Object.assign({}, state, { isRequesting: true });
    case MENU_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        menu: new Set(action.menu),

        isRequesting: false
      });
    case MENU_REQUEST_FAILURE:
      return Object.assign({}, state, {
        isRequesting: false
      });

    default:
      return state;
  }
};

export default menu;
