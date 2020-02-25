import { takeLatest, takeEvery, delay, put, call } from "redux-saga/effects";
import { INC_ASYNC, increment, API_REQUEST, apiResponse } from "../actions";

function* increaseAsyncSaga() {
  yield delay(1000);
  yield put(increment());
}

const apiCall = url => fetch(url).then(res => res.json());

function* apiRequestSaga(action) {
  const json = yield call(
    apiCall,
    `https://jsonplaceholder.typicode.com/todos/${action.id}`
  );
  yield put(apiResponse(json));
}

function* rootSaga() {
  yield takeLatest(INC_ASYNC, increaseAsyncSaga);
  yield takeEvery(API_REQUEST, apiRequestSaga);
}

export default rootSaga;
