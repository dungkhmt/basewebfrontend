import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardActions,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";
import AlertDialog from "../../common/AlertDialog";

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

function CreateProgrammingContest() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [contestId, setContestId] = useState(null);
  const [contestName, setContestName] = useState(null);
  const [contestType, setContestType] = useState(null);
  const [contestTypeList, setContestTypeList] = useState([]);

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
  async function getContestTypes() {
    let lst = await authGet(dispatch, token, "/get-programming-contest-types");
    setContestTypeList(lst);
    console.log("type list = ", lst);
  }
  async function handleSubmit() {
    console.log("handle submit, contest type = ", contestType);
    let body = {
      contestId: contestId,
      contestName: contestName,
      contestTypeId: contestType,
    };
    //let body = {problemId,problemName,statement};
    let contest = await authPost(
      dispatch,
      token,
      "/create-programming-contest",
      body
    );
    console.log("return contest  ", contest);

    history.push("contestprogramming");
  }

  useEffect(() => {
    getContestTypes();
  }, []);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo Contest
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                autoFocus
                required
                id="problemId"
                label="Mã Contest"
                placeholder="Nhập mã contest"
                value={contestId}
                onChange={(event) => {
                  setContestId(event.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="contestName"
                label="Tên contest"
                placeholder="Nhập tên contest"
                value={contestName}
                onChange={(event) => {
                  setContestName(event.target.value);
                }}
              />
            </div>
            <div>
              <TextField
                required
                id="contestType"
                select
                label="Loại"
                value={contestType}
                onChange={(event) => {
                  setContestType(event.target.value);
                  console.log(contestType, event.target.value);
                }}
              >
                {contestTypeList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
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

export default CreateProgrammingContest;
