import { Route, Switch, useRouteMatch } from "react-router";
import ListProblem from "../component/education/programmingcontestFE/ListProblem";
import CreateProblem from "../component/education/programmingcontestFE/CreateProblem";
import IDE from "../component/education/programmingcontestFE/IDE";
import ProblemDetail from "../component/education/programmingcontestFE/ProblemDetail";
import CreateTestCase from "../component/education/programmingcontestFE/CreateTestCase";
import EditProblem from "../component/education/programmingcontestFE/EditProblem";
import ProblemSubmissionDetail from "../component/education/programmingcontestFE/ProblemSubmissionDetail";

export default function ProgrammingContestRoutes(){
  let { path } = useRouteMatch();
  return(
    <div>
      <Switch>
        <Route
          component={ListProblem}
          path={`${path}/list-problems`}
        />
        <Route
          component={CreateProblem}
          path={`${path}/create-problem`}
        />
        <Route
          component={EditProblem}
          path={`${path}/edit-problem/:problemId`}/>
        <Route
          component={IDE}
          path={`${path}/ide`}
        />
        <Route
          component={ProblemDetail}
          path={`${path}/problem-detail/:problemId`}
        />
        <Route
          component={CreateTestCase}
          path={`${path}/problem-detail-create-test-case/:problemId`}
        />
        <Route
          component={ProblemSubmissionDetail}
          path={`${path}/problem-submission-detail/:problemSubmissionId`}
        />
      </Switch>
    </div>
  )
}