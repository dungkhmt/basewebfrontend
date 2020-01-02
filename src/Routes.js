import React from "react";
import { Redirect, Switch, useParams } from "react-router-dom";

import { Layout } from "./layout";
import { Home, PrivateRouteWithLayout } from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
import { Route } from "react-router-dom";
import ListTrackLocations from "./component/tracklocations/listtracklocations";
import GISMap from "./component/tracklocations/gismap";
import UserLoginCreate from "./component/userlogin/UserLoginCreate";
import ListUserLogins from "./component/userlogin/listuserlogins";

import GMapContainer from "./container/gmapcontainer";
import DetailUserLogin from "./component/userlogin/detailuserlogin";



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
        component={UserLoginCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/create"                    // props
      />
      <PrivateRouteWithLayout
        component={ListUserLogins}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/list"                    // props
      />

      <PrivateRouteWithLayout
        component={DetailUserLogin}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/detail/:username"                    // props
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
      <PrivateRouteWithLayout
        component={GMapContainer}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/tracklocations/gismap"                    // props
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
