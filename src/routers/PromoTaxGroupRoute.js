import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { VoucherCreate } from "../component/promotax/VoucherCreate";
import { VoucherDetail } from "../component/promotax/VoucherDetail";
import { VoucherList } from "../component/promotax/VoucherList";
import { VoucherRuleCreate } from "../component/promotax/VoucherRuleCreate";
import { VoucherUpdate } from "../component/promotax/VoucherUpdate";
import { VoucherRuleUpdate } from "../component/promotax/VoucherRuleUpdate";

export default function PromoTaxGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        {/*<Route component={ProductCreate} path={`${path}/create`} />*/}
        <Route component={VoucherCreate} path={`${path}/create-voucher`} />
        <Route
          component={VoucherUpdate}
          path={`${path}/edit-voucher/:voucherId`}
        />
        <Route component={VoucherList} path={`${path}/voucher-list`} />
        <Route
          component={VoucherDetail}
          path={`${path}/voucher-detail/:voucherId`}
        />

        <Route
          component={VoucherRuleCreate}
          path={`${path}/create-voucher-rule/:voucherId`}
        />
        <Route
          component={VoucherRuleUpdate}
          path={`${path}/edit-voucher-rule/:voucherId/:voucherRuleId`}
        />
      </Switch>
    </div>
  );
}
