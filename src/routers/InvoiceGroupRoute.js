import React from "react";
import {Route, Switch, useRouteMatch} from "react-router";
import {
  DistributorUnpaidInvoiceDetail,
  DistributorUnpaidInvoiceList,
  Invoice,
  InvoiceDetail
} from "../component/accounting/InvoiceDataTable";

export default function InvoiceGroupRoute() {
  let {path, url} = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={InvoiceDetail} path={`${path}/invoice-detail/:invoiceId`}/>
        <Route component={Invoice} path={`${path}/invoice-sales/list`}/>
        <Route component={DistributorUnpaidInvoiceList} path={`${path}/distributor-unpaid-invoice/list`}/>
        <Route component={DistributorUnpaidInvoiceDetail}
               path={`${path}/distributor-unpaid-invoice-detail/:partyDistributorId`}/>
      </Switch>
    </div>
  );
}
