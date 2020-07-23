import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DistributorCreate from "../component/distributor/DistributorCreate";
import DistributorDetail from "../component/distributor/DistributorDetail";
import DistributorList from "../component/distributor/DistributorList";

export default function DistributorRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DistributorCreate} path={`${path}/create`} />
        <Route component={DistributorList} path={`${path}/list`} />
        <Route component={DistributorDetail} path={`${path}/:partyId`} />
      </Switch>
    </div>
  );
}
