import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { FacilityCreate } from "../component/inventory/FacilityCreate";
import { FacilityDetail } from "../component/inventory/FacilityDetail";
import { FacilityList } from "../component/inventory/FacilityList";
import { SalesmanFacilityCreate } from "../component/inventory/SalesmanFacilityCreate";
import { SalesmanFacilityList } from "../component/inventory/SalesmanFacilityList";

export default function InventoryRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={FacilityCreate} exact path={`${path}/create`} />
        <Route component={FacilityList} exact path={`${path}/list`} />
        <Route component={FacilityDetail} path={`${path}/detail/:facilityId`} />

        <Route
          component={SalesmanFacilityList}
          exact
          path={`${path}/salesman/list/:facilityId`}
        />
        <Route
          component={SalesmanFacilityCreate}
          exact
          path={`${path}/salesman/create/:facilityId`}
        />
      </Switch>
    </div>
  );
}
