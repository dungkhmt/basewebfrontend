import DateFnsUtils from "@date-io/date-fns";
import {
  Button, Card, CardActions, CardContent, TextField, Typography,
  MenuItem, Checkbox, ListItemText
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { DropzoneArea } from "material-ui-dropzone";
import {
  TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY
} from '../BacklogConfig';
import AlertDialog from '../AlertDialog';

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
  dropZone: {
    //maxWidth: '600px',
    height: '40px',
  }
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
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [openAlert, setOpenAlert] = useState(false);
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
    setCategoryPool(TASK_CATEGORY.LIST);
    setTaskType(TASK_CATEGORY.DEFAULT_CATEGORY);
  }

  function getTaskPriority() {
    setPriorityPool(TASK_PRIORITY.LIST);
    setTaskPriority(TASK_PRIORITY.DEFAULT_PRIORITY);
  }

  function getTaskStatus() {
    setStatusPool(TASK_STATUS.LIST);
    setTaskStatus(TASK_STATUS.DEFAULT_ID_NOT_ASSIGN);
  }

  useEffect(() => {
    getProjectMembers(backlogProjectId);
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();
    initValue();
  }, []);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const handleTaskAssignmentChange = (event) => {
    setTaskAssignment(event.target.value);
    if (event.target.value === '') setTaskStatus(TASK_STATUS.DEFAULT_ID_NOT_ASSIGN);
    else setTaskStatus(TASK_STATUS.DEFAULT_ID_ASSIGNED);
  }

  const handleTaskAssignableChange = (event) => {
    setTaskAssignable(event.target.value);
  }

  async function handleSubmit() {
    if (taskName === '') {
      setOpenAlert(true);
      return;
    }

    let formData = new FormData();
    for (const file of attachmentFiles) {
      formData.append("file", file);
    }

    let addTaskBody = {
      backlogTaskName: taskName,
      categoryId: taskType,
      backlogDescription: taskDescription,
      backlogProjectId: backlogProjectId,
      statusId: taskStatus,
      priorityId: taskPriority,
      fromDate: taskFromDate,
      dueDate: taskDueDate,
      attachmentPaths: attachmentFiles.map(e => e.name)
    };
    console.log(addTaskBody);
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
    let responseMessage = authPostMultiPart(dispatch, token, "/backlog/upload-task-attachment-files/" + task.backlogTaskId, formData);

    history.push("/backlog/project/" + backlogProjectId);
  }

  const handleAttachmentFiles = (files) => {
    setAttachmentFiles(files);
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
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}
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
                  <MenuItem key={item.priorityId} value={item.priorityId}>
                    {item.priorityName}
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
            <br></br>
            <Typography 
              variant='subtitle1'
              display='block'
              style={{margin: '5px 0 0 7px', width: "100%"}}
            >
              File đính kèm
            </Typography>
            <DropzoneArea 
              dropzoneClass={classes.dropZone}
              filesLimit={20}
              showPreviews={true}
              showPreviewsInDropzone={false}
              useChipsForPreview
              dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
              previewText="Xem trước:"
              previewChipProps={
                { variant: "outlined", color: "primary", size: "large", }
              }
              getFileAddedMessage={(fileName) =>
                `Tệp ${fileName} tải lên thành công`
              }
              getFileRemovedMessage={(fileName) =>
                `Tệp ${fileName} đã loại bỏ`
              }
              getFileLimitExceedMessage={(filesLimit) =>
                `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
              }
              alertSnackbarProps={{
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
                autoHideDuration: 1800,
              }}
              onChange={(files) => handleAttachmentFiles(files)}
            >
            </DropzoneArea>
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "40px" }}
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

      <AlertDialog
        open={openAlert}
        onClose={handleCloseAlert}
        severity='warning'
        title={"Vui lòng nhập đầy đủ thông tin cần thiết"}
        content={"Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại."}
        buttons={[
          {
            onClick: handleCloseAlert,
            color: "primary",
            autoFocus: true,
            text: "OK"
          }
        ]}
      />
    </MuiPickersUtilsProvider>
  );
}
