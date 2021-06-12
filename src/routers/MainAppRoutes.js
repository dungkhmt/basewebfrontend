import { LinearProgress } from "@material-ui/core";
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import { Home } from "../component";
import error from "../component/common/errornotfound";
import { Layout } from "../layout";
import { drawerWidth } from "../layout/sidebar/v1/SideBar";
import NotFound from "../views/errors/NotFound";

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
const WaterLakeRoute = lazy(() => import("./WaterLakeRoute"));
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
const BacklogRoute = lazy(() => import("./BacklogRoute"));
const ScheduleRoute = lazy(() => import("./ScheduleRoute"));

function MainAppRoute(props) {
  // const location = useLocation();
  // const dispatch = useDispatch();

  // /**
  //  * This func has a bug, it only display properly when access menu in order, if access by random URL, it failed.
  //  */
  // useEffect(() => {
  //   if (location.pathname === "/" || location.pathname === "") {
  //     dispatch(updateSelectedFuction(null));
  //   }

  //   let selectedFunction = mapPathMenu.get(location.pathname);

  //   if (selectedFunction) {
  //     dispatch(updateSelectedFuction(selectedFunction));
  //   }
  // }, [location]);

  return (
    <Layout>
      <Suspense
        fallback={
          // <BouncingBallsLoader />
          <LinearProgress
            style={{
              position: "absolute",
              top: 0,
              left: -drawerWidth,
              width: "calc(100% + 300px)",
              zIndex: 1202,
            }}
          />
        }
      >
        <Switch>
          <PrivateRoute component={Home} exact path="/" />

          <PrivateRoute component={UserLoginRoute} path="/userlogin" />

          <PrivateRoute component={OrderRoute} path="/orders" />

          <PrivateRoute component={TrackLocationRoute} path="/tracklocations" />

          <PrivateRoute component={DeliveryPlanRoute} path="/delivery-plan" />

          <PrivateRoute
            component={WaterLakeRoute}
            layout={Layout}
            path="/lake"
          />

          <PrivateRoute
            component={ShipmentItemDeliveryPlanRoute}
            path="/shipment-item-delivery-plan"
          />

          <PrivateRoute component={PostOfficeRoute} path="/postoffice" />

          <PrivateRoute
            component={VehicleDeliveryPlanRoute}
            path="/vehicle-delivery-plan"
          />

          <PrivateRoute component={SalesRoutesPlanRoute} path="/salesroutes" />

          <PrivateRoute component={ProductRoute} path="/products" />

          <PrivateRoute component={PromoTaxGroupRoute} path="/promo-group" />

          <PrivateRoute component={CustomerRoute} path="/customer" />

          <PrivateRoute component={DistributorRoute} path="/distributor" />

          <PrivateRoute component={RetailOutletRoute} path="/retailoutlet" />

          <PrivateRoute component={SalemanRoute} path="/salesman" />

          <PrivateRoute component={InventoryRoute} path="/inventory" />

          <PrivateRoute component={FacilityRoute} path="/facility" />

          <PrivateRoute component={GeoRoute} path="/geo" />

          <PrivateRoute
            component={DepotContainerFuncRoute}
            path="/depotcontainerfunc"
          />

          <PrivateRoute
            component={DepotTrailerFuncRoute}
            path="/depottrailerfunc"
          />

          <PrivateRoute
            component={DepotTruckFuncRoute}
            path="/depottruckfunc"
          />

          <PrivateRoute component={TrailerFuncRoute} path="/trailerfunc" />

          <PrivateRoute component={PortFuncRoute} path="/portfunc" />

          <PrivateRoute component={SalesRoute} path="/sales" />

          <PrivateRoute component={SupplierRoute} path="/supplier" />

          <PrivateRoute component={PurchaseOrderRoute} path="/purchase-order" />

          <PrivateRoute component={EduRoute} path="/edu" />

          <PrivateRoute
            component={WebcamRoute}
            isAuthenticated={true}
            path="/webcam"
          />

          <PrivateRoute
            component={PaymentGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/payment-group"
          />

          <PrivateRoute
            component={ProductGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/product-group"
          />

          <PrivateRoute
            component={ShipmentGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/shipment-group"
          />

          <PrivateRoute
            component={TestGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/test-group"
          />

          <PrivateRoute
            component={TransportGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/transport-group"
          />

          <PrivateRoute
            component={ReportGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/report-group"
          />

          <PrivateRoute
            component={VehicleGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/vehicle-group"
          />

          <PrivateRoute
            component={UserGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/user-group"
          />

          <PrivateRoute
            component={DeliveryGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/delivery-group"
          />

          <PrivateRoute
            component={DriverGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/driver-group"
          />

          <PrivateRoute
            component={ConfigGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/config-group"
          />

          <PrivateRoute
            component={InvoiceGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/invoice-group"
          />

          <PrivateRoute
            component={SalesGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/sales-group"
          />

          <PrivateRoute
            component={BacklogRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/backlog"
          />

          <Route component={error} path="*" />
          <PrivateRoute
            component={ScheduleRoute}
            layout={Layout}
            isAuthenticated={props.isAuthenticated}
            path="/schedule"
          />

          {/* <Route component={error} path="*" /> */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRoute;
