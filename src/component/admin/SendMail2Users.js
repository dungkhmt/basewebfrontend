import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authPost } from "../../api";
import AlertDialog from "../common/AlertDialog";

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

function SendMail2Users() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [mailTitle, setMailTitle] = useState(null);
  const [mailContent, setMailContent] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

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

  useEffect(() => {}, []);
  async function handleSubmit() {
    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    //setProblemStatement(statement);
    //console.log("handleSubmit problem statement = " + problemStatement);

    let body = {
      mailTitle: mailTitle,
      mailContent: content,
    };
    //let body = {problemId,problemName,statement};
    let contestProblem = await authPost(
      dispatch,
      token,
      "/send-mail-to-all-users",
      body
    );
    //console.log("return contest problem ", contestProblem);

    //history.push("contestprogramming");
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Gửi mail
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                autoFocus
                required
                id="title"
                label="Tiêu đề"
                placeholder="Tiêu đề"
                value={mailTitle}
                onChange={(event) => {
                  setMailTitle(event.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="mailContent"
                label="Nội dung"
                placeholder="Nội dung"
                value={mailContent}
                onChange={(event) => {
                  setMailContent(event.target.value);
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
            Gửi
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

export default SendMail2Users;
