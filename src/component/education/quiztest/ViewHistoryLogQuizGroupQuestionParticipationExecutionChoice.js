import { Card, CardContent } from "@material-ui/core/";
//import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};

function ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  let testId = props.testId;
  const columns = [
    { title: "User", field: "userLoginId" },
    { title: "Date", field: "date" },
    { title: "quizGroupId", field: "quizGroupId" },
    { title: "questionId", field: "questionId" },
    { title: "choiceAnswerId", field: "choiceAnswerId" },
  ];

  async function getHistoryLogQuizGroupQuestionParticipationExecutionChoice() {
    request(
      // token,
      // history,
      "get",
      "get-history-log-quiz_group_question_participation_execution_choice/" +
        testId,
      (res) => {
        console.log(res);
        //alert('assign students to groups OK');
        setData(res.data);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getHistoryLogQuizGroupQuestionParticipationExecutionChoice();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Lịch sử làm quiz"}
          columns={columns}
          data={data}
        />
      </CardContent>
    </Card>
  );
}

export default ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice;
