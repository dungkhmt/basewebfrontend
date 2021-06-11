import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from "../../common/AlertDialog";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";

import draftToHtml from "draftjs-to-html";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

let reDirect = null;

const editorStyle = {
  toolbar: {
    background: "#90caf9",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

function CreateContestProblem() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [problemId, setProblemId] = useState(null);
  const [problemName, setProblemName] = useState(null);
  const [problemStatement, setProblemStatement] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const [levelIdList, setLevelIdList] = useState([]);
  const [categoryIdList, setCategoryIdList] = useState([]);

  const [alertMessage, setAlertMessage] = useState({
    title: "Vui lòng nhập đầy đủ thông tin cần thiết",
    content:
      "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại.",
  });
  const [alertSeverity, setAlertSeverty] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);
  const history = useHistory();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const onClickAlertBtn = () => {
    setOpenAlert(false);
    if (reDirect != null) {
      history.push(reDirect);
    }
  };
  const onChangeEditorState = (editorState) => {
    setEditorState(editorState);
  };

  async function getContestProblemLevels() {
    let lst = await authGet(dispatch, token, "/get-contest-problem-level-list");
    setLevelIdList(lst);
  }
  async function getContestProblemCategories() {
    let lst = await authGet(
      dispatch,
      token,
      "/get-contest-problem-category-list"
    );
    setCategoryIdList(lst);
  }
  useEffect(() => {
    getContestProblemLevels();
    getContestProblemCategories();
  }, []);
  async function handleSubmit() {
    let statement = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    //setProblemStatement(statement);
    //console.log("handleSubmit problem statement = " + problemStatement);

    let body = {
      problemId: problemId,
      problemName: problemName,
      problemStatement: statement,
      timeLimit: timeLimit,
      levelId: levelId,
      categoryId: categoryId,
    };
    //let body = {problemId,problemName,statement};
    let contestProblem = await authPost(
      dispatch,
      token,
      "/create-contest-problem",
      body
    );
    console.log("return contest problem ", contestProblem);

    history.push("contestprogramming");
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo bài tập
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                autoFocus
                required
                id="problemId"
                label="Mã bài tập"
                placeholder="Nhập mã bài tập"
                value={problemId}
                onChange={(event) => {
                  setProblemId(event.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="problemName"
                label="Tên bài tập"
                placeholder="Nhập tên bài tập"
                value={problemName}
                onChange={(event) => {
                  setProblemName(event.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="timeLimit"
                label="Thời gian tối đa"
                placeholder="Nhập thời gian tối đa"
                value={timeLimit}
                onChange={(event) => {
                  setTimeLimit(event.target.value);
                }}
              />
            </div>

            <div>
              <TextField
                required
                id="levelId"
                select
                label="Mức độ bài"
                value={levelId}
                fullWidth
                onChange={(event) => {
                  setLevelId(event.target.value);
                  //console.log(problemId,event.target.value);
                }}
              >
                {levelIdList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                required
                id="levelId"
                select
                label="Thể loại"
                value={categoryId}
                fullWidth
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  //console.log(problemId,event.target.value);
                }}
              >
                {categoryIdList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <TextField
                required
                id="problemStatement"
                label="Mô tả bài tập"
                placeholder="Mô tả bài tập"
                value={problemStatement}
                onChange={(event) => {
                  setProblemStatement(event.target.value);
                }}
              />
              <Editor
                editorState={editorState}
                handlePastedText={() => false}
                onEditorStateChange={onChangeEditorState}
                toolbarStyle={editorStyle.toolbar}
                editorStyle={editorStyle.editor}
              />
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "45px" }}
            onClick={handleSubmit}
          >
            Lưu
          </Button>
          <Button
            variant="contained"
            onClick={() => history.push("contestprogramming")}
          >
            Hủy
          </Button>
        </CardActions>
      </Card>

      <AlertDialog
        open={openAlert}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        {...alertMessage}
        buttons={[
          {
            onClick: onClickAlertBtn,
            color: "primary",
            autoFocus: true,
            text: "OK",
          },
        ]}
      />
    </MuiPickersUtilsProvider>
  );
}

export default CreateContestProblem;
