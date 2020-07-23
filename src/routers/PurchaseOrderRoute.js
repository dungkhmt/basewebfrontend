import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import PurchaseOrderCreate from "../component/order/PurchaseOrderCreate";
import PurchaseOrderList from "../component/order/PurchaseOrderList";

export default function PurchaseOrderRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={PurchaseOrderList} path={`${path}/list`} />
        <Route
          component={PurchaseOrderCreate}
          path={`${path}/create/:supplierPartyId`}
        />
      </Switch>
    </div>
  );
}
