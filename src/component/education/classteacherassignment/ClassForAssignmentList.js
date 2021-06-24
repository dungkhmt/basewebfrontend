import { Button, Card, Checkbox, Tooltip } from "@material-ui/core/";
import React, { useState, useReducer, useEffect } from "react";
import MaterialTable, { MTableToolbar, TextField } from "material-table";
import { request } from "../../../api";
import UploadExcelClassForTeacherAssignmentModel from "./UploadExcelClassForTeacherAssignmentModel";
import { authGet, authPostMultiPart } from "../../../api";

import { useDispatch, useSelector } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import UpdateClassForAssignmentModel from "./UpdateClassForAssignmentModel";

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

function ClassForAssignmentList(props) {
  const planId = props.planId;
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openModelExcel, setOpenModelExcel] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);

  const [selectedAll, setSelectedAll] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const columns = [
    { title: "classId", field: "classId" },
    { title: "Tên lớp", field: "className" },
    { title: "Tên môn", field: "courseId" },
    { title: "TKB", field: "lesson" },
    { title: "Chương trình", field: "program" },
    { title: "Giờ quy đổi", field: "hourLoad" },
    { title: "Số GV", field: "numberPosibleTeachers" },
    { title: "Số GV trong KH", field: "numberPosibleTeachersInPlan" },
    

    {
      title: "",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onUpdateHourLoad(rowData["classId"]);
          }}
        >
          Update
        </Button>
      ),
    },
    {
      field: "selected",
      title: "Chọn",

      width: "10%",
      type: "numeric",
      render: (rowData) => (
        <Checkbox
          checked={rowData.selected}
          onChange={(e) => {
            rowData.selected = e.target.checked;
            if (rowData.selected == false) {
              count--;
              setSelectedAll(false);
            } else {
              count++;
            }
            if (count == classList.length) {
              setSelectedAll(true);
            }
            forceUpdate();
          }}
        />
      ),
    },
  ];
  function onUpdateHourLoad(classId) {
    //alert("suggest teacher for class " + classId);
    setSelectedClassId(classId);
    handleModalOpen();
  }
  function uploadExcel(selectedFile) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(
      dispatch,
      token,
      "/upload-excel-class-4-teacher-assignment",
      formData
    )
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
    handleModalCloseModelExcel();
  };

  const customUpdateHandle = (hourLoad) => {
    //alert("update  class " + selectedClassId + " with ourload = " + hourLoad);
    let datasend = {
      classId: selectedClassId,
      hourLoad: hourLoad,
    };
    request(
      // token,
      // history,
      "post",
      "update-class-for-assignment",
      (res) => {
        console.log(res);
        alert("Cập nhật " + "  OK");
      },
      { 401: () => {} },
      datasend
    );

    handleModalClose();
  };

  async function getClassTeacherAssignmentClassInfoList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-list-for-assignment-2-teacher/" + planId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            classId: elm.classId,
            planId: elm.planId,
            schoolName: elm.schoolName,
            semesterId: elm.semesterId,
            courseId: elm.courseId,
            className: elm.className,
            creditInfo: elm.creditInfo,
            classNote: elm.classNote,
            program: elm.program, //
            semesterType: elm.semesterType, //
            enrollment: elm.enrollment,
            maxEnrollment: elm.maxEnrollment,
            classType: elm.classType,
            timeTable: elm.timeTable,
            lesson: elm.lesson,
            departmentId: elm.departmentId,
            teacherId: elm.teacherId,
            createdByUserLoginId: elm.createdByUserLoginId,
            createdStamp: elm.createdStamp,
            hourLoad: elm.hourLoad,
            numberPosibleTeachers: elm.numberPosibleTeachers,
            numberPosibleTeachersInPlan: elm.numberPosibleTeachersInPlan,
            selected: false,
          });
        });

        //setClassList(res.data);
        setClassList(temp);
      }
    );
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpenModelExcel = () => {
    setOpenModelExcel(true);
  };

  const handleModalCloseModelExcel = () => {
    setOpenModelExcel(false);
  };

  const handleRemoveClassFromAssignmentPlan = (e) => {
    let acceptList = [];
    classList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(JSON.stringify({ classId: v.classId }));
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("planId", planId);
      formData.append("classList", acceptList.join(";"));
      request(
        // token,
        // history,
        "POST",
        "/remove-class-from-assign-plan",
        (res) => {
          result = res.data;
          alert("Remove OK");
          //if (result >= 0) {
          //  let temp = classList.filter(
          //    (el) => !acceptList.includes(el.userLoginId)
          //  );
          //  setClassList(temp);
          //  count = 0;
          //}
        },
        {},
        formData
      );
    }
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
                <Button onClick={handleModalOpenModelExcel} color="primary">
                  Upload excel
                </Button>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Loại lớp khỏi kế hoạch"
                  aria-label="Loại lớp khỏi kế hoạch"
                  placement="top"
                >
                  <ThemeProvider theme={theme} style={{ color: "white" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        handleRemoveClassFromAssignmentPlan(e);
                      }}
                      style={{ color: "white" }}
                    >
                      <CheckCircleOutlineIcon
                        style={{ color: "white" }}
                        fontSize="default"
                      />
                      &nbsp;&nbsp;&nbsp;Xóa&nbsp;&nbsp;
                    </Button>
                  </ThemeProvider>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Tooltip
                  title="Chọn tất cả"
                  aria-label="Chọn tất cả"
                  placement="top"
                >
                  <Checkbox
                    checked={selectedAll}
                    onChange={(e) => {
                      //alert('checkAll = ' + selectedAll);
                      let tempS = e.target.checked;
                      setSelectedAll(e.target.checked);

                      if (tempS) count = classList.length;
                      else count = 0;

                      classList.map((value, index) => {
                        value.selected = tempS;
                      });
                    }}
                  />
                  {/* <div>&nbsp;&nbsp;&nbsp;Chọn tất cả&nbsp;&nbsp;</div> */}
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
        ]}
      />
      <UploadExcelClassForTeacherAssignmentModel
        open={openModelExcel}
        onClose={handleModalCloseModelExcel}
        onUpload={customUploadHandle}
      />
      <UpdateClassForAssignmentModel
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={customUpdateHandle}
        selectedClassId={selectedClassId}
      />
    </Card>
  );
}

export default ClassForAssignmentList;
