import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function ContestUserProblemTable() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [contestUserProblems, setContestUserProblems] = useState([]);

  const columns = [
    { title: "Contest", field: "contestId" },
    { title: "User", field: "userLoginId" },
    { title: "Problem", field: "problemId" },
    { title: "Points", field: "points" },
  ];

  async function getContestUserProblems() {
    let contestUserProblemist = await authGet(
      dispatch,
      token,
      "/get-contest-user-problem-list"
    );
    setContestUserProblems(contestUserProblemist);
  }
  useEffect(() => {
    getContestUserProblems();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Standing"}
          columns={columns}
          data={contestUserProblems}
        />
      </CardContent>
    </Card>
  );
}

export default ContestUserProblemTable;
