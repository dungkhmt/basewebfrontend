import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import InventoryImport from "../component/inventory/InventoryImport";
import InventoryList from "../component/inventory/InventoryList";
import InventoryOrderDetail from "../component/inventory/InventoryOrderDetail";
import InventoryOrderExport from "../component/inventory/InventoryOrderExport";
import InventoryOrderExportList from "../component/inventory/InventoryOrderExportList";
import InventoryOrderList from "../component/inventory/InventoryOrderList";

export default function InventoryRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={InventoryOrderList} exact path={`${path}/order`} />
        <Route
          component={InventoryOrderDetail}
          path={`${path}/order/:orderId`}
        />
        <Route
          component={InventoryOrderExport}
          path={`${path}/export/:orderId`}
        />
        <Route
          component={InventoryOrderExportList}
          path={`${path}/export-list`}
        />
        <Route component={InventoryList} path={`${path}/list`} />
        <Route component={InventoryImport} path={`${path}/import`} />
      </Switch>
    </div>
  );
}