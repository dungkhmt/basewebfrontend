import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateProject from "../component/backlog/CreateProject";
import ProjectList from "../component/backlog/ProjectList";
import ProjectDetail from "../component/backlog/ProjectDetail";
import CreateTask from "../component/backlog/CreateTask";
import ViewTask from "../component/backlog/ViewTask";
import EditTask from "../component/backlog/EditTask";

export default function BacklogRoute() {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route component={CreateProject} path={`${path}/create-project`} />
        <Route component={ProjectList} path={`${path}/list`} />
        <Route component={ProjectDetail} path={`${path}/project/:backlogProjectId`} />
        <Route component={CreateTask} path={`${path}/add-task/:backlogProjectId`} />
        <Route component={ViewTask} path={`${path}/view-task/:backlogProjectId/:taskId`} />
        <Route component={EditTask} path={`${path}/edit-task/:backlogProjectId/:taskId`} />
      </Switch>
    </div>
  );
}
