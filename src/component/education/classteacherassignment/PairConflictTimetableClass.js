import { Button, Card, Checkbox, Tooltip } from "@material-ui/core/";
import React, { useEffect, useReducer, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { request } from "../../../api";
import UploadExcelTeacherCourseModel from "./UploadExcelTeacherCourseModel";
import { authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";


function PairConflictTimetableClass(props) {
  const planId = props.planId;
  const [conflictList, setConflictList] = useState([]);
  
  
  const columns = [
    { title: "class 1", field: "classId1" },
    { title: "course 1", field: "courseId1" },
    { title: "timetable 1", field: "timetable1" },
    { title: "timetableCode 1", field: "timetableCode1" },
    { title: "class 2", field: "classId2" },
    { title: "course 2", field: "courseId2" },
    { title: "timetable 2", field: "timetable2" },
    { title: "timetableCode 2", field: "timetableCode2" },
    
  ];

  async function getConflictTimetableClassList() {
    request(
      // token,
      // history,
      "GET",
      "/get-pair-of-conflict-timetable-class/" + planId,
      (res) => {
        
        setConflictList(res.data);

        
      }
    );
  }

  useEffect(() => {
    getConflictTimetableClassList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp trùng giờ"}
        columns={columns}
        data={conflictList}
      />
    </Card>
  );
}

export default PairConflictTimetableClass;
