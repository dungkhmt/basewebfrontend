import { Card, CardContent, Typography } from "@material-ui/core/";
//import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
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
  ];

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
        />
      </CardContent>
    </Card>
  );
}

export default QuizTestGroupQuestionList;
