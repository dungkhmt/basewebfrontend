import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Checkbox, Typography, Button, Box } from "@material-ui/core";
import parse from "html-react-parser";

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
  const [state, setState] = React.useState(() => {
    const answers = {};

    quizz.quizChoiceAnswerList.forEach((answer) => {
      answers[answer.choiceAnswerId] = false;
    });

    return answers;
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <Fragment>
      <Box display="flex" alignItems="center">
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
                  checked={state[answer.choiceAnswerId]}
                  onChange={handleChange}
                  name={answer.choiceAnswerId}
                />
              }
              label={parse(answer.choiceAnswerContent)}
            />
          </div>
        ))}
        <Button color="primary" variant="contained" style={{ marginLeft: 32 }}>
          Kiểm tra
        </Button>
      </FormGroup>
    </Fragment>
  );
}
