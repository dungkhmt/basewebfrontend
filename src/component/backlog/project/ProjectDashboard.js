import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { authPost, authGet } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid,
  Paper, ListItem, ListItemIcon, ListItemText, List
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Gantt from '../Gantt';
import "ibm-gantt-chart/dist/ibm-gantt-chart.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 1030,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  doughnutStyle: {
    maxHeight: 500,
    minHeight: 400,
  },
  sectionHeaderStyle: {
    color: '#666'
  },
  ganttChartStyle: {
    height: '600px'
  }
}));

const taskCounterOpt = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "Thống kê task",
    fontSize: 20,
    lineHeight: 1.5
  },
  legend: {
    position: 'bottom',
    align: 'center'
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 10
    }
  }
}

const ganttToolbar = [
  "search",
  "separator",
  "fitToContent",
  "zoomIn",
  "zoomOut",
  "separator",
]

export default function ProjectDashboard(props) {
  const backlogProjectId = props.match.params.backlogProjectId;

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const taskCounterOption = taskCounterOpt;
  const ganttToolbarConfig = ganttToolbar;
  const [taskCounter, setTaskCounter] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [ganttConfig, setGanttConfig] = useState({});
  const [isPermissive, setIsPermissive] = useState(true);
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [projectMember, setProjectMember] = useState([]);

  function checkNull(a, ifNotNull = a, ifNull = '') {
    return a ? ifNotNull : ifNull;
  }

  async function getProjectDetail() {
    authGet(dispatch, token, "/backlog/get-project-by-id/" + backlogProjectId).then(
      res => {
        if (res != null && res.backlogProjectId != null) setProject(res);
        else {
          setIsPermissive(false);
        }
      }
    );
    authGet(dispatch, token, "/backlog/get-project-detail/" + backlogProjectId).then(
      res => {
        setTaskList(res);

        // task counter data
        let [taskOpen, taskInprogress, taskResolved] = [0, 0, 0];
        res.forEach(task => {
          switch (task.backlogTask.statusId) {
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
          datasets: [{
            data: [taskOpen, taskInprogress, taskResolved],
            backgroundColor: [
              '#e91e63',
              '#2196f3',
              '#4caf50',
            ],
            hoverBackgroundColor: [
              '#f50057',
              '#2979ff',
              '#00e676',
            ]
          }],
          labels: [
            'Tạo mới',
            'Đang thực hiện',
            'Đã hoàn thành'
          ]
        };
        setTaskCounter(data);

        // gantt data
        let gantt = [
        ];
        res.forEach(task => {
          gantt.push({
            id: task.backlogTask.backlogTaskId,
            name: task.backlogTask.backlogTaskName,
            activities: [{
              id: task.backlogTask.backlogTaskId,
              name: task.backlogTask.backlogTaskName,
              start: new Date(task.backlogTask.fromDate).getTime(),
              end: new Date(task.backlogTask.dueDate).getTime()
            }]
          })
        });

        setGanttConfig({
          data: {
            resources: {
              data: gantt,
              activities: "activities",
              name: "name",
              id: "id"
            },
            activities: {
              start: "start",
              end: "end",
              name: "name"
            }
          },
          toolbar: ganttToolbarConfig
        });
      }
    );
  }

  function getProjectMember() {
    authGet(dispatch, token, "/backlog/get-members-of-project/" + backlogProjectId).then(
      res => {
        setProjectMember(res);
      }
    );
  }

  useEffect(() => {
    getProjectDetail();
    getProjectMember();
  }, []);

  if (!isPermissive) {
    return (
      <Redirect to={{ pathname: "/", state: { from: history.location } }} />
    )
  } else return (
    <div>
      <Grid container item spacing={2}>
        <Grid xs={12} item>
          <Paper>
            <Box p={1}>
              <Typography component="div" align="center">
                <Box fontWeight="fontWeightBold" fontSize="h6.fontSize" m={1}>Mã dự án: {project.backlogProjectId}</Box>
                <Box fontWeight="fontWeightBold" fontSize="h6.fontSize" m={1}>Tên dự án: {checkNull(project['backlogProjectName'])}</Box>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={8} item container style={{ overflow: 'hidden' }}>
          <Grid xs={12} item container spacing={2}>
            <Grid item xs={12}>
              <Paper>
                <Box className={classes.doughnutStyle}>
                  <Doughnut
                    data={taskCounter}
                    options={taskCounterOption}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} >
              <Paper>
                <Box>
                  <Box p={2}>
                    <Typography component="div" align='center' className={classes.sectionHeaderStyle}>
                      <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                        Biểu đồ Gantt
                      </Box>
                    </Typography>
                  </Box>
                  <Gantt config={ganttConfig} className={classes.ganttChartStyle}/>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={4} item>
          <Paper>
            <Box p={1}>
              <Typography component="div" align='center' className={classes.sectionHeaderStyle}>
                <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                  Danh sách thành viên
                </Box>
              </Typography>
            </Box>
            <List dense={false} disablePadding={true} className={classes.root}>
              {projectMember.map((item, index) => (
                <ListItem>
                  <ListItemIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.userLoginId}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}