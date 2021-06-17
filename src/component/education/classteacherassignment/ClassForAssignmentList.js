import { Button, Card } from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { request } from "../../../api";

function ClassForAssignmentList(props) {
  const planId = props.planId;
  const [classList, setClassList] = useState([]);

  const columns = [
    { title: "classId", field: "classId" },
    { title: "Tên lớp", field: "className" },
    { title: "Tên môn", field: "courseId" },
    { title: "Học kỳ", field: "semesterId" },
  ];

  async function getClassTeacherAssignmentClassInfoList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-list-for-assignment-2-teacher/" + planId,
      (res) => {
        setClassList(res.data);
      }
    );
  }

  function handleUploadExcel() {}

  useEffect(() => {
    getClassTeacherAssignmentClassInfoList();
  }, []);
  return (
    <Card>
      <MaterialTable
        title={"Danh sách lớp chưa phân công"}
        columns={columns}
        data={classList}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleUploadExcel} color="primary">
                  Upload excel
                </Button>
              </div>
            </div>
          ),
        }}
      />
    </Card>
  );
}

export default ClassForAssignmentList;
