import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ListSalesman from "../component/salesroutes/ListSalesman";
import SalesmanCheckinRoutesHistory from "../component/salesroutes/salesmancheckinrouteshistory";
import SalesmanDetail from "../component/salesroutes/SalesmanDetail";
import AddSalesRouteConfig from "../component/salesroutes/salesrouteconfig/AddSalesRouteConfig";
import SalesRouteConfig from "../component/salesroutes/salesrouteconfig/SalesRouteConfig";
import SalesRouteDetail from "../component/salesroutes/salesroutedatail/SalesRouteDetail";
import AddVisitConfirguration from "../component/salesroutes/salesrouteplan/AddVisitConfirguration";
import EditVisitConfirguration from "../component/salesroutes/salesrouteplan/EditVisitConfiguration";
import Plan from "../component/salesroutes/salesrouteplan/Plan";
import PlanPeriod from "../component/salesroutes/salesrouteplan/PlanPeriod";

export default function SalesRoutesPlanRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route exact component={Plan} path={`${path}/plan`} />
        <Route exact component={PlanPeriod} path={`${path}/plan/period`} />
        <Route
          exact
          component={AddVisitConfirguration}
          path={`${path}/plan/period/add/visit-confirguration`}
        />
        <Route
          exact
          component={EditVisitConfirguration}
          path={`${path}/plan/period/edit/visit-confirguration`}
        />
        <Route
          exact
          component={SalesRouteDetail}
          path={`${path}/plan/period/detail`}
        />
        <Route exact component={SalesRouteConfig} path={`${path}/configs`} />
        <Route
          exact
          component={AddSalesRouteConfig}
          path={`${path}/configs/create-new`}
        />
        <Route exact component={ListSalesman} path={`${path}/salesman/list`} />
        <Route
          exact
          component={SalesmanDetail}
          path={`${path}/salesman/detail/:id`}
        />
        <Route
          component={SalesmanCheckinRoutesHistory}
          path={`${path}/salesman-checkin-routes`}
        />
      </Switch>
    </div>
  );
}
