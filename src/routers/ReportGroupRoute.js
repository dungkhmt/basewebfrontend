import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import {
  SaleReportByPartyCustomer,
  SaleReportByProduct,
} from "../component/report/SaleReport";
import SaleReportByDate from "../component/reportsales/SalesReportByDate";
import {
  TransportReportByDriver,
  TransportReportByFacility,
  TransportReportByPartyCustomer,
} from "../component/report/TransportReport";

export default function ReportGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={SaleReportByProduct}
          path={`${path}/sale-reports-by-product`}
        />
        <Route
          component={SaleReportByPartyCustomer}
          path={`${path}/sale-reports-by-customer`}
        />
        <Route
          component={SaleReportByDate}
          path={`${path}/sale-reports-by-date`}
        />
        <Route
          component={TransportReportByDriver}
          path={`${path}/transport-reports-by-driver`}
        />
        <Route
          component={TransportReportByFacility}
          path={`${path}/transport-reports-by-facility`}
        />
        <Route
          component={TransportReportByPartyCustomer}
          path={`${path}/transport-reports-by-customer`}
        />
      </Switch>
    </div>
  );
}
