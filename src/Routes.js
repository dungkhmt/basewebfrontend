import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import {Layout} from "./layout";
import {Home, PrivateRouteWithLayout} from "./component";
import OrderCreate from "./component/order/OrderCreate";
import SignInContainer from "./container/SignInContainer";
//import ListTrackLocations from "./component/tracklocations/listtracklocations";
import TrackLocationList from "./component/tracklocations/tracklocationlist";
import OrderList from "./component/order/listorders";
import DetailOrder from "./component/order/detailorder";
import UserCreate from "./component/userlogin/createuser";
import UserList from "./component/userlogin/userlist";
import error from "./component/common/error";

import GMapContainer from "./container/gmapcontainer";
import DetailUserLogin from "./component/userlogin/detailuserlogin";
import DeliveryPlanCreate from "./component/shipment/deliveryplan/DeliveryPlanCreate";
import DeliveryPlanList from "./component/shipment/deliveryplan/DeliveryPlanList";
import EditUser from "./component/userlogin/edituserlogin";
import DeliveryTripList from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripList";
import ShipmentItemList from "./component/shipment/shipment/ShipmentItemList";
import VehicleList from "./component/shipment/vehicle/VehicleList";
import DeliveryTripCreate from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailList
  from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import DeliveryTripDetailCreate
  from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import ShipmentItemDeliveryPlanList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanList";
import VehicleDeliveryPlanList from "./component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanList";
import ShipmentItemCreate from "./component/shipment/shipment/ShipmentItemCreate";
import VehicleDeliveryPlanAdd from "./component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanAdd";
import ShipmentItemDeliveryPlanAdd from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanAdd";
import ProductCreate from "./component/product/ProductCreate";
import ProductList from "./component/product/ProductList";
import SalesmanCheckinRoutesHistory from "./component/salesroutes/salesmancheckinrouteshistory";
import DeliveryTripChart from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripChart";


function Routes(props) {// props nay tu parent transfer vao
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
        path="/orders/create"                    // props
      />

      <PrivateRouteWithLayout
        component={OrderList}
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/orders/list"                    // props
      />
      <PrivateRouteWithLayout
        component={DetailOrder}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/orders/:orderId"                    // props
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
        path="/delivery-plan/:deliveryPlanId"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-trip/:deliveryTripId"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/create-delivery-trip-detail/:deliveryTripId"                    // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemDeliveryPlanList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/shipment-item-delivery-plan/:deliveryPlanId/list"                    // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemDeliveryPlanAdd}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/shipment-item-delivery-plan/:deliveryPlanId/add"                    // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemList}  //props
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
        component={ShipmentItemCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact                                   // props
        path="/create-shipment-item"                    // props
      />

      <PrivateRouteWithLayout
        component={VehicleDeliveryPlanList}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-delivery-plan/:deliveryPlanId/list"                    // props
      />

      <PrivateRouteWithLayout
        component={VehicleDeliveryPlanAdd}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-delivery-plan/:deliveryPlanId/add"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripCreate}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/create-delivery-trip/:deliveryPlanId"                    // props
      />
      <PrivateRouteWithLayout
        component={SalesmanCheckinRoutesHistory}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/salesroutes/salesman-checkin-routes"                    // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripChart}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/delivery-trip-chart/:deliveryPlanId"                    // props
      />



      <PrivateRouteWithLayout
          component={ProductCreate}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/products/create"
      />
      <PrivateRouteWithLayout
          component={ProductList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/products/list"
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
