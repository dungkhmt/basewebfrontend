import { Card } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";
import ProblemsOfProgrammingContest from "./ProblemsOfProgrammingContest";
import ProgrammingContestUserRegistrationTableApprove from "./ProgrammingContestUserRegistrationTableApproved";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

let reDirect = null;

const editorStyle = {
  toolbar: {
    background: "#90caf9",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

function ProgrammingContestDetail() {
  const params = useParams();
  const contestId = params.contestId;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [contest, setContest] = useState(null);

  const [alertMessage, setAlertMessage] = useState({
    title: "Vui lòng nhập đầy đủ thông tin cần thiết",
    content:
      "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại.",
  });
  const [alertSeverity, setAlertSeverty] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);
  const history = useHistory();

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const onClickAlertBtn = () => {
    setOpenAlert(false);
    if (reDirect != null) {
      history.push(reDirect);
    }
  };

  async function getProgrammingContest() {
    let cts = await authGet(
      dispatch,
      token,
      "/get-programming-contest/" + contestId
    );
    setContest(cts);
  }
  async function distributeProblemsToParticipants() {
    let body = {
      contestId: contest.contestId,
    };
    let rs = authPost(
      dispatch,
      token,
      "/distribute-problems-of-contest-to-participants",
      body
    );
    console.log("distribute-problems-of-contest-to-participants, rs = " + rs);
    alert("FINISHED");
  }

  useEffect(() => {
    getProgrammingContest();
  }, []);
  return (
    <Card>
      <div>CONTEST: {contest == undefined ? "" : contest.contestName}</div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "45px" }}
        onClick={() => distributeProblemsToParticipants()}
      >
        Phân chia bài cho thí sinh
      </Button>
      <br></br>
      <br></br>
      <ProgrammingContestUserRegistrationTableApprove contestId={contestId} />
      <ProblemsOfProgrammingContest contestId={contestId} />
    </Card>
  );
}

export default ProgrammingContestDetail;
