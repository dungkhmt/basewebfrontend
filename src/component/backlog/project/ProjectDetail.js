import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { Redirect, useHistory } from "react-router-dom";
import { toFormattedDateTime } from "../../../utils/dateutils";
import {
  Grid, Button, Card, CardContent, Icon,
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
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { API_URL } from "../../../config/config";
import {
  localization
} from '../../../utils/MaterialTableUtils';
import {
  TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY, TABLE_STRIPED_ROW_COLOR, ChartColor
} from '../BacklogConfig';
import AlertDialog from '../AlertDialog';
import { HiLightBulb } from 'react-icons/hi';
import SuggestionResult from '../suggestion/SuggestionResult';
import OverlayLoading from '../components/OverlayLoading';
import { MemberList, AddMember } from './Members';
import UserItem from '../components/UserItem';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)"
    }
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
  avatar: {
    width: 30,
    height: 30,
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

let categoryPool = TASK_CATEGORY.LIST;
let statusPool = TASK_STATUS.LIST;
let priorityPool = TASK_PRIORITY.LIST;

function checkNull(a, ifNotNull = a, ifNull = '') {
  return a ? ifNotNull : ifNull;
}

export default function ProjectDetail(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();
  const tableRef = useRef();
  const [myAccount, setMyAccount] = useState(null);
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [isPermissive, setIsPermissive] = useState(true);
  const [isShowMyTask, setIsShowMyTask] = useState(false);
  const [openUpdateStatusAlert, setOpenUpdateStatusAlert] = useState(false);
  const [updateStatusAlert, setUpdateStatusAlert] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [openSuggestionResultDialog, setOpenSuggestionResultDialog] = useState(false);
  const [suggestData, setSuggestData] = useState([]);
  const [suggestChartData, setSuggestChartData] = useState({});
  const [openSuggestAlert, setOpenSuggestAlert] = useState(false);
  const [openSuggestInstructionAlert, setOpenSuggestInstructionAlert] = useState(false);
  const [currentTableData, setCurrentTableData] = useState();
  const [tablePageSize, setTablePageSize] = useState(5);

  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [showMemberListDialogOpen, setShowMemberListDialogOpen] = useState(false);
  const [reloadMemberList, setReloadMemberList] = useState(0);
  const [isTableSelectable, setIsTableSelectable] = useState(false);
  const [taskStatusChange, setTaskStatusChange] = useState({});
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);

  const backlogProjectId = props.match.params.backlogProjectId;
  // get project info
  function getProjectDetail(projectId) {
    authGet(dispatch, token, "/backlog/get-project-by-id/" + projectId).then(
      res => {
        if (res != null && res.backlogProjectId != null) setProject(res);
        else setIsPermissive(false);
      }
    );
  }

  function convertFilterField(field) {
    switch (field) {
      case "backlogTask.backlogTaskName":
        return "backlogTaskName";
      case "backlogTask.categoryName":
        return "categoryName";
      case "backlogTask.statusName":
        return "statusName";
      case "backlogTask.priorityName":
        return "priorityName";
      case "assignment":
        return "assignment";
      case "createdByUser":
        return "createdByUser";
      default:
        return "";
    }
  }

  function convertSortingField(field) {
    switch (field) {
      case "backlogTask.backlogTaskName":
        return "backlog_task_name";
      case "backlogTask.categoryName":
        return "backlog_task_category_id";
      case "backlogTask.statusName":
        return "status_id";
      case "backlogTask.priorityName":
        return "priority_id";
      case "backlogTask.fromDate":
        return "from_date";
      case "backlogTask.dueDate":
        return "due_date";
      case "createdByUser":
        return "created_by_user_login_id";
      default:
        return "";
    }
  }

  function normalizeProjectDetail(data, account) {
    let status = {};
    data.forEach(task => {
      task.assignmentFullInfo = task.assignment;
      task.assignableFullInfo = task.assignable;
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

      task.editable = (account.user === task.backlogTask.createdByUserLoginId);
      task.updateStatusPermission = (
        account.user === task.backlogTask.createdByUserLoginId ||
        (task.assignment.length > 0 && task.assignment.includes(account.user))
      );

      status[task.backlogTask.backlogTaskId] = task.backlogTask.statusId;

      if (selectedRows.includes(task.backlogTask.backlogTaskId)) task.tableData = { checked: true };
    });

    setCurrentTableData(data);
    return data;
  }

  function resetStatusChange() {
    setTaskStatusChange({});
  }

  const [taskListColumn, setTaskListColumn] = useState([
    {
      title: "Chủ đề", field: "backlogTask.backlogTaskName",
      defaultSort: 'asc'
    },
    {
      title: "Loại", field: "backlogTask.categoryName",
      // defaultSort: 'asc',
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
      // defaultSort: 'asc',
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
      filtering: false,
      // defaultSort: 'asc',
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
      // defaultSort: 'asc',
      sorting: false,
      render: rowData => {
        if (rowData.assignmentFullInfo == null
          || rowData.assignmentFullInfo === undefined
          || rowData.assignmentFullInfo.length === 0
        ) return;
        const user = rowData.assignmentFullInfo[0];
        return (
          <UserItem
            user={user}
            avatarClass={classes.avatar}
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        )
      }
    },
    {
      title: "Người tạo", field: "createdByUser",
      render: rowData => {
        return <UserItem
          user={rowData.createdByUser}
          avatarClass={classes.avatar}
          primaryTypographyProps={{ variant: "subtitle2" }}
        />
      }
    },
    {
      title: "Ngày bắt đầu", field: "backlogTask.fromDate",
      // defaultSort: 'desc',
      filtering: false,
      render: rowData => toFormattedDateTime(rowData.backlogTask['fromDate'])
    },
    {
      title: "Hạn cuối", field: "backlogTask.dueDate",
      // defaultSort: 'desc',
      filtering: false,
      render: rowData => toFormattedDateTime(rowData.backlogTask['dueDate'])
    },
  ]);

  useEffect(() => {
    getProjectDetail(backlogProjectId);
  }, []);

  // quick update status
  const handleUpdateTaskStatus = (event, task) => {
    let tmp = taskStatusChange;
    tmp[task.backlogTask.backlogTaskId] = event.target.value;
    setTaskStatusChange(tmp);
  }
  const handleSubmitUpdateTaskStatus = (taskId, oldStatus, newStatus) => {
    if (oldStatus === newStatus) return;

    let formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("newStatus", newStatus);
    resetStatusChange();
    authPostMultiPart(dispatch, token, "/backlog/update-task-status", formData).then(
      res => {
        if (res.status === 200) {
          setUpdateStatusAlert({
            serverity: "success",
            message: "Cập nhật trạng thái thành công",
          })
        } else {
          setUpdateStatusAlert({
            serverity: "error",
            message: "Cập nhật trạng thái thất bại",
          })
        }
        setOpenUpdateStatusAlert(true);
        tableRef.current.onQueryChange();
      }
    );
  }
  const handleCloseUpdateStatusAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenUpdateStatusAlert(false);
  }

  // suggestion 
  const calcDuration = (a, b) => {
    return Math.ceil(Math.abs(new Date(a) - new Date(b)) / 86400000);
  };
  async function getSuggestion() {
    let body = [];
    let unassignableTasks = [];
    selectedRows.forEach(taskId => {
      if (taskList.find(e => e.backlogTask.backlogTaskId === taskId).assignableFullInfo.length > 0) {
        body.push(taskId);
      } else {
        unassignableTasks.push(taskId);
      }
    });
    setOpenOverlayLoading(true);
    const result = await authPost(dispatch, token, "/backlog/suggest-assignment", body).then(r => r.json());
    setOpenOverlayLoading(false);

    let tableResultData = [];
    let labels = [];
    let datasets = [{
      backgroundColor: ChartColor,
      label: 'Khối lượng công việc (Ngày)',
      data: []
    }];
    result.forEach(assignment => {
      let duration = calcDuration(assignment.backlogTask.dueDate, assignment.backlogTask.fromDate);
      let assignable = taskList.find(e => e.backlogTask.backlogTaskId === assignment.backlogTask.backlogTaskId).assignableFullInfo;

      tableResultData.push({
        taskId: assignment.backlogTask.backlogTaskId,
        taskName: assignment.backlogTask.backlogTaskName,
        assign: assignment.userSuggestion,
        duration: duration,
        assignable: assignable
      })

      assignable.forEach(e => {
        let index = labels.findIndex(label => e.userLoginId === label);
        if (index < 0) {
          labels.push(e.userLoginId);
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

    unassignableTasks.forEach(taskId => {
      tableResultData.push({
        taskId: taskId,
        taskName: taskList.find(e => e.backlogTask.backlogTaskId === taskId).backlogTask.backlogTaskName,
        assign: null,
        duration: 0,
        assignable: [],
      });
    })

    if (datasets[0].backgroundColor.length < labels.length) {
      for (let i = 0; i < labels.length / datasets[0].backgroundColor.length + 1; i++) {
        datasets[0].backgroundColor = [...datasets[0].backgroundColor, ...ChartColor];
      }
    }

    labels = labels.filter((e, index) => datasets[0].data[index] > 0);
    datasets[0].data = datasets[0].data.filter(e => e > 0);

    console.log(labels, datasets[0].data);
    setSuggestData(tableResultData);
    setSuggestChartData({
      labels: labels,
      datasets: datasets
    })

    setOpenSuggestionResultDialog(true);
  }

  function handleOnSelectionChange(rows) {
    const displayingIds = currentTableData.map(e => e.backlogTask.backlogTaskId);
    let selectedRowsNotDisplayingIds = selectedRows.filter(row => !displayingIds.includes(row));
    setSelectedRows([...selectedRowsNotDisplayingIds, ...rows.map(e => e.backlogTask.backlogTaskId)]);

    let selectedRowsNotDisplaying = taskList.filter(row => !displayingIds.includes(row.backlogTask.backlogTaskId));
    setTaskList([...selectedRowsNotDisplaying, ...rows]);
  }
  function onClickGetSuggestion() {
    if (selectedRows.length === 0) setOpenSuggestAlert(true);
    else getSuggestion();
  }
  //
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
                        <ArrowBackIcon color='primary' fontSize='large' />
                      </IconButton>
                    </Tooltip>
                    <Box p={1} display="inline-flex">
                      <Typography component="div" align="left">
                        <Box fontWeight="fontWeightBold" fontSize="subtitle1.fontSize" m={1}>Mã dự án: {project.backlogProjectCode}</Box>
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
                  <Tooltip title="Gợi ý phân công">
                    <IconButton
                      aria-label="suggestAssignment"
                      onClick={event => {
                        tableRef.current.onQueryChange();
                        resetStatusChange();
                        tableRef.current.onAllSelected(false);
                        setSelectedRows([]);
                        setTaskList([]);
                        if (!isTableSelectable) setOpenSuggestInstructionAlert(true);
                        setIsTableSelectable(!isTableSelectable);
                      }}>
                      <HiLightBulb color={isTableSelectable ? '#ff9100' : '#3F51B5'} size='1.5em' />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </div>

            <p></p>
            <MaterialTable
              className={classes.table}
              title="Danh sách task"
              tableRef={tableRef}
              columns={taskListColumn}
              options={{
                thirdSortClick: false,
                filtering: true,
                sorting: true,
                search: false,
                selection: isTableSelectable,
                pageSize: tablePageSize,
                debounceInterval: 600,
                rowStyle: rowData => { return { backgroundColor: TABLE_STRIPED_ROW_COLOR[rowData.tableData.id % TABLE_STRIPED_ROW_COLOR.length] } },
                actionsColumnIndex: -1
              }}
              onSelectionChange={(rows) => { handleOnSelectionChange(rows) }}
              localization={localization}
              data={query => {
                return new Promise((resolve, reject) => {
                  setTablePageSize(query.pageSize);
                  let sortParam = "";
                  if (query.orderBy !== undefined) {
                    sortParam = "&sort=" + convertSortingField(query.orderBy.field) + ',' + query.orderDirection;
                  }
                  let filterParam = "";
                  if (query.filters.length > 0) {
                    let filter = query.filters;
                    filter.forEach(v => {
                      filterParam += convertFilterField(v.column.field) + "=" + v.value + "&"
                    })
                    filterParam = "&" + filterParam.substring(0, filterParam.length - 1);
                  }
                  let api = "/backlog/get-project-detail-by-page/";
                  if (isShowMyTask) api = "/backlog/get-my-task/";
                  if (!isShowMyTask) api = "/backlog/get-project-detail-by-page/";
                  if (isTableSelectable) api = "/backlog/get-opening-task/";
                  api += backlogProjectId;
                  console.log(api + "?size=" + query.pageSize + "&page=" + query.page + sortParam + filterParam);
                  authGet(
                    dispatch,
                    token,
                    api + "?size=" + query.pageSize + "&page=" + query.page + sortParam + filterParam
                  ).then(res => {
                    const data = res;
                    if (myAccount == null)
                      authGet(dispatch, token, "/my-account").then(result => {
                        setMyAccount(result);
                        resolve({
                          data: normalizeProjectDetail(data.content, result),
                          page: data.number,
                          totalCount: data.totalElements
                        });
                      })
                    else {
                      resolve({
                        data: normalizeProjectDetail(data.content, myAccount),
                        page: data.number,
                        totalCount: data.totalElements
                      });
                    }
                  })
                })
              }}
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
                                {/* <TableCell>Người tạo</TableCell> */}
                                <TableCell>Người có thể phân công</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{rowData.backlogTask.backlogTaskId}</TableCell>
                                <TableCell>
                                  {rowData.backlogTask.lastUpdateStamp ?
                                    toFormattedDateTime(rowData.backlogTask.lastUpdateStamp)
                                    : toFormattedDateTime(rowData.backlogTask.createdStamp)
                                  }
                                </TableCell>
                                {/* <TableCell>{rowData.backlogTask.createdByUserLoginId}</TableCell> */}
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
                            <Box mr={1} mb={0.5} display="inline" key={item}>
                              <Chip
                                label={item.substring(item.indexOf("-") + 1)}
                                onClick={() => {
                                  downloadFiles(item);
                                }}
                                variant="outlined"
                                size="medium"
                                color="primary"
                              />
                            </Box>
                          ))}
                        </Box>

                        {rowData.updateStatusPermission ?
                          (<Box mt={1}>
                            <FormControl>
                              <InputLabel>Cập nhật trạng thái</InputLabel>
                              <Select
                                // labelId="update-select-select-label"
                                // id="update-status-select"
                                value={taskStatusChange[rowData.backlogTask.backlogTaskId]}
                                onChange={(event) => { handleUpdateTaskStatus(event, rowData) }}
                                style={{ width: '200px' }}
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
                                    handleSubmitUpdateTaskStatus(
                                      rowData.backlogTask.backlogTaskId,
                                      rowData.backlogTask.statusId,
                                      taskStatusChange[rowData.backlogTask.backlogTaskId]
                                    )
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
                  disabled: !isShowMyTask,
                  icon: () => { return <ListAltIcon color={isShowMyTask ? 'primary' : 'disabled'} fontSize='large' /> },
                  tooltip: 'Tất cả task',
                  isFreeAction: true,
                  onClick: () => { setIsShowMyTask(false); tableRef.current.onQueryChange(); resetStatusChange(); }
                },
                {
                  disabled: isShowMyTask,
                  icon: () => { return <PlaylistAddCheckIcon color={!isShowMyTask ? 'primary' : 'disabled'} fontSize='large' /> },
                  tooltip: 'Task của tôi',
                  isFreeAction: true,
                  onClick: () => { setIsShowMyTask(true); tableRef.current.onQueryChange(); resetStatusChange(); }
                },
                {
                  icon: () => { return <AddBoxIcon color='primary' fontSize='large' /> },
                  tooltip: 'Thêm task',
                  isFreeAction: true,
                  onClick: (event) => history.push("/backlog/add-task/" + project.backlogProjectId)
                },
                (rowData) => ({
                  icon: () => { return <EditIcon color={rowData.editable ? 'primary' : 'disabled'} /> },
                  tooltip: 'Chỉnh sửa',
                  onClick: (event, rowData) => { history.push("/backlog/edit-task/" + backlogProjectId + "/" + rowData.backlogTask.backlogTaskId); },
                  disabled: !rowData.editable,
                  hidden: !rowData.editable
                }),
              ]}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
            />
            {isTableSelectable ? (
              <Box mt={1}>
                <Button className={classes.functionBtn} color={'primary'} variant={'contained'} onClick={() => { onClickGetSuggestion() }}>
                  Đề xuất gợi ý
                </Button>
              </Box>
            ) : null}
          </CardContent>
        </Card>

        <AddMember
          open={addMemberDialogOpen}
          onClose={() => setAddMemberDialogOpen(false)}
          projectId={backlogProjectId}
          successCallback={() => {
            setReloadMemberList(reloadMemberList + 1);
          }}
        />

        <MemberList
          open={showMemberListDialogOpen}
          onClose={() => setShowMemberListDialogOpen(false)}
          projectId={backlogProjectId}
          reloadData={reloadMemberList}
        />

        <AlertDialog
          open={openSuggestAlert}
          onClose={() => { setOpenSuggestAlert(false) }}
          severity="warning"
          title="Vui lòng chọn task"
          content="Chọn ít nhất 1 task để hệ thống có thể đề xuất gợi ý"
          buttons={[
            {
              onClick: () => { setOpenSuggestAlert(false) },
              color: "primary",
              autoFocus: true,
              text: "OK"
            }
          ]}
        />

        <AlertDialog
          open={openSuggestInstructionAlert}
          onClose={() => { setOpenSuggestInstructionAlert(false) }}
          severity="info"
          title="Tính năng gợi ý phân công"
          content="Chọn các task rồi ấn Đề xuất gợi ý"
          buttons={[
            {
              onClick: () => { setOpenSuggestInstructionAlert(false) },
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseUpdateStatusAlert} severity={updateStatusAlert.severity} variant="filled">
            {updateStatusAlert.message}
          </Alert>
        </Snackbar>

        <SuggestionResult
          open={openSuggestionResultDialog}
          onClose={() => setOpenSuggestionResultDialog(false)}
          suggestData={suggestData}
          setSuggestChartData={setSuggestChartData}
          suggestChartData={suggestChartData}
          setSuggestData={setSuggestData}
          applyCallback={() => {
            setIsTableSelectable(false);
            tableRef.current.onQueryChange();
            // getProjectDetail(backlogProjectId);
          }}
        />

        <OverlayLoading
          open={openOverlayLoading}
          onClose={() => { setOpenOverlayLoading(false) }}
        />
      </div>
    );
}
