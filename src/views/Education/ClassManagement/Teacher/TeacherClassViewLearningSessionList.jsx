import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import { Button, Tooltip, Link } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import TeacherCreateSessionForm from "./TeacherCreateSessionForm";
import { Link as RouterLink } from "react-router-dom";
export default function TeacherClassViewLearningSessionList(props) {
  const classId = props.classId;
  const [sessions, setSessions] = useState([]);
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: "Tên buổi học",
      field: "sessionId",
      render: (rowData) => (
        <Link
          component={RouterLink}
          to={`/edu/teacher/class/session/detail/${rowData["sessionId"]}`}
        >
          {rowData["sessionName"]}
        </Link>
      ),
    },
    { title: "Mô tả", field: "description" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Trạng thái", field: "statusId" },
  ];
  function getSessionsOfClass() {
    request(
      "get",
      "/edu/class/get-sessions-of-class/" + classId,
      (res) => {
        console.log(res);
        setSessions(res.data);
      },
      { 401: () => {} }
    );
  }

  function handleAddSession() {
    setOpen(true);
  }
  useEffect(() => {
    getSessionsOfClass();
  }, []);
  return (
    <div>
      <h1>Danh sách buổi học {classId}</h1>
      <MaterialTable
        title="Danh sách buổi học"
        columns={columns}
        data={sessions}
        //icons={tableIcons}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
            filterRow: {
              filterTooltip: "Lọc",
            },
          },
        }}
        options={{
          search: true,
          sorting: false,
          actionsColumnIndex: -1,
          pageSize: 8,
          tableLayout: "fixed",
        }}
        style={{
          fontSize: 14,
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Thêm mới một kỳ thi"
                  aria-label="Thêm mới một kỳ thi"
                  placement="top"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSession}
                  >
                    <AddIcon style={{ color: "white" }} fontSize="default" />
                    &nbsp;&nbsp;&nbsp;Thêm mới&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
        ]}
      />
      <TeacherCreateSessionForm
        open={open}
        setOpen={setOpen}
        classId={classId}
      />
    </div>
  );
}
