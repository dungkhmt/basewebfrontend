import React, { useRef, useEffect, useState } from "react";
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
  Divider,
  CircularProgress,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { MuiThemeProvider } from "material-ui/styles";
import { useHistory, useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import { Avatar } from "material-ui";
import { BiDetail } from "react-icons/bi";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FcDownload } from "react-icons/fc";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch, useSelector } from "react-redux";
import { axiosGet } from "../../../../api";
import axios from "axios";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
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
  editBtn: {
    textTransform: "none",
    // fontWeight: "bold",
    fontSize: "1rem",
    borderRadius: 6,
  },
  divider: {
    width: "91.67%",
    marginTop: 16,
    marginBottom: 16,
  },
  rootDivider: {
    backgroundColor: "black",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  downloadBtn: {
    width: 176,
    borderRadius: 6,
    textTransform: "none",
    // fontWeight: "bold",
    fontSize: "1rem",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
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

function TExerciseDetail() {
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

  // Table.
  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };

  const columns = [
    {
      field: "name",
      title: "Họ và tên",
      ...headerProperties,
    },
    {
      field: "submissionDate",
      title: "Ngày nộp",
      ...headerProperties,
      render: (rowData) => {
        let date = rowData.submissionDate;
        return (
          <Typography>
            {date.getFullYear()}-{formatTime(date.getMonth() + 1)}-
            {formatTime(date.getDate())}
            &nbsp;&nbsp;
            {formatTime(date.getHours())}
            <b>:</b>
            {formatTime(date.getMinutes())}
            <b>:</b>
            {formatTime(date.getSeconds())}
          </Typography>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const [selectedSubmissions, setSelectedSubmission] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Functions.
  const getExerciseDetail = () => {
    axiosGet(dispatch, token, `/edu/assignment/${params.assignmentId}/teacher`)
      .then((res) => {
        let assignmentDetail = res.data.assignmentDetail;
        let startTime = new Date(assignmentDetail.createdStamp);
        let endTime = new Date(assignmentDetail.deadLine);
        let data = res.data.submissions;

        data = data.map((submission) => ({
          ...submission,
          submissionDate: new Date(submission.submissionDate),
        }));

        setData(data);

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
          noSubmissions: res.data.noSubmissions,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onClickDownloadButton = () => {
    setIsDownloading(true);

    let studentIds = selectedSubmissions.map(
      (submission) => submission.studentId
    );

    axios
      .post(
        "http://localhost:8080/api/edu/assignment/717729ee-fe55-11ea-8b6c-0862665303f9/submission/files",
        { studentIds: studentIds },
        {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": token,
          },
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        setIsDownloading(false);
        saveFile(params.assignmentId, res.data);
      })
      .catch((e) => {
        setIsDownloading(false);
        // Thong bao loi
        console.log(e);
      });
  };

  const saveFile = (fileName, data) => {
    let blob = new Blob([data], { type: "application/zip" });

    //IE11 support
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let link = window.document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // other browsers
      // Second approach but cannot specify saved name!
      // let file = new File([data], fileName, { type: "application/zip" });
      // let exportUrl = URL.createObjectURL(file);
      // window.location.assign(exportUrl);
      // URL.revokeObjectURL(exportUrl);
    }
  };

  useEffect(() => {
    tableRef.current.dataManager.changePageSize(20);
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
          action={
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              className={classes.editBtn}
            >
              Chỉnh sửa
            </Button>
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
              </Grid>
              <Grid item md={12}>
                <div className={classes.divider}>
                  <Divider
                    variant="fullWidth"
                    classes={{ root: classes.rootDivider }}
                  />
                </div>
                <Box display="flex" fullWidth>
                  <Grid item md={3} sm={3} xs={3}>
                    <Typography>Sinh viên đã nộp bài</Typography>
                  </Grid>
                  <Grid item md={8} sm={8} xs={8}>
                    {assignmentDetail.noSubmissions === undefined ? (
                      <b>:</b>
                    ) : (
                      <Typography>
                        <b>:</b> {assignmentDetail.noSubmissions}
                      </Typography>
                    )}
                  </Grid>
                </Box>
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
      </Card>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#f9a825" }}>
              <PeopleAltRoundedIcon />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách nộp bài</Typography>}
        />

        <CardContent>
          <MaterialTable
            title=""
            columns={columns}
            tableRef={tableRef}
            localization={{
              body: {
                emptyDataSourceMessage: "",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                searchTooltip: "Tìm kiếm",
              },
              pagination: {
                hover: "pointer",
                labelRowsSelect: "hàng",
                labelDisplayedRows: "{from}-{to} của {count}",
                nextTooltip: "Trang tiếp",
                lastTooltip: "Trang cuối",
                firstTooltip: "Trang đầu",
                previousTooltip: "Trang trước",
              },
            }}
            data={data}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "download") {
                  return (
                    <div className={classes.wrapper}>
                      <Button
                        className={classes.downloadBtn}
                        disabled={isDownloading}
                        variant="outlined"
                        color="primary"
                        startIcon={
                          isDownloading ? null : <FcDownload size={24} />
                        }
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      >
                        {isDownloading ? "Đang chuẩn bị tệp" : "Tải xuống"}
                      </Button>
                      {isDownloading && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  );
                }
              },
            }}
            options={{
              selection: true,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              sorting: false,
              cellStyle: { fontSize: "1rem" },
              toolbarButtonAlignment: "left",
              showTextRowsSelected: false,
            }}
            actions={[
              {
                icon: "download",
                position: "toolbarOnSelect",
                onClick: () => onClickDownloadButton(),
              },
            ]}
            onSelectionChange={(rows) => {
              setSelectedSubmission(rows);
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default TExerciseDetail;
