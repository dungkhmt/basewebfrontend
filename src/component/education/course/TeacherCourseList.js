import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function TeacherCourseList() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [courses, setCourses] = useState([]);

  const columns = [
    {
      title: "CourseID",
      field: "id",
      render: (rowData) => (
        <Link to={"/edu/course/detail/" + rowData["id"]}>{rowData["id"]}</Link>
      ),
    },
    { title: "Tên môn", field: "name" },
    { title: "Số tín chỉ", field: "credit" },
  ];

  async function getCourseList() {
    let lst = await authGet(dispatch, token, "/edu/class/get-all-courses");
    setCourses(lst);
  }

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách môn học"}
          columns={columns}
          data={courses}
        />
      </CardContent>
    </Card>
  );
}

export default TeacherCourseList;
