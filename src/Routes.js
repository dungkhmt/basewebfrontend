import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { updateSelectedFuction } from "./action";
import PrivateRoute from "./common/PrivateRoute";
import { Home, PrivateRouteWithLayout } from "./component";
import {
  DistributorUnpaidInvoiceDetail,
  DistributorUnpaidInvoiceList,
  Invoice,
  InvoiceDetail,
  Payment,
  PaymentApplication
} from "./component/accounting/InvoiceDataTable";
import PaymentApplicationCreate from "./component/accounting/PaymentApplicationCreate";
import { PaymentCreate } from "./component/accounting/PaymentCreate";
import QuickInvoicePayment from "./component/accounting/QuickInvoicePayment";
import error from "./component/common/errornotfound";
import Loading from "./component/common/Loading";
import ListDepartment from "./component/departments/listdepartment";
import AddProductImg from "./component/product/AddProductImg";
import ProductEdit from "./component/product/ProductEdit";
import ProductPriceCreate from "./component/product/ProductPriceCreate";
import SetPrimaryImg from "./component/product/SetPrimaryImg";
import {
  SaleReportByPartyCustomer,
  SaleReportByProduct
} from "./component/report/SaleReport";
import {
  TransportReportByDriver,
  TransportReportByFacility,
  TransportReportByPartyCustomer
} from "./component/report/TransportReport";
import SaleReportByDate from "./component/reportsales/SalesReportByDate";
import DetailSalesman from "./component/salesman/DetailSalesman";
import DeliveryPlanList from "./component/shipment/deliveryplan/DeliveryPlanList";
import DeliveryTripChart from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripChart";
import DeliveryTripCreate from "./component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailCreate from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import DeliveryTripDetailList from "./component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import NotScheduledShipmentItem from "./component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";
import ShipmentItemDeliveryTripDetailList from "./component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
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
import ListContainer from "./component/tmscontainer/container/ListContainer";
import CreateRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/CreateRequestTransportContainerEmptyExport";
import ListRequestTransportContainerEmptyExport from "./component/tmscontainer/requestexportempty/ListRequestTransportContainerEmptyExport";
import CreateRequestTransportFullExport from "./component/tmscontainer/requestexportfull/CreateRequestTransportFullExport";
import ListRequestTransportFullExport from "./component/tmscontainer/requestexportfull/ListRequestTransportFullExport";
import CreateRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/CreateRequestTransportContainerEmpty";
import ListRequestTransportContainerEmpty from "./component/tmscontainer/requestimportempty/ListRequestTransportContainerEmpty";
import CreateRequestTransportContainerToWarehouse from "./component/tmscontainer/requestimportfull/CreateRequestTransportContainerToWarehouse";
import ListRequestTransportContainerToWareHouse from "./component/tmscontainer/requestimportfull/ListRequestTransportContainerToWareHouse";
import ChangePassword from "./component/userlogin/changepassword";
import Approve from "./component/userregister/Approve";
import Register from "./component/userregister/Register";
import { mapPathMenu } from "./config/menuconfig";
import SignInContainer from "./container/SignInContainer";
import { Layout } from "./layout";
import NumberFormatTextField from "./utils/NumberFormatTextField";

const DepotContainerFuncRoute = lazy(() =>
  import("./routers/DepotContainerFuncRoute")
);
const DepotTrailerFuncRoute = lazy(() =>
  import("./routers/DepotTrailerFuncRoute")
);
const DepotTruckFuncRoute = lazy(() => import("./routers/DepotTruckFuncRoute"));
const EduRoute = lazy(() => import("./routers/EduRoute"));
const PortFuncRoute = lazy(() => import("./routers/PortFuncRoute"));
const PurchaseOrderRoute = lazy(() => import("./routers/PurchaseOrderRoute"));
const SalesRoute = lazy(() => import("./routers/SalesRoute"));
const SupplierRoute = lazy(() => import("./routers/SupplierRoute"));
const TrailerFuncRoute = lazy(() => import("./routers/TrailerFuncRoute"));
const WebcamRoute = lazy(() => import("./routers/WebcamRoute"));
const PostOfficeRoute = lazy(() => import("./routers/PostOfficeRoute"));

const ShipmentItemDeliveryPlanRoute = lazy(() =>
  import("./routers/ShipmentItemDelieveryPlanRoute")
);
const SalesRoutesPlanRoute = lazy(() =>
  import("./routers/SalesRoutesPlanRoute")
);
const ProductRoute = lazy(() => import("./routers/ProductRouter"));
const CustomerRoute = lazy(() => import("./routers/CustomerRouter"));
const DistributorRoute = lazy(() => import("./routers/DistributorRouter"));
const RetailOutletRoute = lazy(() => import("./routers/RetailOutletRoute"));
const SalemanRoute = lazy(() => import("./routers/SalemanRoute"));
const InventoryRoute = lazy(() => import("./routers/InventoryRoute"));
const GeoRoute = lazy(() => import("./routers/GeoRoute"));

const TrackLocationRoute = lazy(() => import("./routers/TrackLocationRoute"));
const OrderRoute = lazy(() => import("./routers/OrderRoute"));
const DeliveryPlanRoute = lazy(() => import("./routers/DeliveryPlanRoute"));
const VehicleDeliveryPlanRoute = lazy(() =>
  import("./routers/VehicleDeliveryPlanRoute")
);
const UserLoginRoute = lazy(() => import("./routers/UserLoginRoute"));

function Routes(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log(location.pathname);
    let selectedFunction = mapPathMenu.get(location.pathname);
    if (selectedFunction !== undefined && selectedFunction !== null)
      dispatch(updateSelectedFuction(selectedFunction));
  }, [location]);
  //if (props.error.isError) return <Route component={error500} path="*" />;
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <PrivateRouteWithLayout
          component={Home}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          exact
          path="/"
        />

        <PrivateRouteWithLayout
          component={ListDepartment}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/departments/list"
        />
        <PrivateRouteWithLayout
          component={UserLoginRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/userlogin"
        />
        <Route component={Register} layout={Layout} path="/user/register" />
        <PrivateRouteWithLayout
          component={Approve}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/user/approve-register"
        />
        <PrivateRoute
          component={ChangePassword}
          isAuthenticated={props.isAuthenticated}
          path="/userlogin/change-password/:username"
        />

        <PrivateRouteWithLayout
          component={OrderRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/orders"
        />
        <PrivateRouteWithLayout
          component={TrackLocationRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/tracklocations"
        />
        <PrivateRouteWithLayout
          component={DeliveryPlanRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/delivery-plan"
        />
        <PrivateRouteWithLayout
          component={DeliveryPlanList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/delivery-plan-list"
        />
        <PrivateRouteWithLayout
          component={DeliveryTripDetailList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/delivery-trip/:deliveryTripId"
        />

        <PrivateRouteWithLayout
          component={DeliveryTripDetailCreate}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/create-delivery-trip-detail/:deliveryTripId"
        />

        <PrivateRouteWithLayout
          component={ShipmentItemDeliveryPlanRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/shipment-item-delivery-plan"
        />

        <PrivateRouteWithLayout
          component={ShipmentItemList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          exact
          path="/shipment"
        />

        <PrivateRouteWithLayout
          component={VehicleList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          exact
          path="/vehicle"
        />

        <PrivateRouteWithLayout
          component={PostOfficeRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/postoffice"
        />

        <PrivateRouteWithLayout
          component={ShipmentItemCreate}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          exact
          path="/create-shipment-item"
        />

        <PrivateRouteWithLayout
          component={ShipmentItemDeliveryTripDetailList}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/shipment-item-info/:shipmentItemId"
        />

        <PrivateRouteWithLayout
          component={NotScheduledShipmentItem}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/not-scheduled-shipment-items/:deliveryPlanId"
        />

        <PrivateRouteWithLayout
          component={VehicleDeliveryPlanRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/vehicle-delivery-plan"
        />

        <PrivateRouteWithLayout
          component={DeliveryTripCreate}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/create-delivery-trip/:deliveryPlanId"
        />

        <PrivateRouteWithLayout
          component={SalesRoutesPlanRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/salesroutes"
        />

        <PrivateRouteWithLayout
          component={DeliveryTripChart}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/delivery-trip-chart/:deliveryPlanId"
        />

        <PrivateRouteWithLayout
          component={SolverConfigParam}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/solver-config-param"
        />

        <PrivateRouteWithLayout
          component={VehicleDetail}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/vehicle-detail/:vehicleId"
        />

        <PrivateRouteWithLayout
          component={DriverDetail}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/driver-detail/:driverId"
        />

        <PrivateRouteWithLayout
          component={VehicleNotInDeliveryTrips}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/vehicle-not-in-delivery-trips/:deliveryPlanId"
        />

        <PrivateRouteWithLayout
          component={ProductRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/product"
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
          component={ProductPriceCreate}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/create-product-price/:productId"
        />

        <PrivateRouteWithLayout
          component={CustomerRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/customer"
        />

        <PrivateRouteWithLayout
          component={DistributorRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/distributor"
        />
        <PrivateRouteWithLayout
          component={RetailOutletRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/retailoutlet"
        />

        <PrivateRouteWithLayout
          component={SalemanRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/salesman"
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

        <Route component={SignInContainer} path="/login" />

        <PrivateRouteWithLayout
          component={InventoryRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/inventory"
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
          component={GeoRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/geo"
        />

        <PrivateRouteWithLayout
          component={ListContainer}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/containerfunc/list"
        />

        <PrivateRouteWithLayout
          component={DepotContainerFuncRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/depotcontainerfunc"
        />

        <PrivateRouteWithLayout
          component={DepotTrailerFuncRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/depottrailerfunc"
        />

        <PrivateRouteWithLayout
          component={DepotTruckFuncRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/depottruckfunc"
        />

        <PrivateRouteWithLayout
          component={TrailerFuncRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/trailerfunc"
        />

        <PrivateRouteWithLayout
          component={PortFuncRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/portfunc"
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
          component={SalesRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/sales"
        />

        <PrivateRouteWithLayout
          component={DetailSalesman}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/salesman/:partyId"
        />

        {/*number format test*/}
        <PrivateRouteWithLayout
          component={NumberFormatTextField}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/number-format-text-field-test"
        />

        <PrivateRouteWithLayout
          component={SupplierRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/supplier"
        />

        <PrivateRouteWithLayout
          component={ProductPriceSupplier}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/product-price-supplier/list"
        />

        <PrivateRouteWithLayout
          component={PurchaseOrderRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/purchase-order"
        />

        <PrivateRouteWithLayout
          component={EduRoute}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/edu"
        />

        <PrivateRouteWithLayout
          component={ProductPriceSupplier}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/product-price-supplier/list"
        />

        <PrivateRouteWithLayout
          component={ProductPriceSupplier}
          layout={Layout}
          isAuthenticated={props.isAuthenticated}
          path="/product-price-supplier/list"
        />

        <PrivateRouteWithLayout
          component={WebcamRoute}
          layout={Layout}
          isAuthenticated={true}
          path="/webcam"
        />

        <Route component={error} path="*" />
      </Switch>
    </Suspense>
  );
}

export default Routes;
