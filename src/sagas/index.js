import { takeEvery, put, call } from "redux-saga/effects";
import { LOGIN } from "../actions";
import { apiLogin } from "./api";

function* loginSaga(action) {
  const response = yield call(apiLogin, action.username, action.password);
  console.log(response);
  console.log(response.headers.get("X-Auth-Token"));
}

function* rootSaga() {
  yield takeEvery(LOGIN, loginSaga);
}

export default rootSaga;
