//import { Button, Box, Checkbox, Typography } from "@material-ui/core";

import { green } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  List,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
//import { makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import React, { useState } from "react";
import { FcDocument } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import SimpleBar from "simplebar-react";
import { request } from "../../../api";
import CustomizedDialogs from "../../../utils/CustomizedDialogs";

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
  quizStatement: {
    fontSize: "1rem",
    "&>p:first-of-type": {
      display: "inline",
    },
  },
  bikeListDialog: {
    paddingBottom: 0,
    width: 330,
  },
  dialogContent: { paddingBottom: 0 },
  listItem: {
    borderRadius: 4,
    "&:hover": {
      backgroundColor: grey[200],
    },
  },
  btn: {
    textTransform: "none",
  },
}));

/**
 * Customized checkbox.
 */
// const GreenCheckbox = withStyles({
//   root: {
//     color: green[400],
//     "&$checked": {
//       color: green[600],
//     },
//     paddingLeft: 20,
//     paddingTop: 0,
//     paddingBottom: 0,
//   },
//   checked: {},
// })((props) => <Checkbox color="default" disableRipple {...props} />);

/**
 * Describe a multiple-choice quiz.
 * @returns
 */
export default function TeacherViewQuizDetailForAssignment({
  quiz,
  index,
  testId,
  quizGroups,
}) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  //
  // const [result, setResult] = useState({ submited: false, isCorrect: false });
  // const [chkState, setChkState] = useState(() => {
  //   const isChecked = {};

  //   quiz.quizChoiceAnswerList.forEach((ans) => {
  //     isChecked[ans.choiceAnswerId] = false;
  //   });

  //   return isChecked;
  // });

  const [open, setOpen] = useState(false);

  //
  const onOpenDialog = () => {
    setOpen(true);
  };

  const onSelectGroup = (groupId) => {
    handleClose();
    request(
      token,
      history,
      "post",
      "/add-quizgroup-question-assignment",
      (res) => {},
      {},
      { quizGroupId: groupId, questionId: quiz.questionId }
    );
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div className={classes.wrapper}>
      <Box className={classes.quizzStatement}>
        <Typography component="span">{`Câu ${index + 1}.`}&nbsp;</Typography>
        ({quiz.quizCourseTopic.quizCourseTopicName}:
        {quiz.levelId}:{quiz.statusId})&nbsp;&nbsp;
        {parse(quiz.statement)}
      </Box>
      <Button color="primary" onClick={onOpenDialog} className={classes.btn}>
        Thêm vào đề
      </Button>

      { /*<FormGroup row className={classes.answerWrapper}>
        {quiz.quizChoiceAnswerList.map((answer) => (
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
          </FormGroup>*/}
      

      {/* Dialogs */}
      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title="Thêm câu hỏi vào đề"
        content={
          <>
            <Typography color="textSecondary" gutterBottom>
              Chọn một đề trong danh sách dưới đây.
            </Typography>
            <SimpleBar
              style={{
                height: "100%",
                maxHeight: 400,
                width: 330,
                overflowX: "hidden",
                overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
              }}
            >
              <List className={classes.bikeListDialog}>
                {quizGroups
                  ? quizGroups.map((group) => (
                      <ListItem
                        key={group.quizGroupId}
                        button
                        className={classes.listItem}
                        onClick={() => onSelectGroup(group.quizGroupId)}
                      >
                        <ListItemIcon>
                          <FcDocument size={24} />
                        </ListItemIcon>
                        <ListItemText primary={group.groupCode} />
                      </ListItem>
                    ))
                  : null}
              </List>
            </SimpleBar>
          </>
        }
        style={{ content: classes.dialogContent }}
      />
    </div>
  );
}
