import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import { Typography, Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import { tableIcons } from "../../utils/iconutil";
import { authPost, authGet } from "../../api";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CourseList() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token);

  // Table
  const fileInput = useRef();
  const [courses, setCourses] = useState([]);
  const [file, setFile] = React.useState();
  
  const columns = [
    {title: "Mã học phần", field: "courseId"},
    {title: "Tên học phần", field: "courseName"},
    {title: "Số tín chỉ", field: "credit"},
  ];

  // Functions
  const onClickUploadButton = () => {
    fileInput.current.click();
  };

  const onClickSaveButton = (event) => {
    var formData = new FormData();
    formData.append("file", file);
    
    authPost(
      dispatch,
      token,
      "/edu/upload/course-for-teacher",
      formData
    )
      .then(res => res.json())   
        .then( res => {
          if (res.ok) {
            console.log(res.data);
            alert("File uploaded successfully.");
          }
        });
  };

  const fileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const getAllCourses = () => {
    authGet(
      dispatch,
      token,
      "/edu/get-all-courses"
    )
      .then( res => {
        console.log(res);
        setCourses(res);
      });
  }

  useEffect(() => {
    getAllCourses()
  }, [])

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
                            Toolbar: props => (
                                <div>
                                    <MTableToolbar {...props} />
                                    <MuiThemeProvider>
                                        <Box
                                            display='flex'
                                            justifyContent='flex-start'
                                            width='98%'
                                        >
                                          <form>
                                            <Button
                                              variant="contained"
                                              color="primary"                                              
                                              className={classes.button}
                                              startIcon={<CloudUploadIcon />}
                                              onClick={onClickUploadButton}
                                              style={{marginLeft: '24px'}}
                                            >
                                              Tải lên
                                            </Button>
                                            <Button
                                              variant="contained"
                                              color="primary"                                              
                                              className={classes.button}
                                              startIcon={<SaveIcon />}
                                              onClick={onClickSaveButton}
                                            >
                                              Lưu
                                            </Button>
                                            <input
                                              type="file"
                                              enctype='multipart/form-data'
                                              hidden
                                              onChange={fileHandler}
                                              ref={fileInput}
                                              onClick={(event) => {
                                                event.target.value = null;
                                              }}
                                            />
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