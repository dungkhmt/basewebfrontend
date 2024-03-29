import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import NotScheduledShipmentItem from "../component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";
import ShipmentItemDeliveryTripDetailList from "../component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
import ShipmentItemCreate from "../component/shipment/shipment/ShipmentItemCreate";
import ShipmentItemList from "../component/shipment/shipment/ShipmentItemList";

export default function ShipmentGroupRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ShipmentItemList} path={`${path}/shipment`} />
        <Route
          component={ShipmentItemCreate}
          path={`${path}/create-shipment-item`}
        />
        <Route
          component={ShipmentItemDeliveryTripDetailList}
          path={`${path}/shipment-item-info/:shipmentItemId`}
        />
        <Route
          component={NotScheduledShipmentItem}
          path={`${path}/not-scheduled-shipment-items/:deliveryPlanId`}
        />
      </Switch>
    </div>
  );
}
