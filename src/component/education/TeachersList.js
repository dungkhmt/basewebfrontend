import React from "react";
import XLSX from "xlsx";
import Button from "@material-ui/core/Button";
import MaterialTable from 'material-table';
import {Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {authPost} from "../../api";

export default function TeachersList(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const fileInput = React.createRef();
  const [teachers, setTeachers] = React.useState([]);

  const columns = [
    {title: 'Mã giáo viên', field: "teacherId"},
    {title: 'Tên giáo viên', field: "teacherName"},
    {title: 'Email', field: "email"},
  ]

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onSaveHandler = event => {
    authPost(dispatch, token, "/edu/save-teachers", JSON.stringify(teachers))

    // fetch(API_URL + "/edu/save-teachers", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    //     data: JSON.stringify(teachers)
    //   })
  }

  const fileHandler = (event) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function (event) {
      var data = new Uint8Array(reader.result);
      var workbook = XLSX.read(data, {type: "array"});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      var result = XLSX.utils.sheet_to_json(sheet);

      setTeachers(result);
      console.log(teachers)
    };
  };

  return (
    <div>
      <Typography variant="h5" component='h2'>
        Danh sách giáo viên
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
      {teachers.length > 0 && <div>{
        <MaterialTable
          title='Danh sách giáo viên'
          columns={columns}
          data={teachers}
        />
      }</div>}
    </div>
  );
}
