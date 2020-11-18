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

export default function EditTask(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const classes = useStyles();
  const history = useHistory();

  const [taskDetail, setTaskDetail] = useState({});
  const [taskAssignment, setTaskAssignment] = useState([]);
  const [taskAssignable, setTaskAssignable] = useState([]);
  const [projectMember, setProjectMember] = useState([]);

  const [categoryPool, setCategoryPool] = useState([]);
  const [priorityPool, setPriorityPool] = useState([]);
  const [statusPool, setStatusPool] = useState([]);

  const backlogProjectId = props.match.params.backlogProjectId;
  const backlogTaskId = props.match.params.taskId;

  const setTaskField = (field, value) => {
    let task = { ...taskDetail };
    task[field] = value;
    setTaskDetail(task);
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

  function getTaskDetail(taskId) {
    authGet(dispatch, token, "/backlog/get-task-detail/" + taskId).then(
      res => {
        setTaskDetail(res.backlogTask);
        let assignmentList = [];
        res.assignment.forEach((user) => {
          assignmentList.push(user.partyId);
        });
        setTaskAssignment(assignmentList);
      }
    )
    authGet(dispatch, token, "/backlog/get-assignable-user-by-task-id/" + taskId).then(
      res => {
        setTaskAssignable(res.map(element => element.partyId));
      }
    )
  }

  function getProjectMembers(backlogProjectId) {
    authGet(dispatch, token, "/backlog/get-members-of-project/" + backlogProjectId).then(
      res => {
        if (res != null) setProjectMember(res);
      }
    )
  }

  useEffect(() => {
    async function getTask() {
      await getTaskDetail(backlogTaskId);
      getProjectMembers(backlogProjectId);
      getTaskCategory();
      getTaskPriority();
      getTaskStatus();
    }
    getTask();
  }, []);

  const handleTaskAssignmentChange = (event) => {
    setTaskAssignment(event.target.value);
    if(event.target.value === '') setTaskField("statusId", "TASK_OPEN");
  }

  const handleTaskAssignableChange = (event) => {
    setTaskAssignable(event.target.value);
  }

  async function handleSubmit() {
    if (taskDetail.backlogTaskName === '') {
      alert('Nhập chủ đề rồi thử lại');
    }

    await authPost(dispatch, token, '/backlog/edit-task', taskDetail).then(r => r.json());

    let addAssignmentBody = {
      backlogTaskId: backlogTaskId,
      assignedToPartyId: taskAssignment,
      statusId: taskDetail.statusId
    };
    await authPost(dispatch, token, '/backlog/add-assignments', addAssignmentBody).then(r => r.json());

    let addAssignableBody = {
      backlogTaskId: backlogTaskId,
      assignedToPartyId: taskAssignable,
      statusId: taskDetail.statusId
    };
    authPost(dispatch, token, '/backlog/add-assignable', addAssignableBody).then(r => r.json());

    history.push("/backlog/project/" + backlogProjectId);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Chỉnh sửa task
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              autoFocus
              required
              id="taskName"
              label="Chủ đề"
              placeholder="Nhập chủ đề"
              value={taskDetail.backlogTaskName === null || taskDetail.backlogTaskName === undefined ? '' : taskDetail.backlogTaskName}
              fullWidth
              onChange={(event) => {
                setTaskField("backlogTaskName", event.target.value);
              }}
            />
            <TextField
              id="taskDescription"
              label="Mô tả"
              placeholder="Mô tả công việc"
              value={taskDetail.backlogDescription === null || taskDetail.backlogDescription === undefined ? '' : taskDetail.backlogDescription}
              multiline={true}
              rows="5"
              fullWidth
              onChange={(event) => {
                setTaskField("backlogDescription", event.target.value);
              }}
            />
            <div>
              <TextField
                required
                id="taskType"
                select
                label="Loại"
                value={taskDetail.backlogTaskCategoryId === null || taskDetail.backlogTaskCategoryId === undefined ? '' : taskDetail.backlogTaskCategoryId}
                onChange={(event) => {
                  setTaskField("backlogTaskCategoryId", event.target.value);
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
                value={taskDetail.priorityId === null || taskDetail.priorityId === undefined ? '' : taskDetail.priorityId}
                onChange={(event) => {
                  setTaskField("priorityId", event.target.value);
                }}
              >
                {priorityPool.map((item) => (
                  <MenuItem key={item.backlogTaskPriorityId} value={item.backlogTaskPriorityId}>
                    {item.backlogTaskPriorityName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                id="taskStatus"
                select={true}
                label="Trạng thái"
                value={taskDetail.statusId === null || taskDetail.statusId === undefined ? '' : taskDetail.statusId}
                onChange={(event) => {
                  setTaskField("statusId", event.target.value);
                }}
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
                value={taskDetail.fromDate}
                className={classes.datePicker}
                onChange={date => {
                  setTaskField("fromDate", date);
                }}
              />

              <KeyboardDateTimePicker
                variant="inline"
                format="dd/MM/yyyy HH:mm"
                margin="normal"
                label="Đến ngày: "
                value={taskDetail.dueDate}
                className={classes.datePicker}
                onChange={date => {
                  setTaskField("dueDate", date);
                }}
              />
            </div>

            <TextField
              id="taskAssignment"
              select={true}
              disabled={taskAssignable.length > 0}
              SelectProps={{
                multiple: false,
                value: taskAssignment === null || taskAssignment === undefined ? '' : taskAssignment,
                onChange: handleTaskAssignmentChange
              }}
              fullWidth
              label="Người thực hiện"
            >
              {projectMember.map((item) => (
                <MenuItem key={item.partyId} value={item.partyId} >
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
                value: taskAssignable === null || taskAssignable === undefined ? '' : taskAssignable,
                onChange: handleTaskAssignableChange,
                renderValue: projectMember.length <= 0 ? ()=>{} : (taskAssignable) =>
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
    </MuiPickersUtilsProvider >
  );
}
