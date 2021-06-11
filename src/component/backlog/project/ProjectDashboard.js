import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { authPost, authGet } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Paper,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Gantt from "../Gantt";
import "ibm-gantt-chart/dist/ibm-gantt-chart.css";
import randomColor from "randomcolor";

const avtColor = [...Array(20)].map((value, index) =>
  randomColor({ luminosity: "light", hue: "random" })
);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 1030,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  doughnutStyle: {
    maxHeight: 500,
    minHeight: 400,
  },
  sectionHeaderStyle: {
    color: "#666",
  },
  ganttChartStyle: {
    height: "600px",
  },
  avatar: {
    width: 36,
    height: 36,
  },
}));

const getFullName = (user) => {
  return user.person
    ? user.person.firstName +
        " " +
        user.person.middleName +
        " " +
        user.person.lastName
    : "";
};

const taskCounterOpt = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "Thống kê task",
    fontSize: 20,
    lineHeight: 1.5,
  },
  legend: {
    position: "bottom",
    align: "center",
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 10,
    },
  },
  plugins: {
    datalabels: {
      display: function (context) {
        return context.dataset.data[context.dataIndex] !== 0;
      },
    },
  },
};

const ganttToolbar = [
  "search",
  "separator",
  "fitToContent",
  "zoomIn",
  "zoomOut",
  "separator",
];

export default function ProjectDashboard(props) {
  const backlogProjectId = props.match.params.backlogProjectId;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const taskCounterOption = taskCounterOpt;
  const ganttToolbarConfig = ganttToolbar;
  const [taskCounter, setTaskCounter] = useState([]);
  const [ganttConfig, setGanttConfig] = useState({});
  const [isPermissive, setIsPermissive] = useState(true);
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [projectMember, setProjectMember] = useState([]);

  function checkNull(a, ifNotNull = a, ifNull = "") {
    return a ? ifNotNull : ifNull;
  }

  async function getProjectDetail() {
    authGet(
      dispatch,
      token,
      "/backlog/get-project-by-id/" + backlogProjectId
    ).then((res) => {
      if (res != null && res.backlogProjectId != null) setProject(res);
      else {
        setIsPermissive(false);
      }
    });
    authGet(
      dispatch,
      token,
      "/backlog/get-project-detail/" + backlogProjectId
    ).then((res) => {
      // setTaskList(res);

      // task counter data
      let [taskOpen, taskInprogress, taskResolved] = [0, 0, 0];
      res.forEach((task) => {
        switch (task.statusId) {
          case "TASK_OPEN":
            taskOpen++;
            break;
          case "TASK_INPROGRESS":
            taskInprogress++;
            break;
          case "TASK_RESOLVED":
            taskResolved++;
            break;
          case "TASK_CLOSED":
            taskResolved++;
            break;
          default:
        }
      });

      const data = {
        datasets: [
          {
            data: [taskOpen, taskInprogress, taskResolved],
            backgroundColor: ["#e91e63", "#2196f3", "#4caf50"],
            hoverBackgroundColor: ["#f50057", "#2979ff", "#00e676"],
          },
        ],
        labels: ["Tạo mới", "Đang thực hiện", "Đã hoàn thành"],
      };
      setTaskCounter(data);

      // gantt data
      let gantt = [];
      res.forEach((task) => {
        const t = task;
        gantt.push({
          id: t.backlogTaskId,
          name: t.backlogTaskName,
          activities: [
            {
              id: t.backlogTaskId,
              name: t.backlogTaskName,
              start: new Date(t.fromDate).getTime(),
              end: new Date(t.dueDate).getTime(),
            },
          ],
        });
      });

      setGanttConfig({
        data: {
          resources: {
            data: gantt,
            activities: "activities",
            name: "name",
            id: "id",
          },
          activities: {
            start: "start",
            end: "end",
            name: "name",
          },
        },
        toolbar: ganttToolbarConfig,
      });
    });
  }

  function getProjectMember() {
    authGet(
      dispatch,
      token,
      "/backlog/get-members-of-project/" + backlogProjectId
    ).then((res) => {
      setProjectMember(res);
    });
  }

  useEffect(() => {
    getProjectDetail();
    getProjectMember();
  }, []);

  if (!isPermissive) {
    return (
      <Redirect to={{ pathname: "/", state: { from: history.location } }} />
    );
  } else
    return (
      <div>
        <Grid container item spacing={2}>
          <Grid xs={12} item>
            <Paper>
              <Box p={1}>
                <Typography component="div" align="center">
                  <Box fontWeight="fontWeightBold" fontSize="h6.fontSize" m={1}>
                    Mã dự án: {project.backlogProjectCode}
                  </Box>
                  <Box fontWeight="fontWeightBold" fontSize="h6.fontSize" m={1}>
                    Tên dự án: {checkNull(project["backlogProjectName"])}
                  </Box>
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid xs={9} item container style={{ overflow: "hidden" }}>
            <Grid xs={12} item container spacing={2}>
              <Grid item xs={12}>
                <Paper>
                  <Box className={classes.doughnutStyle}>
                    <Doughnut data={taskCounter} options={taskCounterOption} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Box>
                    <Box p={2}>
                      <Typography
                        component="div"
                        align="center"
                        className={classes.sectionHeaderStyle}
                      >
                        <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                          Biểu đồ Gantt
                        </Box>
                      </Typography>
                    </Box>
                    <Gantt
                      config={ganttConfig}
                      className={classes.ganttChartStyle}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={3} item>
            <Paper>
              <Box p={1}>
                <Typography
                  component="div"
                  align="center"
                  className={classes.sectionHeaderStyle}
                >
                  <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                    Danh sách thành viên
                  </Box>
                </Typography>
              </Box>
              <List
                dense={false}
                disablePadding={true}
                className={classes.root}
              >
                {projectMember.map((item, index) => (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        className={classes.avatar}
                        style={{
                          background: avtColor[index % avtColor.length],
                        }}
                      >
                        {item.person &&
                        item.person.lastName &&
                        item.person.lastName !== ""
                          ? item.person.lastName.substring(0, 1)
                          : ""}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getFullName(item)}
                      secondary={item.userLoginId}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
}
