import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import {Layout} from "./layout";
import {Home, PrivateRouteWithLayout} from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
//import ListTrackLocations from "./component/tracklocations/listtracklocations";
import TrackLocationList from "./component/tracklocations/tracklocationlist";
import UserCreate from "./component/userlogin/createuser";
import UserList from "./component/userlogin/userlist";
import error from "./component/common/error";

import GMapContainer from "./container/gmapcontainer";
import DetailUserLogin from "./component/userlogin/detailuserlogin";
import DeliveryPlanCreate from "./component/shipment/deliveryplan/DeliveryPlanCreate";
import DeliveryPlanList from "./component/shipment/deliveryplan/DeliveryPlanList";
import EditUser from "./component/userlogin/edituserlogin";
import DeliveryTripList from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripList";
import ShipmentList from "./component/shipment/shipment/ShipmentList";
import VehicleList from "./component/shipment/vehicle/VehicleList";
import DeliveryTripCreate from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailList
  from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import DeliveryTripDetailCreate
  from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import ShipmentItemList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemList";


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
        component={EditUser}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/:partyId/edit"                    // props
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
        path="/orders/list"                    // props
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

      <PrivateRouteWithLayout
        component={DeliveryPlanCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan/create"                    // props
      />
      <PrivateRouteWithLayout
        component={DeliveryPlanList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan-list"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan/"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-trip/"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/create-delivery-trip-detail/"                    // props
      />
      <PrivateRouteWithLayout
        component={ShipmentItemList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/shipment-item-delivery-plan/"                    // props
      />

      <PrivateRouteWithLayout
        component={ShipmentList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact                                   // props
        path="/shipment"                    // props
      />

      <PrivateRouteWithLayout
        component={VehicleList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact                                   // props
        path="/vehicle"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/create-delivery-trip/"                    // props
      />

      <Route
        component={SignInContainer} // props
        path="/login"               // props
      />
      <Route
        component={error} // props
        path="/not-found"               // props
      />
      <Redirect to="/not-found"/>
    </Switch>
  );
}

export default Routes;
