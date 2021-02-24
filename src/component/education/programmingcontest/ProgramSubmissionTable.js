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
import axios from "axios";
import { API_URL } from "../../../config/config";

function ProgramSubmissionTable() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [programSubmissions, setProgramSubmissions] = useState([]);

  const columnSubmissions = [
    {
      title: "ID bài tập",
      field: "problemId",
      render: (rowData) => (
        <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
          {rowData["problemId"]}
        </Link>
      ),
    },
    { title: "Tên bài tập", field: "problemName" },
    { title: "Người nộp", field: "submittedByUserLoginId" },
    { title: "Thời gian nộp", field: "createdStamp" },
    { title: "Points", field: "points" },
    {
      title: "ID",
      field: "contestProgramSubmissionId",
      render: (rowData) => (
        <Button
          color="primary"
          variant="outlined"
          onClick={() => onDownload(rowData["contestProgramSubmissionId"])}
        >
          Tải xuống
        </Button>
      ),
    },
  ];

  const onDownload = (submissionId) => {
    axios
      .get(`${API_URL}/get-detail-contest-program-submission/${submissionId}`, {
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": token,
        },
        responseType: "blob",
      })
      .then((res) => {
        const headerval = res.headers["content-disposition"];
        const filename = headerval
          .split(";")[1]
          .split("=")[1]
          .replace('"', "")
          .replace('"', "");

        saveFile(filename, res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveFile = (fileName, data) => {
    let blob = new Blob([data]);

    //IE11 support
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let link = window.document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // other browsers
      // Second approach but cannot specify saved name!
      // let file = new File([data], fileName, { type: "application/zip" });
      // let exportUrl = URL.createObjectURL(file);
      // window.location.assign(exportUrl);
      // URL.revokeObjectURL(exportUrl);
    }
  };

  async function getContestProgramSubmissionList() {
    let submissions = await authGet(
      dispatch,
      token,
      "/get-all-contest-program-submissions"
    );
    setProgramSubmissions(submissions);
  }

  useEffect(() => {
    getContestProgramSubmissionList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách Bài nộp"}
          columns={columnSubmissions}
          data={programSubmissions}
        />
      </CardContent>
    </Card>
  );
}

export default ProgramSubmissionTable;
