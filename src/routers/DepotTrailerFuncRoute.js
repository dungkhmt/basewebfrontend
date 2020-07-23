import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DepotTrailerCreate from "../component/tmscontainer/depotTrailer/DepotTrailerCreate";
import DepotTrailerGoogleMap from "../component/tmscontainer/depotTrailer/DepotTrailerGoogleMap";
import DepotTrailerList from "../component/tmscontainer/depotTrailer/DepotTrailerList";

export default function DepotTrailerFuncRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DepotTrailerCreate} path={`${path}/create`} />

        <Route component={DepotTrailerList} path={`${path}/list`} />
        <Route component={DepotTrailerGoogleMap} path={`${path}/googlemap`} />
      </Switch>
    </div>
  );
}
