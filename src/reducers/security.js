import { GOT_ALL_GROUPS_AND_PERMISSIONS } from "../actions";
import { arrayToObjectWithId } from "../util";

const initialState = {
  securityPermissions: {},
  securityGroups: {},
  securityGroupPermissions: {}
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
    default:
      return state;
  }
};

export default security;
