import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography, Button, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { API_URL } from "../../config/config";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function BCASolver(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const classFileInput = React.createRef();
  const teacherFileInput = React.createRef();
  const [semester, setSemester] = useState();
  const [classFile, setClassFile] = React.useState();
  const [teacherFile, setTeacherFile] = React.useState();
  const [progressing, setProgressing] = React.useState(false);

  const openClassFileBrowser = () => {
    classFileInput.current.click();
  };

  const openTeacherFileBrowser = () => {
    teacherFileInput.current.click();
  };

  const classFileHandler = (event) => {
    setClassFile(event.target.files[0]);
  };

  const teacherFileHandler = (event) => {
    setTeacherFile(event.target.files[0]);
  };

  const onSaveClassFileHandler = (event) => {
    if (semester === null) {
      return;
    }
    setProgressing(true);
    var formData = new FormData();
    formData.append("file", classFile);
    fetch(API_URL + "/edu/upload/class-teacher-preference/" + semester, {
      method: "POST",
      headers: { "X-Auth-Token": token },
      body: formData,
    }).then((res) => {
      if (res.ok) {
        console.log(res.data);
        setProgressing(false);
        alert("File uploaded successfully.");
      }
    });
  };

  const onSaveTeacherFileHandler = (event) => {
    if (semester === null) {
      return;
    }
    setProgressing(true);
    var formData = new FormData();
    formData.append("file", teacherFile);
    fetch(API_URL + "/edu/upload/course-for-teacher", {
      method: "POST",
      headers: { "X-Auth-Token": token },
      body: formData,
    }).then((res) => {
      if (res.ok) {
        console.log(res.data);
        setProgressing(false);
        alert("File uploaded successfully.");
      }
    });
  };

  const executeAssignment = (event) => {
    if (semester === null) {
      return;
    }
    setProgressing(true);
    fetch(API_URL + "/edu/execute-class-teacher-assignment/" + semester, {
      method: "GET",
      headers: { "X-Auth-Token": token },
    }).then((res) => {
      if (res.ok) {
        setProgressing(false);
        alert("Successfully executing.");
      }
    });
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h2">
        Cấu hình bộ giải
      </Typography>
      <Card>
        <form>
          <div>
            <TextField
              label="Học kì"
              onChange={(event) => {
                setSemester(event.target.value);
              }}
            />
          </div>
          <div>
            <Typography>Tải lên danh sách môn học và giáo viên:</Typography>
          </div>
          <div>
            <Button onClick={openTeacherFileBrowser} color="primary">
              Tải lên
            </Button>
            <Button onClick={onSaveTeacherFileHandler} color="primary">
              Lưu
            </Button>
            <input
              type="file"
              enctype="multipart/form-data"
              hidden
              onChange={teacherFileHandler}
              ref={teacherFileInput}
              onClick={(event) => {
                event.target.value = null;
              }}
            ></input>
          </div>
          <div>
            <Typography>Tải lên danh sách lớp:</Typography>
          </div>
          <div>
            <Button onClick={openClassFileBrowser} color="primary">
              Tải lên
            </Button>
            <Button onClick={onSaveClassFileHandler} color="primary">
              Lưu
            </Button>
            <input
              type="file"
              enctype="multipart/form-data"
              hidden
              onChange={classFileHandler}
              ref={classFileInput}
              onClick={(event) => {
                event.target.value = null;
              }}
            ></input>
          </div>
        </form>
        <div>
          <Button
            disabled={progressing}
            variant="contained"
            color="primary"
            onClick={executeAssignment}
          >
            {progressing ? <CircularProgress /> : "Phân công"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
