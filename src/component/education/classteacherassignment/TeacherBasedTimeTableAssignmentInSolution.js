import { Card } from "@material-ui/core/";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import map from "lodash/map";
import range from "lodash/range";
import React, { useEffect, useState } from "react";
import { request } from "../../../api";
import PrimaryButton from "../../button/PrimaryButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const defaultProps = {
  bgcolor: "background.paper",
  style: { width: "5rem", height: "2rem" },
  borderColor: "text.primary",
};
const listSession = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const WU = 1.3;
const SU = 8;
function TimeTableHeaderDay(props) {
  let w = 12;
  return (
    <div>
      <div>
        <Box display="flex" justifyContent="center">
          <Box border={1} width={w * WU + "rem"} height={"2rem"}>
            Thứ {props.day}
          </Box>
        </Box>
      </div>
      <div>
        <Box display="flex" justifyContent="center">
          {listSession.map((e, i) => {
            return <BoxClass sz={1} code={i + 1} />;
          })}
        </Box>
      </div>
    </div>
  );
}
function TimeTableHeaderSpaceLeft() {
  return (
    <div>
      <div>
        <BoxClass code={""} sz={SU} />
      </div>
      <div>
        <BoxClass code={""} sz={SU} />
      </div>
    </div>
  );
}
function TimeTableHeader() {
  return (
    <Box display="flex" justifyContent="left">
      <TimeTableHeaderSpaceLeft />
      <TimeTableHeaderDay day={2} />
      <TimeTableHeaderDay day={3} />
      <TimeTableHeaderDay day={4} />
      <TimeTableHeaderDay day={5} />
      <TimeTableHeaderDay day={6} />
    </Box>
  );
}
function BoxClass(props) {
  function handleClick() {
    alert("Class " + props.code);
    //props.root.suggestTeacherListForClass(props.code);

    let datasend = {
      classId: props.code,
      planId: props.planId,
    };
    request(
      // token,
      // history,
      "post",
      "get-suggested-teacher-and-actions-for-class",
      (res) => {
        alert("suggested teacher list: " + JSON.stringify(res.data));
      },
      { 401: () => {} },
      datasend
    );
  }

  return (
    <Box
      border={1}
      width={props.sz * WU + "rem"}
      height={"2rem"}
      bgcolor={props.bgcolor}
      onClick={() => {
        handleClick();
      }}
    >
      {props.code}
    </Box>
  );
}

function TimeTableSpace(props) {
  return (
    <Box display="flex" justifyContent="center">
      {map(range(props.sz), (_) => {
        return <Box border={1} height={"2rem"} width={WU + "rem"}></Box>;
      })}
    </Box>
  );
}
function TimeTableElement(props) {
  return (
    <Box display="flex" justifyContent="left">
      <BoxClass code={props.teacherId} sz={SU} />
      {props.list.map((e, i) => {
        return (
          <Box display="flex" justifyContent="center">
            <TimeTableSpace sz={e.startIndexFromPrevious} />
            <BoxClass
              code={e.classCode}
              planId={props.planId}
              sz={e.duration}
              bgcolor={"text.secondary"}
              root={props.root}
            />
          </Box>
        );
      })}
      <TimeTableSpace sz={props.remainEmptySlots} />
    </Box>
  );
}
function TimeTable(props) {
  //const root = props.root;
  console.log("TimeTable data = " + JSON.stringify(props.data));
  //console.log("TimeTable planId (from root) = " + root.planId);
  return (
    <div>
      {props.data.map((e, i) => {
        return (
          <Box display="flex" justifyContent="left">
            <TimeTableElement
              list={e.classList}
              planId={props.planId}
              teacherId={e.teacherId}
              remainEmptySlots={e.remainEmptySlots}
              root={props.root}
            />
          </Box>
        );
      })}
    </div>
  );
}
function TeacherBasedTimeTableAssignmentInSolution(props) {
  const planId = props.planId;
  const classes = useStyles();
  const [dataTimeTable, setDataTimeTable] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [openSuggestion, setOpenSuggestion] = React.useState(false);

  const data = [
    {
      teacherId: "dung.phamquang@hust.edu.vn",
      classes: [
        { classCode: "110222", startIndexFromPrevious: 2, duration: 4 },
        { classCode: "324593", startIndexFromPrevious: 7, duration: 2 },
      ],
    },
    {
      teacherId: "trung.buiquoc@hust.edu.vn",
      classes: [
        { classCode: "420222", startIndexFromPrevious: 1, duration: 4 },
        { classCode: "324400", startIndexFromPrevious: 2, duration: 4 },
        { classCode: "324900", startIndexFromPrevious: 3, duration: 4 },
      ],
    },
  ];
  async function getDataTimeTableList() {
    request(
      // token,
      // history,
      "GET",
      //"/get-classes-assigned-to-a-teacher-solution/" + planId,
      "/get-classes-assigned-to-a-teacher-solution-for-view-grid/" + planId,
      (res) => {
        console.log("Gird TimeTable data = " + JSON.stringify(res.data));
        setDataTimeTable(res.data);
      }
    );
  }

  const suggestTeacherListForClass = (classId) => {
    alert("suggest teacher list for class " + classId);
  };
  const customSelectTeacherHandle = (selectedTeacherId) => {};

  const handleSuggestionModalClose = () => {
    setOpenSuggestion(false);
  };

  function handleBtnClick() {
    alert("Phân công lại");
  }
  useEffect(() => {
    getDataTimeTableList();
  }, []);

  return (
    <Card>
      <Box display="flex" justifyContent="flex-end">
        <PrimaryButton
          // className={classes.btn}
          onClick={(e) => {
            handleBtnClick(e);
          }}
        >
          ""
        </PrimaryButton>
      </Box>
      <TimeTableHeader />
      <TimeTable data={dataTimeTable} root={this} planId={planId} />
    </Card>
  );
}

export default TeacherBasedTimeTableAssignmentInSolution;
