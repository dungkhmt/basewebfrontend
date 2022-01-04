import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import PortCreate from "../component/tmscontainer/port/PortCreate";
import PortGoogleMap from "../component/tmscontainer/port/PortGoogleMap";
import PortList from "../component/tmscontainer/port/PortList";

export default function PortFuncRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={PortCreate} path={`${path}/create`} />
        <Route component={PortList} path={`${path}/list`} />
        <Route component={PortGoogleMap} path={`${path}/googlemap`} />
      </Switch>
    </div>
  );
}
