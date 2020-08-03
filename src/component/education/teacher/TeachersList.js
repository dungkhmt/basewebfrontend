import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import { tableIcons } from "../../../utils/iconutil";
import { Card, CardContent, Box } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";
import { axiosGet } from "../../../api";
import { Link, useHistory } from "react-router-dom";
import UploadButton from "../UploadButton";
import XLSX from "xlsx";

export default function TeachersList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Table.
  const [teachers, setTeachers] = useState([]);
  const columns = [
    {
      field: "teacherId",
      title: "Email",
      render: (rowData) => (
        <Link
          to={{
            pathname: "/edu/teacher/detail",
            state: {
              teacherId: rowData["teacherId"],
            },
          }}
        >
          {rowData["teacherId"]}
        </Link>
      ),
    },
    { title: "Tên giảng viên", field: "teacherName" },
    { title: "Bộ môn", field: "department" },
  ];

  const getAllTeachers = () => {
    axiosGet(dispatch, token, "/edu/get-all-teachers")
      .then((res) => {
        console.log("getAllTeachers, teachers ", res.data);
        setTeachers(res);
      })
      .catch((error) => console.log("getAllTeachers, error ", error));
  };

  const onClickCreateNewButton = () => {
    history.push({
      pathname: "/edu/teacher/create",
      state: {},
    });
  };

  const checkDataFormat = (file) => {
    var reader = new FileReader();
    reader.onload = (event) => {
      try {
        const { result } = event.target;
        // Read the entire excel table object in binary stream
        const workbook = XLSX.read(result, { type: "binary" });
        let data = []; // store the acquired data

        if (workbook.Sheets.hasOwnProperty("Sheet2")) {
          console.log(workbook.Sheets["Sheet2"]);

          let count = 0;
          for (let i = 2; i < 109; i++) {
            if (workbook.Sheets["Sheet2"].hasOwnProperty("A" + i)) {
              count += 1;
            }
          }

          console.log(count);

          // // Convert excel to json data using the sheet_to_json method
          // data = data.concat(
          //   XLSX.utils.sheet_to_json(workbook.Sheets["20182"])
          // );
        }

        console.log(data);
      } catch (e) {
        // Here you can throw a related prompt with a file type error incorrect.
        console.log("file type is incorrect", e);
        return;
      }
    };
    reader.readAsBinaryString(file);
  };

  const onClickSaveButton = (files) => {
    console.log(files);

    if (checkDataFormat(files[0])) {
      var formData = new FormData();
      formData.append("file", files[0]);
    }
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
