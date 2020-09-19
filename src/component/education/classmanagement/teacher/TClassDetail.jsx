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
import { authGet } from "../../../../api";
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
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -10,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

function TClassDetail() {
  const classes = useStyles();
  const theme = useTheme();
  const params = useParams();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [openStudentList, setOpenStudentList] = useState(false);
  const [openRegistrationList, setOpenRegistrationList] = useState(false);

  const [classDetail, setClassDetail] = useState({
    id: params.id,
    courseId: "IT3011",
    courseName: "Cấu trúc dữ liệu và thuật toán",
  });

  const exerciseListCols = [
    {
      field: "id",
      title: "Mã bài tập",
      width: 150,
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
        padding: 5,
      },
    },
    {
      field: "name",
      title: "Tên bài tập",
    },
    {
      field: "note",
      title: "Ghi chú",
    },
  ];

  const exercises = [
    {
      id: "BT1",
      name: "Luyện tập python",
      note: "Bài tập khởi động",
    },
    {
      id: "BT2",
      name: "Mô hình hóa",
      note: "Bài tập nâng cao",
    },
  ];

  const studentListCols = [
    {
      field: "id",
      title: "Mã sinh viên",
      width: 172,
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
      },
    },
    {
      field: "name",
      title: "Họ và tên",
    },
    {
      field: "phoneNumber",
      title: "Số điện thoại",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
      },
    },
    {
      field: "email",
      title: "Email",
      render: (rowData) => (
        <Link href={`mailto:${rowData.email}`}>{rowData.email}</Link>
      ),
    },
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

  const entrantListCols = [
    {
      field: "id",
      title: "Mã sinh viên",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
      },
    },
    {
      field: "name",
      title: "Họ và tên",
    },
    {
      field: "email",
      title: "Email",
    },
  ];

  const studentList = [
    {
      id: 20173441,
      name: "Lê Anh Tuấn",
      email: "anhtuan0126104@gmail.com",
      phoneNumber: "0969826785",
    },
    {
      id: 20172976,
      name: "Lê Văn Cường",
      email: "cuong.lv172976@sis.hust.edu.vn",
      phoneNumber: "0357762225",
    },
  ];

  const tableRef = useRef(null);

  // Functions.
  const onClickRemoveBtn = (e) => {
    console.log("Click button", e);
  };

  useEffect(() => {
    tableRef.current.dataManager.changePageSize(20);
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
            <Grid item md={9} sm={9} xs={9}>
              <Typography>
                <b>:</b> {classDetail.id}
              </Typography>
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Mã học phần</Typography>
            </Grid>
            <Grid item md={9} sm={9} xs={9}>
              <Typography>
                <b>:</b> {classDetail.courseId}
              </Typography>
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Typography>Tên học phần</Typography>
            </Grid>
            <Grid item md={9} sm={9} xs={9}>
              <Typography>
                <b>:</b> {classDetail.courseName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardActionArea
          disableRipple
          onClick={() => setOpenStudentList(!openStudentList)}
        >
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
                  {openStudentList ? (
                    <FcCollapse size={24} />
                  ) : (
                    <FcExpand size={24} />
                  )}
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openStudentList} timeout="auto">
          <CardContent>
            <MaterialTable
              title=""
              columns={studentListCols}
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
              data={studentList}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              options={{
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
          onClick={() => setOpenRegistrationList(!openRegistrationList)}
        >
          <CardHeader
            avatar={
              <Avatar style={{ background: "white" }}>
                <FcApproval size={40} />
              </Avatar>
            }
            title={
              <StyledBadge badgeContent={studentList.length} color="error">
                Phê duyệt sinh viên đăng ký
              </StyledBadge>
            }
            titleTypographyProps={{
              variant: "h5",
            }}
            action={
              <div>
                <IconButton aria-label="show more">
                  {openRegistrationList ? (
                    <FcCollapse size={24} />
                  ) : (
                    <FcExpand size={24} />
                  )}
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openRegistrationList} timeout="auto">
          <CardContent>
            <MaterialTable
              title=""
              columns={entrantListCols}
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
              data={studentList}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
                Action: (props) => {
                  if (props.action.icon === "refuse") {
                    return (
                      <Button
                        color="secondary"
                        variant="outlined"
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
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                        }}
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
                  icon: "refuse",
                  position: "toolbarOnSelect",
                  onClick: (event, data) => console.log("click"),
                },
                {
                  icon: "approve",
                  position: "toolbarOnSelect",
                  onClick: (event, data) => console.log("click"),
                },
              ]}
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
            columns={exerciseListCols}
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
            data={exercises}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "create") {
                  return (
                    <Button
                      variant="contained"
                      color="primary"
                      // startIcon={<AddCircleOutlineIcon />}
                      style={{
                        fontSize: "bold",
                        // background: "green",
                        // color: "white",
                      }}
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
                    `/edu/teacher/class/${params.id}/exercise/create`
                  );
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
                `/edu/teacher/class/${params.id}/exercise/${rowData.id}`
              );
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default TClassDetail;
