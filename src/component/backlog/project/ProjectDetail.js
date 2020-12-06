import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet } from "../../../api";
import { Redirect, useHistory } from "react-router-dom";
import { toFormattedDateTime } from "../../../utils/dateutils";
import {
  Grid, Button, Card, CardContent, Dialog, Icon,
  DialogActions, DialogContent, DialogTitle, List,
  ListItem, FormGroup, FormControlLabel, Checkbox,
  TextField, Tooltip, IconButton, Box, Chip, Typography
} from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import AddBoxIcon from '@material-ui/icons/AddBox';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
  }
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
    tasks.forEach(task => {
      task.assignment = task.assignment.map(element => element.userLoginId);
      if (task.backlogTask.attachmentPaths != null
        && task.backlogTask.attachmentPaths !== undefined
        && task.backlogTask.attachmentPaths.length > 0
      )
        task.backlogTask.attachmentPaths = task.backlogTask.attachmentPaths.split(";");
      else task.backlogTask.attachmentPaths = [];

      task.backlogTask.statusName = TASK_STATUS.LIST.filter(status => status.statusId === task.backlogTask.statusId).map(e => e.description);
      task.backlogTask.priorityName = TASK_PRIORITY.LIST.filter(priority => priority.priorityId === task.backlogTask.priorityId).map(e => e.priorityName);
      task.backlogTask.categoryName = TASK_CATEGORY.LIST.filter(category => category.categoryId === task.backlogTask.categoryId).map(e => e.catgoryName);
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

  const detailTaskColumn = [
    { title: 'ID', field: "backlogTask.backlogTaskId" },
    {
      title: 'Ngày cập nhật', field: "backlogTask.lastUpdateStamp",
      render: rowData => toFormattedDateTime(rowData.backlogTask['lastUpdateStamp'])
    },
    { title: 'Người tạo', field: "backlogTask.createdByUserLoginId" },
    {
      title: "Phân công", field: "assignment",
      render: rowData => {
        return rowData['assignment'].toString();
      }
    },
  ]

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
                rowStyle: rowData => { return { backgroundColor: TABLE_STRIPED_ROW_COLOR[rowData.tableData.id % TABLE_STRIPED_ROW_COLOR.length] } }
              }}
              localization={localization}
              data={isShowMyTask ? myTask : taskList}
              detailPanel={
                [{
                  tooltip: "Chi tiết",
                  render: rowData => {
                    let data = JSON.parse(JSON.stringify([rowData]));
                    return (
                      <div style={{ padding: '10px 50px 10px 50px' }}>
                        <MaterialTable
                          options={{
                            filtering: false,
                            search: false,
                            toolbar: false,
                            paging: false,
                            sorting: false
                          }}
                          columns={detailTaskColumn}
                          data={data}
                        />
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
                        <Box style={{ margin: '5px 0 0 0' }}>
                          {rowData.backlogTask.attachmentPaths.map(item => (
                            <Chip
                              style={{ margin: '0 5px 0 0' }}
                              label={item.substring(item.indexOf("-") + 1)}
                              onClick={() => {
                                downloadFiles(item);
                              }}
                              variant="outlined"
                              size="large"
                              color="primary"
                            />
                          )
                          )}
                        </Box>
                      </div>
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
              ]}
              onRowClick={(event, rowData) => {
                history.push("/backlog/edit-task/" + backlogProjectId + "/" + rowData.backlogTask.backlogTaskId);
              }}
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
      </div>
    );
}