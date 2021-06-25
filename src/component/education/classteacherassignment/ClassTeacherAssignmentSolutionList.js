import { Button, Card, Checkbox, Tooltip } from "@material-ui/core/";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../../../api";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

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

function ClassTeacherAssignmentSolutionList(props) {
  const { planId, planName } = props;
  const [classList, setClassList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [selectedAll, setSelectedAll] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

  async function getClassTeacherAssignmentSolutionList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-teacher-assignment-solution/" + planId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            solutionItemId: elm.solutionItemId,
            classCode: elm.classCode,
            courseId: elm.courseId,
            courseName: elm.courseName,
            teacherId: elm.teacherId,
            teacherName: elm.teacherName,
            timetable: elm.timetable,
            hourLoad: elm.hourLoad,
            selected: false,
          });
        });
        setClassList(temp);
        //setClassList(res.data);
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

  function handleRemoveClassTeacherAssignmentSolution(e) {
    let acceptList = [];
    classList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(
          JSON.stringify({
            solutionItemId: v.solutionItemId,
          })
        );
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("planId", planId);
      formData.append("solutionItemList", acceptList.join(";"));
      request(
        // token,
        // history,
        "POST",
        "/remove-class-teacher-assign-solution-list",
        (res) => {
          result = res.data;

          if (result >= 0) {
            let temp = classList.filter(
              (el) => !acceptList.includes(el.userLoginId)
            );
            setClassList(temp);
            count = 0;
          }
        },
        {},
        formData
      );
    }
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
                        handleRemoveClassTeacherAssignmentSolution(e);
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
    </Card>
  );
}

export default ClassTeacherAssignmentSolutionList;
