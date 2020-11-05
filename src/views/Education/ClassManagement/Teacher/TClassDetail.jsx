import React, { useRef, useEffect, useState, Fragment } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CardHeader,
  Paper,
  Collapse,
  Badge,
  CardActionArea,
  Grid,
  Box,
  Link,
} from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authGet, axiosGet, axiosPut, request } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { useParams } from "react-router";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import { Avatar, IconButton } from "material-ui";
import {
  FcApproval,
  FcMindMap,
  FcViewDetails,
  FcCollapse,
  FcExpand,
  FcConferenceCall,
} from "react-icons/fc";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { motion } from "framer-motion";
import { BiDetail } from "react-icons/bi";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { localization } from "../../../../utils/MaterialTableUtils";
import { errorNoti } from "../../../../utils/Notification";
import CustomizedDialogs from "../../../../utils/CustomizedDialogs";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  negativeBtn: {
    minWidth: 124,
    borderRadius: "6px",
    backgroundColor: "#e4e6eb",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,
    marginLeft: 10,
    marginRight: 10,
    "&:hover": {
      backgroundColor: "#CCD0D5",
    },
  },
  approveBtn: {
    minWidth: 124,
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
  dialogDeleteBtn: {
    borderRadius: "6px",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#e7f3ff",
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -10,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const formatTime = (n) => (Number(n) < 10 ? "0" + Number(n) : "" + Number(n));

function TClassDetail() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  const [classDetail, setClassDetail] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Assignment.
  const [assign, setAssigns] = useState([]);
  const [deletedAssignId, setDeletedAssignId] = useState();

  // Dialog.
  const [open, setOpen] = useState(false);

  // Tables.
  const [students, setStudents] = useState([]);
  const [registStudents, setRegistStudents] = useState([]);
  const [openClassStuCard, setOpenClassStuCard] = useState(false);
  const [openRegistCard, setOpenRegistCard] = useState(false);
  const tableRef = useRef(null);

  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };

  const assignCols = [
    {
      field: "name",
      title: "Tên bài tập",
      ...headerProperties,
    },
    {
      field: "deadLine",
      title: "Hạn nộp",
      ...headerProperties,
      render: (rowData) => {
        let deadLine = new Date(rowData.deadLine);
        return (
          <Typography>
            {deadLine.getFullYear()}-{formatTime(deadLine.getMonth() + 1)}-
            {formatTime(deadLine.getDate())}
            &nbsp;&nbsp;
            {formatTime(deadLine.getHours())}
            <b>:</b>
            {formatTime(deadLine.getMinutes())}
            <b>:</b>
            {formatTime(deadLine.getSeconds())}
          </Typography>
        );
      },
    },
  ];

  const registCols = [
    {
      field: "name",
      title: "Họ và tên",
      ...headerProperties,
    },
    {
      field: "email",
      title: "Email",
      ...headerProperties,
      render: (rowData) => (
        <Link href={`mailto:${rowData.email}`}>{rowData.email}</Link>
      ),
    },
  ];

  const stuCols = [
    ...registCols,
    {
      field: "",
      title: "",
      cellStyle: { alignItems: "center" },
      render: (rowData) => (
        <Box display="flex" justifyContent="center">
          <Button
            className={classes.negativeBtn}
            onClick={() => onClickRemoveBtn(rowData)}
          >
            Loại khỏi lớp
          </Button>
        </Box>
      ),
    },
  ];

  // Functions.
  const getClassDetail = () => {
    request(token, history, "get", `/edu/class/${params.id}`, (res) => {
      setClassDetail(res.data);
    });
  };

  const getStudents = (type) => {
    if (type === "register") {
      axiosGet(token, `/edu/class/${params.id}/registered-students`)
        .then((res) => setRegistStudents(res.data))
        .catch((e) => alert("error"));
    } else {
      axiosGet(token, `/edu/class/${params.id}/students`)
        .then((res) => setStudents(res.data))
        .catch((e) => alert("error"));
    }
  };

  const getAssignments = () => {
    axiosGet(token, `/edu/class/${params.id}/assignments`)
      .then((res) => setAssigns(res.data))
      .catch((e) => alert("error"));
  };

  const onClickStuCard = () => {
    if (false == openClassStuCard && 0 == students.length) {
      getStudents("class");
    }

    setOpenClassStuCard(!openClassStuCard);
  };

  const onClickRemoveBtn = (e) => {
    console.log("Click button", e);
  };

  const onSelectionChange = (rows) => {
    let studentIds = rows.map((row) => row.id);
    setSelectedStudents(studentIds);
  };

  const onClickUpdateStatusBtn = (type) => {
    axiosPut(token, "/edu/class/registration-status", {
      classId: params.id,
      studentIds: selectedStudents,
      status: type,
    })
      .then((res) => {
        let data = res.data;
        let tmp = [];

        for (let i = 0; i < registStudents.length; i++) {
          if (
            data[registStudents[i].id] == undefined ||
            data[registStudents[i].id].status != 200
          ) {
            tmp.push(registStudents[i]);
          } else {
            // Phe duyet thanh cong thi them luon len bang danh sach lop
          }
        }

        setRegistStudents(tmp);
      })
      .catch((e) => alert("error"));
  };

  const onDeleteAssignment = (rowData) => {
    setOpen(true);
    setDeletedAssignId(rowData.id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickDialogDeleteBtn = () => {
    setOpen(false);

    request(
      token,
      history,
      "delete",
      `/edu/assignment/${deletedAssignId}`,
      (res) => {
        setAssigns(
          assign.filter((assign) => {
            return assign.id != deletedAssignId;
          })
        );
      },
      {
        400: (e) => {
          if ("not allowed" == e.response?.data?.error) {
            errorNoti("Không thể xoá bài tập vì đã có sinh viên nộp bài.");
          }
        },
      }
    );
  };

  useEffect(() => {
    getClassDetail();
    getAssignments();
    getStudents("register");
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <BiDetail size={32} />
            </Avatar>
          }
          title={<Typography variant="h5">Thông tin lớp</Typography>}
        />
        <CardContent>
          <Grid container className={classes.grid}>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Mã lớp</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.code}
              </Typography>
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Mã học phần</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.courseId}
              </Typography>
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Tên học phần</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.name}
              </Typography>
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Loại lớp</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.classType}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardActionArea disableRipple onClick={onClickStuCard}>
          <CardHeader
            avatar={
              <Avatar style={{ background: "white" }}>
                {/*#ffeb3b <PeopleAltRoundedIcon /> */}
                <FcConferenceCall size={40} />
              </Avatar>
            }
            title={<Typography variant="h5">Danh sách sinh viên</Typography>}
            action={
              <div>
                <IconButton aria-label="show more">
                  {openClassStuCard ? (
                    <FcCollapse size={24} />
                  ) : (
                    <FcExpand size={24} />
                  )}
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openClassStuCard} timeout="auto">
          <CardContent>
            <MaterialTable
              title=""
              columns={stuCols}
              tableRef={tableRef}
              localization={localization}
              data={students}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              options={{
                pageSize: 20,
                debounceInterval: 500,
                headerStyle: {
                  backgroundColor: "#673ab7",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "white",
                },
                sorting: false,
                cellStyle: { fontSize: "1rem" },
                toolbarButtonAlignment: "left",
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Card className={classes.card}>
        <CardActionArea
          disableRipple
          onClick={() => setOpenRegistCard(!openRegistCard)}
        >
          <CardHeader
            avatar={
              <Avatar style={{ background: "white" }}>
                <FcApproval size={40} />
              </Avatar>
            }
            title={
              <StyledBadge badgeContent={registStudents.length} color="error">
                Phê duyệt sinh viên đăng ký
              </StyledBadge>
            }
            titleTypographyProps={{
              variant: "h5",
            }}
            action={
              <div>
                <IconButton aria-label="show more">
                  {openRegistCard ? (
                    <FcCollapse size={24} />
                  ) : (
                    <FcExpand size={24} />
                  )}
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openRegistCard} timeout="auto">
          <CardContent>
            <MaterialTable
              title=""
              columns={registCols}
              tableRef={tableRef}
              data={registStudents}
              localization={localization}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
                Action: (props) => {
                  if (props.action.icon === "refuse") {
                    return (
                      <Button
                        className={classes.negativeBtn}
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      >
                        Từ chối
                      </Button>
                    );
                  }
                  if (props.action.icon === "approve") {
                    return (
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.approveBtn}
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      >
                        Phê duyệt
                      </Button>
                    );
                  }
                },
              }}
              options={{
                pageSize: 10,
                selection: true,
                debounceInterval: 500,
                headerStyle: {
                  backgroundColor: "#673ab7",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "white",
                },
                sorting: false,
                cellStyle: { fontSize: "1rem" },
                toolbarButtonAlignment: "left",
                showTextRowsSelected: false,
              }}
              actions={[
                {
                  icon: "approve",
                  position: "toolbarOnSelect",
                  onClick: (event, data) => onClickUpdateStatusBtn("APPROVED"),
                },
                {
                  icon: "refuse",
                  position: "toolbarOnSelect",
                  onClick: (event, data) => onClickUpdateStatusBtn("REFUSED"),
                },
              ]}
              onSelectionChange={(rows) => onSelectionChange(rows)}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              <FcMindMap size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Bài tập</Typography>}
        />
        <CardContent>
          <MaterialTable
            title=""
            columns={assignCols}
            tableRef={tableRef}
            localization={localization}
            data={assign}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "create") {
                  return (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.approveBtn}
                      style={{ marginTop: 16 }}
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                    >
                      Tạo mới
                    </Button>
                  );
                }
                if (props.action.icon === "delete") {
                  return (
                    <Button
                      className={classes.negativeBtn}
                      onClick={(event) => {
                        props.action.onClick(event, props.data);
                        event.stopPropagation();
                      }}
                    >
                      Xoá
                    </Button>
                  );
                }
              },
            }}
            options={{
              pageSize: 10,
              actionsColumnIndex: -1,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
                paddingLeft: 5,
                paddingRight: 5,
              },
              sorting: false,
              cellStyle: {
                fontSize: "1rem",
                whiteSpace: "normal",
                paddingLeft: 5,
                wordBreak: "break-word",
              },
              toolbarButtonAlignment: "left",
            }}
            actions={[
              {
                icon: "create",
                position: "toolbar",
                onClick: (event) => {
                  history.push(
                    `/edu/teacher/class/${params.id}/assignment/create`
                  );
                },
              },
              {
                icon: "delete",
                onClick: (event, rowData) => {
                  onDeleteAssignment(rowData);
                },
              },
            ]}
            onRowClick={(event, rowData) => {
              console.log(rowData);
              history.push(
                `/edu/teacher/class/${params.id}/assignment/${rowData.id}`
              );
            }}
          />
        </CardContent>
      </Card>
      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title="Xoá bài tập?"
        content={
          <Typography gutterBottom>
            <b>
              Cảnh báo: Bạn không thể hủy hành động này sau khi đã thực hiện.
            </b>
          </Typography>
        }
        actions={
          <Fragment>
            <Button
              color="primary"
              onClick={handleClose}
              className={classes.dialogDeleteBtn}
              onClick={onClickDialogDeleteBtn}
            >
              Xoá
            </Button>
            <PositiveButton
              variant="contained"
              color="primary"
              label="Huỷ"
              onClick={handleClose}
            />
          </Fragment>
        }
      />
    </MuiThemeProvider>
  );
}

export default TClassDetail;
