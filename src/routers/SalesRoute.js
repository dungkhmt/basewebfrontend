import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import SalesmanAdd from "../component/salesman/SalesmanAdd";
import SalesmanCreate from "../component/salesman/SalesmanCreate";

export default function SalesRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={SalesmanAdd} path={`${path}/add/:partyId`} />
        <Route component={SalesmanCreate} path={`${path}/create`} />
      </Switch>
    </div>
  );
}
