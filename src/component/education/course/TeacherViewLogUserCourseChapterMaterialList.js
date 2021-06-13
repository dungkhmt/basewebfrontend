import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";

function TeacherViewLogUserCourseChapterMaterialList(props) {
  const classId = props.classId;
  const [logs, setLogs] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const columns = [
    { title: "User", field: "userLoginId" },
    { title: "Name", field: "fullName" },
    { title: "Material", field: "eduCourseMaterialName" },
    { title: "Date", field: "createdStamp" },
  ];

  const getLogs = () => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/get-log-user-course-chapter-material/` + classId,
      (res) => {
        setLogs(res.data);
        console.log(
          "get-log-user-course-chapter-material res.data = ",
          res.data
        );
      }
    );
  };

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Lich su hoc tap"}
          columns={columns}
          data={logs}
        />
      </CardContent>
    </Card>
  );
}

export default TeacherViewLogUserCourseChapterMaterialList;
