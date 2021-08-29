import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import BCASolver from "../component/education/BCASolver";
import ClassCreate from "../component/education/class/ClassCreate";
import ClassesList from "../component/education/class/ClassesList";
import ClassTeacherAssignmentPlanDetail from "../component/education/classteacherassignment/ClassTeacherAssignmentPlanDetail";
import ClassTeacherAssignmentPlanList from "../component/education/classteacherassignment/ClassTeacherAssignmentPlanList";
import AddNewCourse from "../component/education/course/AddNewCourse";
import CourseDetail from "../component/education/course/CourseDetail";
import CourseList from "../component/education/course/CourseList";
import CreateChapterMaterialOfCourse from "../component/education/course/CreateChapterMaterialOfCourse";
import CreateChapterOfCourse from "../component/education/course/CreateChapterOfCourse";
import CreateQuizChoiceAnswerOfCourse from "../component/education/course/CreateQuizChoiceAnswerOfCourse";
import CreateQuizOfCourse from "../component/education/course/CreateQuizOfCourse";
import CreateTopicOfCourse from "../component/education/course/CreateTopicOfCourse";
import StudentCourseChapterDetail from "../component/education/course/StudentCourseChapterDetail";
import StudentCourseChapterMaterialDetail from "../component/education/course/StudentCourseChapterMaterialDetail";
import TeacherCourseChapterDetail from "../component/education/course/TeacherCourseChapterDetail";
import TeacherCourseChapterMaterialDetail from "../component/education/course/TeacherCourseChapterMaterialDetail";
import TeacherCourseDetail from "../component/education/course/TeacherCourseDetail";
import TeacherCourseList from "../component/education/course/TeacherCourseList";
import TeacherCourseQuizChoiceAnswerDetail from "../component/education/course/TeacherCourseQuizChoiceAnswerDetail";
import TeacherCourseQuizDetail from "../component/education/course/TeacherCourseQuizDetail";
import CreateSemester from "../component/education/CreateSemester";
import AddProblemToProgrammingContest from "../component/education/programmingcontest/AddProblemToProgrammingContest";
import ContestProblemDetail from "../component/education/programmingcontest/ContestProblemDetail";
import ContestProblemDetailForSubmit from "../component/education/programmingcontest/ContestProblemDetailForSubmit";
import ContestRegistration from "../component/education/programmingcontest/ContestRegistration";
import CreateContestProblem from "../component/education/programmingcontest/CreateContestProblem";
import CreateProgrammingContest from "../component/education/programmingcontest/CreateProgrammingContest";
import ManagementProgrammingContest from "../component/education/programmingcontest/ManagementProgrammingContest";
import ProblemsOfProgrammingContestAndUser from "../component/education/programmingcontest/ProblemsOfProgrammingContestAndUser";
import ProgrammingContest from "../component/education/programmingcontest/ProgrammingContest";
import ProgrammingContestDetail from "../component/education/programmingcontest/ProgrammingContestDetail";
import ProgramSubmissionDetail from "../component/education/programmingcontest/ProgramSubmissionDetail";
import CreateQuizTest from "../component/education/quiztest/CreateQuizTest";
import QuizTestDetail from "../component/education/quiztest/QuizTestDetail";
import QuizTestEdit from "../component/education/quiztest/QuizTestEdit";
import QuizTestList from "../component/education/quiztest/QuizTestList";
import StudentQuizDetail from "../component/education/quiztest/StudentQuizDetail";
import StudentQuizList from "../component/education/quiztest/StudentQuizTestList";
import AddTeacher from "../component/education/teacher/AddTeacher";
import TeacherDetail from "../component/education/teacher/TeacherDetail";
import TeacherList from "../component/education/teacher/TeacherList";
import ClassRegistration from "../views/Education/ClassManagement/Student/ClassRegistration";
import SAssignmentDetail from "../views/Education/ClassManagement/Student/SAssignmentDetail";
import SClassDetail from "../views/Education/ClassManagement/Student/SClassDetail";
import SClassList from "../views/Education/ClassManagement/Student/SClassList";
import CreateAssignment from "../views/Education/ClassManagement/Teacher/CreateAssignment";
import TAssignmentDetail from "../views/Education/ClassManagement/Teacher/TAssignmentDetail";
import TClassDetail from "../views/Education/ClassManagement/Teacher/TClassDetail";
import TClassList from "../views/Education/ClassManagement/Teacher/TClassList";
import NotFound from "../views/errors/NotFound";

export default function EduRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={TeacherCourseList}
          path={`${path}/teacher/course/list`}
        />
        <Route
          component={TeacherCourseDetail}
          path={`${path}/course/detail/:id`}
          exact
        />
        <Route
          component={CreateChapterOfCourse}
          path={`${path}/course/detail/chapter/create/:courseId`}
          exact
        />
        <Route
          component={CreateQuizOfCourse}
          path={`${path}/course/detail/quiz/create/:courseId`}
          exact
        />
        <Route
          component={CreateTopicOfCourse}
          path={`${path}/course/detail/topic/create/:courseId`}
          exact
        />

        <Route
          component={TeacherCourseChapterDetail}
          path={`${path}/teacher/course/chapter/detail/:chapterId`}
          exact
        />
        <Route
          component={TeacherCourseQuizDetail}
          path={`${path}/teacher/course/quiz/detail/:questionId/:courseId`}
          exact
        />
        <Route
          component={StudentCourseChapterDetail}
          path={`${path}/student/course/chapter/detail/:chapterId`}
          exact
        />

        <Route
          component={CreateChapterMaterialOfCourse}
          path={`${path}/course/detail/chapter/material/create/:chapterId`}
          exact
        />
        <Route
          component={CreateQuizChoiceAnswerOfCourse}
          path={`${path}/course/detail/quiz/choiceanswer/create/:questionId/:courseId`}
          exact
        />
        <Route
          component={TeacherCourseQuizChoiceAnswerDetail}
          path={`${path}/teacher/course/quiz/choiceanswer/detail/:choiceAnswerId`}
          exact
        />
        <Route
          component={TeacherCourseChapterMaterialDetail}
          path={`${path}/teacher/course/chapter/material/detail/:chapterMaterialId`}
          exact
        />
        <Route
          component={StudentCourseChapterMaterialDetail}
          path={`${path}/student/course/chapter/material/detail/:chapterMaterialId`}
          exact
        />

        <Route component={CourseList} path={`${path}/courses/list`} />

        <Route component={CourseDetail} path={`${path}/course/detail`} />

        <Route component={AddNewCourse} path={`${path}/course/create`} />

        <Route component={TeacherList} path={`${path}/teachers/list`} />

        <Route component={TeacherDetail} path={`${path}/teacher/detail`} />

        <Route component={AddTeacher} path={`${path}/teacher/create`} />

        <Route component={ClassesList} path={`${path}/classes-list`} />

        <Route component={AssignmentList} path={`${path}/assignment`} />

        <Route
          component={ClassTeacherAssignmentPlanList}
          path={`${path}/class-teacher-assignment-plan/list`}
        />
        <Route
          component={ClassTeacherAssignmentPlanDetail}
          path={`${path}/class-teacher-assignment-plan/detail/:planId`}
        />

        <Route component={BCASolver} path={`${path}/solve`} />

        <Route component={CreateSemester} path={`${path}/semester`} />

        <Route component={ClassCreate} path={`${path}/class/add`} />

        {/**
         * route for quiz test
         */}
        {/* Quiztest-001 */}
        <Route component={QuizTestList} path={`${path}/class/quiztest/list`} />
        {/* Quiztest-002 */}
        <Route
          component={QuizTestDetail}
          path={`${path}/class/quiztest/detail/:id`}
          exact
        />
        <Route
          component={QuizTestEdit}
          path={`${path}/class/quiztest/edit/:id`}
          exact
        />
        <Route
          component={CreateQuizTest}
          path={`${path}/class/quiztest/create-quiz-test`}
        />
        <Route
          component={StudentQuizList}
          path={`${path}/class/student/quiztest/list`}
        />
        <Route
          component={StudentQuizDetail}
          path={`${path}/class/student/quiztest/detail`}
        />

        {/* Class management. */}
        <Route
          component={ClassRegistration}
          path={`${path}/class/register`}
          exact
        />

        <Route
          component={SClassList}
          path={`${path}/student/class/list`}
          exact
        />

        <Route
          component={ProgrammingContest}
          path={`${path}/student/contestprogramming`}
          exact
        />

        <Route
          component={SAssignmentDetail}
          path={`${path}/student/class/:classId/assignment/:assignmentId`}
          exact
        />

        <Route
          component={SClassDetail}
          path={`${path}/student/class/:id`}
          exact
        />

        <Route
          component={TClassList}
          path={`${path}/teacher/class/list`}
          exact
        />

        <Route
          component={ManagementProgrammingContest}
          path={`${path}/management/contestprogramming`}
          exact
        />

        <Route
          component={CreateContestProblem}
          path={`${path}/management/create-contest-problem`}
          exact
        />

        <Route
          component={CreateProgrammingContest}
          path={`${path}/management/create-programming-contest`}
          exact
        />

        <Route
          component={ContestProblemDetail}
          path={`${path}/contest-problem/detail/:problemId`}
          exact
        />

        <Route
          component={ContestRegistration}
          path={`${path}/contest-registration/:contestId`}
          exact
        />
        <Route
          component={ProblemsOfProgrammingContestAndUser}
          path={`${path}/contest-problem-for-submission/:contestId`}
          exact
        />

        <Route
          component={ContestProblemDetailForSubmit}
          path={`${path}/contest-problem/detail/submit/:problemId/:contestId`}
          exact
        />

        <Route
          component={ProgramSubmissionDetail}
          path={`${path}/contest-program-submission/detail/:contestProgramSubmissionId`}
          exact
        />

        <Route
          component={ProgrammingContestDetail}
          path={`${path}/programming-contest-detail/:contestId`}
          exact
        />

        <Route
          component={AddProblemToProgrammingContest}
          path={`${path}/programming-contest-detail/add-problem-to-programming-contest/:contestId`}
          exact
        />

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

        <Route
          component={TClassDetail}
          path={`${path}/teacher/class/:id`}
          exact
        />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
