import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  TextField,
  Box,
  Chip,
  Typography,
  MenuItem,
  ListItemText,
  CardActions,
} from "@material-ui/core";

import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { DropzoneArea } from "material-ui-dropzone";
import AlertDialog from "../AlertDialog";
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY } from "../BacklogConfig";
import randomColor from "randomcolor";
import UserItem from "../components/UserItem";

const avtColor = [...Array(20)].map((value, index) =>
  randomColor({ luminosity: "light", hue: "random" })
);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: "100%",
    },
  },
}));

function checkEmpty(a) {
  return (
    a === undefined ||
    a === null ||
    a === "" ||
    (Array.isArray(a) && a.length === 0)
  );
}

export default function EditTask(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const history = useHistory();

  const [taskDetail, setTaskDetail] = useState({});
  const [taskAssignment, setTaskAssignment] = useState("");
  const [taskAssignable, setTaskAssignable] = useState([]);
  const [projectMember, setProjectMember] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [handleDropzoneFiles, setHandleDropzoneFiles] = useState([]);
  const [attachmentStatus, setAttachmentStatus] = useState([]);
  const [isPermissive, setIsPermissive] = useState(true);

  const [categoryPool, setCategoryPool] = useState([]);
  const [priorityPool, setPriorityPool] = useState([]);
  const [statusPool, setStatusPool] = useState([]);

  const [openAlert, setOpenAlert] = useState(false);

  const backlogProjectId = props.match.params.backlogProjectId;
  const backlogTaskId = props.match.params.taskId;

  const setTaskField = (field, value) => {
    let task = { ...taskDetail };
    task[field] = value;
    setTaskDetail(task);
  };

  function getTaskCategory() {
    setCategoryPool(TASK_CATEGORY.LIST);
  }

  function getTaskPriority() {
    setPriorityPool(TASK_PRIORITY.LIST);
  }

  function getTaskStatus() {
    setStatusPool(TASK_STATUS.LIST);
  }

  async function getTaskDetail(taskId) {
    let myAccount = await authGet(dispatch, token, "/my-account");
    authGet(dispatch, token, "/backlog/get-task-detail/" + taskId).then(
      (res) => {
        setTaskDetail(res.backlogTask);
        let assignmentList = res.assignment.map((e) => e.partyId);
        let assignableList = res.assignable.map((e) => e.partyId);

        setTaskAssignable(assignableList);
        setTaskAssignment(assignmentList);

        if (
          res.backlogTask.attachmentPaths != null &&
          res.backlogTask.attachmentPaths !== undefined &&
          res.backlogTask.attachmentPaths.length > 0
        )
          res.backlogTask.attachmentPaths =
            res.backlogTask.attachmentPaths.split(";");
        else res.backlogTask.attachmentPaths = [];

        let attachment = res.backlogTask.attachmentPaths.map((e) => {
          return new File([""], e, { type: "text/plain" });
        });
        let status = res.backlogTask.attachmentPaths.map((e) => {
          return "uploaded";
        });

        setAttachmentStatus(status);
        setAttachmentFiles(attachment);
        setIsPermissive(
          myAccount.user === res.backlogTask.createdByUserLoginId
        );
      }
    );
  }

  function getProjectMembers(backlogProjectId) {
    authGet(
      dispatch,
      token,
      "/backlog/get-members-of-project/" + backlogProjectId
    ).then((res) => {
      if (res != null) setProjectMember(res);
    });
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

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleTaskAssignmentChange = (event) => {
    setTaskAssignment(event.target.value);
    if (event.target.value === "")
      setTaskField("statusId", TASK_STATUS.DEFAULT_ID_NOT_ASSIGN);
  };

  const handleTaskAssignableChange = (event) => {
    setTaskAssignable(event.target.value);
  };

  const handleDeleteAttachment = (fileName) => {
    let status = [...attachmentStatus];
    attachmentFiles.forEach((file, index) => {
      if (file.name === fileName) {
        status[index] = "deleted";
        return;
      }
    });
    setAttachmentStatus(status);
  };

  const handleAddFile = (files) => {
    const attachmentFilesCopy = [...attachmentFiles];
    const status = [...attachmentStatus];
    for (let i = handleDropzoneFiles.length; i < files.length; i++) {
      attachmentFilesCopy.push(files[i]);
      status.push("new");
    }

    setHandleDropzoneFiles(files);
    setAttachmentStatus(status);
    setAttachmentFiles(attachmentFilesCopy);
  };

  const displayFileName = (fileName, status) => {
    if (status === "uploaded")
      return fileName.substring(fileName.indexOf("-") + 1);
    else return fileName;
  };

  async function handleSubmit() {
    if (taskDetail.backlogTaskName === "") {
      setOpenAlert(true);
      return;
    }

    let taskInput = {
      ...taskDetail,
      ...{
        attachmentPaths: attachmentFiles.map((e) => e.name),
        attachmentStatus: attachmentStatus,
      },
    };

    let assignmentInput = {
      backlogTaskId: backlogTaskId,
      assignedToPartyId: checkEmpty(taskAssignment)
        ? []
        : Array.isArray(taskAssignment)
        ? taskAssignment
        : [taskAssignment],
      statusId: taskDetail.statusId,
    };

    let assignableInput = {
      backlogTaskId: backlogTaskId,
      assignedToPartyId: taskAssignable,
    };

    let body = {
      taskInput: taskInput,
      assignmentInput: assignmentInput,
      assignableInput: assignableInput,
    };

    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    const newFiles = attachmentFiles.filter(
      (file, index) => attachmentStatus[index] === "new"
    );
    for (const file of newFiles) {
      formData.append("files", file);
    }
    console.log(JSON.stringify(body));
    authPostMultiPart(dispatch, token, "/backlog/edit-task", formData);

    history.push("/backlog/project/" + backlogProjectId);
  }

  if (!isPermissive) {
    return (
      <Redirect to={{ pathname: "/", state: { from: history.location } }} />
    );
  } else
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
                value={
                  taskDetail.backlogTaskName === null ||
                  taskDetail.backlogTaskName === undefined
                    ? ""
                    : taskDetail.backlogTaskName
                }
                fullWidth
                onChange={(event) => {
                  setTaskField("backlogTaskName", event.target.value);
                }}
              />
              <TextField
                id="taskDescription"
                label="Mô tả"
                placeholder="Mô tả công việc"
                value={
                  taskDetail.backlogDescription === null ||
                  taskDetail.backlogDescription === undefined
                    ? ""
                    : taskDetail.backlogDescription
                }
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
                  value={
                    taskDetail.categoryId === null ||
                    taskDetail.categoryId === undefined
                      ? ""
                      : taskDetail.categoryId
                  }
                  onChange={(event) => {
                    setTaskField("categoryId", event.target.value);
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
                  value={
                    taskDetail.priorityId === null ||
                    taskDetail.priorityId === undefined
                      ? ""
                      : taskDetail.priorityId
                  }
                  onChange={(event) => {
                    setTaskField("priorityId", event.target.value);
                  }}
                >
                  {priorityPool.map((item) => (
                    <MenuItem key={item.priorityId} value={item.priorityId}>
                      {item.priorityName}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  id="taskStatus"
                  select={true}
                  label="Trạng thái"
                  value={
                    taskDetail.statusId === null ||
                    taskDetail.statusId === undefined
                      ? ""
                      : taskDetail.statusId
                  }
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
                  onChange={(date) => {
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
                  onChange={(date) => {
                    setTaskField("dueDate", date);
                  }}
                />
              </div>

              <TextField
                id="taskAssignment"
                select={true}
                // disabled={taskAssignable.length > 0}
                SelectProps={{
                  multiple: false,
                  value:
                    taskAssignment === null || taskAssignment === undefined
                      ? ""
                      : taskAssignment,
                  onChange: handleTaskAssignmentChange,
                }}
                fullWidth
                label="Người thực hiện"
              >
                <MenuItem key="" value="">
                  &nbsp;
                </MenuItem>
                {projectMember.map((item, index) => (
                  <MenuItem key={item.partyId} value={item.partyId}>
                    <UserItem
                      user={item}
                      avatarColor={avtColor[index % avtColor.length]}
                    />
                    {/* {item.userLoginId} */}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="taskAssignable"
                select={true}
                disabled={taskAssignment.length > 0}
                SelectProps={{
                  multiple: true,
                  value:
                    taskAssignable === null || taskAssignable === undefined
                      ? ""
                      : taskAssignable,
                  onChange: handleTaskAssignableChange,
                  renderValue:
                    projectMember.length <= 0
                      ? () => {}
                      : (taskAssignable) =>
                          taskAssignable
                            .map(
                              (x) =>
                                projectMember.find(
                                  (member) => member.partyId === x
                                ).userLoginId
                            )
                            .join(", "),
                }}
                fullWidth
                label="Người có thể thực hiện"
              >
                {projectMember.map((item, index) => (
                  <MenuItem key={item.partyId} value={item.partyId}>
                    <Checkbox checked={taskAssignable.includes(item.partyId)} />
                    <UserItem
                      user={item}
                      avatarColor={avtColor[index % avtColor.length]}
                    />
                    {/* <ListItemText primary={item.userLoginId} /> */}
                  </MenuItem>
                ))}
              </TextField>
              <br></br>
              <Typography
                variant="subtitle1"
                display="block"
                style={{ margin: "5px 0 0 7px", width: "100%" }}
              >
                File đính kèm
              </Typography>
              <DropzoneArea
                dropzoneClass={classes.dropZone}
                filesLimit={20}
                showPreviews={false}
                showPreviewsInDropzone={false}
                useChipsForPreview={false}
                dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
                previewText="Xem trước:"
                previewChipProps={{
                  variant: "outlined",
                  color: "primary",
                  size: "large",
                }}
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
                onChange={(files) => handleAddFile(files)}
              ></DropzoneArea>
              <Box mt={0.5}>
                {attachmentFiles.map((item, index) => {
                  if (attachmentStatus[index] !== "deleted")
                    return (
                      <Box m={0.5} display="inline-flex">
                        <Chip
                          key={item.name}
                          label={displayFileName(
                            item.name,
                            attachmentStatus[index]
                          )}
                          onDelete={() => handleDeleteAttachment(item.name)}
                          variant="outlined"
                          size="large"
                          color="primary"
                        />
                      </Box>
                    );
                })}
              </Box>
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
              onClick={() =>
                history.push("/backlog/project/" + backlogProjectId)
              }
            >
              Hủy
            </Button>
          </CardActions>
        </Card>

        <AlertDialog
          open={openAlert}
          onClose={handleCloseAlert}
          severity="warning"
          title={"Vui lòng nhập đầy đủ thông tin cần thiết"}
          content={
            "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại."
          }
          buttons={[
            {
              onClick: handleCloseAlert,
              color: "primary",
              autoFocus: true,
              text: "OK",
            },
          ]}
        />
      </MuiPickersUtilsProvider>
    );
}
