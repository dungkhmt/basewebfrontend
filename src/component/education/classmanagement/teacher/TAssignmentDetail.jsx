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
import { authPost, axiosGet, axiosPost, request } from "../../../../api";
import axios from "axios";
import { green } from "@material-ui/core/colors";
import { API_URL } from "../../../../config/config";
import parse from "html-react-parser";
import { localization } from "../../../../utils/MaterialTableUtils";
import changePageSize from "../../../../utils/MaterialTableUtils";
import displayTime from "../../../../utils/DateTimeUtils";

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
  assignDetail: {
    display: "flex",
    // whiteSpace: "pre-wrap",
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

function TAssignmentDetail() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  // Countdown.
  const [remainingTime, setRemainingTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState("initial-countdown");

  // Assignment detail.
  const [hideSubject, setHideSubject] = useState(true);
  const [assignDetail, setAssignDetail] = useState({});

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

  const cols = [
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

        return displayTime(date);
      },
    },
  ];

  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const tableRef = useRef(null);
  const [selectedSubmissions, setSelectedSubmission] = useState([]);
  const [isZipping, setIsZipping] = useState(false);

  // Functions.
  const getExerciseDetail = () => {
    request(
      token,
      history,
      "get",
      `/edu/assignment/${params.assignmentId}/teacher`,
      (res) => {
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

        setAssignDetail({
          name: assignmentDetail.name,
          subject: assignmentDetail.subject,
          startTime: startTime,
          endTime: endTime,
          noSubmissions: res.data.noSubmissions,
        });

        setPageSize(changePageSize(data.length, setPageSize));
      }
    );
  };

  const onClickDownloadButton = () => {
    setIsZipping(true);

    let studentIds = selectedSubmissions.map(
      (submission) => submission.studentId
    );

    axiosPost(token, `/edu/assignment/${params.assignmentId}/submissions`, {
      studentIds: studentIds,
    })
      .then((res) => {
        setIsZipping(false);
        window.location.href = `${API_URL}/edu/assignment/${params.assignmentId}/download-file/${res.data}`;
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    // tableRef.current.dataManager.changePageSize(20);
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
              onClick={() =>
                history.push(
                  `/edu/teacher/class/${params.classId}/assignment/${params.assignmentId}/edit`
                )
              }
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
              <Grid container md={12}>
                <Grid item md={3} sm={3} xs={3} direction="column">
                  <Typography>Tên bài tập</Typography>
                  <Typography>Ngày giao</Typography>
                  <Typography>Hạn nộp</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8} direction="column">
                  <div className={classes.assignDetail}>
                    <b>:&nbsp;</b>
                    {assignDetail.name ? (
                      <Typography>{assignDetail.name}</Typography>
                    ) : null}
                  </div>

                  {assignDetail.startTime ? (
                    <div className={classes.assignDetail}>
                      <b>:</b>&nbsp;{displayTime(assignDetail.startTime)}
                    </div>
                  ) : (
                    <b>:</b>
                  )}

                  {assignDetail.endTime ? (
                    <div className={classes.assignDetail}>
                      <b>:</b>&nbsp;{displayTime(assignDetail.endTime)}
                    </div>
                  ) : (
                    <b>
                      <br />:
                    </b>
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
                <Box display="flex" width="100%">
                  <Grid item md={3} sm={3} xs={3}>
                    <Typography>Sinh viên đã nộp bài</Typography>
                  </Grid>
                  <Grid item md={8} sm={8} xs={8}>
                    {assignDetail.noSubmissions === undefined ? (
                      <b>:</b>
                    ) : (
                      <Typography>
                        <b>:</b> {assignDetail.noSubmissions}
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
              {hideSubject ? null : parse(assignDetail.subject)}
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
            columns={cols}
            tableRef={tableRef}
            localization={localization}
            data={data}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "download") {
                  return (
                    <div className={classes.wrapper}>
                      <Button
                        className={classes.downloadBtn}
                        disabled={isZipping}
                        variant="outlined"
                        color="primary"
                        startIcon={isZipping ? null : <FcDownload size={24} />}
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      >
                        {isZipping ? "Đang nén các tệp" : "Tải xuống"}
                      </Button>
                      {isZipping && (
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
              pageSize: pageSize,
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

export default TAssignmentDetail;
