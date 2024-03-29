import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateProject from "../component/backlog/project/CreateProject";
import ProjectDashboard from "../component/backlog/project/ProjectDashboard";
import ProjectDetail from "../component/backlog/project/ProjectDetail";
import ProjectList from "../component/backlog/project/ProjectList";
import AssignSuggestionProjectList from "../component/backlog/suggestion/AssignSuggestionProjectList";
import CreateTask from "../component/backlog/task/CreateTask";
import EditTask from "../component/backlog/task/EditTask";
import ViewTask from "../component/backlog/task/ViewTask";
// import AssignSuggestionTaskList from "../component/backlog/suggestion/AssignSuggestionTaskList";

export default function BacklogRoute() {
  let { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route component={CreateProject} path={`${path}/create-project`} />
        <Route component={ProjectList} path={`${path}/project-list`} />
        <Route
          component={ProjectDetail}
          path={`${path}/project/:backlogProjectId`}
        />
        <Route
          component={CreateTask}
          path={`${path}/add-task/:backlogProjectId`}
        />
        <Route
          component={ViewTask}
          path={`${path}/view-task/:backlogProjectId/:taskId`}
        />
        <Route
          component={EditTask}
          path={`${path}/edit-task/:backlogProjectId/:taskId`}
        />
        <Route
          component={AssignSuggestionProjectList}
          path={`${path}/assign-suggestion/project-list`}
        />
        {/* <Route component={AssignSuggestionTaskList} path={`${path}/assign-suggestion/task-list/:backlogProjectId`} /> */}
        <Route
          component={ProjectDashboard}
          path={`${path}/dashboard/:backlogProjectId`}
        />
      </Switch>
    </div>
  );
}
