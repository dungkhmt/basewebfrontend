import { Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import Quizz from "./Quizz";

const useStyles = makeStyles(() => ({
  titleContainer: {
    color: "white",
    backgroundColor: "#03787C",
    padding: 50,
  },
  title: { fontSize: "2.375rem" },
  body: {
    padding: "20px 30px",
  },
  quizzList: {
    padding: "0px 20px",
  },
}));

function QuizzTab({ classId }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [quizzList, setQuizList] = useState([]);

  const getQuizListOfClass = () => {
    request(
      token,
      history,
      "get",
      `/get-published-quiz-of-class/${classId}`,
      (res) => {
        console.log("getQuizListOfClass, res.data = ", res.data);
        setQuizList(res.data);
      }
    );
  };

  useEffect(() => {
    getQuizListOfClass();
  }, []);

  return (
    <Paper elevation={8}>
      <div>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          className={classes.titleContainer}
        >
          <Typography component="span" className={classes.title}>
            Câu hỏi trắc nghiệm
          </Typography>
        </Box>
      </div>
      <div className={classes.body}>
        <div className={classes.quizzList}>
          {quizzList.map((quizz, index) => (
            <Quizz key={quizz.questionId} quizz={quizz} index={index} />
          ))}
        </div>
      </div>
    </Paper>
  );
}

export default QuizzTab;
