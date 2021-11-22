import { Box, Checkbox, Typography, Button } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import TestButton from "./TestButton";

import CommentsOnQuiz from "./CommentsOnQuiz";

const useStyles = makeStyles(() => ({
  testBtn: {
    marginLeft: 40,
    marginTop: 32,
  },
  wrapper: {
    padding: "32px 0px",
  },
  answerWrapper: {
    "& label": {
      "&>:nth-child(2)": {
        display: "inline-block",
        "& p": {
          margin: 0,
          textAlign: "justify",
        },
      },
    },
  },
  answer: {
    width: "100%",
    marginTop: 20,
  },
  quizzStatement: {
    fontSize: "1rem",
    "&>p:first-of-type": {
      display: "inline",
    },
  },
  imageContainer: {
    marginTop: "12px",
  },
  imageWrapper: {
    position: "relative",
  },
  imageQuiz: {
    maxWidth: "100%",
  },
}));

/**
 * Customized checkbox.
 */
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
    paddingLeft: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  checked: {},
})((props) => <Checkbox color="default" disableRipple {...props} />);

/**
 * Describe a multiple-choice quizz.
 * @returns
 */
export default function Quizz({ quizz, index, classId }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [result, setResult] = useState({ submited: false, isCorrect: false });
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [numberComments, setNumberComments] = useState(0);
  const [chkState, setChkState] = useState(() => {
    const isChecked = {};

    quizz.quizChoiceAnswerList.forEach((ans) => {
      isChecked[ans.choiceAnswerId] = false;
    });

    return isChecked;
  });

  function getNumberComments() {
    request(
      "get",
      "/get-number-comments-on-quiz/" + quizz.questionId,
      (res) => {
        console.log("getNumberComment, res = ", res);
        setNumberComments(res.data);
      }
    );
  }
  useEffect(() => {
    getNumberComments();
  }, []);
  const handleChange = (event) => {
    setChkState({ ...chkState, [event.target.name]: event.target.checked });
  };

  const onClickTestBtn = () => {
    setResult({ ...result, submited: false });
    const chooseAnsIds = [];

    for (var id in chkState) {
      if (chkState[id] === true) {
        chooseAnsIds.push(id);
      }
    }

    if (chooseAnsIds.length > 0) {
      request(
        // token,
        // history,
        "post",
        "/quiz-choose_answer",
        (res) => {
          setResult({ submited: true, isCorrect: res.data });
        },
        {},
        {
          questionId: quizz.questionId,
          chooseAnsIds: chooseAnsIds,
          classId: classId,
        }
      );
    }
  };

  function handleClickCommentBtn() {
    setOpenCommentBox(true);
  }
  function handleClickHideCommentBtn() {
    setOpenCommentBox(false);
  }

  return (
    <div className={classes.wrapper}>
      <Box className={classes.quizzStatement}>
        <Typography component="span">{`Câu ${index + 1}.`}&nbsp;</Typography>
        {parse(quizz.statement)}
      </Box>
      {quizz.attachment &&
        quizz.attachment.length !== 0 &&
        quizz.attachment.map((url, index) => (
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
      <FormGroup row className={classes.answerWrapper}>
        {quizz.quizChoiceAnswerList.map((answer) => (
          <FormControlLabel
            key={answer.choiceAnswerId}
            className={classes.answer}
            control={
              <GreenCheckbox
                checked={chkState[answer.choiceAnswerId]}
                onChange={handleChange}
                name={answer.choiceAnswerId}
              />
            }
            label={parse(answer.choiceAnswerContent)}
          />
        ))}
        <div className={classes.testBtn}>
          <TestButton
            result={result}
            label="Kiểm tra"
            onClick={onClickTestBtn}
          />
        </div>
      </FormGroup>
      {openCommentBox ? (
        <div>
          <CommentsOnQuiz
            questionId={quizz.questionId}
            open={openCommentBox}
            setOpen={setOpenCommentBox}
          />
        </div>
      ) : (
        ""
      )}

      {!openCommentBox ? (
        <div className={classes.testBtn}>
          <Button variant="outlined" onClick={handleClickCommentBtn}>
            ({numberComments}) Bình luận
          </Button>
        </div>
      ) : (
        ""
      )}
      {openCommentBox ? (
        <div className={classes.testBtn}>
          <Button variant="outlined" onClick={handleClickHideCommentBtn}>
            Ẩn Bình luận
          </Button>
        </div>
      ) : (
        ""
      )}

      {/*
        <CommentsOnQuizPopup
          questionId={quizz.questionId}
          open={openCommentBox}
          setOpen={setOpenCommentBox}
        />
      */}
    </div>
  );
}
