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

export default function TeachersList() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token);
  const [teachers, setTeachers] = useState([]);
  const { register, handleSubmit } = useForm();

  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);

  const columns = [
    { title: "Mã giáo viên", field: "teacherId" },
    { title: "Tên giáo viên", field: "teacherName" },
    { title: "Email", field: "email" },
  ];

  const getAllTeachers = () => {
    authGet(
      dispatch, 
      token,
      "/edu/get-all-teachers",

    )
      .then( res => {
        console.log(res);
        setTeachers(res);
      });
  }

  useEffect(() => {
    getAllTeachers()
  }, [])

  const onCloseAddNewTeacherDialog = (event) => {
    setAddTeacherDialogOpen(false);
  };

  const onSaveTeacherHandler = (data) => {
    setAddTeacherDialogOpen(false);
    let flag = false;
    teachers.forEach((item) => {
      if (item.teacherId === data["email"]) {
        flag = true;
      }
    });
    if (flag) {
      alert("Giáo viên " + data["teacherName"] + " đã tồn tại trong hệ thống.");
    } else {
      let input = { teacherId: data["email"], teacherName: data["teacherName"], email: data["email"], credit: data["credit"] };
      authPost(dispatch, token, "/edu/create-teacher", input)
      .then((res) => res.json())
      .then((res) => {
        alert("Đã lưu giáo viên " + data["teacherName"] + ".");
        window.location.reload(); 
      });
    }
  };

  return (
    <div>
        <MuiThemeProvider>
            <Card>
                <CardContent>
                    <MaterialTable
                        title="Danh sách giáo viên"
                        columns={columns}
                        data={teachers}
                        icons={tableIcons}
                        localization={{
                            header: {
                                actions: ''
                            },
                            body: {
                                emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                                filterRow: {
                                    filterTooltip: 'Lọc'
                                }
                            }
                        }}
                        options={{
                          search: false,
                          filtering: true,
                          actionsColumnIndex: -1
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
                                        setAddTeacherDialogOpen(true);
                                      }}
                                      className={classes.button}
                                      style={{ marginLeft: "24px" }}
                                    >
                                      Thêm mới giáo viên
                                    </Button>
                                    <Dialog
                                      open={addTeacherDialogOpen}
                                      onClose={onCloseAddNewTeacherDialog}
                                      aria-labelledby="form-dialog-title"
                                    >
                                      <DialogTitle id="form-dialog-title">
                                        Thêm mới giáo viên
                                      </DialogTitle>
                                      <form onSubmit={handleSubmit(onSaveTeacherHandler)}>
                                        <DialogContent>
                                          <DialogContentText>
                                            Điền thông tin vào form dưới đây và nhấn Lưu
                                            để thêm mới giáo viên.
                                          </DialogContentText>
                                          <TextField
                                            required
                                            margin="dense"
                                            name="teacherName"
                                            label="Tên giảng viên"
                                            inputRef={register({ required: true })}
                                            fullWidth
                                          />
                                          <TextField
                                            required
                                            margin="dense"
                                            name="email"
                                            label="Email"
                                            inputRef={register({ required: true })}
                                            fullWidth
                                            type='email'
                                          />
                                          <TextField
                                            required
                                            margin="dense"
                                            name="credit"
                                            label="Số tín chỉ lớn nhất có thể đảm nhận trong một học kì"
                                            inputRef={register({ required: true })}
                                            fullWidth
                                            type={Number}
                                          />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button type="submit" color="primary">
                                            Lưu
                                          </Button>
                                          <Button
                                            onClick={onCloseAddNewTeacherDialog}
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
                                      Tải lên danh sách giáo viên
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
