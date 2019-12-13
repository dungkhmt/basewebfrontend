import MainCss from "../css/main.scss";
// import BootStrap from "bootstrap";

import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter, 
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import Tung from "./Tung";
import TungCao from "./TungCao";

import rootSaga from "./sagas";

const ErrorPage = () => (
  <h3>Error Page</h3>
);

const Home = () => (
  <h1>Home Page</h1>
);

const initialState = 0;

const reducer1 = (state = initialState, action) => {
  switch (action.type) {
    case "INC":
      return state + 1;

    case "DEC":
      return state - 1;

    default:
      return state;
  }
};

const reducer2 = (state = "", action) => {
  switch (action.type) {
    case "CHANGED":
      return action.text;

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  counter: reducer1,
  input: reducer2
});

const composeEnhancers = composeWithDevTools({});
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
);
sagaMiddleware.run(rootSaga);

const App = () => (
  <div>
    <div>
      <Link to="/tungquang">Tung Quang</Link>
    </div>
    <div>
      <Link to="/tungcao">Tung Cao</Link>
    </div>

    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/tungquang">
        <Tung />
      </Route>
      <Route path="/tungcao">
        <TungCao />
      </Route>
      <Route path="/error">
        <ErrorPage />
      </Route>
      <Redirect to="/error" />
    </Switch>
  </div>
);

const main = document.getElementById("main");
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , main);
