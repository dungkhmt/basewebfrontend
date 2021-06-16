import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import {
  Payment,
  PaymentApplication,
} from "../component/accounting/InvoiceDataTable";
import PaymentApplicationCreate from "../component/accounting/PaymentApplicationCreate";
import { PaymentCreate } from "../component/accounting/PaymentCreate";
import QuickInvoicePayment from "../component/accounting/QuickInvoicePayment";

export default function PaymentGroupRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Payment} path={`${path}/customer-payment/list`} />
        <Route component={PaymentCreate} path={`${path}/create-payment`} />
        <Route
          component={PaymentApplicationCreate}
          path={`${path}/create-payment-application/:paymentId`}
        />
        <Route
          component={QuickInvoicePayment}
          path={`${path}/quick-create-payment-application/:invoiceId`}
        />
        <Route
          component={PaymentApplication}
          path={`${path}/payment-application/:paymentId`}
        />
      </Switch>
    </div>
  );
}
