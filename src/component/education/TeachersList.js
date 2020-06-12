import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../config/config";

export default function TeachersList(props) {
  const token = useSelector((state) => state.auth.token);
  const [teachers, setTeachers] = React.useState([]);

  const columns = [
    { title: "Mã giáo viên", field: "teacherId" },
    { title: "Tên giáo viên", field: "teacherName" },
    { title: "Email", field: "email" },
  ];

  useEffect(() => {
    fetch(API_URL + "/edu/get-all-teachers", {
      method: "GET",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setTeachers(response);
      });
  }, [])

  return (
    <div>
      <Typography variant="h5" component="h2">
        Danh sách giáo viên
      </Typography>
      {teachers.length > 0 && (
        <div>
          {
            <MaterialTable
              title="Danh sách giáo viên"
              columns={columns}
              data={teachers}
            />
          }
        </div>
      )}
    </div>
  );
}
