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
import ClassRegistration from "../views/Education/ClassManagement/Student/ClassRegistration";
import TClassDetail from "../views/Education/ClassManagement/Teacher/TClassDetail";
import TClassList from "../views/Education/ClassManagement/Teacher/TClassList";
import TAssignmentDetail from "../views/Education/ClassManagement/Teacher/TAssignmentDetail";
import SClassDetail from "../views/Education/ClassManagement/Student/SClassDetail";
import SClassList from "../views/Education/ClassManagement/Student/SClassList";
import SAssignmentDetail from "../views/Education/ClassManagement/Student/SAssignmentDetail";
import CreateAssignment from "../views/Education/ClassManagement/Teacher/CreateAssignment";
import ProgrammingContest from "../component/education/programmingcontest/ProgrammingContest";
import ManagementProgrammingContest from "../component/education/programmingcontest/ManagementProgrammingContest";
import CreateContestProblem from "../component/education/programmingcontest/CreateContestProblem";
import CreateProgrammingContest from "../component/education/programmingcontest/CreateProgrammingContest";

import ContestProblemDetail from "../component/education/programmingcontest/ContestProblemDetail";
import ContestProblemDetailForSubmit from "../component/education/programmingcontest/ContestProblemDetailForSubmit";
import ProgramSubmissionDetail from "../component/education/programmingcontest/ProgramSubmissionDetail";
import ContestRegistration from "../component/education/programmingcontest/ContestRegistration";


import NotFound from "../views/errors/NotFound";

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

        {/* Class management. */}
        <Route component={ClassRegistration} path={`${path}/class/register`} exact/>

        <Route component={SClassList} path={`${path}/student/class/list`} exact/>

        <Route component={ProgrammingContest} path={`${path}/student/contestprogramming`} exact/>

        <Route
          component={SAssignmentDetail}
          path={`${path}/student/class/:classId/assignment/:assignmentId`}
          exact
        />

        <Route component={SClassDetail} path={`${path}/student/class/:id`} exact/>

        <Route component={TClassList} path={`${path}/teacher/class/list`} exact/>
        
        <Route component={ManagementProgrammingContest} path={`${path}/management/contestprogramming`} exact/>

        <Route component={CreateContestProblem} path={`${path}/management/create-contest-problem`} exact/>

        <Route component={CreateProgrammingContest} path={`${path}/management/create-programming-contest`} exact/>

        <Route component={ContestProblemDetail} path={`${path}/contest-problem/detail/:problemId`} exact/>

        <Route component={ContestRegistration} path={`${path}/contest-registration/:contestId`} exact/>

        <Route component={ContestProblemDetailForSubmit} path={`${path}/contest-problem/detail/submit/:problemId`} exact/>

        <Route component={ProgramSubmissionDetail} path={`${path}/contest-program-submission/detail/:contestProgramSubmissionId`} exact/>


        <Route
          component={CreateAssignment}
          path={`${path}/teacher/class/:classId/assignment/create`}
          exact
        />

        <Route
          component={CreateAssignment}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId/edit`}
          exact
        />

        <Route
          component={TAssignmentDetail}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId`}
          exact
        />

        <Route component={TClassDetail} path={`${path}/teacher/class/:id`} exact/>

        <Route component={NotFound}/>
      </Switch>
    </div>
  );
}
