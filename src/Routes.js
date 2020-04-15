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
import CustomerCreate from "./component/customer/CustomerCreate";
import CustomerList from "./component/customer/CustomerList";
import SalesmanList from "./component/salesman/SalesmanList";
import DetailSalesman from "./component/salesman/DetailSalesman";
import SalesmanCreate from "./component/salesman/SalesmanCreate";
import SalesmanAdd from "./component/salesman/SalesmanAdd";
import InventoryOrderList from "./component/inventory/InventoryOrderList";
import InventoryOrderDetail from "./component/inventory/InventoryOrderDetail";
import InventoryOrderExport from "./component/inventory/InventoryOrderExport";
import InventoryList from "./component/inventory/InventoryList";
import {SaleReportByPartyCustomer, SaleReportByProduct} from "./component/report/SaleReport";
import SaleReportByDate from "./component/reportsales/SalesReportByDate";

import InventoryOrderExportList from "./component/inventory/InventoryOrderExportList";
import ListDepartment from "./component/departments/listdepartment";
import ListLocation from "./component/geo/ListLocation";
import GeoGoogleMapChangeCoordinates from "./component/geo/GeoGoogleMapChangeCoordinates";
import GeoListDistanceInfo from "./component/geo/GeoListDistanceInfo";
import ChangeDistanceDetail from "./component/geo/ChangeDistanceDetail";
import ItemDelivery from "./component/postsystem/delivery/ItemDelivery";


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
        component={ListDepartment}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/departments/list"                    // props
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


      <PrivateRouteWithLayout
        component={CustomerCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/customer/create"
      />

      <PrivateRouteWithLayout
        component={CustomerList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/customer/list"
      />

      <PrivateRouteWithLayout
        component={InventoryOrderList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/inventory/order"
      />

      <PrivateRouteWithLayout
        component={SalesmanList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/salesman/list"
      />


      <PrivateRouteWithLayout
        component={SalesmanCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sales/create"
      />

      <PrivateRouteWithLayout
        component={SalesmanAdd}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sales/add/:partyId"
      />

      <PrivateRouteWithLayout
        component={DetailSalesman}  //props
        layout={Layout}          //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/salesman/:partyId"                    // props
      />


      <Route
        component={SignInContainer} // props
        path="/login"               // props
      />
      <Route
        component={error} // props
        path="/not-found"               // props
      />
      <PrivateRouteWithLayout
        component={InventoryOrderDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/inventory/order/:orderId"
      />

      <PrivateRouteWithLayout
        component={InventoryOrderExport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/inventory/export/:orderId"
      />

      <PrivateRouteWithLayout
        component={InventoryOrderExportList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/inventory/export-list"
      />

      <PrivateRouteWithLayout
        component={InventoryList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/inventory/list"
      />

      <PrivateRouteWithLayout
        component={SaleReportByProduct}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sale-reports-by-product"
      />

      <PrivateRouteWithLayout
        component={SaleReportByPartyCustomer}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sale-reports-by-customer"
      />

      <PrivateRouteWithLayout
        component={SaleReportByDate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sale-reports-by-date"
      />

      <PrivateRouteWithLayout
        component={ListLocation}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/geo/list/location"
      />

      <PrivateRouteWithLayout
        component={GeoGoogleMapChangeCoordinates}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/geo/location/map/:contactMechId"
      />

      <PrivateRouteWithLayout
        component={GeoListDistanceInfo}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/geo/list/distance-info"
      />

      <PrivateRouteWithLayout
        component={ChangeDistanceDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/geo/change/distance-detail/:fromContactMechId/:toContactMechId"
      />

      <PrivateRouteWithLayout
        component={ItemDelivery}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-item-delivery-plan"
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
