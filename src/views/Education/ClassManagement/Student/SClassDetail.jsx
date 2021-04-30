import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  //Typography,
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
import { Link as RouterLink } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

//import StudentCourseChapterList from "../../../../component/education/course/StudentCourseChapterList";
import StudentCourseChapterList from "../../../../component/education/course/StudentCourseChapterList";
import StudentCourseQuizList from "../../../../component/education/course/StudentCourseQuizList";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



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

  const [quizList, setQuizList] = useState([]);
  const [chapterList, setChapterList] = useState([]);

  // Table refs.
  const studentTableRef = useRef(null);
  const assignTableRef = useRef(null);

  //const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      field: "closeTime",
      title: "Hạn nộp",
      ...headerProperties,
      render: (rowData) => {
        let closeTime = new Date(rowData.closeTime);
        return displayTime(closeTime);
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
  const chapterColumns = [
    {
      title: "ChapterId",
      field: "chapterId",
      render: (rowData) => (
        <Link
          component={RouterLink}
          to={`/edu/student/course/chapter/detail/${rowData["chapterId"]}`}
        >
          {rowData["chapterId"]}
        </Link>
      ),
    },
    { title: "Chapter Name", field: "chapterName" },
  ];

  // Functions.
  const getClassDetail = () => {
    request(token, history, "get", `/edu/class/${params.id}`, (res) => {
      setClassDetail(res.data);
    });
  };
  const getQuizListOfClass = () => {
    //request(token, history, "get", `/get-quiz-of-class/${params.id}`, (res) => {
    request(
      token,
      history,
      "get",
      `/get-published-quiz-of-class/${params.id}`,
      (res) => {
        console.log("getQuizListOfClass, res.data = ", res.data);
        setQuizList(res.data);
      }
    );
  };

  const getChapterListOfClass = () => {
    //request(token, history, "get", `/get-quiz-of-class/${params.id}`, (res) => {
    request(
      token,
      history,
      "get",
      `/edu/class/get-chapters-of-class/${params.id}`,
      (res) => {
        console.log("getChapterListOfClass, res.data = ", res.data);
        setChapterList(res.data);
      }
    );
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

  const getAssign = () => {
    request(
      token,
      history,
      "get",
      `/edu/class/${params.id}/assignments/student`,
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
    getAssign();
    getQuizListOfClass();
    getChapterListOfClass();

    console.log("classDetail = ", classDetail);
  }, []);

  return (
    

    <MuiThemeProvider>
      <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Thông tin chung" {...a11yProps(0)} />
          <Tab label="Nội dung" {...a11yProps(1)} />
          <Tab label="Quiz" {...a11yProps(2)} />
          <Tab label="Sinh viên" {...a11yProps(3)} />
          <Tab label="Bài tập" {...a11yProps(4)} />
        </Tabs>
      </AppBar>


      <TabPanel value={value} index={0}>
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
      </TabPanel>


      <TabPanel value={value} index={1}>
        <Card>
          <CardContent>
          <MaterialTable
            title={"Chương"}
            columns={chapterColumns}
            data={chapterList}
          />
          </CardContent>
        </Card>
      </TabPanel>


      <TabPanel value={value} index={2}>
        <StudentCourseQuizList quizzList={quizList} />
      </TabPanel>

      <TabPanel value={value} index={3}>
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

      </TabPanel>
      

      <TabPanel value={value} index={4}>
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
      </TabPanel>
      
    </div>

      

     

      


      
    </MuiThemeProvider>
  );
}

export default SClassDetail;
