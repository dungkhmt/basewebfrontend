import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import RetailOutletCreate from "../component/retailoutlet/RetailOutletCreate";
import RetailOutletDetail from "../component/retailoutlet/RetailOutletDetail";
import RetailOutletList from "../component/retailoutlet/RetailOutletList";

export default function RetailOutletRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={RetailOutletCreate} exact path={`${path}/create`} />
        <Route component={RetailOutletList} exact path={`${path}/list`} />
        <Route component={RetailOutletDetail} exact path={`${path}/:partyId`} />
      </Switch>
    </div>
  );
}
