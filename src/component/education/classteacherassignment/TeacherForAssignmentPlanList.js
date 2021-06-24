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
import UpdateTeacherForAssignmentModel from "./UpdateTeacherForAssignmentModel";

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

function TeacherForAssignmentPlanList(props) {
  const planId = props.planId;
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
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
    { title: "Max Hour Load", field: "maxHourLoad" },
    {
      title: "",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onUpdateTeacher(rowData["teacherId"]);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  function onUpdateTeacher(teacherId) {
    //alert("suggest teacher for class " + classId);
    setSelectedTeacherId(teacherId);
    handleModalOpen();
  }
  function uploadExcel(selectedFile, choice) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId,
      choice: choice,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(dispatch, token, "/upload-excel-teacher-course", formData)
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);

        //var f = document.getElementById("selected-upload-file");
        //f.value = null;
        //setSelectedFile(null);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
      });
  }
  const customUploadHandle = (hourLoad) => {
    //console.log(filename);
    //setSearchString(sString);
    let datasend = {
      planId: planId,
      teacherId: selectedTeacherId,
      hourLoad: hourLoad,
    };
    request(
      // token,
      // history,
      "post",
      "update-teacher-for-assignment",
      (res) => {
        console.log(res);
        alert("Cập nhật " + "  OK");
      },
      { 401: () => {} },
      datasend
    );

    handleModalClose();
  };

  async function getTeacherForAssignmentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-teacher-for-assignment/" + planId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            teacherId: elm.teacherId,
            maxHourLoad: elm.maxHourLoad,
            selected: false,
          });
        });
        setTeacherList(temp);

        //setTeacherList(res.data);
      }
    );
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleAddTeacherToAssignmentPlan = (e) => {
    let acceptList = [];
    teacherList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(
          JSON.stringify({ teacherId: v.teacherId, maxHourLoad: 0 })
        );
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("planId", planId);
      formData.append("teacherList", acceptList.join(";"));
      request(
        // token,
        // history,
        "POST",
        "/add-teacher-to-assign-plan",
        (res) => {
          result = res.data;

          if (result >= 0) {
            let temp = teacherList.filter(
              (el) => !acceptList.includes(el.userLoginId)
            );
            setTeacherList(temp);
            count = 0;
          }
        },
        {},
        formData
      );
    }
  };

  useEffect(() => {
    getTeacherForAssignmentList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách giáo viên"}
        columns={columns}
        data={teacherList}
      />

      <UpdateTeacherForAssignmentModel
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={customUploadHandle}
        selectedTeacherId={selectedTeacherId}
      />
    </Card>
  );
}

export default TeacherForAssignmentPlanList;
