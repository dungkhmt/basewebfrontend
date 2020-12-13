import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { Redirect, useHistory } from "react-router-dom";
import { toFormattedDateTime } from "../../../utils/dateutils";
import {
  Grid, Button, Card, CardContent, Dialog, Icon,
  DialogActions, DialogContent, DialogTitle, List,
  ListItem, FormGroup, FormControlLabel, Checkbox,
  TextField, Tooltip, IconButton, Box, Chip, Typography,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, FormControl, InputLabel, Select, MenuItem, Snackbar,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AddBoxIcon from '@material-ui/icons/AddBox';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import { API_URL } from "../../../config/config";
import changePageSize, {
  localization,
  tableIcons,
} from '../../../utils/MaterialTableUtils';
import {
  TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY, TABLE_STRIPED_ROW_COLOR
} from '../BacklogConfig';
import AlertDialog from '../AlertDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)"
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
  },
}));

const StyledChip = withStyles(theme => ({
  root: {
    width: 90
  },
  label: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}))(Chip);

export default function ProjectDetail(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [projectMember, setProjectMember] = useState([]);
  const [scroll, setScroll] = useState('paper');
  const [isPermissive, setIsPermissive] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [isMember, setIsMember] = useState({});
  const [isShowMyTask, setIsShowMyTask] = useState(false);
  const [myTask, setMyTask] = useState([]);
  const [openUpdateStatusAlert, setOpenUpdateStatusAlert] = useState(false);
  const [updateStatusAlert, setUpdateStatusAlert] = useState({});

  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [showMemberListDialogOpen, setShowMemberListDialogOpen] = useState(false);
  const [inviteResultAlert, setInviteResultAlert] = useState(false);
  const [inviteAlertProperties, setInviteAlertProperties] = useState({});

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
    let myAccount = await authGet(dispatch, token, "/my-account");

    tasks.sort((a, b) => { return (a.backlogTask.backlogTaskName > b.backlogTask.backlogTaskName) - (a.backlogTask.backlogTaskName < b.backlogTask.backlogTaskName) })
    let status = {};
    tasks.forEach(task => {
      task.assignment = task.assignment.map(element => element.userLoginId);
      task.assignable = task.assignable.map(element => element.userLoginId);
      if (task.backlogTask.attachmentPaths != null
        && task.backlogTask.attachmentPaths !== undefined
        && task.backlogTask.attachmentPaths.length > 0
      )
        task.backlogTask.attachmentPaths = task.backlogTask.attachmentPaths.split(";");
      else task.backlogTask.attachmentPaths = [];

      task.backlogTask.statusName = TASK_STATUS.LIST.filter(status => status.statusId === task.backlogTask.statusId).map(e => e.description)[0];
      task.backlogTask.priorityName = TASK_PRIORITY.LIST.filter(priority => priority.priorityId === task.backlogTask.priorityId).map(e => e.priorityName)[0];
      task.backlogTask.categoryName = TASK_CATEGORY.LIST.filter(category => category.categoryId === task.backlogTask.categoryId).map(e => e.categoryName)[0];

      task.backlogTask.statusIdTemp = task.backlogTask.statusId;
      task.editable = (myAccount.user === task.backlogTask.createdByUserLoginId);
      task.updateStatusPermission = (
        myAccount.user === task.backlogTask.createdByUserLoginId ||
        (task.assignment.length > 0 && task.assignment.includes(myAccount.user))
      );

      status[task.backlogTask.backlogTaskId] = task.backlogTask.statusId;
    });
    let myTasks = tasks.filter(task => {
      return task.assignment.filter(element => { return element === myAccount.user }).length > 0;
    });

    setTaskList(tasks);
    setMyTask(myTasks);
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

  useEffect(() => {
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();
    getProjectDetail(backlogProjectId);
    getUser();
  }, []);

  const onCloseAddMemberDialog = (event) => {
    setAddMemberDialogOpen(false);
  };

  const onCloseShowMemberListDialog = (event) => {
    setShowMemberListDialogOpen(false);
  };

  const onCloseInviteResultAlert = () => {
    setInviteResultAlert(false);
  }

  const onInviteMember = () => {
    setAddMemberDialogOpen(false);
    let newMember = [];
    for (let key in isMember) {
      if (isMember[key]) newMember.push(key);
    }
    let input = {
      backlogProjectId: backlogProjectId,
      usersLoginId: newMember
    };
    authPost(dispatch, token, "/backlog/add-member", input)
      .then((res) => res.json())
      .then((res) => {
        if (res == null || res.backlogProjectId == null) {
          setInviteAlertProperties({
            severity: 'error',
            title: 'Mời thành viên thất bại',
            content: 'Mời thất bại. Vui lòng thử lại.'
          })
          setInviteResultAlert(true);
          return;
        } else {
          setInviteAlertProperties({
            severity: 'success',
            title: 'Mời thành viên thành công',
            content: 'Mời thành công.'
          })
          setInviteResultAlert(true);
          getUser();
          return;
        }
      })
  }

  const handleChangeAddMember = (event) => {
    setIsMember({ ...isMember, [event.target.name]: event.target.checked })
  }

  const handleUpdateTaskStatus = (event, taskIndex) => {
    if (isShowMyTask) {
      let currData = [...myTask];
      currData[taskIndex].backlogTask.statusIdTemp = event.target.value;
      setMyTask(currData);
    } else {
      let currData = [...taskList];
      currData[taskIndex].backlogTask.statusIdTemp = event.target.value;
      setTaskList(currData);
    }
  }

  const handleSubmitUpdateTaskStatus = (taskId, newStatus) => {
    if (taskList.find(e => e.backlogTask.backlogTaskId === taskId).statusId === newStatus) return;

    let formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("newStatus", newStatus);
    authPostMultiPart(dispatch, token, "/backlog/update-task-status", formData).then(
      res => {
        if (res.status === 200) {
          setUpdateStatusAlert({
            serverity: "success",
            message: "Cập nhật trạng thái thành công",
          })
          let tasks = [...taskList];
          let task = tasks.find(e => e.backlogTask.backlogTaskId === taskId);
          task.backlogTask.statusId = newStatus;
          task.backlogTask.statusName = statusPool.find(e => e.statusId === newStatus).description;
          setTaskList(tasks);
        } else {
          setUpdateStatusAlert({
            serverity: "error",
            message: "Cập nhật trạng thái thất bại",
          })
        }
        setOpenUpdateStatusAlert(true);
      }
    );
  }

  const handleCloseUpdateStatusAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenUpdateStatusAlert(false);
  }

  const taskListColumn = [
    { title: "Chủ đề", field: "backlogTask.backlogTaskName" },
    {
      title: "Loại", field: "backlogTask.categoryName",
      render: rowData => {
        const color = categoryPool.filter(x => x.categoryId === rowData.backlogTask.categoryId).map(e => e.color)

        return (
          <StyledChip
            label={rowData.backlogTask.categoryName}
            style={{ backgroundColor: color }}
          />
        )
      }
    },
    {
      title: "Trạng thái", field: "backlogTask.statusName",
      render: rowData => {
        const color = statusPool.filter(x => x.statusId === rowData.backlogTask.statusId).map(e => e.color)

        return (
          <StyledChip
            label={rowData.backlogTask.statusName}
            style={{ backgroundColor: color }}
          />
        )
      }
    },
    {
      title: "Độ ưu tiên", field: "backlogTask.priorityName",
      render: rowData => {
        const color = priorityPool.filter(x => x.priorityId === rowData.backlogTask.priorityId).map(e => e.color)
        const icon = priorityPool.filter(x => x.priorityId === rowData.backlogTask.priorityId).map(e => e.icon)
        return (
          <Icon
            style={{ color: color }}
          >{icon}</Icon>
        )
      }
    },
    {
      title: "Phân công", field: "assignment",
      render: rowData => {
        return rowData['assignment'].toString();
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
  ];

  const downloadFiles = (item) => {
    fetch(`${API_URL}/backlog/download-attachment-files/${item}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Auth-Token": token,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${item.substring(item.indexOf("-") + 1)}`,
        );

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  }

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
                  <Box>
                    <Tooltip title="Danh sách dự án">
                      <IconButton aria-label="projectList" onClick={() => { history.push("/backlog/project-list/") }}>
                        <ArrowBackIcon color='primary' fontSize='medium' />
                      </IconButton>
                    </Tooltip>
                    <Box p={1} display="inline-flex">
                      <Typography component="div" align="left">
                        <Box fontWeight="fontWeightBold" fontSize="subtitle1.fontSize" m={1}>Mã dự án: {project.backlogProjectId}</Box>
                        <Box fontWeight="fontWeightBold" fontSize="subtitle1.fontSize" m={1}>Tên dự án: {checkNull(project['backlogProjectName'])}</Box>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={4}
                  className={classes.grid}>
                  <Tooltip title="Biểu đồ dự án">
                    <IconButton aria-label="projectChart" onClick={() => { history.push("/backlog/dashboard/" + backlogProjectId) }}>
                      <BarChartIcon color='primary' fontSize='large' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Danh sách thành viên">
                    <IconButton aria-label="memberList" onClick={event => { setShowMemberListDialogOpen(true) }}>
                      <PeopleIcon color='primary' fontSize='large' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Thêm thành viên">
                    <IconButton aria-label="addMember" onClick={event => { setAddMemberDialogOpen(true) }}>
                      <PersonAddIcon color='primary' fontSize='large' />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </div>

            <p></p>
            <MaterialTable
              className={classes.table}
              title="Danh sách task"
              columns={taskListColumn}
              options={{
                filtering: true,
                search: false,
                rowStyle: rowData => { return { backgroundColor: TABLE_STRIPED_ROW_COLOR[rowData.tableData.id % TABLE_STRIPED_ROW_COLOR.length] } },
                actionsColumnIndex: -1
              }}
              localization={localization}
              data={isShowMyTask ? myTask : taskList}
              detailPanel={
                [{
                  tooltip: "Chi tiết",
                  render: rowData => {
                    return (
                      <Box my={2.5} mx={7.5}>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Task ID</TableCell>
                                <TableCell>Ngày cập nhật</TableCell>
                                <TableCell>Người tạo</TableCell>
                                <TableCell>Người có thể phân công</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{rowData.backlogTask.backlogTaskId}</TableCell>
                                <TableCell>{toFormattedDateTime(rowData.backlogTask.lastUpdateStamp)}</TableCell>
                                <TableCell>{rowData.backlogTask.createdByUserLoginId}</TableCell>
                                <TableCell>{rowData.assignable.join(", ")}</TableCell>
                              </TableRow>
                            </TableBody>

                          </Table>
                        </TableContainer>
                        <p></p>
                        <TextField
                          className={classes.root}
                          id="taskDescription"
                          label="Mô tả"
                          variant="outlined"
                          value={rowData.backlogTask.backlogDescription === null || rowData.backlogTask.backlogDescription === undefined ? '' : rowData.backlogTask.backlogDescription}
                          multiline={true}
                          rows="5"
                          fullWidth
                          disabled
                        />
                        <Box mt={1} >
                          {rowData.backlogTask.attachmentPaths.map(item => (
                            <Box mr={1} mb={0.5} display="inline">
                              <Chip
                                label={item.substring(item.indexOf("-") + 1)}
                                onClick={() => {
                                  downloadFiles(item);
                                }}
                                variant="outlined"
                                size="large"
                                color="primary"
                              />
                            </Box>
                          ))}
                        </Box>

                        {rowData.updateStatusPermission ?
                          (<Box>
                            <FormControl>
                              <InputLabel>Cập nhật trạng thái</InputLabel>
                              <Select
                                labelId="update-select-select-label"
                                id="update-status-select"
                                value={rowData.backlogTask.statusIdTemp}
                                onChange={(event) => { handleUpdateTaskStatus(event, rowData.tableData.id) }}
                                style={{ width: '150px' }}
                              >
                                {statusPool.map((item) => (
                                  <MenuItem key={item.statusId} value={item.statusId}>
                                    {item.description}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl>
                              <Box mt={2} ml={2}>
                                <Button
                                  color='primary'
                                  variant="contained"
                                  onClick={() => {
                                    handleSubmitUpdateTaskStatus(rowData.backlogTask.backlogTaskId, rowData.backlogTask.statusIdTemp)
                                  }}>
                                  Lưu
                                </Button>
                              </Box>
                            </FormControl>
                          </Box>
                          ) : null}
                      </Box>
                    )
                  }
                }]
              }
              actions={[
                {
                  icon: () => { return <ListAltIcon color={isShowMyTask ? 'primary' : 'default'} fontSize='large' /> },
                  tooltip: 'Task của tôi',
                  isFreeAction: true,
                  onClick: () => { setIsShowMyTask(!isShowMyTask) }
                },
                {
                  icon: () => { return <AddBoxIcon color='primary' fontSize='large' /> },
                  tooltip: 'Thêm task',
                  isFreeAction: true,
                  onClick: (event) => history.push("/backlog/add-task/" + project.backlogProjectId)
                },
                (rowData) => ({
                  icon: () => { return <EditIcon color={rowData.editable ? 'primary' : 'default'} /> },
                  tooltip: 'Chỉnh sửa',
                  onClick: (event, rowData) => { history.push("/backlog/edit-task/" + backlogProjectId + "/" + rowData.backlogTask.backlogTaskId); },
                  disabled: !rowData.editable,
                  hidden: !rowData.editable
                }),
              ]}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
            />
          </CardContent>
        </Card>

        {/* add member dialog */}
        <Dialog
          open={addMemberDialogOpen}
          onClose={onCloseAddMemberDialog}
          aria-labelledby="form-dialog-title"
          scroll={scroll}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle id="form-dialog-title">
            Thêm thành viên
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <FormGroup>
              {Object.keys(isMember).map((key, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMember[key]}
                      onChange={handleChangeAddMember}
                      name={key}
                    />
                  }
                  label={key}
                />
              ))
              }
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={onInviteMember} color="primary">
              Lưu
            </Button>
            <Button onClick={onCloseAddMemberDialog} color="primary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>

        {/* member list */}
        <Dialog
          open={showMemberListDialogOpen}
          onClose={onCloseShowMemberListDialog}
          scroll={scroll}
          aria-labelledby="list-scroll-dialog-title"
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle id="list-scroll-dialog-title">
            Danh sách thành viên
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <List>
              {projectMember.map(member => (
                <ListItem key={member.userLoginId} value={member.userLoginId}>
                  {member.userLoginId}
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={inviteResultAlert}
          onClose={onCloseInviteResultAlert}
          {...inviteAlertProperties}
          buttons={[
            {
              onClick: onCloseInviteResultAlert,
              color: "primary",
              autoFocus: true,
              text: "OK"
            }
          ]}
        />

        <Snackbar 
          open={openUpdateStatusAlert} 
          autoHideDuration={1800} 
          onClose={handleCloseUpdateStatusAlert}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        >
          <Alert onClose={handleCloseUpdateStatusAlert} severity={updateStatusAlert.severity} variant="filled">
            {updateStatusAlert.message}
          </Alert>
        </Snackbar>
      </div>
    );
}
