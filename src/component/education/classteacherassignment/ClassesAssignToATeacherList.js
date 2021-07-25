import { Card } from "@material-ui/core/";
import { green } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useReducer, useState } from "react";
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
    { title: "Tổng số ngày", field: "numberOfWorkingDays" },
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
