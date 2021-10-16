import { Box, CircularProgress, Typography } from "@material-ui/core/";
import { teal } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { request } from "../../../api";
import PrimaryButton from "../../button/PrimaryButton";
import { a11yProps, AntTab, AntTabs, TabPanel } from "../../tab";
import ClassesAssignToATeacherList from "./ClassesAssignToATeacherList";
import ClassForAssignmentList from "./ClassForAssignmentList";
import ClassTeacherAssignmentSolutionList from "./ClassTeacherAssignmentSolutionList";
import ConflictClassesAssignedToTeacherInSolution from "./ConflictClassesAssignedToTeacherInSolution";
import NotAssignedClassInSolutionList from "./NotAssignedClassInSolutionList";
import PairConflictTimetableClass from "./PairConflictTimetableClass";
import TeacherBasedTimeTableAssignmentInSolution from "./TeacherBasedTimeTableAssignmentInSolution";
import TeacherCourseForAssignmentList from "./TeacherCourseForAssignmentList";
import TeacherCourseList from "./TeacherCourseList";
import TeacherForAssignmentPlanList from "./TeacherForAssignmentPlanList";
import TeacherList from "./TeacherList";

const useStyles = makeStyles((theme) => ({
  btn: {
    // width: 180,
    marginLeft: theme.spacing(1),
  },
  courseName: { fontWeight: theme.typography.fontWeightMedium },
  // editBtn: {
  //   margin: theme.spacing(2),
  //   width: 100,
  //   fontWeight: theme.typography.fontWeightRegular,
  // },
  testName: { fontSize: "1.25rem", paddingTop: theme.spacing(1) },
  time: {
    paddingLeft: 6,
    color: teal[800],
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: "1rem",
  },
}));

const tabsLabel = [
  "DS lớp",
  "Giáo viên",
  "Giáo viên trong KH",
  "Giáo viên-môn",
  "Giáo viên-môn trong KH",
  "Kết quả phân công",
  "Lớp chưa được phân công",
];

export default function ClassTeacherAssignmentPlanDetail() {
  let param = useParams();
  let planId = param.planId;
  const classes = useStyles();

  const [plan, setPlan] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();

  //
  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  async function handleAssignTeacher2Class(solver) {
    //alert("handleAssignTeacher2Class, solver = " + solver);

    setIsProcessing(true);

    let data = { planId: planId, solver: solver };
    // console.log(data);

    request(
      // token,
      // history,
      "post",
      "auto-assign-teacher-2-class",
      (res) => {
        //alert("assign teacher to class " + res.data);
        setIsProcessing(false);
      },
      { 401: () => {} },
      data
    );
  }

  useEffect(() => {
    function getClassTeacherAssignmentPlanDetail() {
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
    }

    getClassTeacherAssignmentPlanDetail();
  }, []);

  return plan ? (
    <>
      <Typography variant="h5">{`${plan.planName}`}</Typography>

      <Box display="flex" justifyContent="flex-end">
        <PrimaryButton
          // className={classes.btn}
          onClick={(e) => {
            handleAssignTeacher2Class("SCORES");
          }}
        >
          Phân công tối ưu thói quen
        </PrimaryButton>
        <PrimaryButton
          // className={classes.btn}
          onClick={(e) => {
            handleAssignTeacher2Class("PRIORITY");
          }}
        >
          Phân công tối ưu độ ưu tiên
        </PrimaryButton>
        <PrimaryButton
          // className={classes.btn}
          onClick={(e) => {
            handleAssignTeacher2Class("WORKDAYS");
          }}
        >
          Phân công tối ưu ngày dạy
        </PrimaryButton>
      </Box>

      {isProcessing ? <CircularProgress /> : ""}
      <AntTabs
        value={selectedTab}
        onChange={handleChangeTab}
        aria-label="ant example"
        scrollButtons="auto"
        variant="scrollable"
      >
        {tabsLabel.map((label, idx) => (
          <AntTab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </AntTabs>

      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <ClassForAssignmentList planId={planId} />
        <PairConflictTimetableClass planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <TeacherList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <TeacherForAssignmentPlanList planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        <TeacherCourseList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        <TeacherCourseForAssignmentList planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        <TeacherBasedTimeTableAssignmentInSolution planId={planId} />
        <ClassTeacherAssignmentSolutionList
          planId={planId}
          planName={plan.planName}
        />

        <ConflictClassesAssignedToTeacherInSolution planId={planId} />
        <ClassesAssignToATeacherList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={6} dir={theme.direction}>
        <NotAssignedClassInSolutionList planId={planId} />
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

      <Box display="flex" alignItems="center" pt={2}>
        <Skeleton width={24} height={24} variant="circle" animation="wave" />
        <Typography component="span" className={classes.time}>
          <Skeleton width={80} variant="rect" animation="wave" />
        </Typography>
      </Box>
    </>
  );
}
