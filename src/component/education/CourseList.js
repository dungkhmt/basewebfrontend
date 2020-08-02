import React, { useState, useEffect } from "react";
import { axiosGet, axiosPost } from "../../api";
import UploadButton from "./UploadButton";
import { CardContent, Box, Button } from "@material-ui/core";
import { Card } from "material-ui";
import MaterialTable, { MTableToolbar } from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { tableIcons } from "../../utils/iconutil";
import { Link, useHistory } from "react-router-dom";
import { MuiThemeProvider } from "material-ui/styles";
import XLSX from "xlsx";
import {
  errorNoti,
  updateSuccessNoti,
  updateErrorNoti,
  processingNoti,
  successNoti,
  warningNoti,
} from "../salesroutes/Notification";
import { toast } from "react-toastify";
import AddCircleIcon from "@material-ui/icons/AddCircle";

function CourseList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Snackbar
  const toastId = React.useRef(null);

  // Table.
  const [courses, setCourses] = useState([]);
  const columns = [
    {
      field: "courseId",
      title: "Mã học phần",
      render: (rowData) => (
        <Link
          to={{
            pathname: "/edu/course/detail",
            state: {
              courseId: rowData["courseId"],
            },
          }}
        >
          {rowData["courseId"]}
        </Link>
      ),
    },
    {
      field: "courseName",
      title: "Tên học phần",
    },
    {
      field: "credit",
      title: "Só tín chỉ",
    },
  ];

  // Functions.
  const getAllCourses = () => {
    axiosGet(dispatch, token, "/edu/course/all")
      .then((res) => {
        console.log("getAllCourses, courses ", res.data);
        setCourses(res.data);
      })
      .catch((error) => console.log("getAllCourses, error ", error));
  };

  const onClickCreateNewButton = () => {
    history.push({
      pathname: "/edu/course/create",
      state: {},
    });
  };

  const onClickSaveButton = (files) => {
    processingNoti(toastId, false);
    console.log(files);

    let file = files[0];
    let sheetName = "courses";
    let noCols = 3;
    let dataTypeOfCol = ["s", "s", "n"];
    let dataColName = ["courseId", "courseName", "credit"];

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const { result } = event.target;
        const workbook = XLSX.read(result, { type: "binary" });

        if (workbook.Sheets.hasOwnProperty(sheetName)) {
          let sheet = workbook.Sheets[sheetName];

          if (!sheet.hasOwnProperty("!ref")) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                `Sheet "${sheetName}" không chứa dữ liệu`
              );
            } else {
              errorNoti(`Sheet "${sheetName}" không chứa dữ liệu`);
            }

            return;
          }

          let dataLocation = sheet["!ref"];
          let index = dataLocation.indexOf(":");
          let startRow = Number(dataLocation.slice(1, index));
          let endRow = Number(dataLocation.slice(index + 2));

          // console.log("Start row", startRow);
          // console.log("Start column", endRow);

          if (Number.isNaN(startRow) || Number.isNaN(endRow)) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(toastId, "Bảng đặt ở vị trí không hợp lệ");
            } else {
              errorNoti("Bảng đặt ở vị trí không hợp lệ");
            }

            return;
          }

          if (endRow === startRow) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                `Sheet "${sheetName}" không chứa dữ liệu`
              );
            } else {
              errorNoti(`Sheet "${sheetName}" không chứa dữ liệu`);
            }

            return;
          }

          // Check number of column.
          let startCol = dataLocation.charCodeAt(0);
          let endCol = dataLocation.charCodeAt(index + 1);

          if (endCol - startCol + 1 != noCols) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                "Số cột dữ liệu khác so với yêu cầu. Tải xuống tệp định dạng nội dung chuẩn"
              );
            } else {
              errorNoti(
                "Số cột dữ liệu khác so với yêu cầu. Tải xuống tệp định dạng nội dung chuẩn"
              );
            }

            return;
          }

          // Xem bat loi nay o day da hop ly chua hay
          if (sheet.hasOwnProperty("!merges")) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                "Bảng có chứa ô hợp nhất (merge cell). Tải xuống tệp định dạng nội dung chuẩn"
              );
            } else {
              errorNoti(
                "Bảng có chứa ô hợp nhất (merge cell). Tải xuống tệp định dạng nội dung chuẩn"
              );
            }

            return;
          }

          // Tinh nang du kien: thong bao so ban ghi trung, so ban ghi duoc tao moi khi su dung nut tai len nhieu lan
          // Chi gui di cac ban ghi can tao moi! -> Vi xoa row trong sheet qua lang nhang nen phan nay de server lam

          // Validate data.
          for (let i = 0; i < noCols; i++) {
            let colName = String.fromCharCode(startCol + i);
            let idx = 0;

            sheet[colName + startRow] = {
              t: dataTypeOfCol[i],
              v: dataColName[i],
            };

            for (let j = startRow + 1; j <= endRow; j++) {
              if (sheet.hasOwnProperty(colName + j)) {
                if (!(sheet[colName + j].t === dataTypeOfCol[i])) {
                  if (toast.isActive(toastId.current)) {
                    updateErrorNoti(
                      toastId,
                      `Kiểu dữ liệu của ô ${
                        colName + j
                      } không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  } else {
                    errorNoti(
                      `Kiểu dữ liệu của ô ${
                        colName + j
                      } không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  }

                  return;
                }
              } else {
                // [khong co o colName + j]: phat trien sau
                if (toast.isActive(toastId.current)) {
                  updateErrorNoti(
                    toastId,
                    `Không có ô abc. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                } else {
                  errorNoti(
                    `Không có ô abc. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                }

                return;
              }
            }
          }

          let duplicateCourses = new Set();
          let colId = String.fromCharCode(startCol);
          let firstRowAddr, secondRowAddr;

          for (let i = startRow + 1; i < endRow; i++) {
            firstRowAddr = colId + i;

            if (sheet.hasOwnProperty(firstRowAddr)) {
              sheet[firstRowAddr].v = sheet[firstRowAddr].v
                .replace(/\s/g, "")
                .toUpperCase();

              for (let j = i + 1; j <= endRow; j++) {
                secondRowAddr = colId + j;

                if (sheet.hasOwnProperty(secondRowAddr)) {
                  sheet[secondRowAddr].v = sheet[secondRowAddr].v
                    .replace(/\s/g, "")
                    .toUpperCase();

                  if (sheet[firstRowAddr].v === sheet[secondRowAddr].v) {
                    duplicateCourses.add(sheet[firstRowAddr].v);
                  }
                }
              }
            }
          }

          if (duplicateCourses.size > 0) {
            let warningMess =
              "Phát hiện các bản ghi trùng nhau của các học phần: ";
            let duplCoursesArr = Array.from(duplicateCourses);
            let len = duplCoursesArr.length - 1;

            for (let i = 0; i < len; i++) {
              warningMess += duplCoursesArr[i] + ", ";
            }

            warningMess +=
              duplCoursesArr[len] +
              ". Một bản ghi trong mỗi cặp trùng nhau sẽ bị loại bỏ";

            warningNoti(warningMess);
          }

          axiosPost(
            dispatch,
            token,
            "/edu/course/add-list-of-courses",
            XLSX.utils.sheet_to_json(sheet)
          )
            .then((res) => {
              if (toast.isActive(toastId.current)) {
                updateSuccessNoti(toastId, res.data);
              } else {
                successNoti(res.data);
              }

              getAllCourses();
            })
            .catch((error) => {
              if (toast.isActive(toastId.current)) {
                updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((");
              } else {
                errorNoti("Rất tiếc! Đã xảy ra lỗi :((");
              }

              console.log("onClickSaveButton, error ", error);
            });
        } else {
          updateErrorNoti(toastId, `Không tìm thấy sheet "${sheetName}"`);
          return;
        }
      } catch (e) {
        console.log(e);
        return;
      }
    };

    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Danh sách môn học"
              columns={columns}
              data={courses}
              icons={tableIcons}
              localization={{
                header: {
                  actions: "",
                },
                body: {
                  emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                  filterRow: {
                    filterTooltip: "Lọc",
                  },
                },
              }}
              options={{
                search: false,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <MuiThemeProvider>
                      <Box display="flex" justifyContent="flex-end" width="98%">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onClickCreateNewButton}
                          startIcon={<AddCircleIcon />}
                          style={{ marginRight: 16 }}
                        >
                          Thêm mới
                        </Button>
                        <UploadButton
                          buttonTitle="Tải lên"
                          onClickSaveButton={onClickSaveButton}
                          filesLimit={1}
                        />
                      </Box>
                    </MuiThemeProvider>
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default CourseList;
