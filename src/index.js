// import "./wdyr"; // <--- first import
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { LOGOUT_SUCCESS } from "./action/Auth";
import App from "./App";
import "./index.css";
import appReducer from "./reducers";
import * as serviceWorker from "./serviceWorker";

const loggerMiddleware = createLogger();
let middleware = [
  thunkMiddleware, // lets us dispatch() functions
];
if (process.env.NODE_ENV !== "production") {
  middleware = [...middleware, loggerMiddleware]; // neat middleware that logs actions
}
var startState = {};

if (
  localStorage.getItem("TOKEN") !== null &&
  localStorage.getItem("TOKEN") !== "null"
) {
  startState = {
    auth: {
      token: localStorage.getItem("TOKEN"),
      isAuthenticated: true,
    },
  };
} else {
  startState = {
    auth: {
      token: null,
      isAuthenticated: false,
    },
  };
}

const rootReducer = (state, action) => {
  // Clean store.
  if (action.type === LOGOUT_SUCCESS) {
    // If the state given to a reducer is undefined, it will return the initial state.
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = createStore(
  rootReducer,
  startState,
  composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
  localStorage.setItem("TOKEN", store.getState().auth.token);
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
