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
import { FcUpload } from "react-icons/fc";
import { DropzoneArea, DropzoneAreaBase } from "material-ui-dropzone";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import DescriptionIcon from "@material-ui/icons/Description";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import TheatersIcon from "@material-ui/icons/Theaters";

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
  submit: {
    paddingLeft: 72,
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

function SExerciseDetail() {
  const classes = useStyles();
  const params = useParams();

  // Countdown.
  const [remainingTime, setRemainingTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState("initial-countdown");

  const [hideExercise, setHideExercise] = useState(true);
  const [exerciseDetail, setExerciseDetail] = useState({});

  // Functions.
  // const handlePreviewIcon = (fileObject, classes) => {
  //   const { type } = fileObject.file;
  //   const iconProps = {
  //     className: classes.image,
  //   };

  //   if (type.startsWith("video/")) return <TheatersIcon {...iconProps} />;
  //   if (type.startsWith("audio/")) return <AudiotrackIcon {...iconProps} />;

  //   switch (type) {
  //     case "application/msword":
  //     case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
  //       return <DescriptionIcon {...iconProps} />;
  //     case "application/pdf":
  //       return <PictureAsPdfIcon {...iconProps} />;
  //     default:
  //       return <AttachFileIcon {...iconProps} />;
  //   }
  // };

  const getExerciseDetail = () => {
    const startTime = new Date("09/14/2020");
    const endTime = new Date("09/20/2020");

    setRemainingTime(
      endTime.getTime() < Date.now()
        ? 0
        : (endTime.getTime() - Date.now()) / 1000
    );
    console.log(
      "Remaining",
      endTime.getTime() < Date.now()
        ? 0
        : (endTime.getTime() - Date.now()) / 1000
    );

    setDuration((endTime.getTime() - startTime.getTime()) / 1000);
    setKey("update-params");

    setExerciseDetail({
      code: params.exerciseCode,
      name: "Lập trình python",
      startTime: startTime,
      endTime: endTime,
      note:
        "Đây là một ghi chú rất dài để thử nghiệm xem ghi chú có hiển thị như mong muốn không, và kết quả như những gì chúng ta đang thấy",
    });
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
                  <Typography>Mã bài tập</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  <Typography>
                    <b>:</b> {params.exerciseCode}
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
                    {exerciseDetail.name === undefined ? null : (
                      <Typography>{exerciseDetail.name}</Typography>
                    )}
                  </div>
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Ngày giao</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  {exerciseDetail.startTime === undefined ? (
                    <b>:</b>
                  ) : (
                    <Typography>
                      <b>:</b>&nbsp;{exerciseDetail.startTime.getFullYear()}-
                      {formatTime(exerciseDetail.startTime.getMonth() + 1)}-
                      {formatTime(exerciseDetail.startTime.getDate())}
                      &nbsp;&nbsp;
                      {formatTime(exerciseDetail.startTime.getHours())}
                      <b>:</b>
                      {formatTime(exerciseDetail.startTime.getMinutes())}
                      <b>:</b>
                      {formatTime(exerciseDetail.startTime.getSeconds())}
                    </Typography>
                  )}
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Hạn nộp</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                  {exerciseDetail.endTime === undefined ? (
                    <b>:</b>
                  ) : (
                    <Typography>
                      <b>:</b>&nbsp;{exerciseDetail.endTime.getFullYear()}-
                      {formatTime(exerciseDetail.endTime.getMonth() + 1)}-
                      {formatTime(exerciseDetail.endTime.getDate())}
                      &nbsp;&nbsp;
                      {formatTime(exerciseDetail.endTime.getHours())}
                      <b>:</b>
                      {formatTime(exerciseDetail.endTime.getMinutes())}
                      <b>:</b>
                      {formatTime(exerciseDetail.endTime.getSeconds())}
                    </Typography>
                  )}
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
      {remainingTime === 0 ? null : (
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar style={{ background: "#e3f2fd" }}>
                <FcUpload size={32} />
              </Avatar>
            }
            title={<Typography variant="h5">Nộp bài</Typography>}
          />
          <CardContent className={classes.submit}>
            <DropzoneArea
              filesLimit={1}
              maxFileSize={10485760}
              showPreviews={true}
              showPreviewsInDropzone={false}
              showFileNamesInPreview={true}
              useChipsForPreview={true}
              // getPreviewIcon={handlePreviewIcon}
              dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
              previewText="Xem trước:"
              previewChipProps={{ variant: "outlined", color: "primary" }}
              getFileAddedMessage={(fileName) =>
                `Tệp ${fileName} tải lên thành công`
              }
              showAlerts={["error", "success"]}
              getFileLimitExceedMessage={(filesLimit) =>
                `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
              }
              getDropRejectMessage={(
                rejectedFile,
                acceptedFiles,
                maxFileSize
              ) => {
                var message = "Tệp ".concat(rejectedFile.name, " bị từ chối. ");

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
              onChange={(files) => console.log("Files:", files)}
            />
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
}

export default SExerciseDetail;
