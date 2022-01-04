import {
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@material-ui/core/";
import parse from "html-react-parser";
import MaterialTable, { MTableBody } from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { authGet, authPostMultiPart } from "../../../api";

function ContestProblemDetailForSubmit(props) {
  const params = useParams();
  const problemId = params.problemId;
  const contestId = params.contestId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [problem, setProblem] = useState(null);
  const [problemStatement, setProblemStatement] = useState(null);
  const columns = [
    { field: "test", title: "Test" },
    { field: "output", title: "Result" },
  ];

  function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0].name);
  }
  function onFileUpload() {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      problemId: problemId,
      contestId: contestId,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(dispatch, token, "/upload-program", formData)
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);
        if (res != undefined) setRows(res.items);
        else {
          alert("You should re-submit again");
        }
        var f = document.getElementById("selected-upload-file");
        f.value = null;
        setSelectedFile(null);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
      });
  }
  async function getContestProblem() {
    let res = await authGet(
      dispatch,
      token,
      "/get-contest-problem/" + problemId
    );
    setProblem(res);
    console.log(res);
    setProblemStatement(parse(res.problemStatement));
  }
  useEffect(() => {
    getContestProblem();
  }, []);

  return (
    <Card>
      <CardContent>
        <div>{problemStatement}</div>
        <input type="file" id="selected-upload-file" onChange={onFileChange} />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "45px" }}
          onClick={onFileUpload}
        >
          Submit
        </Button>
        <div>
          <MaterialTable
            options={{ search: true }}
            title={"Kết quả"}
            columns={columns}
            data={rows}
            components={{
              Body: (props) => {
                return isProcessing ? (
                  <tbody>
                    <tr>
                      <td
                        colspan={columns.length}
                        style={{ height: 245, textAlign: "center" }}
                      >
                        <CircularProgress />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <MTableBody {...props} />
                );
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ContestProblemDetailForSubmit;
