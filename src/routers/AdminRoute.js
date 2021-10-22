import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import Notifications from "../component/dataadmin/Notifications";
import ViewCourseVideo from "../component/dataadmin/ViewCourseVideo";
export default function AdminRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={Notifications}
          exact
          path={`${path}/notifications/list`}
        ></Route>
        <Route
          component={ViewCourseVideo}
          exact
          path={`${path}/view-course-video/list`}
        ></Route>
      </Switch>
    </div>
  );
}
