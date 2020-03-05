import React, { useEffect } from "react";
import { connect } from "react-redux";
import { STATE_LOGGED_IN } from "../reducers/auth";
import { Redirect, Route } from "react-router-dom";
import { loginPreviousUrl } from "../actions";

const CustomRoute = ({ state, path, children, changeUrl }) => {
  useEffect(() => {
    changeUrl(path);
  }, [path]);

  return (
    <React.Fragment>
      {state !== STATE_LOGGED_IN ? <Redirect to="/login" /> : children}
    </React.Fragment>
  );
};

const PrivateRoute = ({ state, path, children, changeUrl }) => (
  <Route path={path}>
    <CustomRoute state={state} path={path} changeUrl={changeUrl}>
      {children}
    </CustomRoute>
  </Route>
);

const mapState = state => ({
  state: state.auth.state
});

const mapDispatch = dispatch => ({
  changeUrl: url => dispatch(loginPreviousUrl(url))
});

export default connect(mapState, mapDispatch)(PrivateRoute);
