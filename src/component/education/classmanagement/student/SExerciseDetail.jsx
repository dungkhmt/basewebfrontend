import React, { useRef, useEffect, useState, Fragment } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CardHeader,
  Paper,
  Grid,
  Tooltip,
  Zoom,
  IconButton,
  Box,
  TextField,
  Chip,
  Divider,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { MuiThemeProvider } from "material-ui/styles";
import { useHistory, useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import { Avatar } from "material-ui";
import { BiDetail } from "react-icons/bi";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FcUpload } from "react-icons/fc";
import { DropzoneArea, DropzoneAreaBase } from "material-ui-dropzone";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import DescriptionIcon from "@material-ui/icons/Description";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import TheatersIcon from "@material-ui/icons/Theaters";
import { axiosGet, axiosPost } from "../../../../api";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  divider: {
    width: "91.67%",
    marginTop: 16,
    marginBottom: 16,
  },
  rootDivider: {
    backgroundColor: "black",
  },
  card: {
    marginTop: theme.spacing(2),
    minHeight: window.innerHeight - 133,
  },
  remainingTime: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
    fontSize: 16,
  },
  grid: {
    paddingLeft: 56,
  },
  tooltip: {
    maxWidth: 100,
    textAlign: "center",
  },
  countdown: {
    paddingBottom: "1rem",
  },
  exercise: {
    fontSize: "1rem",
  },
  submit: {
    paddingLeft: 72,
  },
  note: {
    width: "100%",
    marginTop: 16,
    marginBottom: 16,
  },
  cancleBtn: {
    marginTop: 16,
    marginRight: 16,
    textTransform: "none",
  },
  submitBtn: {
    borderRadius: "6px",
    marginTop: 16,
    textTransform: "none",
  },
  editBtn: {
    marginLeft: 16,
    borderRadius: "6px",
    textTransform: "none",
  },
}));

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const children = ({ remainingTime }) => {
  if (remainingTime !== 0) {
    const days = Math.floor(remainingTime / daySeconds);
    const hours = Math.floor((remainingTime % daySeconds) / hourSeconds);
    const minutes = Math.floor((remainingTime % hourSeconds) / minuteSeconds);
    const seconds = remainingTime % minuteSeconds;

    return `${days < 10 ? "0" + days : days} : ${
      hours < 10 ? "0" + hours : hours
    } : ${minutes < 10 ? "0" + minutes : minutes} : ${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  } else {
    return "Hết thời gian";
  }
};

const formatTime = (n) => (Number(n) < 10 ? "0" + Number(n) : "" + Number(n));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function SExerciseDetail() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Countdown.
  const [remainingTime, setRemainingTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState("initial-countdown");

  // Assignment detail.
  const [hideSubject, setHideSubject] = useState(true);
  const [assignmentDetail, setAssignmentDetail] = useState({});

  // Submit and edit submission.
  const [file, setFile] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  // Snackbar.
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;
  const [message, setMessage] = useState("");

  // Functions.
  const getExerciseDetail = () => {
    axiosGet(
      token,
      "/edu/assignment/717729ee-fe55-11ea-8b6c-0862665303f9/student"
    )
      .then((res) => {
        let assignmentDetail = res.data.assignmentDetail;
        let startTime = new Date(assignmentDetail.createdStamp);
        let endTime = new Date(assignmentDetail.deadLine);

        setRemainingTime(
          endTime.getTime() < Date.now()
            ? 0
            : (endTime.getTime() - Date.now()) / 1000
        );

        setDuration((endTime.getTime() - startTime.getTime()) / 1000);

        setKey("update-params");

        setAssignmentDetail({
          name: assignmentDetail.name,
          subject: assignmentDetail.subject,
          startTime: startTime,
          endTime: endTime,
          submitedFileName: res.data.submitedFileName,
        });
      })
      .catch((e) => console.log(e));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setState({ ...state, open: false });
  };

  const onClickCancleBtn = () => {
    setIsUpdating(false);
  };

  const onClickSubmitBtn = () => {
    const data = new FormData();
    data.append("file", file);

    axiosPost(token, `/edu/assignment/${params.assignmentId}/submission`, data)
      .then((res) => {
        setMessage(isUpdating ? "Chỉnh sửa thành công" : "Nộp bài thành công");

        setState({ ...state, open: true });

        setIsUpdating(false);

        setAssignmentDetail({
          ...assignmentDetail,
          submitedFileName: file.name,
        });
      })
      .catch((e) => alert("error"));
  };

  useEffect(() => {
    getExerciseDetail();
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <BiDetail size={32} />
            </Avatar>
          }
          title={<Typography variant="h5">Thông tin bài tập</Typography>}
        />
        <CardContent>
          <Grid container alignItems="flex-start" className={classes.grid}>
            <Grid item md={3} className={classes.countdown}>
              <CountdownCircleTimer
                key={key}
                isLinearGradient={true}
                isPlaying={true}
                size={150}
                strokeWidth={9}
                duration={duration}
                initialRemainingTime={remainingTime}
                children={children}
                colors={[
                  ["#64dd17", 0.5],
                  ["#1565c0", 0.5],
                ]}
              />
            </Grid>
            <Grid item md={9}>
              <Grid container>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Tên bài tập</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <div
                    style={{
                      display: "flex",
                      // whiteSpace: "pre-wrap",
                    }}
                  >
                    <b>:&nbsp;</b>
                    {assignmentDetail.name === undefined ? null : (
                      <Typography>{assignmentDetail.name}</Typography>
                    )}
                  </div>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Ngày giao</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  {assignmentDetail.startTime == undefined ||
                  assignmentDetail.startTime == null ? (
                    <b>:</b>
                  ) : (
                    <Typography>
                      <b>:</b>&nbsp;{assignmentDetail.startTime.getFullYear()}-
                      {formatTime(assignmentDetail.startTime.getMonth() + 1)}-
                      {formatTime(assignmentDetail.startTime.getDate())}
                      &nbsp;&nbsp;
                      {formatTime(assignmentDetail.startTime.getHours())}
                      <b>:</b>
                      {formatTime(assignmentDetail.startTime.getMinutes())}
                      <b>:</b>
                      {formatTime(assignmentDetail.startTime.getSeconds())}
                    </Typography>
                  )}
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Hạn nộp</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  {assignmentDetail.endTime == undefined ||
                  assignmentDetail.endTime == null ? (
                    <b>:</b>
                  ) : (
                    <Typography>
                      <b>:</b>&nbsp;{assignmentDetail.endTime.getFullYear()}-
                      {formatTime(assignmentDetail.endTime.getMonth() + 1)}-
                      {formatTime(assignmentDetail.endTime.getDate())}
                      &nbsp;&nbsp;
                      {formatTime(assignmentDetail.endTime.getHours())}
                      <b>:</b>
                      {formatTime(assignmentDetail.endTime.getMinutes())}
                      <b>:</b>
                      {formatTime(assignmentDetail.endTime.getSeconds())}
                    </Typography>
                  )}
                </Grid>
                {assignmentDetail.submitedFileName != undefined &&
                assignmentDetail.submitedFileName != null ? (
                  <Grid item md={12}>
                    <div className={classes.divider}>
                      <Divider
                        variant="fullWidth"
                        classes={{ root: classes.rootDivider }}
                      />
                    </div>
                    <Box display="flex" alignItems="center" fullWidth>
                      <Grid item md={3} sm={3} xs={3}>
                        <Typography>Tệp đã tải lên</Typography>
                      </Grid>
                      <Grid item md={8} sm={8} xs={8}>
                        <Box display="flex" fullWidth alignItems="center">
                          <Typography>
                            <b>:&nbsp;</b>
                          </Typography>
                          <Chip
                            variant="outlined"
                            clickable
                            color="primary"
                            label={assignmentDetail.submitedFileName}
                          />
                          {remainingTime > 0 && isUpdating == false ? (
                            <Button
                              variant="outlined"
                              className={classes.editBtn}
                              style={{ background: "#2ea44f", color: "white" }}
                              onClick={() => setIsUpdating(true)}
                            >
                              Chỉnh sửa
                            </Button>
                          ) : null}
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid item md={11} className={classes.exercise}>
              <Box display="flex" fullWidth>
                <Button
                  style={{
                    textTransform: "none",
                    fontSize: "bold",
                    color: "blue",
                    marginLeft: 29,
                    paddingBottom: 10,
                  }}
                  onClick={() => setHideSubject(!hideSubject)}
                >
                  {hideSubject ? "Hiện đề bài" : "Ẩn đề bài"}
                </Button>
              </Box>
              {hideSubject ? null : assignmentDetail.subject}
            </Grid>
          </Grid>
        </CardContent>
        {remainingTime > 0 &&
        (assignmentDetail.submitedFileName == null || isUpdating == true) ? (
          <Fragment>
            <CardHeader
              avatar={
                <Avatar style={{ background: "#e3f2fd" }}>
                  <FcUpload size={32} />
                </Avatar>
              }
              title={<Typography variant="h5">Nộp bài tập</Typography>}
            />
            <CardContent className={classes.submit}>
              <DropzoneArea
                filesLimit={1}
                maxFileSize={10485760}
                showPreviews={true}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={true}
                useChipsForPreview={true}
                dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
                previewText="Xem trước:"
                previewChipProps={{ variant: "outlined", color: "primary" }}
                getFileAddedMessage={(fileName) =>
                  `Tệp ${fileName} tải lên thành công`
                }
                showAlerts={["error", "success"]}
                alertSnackbarProps={{
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                }}
                getFileLimitExceedMessage={(filesLimit) =>
                  `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
                }
                getDropRejectMessage={(
                  rejectedFile,
                  acceptedFiles,
                  maxFileSize
                ) => {
                  var message = "Tệp ".concat(
                    rejectedFile.name,
                    " bị từ chối. "
                  );

                  // if (!acceptedFiles.includes(rejectedFile.type)) {
                  //   message += "Định dạng tệp không hỗ trợ. ";
                  //   return message;
                  // }

                  if (rejectedFile.size > maxFileSize) {
                    message +=
                      "Kích thước tệp quá lớn. Kích thước giới hạn là " +
                      maxFileSize / 1048576 +
                      " megabytes. ";
                    return message;
                  }
                }}
                onChange={(files) => setFile(files[0])}
              />
              {isUpdating ? (
                <Button
                  variant="text"
                  color="secondary"
                  className={classes.cancleBtn}
                  onClick={onClickCancleBtn}
                >
                  Huỷ
                </Button>
              ) : null}
              <Button
                variant="outlined"
                style={{ background: "#2ea44f", color: "white" }}
                className={classes.submitBtn}
                onClick={onClickSubmitBtn}
              >
                {isUpdating ? "Cập nhật" : "Nộp bài"}
              </Button>
            </CardContent>
          </Fragment>
        ) : null}
      </Card>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </MuiThemeProvider>
  );
}

export default SExerciseDetail;
