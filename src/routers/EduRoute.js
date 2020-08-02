import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import BCASolver from "../component/education/BCASolver";
import ClassesList from "../component/education/ClassesList";
import CreateClass from "../component/education/CreateClass";
import CreateSemester from "../component/education/CreateSemester";
import TeacherDetail from "../component/education/TeacherDetail";
import TeachersList from "../component/education/TeachersList";
import CourseList from "../component/education/CourseList";
import CourseDetail from "../component/education/CourseDetail";
import AddNewCourse from "../component/education/AddNewCourse";
import AddTeacher from "../component/education/AddTeacher";

export default function EduRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={CourseList} path={`${path}/courses/list`} />

        <Route component={CourseDetail} path={`${path}/course/detail`} />

        <Route component={AddNewCourse} path={`${path}/course/create`} />

        <Route component={TeachersList} path={`${path}/teachers/list`} />

        <Route component={TeacherDetail} path={`${path}/teacher/detail`} />

        <Route component={AddTeacher} path={`${path}/teacher/create`} />

        <Route component={ClassesList} path={`${path}/classes-list`} />

        <Route component={AssignmentList} path={`${path}/assignment`} />

        <Route component={BCASolver} path={`${path}/solve`} />

        <Route component={CreateSemester} path={`${path}/semester`} />

        <Route component={CreateClass} path={`${path}/create-class`} />
      </Switch>
    </div>
  );
}
