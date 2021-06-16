import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  Tooltip,
} from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { request } from "../../../api";

function ClassTeacherAssignmentPlanList() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [plans, setPlans] = useState([]);

  const columns = [
    {
      title: "PlanID",
      field: "planId",
      render: (rowData) => (
        <Link to={"/edu/course/detail/" + rowData["id"]}>{rowData["id"]}</Link>
      ),
    },
    { title: "Tên Plan", field: "planName" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Ngày tạo", field: "createdStamp" },
  ];

  async function getClassTeacherAssignmentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-all-class-teacher-assignment-plan",
      (res) => {
        setPlans(res.data);
      }
    );
  }

  useEffect(() => {
    getClassTeacherAssignmentList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách bản kế hoach phân công"}
          columns={columns}
          data={plans}
          actions={[
            {
              icon: () => {
                return <AddIcon color="primary" fontSize="large" />;
              },
              tooltip: "Thêm Contest",
              isFreeAction: true,
              onClick: () => {
                history.push("create-programming-contest");
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

export default ClassTeacherAssignmentPlanList;
