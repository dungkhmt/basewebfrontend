import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import VehicleDeliveryPlanAdd from "../component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanAdd";
import VehicleDeliveryPlanList from "../component/shipment/deliveryplan/vehicle/VehicleDeliveryPlanList";

export default function VehicleDeliveryPlanRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={VehicleDeliveryPlanList}
          path={`${path}/:deliveryPlanId/list`}
        />
        <Route
          component={VehicleDeliveryPlanAdd}
          path={`${path}/:deliveryPlanId/add`}
        />
      </Switch>
    </div>
  );
}
