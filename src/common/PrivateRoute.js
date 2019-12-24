import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import HomeContainer from "../container/HomeContainer";
function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  console.log(isAuthenticated);
  return (
    <Route
      {...rest}
      render={props =>
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
