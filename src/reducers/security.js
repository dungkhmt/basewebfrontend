import {
  GOT_ALL_GROUPS_AND_PERMISSIONS,
  SAVED_GROUP_PERMISSIONS,
  LOGOUT,
  OPEN_ADD_SECURITY_GROUP_DIALOG,
  CLOSE_ADD_SECURITY_GROUP_DIALOG,
  ADD_SECURITY_GROUP,
  ADD_SECURITY_GROUP_FAILED,
  ADDED_SECURITY_GROUP
} from "../actions";
import { arrayToObjectWithId } from "../util";

export const GROUP_INITIAL = 1;
export const GROUP_LOADING = 2;
export const GROUP_FAILED = 3;

const initialState = {
  securityPermissions: {},
  securityGroups: {},
  securityGroupPermissions: {},
  openAddSecurityGroupDialog: false,
  addSecurityGroupState: GROUP_INITIAL
};

const security = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_GROUPS_AND_PERMISSIONS:
      return {
        ...state,
        securityGroups: arrayToObjectWithId(action.body.securityGroups),
        securityPermissions: arrayToObjectWithId(
          action.body.securityPermissions
        ),
        securityGroupPermissions: action.body.securityGroupPermissions
      };

    case SAVED_GROUP_PERMISSIONS:
      return {
        ...state,
        securityGroupPermissions: action.body.securityGroupPermissions
      };

    case LOGOUT:
      return initialState;

    case OPEN_ADD_SECURITY_GROUP_DIALOG:
      return { ...state, openAddSecurityGroupDialog: true };

    case CLOSE_ADD_SECURITY_GROUP_DIALOG:
      return {
        ...state,
        openAddSecurityGroupDialog: false,
        addSecurityGroupState: GROUP_INITIAL
      };

    case ADD_SECURITY_GROUP:
      return { ...state, addSecurityGroupState: GROUP_LOADING };

    case ADDED_SECURITY_GROUP:
      return { ...state, addSecurityGroupState: GROUP_INITIAL };

    case ADD_SECURITY_GROUP_FAILED:
      return { ...state, addSecurityGroupState: GROUP_FAILED };

    default:
      return state;
  }
};

export default security;
