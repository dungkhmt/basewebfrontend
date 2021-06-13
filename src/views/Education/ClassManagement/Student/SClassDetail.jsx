import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { request } from "../../../../api";
import AssignmentTab from "../../../../component/education/classmanagement/student/AssignmentTab";
import QuizzTab from "../../../../component/education/classmanagement/student/QuizzTab";
import StudentListTab from "../../../../component/education/classmanagement/student/StudentListTab";

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#1890ff",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

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
    "aria-controls": `simple-tabpanel-${index}`,
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
        <AntTabs
          value={activeTab}
          onChange={handleChange}
          aria-label="ant tabs"
          centered
        >
          <AntTab label="Thông tin chung" {...a11yProps(0)} />
          <AntTab label="Nội dung" {...a11yProps(1)} />
          <AntTab label="Quiz" {...a11yProps(2)} />
          <AntTab label="Sinh viên" {...a11yProps(3)} />
          <AntTab label="Bài tập" {...a11yProps(4)} />
        </AntTabs>
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
        <QuizzTab classId={params.id} />
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
