import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ProductDetail from "../component/product/detailproduct";
import ProductCreate from "../component/product/ProductCreate";
import ProductList from "../component/product/ProductList";

export default function ProductRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ProductCreate} path={`${path}/create`} />
        <Route component={ProductList} path={`${path}/list`} />
        <Route component={ProductDetail} path={`${path}/:productId`} />
      </Switch>
    </div>
  );
}
