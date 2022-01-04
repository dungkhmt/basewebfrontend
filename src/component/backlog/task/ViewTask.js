import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authGet } from "../../../api";
import { toFormattedDateTime } from "../../../utils/dateutils";

export default function ViewTask(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [project, setProject] = useState({});
  const [taskDetail, setTaskDetail] = useState({});
  const [assignment, setAssignment] = useState([]);

  const [categoryPool, setCategoryPool] = useState([]);
  const [priorityPool, setPriorityPool] = useState([]);
  const [statusPool, setStatusPool] = useState([]);

  const backlogProjectId = props.match.params.backlogProjectId;
  const backlogTaskId = props.match.params.taskId;

  function mapIdToName(pool, compareField, compareValue, returnField) {
    return pool
      .filter((x) => {
        return x[compareField] === compareValue;
      })
      .map((y) => {
        return y[returnField];
      });
  }

  function checkNull(a, ifNotNull = a, ifNull = "") {
    return a ? ifNotNull : ifNull;
  }
  function getTaskDetail(taskId) {
    authGet(dispatch, token, "/backlog/get-task-detail/" + taskId).then(
      (res) => {
        setTaskDetail(res.backlogTask);
        setAssignment(res.assignment);
      }
    );
  }

  function getProject(projectId) {
    authGet(dispatch, token, "/backlog/get-project-by-id/" + projectId).then(
      (res) => {
        setProject(res);
      }
    );
  }

  function getTaskCategory() {
    authGet(dispatch, token, "/backlog/get-backlog-task-category").then(
      (res) => {
        if (res != null) setCategoryPool(res);
      }
    );
  }

  function getTaskPriority() {
    authGet(dispatch, token, "/backlog/get-backlog-task-priority").then(
      (res) => {
        if (res != null) setPriorityPool(res);
      }
    );
  }

  function getTaskStatus() {
    authGet(dispatch, token, "/backlog/get-backlog-task-status").then((res) => {
      if (res != null) setStatusPool(res);
    });
  }

  function assignmentToString(assignedUserList) {
    assignedUserList = assignedUserList || [];
    let assignedUserLoginId = [];
    assignedUserList.forEach((userLoginReduced) => {
      assignedUserLoginId.push(userLoginReduced.userLoginId);
    });
    return assignedUserLoginId.toString();
  }

  useEffect(() => {
    getTaskDetail(backlogTaskId);
    getProject(backlogProjectId);
    getTaskCategory();
    getTaskPriority();
    getTaskStatus();
  }, []);
  return (
    <div>
      <p></p>
      <div>
        <b>Mã dự án: </b> {project.backlogProjectId} <p />
        <b>Tên dự án: </b> {checkNull(project["backlogProjectName"])} <p />
        <b>Task ID: </b> {taskDetail.backlogTaskId} <p />
      </div>
      <Card>
        <CardContent>
          <div>
            <Grid container spacing={3}>
              <Grid xs={8}>
                <div>
                  <div style={{ padding: "0px 30px" }}>
                    <h4>{taskDetail.taskCreatedBy}</h4>
                    <b>Chủ đề: </b> {checkNull(taskDetail["backlogTaskName"])}{" "}
                    <p />
                    <b>Loại: </b>{" "}
                    {mapIdToName(
                      categoryPool,
                      "backlogTaskCategoryId",
                      checkNull(taskDetail["backlogTaskCategoryId"]),
                      "backlogTaskCategoryName"
                    )}{" "}
                    <p />
                    <b>Mô tả: </b> {checkNull(taskDetail["backlogDescription"])}{" "}
                    <p />
                    <b>Trạng thái: </b>{" "}
                    {mapIdToName(
                      statusPool,
                      "statusId",
                      checkNull(taskDetail["statusId"]),
                      "description"
                    )}{" "}
                    <p />
                    <b>Độ ưu tiên: </b>{" "}
                    {mapIdToName(
                      priorityPool,
                      "backlogTaskPriorityId",
                      checkNull(taskDetail["priorityId"]),
                      "backlogTaskPriorityName"
                    )}{" "}
                    <p />
                    <b>Phân công: </b> {assignmentToString(assignment)} <p />
                    <b>Ngày tạo: </b>{" "}
                    {toFormattedDateTime(taskDetail["createdDate"])} <p />
                    <b>Ngày cập nhật: </b>{" "}
                    {toFormattedDateTime(taskDetail["lastUpdateStamp"])} <p />
                    <b>Hạn cuối: </b>{" "}
                    {toFormattedDateTime(taskDetail["dueDate"])} <p />
                  </div>
                </div>
              </Grid>

              <Grid
                item
                xs={4}
                style={{
                  verticalAlign: "text-bottom",
                  textAlign: "right",
                  padding: "0px 50px 10px 30px",
                }}
              >
                <Button
                  color={"primary"}
                  variant={"contained"}
                  onClick={() =>
                    history.push(
                      "/backlog/edit-task/" +
                        backlogProjectId +
                        "/" +
                        backlogTaskId
                    )
                  }
                >
                  Sửa
                </Button>
                <Button
                  style={{ margin: "0 0 0 2px" }}
                  color={"primary"}
                  variant={"contained"}
                  onClick={() =>
                    history.push("/backlog/project/" + backlogProjectId)
                  }
                >
                  Danh sách task
                </Button>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
