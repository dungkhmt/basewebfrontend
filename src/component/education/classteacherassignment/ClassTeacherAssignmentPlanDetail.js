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
import ClassForAssignmentList from "./ClassForAssignmentList";

const tempCourseInfo = {
  /* 'id': 'IT3011',
    'courseName': 'Cấu trúc dữ liệu và giải thuật',
    'credit': '3' */
  id: "0",
  courseName: "0",
  credit: "0",
};

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

export default function ClassTeacherAssignmentPlanDetail(props) {
  let param = useParams();
  let planId = param.planId;
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [plan, setPlan] = useState([]);

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

  async function getClassTeacherAssignmentPlanDetail() {
    let datasend = { planId: planId };
    request(
      // token,
      // history,
      "get",
      "get-class-teacher-assignment-plan/detail/" + planId,
      (res) => {
        setPlan(res.data);
      },
      { 401: () => {} }
    );
    console.log(datasend);
  }
  useEffect(() => {
    getClassTeacherAssignmentPlanDetail();
  }, []);

  return plan ? (
    <>
      <Typography variant="h5">{`${plan.planName}`}</Typography>

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
        <ClassForAssignmentList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        Tab2
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        Tab3
      </TabPanel>
      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        Tab4
      </TabPanel>
      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        Tab5
      </TabPanel>
      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        Tab6
      </TabPanel>
      <TabPanel value={selectedTab} index={6} dir={theme.direction}>
        Tab7
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
