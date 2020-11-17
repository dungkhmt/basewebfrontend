import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import { ListItemText } from '@material-ui/core';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet } from "../../api";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: "100%",
    },
  },
}));

export default function CreateTask(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const classes = useStyles();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [taskFromDate, setTaskFromDate] = useState(null);
  const [taskAssignment, setTaskAssignment] = useState('');
  const [taskAssignable, setTaskAssignable] = useState([]);
  const [projectMember, setProjectMember] = useState([]);
  const history = useHistory();

  const backlogProjectId = props.match.params.backlogProjectId;

  const [categoryPool, setCategoryPool] = useState([]);
  const [priorityPool, setPriorityPool] = useState([]);
  const [statusPool, setStatusPool] = useState([]);

  function initValue() {
    let today = new Date();
    setTaskDueDate(today);
    setTaskFromDate(today);
  }

  function getProjectMembers(backlogProjectId) {
    authGet(dispatch, token, "/backlog/get-members-of-project/" + backlogProjectId).then(
      res => {
        if (res != null) {
          setProjectMember(res);
        }
      }
    )
  }

  function getTaskCategory() {
    authGet(dispatch, token, "/backlog/get-backlog-task-category").then(
      res => {
        if (res != null) {
          setCategoryPool(res);
          setTaskType(res[0] === undefined ? '' : res[0].backlogTaskCategoryId);
        }
      }
    )
  }

  function getTaskPriority() {
    authGet(dispatch, token, "/backlog/get-backlog-task-priority").then(
      res => {
        if (res != null) {
          setPriorityPool(res);
          setTaskPriority(res[0] === undefined ? '' : res[0].backlogTaskPriorityId);
        }
      }
    )
  }

  function getTaskStatus() {
    authGet(dispatch, token, "/backlog/get-backlog-task-status").then(
      res => {
        if (res != null) {
          setStatusPool(res);
          setTaskStatus("TASK_OPEN");
        }
      }
    )
  }

  useEffect(() => {
    getProjectMembers(backlogProjectId);
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();
    initValue();
  }, []);

  const handleTaskAssignmentChange = (event) => {
    setTaskAssignment(event.target.value);
    if(event.target.value === '') setTaskStatus("TASK_OPEN");
    else setTaskStatus("TASK_INPROGRESS");
  }

  const handleTaskAssignableChange = (event) => {
    setTaskAssignable(event.target.value);
  }

  async function handleSubmit() {
    if (taskName === '') {
      alert('Nhập chủ đề rồi thử lại');
    }

    let addTaskBody = {
      backlogTaskName: taskName,
      backlogTaskCategoryId: taskType,
      backlogDescription: taskDescription,
      backlogProjectId: backlogProjectId,
      statusId: taskStatus,
      priorityId: taskPriority,
      fromDate: taskFromDate,
      dueDate: taskDueDate,
    };

    let task = await authPost(dispatch, token, '/backlog/add-task', addTaskBody).then(r => r.json());

    let addAssignmentBody = {
      backlogTaskId: task.backlogTaskId,
      assignedToPartyId: [taskAssignment],
      statusId: taskStatus
    };
    authPost(dispatch, token, '/backlog/add-assignments', addAssignmentBody).then(r => r.json());

    let addAssignableBody = {
      backlogTaskId: task.backlogTaskId,
      assignedToPartyId: taskAssignable,
      statusId: taskStatus
    };
    authPost(dispatch, token, '/backlog/add-assignable', addAssignableBody).then(r => r.json());

    history.push("/backlog/project/" + backlogProjectId);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo task mới
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              autoFocus
              required
              id="taskName"
              label="Chủ đề"
              placeholder="Nhập chủ đề"
              value={taskName}
              fullWidth
              onChange={(event) => {
                setTaskName(event.target.value);
              }}
            />
            <TextField
              id="taskDescription"
              label="Mô tả"
              placeholder="Mô tả công việc"
              value={taskDescription}
              multiline={true}
              rows="5"
              fullWidth
              onChange={(event) => {
                setTaskDescription(event.target.value);
              }}
            />

            <div>
              <TextField
                required
                id="taskType"
                select
                label="Loại"
                value={taskType === null || taskType === undefined ? '' : taskType}
                onChange={(event) => {
                  setTaskType(event.target.value);
                }}
              >
                {categoryPool.map((item) => (
                  <MenuItem key={item.backlogTaskCategoryId} value={item.backlogTaskCategoryId}>
                    {item.backlogTaskCategoryName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                id="taskPriority"
                select
                label="Ưu tiên"
                value={taskPriority === null || taskPriority === undefined ? '' : taskPriority}
                onChange={(event) => {
                  setTaskPriority(event.target.value);
                }}
              >
                {priorityPool.map((item) => (
                  <MenuItem key={item.backlogTaskPriorityId} value={item.backlogTaskPriorityId}>
                    {item.backlogTaskPriorityName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="taskStatus"
                select={true}
                label="Trạng thái"
                value={taskStatus === null || taskStatus === undefined ? '' : taskStatus}
                onChange={(event) => {
                  setTaskStatus(event.target.value);
                }}
                disabled
              >
                {statusPool.map((item) => (
                  <MenuItem key={item.statusId} value={item.statusId}>
                    {item.description}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <KeyboardDateTimePicker
                variant="inline"
                format="dd/MM/yyyy HH:mm"
                margin="normal"
                label="Từ ngày: "
                value={taskFromDate}
                className={classes.datePicker}
                onChange={date => {
                  setTaskFromDate(date);
                }}
              />

              <KeyboardDateTimePicker
                variant="inline"
                format="dd/MM/yyyy HH:mm"
                margin="normal"
                label="Đến ngày: "
                value={taskDueDate}
                className={classes.datePicker}
                onChange={date => {
                  setTaskDueDate(date);
                }}
              />
            </div>

            <TextField
              id="taskAssignment"
              select={true}
              disabled={taskAssignable.length > 0}
              SelectProps={{
                multiple: false,
                value: taskAssignment,
                onChange: handleTaskAssignmentChange
              }}
              fullWidth
              label="Người thực hiện"
            >
              <MenuItem key='' value=''>
                &nbsp;
              </MenuItem>
              {projectMember.map((item) => (
                <MenuItem key={item.partyId} value={item.partyId}>
                  {item.userLoginId}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="taskAssignable"
              select={true}
              disabled={taskAssignment !== ''}
              SelectProps={{
                multiple: true,
                value: taskAssignable,
                onChange: handleTaskAssignableChange,
                renderValue: projectMember.length <= 0 ? () => { } : (taskAssignable) =>
                  taskAssignable.map((x) => projectMember.find(member => member.partyId === x).userLoginId).join(", ")
              }}
              fullWidth
              label="Người có thể thực hiện"
            >
              {projectMember.map((item) => (
                <MenuItem key={item.partyId} value={item.partyId}>
                  <Checkbox checked={taskAssignable.includes(item.partyId)} />
                  <ListItemText primary={item.userLoginId} />
                </MenuItem>
              ))}
            </TextField>
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
            onClick={() => history.push("/backlog/project/" + backlogProjectId)}
          >
            Hủy
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  );
}