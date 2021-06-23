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

function ClassesAssignToATeacherList(props) {
  const planId = props.planId;
  const [teacherList, setTeacherList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const columns = [
    { title: "Mã Giáo viên", field: "teacherId" },
    { title: "Tên", field: "teacherName" },
    { title: "Tổng số giờ", field: "hourLoad" },
    { title: "Tổng số lớp", field: "numberOfClass" },
  ];

  async function getTeacherList() {
    request(
      // token,
      // history,
      "GET",
      "/get-classes-assigned-to-a-teacher-solution/" + planId,
      (res) => {
        setTeacherList(res.data);

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
        title={"Danh sách giáo viên"}
        columns={columns}
        data={teacherList}
      />
    </Card>
  );
}

export default ClassesAssignToATeacherList;
