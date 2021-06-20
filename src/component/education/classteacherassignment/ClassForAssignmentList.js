import { Button, Card } from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { request } from "../../../api";
import UploadExcelClassForTeacherAssignmentModel from "./UploadExcelClassForTeacherAssignmentModel";
import { authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";

function ClassForAssignmentList(props) {
  const planId = props.planId;
  const [classList, setClassList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);

  const columns = [
    { title: "classId", field: "classId" },
    { title: "Tên lớp", field: "className" },
    { title: "Tên môn", field: "courseId" },
    { title: "Học kỳ", field: "semesterId" },
    { title: "TKB", field: "lesson" },
    { title: "Loại Học kỳ", field: "semesterType" },
    { title: "Chương trình", field: "program" },
  ];

  function uploadExcel(selectedFile) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId      
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(dispatch, token, "/upload-excel-class-4-teacher-assignment", formData)
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
  const customUploadHandle = (selectedFile) => {
    //console.log(filename);
    //setSearchString(sString);
    //alert("upload " + filename);
    uploadExcel(selectedFile);
    handleModalClose();
  };

  async function getClassTeacherAssignmentClassInfoList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-list-for-assignment-2-teacher/" + planId,
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
    getClassTeacherAssignmentClassInfoList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp chưa phân công"}
        columns={columns}
        data={classList}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleModalOpen} color="primary">
                  Upload excel
                </Button>
              </div>
            </div>
          ),
        }}
      />
      <UploadExcelClassForTeacherAssignmentModel
        open={open}
        onClose={handleModalClose}
        onUpload={customUploadHandle}
      />
    </Card>
  );
}

export default ClassForAssignmentList;
