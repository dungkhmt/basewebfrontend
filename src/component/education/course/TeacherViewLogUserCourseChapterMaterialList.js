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
import { authPost, authGet, authPostMultiPart, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

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
      token,
      history,
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
