import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";

// const useCheckBoxStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   formControl: {
//     margin: theme.spacing(3),
//   },
// }));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    //color: theme.palette.text.secondary,
    color: "black",
    borderRadius: "20px",
    //background: "beige",
    background: "#EBEDEF",
  },
}));

export default function StudentQuizDetail() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const testQuizId = history.location.state.testId;
  const [ListQuestions, setListQuestions] = useState([]);
  const [sucessRequest, setSucessRequest] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [messageRequest, setMessageRequest] = useState(false);
  const [quizGroupTestDetail, setquizGroupTestDetail] = useState({});
  const classes = useStyles();
  // const Checkboxclasses = useCheckBoxStyles();
  const [stateCheckBox, setStateCheckBox] = useState({});

  async function getQuestionList() {
    request(
      // token,
      // history,
      "get",
      "/get-quiz-test-participation-group-question/" + testQuizId,
      (res) => {
        setListQuestions(res.data.listQuestion);
        setquizGroupTestDetail(res.data);
        let tmpObj = {};
        res.data.listQuestion.forEach((element) => {
          tmpObj[element["questionId"]] = new Object();
          element["quizChoiceAnswerList"].forEach((ele) => {
            tmpObj[element["questionId"]][ele["choiceAnswerId"]] =
              res.data.participationExecutionChoice.hasOwnProperty(
                element["questionId"]
              )
                ? res.data.participationExecutionChoice[
                    element["questionId"]
                  ].includes(ele["choiceAnswerId"])
                : false;
          });
        });
        console.log(tmpObj);
        setStateCheckBox(tmpObj);
      },
      {
        401: () => {},
        406: () => {
          setMessageRequest("Quá thời gian làm bài!");
          setErrorRequest(true);
        },
      }
    );
  }

  const handleClick = (quesId) => {
    console.log(quesId);
    console.log(stateCheckBox);
    let listAns = [];
    Object.keys(stateCheckBox[quesId]).map((element, index) => {
      if (stateCheckBox[quesId][element] == true) {
        listAns.push(element);
      }
    });
    let tmpOb = {
      testId: testQuizId,
      questionId: quesId,
      quizGroupId: quizGroupTestDetail.quizGroupId,
      chooseAnsIds: listAns,
    };
    console.log(tmpOb);
    request(
      // token,
      // history,
      "post",
      "/quiz-test-choose_answer-by-user",
      (res) => {
        console.log(res);
        setMessageRequest("Đã lưu vào hệ thống!");
        setSucessRequest(true);
      },
      {
        400: () => {
          setMessageRequest("Không được để trống!");
          setErrorRequest(true);
        },
        406: () => {
          setMessageRequest("Quá thời gian làm bài!");
          setErrorRequest(true);
        },
      },
      tmpOb
    );
  };

  const handleChange = (event, quesID) => {
    setStateCheckBox({
      ...stateCheckBox,
      [quesID]: {
        ...stateCheckBox[quesID],
        [event.target.name]: event.target.checked,
      },
    });
  };

  const handleCloseSucess = () => {
    setSucessRequest(false);
  };
  const handleCloseError = () => {
    setErrorRequest(false);
  };
  useEffect(() => {
    getQuestionList();
  }, []);

  return (
    <div className={classes.root}>
      <Card style={{ padding: "20px 20px 20px 20px" }}>
        <Snackbar
          open={sucessRequest}
          autoHideDuration={2000}
          onClose={handleCloseSucess}
        >
          <Alert variant="filled" severity="success">
            {messageRequest}
          </Alert>
        </Snackbar>
        <Snackbar
          open={errorRequest}
          autoHideDuration={8000}
          onClose={handleCloseError}
        >
          <Alert variant="filled" severity="error">
            {messageRequest}
          </Alert>
        </Snackbar>
        <div style={{ padding: "0px 20px 20px 30px" }}>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <h3>Quiz test: {quizGroupTestDetail.testName}</h3>
            <h3>Môn: {quizGroupTestDetail.courseName}</h3>
          </div>

          <h4>Bắt đầu: {quizGroupTestDetail.scheduleDatetime}</h4>
          <h4>Thời gian: {quizGroupTestDetail.duration} phút</h4>
        </div>
        <Grid container spacing={3}>
          {quizGroupTestDetail.quizGroupId != null ? (
            ListQuestions != null ? (
              ListQuestions.map((element, index) => {
                return (
                  <Grid item xs={12} key={index}>
                    <Paper className={classes.paper}>
                      <div className={classes.root}>
                        <h4>Quiz {index + 1}</h4>{" "}
                        <p
                          dangerouslySetInnerHTML={{
                            __html: element["statement"],
                          }}
                        />
                        {element.attachment &&
                          element.attachment.length !== 0 &&
                          element.attachment.map((url, index) => (
                            <div key={index} className={classes.imageContainer}>
                              <div className={classes.imageWrapper}>
                                <img
                                  src={`data:image/jpeg;base64,${url}`}
                                  alt="quiz test"
                                  className={classes.imageQuiz}
                                />
                              </div>
                            </div>
                          ))}
                        {element["quizChoiceAnswerList"].map((answer, ind) => {
                          return (
                            <div key={ind} style={{ display: "flex" }}>
                              <Checkbox
                                key={answer["choiceAnswerId"]}
                                checked={
                                  stateCheckBox[element["questionId"]]
                                    ? stateCheckBox[element["questionId"]][
                                        answer["choiceAnswerId"]
                                      ]
                                    : false
                                }
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                                onChange={(event) =>
                                  handleChange(event, element["questionId"])
                                }
                                name={answer["choiceAnswerId"]}
                              />
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: answer.choiceAnswerContent,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleClick(element["questionId"]);
                          }}
                        >
                          Lưu
                        </Button>
                      </div>
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <p style={{ justifyContent: "center" }}>
                {" "}
                Chưa có câu hỏi cho mã đề này
              </p>
            )
          ) : (
            <p style={{ justifyContent: "center" }}>
              {" "}
              Chưa phát đề cho sinh viên{" "}
            </p>
          )}
        </Grid>
      </Card>
    </div>
  );
}
