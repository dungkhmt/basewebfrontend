import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import BCASolver from "../component/education/BCASolver";
import ClassesList from "../component/education/ClassesList";
import CourseList from "../component/education/CoursesList";
import CreateClass from "../component/education/CreateClass";
import CreateSemester from "../component/education/CreateSemester";
import TeacherDetail from "../component/education/TeacherDetail";
import TeachersList from "../component/education/TeachersList";

export default function EduRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={CourseList} path={`${path}/courses-list`} />

        <Route component={TeachersList} path={`${path}/teachers-list`} />

        <Route component={ClassesList} path={`${path}/classes-list`} />

        <Route component={AssignmentList} path={`${path}/assignment`} />

        <Route component={BCASolver} path={`${path}/solve`} />

        <Route component={CreateSemester} path={`${path}/semester`} />

        <Route component={CreateClass} path={`${path}/create-class`} />

        <Route component={TeacherDetail} path={`${path}/teacher-detail`} />
      </Switch>
    </div>
  );
}
