import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DriverDetail from "../component/shipment/driver/DriverDetail";
import DriverList from "../component/shipment/driver/DriverList";
import DriverCreate from "../component/shipment/driver/DriverCreate";

export default function DriverGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={DriverDetail}
          path={`${path}/driver-detail/:driverId`}
        />
        <Route component={DriverList} path={`${path}/driver/list`} />
        <Route component={DriverCreate} path={`${path}/driver/create`} />
      </Switch>
    </div>
  );
}
