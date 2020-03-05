import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import App from "./App";
import rootReducer from "./reducers";
import "./locales";
import rootSaga from "./sagas";
import { STATE_INIT, STATE_LOGGED_IN } from "./reducers/auth";
import { loginStorageChanged } from "./actions";
import { initialState as authInitialState } from "./reducers/auth";

const sagaMiddleware = createSagaMiddleware();

const authStringToObject = auth => {
  const previousUrl = "/";
  return auth === null
    ? { state: STATE_INIT, previousUrl }
    : { state: STATE_LOGGED_IN, previousUrl, ...JSON.parse(auth) };
};

const authFromLocalStorage = () => {
  const auth = localStorage.getItem("auth");
  return { ...authInitialState, ...authStringToObject(auth) };
};

const store = createStore(
  rootReducer,
  { auth: authFromLocalStorage() },
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const listenLocalStorage = () => {
  const callback = e => {
    if (e.key === "auth") {
      const auth = authStringToObject(e.newValue);
      store.dispatch(loginStorageChanged(auth));
    }
  };
  window.onstorage = callback;
};

listenLocalStorage();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
