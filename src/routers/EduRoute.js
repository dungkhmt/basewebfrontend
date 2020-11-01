import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import BCASolver from "../component/education/BCASolver";
import CreateSemester from "../component/education/CreateSemester";
import CourseList from "../component/education/course/CourseList";
import AddNewCourse from "../component/education/course/AddNewCourse";
import ClassesList from "../component/education/class/ClassesList";
import CreateClass from "../component/education/class/CreateClass";
import ClassCreate from "../component/education/class/ClassCreate";
import CourseDetail from "../component/education/course/CourseDetail";
import TeacherDetail from "../component/education/teacher/TeacherDetail";
import AddTeacher from "../component/education/teacher/AddTeacher";
import TeacherList from "../component/education/teacher/TeacherList";
import ClassRegistration from "../component/education/classmanagement/student/ClassRegistration";
import TClassDetail from "../component/education/classmanagement/teacher/TClassDetail";
import TClassList from "../component/education/classmanagement/teacher/TClassList";
import TExerciseDetail from "../component/education/classmanagement/teacher/TExerciseDetail";
import SClassDetail from "../component/education/classmanagement/student/SClassDetail";
import SClassList from "../component/education/classmanagement/student/SClassList";
import SExerciseDetail from "../component/education/classmanagement/student/SExerciseDetail";
import CreateExercise from "../component/education/classmanagement/teacher/CreateExercise";

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

        <Route component={ClassCreate} path={`${path}/class/add`} />

        <Route component={ClassRegistration} path={`${path}/class/register`} />

        <Route component={SClassList} path={`${path}/student/class/list`} />

        <Route
          component={SExerciseDetail}
          path={`${path}/student/class/:classId/assignment/:assignmentId`}
        />

        <Route component={SClassDetail} path={`${path}/student/class/:id`} />

        <Route component={TClassList} path={`${path}/teacher/class/list`} />

        <Route
          component={CreateExercise}
          path={`${path}/teacher/class/:classId/assignment/create`}
        />

        <Route
          component={CreateExercise}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId/edit`}
        />

        <Route
          component={TExerciseDetail}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId`}
        />

        <Route component={TClassDetail} path={`${path}/teacher/class/:id`} />
      </Switch>
    </div>
  );
}
