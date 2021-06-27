import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { Fragment, useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { request } from "../../../../api";
import AssignmentTab from "../../../../component/education/classmanagement/student/AssignmentTab";
import QuizTab from "../../../../component/education/classmanagement/student/QuizTab";
import StudentListTab from "../../../../component/education/classmanagement/student/StudentListTab";
import {
  a11yProps,
  StyledTab,
  StyledTabs,
  TabPanel,
} from "../../../../component/tab";

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
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function SClassDetail() {
  const classes = useStyles();
  const params = useParams();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [classDetail, setClassDetail] = useState({});

  const [chapterList, setChapterList] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, tabIndex) => {
    setActiveTab(tabIndex);
  };

  const chapterColumns = [
    {
      title: "Chương",
      field: "chapterId",
      render: (rowData) => (
        <Link
          component={RouterLink}
          to={`/edu/student/course/chapter/detail/${rowData["chapterId"]}`}
        >
          {rowData["chapterName"]}
        </Link>
      ),
    },
  ];

  // Functions.
  const getClassDetail = () => {
    request(
      // token, history,
      "get",
      `/edu/class/${params.id}`,
      (res) => {
        setClassDetail(res.data);
      }
    );
  };

  const getChapterListOfClass = () => {
    //request(token, history, "get", `/get-quiz-of-class/${params.id}`, (res) => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/get-chapters-of-class/${params.id}`,
      (res) => {
        console.log("getChapterListOfClass, res.data = ", res.data);
        setChapterList(res.data);
      }
    );
  };

  useEffect(() => {
    getClassDetail();
    getChapterListOfClass();
    // console.log("classDetail = ", classDetail);
  }, []);

  return (
    <Fragment>
      <div className={classes.tabs}>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          aria-label="ant tabs"
          centered
        >
          <StyledTab label="Thông tin chung" {...a11yProps(0)} />
          <StyledTab label="Nội dung" {...a11yProps(1)} />
          <StyledTab label="Quiz" {...a11yProps(2)} />
          <StyledTab label="Sinh viên" {...a11yProps(3)} />
          <StyledTab label="Bài tập" {...a11yProps(4)} />
        </StyledTabs>
        <Typography className={classes.padding} />
      </div>

      <TabPanel value={activeTab} index={0}>
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

      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <MaterialTable
              title={"Chương"}
              columns={chapterColumns}
              data={chapterList}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
            />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <QuizTab classId={params.id} />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <StudentListTab classId={params.id} />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <AssignmentTab classId={params.id} />
      </TabPanel>
    </Fragment>
  );
}

export default SClassDetail;
