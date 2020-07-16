import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import { Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { tableIcons } from "../../utils/iconutil";
import { authPost, authGet } from "../../api";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CourseList() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [allClasses, setAllClasses] = useState([]);

  // Table
  const columns = [
    { title: "Mã lớp", field: "classId" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên lớp", field: "className" },
    { title: "Loại lớp", field: "classType" },
    { title: "Ca học", field: "sessionId" },
    { title: "Bộ môn", field: "departmentId" },
    { title: "Học kì", field: "semesterId" },
  ];

  const getAllClasses = () => {
    authGet(dispatch, token, "/edu/get-all-classes").then((res) => {
      console.log(res);
      setAllClasses(res);
    });
  };

  useEffect(() => {
    getAllClasses();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Danh sách lớp các kì"
              columns={columns}
              data={allClasses}
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
                filtering: true,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <MuiThemeProvider>
                      <Box display="flex" justifyContent="flex-end" width="98%">
                        <form>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => history.push('/edu/create-class')}
                            className={classes.button}
                            style={{ marginLeft: "24px" }}
                          >
                            Thêm mới lớp học
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<CloudUploadIcon />}
                            style={{ marginLeft: "24px" }}
                          >
                            Tải lên danh sách lớp
                          </Button>
                        </form>
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
