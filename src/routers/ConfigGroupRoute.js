import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import SolverConfigParam from "../component/shipment/solver/SolverConfigParam";

export default function ConfigGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={SolverConfigParam}
          path={`${path}/solver-config-param`}
        />
      </Switch>
    </div>
  );
}
