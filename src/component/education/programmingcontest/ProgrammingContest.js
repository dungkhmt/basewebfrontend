import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";
import ContestTableForRegistration from "./ContestTableForRegistration";
import ContestTableForSubmission from "./ContestTableForSubmission";

function ProgrammingContest() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [problems, setProblems] = useState([]);

  const columns = [
    {
      title: "ID bài tập",
      field: "problemId",
      render: (rowData) => (
        <Link to={"/edu/contest-problem/detail/submit/" + rowData["problemId"]}>
          {rowData["problemId"]}
        </Link>
      ),
    },
    { title: "Tên bài tập", field: "problemName" },
    { title: "Mô tả", field: "problemStatement" },
  ];

  async function getContestProblemList() {
    let problemList = await authGet(dispatch, token, "/contest-problem-list");
    setProblems(problemList);
    console.log(problemList);
  }
  useEffect(() => {
    getContestProblemList();
  }, []);

  return (
    <div>
      <ContestTableForSubmission />
      <ContestTableForRegistration />

      {/*
            <CardContent>
                <MaterialTable
                title={"Danh sách Bài"}
                columns={columns}
                data = {problems}
                
                />
            </CardContent>
            */}
    </div>
  );
}

export default ProgrammingContest;
