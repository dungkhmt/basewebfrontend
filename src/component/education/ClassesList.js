import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import { Typography, Card, CardContent, Box, TextField } from "@material-ui/core";
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
  
  const fileInput = useRef();
  const [file, setFile] = useState();
  const [allClasses, setAllClasses] = useState([]);
  const [semesterUpload, setSemesterUpload] = useState(null);

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

  const onClickUploadButton = () => {
    fileInput.current.click();
  };

  const onClickSaveButton = () => {
    if (semesterUpload === null) {
      return;
    }
    
    var formData = new FormData();
    formData.append("file", file);
    
    authPost(
      dispatch,
      token,
      "/edu/upload/class-teacher-preference/" + semesterUpload,
      formData
    )
      .then( res => res.json())
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

  const getAllClasses = () => {
    authGet(
      dispatch,
      token,
      "/edu/get-all-classes"
    )
      .then(res => {
        console.log(res);
        setAllClasses(res);
      });
  }

  useEffect(() => {
    getAllClasses()
  }, []);

  return (
    <div>
        <MuiThemeProvider>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                      Danh sách lớp các kì
                    </Typography>
                    <TextField
                      label="Học kì"
                      onChange={(event) => {
                        setSemesterUpload(event.target.value);
                      }}
                      style={{marginLeft: '24px'}}
                    />
                    <br/>
                    <br/>
                    <br/>
                    <MaterialTable
                        title="Danh sách lớp"
                        columns={columns}
                        data={allClasses}
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