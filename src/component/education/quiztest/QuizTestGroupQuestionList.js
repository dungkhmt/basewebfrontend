import { Button, Card, CardContent, Typography } from "@material-ui/core/";
//import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
import AddIcon from "@material-ui/icons/Add";
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

function QuizTestGroupQuestionList(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  let testId = props.testId;
  const columns = [
    { title: "Group Code", field: "groupCode" },
    {
      title: "Quiz",
      field: "questionStatement",
      render: (rowData) => (
        <Typography>{parse(rowData.questionStatement)}</Typography>
      ),
    },
    {
      title: "",
      field: "",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "45px" }}
          onClick={() => handleRemove(rowData)}
        >
          Xoa
        </Button>
      ),
    },
  ];

  function handleRemove(rowData) {
    //alert('remove ' + rowData.quizGroupId + "," + rowData.questionId);
    let datasend = {
      quizGroupId: rowData.quizGroupId,
      questionId: rowData.questionId,
    };
    request(
      token,
      history,
      "post",
      "remove-quizgroup-question-assignment",
      (res) => {
        console.log(res);
        alert("remove-quizgroup-question-assignment OK");
      },
      { 401: () => {} },
      datasend
    );
  }
  async function getQuizTestGroupQuestions() {
    request(
      token,
      history,
      "get",
      "get-quiz-group-question-assignment-of-test/" + testId,
      (res) => {
        console.log(res);
        //alert('assign students to groups OK');
        setData(res.data);
      },
      { 401: () => {} }
    );
  }

  function handleAddQuizGroupQuestion() {
    // Display a popup form with 2 fields:
    // - list of quiz-group: call API: "/get-test-groups-info" (testId lay o tren)
    // - list of questions: call API: "/get-list-quiz-for-assignment-of-test/${testId}"
    // a button "Luu" -> call API: "/add-quizgroup-question-assignment"
  }

  useEffect(() => {
    getQuizTestGroupQuestions();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Phân quiz vào các đề"}
          columns={columns}
          data={data}
          actions={[
            {
              icon: () => {
                return <AddIcon color="primary" fontSize="large" />;
              },
              tooltip: "Thêm mới",
              isFreeAction: true,
              onClick: () => {
                //history.push("quiz/create/");
                handleAddQuizGroupQuestion();
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

export default QuizTestGroupQuestionList;
