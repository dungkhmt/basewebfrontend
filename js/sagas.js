import { call, takeEvery, takeLatest, delay, put } from "redux-saga/effects";

const api = url => fetch(url).then(response => response.json());

function *runApi() {
  const json = yield call(api, "http://dummy.restapiexample.com/api/v1/employees");
  yield put({ type: "INC" });
}

function *incAsync() {
  yield delay(1000);
  yield put({ type: "INC" });
}

function *rootSaga() {
  yield takeEvery("RUN_API", runApi);
  yield takeLatest("INC_ASYNC", incAsync);
}

export default rootSaga;
