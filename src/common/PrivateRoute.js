import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory, } from "react-router";
import { Route } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: history.location } }} />
        )
      }
    />
  );
}

export default PrivateRoute;
