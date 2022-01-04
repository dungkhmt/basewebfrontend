import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ShipmentItemDeliveryPlanAdd from "../component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanAdd";
import ShipmentItemDeliveryPlanList from "../component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryPlanList";

export default function ShipmentItemDeliveryPlanRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={ShipmentItemDeliveryPlanList}
          path={`${path}/:deliveryPlanId/list`}
        />
        <Route
          component={ShipmentItemDeliveryPlanAdd}
          path={`${path}/:deliveryPlanId/add`}
        />
      </Switch>
    </div>
  );
}
