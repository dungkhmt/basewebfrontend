import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Paper,
  Collapse,
  Badge,
  CardActionArea,
  Grid,
  Link,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { MuiThemeProvider } from "material-ui/styles";
import { useParams } from "react-router";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { Avatar, IconButton } from "material-ui";
import {
  FcMindMap,
  FcCollapse,
  FcExpand,
  FcConferenceCall,
} from "react-icons/fc";
import { BiDetail } from "react-icons/bi";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
}));

function SClassDetail() {
  const classes = useStyles();
  const params = useParams();

  const history = useHistory();

  const [openStudentList, setOpenStudentList] = useState(false);
  const [] = useState(false);

  const [classDetail] = useState({
    id: params.id,
    courseId: "IT3011",
    courseName: "Cấu trúc dữ liệu và thuật toán",
  });

  // Tables.
  const exerciseListCols = [
    {
      field: "id",
      title: "Mã bài tập",
      headerStyle: {
        textAlign: "center",
      },
      width: 150,
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
            title={
              <Typography variant="h5">
                Danh sách sinh viên cùng cảnh ngộ
              </Typography>
            }
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
            onRowClick={(event, rowData) => {
              console.log(rowData);
              history.push(
                `/edu/student/class/${params.id}/exercise/717729ee-fe55-11ea-8b6c-0862665303f9`
              );
              // ${rowData.id}
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default SClassDetail;
