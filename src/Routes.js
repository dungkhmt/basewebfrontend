import React from "react";
import { Redirect, Switch } from "react-router-dom";

import { Layout } from "./layout";
import { Home, PrivateRouteWithLayout } from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
import { Route } from "react-router-dom";
import ListTrackLocations from "./component/tracklocations/listtracklocations";

function Routes(props) {// props nay tu parent transfer vao
  // console.log(props)
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
        component={OrderCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/order/create"                    // props
      />

      <PrivateRouteWithLayout
        component={ListTrackLocations}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/tracklocations/list"                    // props
      />
      <Route 
        component={SignInContainer} // props
        path="/login"               // props
      />
      <Redirect to="/not-found" />
    </Switch>
  );
}

export default Routes;
