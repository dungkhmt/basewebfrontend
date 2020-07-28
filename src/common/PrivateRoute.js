import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
