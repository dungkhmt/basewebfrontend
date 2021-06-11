import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ShipmentItemList from "../component/shipment/shipment/ShipmentItemList";
import ShipmentItemCreate from "../component/shipment/shipment/ShipmentItemCreate";
import ShipmentItemDeliveryTripDetailList from "../component/shipment/deliveryplan/shipmentitem/ShipmentItemDeliveryTripDetailList";
import NotScheduledShipmentItem from "../component/shipment/deliveryplan/deliverytrip/NotScheduledShipmentItem";

export default function ShipmentGroupRoute() {
  let { path, url } = useRouteMatch();
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
