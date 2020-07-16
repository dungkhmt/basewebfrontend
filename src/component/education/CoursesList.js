import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import { tableIcons } from "../../utils/iconutil";
import { Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { authPost, authGet } from "../../api";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CourseList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Table
  const fileInput = useRef();
  const [courses, setCourses] = useState([]);
  const [file, setFile] = React.useState();
  const { register, handleSubmit } = useForm();

  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);

  const columns = [
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "courseName" },
    { title: "Số tín chỉ", field: "credit" },
  ];

  // Functions
  const onClickUploadButton = () => {
    fileInput.current.click();
  };

  const onClickSaveButton = (event) => {
    var formData = new FormData();
    formData.append("file", file);

    authPost(dispatch, token, "/edu/upload/course-for-teacher", formData)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          console.log(res.data);
          alert("File uploaded successfully.");
        }
      });
  };

  const fileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const onCloseAddNewCourseDialog = (event) => {
    setAddCourseDialogOpen(false);
  };

  const onSaveCourseHandler = (data) => {
    setAddCourseDialogOpen(false);
    let flag = false;
    courses.forEach((course) => {
      if (course.courseId === data["courseId"]) {
        flag = true;
      }
    });
    if (flag) {
      alert("Mã môn học " + data["courseId"] + " đã tồn tại trong hệ thống.");
    } else {
      let input = { courseId: data["courseId"], courseName: data["courseName"], credit: data["credit"] };
      authPost(dispatch, token, "/edu/create-course", input)
      .then((res) => res.json())
      .then((res) => {
        alert("Đã lưu môn học " + data["courseName"] + " - " + data["courseId"]);
        window.location.reload(); 
      });
    }
  };

  const getAllCourses = () => {
    authGet(dispatch, token, "/edu/get-all-courses").then((res) => {
      console.log(res);
      setCourses(res);
    });
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
              title="Danh sách học phần"
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
                            onClick={event => {
                              setAddCourseDialogOpen(true);
                            }}
                            className={classes.button}
                            style={{ marginLeft: "24px" }}
                          >
                            Thêm mới môn học
                          </Button>
                          <Dialog
                            open={addCourseDialogOpen}
                            onClose={onCloseAddNewCourseDialog}
                            aria-labelledby="form-dialog-title"
                          >
                            <DialogTitle id="form-dialog-title">
                              Thêm mới môn học
                            </DialogTitle>
                            <form onSubmit={handleSubmit(onSaveCourseHandler)}>
                              <DialogContent>
                                <DialogContentText>
                                  Điền thông tin vào form dưới đây và nhấn Lưu
                                  để thêm mới môn học.
                                </DialogContentText>
                                <TextField
                                  required
                                  margin="dense"
                                  name="courseId"
                                  label="Mã môn học"
                                  inputRef={register({ required: true })}
                                  fullWidth
                                />
                                <TextField
                                  required
                                  margin="dense"
                                  name="courseName"
                                  label="Tên môn học"
                                  inputRef={register({ required: true })}
                                  fullWidth
                                />
                                <TextField
                                  margin="dense"
                                  name="credit"
                                  label="Số tín chỉ"
                                  type={Number}
                                  inputRef={register({ required: false })}
                                  fullWidth
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button type="submit" color="primary">
                                  Lưu
                                </Button>
                                <Button
                                  onClick={onCloseAddNewCourseDialog}
                                  color="primary"
                                >
                                  Hủy
                                </Button>
                              </DialogActions>
                            </form>
                          </Dialog>

                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<CloudUploadIcon />}
                            style={{ marginLeft: "24px" }}
                          >
                            Tải lên danh sách môn học
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
