import React from "react";
import { Route, Redirect } from "react-router-dom";
//import PrivateRoute from "../common/PrivateRoute";

function PrivateRouteWithLayout({
  component: Component,
  layout: Layout,
  isAuthenticated,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated === true ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRouteWithLayout;
