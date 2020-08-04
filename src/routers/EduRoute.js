import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import BCASolver from "../component/education/BCASolver";
import CreateSemester from "../component/education/CreateSemester";
import CourseList from "../component/education/course/CourseList";
import AddNewCourse from "../component/education/course/AddNewCourse";
import ClassesList from "../component/education/class/ClassesList";
import CreateClass from "../component/education/class/CreateClass";
import CourseDetail from "../component/education/course/CourseDetail";
import TeacherDetail from "../component/education/teacher/TeacherDetail";
import AddTeacher from "../component/education/teacher/AddTeacher";
import TeacherList from "../component/education/teacher/TeacherList";

export default function EduRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={CourseList} path={`${path}/courses/list`} />

        <Route component={CourseDetail} path={`${path}/course/detail`} />

        <Route component={AddNewCourse} path={`${path}/course/create`} />

        <Route component={TeacherList} path={`${path}/teachers/list`} />

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
