import { Button, Checkbox } from "@material-ui/core/";
import { green } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
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
      { responseType: "blob" }
    );
  }
  useEffect(() => {
    getClassTeacherAssignmentSolutionList();
  }, []);

  return (
    <MaterialTable
      title={"Danh sách lớp được phân công"}
      columns={columns}
      data={classList}
      components={{
        Action: (props) => {
          if (props.action.icon === "exportExcel") {
            return (
              <Button
                onClick={(event) => props.action.onClick(event, props.data)}
                color="primary"
              >
                Xuất excel
              </Button>
            );
          } else if (props.action.icon === "removeSolution") {
            return (
              <ThemeProvider theme={theme}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    <CheckCircleOutlineIcon
                      style={{ color: "white" }}
                      fontSize="default"
                    />
                  }
                  onClick={(event) => props.action.onClick(event, props.data)}
                  style={{ color: "white" }}
                >
                  Loại bỏ
                </Button>
              </ThemeProvider>
            );
          } else if (props.action.icon === "selectAll") {
            return (
              <>
                <Checkbox
                  checked={selectedAll}
                  onChange={(event) => props.action.onClick(event, props.data)}
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
          icon: "exportExcel",
          onClick: (e, rowData) => {
            handleExportExcel();
          },
        },
        {
          isFreeAction: true,
          icon: "removeSolution",
          tooltip: "Loại thí sinh khỏi kì thi",
          onClick: (e, rowData) => {
            handleRemoveClassTeacherAssignmentSolution(e);
          },
        },
        {
          isFreeAction: true,
          icon: "selectAll",
          tooltip: "Chọn tất cả",
          onClick: (e, rowData) => {
            //alert('checkAll = ' + selectedAll);
            let tempS = e.target.checked;
            setSelectedAll(e.target.checked);

            if (tempS) count = classList.length;
            else count = 0;

            classList.map((value, index) => {
              value.selected = tempS;
            });
          },
        },
      ]}
    />
  );
}

export default ClassTeacherAssignmentSolutionList;
