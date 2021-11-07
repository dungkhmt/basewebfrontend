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
import MaterialTable, { MTableToolbar } from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { request } from "../../../api";
import CreateClassTeacherAssignmentPlanModal from "./CreateClassTeacherAssignmentPlan";

function ClassTeacherAssignmentPlanList() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [plans, setPlans] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");

  const columns = [
    {
      title: "Tên",
      field: "planName",
      render: (rowData) => (
        <Link
          to={{
            pathname: `/edu/class-teacher-assignment-plan/detail/${rowData.planId}`,
          }}
          style={{
            textDecoration: "none",
            whiteSpace: "pre-wrap" /* css-3 */,
            whiteSpace: "-moz-pre-wrap" /* Mozilla, since 1999 */,
            whiteSpace: "-pre-wrap" /* Opera 4-6 */,
            whiteSpace: "-o-pre-wrap" /* Opera 7 */,
            wordWrap: "break-word" /* Internet Explorer 5.5+ */,
          }}
        >
          {rowData.planName}
        </Link>
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

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };
  async function createPlan(planName) {
    let datasend = { planName: planName };
    request(
      // token,
      // history,
      "post",
      "create-class-teacher-assignment-plan",
      (res) => {
        console.log("create-class-teacher-assignment-plan ", res);
        //alert("create-class-teacher-assignment-plan " + res.data);
      },
      { 401: () => {} },
      datasend
    );
  }
  const customCreateHandle = (planName) => {
    console.log(planName);
    //setSearchString(sString);
    alert("create plan " + planName);
    createPlan(planName);
    handleModalClose();
  };

  useEffect(() => {
    getClassTeacherAssignmentList();
  }, []);

  return (
    <Card>
      <MaterialTable
        title={"Danh sách bản kế hoach phân công"}
        columns={columns}
        data={plans}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleModalOpen} color="primary">
                  Thêm mới
                </Button>
              </div>
            </div>
          ),
        }}
      />

      <CreateClassTeacherAssignmentPlanModal
        open={open}
        onClose={handleModalClose}
        onCreate={customCreateHandle}
      />
    </Card>
  );
}

export default ClassTeacherAssignmentPlanList;
