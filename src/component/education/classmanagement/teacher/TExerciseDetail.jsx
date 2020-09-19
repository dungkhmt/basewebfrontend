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
} from "@material-ui/core";
import MaterialTable from "material-table";
import { MuiThemeProvider } from "material-ui/styles";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import { Avatar } from "material-ui";
import { BiDetail } from "react-icons/bi";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FcDownload } from "react-icons/fc";
import EditIcon from "@material-ui/icons/Edit";

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

  const startTime = new Date("09/14/2020"); // use UNIX timestamp in seconds
  const endTime = new Date("09/20/2020"); // use UNIX timestamp in seconds

  const remainingTime =
    endTime.getTime() >= startTime
      ? (endTime.getTime() - Date.now()) / 1000
      : 0;
  const duration = (endTime.getTime() - startTime.getTime()) / 1000;
  const [hideExercise, setHideExercise] = useState(true);

  const [exerciseDetail] = useState({
    code: params.exerciseCode,
    name: "Lập trình python",
    note:
      "Đây là một ghi chú rất dài để thử nghiệm xem ghi chú có hiển thị như mong muốn không, và kết quả như những gì chúng ta đang thấy",
  });

  const studentListCols = [
    {
      field: "id",
      title: "Mã sinh viên",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
      },
    },
    {
      field: "name",
      title: "Họ và tên",
    },
    {
      field: "note",
      title: "Ghi chú",
    },
  ];

  const studentList = [
    {
      id: 20173441,
      name: "Lê Anh Tuấn",
      note: "",
    },
    {
      id: 20172976,
      name: "Lê Văn Cường",
      note: "Đại diện nhóm 1 nộp bài tập lớn",
    },
  ];

  const tableRef = useRef(null);

  // Functions.
  const getExerciseDetail = () => {};

  useEffect(() => {
    tableRef.current.dataManager.changePageSize(20);
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
            <Button variant="outlined" color="primary">
              Chỉnh sửa
            </Button>
          }
          title={<Typography variant="h5">Thông tin bài tập</Typography>}
        />
        <CardContent>
          <Grid container alignItems="flex-start" className={classes.grid}>
            <Grid item md={3} className={classes.countdown}>
              {/* <Tooltip
                title="Thời gian nộp bài còn lại"
                arrow
                interactive
                placement="bottom"
                classes={{ tooltip: classes.tooltip }}
                TransitionComponent={Zoom}
              > 
                <div>*/}
              <CountdownCircleTimer
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
              {/*</div>
               </Tooltip> */}
            </Grid>
            <Grid item md={9}>
              <Grid container>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Mã bài tập</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <Typography>
                    <b>:</b> {exerciseDetail.code}
                  </Typography>
                </Grid>
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
                    <Typography>{exerciseDetail.name}</Typography>
                  </div>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Ngày giao</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <Typography>
                    <b>:</b>&nbsp;{startTime.getFullYear()}-
                    {formatTime(startTime.getMonth() + 1)}-
                    {formatTime(startTime.getDate())}
                    &nbsp;&nbsp;{formatTime(startTime.getHours())}
                    <b>:</b>
                    {formatTime(startTime.getMinutes())}
                    <b>:</b>
                    {formatTime(startTime.getSeconds())}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Hạn nộp</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <Typography>
                    <b>:</b>&nbsp;{endTime.getFullYear()}-
                    {formatTime(endTime.getMonth() + 1)}-
                    {formatTime(endTime.getDate())}
                    &nbsp;&nbsp;{formatTime(endTime.getHours())}
                    <b>:</b>
                    {formatTime(endTime.getMinutes())}
                    <b>:</b>
                    {formatTime(endTime.getSeconds())}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Ghi chú</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <div
                    style={{
                      display: "flex",
                      // whiteSpace: "pre-wrap",
                    }}
                  >
                    <b>:&nbsp;</b>
                    <Typography>{exerciseDetail.note}</Typography>
                  </div>
                </Grid>
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
                  onClick={() => setHideExercise(!hideExercise)}
                >
                  {hideExercise ? "Hiện đề bài" : "Ẩn đề bài"}
                </Button>
              </Box>
              {hideExercise
                ? null
                : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus. Pulvinar elementum integer enim neque volutpat ac.

Senectus et netus et malesuada. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Neque convallis a cras semper auctor. Libero id faucibus nisl tincidunt eget. Leo a diam sollicitudin tempor id. A lacus vestibulum sed arcu non odio euismod lacinia. In tellus integer feugiat scelerisque. Feugiat in fermentum posuere urna nec tincidunt praesent. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus. Et malesuada fames ac turpis egestas sed. Sit amet nisl suscipit adipiscing bibendum est ultricies. Arcu ac tortor dignissim convallis aenean et tortor at. Pretium viverra suspendisse potenti nullam ac tortor vitae purus. Eros donec ac odio tempor orci dapibus ultrices. Elementum nibh tellus molestie nunc. Et magnis dis parturient montes nascetur. Est placerat in egestas erat imperdiet. Consequat interdum varius sit amet mattis vulputate enim.`}
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
            columns={studentListCols}
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
            data={studentList}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "download") {
                  return (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FcDownload size={24} />}
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                    >
                      Tải xuống
                    </Button>
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
                onClick: () => console.log("click"),
              },
            ]}
            onSelectionChange={(rows) => {
              console.log(rows);
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default TExerciseDetail;
