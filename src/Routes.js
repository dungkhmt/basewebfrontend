import React from "react";
import { Route, Switch } from "react-router-dom";

import { Layout } from "./layout";
import { Home, PrivateRouteWithLayout } from "./component";
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
import DeliveryTripDetailList from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import DeliveryTripDetailCreate from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
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
import DistributorList from "./component/distributor/DistributorList";
import DistributorDetail from "./component/distributor/DistributorDetail";
import DistributorCreate from "./component/distributor/DistributorCreate";
import RetailOutletList from "./component/retailoutlet/RetailOutletList";
import RetailOutletCreate from "./component/retailoutlet/RetailOutletCreate";
import AssignSalesman2Distributor from "./component/salesroutes/AssignSalesman2Distributor";
import AssignSalesman2RetailOutlet from "./component/salesroutes/AssignSalesman2RetailOutlet";

import DriverList from "./component/shipment/driver/DriverList";
import DriverCreate from "./component/shipment/driver/DriverCreate";

import SalesmanList from "./component/salesman/SalesmanList";

import DetailSalesman from "./component/salesman/DetailSalesman";
import SalesmanCreate from "./component/salesman/SalesmanCreate";
import SalesmanAdd from "./component/salesman/SalesmanAdd";
import InventoryOrderList from "./component/inventory/InventoryOrderList";
import InventoryOrderDetail from "./component/inventory/InventoryOrderDetail";
import InventoryOrderExport from "./component/inventory/InventoryOrderExport";
import InventoryList from "./component/inventory/InventoryList";
import {
  SaleReportByPartyCustomer,
  SaleReportByProduct,
} from "./component/report/SaleReport";
import SaleReportByDate from "./component/reportsales/SalesReportByDate";

import InventoryOrderExportList from "./component/inventory/InventoryOrderExportList";
import ListDepartment from "./component/departments/listdepartment";
import ListLocation from "./component/geo/ListLocation";
import GeoGoogleMapChangeCoordinates from "./component/geo/GeoGoogleMapChangeCoordinates";
import GeoListDistanceInfo from "./component/geo/GeoListDistanceInfo";
import ChangeDistanceDetail from "./component/geo/ChangeDistanceDetail";
import CreateContainer from "./component/tmscontainer/container/CreateContainer";
import ListContainer from "./component/tmscontainer/container/ListContainer";
import DepotContainerCreate from "./component/tmscontainer/depotContainer/DepotContainerCreate";
import DepotContainerList from "./component/tmscontainer/depotContainer/DepotContainerList";
import DepotContainerGoogleMap from "./component/tmscontainer/depotContainer/DepotContainerGoogleMap";
import DepotTrailerCreate from "./component/tmscontainer/depotTrailer/DepotTrailerCreate";
import DepotTrailerList from "./component/tmscontainer/depotTrailer/DepotTrailerList";
import DepotTrailerGoogleMap from "./component/tmscontainer/depotTrailer/DepotTrailerGoogleMap";
import DepotTruckCreate from "./component/tmscontainer/depotTruck/DepotTruckCreate";
import DepotTruckList from "./component/tmscontainer/depotTruck/DepotTruckList";
import DepotTruckGoogleMap from "./component/tmscontainer/depotTruck/DepotTruckGoogleMap";
import TrailerCreate from "./component/tmscontainer/trailer/TrailerCreate";
import TrailerList from "./component/tmscontainer/trailer/TrailerList";
import PortCreate from "./component/tmscontainer/port/PortCreate";
import PortList from "./component/tmscontainer/port/PortList";
import PortGoogleMap from "./component/tmscontainer/port/PortGoogleMap";
import ShipmentItemDeliveryTripDetailList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
import NotScheduledShipmentItem from "./component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";
import ProductDetail from "./component/product/detailproduct";
import {
  TransportReportByDriver,
  TransportReportByFacility,
  TransportReportByPartyCustomer,
} from "./component/report/TransportReport";
import SolverConfigParam from "./component/shipment/solver/SolverConfigParam";
import CreateRequestTransportContainerToWarehouse from "./component/tmscontainer/requestimportfull/CreateRequestTransportContainerToWarehouse";
import ListRequestTransportContainerToWareHouse from "./component/tmscontainer/requestimportfull/ListRequestTransportContainerToWareHouse";
import VehicleDetail from "./component/shipment/vehicle/VehicleDetail";
import VehicleNotInDeliveryTrips from "./component/shipment/deliveryplan/vehicle/VehicleNotInDeliveryTrips";
import DriverDetail from "./component/shipment/driver/DriverDetail";
import CreateRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/CreateRequestTransportContainerEmpty";
import ListRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/ListRequestTransportContainerEmpty";
import ListRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/ListRequestTransportContainerEmptyExport";
import CreateRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/CreateRequestTransportContainerEmptyExport";
import CreateRequestTransportFullExport from "./component/tmscontainer/requestexportfull/CreateRequestTransportFullExport";
import ListRequestTransportFullExport from "./component/tmscontainer/requestexportfull/ListRequestTransportFullExport";
import RetailOutletDetail from "./component/retailoutlet/RetailOutletDetail";
import {
  Invoice,
  InvoiceDetail,
  Payment,
  PaymentApplication,
} from "./component/accounting/InvoiceDataTable";
import { PaymentCreate } from "./component/accounting/PaymentCreate";
import PaymentApplicationCreate from "./component/accounting/PaymentApplicationCreate";
import PostOfficeList from './component/postsystem/postoffice/PostOfficeList'
import CreatePostOffice from './component/postsystem/postoffice/CreatePostOffice'
import SalesRoutesPlanning from './component/salesroutes/SalesRoutesPlanning'
import SalesRoutesPlanningPeriod from './component/salesroutes/SalesRoutesPlanningPeriod'

function Routes(props) {
  // props nay tu parent transfer vao
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
        component={ListDepartment} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/departments/list" // props
      />

      <PrivateRouteWithLayout
        component={UserCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/create" // props
      />
      <PrivateRouteWithLayout
        component={UserList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/list" // props
      />

      <PrivateRouteWithLayout
        component={EditUser} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/:partyId/edit" // props
      />
      <PrivateRouteWithLayout
        component={DetailUserLogin} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/userlogin/:partyId" // props
      />

      <PrivateRouteWithLayout
        component={OrderCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/orders/create" // props
      />

      <PrivateRouteWithLayout
        component={OrderList}
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/orders/list" // props
      />
      <PrivateRouteWithLayout
        component={DetailOrder} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/orders/:orderId" // props
      />
      <PrivateRouteWithLayout
        //component={ListTrackLocations}  //props
        component={TrackLocationList}
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/tracklocations/list" // props
      />
      <PrivateRouteWithLayout
        component={GMapContainer} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //exact                                   // props
        path="/tracklocations/gismap" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryPlanCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan/create" // props
      />
      <PrivateRouteWithLayout
        component={DeliveryPlanList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan-list" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-plan/:deliveryPlanId" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/delivery-trip/:deliveryTripId" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripDetailCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/create-delivery-trip-detail/:deliveryTripId" // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemDeliveryPlanList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/shipment-item-delivery-plan/:deliveryPlanId/list" // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemDeliveryPlanAdd} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/shipment-item-delivery-plan/:deliveryPlanId/add" // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact // props
        path="/shipment" // props
      />

      <PrivateRouteWithLayout
        component={VehicleList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact // props
        path="/vehicle" // props
      />

      <PrivateRouteWithLayout
        component={PostOfficeList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact // props
        path="/postoffice/list"
      />

      <PrivateRouteWithLayout
        component={CreatePostOffice} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact // props
        path="/postoffice/create"
      />

      <PrivateRouteWithLayout
        component={ShipmentItemCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        exact // props
        path="/create-shipment-item" // props
      />

      <PrivateRouteWithLayout
        component={ShipmentItemDeliveryTripDetailList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/shipment-item-info/:shipmentItemId" // props
      />

      <PrivateRouteWithLayout
        component={NotScheduledShipmentItem} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/not-scheduled-shipment-items/:deliveryPlanId" // props
      />

      <PrivateRouteWithLayout
        component={VehicleDeliveryPlanList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-delivery-plan/:deliveryPlanId/list" // props
      />

      <PrivateRouteWithLayout
        component={VehicleDeliveryPlanAdd} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-delivery-plan/:deliveryPlanId/add" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/create-delivery-trip/:deliveryPlanId" // props
      />
      
      <PrivateRouteWithLayout
        component={SalesRoutesPlanning} 
        layout={Layout}
        isAuthenticated={props.isAuthenticated}                             
        path="/salesroutes/planning" 
      />

      <PrivateRouteWithLayout
        component={SalesRoutesPlanningPeriod} 
        layout={Layout}
        isAuthenticated={props.isAuthenticated}                             
        path="/salesroutes/planning-period/:periodCode" 
      />

      <PrivateRouteWithLayout
        component={SalesmanCheckinRoutesHistory} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/salesroutes/salesman-checkin-routes" // props
      />

      <PrivateRouteWithLayout
        component={DeliveryTripChart} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/delivery-trip-chart/:deliveryPlanId" // props
      />

      <PrivateRouteWithLayout
        component={SolverConfigParam} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/solver-config-param" // props
      />

      <PrivateRouteWithLayout
        component={VehicleDetail} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-detail/:vehicleId" // props
      />

      <PrivateRouteWithLayout
        component={DriverDetail} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/driver-detail/:driverId" // props
      />

      <PrivateRouteWithLayout
        component={VehicleNotInDeliveryTrips} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        // exact                                   // props
        path="/vehicle-not-in-delivery-trips/:deliveryPlanId" // props
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
        component={ProductDetail} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/product/:productId" // props
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
        component={DistributorCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/distributor/create"
      />
      <PrivateRouteWithLayout
        component={DistributorList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/distributor/list"
      />
      <PrivateRouteWithLayout
        component={DistributorDetail} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/distributor/:partyId" // props
      />
      <PrivateRouteWithLayout
        component={RetailOutletCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/retailoutlet/create"
      />

      <PrivateRouteWithLayout
        component={RetailOutletList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/retailoutlet/list"
      />

      <PrivateRouteWithLayout
        component={RetailOutletDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/retailoutlet/:partyId"
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
        component={AssignSalesman2Distributor}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/salesman/assign-salesman-2-distributor"
      />
      <PrivateRouteWithLayout
        component={AssignSalesman2RetailOutlet}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/salesman/assign-salesman-2-retail-outlet"
      />

      <PrivateRouteWithLayout
        component={DriverList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/driver/list"
      />
      <PrivateRouteWithLayout
        component={DriverCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/driver/create"
      />

      <PrivateRouteWithLayout
        component={SalesmanCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/salesman/create"
      />

      <PrivateRouteWithLayout
        component={SalesmanAdd}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/sales/add/:partyId"
      />

      <PrivateRouteWithLayout
        component={DetailSalesman} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/salesman/:partyId" // props
      />

      <Route
        component={SignInContainer} // props
        path="/login" // props
      />
      <Route
        component={error} // props
        path="/not-found" // props
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

      {/*transport report*/}

      <PrivateRouteWithLayout
        component={TransportReportByDriver}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/transport-reports-by-driver"
      />

      <PrivateRouteWithLayout
        component={TransportReportByFacility}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/transport-reports-by-facility"
      />

      <PrivateRouteWithLayout
        component={TransportReportByPartyCustomer}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/transport-reports-by-customer"
      />

      {/*end*/}

      {/*invoice*/}

      <PrivateRouteWithLayout
        component={InvoiceDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/invoice-detail/:invoiceId"
      />

      <PrivateRouteWithLayout
        component={Invoice}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/invoice-sales/list"
      />

      <PrivateRouteWithLayout
        component={Payment}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/customer-payment/list"
      />

      <PrivateRouteWithLayout
        component={PaymentCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-payment"
      />

      <PrivateRouteWithLayout
        component={PaymentApplicationCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-payment-application/:paymentId"
      />

      <PrivateRouteWithLayout
        component={PaymentApplication}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/payment-application/:paymentId"
      />

      {/*end*/}

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
        component={CreateContainer}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/containerfunc/create"
      />

      <PrivateRouteWithLayout
        component={ListContainer}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/containerfunc/list"
      />

      <PrivateRouteWithLayout
        component={DepotContainerCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depotcontainerfunc/create"
      />

      <PrivateRouteWithLayout
        component={DepotContainerList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depotcontainerfunc/list"
      />

      <PrivateRouteWithLayout
        component={DepotContainerGoogleMap}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depotcontainerfunc/googlemap"
      />

      <PrivateRouteWithLayout
        component={DepotTrailerCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottrailerfunc/create"
      />

      <PrivateRouteWithLayout
        component={DepotTrailerList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottrailerfunc/list"
      />
      <PrivateRouteWithLayout
        component={DepotTrailerGoogleMap}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottrailerfunc/googlemap"
      />

      <PrivateRouteWithLayout
        component={DepotTruckCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottruckfunc/create"
      />

      <PrivateRouteWithLayout
        component={DepotTruckList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottruckfunc/list"
      />
      <PrivateRouteWithLayout
        component={DepotTruckGoogleMap}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/depottruckfunc/googlemap"
      />

      <PrivateRouteWithLayout
        component={TrailerCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/trailerfunc/create"
      />

      <PrivateRouteWithLayout
        component={TrailerList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/trailerfunc/list"
      />

      <PrivateRouteWithLayout
        component={PortCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/portfunc/create"
      />

      <PrivateRouteWithLayout
        component={PortList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/portfunc/list"
      />

      <PrivateRouteWithLayout
        component={PortGoogleMap}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/portfunc/googlemap"
      />

      <PrivateRouteWithLayout
        component={CreateRequestTransportContainerToWarehouse}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-request-transport-container-to-warehouse"
      />

      <PrivateRouteWithLayout
        component={ListRequestTransportContainerToWareHouse}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/list-request-transport-container-to-warehouse"
      />

      <PrivateRouteWithLayout
        component={CreateRequestTransportContainerEmpty}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-request-transport-container-empty"
      />

      <PrivateRouteWithLayout
        component={ListRequestTransportContainerEmpty}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/list-request-transport-container-empty"
      />

      <PrivateRouteWithLayout
        component={CreateRequestTransportContainerEmptyExport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-request-transport-container-empty-export"
      />
      <PrivateRouteWithLayout
        component={ListRequestTransportContainerEmptyExport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/list-request-transport-container-empty-export"
      />

      <PrivateRouteWithLayout
        component={CreateRequestTransportFullExport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-request-transport-full-export"
      />
      <PrivateRouteWithLayout
        component={ListRequestTransportFullExport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/list-request-transport-full-export"
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
        component={DetailSalesman} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/salesman/:partyId" // props
      />
    </Switch>
  );
}

export default Routes;
