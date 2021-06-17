import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ChangeDistanceDetail from "../component/geo/ChangeDistanceDetail";
import GeoGoogleMapChangeCoordinates from "../component/geo/GeoGoogleMapChangeCoordinates";
import GeoListDistanceInfo from "../component/geo/GeoListDistanceInfo";
import ListLocation from "../component/geo/ListLocation";
import CreateContainer from "../component/tmscontainer/container/CreateContainer";

export default function GeoRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ListLocation} path={`${path}/list/location`} />

        <Route
          component={GeoGoogleMapChangeCoordinates}
          path={`${path}/location/map/:contactMechId`}
        />

        <Route
          component={GeoListDistanceInfo}
          path={`${path}/list/distance-info`}
        />

        <Route
          component={ChangeDistanceDetail}
          path={`${path}/change/distance-detail/:fromContactMechId/:toContactMechId`}
        />
        <Route component={CreateContainer} path="/containerfunc/create" />
      </Switch>
    </div>
  );
}
