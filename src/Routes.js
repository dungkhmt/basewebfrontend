import React from "react";
import { Redirect, Switch, useParams } from "react-router-dom";

import { Layout } from "./layout";
import { Home, PrivateRouteWithLayout } from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
import { Route } from "react-router-dom";
//import ListTrackLocations from "./component/tracklocations/listtracklocations";
import TrackLocationList from "./component/tracklocations/tracklocationlist";
import GISMap from "./component/tracklocations/gismap";
import UserCreate from "./component/userlogin/createuser";
import UserList from "./component/userlogin/userlist";
import error from "./component/common/error";

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
        component={UserCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/create"                    // props
      />
      <PrivateRouteWithLayout
        component={UserList}  //props
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
        path="/userlogin/:partyId"                    // props
      />
      
      <PrivateRouteWithLayout
        component={OrderCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/order/create"                    // props
      />

      <PrivateRouteWithLayout
        //component={ListTrackLocations}  //props
        component={TrackLocationList}
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
      <Route 
        component={error} // props
        path="/not-found"               // props
      />
      <Redirect to="/not-found" />
    </Switch>
  );
}

export default Routes;
