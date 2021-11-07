import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import SupplierCreate from "../component/supplier/SupplierCreate";
import SupplierList from "../component/supplier/SupplierList";

export default function SupplierRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={SupplierList} path={`${path}/list`} />
        <Route component={SupplierCreate} path={`${path}/create`} />
      </Switch>
    </div>
  );
}
