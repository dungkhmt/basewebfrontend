import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { WebcamRecorder } from "../component/webcam/WebcamRecorder";
import { WebcamVideoList } from "../component/webcam/WebcamVideoList";

export default function WebcamRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={WebcamRecorder} path={`${path}/recorder`} />
        <Route component={WebcamVideoList} path={`${path}/list`} />
      </Switch>
    </div>
  );
}
