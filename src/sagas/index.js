import { takeEvery, put, call, select } from "redux-saga/effects";
import {
  LOGIN,
  loginFailed,
  loginSuceeded,
  LOGIN_SUCEEDED,
  LOGOUT,
  API_REQUEST,
  logoutAction
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
    console.log("Api request error!!!");
  }
}

function* rootSaga() {
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(LOGIN_SUCEEDED, loginSuceededSaga);
  yield takeEvery(LOGOUT, logoutSaga);
  yield takeEvery(API_REQUEST, apiRequestSaga);
}

export default rootSaga;
