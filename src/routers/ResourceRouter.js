import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CustomerCreate from "../component/customer/CustomerCreate";
import ResourceDomainList from "../component/resourcelink/ResourceDomainList";

export default function ResourceDomainRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        {/* <Route component={CustomerCreate} path={`${path}/create`} /> */}
        <Route component={ResourceDomainList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
