import { Button, Card } from "@material-ui/core/";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../../../api";

function ClassTeacherAssignmentSolutionList(props) {
  const { planId, planName } = props;
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
    { title: "Mã GV", field: "teacherId" },
    { title: "Tên GV", field: "teacherName" },
    { title: "Timetable", field: "timetable" },
    {
      title: "",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onRemoveTeacher(rowData["solutionItemId"]);
          }}
        >
          Xóa
        </Button>
      ),
    },
  ];

  async function getClassTeacherAssignmentSolutionList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-teacher-assignment-solution/" + planId,
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
  function onRemoveTeacher(solutionItemId) {
    let datasend = { solutionItemId: solutionItemId };
    request(
      // token,
      // history,
      "post",
      "manual-remove-class-teacher-assignment-solution",
      (res) => {
        console.log(res);
        alert("Huy phân giảng viên " + " cho lớp " + "  OK");
      },
      { 401: () => {} },
      datasend
    );
  }

  const saveFile = (fileName, data) => {
    let blob = new Blob([data]);

    //IE11 support
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let link = window.document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // other browsers
      // Second approach but cannot specify saved name!
      // let file = new File([data], fileName, { type: "application/zip" });
      // let exportUrl = URL.createObjectURL(file);
      // window.location.assign(exportUrl);
      // URL.revokeObjectURL(exportUrl);
    }
  };

  function handleExportExcel() {
    request(
      "GET",
      "/export-excel-class-teacher-assignment-solution/" + planId,
      (res) => {
        saveFile(planName + ".xlsx", res.data);
      },
      {},
      {},
      { responseType: "arraybuffer" }
    );
  }
  useEffect(() => {
    getClassTeacherAssignmentSolutionList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp được phân công"}
        columns={columns}
        data={classList}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleExportExcel} color="primary">
                  Export excel
                </Button>
              </div>
            </div>
          ),
        }}
      />
    </Card>
  );
}

export default ClassTeacherAssignmentSolutionList;
