import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { Home, PrivateRouteWithLayout } from "./component";
import {
  DistributorUnpaidInvoiceDetail,
  DistributorUnpaidInvoiceList,
  Invoice,
  InvoiceDetail,
  Payment,
  PaymentApplication,
} from "./component/accounting/InvoiceDataTable";
import PaymentApplicationCreate from "./component/accounting/PaymentApplicationCreate";
import { PaymentCreate } from "./component/accounting/PaymentCreate";
import QuickInvoicePayment from "./component/accounting/QuickInvoicePayment";
import error500 from "./component/common/error500";
import error from "./component/common/errornotfound";
import CustomerCreate from "./component/customer/CustomerCreate";
import CustomerList from "./component/customer/CustomerList";
import ListDepartment from "./component/departments/listdepartment";
import DistributorCreate from "./component/distributor/DistributorCreate";
import DistributorDetail from "./component/distributor/DistributorDetail";
import DistributorList from "./component/distributor/DistributorList";
import ChangeDistanceDetail from "./component/geo/ChangeDistanceDetail";
import GeoGoogleMapChangeCoordinates from "./component/geo/GeoGoogleMapChangeCoordinates";
import GeoListDistanceInfo from "./component/geo/GeoListDistanceInfo";
import ListLocation from "./component/geo/ListLocation";
import InventoryImport from "./component/inventory/InventoryImport";
import InventoryList from "./component/inventory/InventoryList";
import InventoryOrderDetail from "./component/inventory/InventoryOrderDetail";
import InventoryOrderExport from "./component/inventory/InventoryOrderExport";
import InventoryOrderExportList from "./component/inventory/InventoryOrderExportList";
import InventoryOrderList from "./component/inventory/InventoryOrderList";
import DetailOrder from "./component/order/detailorder";
import OrderList from "./component/order/listorders";
import OrderCreate from "./component/order/OrderCreate";
import PurchaseOrderCreate from "./component/order/PurchaseOrderCreate";
import PurchaseOrderList from "./component/order/PurchaseOrderList";
import CreatePostOffice from "./component/postsystem/postoffice/CreatePostOffice";
import PostOfficeList from "./component/postsystem/postoffice/PostOfficeList";
import AddProductImg from "./component/product/AddProductImg";
import ProductDetail from "./component/product/detailproduct";
import ProductCreate from "./component/product/ProductCreate";
import ProductEdit from "./component/product/ProductEdit";
import ProductList from "./component/product/ProductList";
import ProductPriceCreate from "./component/product/ProductPriceCreate";
import SetPrimaryImg from "./component/product/SetPrimaryImg";
import {
  SaleReportByPartyCustomer,
  SaleReportByProduct,
} from "./component/report/SaleReport";
import {
  TransportReportByDriver,
  TransportReportByFacility,
  TransportReportByPartyCustomer,
} from "./component/report/TransportReport";
import SaleReportByDate from "./component/reportsales/SalesReportByDate";
import RetailOutletCreate from "./component/retailoutlet/RetailOutletCreate";
import RetailOutletDetail from "./component/retailoutlet/RetailOutletDetail";
import RetailOutletList from "./component/retailoutlet/RetailOutletList";
import DetailSalesman from "./component/salesman/DetailSalesman";
import SalesmanAdd from "./component/salesman/SalesmanAdd";
import SalesmanCreate from "./component/salesman/SalesmanCreate";
import SalesmanList from "./component/salesman/SalesmanList";
import AssignSalesman2Distributor from "./component/salesroutes/AssignSalesman2Distributor";
import AssignSalesman2RetailOutlet from "./component/salesroutes/AssignSalesman2RetailOutlet";
import ListSalesman from "./component/salesroutes/ListSalesman";

import SalesmanCheckinRoutesHistory from "./component/salesroutes/salesmancheckinrouteshistory";
import SalesmanDetail from "./component/salesroutes/SalesmanDetail";
import DeliveryPlanCreate from "./component/shipment/deliveryplan/DeliveryPlanCreate";
import DeliveryPlanList from "./component/shipment/deliveryplan/DeliveryPlanList";
import DeliveryTripChart from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripChart";
import DeliveryTripCreate from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailCreate from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import DeliveryTripDetailList from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import DeliveryTripList from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripList";
import NotScheduledShipmentItem from "./component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";
import ShipmentItemDeliveryPlanAdd from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanAdd";
import ShipmentItemDeliveryPlanList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanList";
import ShipmentItemDeliveryTripDetailList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
import VehicleDeliveryPlanAdd from "./component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanAdd";
import VehicleDeliveryPlanList from "./component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanList";
import VehicleNotInDeliveryTrips from "./component/shipment/deliveryplan/vehicle/VehicleNotInDeliveryTrips";
import DriverCreate from "./component/shipment/driver/DriverCreate";
import DriverDetail from "./component/shipment/driver/DriverDetail";
import DriverList from "./component/shipment/driver/DriverList";
import ShipmentItemCreate from "./component/shipment/shipment/ShipmentItemCreate";
import ShipmentItemList from "./component/shipment/shipment/ShipmentItemList";
import SolverConfigParam from "./component/shipment/solver/SolverConfigParam";
import VehicleDetail from "./component/shipment/vehicle/VehicleDetail";
import VehicleList from "./component/shipment/vehicle/VehicleList";
import ProductPriceSupplier from "./component/supplier/ProductPriceSupplier";
import SupplierCreate from "./component/supplier/SupplierCreate";
import SupplierList from "./component/supplier/SupplierList";
import CreateContainer from "./component/tmscontainer/container/CreateContainer";
import ListContainer from "./component/tmscontainer/container/ListContainer";
import DepotContainerCreate from "./component/tmscontainer/depotContainer/DepotContainerCreate";
import DepotContainerGoogleMap from "./component/tmscontainer/depotContainer/DepotContainerGoogleMap";
import DepotContainerList from "./component/tmscontainer/depotContainer/DepotContainerList";
import DepotTrailerCreate from "./component/tmscontainer/depotTrailer/DepotTrailerCreate";
import DepotTrailerGoogleMap from "./component/tmscontainer/depotTrailer/DepotTrailerGoogleMap";
import DepotTrailerList from "./component/tmscontainer/depotTrailer/DepotTrailerList";
import DepotTruckCreate from "./component/tmscontainer/depotTruck/DepotTruckCreate";
import DepotTruckGoogleMap from "./component/tmscontainer/depotTruck/DepotTruckGoogleMap";
import DepotTruckList from "./component/tmscontainer/depotTruck/DepotTruckList";
import PortCreate from "./component/tmscontainer/port/PortCreate";
import PortGoogleMap from "./component/tmscontainer/port/PortGoogleMap";
import PortList from "./component/tmscontainer/port/PortList";
import CreateRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/CreateRequestTransportContainerEmptyExport";
import ListRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/ListRequestTransportContainerEmptyExport";
import CreateRequestTransportFullExport from "./component/tmscontainer/requestexportfull/CreateRequestTransportFullExport";
import ListRequestTransportFullExport from "./component/tmscontainer/requestexportfull/ListRequestTransportFullExport";
import CreateRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/CreateRequestTransportContainerEmpty";
import ListRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/ListRequestTransportContainerEmpty";
import CreateRequestTransportContainerToWarehouse from "./component/tmscontainer/requestimportfull/CreateRequestTransportContainerToWarehouse";
import ListRequestTransportContainerToWareHouse from "./component/tmscontainer/requestimportfull/ListRequestTransportContainerToWareHouse";
import TrailerCreate from "./component/tmscontainer/trailer/TrailerCreate";
import TrailerList from "./component/tmscontainer/trailer/TrailerList";
//import ListTrackLocations from "./component/tracklocations/listtracklocations";
import TrackLocationList from "./component/tracklocations/tracklocationlist";
import UserCreate from "./component/userlogin/createuser";
import DetailUserLogin from "./component/userlogin/detailuserlogin";
import EditUser from "./component/userlogin/edituserlogin";
import UserList from "./component/userlogin/userlist";
import Approve from "./component/userregister/Approve";
import Register from "./component/userregister/Register";
import GMapContainer from "./container/gmapcontainer";
import SignInContainer from "./container/SignInContainer";
import { Layout } from "./layout";
import NumberFormatTextField from "./utils/NumberFormatTextField";

import Plan from "./component/salesroutes/salesrouteplan/Plan";
import PlanPeriod from "./component/salesroutes/salesrouteplan/PlanPeriod";
import SalesRouteDetail from "./component/salesroutes/salesroutedatail/SalesRouteDetail";
import SalesRouteConfig from "./component/salesroutes/salesrouteconfig/SalesRouteConfig";
import AddVisitConfirguration from "./component/salesroutes/salesrouteplan/AddVisitConfirguration";
import EditVisitConfirguration from "./component/salesroutes/salesrouteplan/EditVisitConfiguration";
import AddSalesRouteConfig from "./component/salesroutes/salesrouteconfig/AddSalesRouteConfig";
import { mapPathMenu } from "./config/menuconfig";
import { updateSelectedFuction } from "./action";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ChangePassword from "./component/userlogin/changepassword";
import PrivateRoute from "./common/PrivateRoute";

function Routes(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(location.pathname);
    let selectedFunction = mapPathMenu.get(location.pathname);
    if (selectedFunction !== undefined && selectedFunction !== null)
      dispatch(updateSelectedFuction(selectedFunction));
  }, [location]);
  //if (props.error.isError) return <Route component={error500} path="*" />;
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
      <Route
        component={Register} //props
        layout={Layout} //props
        //isAuthenticated={true}
        //exact                                   // props
        path="/user/register" // props
      />
      <PrivateRouteWithLayout
        component={Approve} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/user/approve-register" // props
      />
      <PrivateRoute
        component={ChangePassword}
        isAuthenticated={props.isAuthenticated}
        path="/userlogin/change-password/:username"
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
        path="/orders/detail/:orderId" // props
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
        component={Plan}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/plan"
      />

      <PrivateRouteWithLayout
        component={PlanPeriod}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/plan/period"
      />

      <PrivateRouteWithLayout
        component={AddVisitConfirguration}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/plan/period/add/visit-confirguration"
      />

      <PrivateRouteWithLayout
        component={EditVisitConfirguration}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/plan/period/edit/visit-confirguration"
      />

      <PrivateRouteWithLayout
        component={SalesRouteDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/plan/period/detail"
      />

      <PrivateRouteWithLayout
        component={SalesRouteConfig}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/configs"
      />

      <PrivateRouteWithLayout
        component={AddSalesRouteConfig}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/configs/create-new"
      />

      <PrivateRouteWithLayout
        component={ListSalesman}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/salesman/list"
      />

      <PrivateRouteWithLayout
        component={SalesmanDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        exact
        path="/salesroutes/salesman/detail/:id"
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
        component={AddProductImg}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/product-add-img/:productId"
      />

      <PrivateRouteWithLayout
        component={SetPrimaryImg}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/set-product-primary-img/:productId"
      />

      <PrivateRouteWithLayout
        component={ProductEdit}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/product-edit/:productId"
      />

      <PrivateRouteWithLayout
        component={ProductList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/products/list"
      />
      <PrivateRouteWithLayout
        component={ProductPriceCreate}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/create-product-price/:productId"
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
        component={InventoryImport}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/inventory/import"
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
        component={QuickInvoicePayment}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/quick-create-payment-application/:invoiceId"
      />

      <PrivateRouteWithLayout
        component={PaymentApplication}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/payment-application/:paymentId"
      />

      <PrivateRouteWithLayout
        component={DistributorUnpaidInvoiceList}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/distributor-unpaid-invoice/list"
      />

      <PrivateRouteWithLayout
        component={DistributorUnpaidInvoiceDetail}
        layout={Layout}
        isAuthenticated={props.isAuthenticated}
        path="/distributor-unpaid-invoice-detail/:partyDistributorId"
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

      {/*number format test*/}
      <PrivateRouteWithLayout
        component={NumberFormatTextField} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/number-format-text-field-test" // props
      />

      <PrivateRouteWithLayout
        component={SupplierList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/supplier/list" // props
      />

      <PrivateRouteWithLayout
        component={SupplierCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/supplier/create" // props
      />

      <PrivateRouteWithLayout
        component={ProductPriceSupplier} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/product-price-supplier/list" // props
      />

      <PrivateRouteWithLayout
        component={PurchaseOrderList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/purchase-order/list" // props
      />

      <PrivateRouteWithLayout
        component={PurchaseOrderCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/purchase-order/create/:supplierPartyId" // props
      />

      <PrivateRouteWithLayout
        component={SupplierCreate} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/supplier/create" // props
      />

      <PrivateRouteWithLayout
        component={ProductPriceSupplier} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/product-price-supplier/list" // props
      />

      <PrivateRouteWithLayout
        component={PurchaseOrderList} //props
        layout={Layout} //props
        isAuthenticated={props.isAuthenticated} // props
        //isAuthenticated={true}
        //exact                                   // props
        path="/purchase-order/list" // props
      />

      <Route
        component={error} // props
        path="*" // props
      />
    </Switch>
  );
}

export default Routes;
