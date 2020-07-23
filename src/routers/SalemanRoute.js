import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DetailSalesman from "../component/salesman/DetailSalesman";
import SalesmanCreate from "../component/salesman/SalesmanCreate";
import SalesmanList from "../component/salesman/SalesmanList";
import AssignSalesman2Distributor from "../component/salesroutes/AssignSalesman2Distributor";
import AssignSalesman2RetailOutlet from "../component/salesroutes/AssignSalesman2RetailOutlet";

export default function SalemanRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={SalesmanList} path={`${path}/list`} />
        <Route
          component={AssignSalesman2Distributor}
          path={`${path}/assign-salesman-2-distributor`}
        />
        <Route
          component={AssignSalesman2RetailOutlet}
          path={`${path}/assign-salesman-2-retail-outlet`}
        />
        <Route component={SalesmanCreate} path={`${path}/create`} />
        <Route component={DetailSalesman} path={`${path}/:partyId`} />
      </Switch>
    </div>
  );
}
