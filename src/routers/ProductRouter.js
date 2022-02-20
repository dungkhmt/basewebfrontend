import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import Cart from "../component/product/Cart";
import ProductDetail from "../component/product/detailproduct";
import Order from "../component/product/Order";
import ProductCreate from "../component/product/ProductCreate";
import ProductDetailUserView from "../component/product/ProductDetailUserView";
import ProductList from "../component/product/ProductList";

export default function ProductRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ProductCreate} path={`${path}/create`} />
        <Route component={ProductList} path={`${path}/list`} />
        <Route component={Cart} path={`${path}/cart`} />
        <Route component={Order} path={`${path}/order`} />
        <Route
          component={ProductDetailUserView}
          path={`${path}/user-view/:productId`}
        />
        <Route exact component={ProductDetail} path={`${path}/:productId`} />
      </Switch>
    </div>
  );
}
