import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Paper,
  Collapse,
  CardActionArea,
  Grid,
  Link,
  Divider,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { MuiThemeProvider } from "material-ui/styles";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, IconButton } from "material-ui";
import {
  FcMindMap,
  FcCollapse,
  FcExpand,
  FcConferenceCall,
} from "react-icons/fc";
import { BiDetail } from "react-icons/bi";
import { request } from "../../../../api";
import displayTime from "../../../../utils/DateTimeUtils";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  divider: {
    width: "91.67%",
    marginTop: 16,
    marginBottom: 16,
  },
  rootDivider: {
    backgroundColor: "black",
  },
}));

function SClassDetail() {
  const classes = useStyles();
  const params = useParams();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [classDetail, setClassDetail] = useState({});

  // Tables.
  const [assigns, setAssigns] = useState([]);
  const [students, setStudents] = useState([]);

  const [openStudentList, setOpenStudentList] = useState(false);

  // Table refs.
  const studentTableRef = useRef(null);
  const assignTableRef = useRef(null);

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
    // {
    //   field: "id",
    //   title: "Mã bài tập",
    //   headerStyle: {
    //     textAlign: "center",
    //   },
    //   width: 150,
    //   cellStyle: {
    //     textAlign: "center",
    //     fontSize: "1rem",
    //     padding: 5,
    //   },
    // },
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
        let deadline = new Date(rowData.deadLine);
        return displayTime(deadline);
      },
    },
  ];

  const studentCols = [
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

  // Functions.
  const getClassDetail = () => {
    request(token, history, "get", `/edu/class/${params.id}`, (res) => {
      setClassDetail(res.data);
    });
  };

  const getStudentsOfClass = () => {
    request(
      token,
      history,
      "get",
      `/edu/class/${params.id}/students`,
      (res) => {
        changePageSize(res.data.length, studentTableRef);
        setStudents(res.data);
      }
    );
  };

  const getAssignments = () => {
    request(
      token,
      history,
      "get",
      `/edu/class/${params.id}/assignments`,
      (res) => {
        changePageSize(res.data.length, assignTableRef);
        setAssigns(res.data);
      }
    );
  };

  const onCLickStudentCard = () => {
    if (false == openStudentList && 0 == students.length) {
      getStudentsOfClass();
    }

    setOpenStudentList(!openStudentList);
  };

  useEffect(() => {
    getClassDetail();
    getAssignments();
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
            <Grid item md={3} sm={3} xs={3} direction="column">
              <Typography>Mã lớp</Typography>
              <Typography>Mã học phần</Typography>
              <Typography>Tên học phần</Typography>
              <Typography>Loại lớp</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.code}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.courseId}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.name}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.classType}
              </Typography>
            </Grid>

            <div className={classes.divider}>
              <Divider
                variant="fullWidth"
                classes={{ root: classes.rootDivider }}
              />
            </div>

            <Grid item md={3} sm={3} xs={3}>
              <Typography>Giảng viên</Typography>
              <Typography>Email</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {classDetail.teacherName}
              </Typography>
              <div
                style={{
                  display: "flex",
                  fontSize: "1rem",
                }}
              >
                <b>:&nbsp;</b>
                {
                  <Link href={`mailto:${classDetail.email}`}>
                    {classDetail.email}
                  </Link>
                }
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardActionArea disableRipple onClick={onCLickStudentCard}>
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
              columns={studentCols}
              icons={tableIcons}
              tableRef={studentTableRef}
              localization={localization}
              data={students}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              options={{
                filtering: true,
                search: false,
                pageSize: 10,
                debounceInterval: 500,
                headerStyle: {
                  backgroundColor: "#673ab7",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "white",
                },
                filterCellStyle: { textAlign: "center" },
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
            columns={assignCols}
            localization={localization}
            tableRef={assignTableRef}
            data={assigns}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              pageSize: 10,
              search: false,
              debounceInterval: 300,
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
            onRowClick={(event, rowData) => {
              // console.log(rowData);
              history.push(
                `/edu/student/class/${params.id}/assignment/${rowData.id}`
              );
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default SClassDetail;