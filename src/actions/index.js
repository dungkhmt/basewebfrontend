export const LOGIN = "LOGIN";
export const LOGIN_SUCEEDED = "LOGIN_SUCEEDED";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGIN_PREVIOUS_URL = "LOGIN_PREVIOUS_URL";
export const LOGOUT = "LOGOUT";
export const LOGIN_STORAGE_CHANGED = "LOGIN_STORAGE_CHANGED";

export const API_REQUEST = "API_REQUEST";

export const GOT_ALL_GROUPS_AND_PERMISSIONS = "GOT_ALL_GROUPS_AND_PERMISSIONS";
export const SAVED_GROUP_PERMISSIONS = "SAVED_GROUP_PERMISSIONS";

export const loginAction = (username, password) => ({
  type: LOGIN,
  username,
  password
});

export const loginSuceeded = (token, userLogin, securityPermissions) => ({
  type: LOGIN_SUCEEDED,
  token,
  userLogin,
  securityPermissions
});

export const loginFailed = () => ({
  type: LOGIN_FAILED
});

export const loginPreviousUrl = url => ({
  type: LOGIN_PREVIOUS_URL,
  url
});

export const logoutAction = () => ({
  type: LOGOUT
});

export const loginStorageChanged = auth => ({
  type: LOGIN_STORAGE_CHANGED,
  auth
});

export const apiRequest = (url, method, body, actionType, previousUrl) => ({
  type: API_REQUEST,
  url,
  method,
  body,
  actionType,
  previousUrl
});

export const apiGet = (url, actionType) =>
  apiRequest(url, "GET", null, actionType);

export const apiPost = (url, body, actionType) =>
  apiRequest(url, "POST", body, actionType);
