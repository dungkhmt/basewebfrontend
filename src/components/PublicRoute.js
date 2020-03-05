import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { loginPreviousUrl } from "../actions";

const CustomRoute = ({ path, children, changeUrl }) => {
  useEffect(() => {
    changeUrl(path);
  }, [path]);

  return <React.Fragment>{children}</React.Fragment>;
};

const PublicRoute = ({ path, children, changeUrl }) => (
  <Route path={path}>
    <CustomRoute path={path} changeUrl={changeUrl}>
      {children}
    </CustomRoute>
  </Route>
);

const mapState = () => ({});

const mapDispatch = dispatch => ({
  changeUrl: url => dispatch(loginPreviousUrl(url))
});

export default connect(mapState, mapDispatch)(PublicRoute);
