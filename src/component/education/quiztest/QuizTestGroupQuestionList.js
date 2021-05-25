import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Checkbox,
  Grid,
  Tooltip,
} from "@material-ui/core/";
import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
//import IconButton from '@material-ui/core/IconButton';
import {
  withStyles,
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Delete } from "@material-ui/icons";

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
    { title: "Group Id", field: "quizGroupId" },
    { title: "Group Code", field: "quizTestGroupCode" },
    { title: "QuestionId", field: "questionId" },
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
