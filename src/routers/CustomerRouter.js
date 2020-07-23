import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CustomerCreate from "../component/customer/CustomerCreate";
import CustomerList from "../component/customer/CustomerList";

export default function CustomerRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={CustomerCreate} path={`${path}/create`} />
        <Route component={CustomerList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
