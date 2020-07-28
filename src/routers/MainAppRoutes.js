import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { updateSelectedFuction } from "../action";
import PrivateRoute from "../common/PrivateRoute";
import { Home } from "../component";
import {
  DistributorUnpaidInvoiceDetail,
  DistributorUnpaidInvoiceList,
  Invoice,
  InvoiceDetail,
  Payment,
  PaymentApplication
} from "../component/accounting/InvoiceDataTable";
import PaymentApplicationCreate from "../component/accounting/PaymentApplicationCreate";
import { PaymentCreate } from "../component/accounting/PaymentCreate";
import QuickInvoicePayment from "../component/accounting/QuickInvoicePayment";
import error from "../component/common/errornotfound";
import Loading from "../component/common/Loading";
import ListDepartment from "../component/departments/listdepartment";
import AddProductImg from "../component/product/AddProductImg";
import ProductEdit from "../component/product/ProductEdit";
import ProductPriceCreate from "../component/product/ProductPriceCreate";
import SetPrimaryImg from "../component/product/SetPrimaryImg";
import {
  SaleReportByPartyCustomer,
  SaleReportByProduct
} from "../component/report/SaleReport";
import {
  TransportReportByDriver,
  TransportReportByFacility,
  TransportReportByPartyCustomer
} from "../component/report/TransportReport";
import SaleReportByDate from "../component/reportsales/SalesReportByDate";
import DetailSalesman from "../component/salesman/DetailSalesman";
import DeliveryPlanList from "../component/shipment/deliveryplan/DeliveryPlanList";
import DeliveryTripChart from "../component/shipment/deliveryplan/deliverytrip/DeliveryTripChart";
import DeliveryTripCreate from "../component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailCreate from "../component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import DeliveryTripDetailList from "../component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";
import NotScheduledShipmentItem from "../component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";
import ShipmentItemDeliveryTripDetailList from "../component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
import VehicleNotInDeliveryTrips from "../component/shipment/deliveryplan/vehicle/VehicleNotInDeliveryTrips";
import DriverCreate from "../component/shipment/driver/DriverCreate";
import DriverDetail from "../component/shipment/driver/DriverDetail";
import DriverList from "../component/shipment/driver/DriverList";
import ShipmentItemCreate from "../component/shipment/shipment/ShipmentItemCreate";
import ShipmentItemList from "../component/shipment/shipment/ShipmentItemList";
import SolverConfigParam from "../component/shipment/solver/SolverConfigParam";
import VehicleDetail from "../component/shipment/vehicle/VehicleDetail";
import VehicleList from "../component/shipment/vehicle/VehicleList";
import ProductPriceSupplier from "../component/supplier/ProductPriceSupplier";
import ListContainer from "../component/tmscontainer/container/ListContainer";
import CreateRequestTransportContainerEmptyExport from "../component/tmscontainer/requestexportempty/CreateRequestTransportContainerEmptyExport";
import ListRequestTransportContainerEmptyExport from "../component/tmscontainer/requestexportempty/ListRequestTransportContainerEmptyExport";
import CreateRequestTransportFullExport from "../component/tmscontainer/requestexportfull/CreateRequestTransportFullExport";
import ListRequestTransportFullExport from "../component/tmscontainer/requestexportfull/ListRequestTransportFullExport";
import CreateRequestTransportContainerEmpty from "../component/tmscontainer/requestimportempty/CreateRequestTransportContainerEmpty";
import ListRequestTransportContainerEmpty from "../component/tmscontainer/requestimportempty/ListRequestTransportContainerEmpty";
import CreateRequestTransportContainerToWarehouse from "../component/tmscontainer/requestimportfull/CreateRequestTransportContainerToWarehouse";
import ListRequestTransportContainerToWareHouse from "../component/tmscontainer/requestimportfull/ListRequestTransportContainerToWareHouse";
import Approve from "../component/userregister/Approve";
import { mapPathMenu } from "../config/menuconfig";
import { Layout } from "../layout";
import NumberFormatTextField from "../utils/NumberFormatTextField";

const DepotContainerFuncRoute = lazy(() => import("./DepotContainerFuncRoute"));
const DepotTrailerFuncRoute = lazy(() => import("./DepotTrailerFuncRoute"));
const DepotTruckFuncRoute = lazy(() => import("./DepotTruckFuncRoute"));
const EduRoute = lazy(() => import("./EduRoute"));
const PortFuncRoute = lazy(() => import("./PortFuncRoute"));
const PurchaseOrderRoute = lazy(() => import("./PurchaseOrderRoute"));
const SalesRoute = lazy(() => import("./SalesRoute"));
const SupplierRoute = lazy(() => import("./SupplierRoute"));
const TrailerFuncRoute = lazy(() => import("./TrailerFuncRoute"));
const WebcamRoute = lazy(() => import("./WebcamRoute"));
const PostOfficeRoute = lazy(() => import("./PostOfficeRoute"));

const ShipmentItemDeliveryPlanRoute = lazy(() =>
  import("./ShipmentItemDelieveryPlanRoute")
);
const SalesRoutesPlanRoute = lazy(() => import("./SalesRoutesPlanRoute"));
const ProductRoute = lazy(() => import("./ProductRouter"));
const CustomerRoute = lazy(() => import("./CustomerRouter"));
const DistributorRoute = lazy(() => import("./DistributorRouter"));
const RetailOutletRoute = lazy(() => import("./RetailOutletRoute"));
const SalemanRoute = lazy(() => import("./SalemanRoute"));
const InventoryRoute = lazy(() => import("./InventoryRoute"));
const GeoRoute = lazy(() => import("./GeoRoute"));

const TrackLocationRoute = lazy(() => import("./TrackLocationRoute"));
const OrderRoute = lazy(() => import("./OrderRoute"));
const DeliveryPlanRoute = lazy(() => import("./DeliveryPlanRoute"));
const VehicleDeliveryPlanRoute = lazy(() =>
  import("./VehicleDeliveryPlanRoute")
);
const UserLoginRoute = lazy(() => import("./UserLoginRoute"));

function MainAppRoute(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "")
      dispatch(updateSelectedFuction(null));
    let selectedFunction = mapPathMenu.get(location.pathname);
    if (selectedFunction !== undefined && selectedFunction !== null)
      dispatch(updateSelectedFuction(selectedFunction));
  }, [location]);
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PrivateRoute component={Home} layout={Layout} exact path="/" />

          <PrivateRoute
            component={ListDepartment}
            layout={Layout}
            path="/departments/list"
          />
          <PrivateRoute
            component={UserLoginRoute}
            layout={Layout}
            path="/userlogin"
          />
          <PrivateRoute
            component={Approve}
            layout={Layout}
            path="/user/approve-register"
          />
          <PrivateRoute component={OrderRoute} layout={Layout} path="/orders" />
          <PrivateRoute
            component={TrackLocationRoute}
            layout={Layout}
            path="/tracklocations"
          />
          <PrivateRoute
            component={DeliveryPlanRoute}
            layout={Layout}
            path="/delivery-plan"
          />
          <PrivateRoute
            component={DeliveryPlanList}
            layout={Layout}
            path="/delivery-plan-list"
          />
          <PrivateRoute
            component={DeliveryTripDetailList}
            layout={Layout}
            path="/delivery-trip/:deliveryTripId"
          />

          <PrivateRoute
            component={DeliveryTripDetailCreate}
            layout={Layout}
            path="/create-delivery-trip-detail/:deliveryTripId"
          />

          <PrivateRoute
            component={ShipmentItemDeliveryPlanRoute}
            layout={Layout}
            path="/shipment-item-delivery-plan"
          />

          <PrivateRoute
            component={ShipmentItemList}
            layout={Layout}
            exact
            path="/shipment"
          />

          <PrivateRoute
            component={VehicleList}
            layout={Layout}
            exact
            path="/vehicle"
          />

          <PrivateRoute
            component={PostOfficeRoute}
            layout={Layout}
            path="/postoffice"
          />

          <PrivateRoute
            component={ShipmentItemCreate}
            layout={Layout}
            exact
            path="/create-shipment-item"
          />

          <PrivateRoute
            component={ShipmentItemDeliveryTripDetailList}
            layout={Layout}
            path="/shipment-item-info/:shipmentItemId"
          />

          <PrivateRoute
            component={NotScheduledShipmentItem}
            layout={Layout}
            path="/not-scheduled-shipment-items/:deliveryPlanId"
          />

          <PrivateRoute
            component={VehicleDeliveryPlanRoute}
            layout={Layout}
            path="/vehicle-delivery-plan"
          />

          <PrivateRoute
            component={DeliveryTripCreate}
            layout={Layout}
            path="/create-delivery-trip/:deliveryPlanId"
          />

          <PrivateRoute
            component={SalesRoutesPlanRoute}
            layout={Layout}
            path="/salesroutes"
          />

          <PrivateRoute
            component={DeliveryTripChart}
            layout={Layout}
            path="/delivery-trip-chart/:deliveryPlanId"
          />

          <PrivateRoute
            component={SolverConfigParam}
            layout={Layout}
            path="/solver-config-param"
          />

          <PrivateRoute
            component={VehicleDetail}
            layout={Layout}
            path="/vehicle-detail/:vehicleId"
          />

          <PrivateRoute
            component={DriverDetail}
            layout={Layout}
            path="/driver-detail/:driverId"
          />

          <PrivateRoute
            component={VehicleNotInDeliveryTrips}
            layout={Layout}
            path="/vehicle-not-in-delivery-trips/:deliveryPlanId"
          />

          <PrivateRoute
            component={ProductRoute}
            layout={Layout}
            path="/product"
          />

          <PrivateRoute
            component={AddProductImg}
            layout={Layout}
            path="/product-add-img/:productId"
          />

          <PrivateRoute
            component={SetPrimaryImg}
            layout={Layout}
            path="/set-product-primary-img/:productId"
          />

          <PrivateRoute
            component={ProductEdit}
            layout={Layout}
            path="/product-edit/:productId"
          />

          <PrivateRoute
            component={ProductPriceCreate}
            layout={Layout}
            path="/create-product-price/:productId"
          />

          <PrivateRoute
            component={CustomerRoute}
            layout={Layout}
            path="/customer"
          />

          <PrivateRoute
            component={DistributorRoute}
            layout={Layout}
            path="/distributor"
          />
          <PrivateRoute
            component={RetailOutletRoute}
            layout={Layout}
            path="/retailoutlet"
          />

          <PrivateRoute
            component={SalemanRoute}
            layout={Layout}
            path="/salesman"
          />
          <PrivateRoute
            component={DriverList}
            layout={Layout}
            path="/driver/list"
          />
          <PrivateRoute
            component={DriverCreate}
            layout={Layout}
            path="/driver/create"
          />

          <PrivateRoute
            component={InventoryRoute}
            layout={Layout}
            path="/inventory"
          />

          <PrivateRoute
            component={SaleReportByProduct}
            layout={Layout}
            path="/sale-reports-by-product"
          />

          <PrivateRoute
            component={SaleReportByPartyCustomer}
            layout={Layout}
            path="/sale-reports-by-customer"
          />

          <PrivateRoute
            component={SaleReportByDate}
            layout={Layout}
            path="/sale-reports-by-date"
          />

          {/*transport report*/}

          <PrivateRoute
            component={TransportReportByDriver}
            layout={Layout}
            path="/transport-reports-by-driver"
          />

          <PrivateRoute
            component={TransportReportByFacility}
            layout={Layout}
            path="/transport-reports-by-facility"
          />

          <PrivateRoute
            component={TransportReportByPartyCustomer}
            layout={Layout}
            path="/transport-reports-by-customer"
          />

          {/*end*/}

          {/*invoice*/}

          <PrivateRoute
            component={InvoiceDetail}
            layout={Layout}
            path="/invoice-detail/:invoiceId"
          />

          <PrivateRoute
            component={Invoice}
            layout={Layout}
            path="/invoice-sales/list"
          />

          <PrivateRoute
            component={Payment}
            layout={Layout}
            path="/customer-payment/list"
          />

          <PrivateRoute
            component={PaymentCreate}
            layout={Layout}
            path="/create-payment"
          />

          <PrivateRoute
            component={PaymentApplicationCreate}
            layout={Layout}
            path="/create-payment-application/:paymentId"
          />

          <PrivateRoute
            component={QuickInvoicePayment}
            layout={Layout}
            path="/quick-create-payment-application/:invoiceId"
          />

          <PrivateRoute
            component={PaymentApplication}
            layout={Layout}
            path="/payment-application/:paymentId"
          />

          <PrivateRoute
            component={DistributorUnpaidInvoiceList}
            layout={Layout}
            path="/distributor-unpaid-invoice/list"
          />

          <PrivateRoute
            component={DistributorUnpaidInvoiceDetail}
            layout={Layout}
            path="/distributor-unpaid-invoice-detail/:partyDistributorId"
          />

          {/*end*/}

          <PrivateRoute component={GeoRoute} layout={Layout} path="/geo" />

          <PrivateRoute
            component={ListContainer}
            layout={Layout}
            path="/containerfunc/list"
          />

          <PrivateRoute
            component={DepotContainerFuncRoute}
            layout={Layout}
            path="/depotcontainerfunc"
          />

          <PrivateRoute
            component={DepotTrailerFuncRoute}
            layout={Layout}
            path="/depottrailerfunc"
          />

          <PrivateRoute
            component={DepotTruckFuncRoute}
            layout={Layout}
            path="/depottruckfunc"
          />

          <PrivateRoute
            component={TrailerFuncRoute}
            layout={Layout}
            path="/trailerfunc"
          />

          <PrivateRoute
            component={PortFuncRoute}
            layout={Layout}
            path="/portfunc"
          />

          <PrivateRoute
            component={CreateRequestTransportContainerToWarehouse}
            layout={Layout}
            path="/create-request-transport-container-to-warehouse"
          />

          <PrivateRoute
            component={ListRequestTransportContainerToWareHouse}
            layout={Layout}
            path="/list-request-transport-container-to-warehouse"
          />

          <PrivateRoute
            component={CreateRequestTransportContainerEmpty}
            layout={Layout}
            path="/create-request-transport-container-empty"
          />

          <PrivateRoute
            component={ListRequestTransportContainerEmpty}
            layout={Layout}
            path="/list-request-transport-container-empty"
          />

          <PrivateRoute
            component={CreateRequestTransportContainerEmptyExport}
            layout={Layout}
            path="/create-request-transport-container-empty-export"
          />
          <PrivateRoute
            component={ListRequestTransportContainerEmptyExport}
            layout={Layout}
            path="/list-request-transport-container-empty-export"
          />

          <PrivateRoute
            component={CreateRequestTransportFullExport}
            layout={Layout}
            path="/create-request-transport-full-export"
          />
          <PrivateRoute
            component={ListRequestTransportFullExport}
            layout={Layout}
            path="/list-request-transport-full-export"
          />

          <PrivateRoute component={SalesRoute} layout={Layout} path="/sales" />

          <PrivateRoute
            component={DetailSalesman}
            layout={Layout}
            path="/salesman/:partyId"
          />

          {/*number format test*/}
          <PrivateRoute
            component={NumberFormatTextField}
            layout={Layout}
            path="/number-format-text-field-test"
          />

          <PrivateRoute
            component={SupplierRoute}
            layout={Layout}
            path="/supplier"
          />

          <PrivateRoute
            component={ProductPriceSupplier}
            layout={Layout}
            path="/product-price-supplier/list"
          />

          <PrivateRoute
            component={PurchaseOrderRoute}
            layout={Layout}
            path="/purchase-order"
          />

          <PrivateRoute component={EduRoute} layout={Layout} path="/edu" />

          <PrivateRoute
            component={ProductPriceSupplier}
            layout={Layout}
            path="/product-price-supplier/list"
          />

          <PrivateRoute
            component={ProductPriceSupplier}
            layout={Layout}
            path="/product-price-supplier/list"
          />

          <PrivateRoute
            component={WebcamRoute}
            layout={Layout}
            isAuthenticated={true}
            path="/webcam"
          />

          <Route component={error} path="*" />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRoute;
