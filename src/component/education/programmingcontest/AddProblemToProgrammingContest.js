import { MenuItem, TextField } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";

function AddProblemToProgrammingContest() {
  const params = useParams();
  const contestId = params.contestId;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState(null);
  async function getContestProblemList() {
    let problemList = await authGet(dispatch, token, "/contest-problem-list");
    setProblems(problemList);
    console.log(problemList);
  }
  async function handleSubmit() {
    //alert('add problem 2 contest');

    let body = {
      contestId: contestId,
      problemId: problemId,
    };
    //let body = {problemId,problemName,statement};
    let contest = await authPost(
      dispatch,
      token,
      "/create-programmingcontest-problem",
      body
    );
    console.log("return add problem 2 contest  ", contest);

    history.push("/edu/programming-contest-detail/" + contestId);

    /*
        let body = {contestId:contestId,
            problemId: problemId
		};
		//let body = {problemId,problemName,statement};
        let contest = await authPost(dispatch, token, '/create-programmingcontest-problem', body);
        console.log('return contest registration  ',contest);
        
		history.push("contestprogramming");
        */
  }
  useEffect(() => {
    getContestProblemList();
  }, []);

  return (
    <div>
      <TextField
        required
        id="contestType"
        select
        label="Chọn bài"
        value={problemId}
        fullWidth
        onChange={(event) => {
          setProblemId(event.target.value);
          console.log(problemId, event.target.value);
        }}
      >
        {problems.map((item) => (
          <MenuItem key={item.problemId} value={item.problemId}>
            {item.problemName}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "45px" }}
        onClick={handleSubmit}
      >
        Lưu
      </Button>
    </div>
  );
}

export default AddProblemToProgrammingContest;
