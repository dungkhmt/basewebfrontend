import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet } from "../../../api";
import {
  Grid, Button, Card, Dialog, DialogActions, DialogContent,
  DialogTitle, Slider, Typography, AppBar, Tabs, Tab,
  Toolbar, IconButton, CardContent, Box, MenuItem, Select,
} from "@material-ui/core/";
import { Redirect, useHistory } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import { toFormattedDateTime } from "../../../utils/dateutils";
import { makeStyles } from "@material-ui/core/styles";
import { Bar } from 'react-chartjs-2';
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY, ChartColor } from '../BacklogConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogContent-root": {
      padding: '0px',
      width: '650px',
      height: '700px'
    },
    "& .MuiDialog-paperWidthXs, .MuiDialog-paperWidthMd, .MuiDialog-paperWidthSm, .MuiDialog-paperWidthLg": {
      maxWidth: '100%',
      maxHeight: '100%'
    },
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

  const suggestionChartOpt = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: 'Khối lượng công việc (Ngày)',
            fontSize: 13,
          }
        },
      ],
    },
    legend: {
      display: false
    }
  }

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
      if (task.assignment == null) task.assignment = [];
      task.assignment = task.assignment.map(element => element.userLoginId);
      if (task.assignable == null) task.assignable = [];
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
    setCategoryPool(TASK_CATEGORY.LIST);
  }

  function getTaskPriority() {
    setPriorityPool(TASK_PRIORITY.LIST);
  }

  function getTaskStatus() {
    setStatusPool(TASK_STATUS.LIST);
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
    if (isRowSelected.reduce((a, b) => a + b, 0) === 0) alert("Vui lòng chọn ít nhất một task");
    else
      setSolverParametersDialogOpen(true);
  }

  useEffect(() => {
    getProjectDetail(backlogProjectId);
    getUser();
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();
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
    for (let i = 0; i < taskList.length; i++) {
      if (isRowSelected[i] === true) {
        body.push(taskList[i].backlogTask.backlogTaskId);
      }
    }

    const result = await authPost(dispatch, token, "/backlog/suggest-assignment", body).then(r => r.json());
    let tableResultData = [];
    let labels = [];
    let datasets = [{
      backgroundColor: ChartColor,
      label: 'Khối lượng công việc (Ngày)',
      data: []
    }];
    console.log(taskList);
    result.forEach(assignment => {
      let duration = Math.ceil(Math.abs(new Date(assignment.backlogTask.dueDate) - new Date(assignment.backlogTask.fromDate)) / 86400000);
      let assignable = taskList.find(e => e.backlogTask.backlogTaskId === assignment.backlogTask.backlogTaskId).assignable;

      console.log(assignable);
      tableResultData.push({
        taskId: assignment.backlogTask.backlogTaskId,
        taskName: assignment.backlogTask.backlogTaskName,
        assign: assignment.userSuggestion.userLoginId,
        duration: duration,
        assignable: assignable
      })

      assignable.forEach(e => {
        let index = labels.findIndex(label => e === label);
        if (index < 0) {
          labels.push(e);
          datasets[0].data.push(0);
        }
      });

      let index = labels.findIndex(e => (e === assignment.userSuggestion.userLoginId));
      if (index < 0) {
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

    //TODO show loading when wait solver
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

  const handleChangeAssign = (event, rowIndex) => {
    let data = [...suggestData];
    const taskHasChanged = data[rowIndex];
    const newAssign = event.target.value;

    let newIndex = suggestChartData.labels.findIndex(e => e === newAssign);
    let oldIndex = suggestChartData.labels.findIndex(e => e === taskHasChanged.assign);
    let chartData = [...suggestChartData.datasets[0].data];
    console.log(chartData);

    chartData[oldIndex] = chartData[oldIndex] - taskHasChanged.duration;
    chartData[newIndex] = chartData[newIndex] + taskHasChanged.duration;

    console.log(taskHasChanged, chartData);

    setSuggestChartData({
      ...suggestChartData,
      datasets: [
        { ...suggestChartData.datasets[0], data: chartData }
      ]
    });

    data[rowIndex].assign = event.target.value;
    setSuggestData(data);
  }

  const resultColumns = [
    { title: 'Công việc', field: 'taskName', editable: 'never' },
    {
      title: 'Phân công', field: 'assign',
      render: rowData => {
        return (
          <Select
            value={rowData.assign}
            onChange={(event) => { handleChangeAssign(event, rowData.tableData.id) }}
            style={{ width: '150px' }}
          >
            {rowData.assignable.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        )
      }
    }
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
          { ...suggestChartData.datasets[0], data: chartData }
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
                // fullScreen
                className={classes.root}
                open={solverResultDialogOpen}
                onClose={onCloseResult}
                disableBackdropClick={true}
              >
                <DialogContent>
                  <AppBar position="sticky" color="primary">
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
                      title='Kết quả gợi ý'
                      columns={resultColumns}
                      data={suggestData}
                      options={{ search: false }}
                    // editable={{
                    //   onRowUpdate: updateResultRow
                    // }}
                    />
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    <Bar
                      data={suggestChartData}
                      width={100}
                      height={50}
                      options={suggestionChartOpt}
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