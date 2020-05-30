import React from "react";
import XLSX from "xlsx";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {authPost} from "../../api";

export default function CoursesList(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const fileInput = React.createRef();
  const [teachers, setTeachers] = React.useState([]);

  const columns = [
    {title: "Mã học phần", field: "courseId"},
    {title: "Tên học phần", field: "courseName"},
    {title: "Số tín chỉ", field: "credit"},
  ];

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onSaveHandler = (event) => {
    authPost(dispatch, token, "/edu/save-courses", JSON.stringify(teachers));
  };

  const fileHandler = (event) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function (event) {
      var data = new Uint8Array(reader.result);
      var workbook = XLSX.read(data, {type: "array"});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      var result = XLSX.utils.sheet_to_json(sheet);

      setTeachers(result);
      console.log(teachers);
    };
  };

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
          hidden
          onChange={fileHandler}
          ref={fileInput}
          onClick={(event) => {
            event.target.value = null;
          }}
        ></input>
      </form>
      {teachers.length > 0 && (
        <div>
          {
            <MaterialTable
              title="Danh sách học phần"
              columns={columns}
              data={teachers}
            />
          }
        </div>
      )}
    </div>
  );
}
