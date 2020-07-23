import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import TrailerCreate from "../component/tmscontainer/trailer/TrailerCreate";
import TrailerList from "../component/tmscontainer/trailer/TrailerList";

export default function TrailerFuncRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>

        <Route component={TrailerCreate} path={`${path}/create`} />

        <Route component={TrailerList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
