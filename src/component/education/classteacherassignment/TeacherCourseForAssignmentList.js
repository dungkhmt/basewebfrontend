import { Button, Checkbox, IconButton, Tooltip } from "@material-ui/core/";
import { green } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart, request } from "../../../api";
import UploadExcelTeacherCourseModel from "./UploadExcelTeacherCourseModel";
import EditIcon from "@material-ui/icons/Edit";
import UpdateTeacherCourseForAssignmentModel from "./UpdateTeacherCourseForAssignmentModel";

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
let count = 0;

function TeacherCourseForAssignmentList(props) {
  const planId = props.planId;
  const [teacherList, setTeacherList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openUpdateTeacherCourse, setOpenUpdateTeacherCourse] =
    React.useState(false);
  const [selectedTeacherCourse, setSelectedTeacherCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const columns = [
    { title: "Giáo viên", field: "teacherId" },
    { title: "Tên môn", field: "courseId" },
    { title: "Độ ưu tiên", field: "priority" },
    { title: "Score", field: "score" },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onUpdatePriority(rowData["teacherId"], rowData["courseId"]);
          }}
        >
          <EditIcon />
        </IconButton>
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
            if (count == teacherList.length) {
              setSelectedAll(true);
            }
            forceUpdate();
          }}
        />
      ),
    },
  ];

  function onUpdatePriority(teacherId, courseId) {
    //alert("update priority " + teacherId + "-" + courseId);
    setSelectedTeacherCourse({
      planId: planId,
      teacherId: teacherId,
      courseId: courseId,
    });
    handleModalUpdateTeacherCourseOpen();
  }
  const handleModalUpdateTeacherCourseOpen = () => {
    setOpenUpdateTeacherCourse(true);
  };
  const handleModalUpdateTeacherCourseClose = () => {
    setOpenUpdateTeacherCourse(false);
  };
  const customUpdateHandle = (priority, score) => {
    //alert("update  class " + selectedClassId + " with ourload = " + hourLoad);
    let datasend = {
      planId: selectedTeacherCourse.planId,
      teacherId: selectedTeacherCourse.teacherId,
      courseId: selectedTeacherCourse.courseId,
      priority: priority,
      score: score,
    };
    request(
      // token,
      // history,
      "post",
      "update-teacher-course-for-assignment-plan",
      (res) => {
        console.log(res);
        alert("Cập nhật " + "  OK");
      },
      { 401: () => {} },
      datasend
    );

    handleModalUpdateTeacherCourseClose();
  };

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
  const customUploadHandle = (selectedFile, choice) => {
    //console.log(filename);
    //setSearchString(sString);
    //alert("upload " + filename);
    uploadExcel(selectedFile, choice);
    handleModalClose();
  };

  async function getTeacherCourseForAssignmentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-teacher-course-4-assignment/" + planId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            teacherId: elm.teacherId,
            courseId: elm.courseId,
            priority: elm.priority,
            score: elm.score,
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

  const handleRemoveTeacherCourseFromAssignmentPlan = (e) => {
    let acceptList = [];
    teacherList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(
          JSON.stringify({
            teacherId: v.teacherId,
            courseId: v.courseId,
            priority: v.priority,
          })
        );
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("planId", planId);
      formData.append("teacherCourseList", acceptList.join(";"));
      request(
        // token,
        // history,
        "POST",
        "/remove-teacher-course-from-assign-plan",
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
    getTeacherCourseForAssignmentList();
  }, []);

  return (
    <>
      <MaterialTable
        title={"Danh sách giáo viên"}
        columns={columns}
        data={teacherList}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />

              <Button onClick={handleModalOpen} color="primary">
                Upload excel
              </Button>
            </div>
          ),
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Loại thí sinh khỏi kì thi"
                  aria-label="Loại thí sinh khỏi kì thi"
                  placement="top"
                >
                  <ThemeProvider theme={theme} style={{ color: "white" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        handleRemoveTeacherCourseFromAssignmentPlan(e);
                      }}
                      style={{ color: "white" }}
                    >
                      <CheckCircleOutlineIcon
                        style={{ color: "white" }}
                        fontSize="default"
                      />
                      &nbsp;&nbsp;&nbsp;Loại bỏ&nbsp;&nbsp;
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

                      if (tempS) count = teacherList.length;
                      else count = 0;

                      teacherList.map((value, index) => {
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

      <UploadExcelTeacherCourseModel
        open={open}
        onClose={handleModalClose}
        onUpload={customUploadHandle}
      />
      <UpdateTeacherCourseForAssignmentModel
        open={openUpdateTeacherCourse}
        onClose={handleModalUpdateTeacherCourseClose}
        onUpdateInfo={customUpdateHandle}
        selectedTeacherCourse={selectedTeacherCourse}
      />
    </>
  );
}

export default TeacherCourseForAssignmentList;
