import { Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../api";
import TeacherViewQuizDetailInQuizTest from "./TeacherViewQuizDetailInQuizTest";

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
  skeletonAnswer: {
    marginLeft: 20,
    marginTop: 20,
  },
}));

function QuizQuestionsInQuizTest({ testId }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [quizList, setQuizList] = useState([]);
  const [quizGroups, setQuizGroups] = useState();
  const [loading, setLoading] = useState(true);

  //
  const getQuizListOfClass = () => {
    request(
      // token,
      // history,
      "get",
      `/get-questions-of-quiz-test/${testId}`,
      (res) => {
        // console.log("getQuizListOfClass, res.data = ", res.data);
        setQuizList(res.data);
        setLoading(false);
      },
      {
        onError: () => {
          setLoading(false);
        },
      }
    );
  };

  const getQuizGroup = () => {
    request(
      // token,
      // history,
      "get",
      `/get-test-groups-info?testId=${testId}`,
      (res) => {
        setQuizGroups(res.data);
      }
    );
  };

  useEffect(() => {
    getQuizListOfClass();
    getQuizGroup();
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
          {loading ? (
            <Fragment>
              <Skeleton
                variant="rect"
                width={800}
                height={24}
                animation="wave"
              />
              <Skeleton
                className={classes.skeletonAnswer}
                variant="rect"
                width={200}
                height={24}
                animation="wave"
              />
              <Skeleton
                className={classes.skeletonAnswer}
                variant="rect"
                width={600}
                height={24}
                animation="wave"
              />
              <Skeleton
                className={classes.skeletonAnswer}
                variant="rect"
                width={400}
                height={24}
                animation="wave"
              />
              <Skeleton
                className={classes.skeletonAnswer}
                variant="rect"
                width={700}
                height={24}
                animation="wave"
              />
            </Fragment>
          ) : (
            quizList.map((quiz, index) => (
              <TeacherViewQuizDetailInQuizTest
                key={quiz.questionId}
                quiz={quiz}
                index={index}
                testId={testId}
                quizGroups={quizGroups}
              />
            ))
          )}
        </div>
      </div>
    </Paper>
  );
}

export default QuizQuestionsInQuizTest;
