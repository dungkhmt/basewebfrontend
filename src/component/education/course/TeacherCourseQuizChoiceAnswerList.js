import { Card, CardContent, Typography } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import parse from "html-react-parser";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function TeacherCourseQuizChoiceAnswerList(props) {
  const params = useParams();
  const questionId = props.questionId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [choiceAnswers, setChoiceAnswers] = useState([]);

  const columns = [
    {
      title: "choiceAnswerId",
      field: "choiceAnswerId",
      render: (rowData) => (
        <Link
          to={
            "/edu/teacher/course/quiz/choiceanswer/detail/" +
            rowData["choiceAnswerId"]
          }
        >
          {rowData["choiceAnswerId"]}
        </Link>
      ),
    },
    {
      title: "Content",
      field: "choiceAnswerContent",
      render: (rowData) => (
        <Typography>{parse(rowData.choiceAnswerContent)}</Typography>
      ),
    },
    { title: "isCorrectAnswer", field: "isCorrectAnswer" },
  ];

  async function getChoiceAnswerList() {
    let lst = await authGet(
      dispatch,
      token,
      "/get-quiz-choice-answer-of-a-quiz/" + questionId
    );
    setChoiceAnswers(lst);
    console.log("getCHoiceAnsweList, questionId = " + questionId);
  }

  useEffect(() => {
    getChoiceAnswerList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Choice Answer"}
          columns={columns}
          data={choiceAnswers}
          actions={[
            {
              icon: () => {
                return <AddIcon color="primary" fontSize="large" />;
              },
              tooltip: "Thêm mới",
              isFreeAction: true,
              onClick: () => {
                history.push(
                  "/edu/course/detail/quiz/choiceanswer/create/" + questionId
                );
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

export default TeacherCourseQuizChoiceAnswerList;
