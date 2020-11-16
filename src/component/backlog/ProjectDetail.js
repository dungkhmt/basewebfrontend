import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet } from "../../api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Redirect, useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { toFormattedDateTime, toFormattedDate } from "../../utils/dateutils";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

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

export default function ProjectDetail(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [showMemberListDialogOpen, setShowMemberListDialogOpen] = useState(false);
  const [projectMember, setProjectMember] = useState([]);
  const [scroll, setScroll] = React.useState('paper');
  const [isPermissive, setIsPermissive] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [isMember, setIsMember] = useState({});

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
    let myAccount = await authGet(dispatch, token, "/my-account/");
    let myTasks = tasks.filter(task => {
      return task.assignment.filter(element => { return element.userLoginId === myAccount.user }).length > 0;
    });
    myTasks.forEach(task => {
      task.assignment = task.assignment.map(element => element.userLoginId);
    });
    setTaskList(myTasks);
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
          alert("Mời thành viên thất bại");
        } else {
          alert("Mời thành viên thành công");
          getUser();
        }
      })
  }

  const handleChangeAddMember = (event) => {
    setIsMember({ ...isMember, [event.target.name]: event.target.checked })
  }

  const taskListColumn = [
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
                  <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={event => { setShowMemberListDialogOpen(true) }}>
                    Danh sách thành viên
                  </Button>
                  <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={event => { setAddMemberDialogOpen(true) }}>
                    Thêm thành viên
                  </Button>
                  <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={() => history.push("/backlog/add-task/" + project.backlogProjectId)}>
                    Thêm task
                  </Button>

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
                rowStyle: { backgroundColor: "#fcfcfc" }
              }}
              data={taskList}
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
                      </div>
                    )
                  }
                }]
              }
            // icons={tableIcons}
            onRowClick={(event, rowData) => {
              history.push("/backlog/edit-task/" + backlogProjectId + "/" + rowData.backlogTask.backlogTaskId);
            }}
            />
          </CardContent>
        </Card>
      </div>
    );
}