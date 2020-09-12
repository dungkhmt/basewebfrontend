import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { updateSelectedFuction } from "../action";
import PrivateRoute from "../common/PrivateRoute";
import { Home } from "../component";
import error from "../component/common/errornotfound";
import Loading from "../component/common/Loading";
import { mapPathMenu } from "../config/menuconfig";
import { Layout } from "../layout";

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
const PromoTaxGroupRoute = lazy(() => import("./PromoTaxGroupRoute"));
const CustomerRoute = lazy(() => import("./CustomerRouter"));
const DistributorRoute = lazy(() => import("./DistributorRouter"));
const RetailOutletRoute = lazy(() => import("./RetailOutletRoute"));
const SalemanRoute = lazy(() => import("./SalemanRoute"));
const InventoryRoute = lazy(() => import("./InventoryRoute"));
const FacilityRoute = lazy(() => import("./FacilityRoute"));
const GeoRoute = lazy(() => import("./GeoRoute"));

const TrackLocationRoute = lazy(() => import("./TrackLocationRoute"));
const OrderRoute = lazy(() => import("./OrderRoute"));
const DeliveryPlanRoute = lazy(() => import("./DeliveryPlanRoute"));
const VehicleDeliveryPlanRoute = lazy(() =>
  import("./VehicleDeliveryPlanRoute")
);
const UserLoginRoute = lazy(() => import("./UserLoginRoute"));

const PaymentGroupRoute = lazy(() => import("./PaymentGroupRoute"));
const ProductGroupRoute = lazy(() => import("./ProductGroupRoute"));
const ShipmentGroupRoute = lazy(() => import("./ShipmentGroupRoute"));
const TestGroupRoute = lazy(() => import("./TestGroupRoute"));
const TransportGroupRoute = lazy(() => import("./TransportGroupRoute"));
const ReportGroupRoute = lazy(() => import("./ReportGroupRoute"));
const VehicleGroupRoute = lazy(() => import("./VehicleGroupRoute"));
const UserGroupRoute = lazy(() => import("./UserGroupRoute"));
const DeliveryGroupRoute = lazy(() => import("./DeliveryGroupRoute"));
const DriverGroupRoute = lazy(() => import("./DriverGroupRoute"));
const ConfigGroupRoute = lazy(() => import("./ConfigGroupRoute"));
const InvoiceGroupRoute = lazy(() => import("./InvoiceGroupRoute"));
const SalesGroupRoute = lazy(() => import("./SalesGroupRoute"));

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
            component={UserLoginRoute}
            layout={Layout}
            path="/userlogin"
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
            component={ShipmentItemDeliveryPlanRoute}
            layout={Layout}
            path="/shipment-item-delivery-plan"
          />
          <PrivateRoute
            component={PostOfficeRoute}
            layout={Layout}
            path="/postoffice"
          />
          <PrivateRoute
            component={VehicleDeliveryPlanRoute}
            layout={Layout}
            path="/vehicle-delivery-plan"
          />
          <PrivateRoute
            component={SalesRoutesPlanRoute}
            layout={Layout}
            path="/salesroutes"
          />
          <PrivateRoute
            component={ProductRoute}
            layout={Layout}
            path="/products"
          />
          <PrivateRoute
            component={PromoTaxGroupRoute}
            layout={Layout}
            path="/promo-group"
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
            component={InventoryRoute}
            layout={Layout}
            path="/inventory"
          />
          <PrivateRoute
            component={FacilityRoute}
            layout={Layout}
            path="/facility"
          />
          <PrivateRoute component={GeoRoute} layout={Layout} path="/geo" />
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
          <PrivateRoute component={SalesRoute} layout={Layout} path="/sales" />
          <PrivateRoute
            component={SupplierRoute}
            layout={Layout}
            path="/supplier"
          />
          <PrivateRoute
            component={PurchaseOrderRoute}
            layout={Layout}
            path="/purchase-order"
          />
          <PrivateRoute
            component={EduRoute}
            // layout={Layout}
            path="/edu"
          />
          <PrivateRoute
            component={WebcamRoute}
            layout={Layout}
            isAuthenticated={true}
            path="/webcam"
          />
          <PrivateRoute
            component={PaymentGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/payment-group"
          />

          <PrivateRoute
            component={ProductGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/product-group"
          />

          <PrivateRoute
            component={ShipmentGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/shipment-group"
          />

          <PrivateRoute
            component={TestGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/test-group"
          />

          <PrivateRoute
            component={TransportGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/transport-group"
          />

          <PrivateRoute
            component={ReportGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/report-group"
          />

          <PrivateRoute
            component={VehicleGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/vehicle-group"
          />

          <PrivateRoute
            component={UserGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/user-group"
          />

          <PrivateRoute
            component={DeliveryGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/delivery-group"
          />

          <PrivateRoute
            component={DriverGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/driver-group"
          />

          <PrivateRoute
            component={ConfigGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/config-group"
          />

          <PrivateRoute
            component={InvoiceGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/invoice-group"
          />

          <PrivateRoute
            component={SalesGroupRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/sales-group"
          />

          <Route component={error} path="*" />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRoute;
