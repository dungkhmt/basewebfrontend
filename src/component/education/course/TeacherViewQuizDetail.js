import { Box, Checkbox, Typography } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
//import { request } from "../../../../api";

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
export default function TeacherViewQuizDetail({ quizz, index }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [result, setResult] = useState({ submited: false, isCorrect: false });
  const [chkState, setChkState] = useState(() => {
    const isChecked = {};

    quizz.quizChoiceAnswerList.forEach((ans) => {
      isChecked[ans.choiceAnswerId] = false;
    });

    return isChecked;
  });

  const handleChange = (event) => {
    setChkState({ ...chkState, [event.target.name]: event.target.checked });
  };

  return (
    <div className={classes.wrapper}>
      <Box className={classes.quizzStatement}>
        <Typography component="span">{`Câu ${index + 1}.`}&nbsp;</Typography>
        {parse(quizz.statement)}
      </Box>
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
      </FormGroup>
    </div>
  );
}
