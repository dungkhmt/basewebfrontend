import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DeliveryPlanList from "../component/shipment/deliveryplan/DeliveryPlanList";
import DeliveryTripChart from "../component/shipment/deliveryplan/deliverytrip/DeliveryTripChart";
import DeliveryTripCreate from "../component/shipment/deliveryplan/deliverytrip/DeliveryTripCreate";
import DeliveryTripDetailCreate from "../component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailCreate";
import DeliveryTripDetailList from "../component/shipment/deliveryplan/deliverytrip/deliverytripdetail/DeliveryTripDetailList";

export default function DeliveryGroupRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={DeliveryPlanList}
          path={`${path}/delivery-plan-list`}
        />
        <Route
          component={DeliveryTripDetailList}
          path={`${path}/delivery-trip/:deliveryTripId`}
        />
        <Route
          component={DeliveryTripDetailCreate}
          path={`${path}/create-delivery-trip-detail/:deliveryTripId`}
        />
        <Route
          component={DeliveryTripCreate}
          path={`${path}/create-delivery-trip/:deliveryPlanId`}
        />
        <Route
          component={DeliveryTripChart}
          path={`${path}/delivery-trip-chart/:deliveryPlanId`}
        />
      </Switch>
    </div>
  );
}
