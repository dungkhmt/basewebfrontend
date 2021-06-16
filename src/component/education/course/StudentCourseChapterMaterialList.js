import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function StudentCourseChapterMaterialList(props) {
  const params = useParams();
  const chapterId = props.chapterId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [chapterMaterials, setChapterMaterials] = useState([]);

  const columns = [
    {
      title: "Tên",
      field: "eduCourseMaterialId",
      render: (rowData) => (
        <Link
          to={
            "/edu/student/course/chapter/material/detail/" +
            rowData["eduCourseMaterialId"]
          }
        >
          {rowData["eduCourseMaterialName"]}
        </Link>
      ),
    },
  ];

  async function getChapterMaterialList() {
    let lst = await authGet(
      dispatch,
      token,
      "/edu/class/get-chapter-materials-of-course/" + chapterId
    );
    setChapterMaterials(lst);
  }

  useEffect(() => {
    getChapterMaterialList();
    console.log("TeacherCourseChapterMaterialList, chapterId = " + chapterId);
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Material"}
          columns={columns}
          data={chapterMaterials}
        />
      </CardContent>
    </Card>
  );
}

export default StudentCourseChapterMaterialList;
