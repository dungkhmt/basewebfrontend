import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
} from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

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
