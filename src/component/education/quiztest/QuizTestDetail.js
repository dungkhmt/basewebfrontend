import { Box, Typography } from "@material-ui/core/";
import { teal } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FcCalendar, FcClock } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { authGet, request } from "../../../api";
import { addZeroBefore } from "../../../utils/dateutils";
import PrimaryButton from "../../button/PrimaryButton";
import TertiaryButton from "../../button/TertiaryButton";
import { AntTab } from "../../tab/AntTab";
import { AntTabs } from "../../tab/AntTabs";
import QuizListForAssignment from "./QuizListForAssignment";
import QuizTestGroupList from "./QuizTestGroupList";
import QuizTestGroupParticipants from "./QuizTestGroupParticipants";
import QuizTestJoinRequestList from "./QuizTestJoinRequestList";
import QuizTestStudentListResult from "./QuizTestResultList";
import QuizTestStudentList from "./QuizTestStudentList";

const tempCourseInfo = {
  /* 'id': 'IT3011',
    'courseName': 'Cấu trúc dữ liệu và giải thuật',
    'credit': '3' */
  id: "0",
  courseName: "0",
  credit: "0",
};

/* const tempStudentList = [
    {
        'MSSV': '20180000',
        'name': 'Nguyễn Văn A',
        'emal': 'abcAAA@gmail.com'
    },
    {
        'MSSV': '20180001',
        'name': 'Nguyễn Văn B',
        'emal': 'abcBBB@gmail.com'
    },
    {
        'MSSV': '20180002',
        'name': 'Nguyễn Văn C',
        'emal': 'abcCCC@gmail.com'
    },
    {
        'MSSV': '20180003',
        'name': 'Nguyễn Văn D',
        'emal': 'abcDDD@gmail.com'
    },
] */

const useStyles = makeStyles((theme) => ({
  btn: { width: 180, marginLeft: theme.spacing(1) },
  courseName: { fontWeight: theme.typography.fontWeightMedium },
  editBtn: {
    margin: theme.spacing(2),
    width: 100,
    fontWeight: theme.typography.fontWeightRegular,
  },
  testName: { fontSize: "1.25rem", paddingTop: theme.spacing(1) },
  time: {
    paddingLeft: 6,
    color: teal[800],
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: "1rem",
  },
}));

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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

const tabsLabel = [
  "Thí sinh",
  "Thí sinh đăng ký",
  "Đề",
  "Phân đề cho thí sinh",
  "DS quiz",
  "Kết quả",
  "Kết quả tổng quát",
];

const weekDay = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export default function QuizTestDetail(props) {
  let param = useParams();
  let testId = param.id;
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [testInfo, setTestInfo] = useState([]);
  const [courseInfo, setCourseInfo] = useState();

  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();

  //
  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setSelectedTab(index);
  };

  // function handleEditQuizTes() {
  //   history.push("/edu/class/quiztest/edit/" + testId);
  // }

  async function handleAssignStudents2QuizGroup() {
    let datasend = { quizTestId: testId };
    request(
      // token,
      // history,
      "post",
      "auto-assign-participants-2-quiz-test-group",
      (res) => {
        console.log("assign students to groups ", res);
        alert("assign students to groups " + res.data);
      },
      { 401: () => {} },
      datasend
    );
    console.log(datasend);
  }
  async function handleAssignQuestions2QuizGroup() {
    let datasend = { quizTestId: testId, numberQuestions: 10 };
    request(
      // token,
      // history,
      "post",
      "auto-assign-question-2-quiz-group",
      (res) => {
        console.log("assign questions to groups ", res);
        alert("assign questions to groups " + res.data);
      },
      { 401: () => {} },
      datasend
    );
    console.log(datasend);
  }

  async function getQuizTestDetail() {
    //do something to get test info from param.id
    let res = await authGet(
      dispatch,
      token,
      "/get-quiz-test?testId=" + param.id
    );

    // Format scheduleDateTime.
    const date = new Date(res.scheduleDatetime);
    const currentTime = new Date();
    const year =
      currentTime.getFullYear() === date.getFullYear()
        ? ""
        : ` ${date.getFullYear()},`;

    const scheduleDateTime = `${
      weekDay[date.getDay()]
    }, ${date.getDate()} Tháng ${
      date.getMonth() + 1
    },${year} lúc ${addZeroBefore(date.getHours(), 2)}:${addZeroBefore(
      date.getMinutes(),
      2
    )}`;

    setTestInfo({
      testId: res.testId,
      classId: res.classId,
      courseId: res.courseId,
      duration: res.duration,
      scheduleDateTime: scheduleDateTime,
      testName: res.testName,
    });

    //do something to get course info from testInfo.courseId
    /* request(
      // token, history, 
      "get", `/edu/class/${re.classId}`, (res) => {
            tempCourseInfo.id = res.data.courseId;
            tempCourseInfo.courseName = res.data.name;
        }); */

    let re2 = await authGet(dispatch, token, `/edu/class/${res.classId}`);
    tempCourseInfo.id = re2.courseId;
    tempCourseInfo.courseName = re2.name;

    setCourseInfo(tempCourseInfo);
  }

  useEffect(() => {
    getQuizTestDetail();
  }, []);

  return courseInfo ? (
    <>
      <Typography
        variant="h5"
        className={classes.courseName}
      >{`${courseInfo.courseName} (${courseInfo.id})`}</Typography>
      <Typography
        variant="subtitle1"
        className={classes.testName}
      >{`${testInfo.testName}`}</Typography>

      {/*  */}
      <Box display="flex" alignItems="center" pt={2}>
        {/*  */}
        <FcClock size={24} />
        <Typography
          component="span"
          className={classes.time}
        >{`${testInfo.duration} phút`}</Typography>

        {/*  */}
        <FcCalendar size={24} style={{ marginLeft: 40 }} />
        <Typography
          component="span"
          className={classes.time}
        >{`${testInfo.scheduleDateTime}`}</Typography>

        <TertiaryButton
          className={classes.editBtn}
          component={RouterLink}
          to={`/edu/class/quiztest/edit/${testId}`}
        >
          Chỉnh sửa
        </TertiaryButton>
      </Box>

      <br />
      <br />

      <Box display="flex" justifyContent="flex-end">
        <PrimaryButton
          className={classes.btn}
          onClick={(e) => {
            handleAssignStudents2QuizGroup(e);
          }}
        >
          Phân đề cho SV
        </PrimaryButton>

        <PrimaryButton
          className={classes.btn}
          onClick={(e) => {
            handleAssignQuestions2QuizGroup(e);
          }}
        >
          Phân câu hỏi cho đề
        </PrimaryButton>
      </Box>

      <br />

      <AntTabs
        value={selectedTab}
        onChange={handleChangeTab}
        aria-label="ant example"
        scrollButtons="auto"
      >
        {tabsLabel.map((label, idx) => (
          <AntTab label={label} {...a11yProps(idx)} />
        ))}
      </AntTabs>

      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <QuizTestStudentList testId={param.id} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <QuizTestJoinRequestList testId={param.id} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <QuizTestGroupList testId={param.id} />
      </TabPanel>
      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        <QuizTestGroupParticipants testId={param.id} />
      </TabPanel>
      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        <QuizListForAssignment testId={param.id} />
      </TabPanel>
      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        <QuizTestStudentListResult testId={param.id} isGeneral={false} />
      </TabPanel>
      <TabPanel value={selectedTab} index={6} dir={theme.direction}>
        <QuizTestStudentListResult testId={param.id} isGeneral={true} />
      </TabPanel>
    </>
  ) : (
    // Loading screen
    <>
      <Typography variant="h5" className={classes.courseName}>
        <Skeleton width={400} variant="rect" animation="wave" />
      </Typography>
      <Typography variant="subtitle1" className={classes.testName}>
        <Skeleton width={200} variant="rect" animation="wave" />
      </Typography>

      {/*  */}
      <Box display="flex" alignItems="center" pt={2}>
        {/*  */}
        <Skeleton width={24} height={24} variant="circle" animation="wave" />
        <Typography component="span" className={classes.time}>
          <Skeleton width={80} variant="rect" animation="wave" />
        </Typography>
      </Box>
    </>
  );
}
