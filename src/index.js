import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import rootReducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
const loggerMiddleware = createLogger();


var startState={};
if( localStorage.getItem('TOKEN')!==null){
  startState = {
    auth: {
      token: localStorage.getItem('TOKEN'),
      isAuthenticated: true
  }};
} else {
  startState = {
    auth: {
      token: null,
      isAuthenticated: false
  }};
};



const store = createStore(
  rootReducer,
  startState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    )
  ),
);

store.subscribe(() =>{
  localStorage.setItem('TOKEN', store.getState().auth.token);
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
