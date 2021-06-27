import { Button, Checkbox } from "@material-ui/core/";
import { green } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import MaterialTable from "material-table";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart, request } from "../../../api";
import UpdateClassForAssignmentModel from "./UpdateClassForAssignmentModel";
import UploadExcelClassForTeacherAssignmentModel from "./UploadExcelClassForTeacherAssignmentModel";

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
    <>
      <MaterialTable
        title={"Danh sách lớp chưa phân công"}
        columns={columns}
        data={classList}
        components={{
          Action: (props) => {
            if (props.action.icon === "uploadExcel") {
              return (
                <Button
                  onClick={(event) => props.action.onClick(event, props.data)}
                  color="primary"
                >
                  Tải lên excel
                </Button>
              );
            } else if (props.action.icon === "deleteClass") {
              return (
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => props.action.onClick(event, props.data)}
                    style={{ color: "white" }}
                    startIcon={
                      <CheckCircleOutlineIcon
                        style={{ color: "white" }}
                        fontSize="default"
                      />
                    }
                  >
                    Xóa
                  </Button>
                </ThemeProvider>
              );
            } else if (props.action.icon === "selectAll") {
              return (
                <>
                  <Checkbox
                    checked={selectedAll}
                    onChange={(event) =>
                      props.action.onClick(event, props.data)
                    }
                  />
                  {/* <div>&nbsp;&nbsp;&nbsp;Chọn tất cả&nbsp;&nbsp;</div> */}
                </>
              );
            }
            return "default button";
          },
        }}
        actions={[
          {
            isFreeAction: true,
            icon: "uploadExcel",
            onClick: (e, rowData) => {
              handleModalOpenModelExcel();
            },
          },
          {
            isFreeAction: true,
            icon: "deleteClass",
            tooltip: "Loại lớp khỏi kế hoạch",
            onClick: (event, rowData) => {
              handleRemoveClassFromAssignmentPlan(event);
            },
          },
          {
            isFreeAction: true,
            icon: "selectAll",
            tooltip: "Chọn tất cả",
            onClick: (event, rowData) => {
              //alert('checkAll = ' + selectedAll);
              let tempS = event.target.checked;
              setSelectedAll(event.target.checked);

              if (tempS) count = classList.length;
              else count = 0;

              classList.map((value) => {
                value.selected = tempS;
              });
            },
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
    </>
  );
}

export default ClassForAssignmentList;
