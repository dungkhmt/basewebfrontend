import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DepotTruckCreate from "../component/tmscontainer/depotTruck/DepotTruckCreate";
import DepotTruckGoogleMap from "../component/tmscontainer/depotTruck/DepotTruckGoogleMap";
import DepotTruckList from "../component/tmscontainer/depotTruck/DepotTruckList";

export default function DepotTruckFuncRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DepotTruckCreate} path={`${path}/create`} />
        <Route component={DepotTruckList} path={`${path}/list`} />
        <Route component={DepotTruckGoogleMap} path={`${path}/googlemap`} />
      </Switch>
    </div>
  );
}
