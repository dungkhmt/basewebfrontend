import { Button, Card } from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { request } from "../../../api";
import { authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import SuggestTeachersForClassModel from "./SuggestTeachersForClassModel";

function NotAssignedClassInSolutionList(props) {
  const planId = props.planId;
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classList, setClassList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);

  const columns = [
    { title: "Mã lớp", field: "classCode" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên môn", field: "courseName" },
    { title: "Timetable", field: "timetable" },
    {
      title: "",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSuggestTeacher(rowData["classCode"]);
          }}
        >
          Gợi ý GV
        </Button>
      ),
    },
  ];

  const customUploadHandle = (selectedTeacherId) => {
    //console.log(filename);
    //setSearchString(sString);
    //alert("upload " + filename);
    //uploadExcel(selectedFile, choice);
    //perform API to assign teacher here
    //alert("call API to assign teacher " + selectedTeacherId);
    let datasend = {
      classId: selectedClassId,
      teacherId: selectedTeacherId,
      planId: planId,
    };
    request(
      // token,
      // history,
      "post",
      "manual-assign-teacher-to-class",
      (res) => {
        console.log(res);
        alert(
          "phân giảng viên " +
            selectedTeacherId +
            " cho lớp " +
            selectedClassId +
            "  OK"
        );
      },
      { 401: () => {} },
      datasend
    );

    handleModalClose();
  };

  function onSuggestTeacher(classId) {
    //alert("suggest teacher for class " + classId);
    setSelectedClassId(classId);
    handleModalOpen();
  }
  async function getNotAssignedClassInSolutionList() {
    request(
      // token,
      // history,
      "GET",
      "/get-not-assigned-class-solution/" + planId,
      (res) => {
        setClassList(res.data);
      }
    );
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getNotAssignedClassInSolutionList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp chưa được phân công"}
        columns={columns}
        data={classList}
      />

      <SuggestTeachersForClassModel
        open={open}
        onClose={handleModalClose}
        onSelectAssign={customUploadHandle}
        selectedClassId={selectedClassId}
        planId={planId}
      />
    </Card>
  );
}

export default NotAssignedClassInSolutionList;
