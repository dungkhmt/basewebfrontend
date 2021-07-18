import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";

function TeacherViewLogUserQuizList(props) {
  const classId = props.classId;
  const [logs, setLogs] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const columns = [
    { title: "User", field: "userLoginId" },
    { title: "Name", field: "fullName" },
    { title: "questionId", field: "questionId" },
    { title: "course", field: "courseName" },
    { title: "topic", field: "topicName" },
    { title: "Date", field: "createdStamp" },
  ];

  const getLogs = () => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/get-log-user-quiz/` + classId,
      (res) => {
        setLogs(res.data);
        console.log("get-log-user-quiz res.data = ", res.data);
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

export default TeacherViewLogUserQuizList;
