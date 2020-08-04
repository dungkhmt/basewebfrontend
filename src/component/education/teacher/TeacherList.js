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

function TeacherList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Snackbar
  const toastId = React.useRef(null);

  // Table.
  const [teachers, setTeachers] = useState([]);
  const columns = [
    {
      title: "Tên giảng viên",
      field: "teacherName",
      render: (rowData) => (
        <Link
          to={{
            pathname: "/edu/teacher/detail",
            state: {
              email: rowData["email"],
            },
          }}
        >
          {rowData["teacherName"]}
        </Link>
      ),
    },
    { title: "Bộ môn", field: "department" },
    {
      field: "email",
      title: "Email",
    },
  ];

  // Functions.
  const getAllTeachers = () => {
    axiosGet(dispatch, token, "/edu/teacher/all")
      .then((res) => {
        console.log("getAllTeachers, teachers ", res.data);
        setTeachers(res.data);
      })
      .catch((error) => console.log("getAllTeachers, error ", error));
  };

  const onClickCreateNewButton = () => {
    history.push({
      pathname: "/edu/teacher/create",
      state: {},
    });
  };

  const onClickSaveButton = (files) => {
    processingNoti(toastId, false);

    let file = files[0];
    let sheetName = "teachers";
    let noCols = 3;
    let dataTypeOfCol = ["s", "s", "n"];
    let dataColName = ["teacherName", "email", "maxCredit"];
    let excelColName = [];

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

          // Xem bat loi nay o day da hop ly chua
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

          // Round 1: validate cell.
          let processingCell;

          for (let i = 0; i < noCols; i++) {
            excelColName.push(XLSX.utils.encode_col(startCol + i));

            sheet[excelColName[i] + startRow] = {
              t: dataTypeOfCol[i],
              v: dataColName[i],
            };

            for (let j = startRow + 1; j <= endRow; j++) {
              processingCell = excelColName[i] + j;

              if (sheet.hasOwnProperty(processingCell)) {
                if (!(sheet[processingCell].t === dataTypeOfCol[i])) {
                  if (toast.isActive(toastId.current)) {
                    updateErrorNoti(
                      toastId,
                      `Kiểu dữ liệu của ô "${processingCell}" không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  } else {
                    errorNoti(
                      `Kiểu dữ liệu của ô "${processingCell}" không đúng định dạng. Tải xuống tệp định dạng nội dung chuẩn`
                    );
                  }

                  return;
                }
              } else {
                if (toast.isActive(toastId.current)) {
                  updateErrorNoti(
                    toastId,
                    `Ô "${processingCell}" không chứa dữ liệu. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                } else {
                  errorNoti(
                    `Ô "${processingCell}" không chứa dữ liệu. Tải xuống tệp định dạng nội dung chuẩn`
                  );
                }

                return;
              }
            }
          }

          // Round 2: format data.
          let validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          for (let i = startRow + 1; i <= endRow; i++) {
            processingCell = excelColName[1] + i;

            // Remove all white space.
            sheet[processingCell].v = sheet[processingCell].v
              .trim()
              .replace(/\s/g, "");

            // Validate email.
            if (!validEmailRegex.test(sheet[processingCell].v)) {
              if (toast.isActive(toastId.current)) {
                updateErrorNoti(
                  toastId,
                  `Dữ liệu của ô "${processingCell}" không phải là địa chỉ email hợp lệ. Tải xuống tệp định dạng nội dung chuẩn`
                );
              } else {
                errorNoti(
                  `Dữ liệu của ô "${processingCell}" không phải là địa chỉ email hợp lệ. Tải xuống tệp định dạng nội dung chuẩn`
                );
              }

              return;
            }

            // Format teacherName.
            processingCell = excelColName[0] + i;
            sheet[processingCell].v = sheet[processingCell].v
              .trim()
              .replace(/\s+/g, " ");
          }

          // Round 3: check duplicate record.
          let duplicateTeachers = new Set();

          for (let i = startRow + 1; i < endRow; i++) {
            processingCell = excelColName[1] + i;

            for (let j = i + 1; j <= endRow; j++) {
              if (
                sheet[processingCell].v.localeCompare(
                  sheet[excelColName[1] + j].v,
                  undefined,
                  { sensitivity: "accent" }
                ) === 0
              ) {
                duplicateTeachers.add(sheet[processingCell].v);
              }
            }
          }

          if (duplicateTeachers.size > 0) {
            let warningMess;
            let duplTeachersArr = Array.from(duplicateTeachers);
            let len = duplTeachersArr.length - 1;

            if (duplTeachersArr.length === 1) {
              warningMess = `Phát hiện các bản ghi trùng nhau của giảng viên có email: `;
            } else {
              warningMess = `Phát hiện các bản ghi trùng nhau của các giảng viên có email: `;

              for (let i = 0; i < len; i++) {
                warningMess += duplTeachersArr[i] + ", ";
              }
            }

            warningMess += `${duplTeachersArr[len]}. Một bản ghi trong mỗi cặp trùng nhau sẽ bị loại bỏ`;

            warningNoti(warningMess);
          }

          // Everything is OK!.
          axiosPost(
            dispatch,
            token,
            "/edu/teacher/add-list-of-teachers",
            XLSX.utils.sheet_to_json(sheet)
          )
            .then((res) => {
              if (toast.isActive(toastId.current)) {
                updateSuccessNoti(toastId, res.data);
              } else {
                successNoti(res.data);
              }

              getAllTeachers();
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

        if (toast.isActive(toastId.current)) {
          updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((");
        } else {
          errorNoti("Rất tiếc! Đã xảy ra lỗi :((");
        }

        return;
      }
    };

    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    getAllTeachers();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Danh sách giảng viên"
              columns={columns}
              data={teachers}
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

export default TeacherList;
