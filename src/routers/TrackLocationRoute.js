import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import TrackLocationList from "../component/tracklocations/tracklocationlist";
import LeafletMap from "../component/tracklocations/leafletmap";
// import GMapContainer from "../container/gmapcontainer";

export default function TrackLocationRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={LeafletMap} path={`${path}/gismap`} />
        <Route component={TrackLocationList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
