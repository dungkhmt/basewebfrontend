import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet } from "../../api";
import {
  Grid, Button, Card, Dialog, DialogActions, DialogContent,
  DialogTitle, Slider, Typography, AppBar, Tabs, Tab,
  Toolbar, IconButton, CardContent, Box
} from "@material-ui/core/";
import { Redirect, useHistory } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import { toFormattedDateTime } from "../../utils/dateutils";
import { makeStyles } from "@material-ui/core/styles";
import { Bar } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogContent-root": {
      padding: '0px'
    }
  },
  dialogPaper: {
    minHeight: '50vh',
    maxHeight: '70vh',
    minWidth: '20vw',
  },
  functionBtn: {
    margin: "0 0 2px 2px"
  },
  table: {
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    overflow: "hidden",
    wordWrap: 'break-word'
  },
  grid: {
    verticalAlign: 'text-bottom',
    textAlign: 'right',
    padding: '0px 50px 10px 30px'
  }
}));

export default function AssignSuggestionTaskList(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [projectMember, setProjectMember] = useState([]);
  const [solverParametersDialogOpen, setSolverParametersDialogOpen] = useState(false);
  const [solverResultDialogOpen, setSolverResultDialogOpen] = useState(false);
  const [isPermissive, setIsPermissive] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [isMember, setIsMember] = useState({});
  const [tab, setTab] = useState(0);
  const [suggestData, setSuggestData] = useState([]);
  const [suggestChartData, setSuggestChartData] = useState({});
  const [isRowSelected, setIsRowSelected] = useState([]);

  const [categoryPool, setCategoryPool] = useState([]);
  const [priorityPool, setPriorityPool] = useState([]);
  const [statusPool, setStatusPool] = useState([]);

  const backlogProjectId = props.match.params.backlogProjectId;

  function checkNull(a, ifNotNull = a, ifNull = '') {
    return a ? ifNotNull : ifNull;
  }

  async function getProjectDetail(projectId) {
    authGet(dispatch, token, "/backlog/get-project-by-id/" + projectId).then(
      res => {
        if (res != null && res.backlogProjectId != null) setProject(res);
        else {
          setIsPermissive(false);
        }
      }
    );
    let tasks = await authGet(dispatch, token, "/backlog/get-project-detail/" + projectId);
    let openingTasks = tasks.filter(element => element.backlogTask.statusId === "TASK_OPEN");
    openingTasks.forEach(task => {
      if(task.assignment == null) task.assignment = [];
      task.assignment = task.assignment.map(element => element.userLoginId);
      if(task.assignable == null) task.assignable = [];
      task.assignable = task.assignable.map(element => element.userLoginId);
    });
    setTaskList(openingTasks);
  }

  async function getUser() {
    let users = await authGet(dispatch, token, "/backlog/get-all-user");
    let members = await authGet(dispatch, token, "/backlog/get-members-of-project/" + backlogProjectId);
    setAllUser(users);
    setProjectMember(members);

    let check = {};
    if (users != null) {
      users.forEach(user => {
        if (members.find(member => member.userLoginId === user.userLoginId) == null)
          check[user.userLoginId] = false;
        // else check[user.userLoginId] = false;
      })
    }
    setIsMember(check);
  }

  function getTaskCategory() {
    authGet(dispatch, token, "/backlog/get-backlog-task-category").then(
      res => {
        if (res != null) setCategoryPool(res);
      }
    )
  }

  function getTaskPriority() {
    authGet(dispatch, token, "/backlog/get-backlog-task-priority").then(
      res => {
        if (res != null) setPriorityPool(res);
      }
    )
  }

  function getTaskStatus() {
    authGet(dispatch, token, "/backlog/get-backlog-task-status").then(
      res => {
        if (res != null) setStatusPool(res);
      }
    )
  }

  function handleOnSelectionChange(rows) {
    let isSelected = [];
    for (let i = 0; i < taskList.length; i++) {
      isSelected[i] = false;
    }
    rows.forEach(row => {
      isSelected[row.tableData.id] = true;
    });

    setIsRowSelected(isSelected);
  }

  function onClickGetSuggestion() {
    if(isRowSelected.reduce((a, b) => a + b, 0) === 0) alert("Vui lòng chọn ít nhất một task");
    else
      setSolverParametersDialogOpen(true);
  }

  useEffect(() => {
    getProjectDetail(backlogProjectId);
    getUser();
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();

    setSuggestData([
      { taskName: '1', assign: '1', duration: 1 },
      { taskName: '2', assign: '2', duration: 3 },
      { taskName: '3', assign: '3', duration: 2 },
      { taskName: '4', assign: '1', duration: 3 },
    ]);

    setSuggestChartData({
      labels: ['1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'],
      datasets: [{
        label: 'Khối lượng công việc',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [4, 3, 2, 2,3,4,2,1,3,4, 3, 2, 2,3,4,2,1,3]
      }]
    })
  }, []);

  const taskListColumn = [
    { title: "ID", field: "backlogTask.backlogTaskId" },
    { title: "Chủ đề", field: "backlogTask.backlogTaskName" },
    {
      title: "Loại", field: "backlogTask.backlogTaskCategoryId",
      render: rowData => {
        return categoryPool.filter(x => {
          return x.backlogTaskCategoryId === rowData.backlogTask.backlogTaskCategoryId
        }).map(y => {
          return y.backlogTaskCategoryName;
        })
      }
    },
    {
      title: "Trạng thái", field: "backlogTask.statusId",
      render: rowData => {
        return statusPool.filter(x => {
          return x.statusId === rowData.backlogTask.statusId
        }).map(y => {
          return y.description;
        })
      }
    },
    {
      title: "Độ ưu tiên", field: "backlogTask.priorityId",
      render: rowData => {
        return priorityPool.filter(x => {
          return x.backlogTaskPriorityId === rowData.backlogTask.priorityId
        }).map(y => {
          return y.backlogTaskPriorityName;
        })
      }
    },
    {
      title: "Có thể phân công", field: "assignable",
      render: rowData => {
        return rowData['assignable'].toString();
      }
    },
    {
      title: "Ngày bắt đầu", field: "backlogTask.fromDate",
      render: rowData => toFormattedDateTime(rowData.backlogTask['fromDate'])
    },
    {
      title: "Hạn cuối", field: "backlogTask.dueDate",
      render: rowData => toFormattedDateTime(rowData.backlogTask['dueDate'])
    },
    { title: "Người tạo", field: "backlogTask.createdByUserLoginId" }
  ];

  function TabPanel(props) {
    const { children, value, index } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (<Box p={3}>{children}</Box>)}
      </div>
    );
  }


  // solver parameters
  const solverParametersTimeMarks = [];
  const timeBegin = 10, timeEnd = 100, timeStep = 10;
  solverParametersTimeMarks.push({
    value: timeBegin,
    label: timeBegin + "s"
  });
  for (let i = 0; i < timeEnd; i += 50) {
    if (i < timeBegin) continue;
    let element = {
      value: i,
      label: i + "s"
    };
    solverParametersTimeMarks.push(element);
  }
  solverParametersTimeMarks.push({
    value: timeEnd,
    label: timeEnd + "s"
  });

  function runTimeValuetext(value) {
    return `${value}s`
  }

  async function saveSolverParameters() {
    setSolverParametersDialogOpen(false);

    let body = [];
    console.log(isRowSelected);
    for (let i = 0; i < taskList.length; i++) {
      if (isRowSelected[i] === true) {
        body.push(taskList[i].backlogTask.backlogTaskId);
      }
    }

    const result = await authPost(dispatch, token, "/backlog/suggest-assignment", body).then(r => r.json());
    console.log(result);
    let tableResultData = [];
    let labels = [];
    let datasets = [{
      label: 'Khối lượng công việc',
      data: []
    }];
    result.forEach(assignment => {
      let duration = Math.ceil(Math.abs(assignment.backlogTask.dueDate - assignment.backlogTask.fromDate)/86400000);
      let assignable = taskList.find(e => e.backlogTask.backlogTaskId === assignment.backlogTask.backlogTaskId).assignable;
      const matchingKeyValuePairs = assignable.map(x => [x, x]);

      tableResultData.push({
        taskId: assignment.backlogTask.backlogTaskId,
        taskName: assignment.backlogTask.backlogTaskName,
        assign: assignment.userSuggestion.userLoginId,
        duration: duration,
        assignable: Object.fromEntries(matchingKeyValuePairs)
      })

      let index = labels.findIndex(e => (e === assignment.userSuggestion.userLoginId));
      if(index < 0) {
        labels.push(assignment.userSuggestion.userLoginId);
        datasets[0].data.push(duration);
      } else {
        datasets[0].data[index] += duration;
      }
    });

    setSuggestData(tableResultData);
    setSuggestChartData({
      labels: labels,
      datasets: datasets
    })
    console.log(tableResultData);

    //TODO loading when wait solver
    setSolverResultDialogOpen(true);
  }

  const onCloseSolverParametersDialog = (event) => {
    setSolverParametersDialogOpen(false);
  }

  const onCloseResult = (event) => {
    setSolverResultDialogOpen(false);
  }

  const onChangeTab = (event, newTab) => {
    setTab(newTab);
  }

  const resultColumns = [
    { title: 'Công việc', field: 'taskName', editable: 'never' },
    { title: 'Phân công', field: 'assign', lookup: rowData => rowData.assignable }
  ];

  const updateResultRow = (newData, oldData) =>
    new Promise((resolve, reject) => {
      const dataUpdate = [...suggestData];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setSuggestData([...dataUpdate]);

      let newIndex = suggestChartData.labels.findIndex(e => e === newData.assign);
      let oldIndex = suggestChartData.labels.findIndex(e => e === oldData.assign);

      let chartData = [...suggestChartData.datasets[0].data];
      chartData[oldIndex] = suggestChartData.datasets[0].data[oldIndex] - oldData.duration;
      chartData[newIndex] = suggestChartData.datasets[0].data[newIndex] + newData.duration;

      setSuggestChartData({
        ...suggestChartData, 
        datasets: [
          {...suggestChartData.datasets[0], data: chartData}
        ]
      });

      resolve();
    })


  // return
  if (!isPermissive) {
    return (
      <Redirect to={{ pathname: "/", state: { from: history.location } }} />
    )
  } else
    return (
      <div>
        <Card>
          <CardContent>
            <div>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <div>
                    <div style={{ padding: '0px 30px' }}>
                      <b>Mã dự án: </b> {project.backlogProjectId} <p />
                      <b>Tên dự án: </b> {checkNull(project['backlogProjectName'])} <p />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={4}
                  className={classes.grid}>
                  <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={() => history.push("/backlog/add-task/" + project.backlogProjectId)}>
                    Thêm task
                  </Button>
                  <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={() => history.push("/backlog/assign-suggestion/project-list")}>
                    Danh sách dự án
                  </Button>
                </Grid>
              </Grid>
            </div>
            <MaterialTable
              className={classes.table}
              title="Danh sách task"
              columns={taskListColumn}
              options={{
                filtering: true,
                search: false,
                selection: true,
                rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' })
              }}
              onSelectionChange={(rows) => { handleOnSelectionChange(rows) }}
              data={taskList}
            />
            <p></p>
            <div>
              <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={onClickGetSuggestion}>
                Đề xuất gợi ý
              </Button>

              {/* solver parameters */}
              <Dialog
                open={solverParametersDialogOpen}
                onClose={onCloseSolverParametersDialog}
                aria-labelledby="solver-parameters-dialog"
              >
                <DialogTitle id="form-dialog-title">
                  Điều chỉnh tham số
                </DialogTitle>
                <DialogContent>
                  <Typography gutterBottom>
                    Thời gian chạy tối đa
                  </Typography>
                  <Slider style={{ margin: '20px 0 20px 0' }}
                    defaultValue={solverParametersTimeMarks[0].value}
                    getAriaValueText={runTimeValuetext}
                    min={timeBegin}
                    max={timeEnd}
                    step={timeStep}
                    valueLabelDisplay="auto"
                    marks={solverParametersTimeMarks}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={saveSolverParameters} color="primary">
                    OK
                  </Button>
                  <Button onClick={onCloseSolverParametersDialog} color="primary">
                    Hủy
                  </Button>
                </DialogActions>
              </Dialog>

              {/* solver result  */}
              <Dialog
                fullScreen
                open={solverResultDialogOpen}
                onClose={onCloseResult}
              >
                <DialogContent>
                  <AppBar position="relative" color="primary">
                    <Toolbar>
                      <IconButton edge="start" color="inherit" onClick={onCloseResult} aria-label="close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" style={{ flex: 1 }}>
                        Bảng gợi ý phân công
                      </Typography>
                      <Button variant="contained" color="secondary" onClick={{}}>
                        Phê duyệt
                      </Button>
                    </Toolbar>
                    <Tabs value={tab} onChange={onChangeTab}
                      style={{ backgroundColor: '#757ce8' }}
                    >
                      <Tab label="Bảng kết quả" />
                      <Tab label="Biểu đồ" />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={tab} index={0}>
                    <MaterialTable
                      title="Editable Preview"
                      columns={resultColumns}
                      data={suggestData}
                      editable={{
                        onRowUpdate: updateResultRow
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    <Bar
                      data={suggestChartData}
                      width={100}
                      height={50}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                              },
                            },
                          ],
                        },
                      }}
                    />
                  </TabPanel>
                </DialogContent>
              </Dialog>

            </div>
          </CardContent>
        </Card>
      </div>
    );
}