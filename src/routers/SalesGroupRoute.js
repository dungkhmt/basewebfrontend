import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DetailSalesman from "../component/salesman/DetailSalesman";

export default function SalesGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DetailSalesman} path={`${path}/salesman/:partyId`} />
      </Switch>
    </div>
  );
}
