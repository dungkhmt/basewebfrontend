import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { API_URL } from "../../config/config";

export default function CourseList(props) {
  const token = useSelector((state) => state.auth.token);
  const fileInput = React.createRef();
  const [courses, setCourses] = React.useState([]);

  const [file, setFile] = React.useState();

  const columns = [
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "courseName" },
    { title: "Số tín chỉ", field: "credit" },
  ];

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onSaveHandler = (event) => {
    var formData = new FormData();
    formData.append("file", file);
    fetch(API_URL + "/edu/upload/course-for-teacher", {
      method: 'POST',
      headers: {"X-Auth-Token": token},
      body: formData
    }).then(
      (res) => {
        if (res.ok) {
          console.log(res.data);
          alert("File uploaded successfully.");
        }
      }
    );
  };

  const fileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    fetch(API_URL + "/edu/get-all-courses", {
      method: "GET",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setCourses(response);
      });
  }, [])

  return (
    <div>
      <Typography variant="h5" component="h2">
        Danh sách học phần
      </Typography>
      <form>
        <Button onClick={openFileBrowser} color="primary">
          Tải lên
        </Button>
        <Button onClick={onSaveHandler} color="primary">
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
        ></input>
      </form>
      {courses.length > 0 && (
        <div>
          {
            <MaterialTable
              title="Danh sách học phần"
              columns={columns}
              data={courses}
            />
          }
        </div>
      )}
    </div>
  );
}
