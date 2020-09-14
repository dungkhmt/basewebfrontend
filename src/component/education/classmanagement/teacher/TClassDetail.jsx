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
import { FcApproval, FcMindMap, FcViewDetails } from "react-icons/fc";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { motion } from "framer-motion";
import { BiDetail } from "react-icons/bi";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
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
    },
    {
      id: 20172976,
      name: "Lê Văn Cường",
      email: "cuong.lv172976@sis.hust.edu.vn",
    },
  ];

  const tableRef = useRef(null);

  // Functions.
  const onClickRegistrationBtn = (e) => {
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
          <Grid container>
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
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ffeb3b" }}>
              <PeopleAltRoundedIcon />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách sinh viên</Typography>}
          action={
            <div>
              <IconButton
                onClick={() => setOpenStudentList(!openStudentList)}
                aria-label="show more"
              >
                {openStudentList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          }
        />
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
                  nRowsSelected: "",
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
                  if (props.action.icon === "remove") {
                    return (
                      <Button
                        color="secondary"
                        variant="outlined"
                        size="large"
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      >
                        Loại khỏi lớp
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
                // rowStyle: {
                //   textAlign: "left",
                // },
                toolbarButtonAlignment: "left",
              }}
              actions={[
                {
                  icon: "remove",
                  position: "toolbarOnSelect",
                  onClick: (event, data) => console.log("click"),
                },
              ]}
              onSelectionChange={(rows) => {
                // setData(
                //   data.map((row) =>
                //     selectedRows.find(
                //       (selected) => selected.classId === row.classId
                //     )
                //       ? { ...row, tableData: { checked: true } }
                //       : row
                //   )
                // );
                // setSelectedRows(rows);
                console.log(rows);
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Card className={classes.card}>
        {/* <CardActionArea
          onClick={() => setOpenRegistrationList(!openRegistrationList)}
        > */}
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
              <IconButton
                onClick={() => setOpenRegistrationList(!openRegistrationList)}
                aria-label="show more"
              >
                {openRegistrationList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          }
        />
        {/* </CardActionArea> */}
        <Collapse in={openRegistrationList} timeout="auto">
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
                  nRowsSelected: "",
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
                        size="large"
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
                        size="large"
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
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                    >
                      Tạo mới
                    </Button>
                  );
                }
              },
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
              cellStyle: {
                fontSize: "1rem",
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
              toolbarButtonAlignment: "left",
            }}
            actions={[
              {
                icon: "create",
                position: "toolbar",
                onClick: (event) => {
                  history.push({
                    pathname: "/edu/teacher/exercise/create",
                    state: {},
                  });
                },
              },
            ]}
            onRowClick={(event, rowData) => {
              console.log(rowData);
              history.push({
                pathname: `/edu/teacher/exercise/${rowData.id}`,
                state: {},
              });
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default TClassDetail;
