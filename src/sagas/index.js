import { takeEvery, put, call, select, delay } from "redux-saga/effects";
import {
  LOGIN,
  loginFailed,
  loginSuceeded,
  LOGIN_SUCEEDED,
  LOGOUT,
  API_REQUEST,
  logoutAction,
  removeNotification,
  PUSH_NOTIFICATION,
  pushErrorNotification,
  pushSuccessNotification,
  SAVED_GROUP_PERMISSIONS,
  ADD_SECURITY_GROUP,
  apiPost,
  ADDED_SECURITY_GROUP,
  ADD_SECURITY_GROUP_FAILED
} from "../actions";
import { apiLogin } from "./api";

function* loginSaga(action) {
  const response = yield call(apiLogin, action.username, action.password);

  if (response.status === 401) {
    yield put(loginFailed());
  } else if (response.status === 200) {
    const token = response.headers.get("X-Auth-Token");
    const body = yield call(() => response.json());
    yield put(loginSuceeded(token, body.userLogin, body.securityPermissions));
  } else {
    console.log("SERVER PROBLEM!!!");
  }
}

function* loginSuceededSaga(action) {
  const auth = {
    token: action.token,
    userLogin: action.userLogin,
    securityPermissions: action.securityPermissions
  };

  yield call(() => localStorage.setItem("auth", JSON.stringify(auth)));
}

function* logoutSaga() {
  yield call(() => localStorage.removeItem("auth"));
}

function* apiRequestSaga(action) {
  const token = yield select(state => state.auth.token);

  const options = {
    method: action.method,
    headers: {
      "X-Auth-Token": token
    }
  };
  const body = JSON.stringify(action.body);

  const postOptions = {
    ...options,
    body,
    headers: { ...options.headers, "Content-Type": "application/json" }
  };
  const response = yield call(
    fetch,
    action.url,
    action.method === "POST" ? postOptions : options
  );

  if (response.status === 401) {
    yield put(logoutAction());
  } else if (response.status === 200) {
    const json = yield call(() => response.json());
    yield put({ type: action.actionType, body: json });
  } else {
    console.log(action.errorActionType);
    if (action.errorActionType) {
      yield put({ type: action.errorActionType, status: response.status });
    } else {
      const sequence = yield select(state => state.notifications.sequence);
      yield put(
        pushErrorNotification(sequence, `Request error: ${response.status}!!!`)
      );
    }
  }
}

function* pushNotificationSaga(action) {
  yield delay(10000);
  yield put(removeNotification(action.id));
}

function* savedSecurityGroupPermissionsSaga() {
  const sequence = yield select(state => state.notifications.sequence);
  yield put(pushSuccessNotification(sequence, "Saved sucessfully"));
}

function* addSecurityGroupSaga(action) {
  yield put(
    apiPost(
      "/api/security/add-security-group",
      { name: action.name },
      ADDED_SECURITY_GROUP,
      ADD_SECURITY_GROUP_FAILED
    )
  );
}

function* addedSecurityGroupSaga() {
  const sequence = yield select(state => state.notifications.sequence);
  yield put(pushSuccessNotification(sequence, "Added sucessfully"));
}

function* addSecurityGroupFailedSaga() {
  const sequence = yield select(state => state.notifications.sequence);
  yield put(pushErrorNotification(sequence, "Add failed!!!"));
}

function* rootSaga() {
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(LOGIN_SUCEEDED, loginSuceededSaga);
  yield takeEvery(LOGOUT, logoutSaga);
  yield takeEvery(API_REQUEST, apiRequestSaga);
  yield takeEvery(PUSH_NOTIFICATION, pushNotificationSaga);

  yield takeEvery(SAVED_GROUP_PERMISSIONS, savedSecurityGroupPermissionsSaga);

  yield takeEvery(ADD_SECURITY_GROUP, addSecurityGroupSaga);
  yield takeEvery(ADDED_SECURITY_GROUP, addedSecurityGroupSaga);
  yield takeEvery(ADD_SECURITY_GROUP_FAILED, addSecurityGroupFailedSaga);
}

export default rootSaga;
