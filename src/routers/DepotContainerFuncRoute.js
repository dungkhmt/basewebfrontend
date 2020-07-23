import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DepotContainerCreate from "../component/tmscontainer/depotContainer/DepotContainerCreate";
import DepotContainerGoogleMap from "../component/tmscontainer/depotContainer/DepotContainerGoogleMap";
import DepotContainerList from "../component/tmscontainer/depotContainer/DepotContainerList";

export default function DepotContainerFuncRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DepotContainerCreate} path={`${path}/create`} />

        <Route component={DepotContainerList} path={`${path}/list`} />

        <Route component={DepotContainerGoogleMap} path={`${path}/googlemap`} />
      </Switch>
    </div>
  );
}
