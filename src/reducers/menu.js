import {
  MENU_REQUEST_FAILURE,
  MENU_REQUEST_SUCCESS,
  MENU_REQUESTING,
  SELECTED_FUNCTION_UPDATE,
} from "../action/Menu";

const menu = (
  state = {
    menu: new Set(),
    isRequesting: false,
    isMenuGot: false,
    selectedFunction: null,
  },
  action
) => {
  switch (action.type) {
    case MENU_REQUESTING:
      return Object.assign({}, state, { isRequesting: true });
    case MENU_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        menu: new Set(action.menu),
        isMenuGot: true,
        isRequesting: false,
      });
    case SELECTED_FUNCTION_UPDATE:
      return Object.assign({}, state, {
        selectedFunction: action.selectedFunction,
      });
    case MENU_REQUEST_FAILURE:
      return Object.assign({}, state, {
        isRequesting: false,
        isMenuGot: false,
      });

    default:
      return state;
  }
};

export default menu;
