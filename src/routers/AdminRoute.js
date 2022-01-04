import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import Notifications from "../component/dataadmin/Notifications";
import ViewCourseVideo from "../component/dataadmin/ViewCourseVideo";
import ViewLogUserDoPraticeQuizs from "../component/dataadmin/ViewLogUserDoPraticeQuizs";

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
        <Route
          component={ViewLogUserDoPraticeQuizs}
          exact
          path={`${path}/view-log-user-do-pratice-quiz/list`}
        ></Route>
      </Switch>
    </div>
  );
}
