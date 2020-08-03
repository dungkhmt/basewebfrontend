import React, { useState, useEffect } from "react";
import { axiosGet, axiosPost } from "../../../api";
import UploadButton from "../UploadButton";
import { CardContent, Box, Button } from "@material-ui/core";
import { Card } from "material-ui";
import MaterialTable, { MTableToolbar } from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { tableIcons } from "../../../utils/iconutil";
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
} from "../../salesroutes/Notification";
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
      title: "Số tín chỉ",
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
          // console.log(sheet);

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

          let range = XLSX.utils.decode_range(sheet["!ref"]);
          let startRow = range.s.r + 1;
          let endRow = range.e.r + 1;

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
          let startCol = range.s.c; // number
          let endCol = range.e.c; // number

          if (endCol - startCol + 1 > noCols) {
            warningNoti(
              `Số cột dữ liệu nhiều hơn so với yêu cầu. Các cột không được yêu cầu sẽ bị bỏ qua. Tải xuống tệp định dạng nội dung chuẩn`
            );
          } else if (endCol - startCol + 1 < noCols) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                `Số cột dữ liệu ít hơn so với yêu cầu. Tải xuống tệp định dạng nội dung chuẩn`
              );
            } else {
              errorNoti(
                `Số cột dữ liệu ít hơn so với yêu cầu. Tải xuống tệp định dạng nội dung chuẩn`
              );
            }

            return;
          }

          // Xem bat loi nay o day da hop ly chua hay
          if (sheet.hasOwnProperty("!merges")) {
            if (toast.isActive(toastId.current)) {
              updateErrorNoti(
                toastId,
                `Bảng có chứa ${sheet["!merges"].length} ô hợp nhất (merge cell). Tải xuống tệp định dạng nội dung chuẩn`
              );
            } else {
              errorNoti(
                `Bảng có chứa ${sheet["!merges"].length} ô hợp nhất (merge cell). Tải xuống tệp định dạng nội dung chuẩn`
              );
            }

            return;
          }

          // Validate cell.
          let cell;

          for (let i = 0; i < noCols; i++) {
            let colName = XLSX.utils.encode_col(startCol + i);

            sheet[colName + startRow] = {
              t: dataTypeOfCol[i],
              v: dataColName[i],
            };

            for (let j = startRow + 1; j <= endRow; j++) {
              cell = colName + j;

              if (sheet.hasOwnProperty(cell)) {
                if (!(sheet[cell].t === dataTypeOfCol[i])) {
                  if (toast.isActive(toastId.current)) {
                    updateErrorNoti(
                      toastId,
                      `Kiểu dữ liệu của ô "${cell}" không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  } else {
                    errorNoti(
                      `Kiểu dữ liệu của ô "${cell}" không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  }

                  return;
                }
              } else {
                if (toast.isActive(toastId.current)) {
                  updateErrorNoti(
                    toastId,
                    `Ô "${cell}" không chứa dữ liệu. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                } else {
                  errorNoti(
                    `Ô "${cell}" không chứa dữ liệu. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                }

                return;
              }
            }
          }

          let duplicateCourses = new Set();
          let colId = XLSX.utils.encode_col(startCol);
          let firstCell, secondCell;

          for (let i = startRow + 1; i < endRow; i++) {
            firstCell = colId + i;

            // if (sheet.hasOwnProperty(firstCell)) {
            sheet[firstCell].v = sheet[firstCell].v
              .replace(/\s/g, "")
              .toUpperCase();

            for (let j = i + 1; j <= endRow; j++) {
              secondCell = colId + j;

              // if (sheet.hasOwnProperty(secondCell)) {
              sheet[secondCell].v = sheet[secondCell].v
                .replace(/\s/g, "")
                .toUpperCase();

              if (sheet[firstCell].v === sheet[secondCell].v) {
                duplicateCourses.add(sheet[firstCell].v);
              }
              // }
            }
            // }
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
