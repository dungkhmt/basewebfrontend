import { Switch } from "react-router";
import React from "react";
import { useRouteMatch } from "react-router";
import Upload from "../component/schedule/Upload";
import View from "../component/schedule/View";
import { Route } from "react-router";
export default function ScheduleRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Upload} path={`${path}/upload`} />
        <Route component={View} path={`${path}/view`} />
      </Switch>
    </div>
  );
}
