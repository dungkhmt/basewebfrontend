import React from "react";
import { Redirect, Switch } from "react-router-dom";

import { Layout } from "./layout";
import { Home, PrivateRouteWithLayout } from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
import { Route } from "react-router-dom";

function Routes(props) {
  return (
    <Switch>
      <PrivateRouteWithLayout
        component={Home}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/"
      />
      <PrivateRouteWithLayout
        component={OrderCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/order/create"
      />
      <Route component={SignInContainer} path="/login" />
      <Redirect to="/not-found" />
    </Switch>
  );
}

export default Routes;
