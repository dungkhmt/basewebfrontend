import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DetailOrder from "../component/order/detailorder";
import OrderCreate from "../component/order/OrderCreate";
import OrderList from "../component/order/OrderList";

export default function OrderRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={OrderCreate} path={`${path}/create`} />
        <Route component={OrderList} path={`${path}/list`} />
        <Route component={DetailOrder} path={`${path}/detail/:orderId`} />
      </Switch>
    </div>
  );
}
