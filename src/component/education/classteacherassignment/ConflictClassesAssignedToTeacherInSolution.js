import { Card } from "@material-ui/core/";
import { green } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../../../api";

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};
const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
let count = 0;

function ConflictClassesAssignedToTeacherInSolution(props) {
  const planId = props.planId;
  const [conflictList, setConflictList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);

  const columns = [
    { title: "Mã Giáo viên", field: "teacherId" },
    { title: "Tên", field: "teacherName" },
    { title: "Lớp 1", field: "classCode1" },
    { title: "Môn 1", field: "courseName1" },
    { title: "TKB 1", field: "timeTable1" },
    { title: "Lớp 2", field: "classCode2" },
    { title: "Môn 2", field: "courseName2" },
    { title: "TKB 2", field: "timeTable2" },
  ];

  async function getTeacherList() {
    request(
      // token,
      // history,
      "GET",
      "/get-conflict-class-assigned-to-teacher-in-solution/" + planId,
      (res) => {
        setConflictList(res.data);

        //setTeacherList(res.data);
      }
    );
  }

  useEffect(() => {
    getTeacherList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp xung đột"}
        columns={columns}
        data={conflictList}
      />
    </Card>
  );
}

export default ConflictClassesAssignedToTeacherInSolution;
