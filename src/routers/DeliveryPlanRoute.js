import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DeliveryPlanCreate from "../component/shipment/deliveryplan/DeliveryPlanCreate";
import DeliveryTripList from "../component/shipment/deliveryplan/deliverytrip/DeliveryTripList";

export default function DeliveryPlanRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DeliveryPlanCreate} path={`${path}/create`} />
        <Route component={DeliveryTripList} path={`${path}/:deliveryPlanId`} />
      </Switch>
    </div>
  );
}
