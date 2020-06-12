import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import { Typography, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../config/config";

export default function CourseList(props) {
  const token = useSelector((state) => state.auth.token);
  const fileInput = React.createRef();
  const [classes, setClasses] = React.useState([]);
  const [semesterUpload, setSemesterUpload] = React.useState(null);

  const [file, setFile] = React.useState();

  const columns = [
    { title: "Mã lớp", field: "classId" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên lớp", field: "className" },
    { title: "Loại lớp", field: "classType" },
    { title: "Ca học", field: "sessionId" },
    { title: "Bộ môn", field: "departmentId" },
    { title: "Học kì", field: "semesterId" },
  ];

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onSaveHandler = (event) => {
    if (semesterUpload === null) {
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    fetch(API_URL + "/edu/upload/class-teacher-preference/" + semesterUpload, {
      method: "POST",
      headers: { "X-Auth-Token": token },
      body: formData,
    }).then((res) => {
      if (res.ok) {
        console.log(res.data);
        alert("File uploaded successfully.");
      }
    });
  };

  const fileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    fetch(API_URL + "/edu/get-all-classes", {
      method: "GET",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setClasses(response);
      });
  }, []);

  return (
    <div>
      <Typography variant="h5" component="h2">
        Danh sách lớp các kì
      </Typography>
      <form>
        <div>
          <TextField
            label="Học kì"
            onChange={(event) => {
              setSemesterUpload(event.target.value);
            }}
          />
        </div>
        <Button onClick={openFileBrowser} color="primary">
          Tải lên
        </Button>
        <Button onClick={onSaveHandler} color="primary">
          Lưu
        </Button>
        <input
          type="file"
          enctype="multipart/form-data"
          hidden
          onChange={fileHandler}
          ref={fileInput}
          onClick={(event) => {
            event.target.value = null;
          }}
        ></input>
      </form>
      {classes.length > 0 && (
        <div>
          {
            <MaterialTable
              title="Danh sách lớp"
              columns={columns}
              data={classes}
            />
          }
        </div>
      )}
    </div>
  );
}
