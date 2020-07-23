import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import TrackLocationList from "../component/tracklocations/tracklocationlist";
import GMapContainer from "../container/gmapcontainer";

export default function TrackLocationRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={GMapContainer} path={`${path}/gismap`} />
        <Route component={TrackLocationList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
