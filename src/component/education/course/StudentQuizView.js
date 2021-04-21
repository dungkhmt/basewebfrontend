import React, { Fragment, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Checkbox, Typography, Button, Box } from "@material-ui/core";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../api";

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function StudentQuizView({ quizz, index }) {
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

  const onClickTestBtn = () => {
    setResult({ ...result, submited: false });
    const chooseAnsIds = [];

    for (var id in chkState) {
      if (chkState[id] === true) {
        chooseAnsIds.push(id);
      }
    }

    request(
      token,
      history,
      "post",
      "/quiz-choose_answer",
      (res) => {
        setResult({ submited: true, isCorrect: res.data });
      },
      {},
      { questionId: quizz.questionId, chooseAnsIds: chooseAnsIds }
    );
  };

  return (
    <Fragment>
      <Box
        display="flex"
        alignItems="center"
        style={{
          fontSize: "1rem",
          backgroundColor: result.submited
            ? result.isCorrect
              ? "green"
              : "red"
            : "white",
        }}
      >
        <Typography>{`Câu ${index}.`}&nbsp;</Typography>
        {parse(quizz.statement)}
      </Box>
      <FormGroup row>
        {quizz.quizChoiceAnswerList.map((answer) => (
          <div
            key={answer.choiceAnswerId}
            style={{ width: "100%", paddingLeft: 32 }}
          >
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={chkState[answer.choiceAnswerId]}
                  onChange={handleChange}
                  name={answer.choiceAnswerId}
                />
              }
              label={parse(answer.choiceAnswerContent)}
            />
          </div>
        ))}
        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: 32 }}
          onClick={onClickTestBtn}
        >
          Kiểm tra
        </Button>
      </FormGroup>
    </Fragment>
  );
}
