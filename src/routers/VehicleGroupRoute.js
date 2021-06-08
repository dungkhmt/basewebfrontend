import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import VehicleList from "../component/shipment/vehicle/VehicleList";
import VehicleDetail from "../component/shipment/vehicle/VehicleDetail";
import VehicleNotInDeliveryTrips from "../component/shipment/deliveryplan/vehicle/VehicleNotInDeliveryTrips";

export default function VehicleGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={VehicleList} path={`${path}/vehicle`} />
        <Route
          component={VehicleDetail}
          path={`${path}/vehicle-detail/:vehicleId`}
        />
        <Route
          component={VehicleNotInDeliveryTrips}
          path={`${path}/vehicle-not-in-delivery-trips/:deliveryPlanId`}
        />
      </Switch>
    </div>
  );
}
