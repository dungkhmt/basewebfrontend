import React, { useRef, useEffect, useState } from "react";
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
import { authGet, axiosGet, axiosPut } from "../../../../api";
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

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  refuseBtn: {
    borderRadius: "6px",
    textTransform: "none",
    fontSize: "1rem",
    marginLeft: 10,
    marginRight: 10,
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  approveBtn: {
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#1834d2",
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
  const theme = useTheme();
  const params = useParams();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [classDetail, setClassDetail] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Tables.
  const [assignment, setAssignments] = useState([]);
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
            variant="outlined"
            color="secondary"
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
    axiosGet(token, `/edu/class/${params.id}`)
      .then((res) => setClassDetail(res.data))
      .catch((e) => alert("error"));
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
      .then((res) => setAssignments(res.data))
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
              localization={{
                body: {
                  emptyDataSourceMessage: "",
                },
                toolbar: {
                  searchPlaceholder: "Tìm kiếm",
                  searchTooltip: "Tìm kiếm",
                },
                pagination: {
                  hover: "pointer",
                  labelRowsSelect: "hàng",
                  labelDisplayedRows: "{from}-{to} của {count}",
                  nextTooltip: "Trang tiếp",
                  lastTooltip: "Trang cuối",
                  firstTooltip: "Trang đầu",
                  previousTooltip: "Trang trước",
                },
              }}
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
              localization={{
                body: {
                  emptyDataSourceMessage: "",
                },
                toolbar: {
                  searchPlaceholder: "Tìm kiếm",
                  searchTooltip: "Tìm kiếm",
                },
                pagination: {
                  hover: "pointer",
                  labelRowsSelect: "hàng",
                  labelDisplayedRows: "{from}-{to} của {count}",
                  nextTooltip: "Trang tiếp",
                  lastTooltip: "Trang cuối",
                  firstTooltip: "Trang đầu",
                  previousTooltip: "Trang trước",
                },
              }}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
                Action: (props) => {
                  if (props.action.icon === "refuse") {
                    return (
                      <Button
                        variant="outlined"
                        className={classes.refuseBtn}
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
            localization={{
              header: {
                actions: "",
              },
              body: {
                emptyDataSourceMessage: "",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                searchTooltip: "Tìm kiếm",
              },
              pagination: {
                hover: "pointer",
                labelRowsSelect: "hàng",
                labelDisplayedRows: "{from}-{to} của {count}",
                nextTooltip: "Trang tiếp",
                lastTooltip: "Trang cuối",
                firstTooltip: "Trang đầu",
                previousTooltip: "Trang trước",
              },
            }}
            data={assignment}
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
                      variant="outlined"
                      color="secondary"
                      style={{ fontSize: "bold" }}
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
                  // history.push(
                  //   `/edu/teacher/class/${params.id}/assignment/create`
                  // );
                },
              },
              {
                icon: "delete",
                tooltip: "Delete User",
                onClick: (event, rowData) =>
                  alert("You want to delete " + rowData.name),
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
    </MuiThemeProvider>
  );
}

export default TClassDetail;
