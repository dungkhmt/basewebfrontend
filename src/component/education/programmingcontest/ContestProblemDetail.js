import {
    Button, Card, CardActions, CardContent, TextField, Typography,
    MenuItem, Checkbox, 
  } from "@material-ui/core/";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { authPost, authGet, authPostMultiPart } from "../../../api";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router";

function ContestProblemDetail(props){
    const params = useParams();
    const problemId = params.problemId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();

    const [selectedInputFile, setSelectedInputFile] = useState(null);
    const [selectedOutputFile, setSelectedOutputFile] = useState(null);
    const [testName, setTestName] = useState(null);
    const [testPoint, setTestPoint] = useState(null);

    function onUpload(){
        let body = {
            problemId: problemId,
            testName: testName,
            testPoint: testPoint
        };
        console.log("onUpload, body = " + body);
        let formData = new FormData();
        formData.append("inputJson", JSON.stringify(body));
        formData.append("files",selectedInputFile);
        formData.append("files",selectedOutputFile);

        authPostMultiPart(dispatch, token, "/create-contest-problem-test", formData).then(
            res => {
                console.log('res = ',res);
                
            }
        );

    }
    function onInputFileChange(event){
        setSelectedInputFile(event.target.files[0]);
    }
    function onOutputFileChange(event){
        setSelectedOutputFile(event.target.files[0]);
    }
    
    return(
        <Card>
            <CardContent>
                <form>
                <TextField
              id="testName"
              label="Tên Test"
              placeholder="Tên Test"
              value={testName}
              multiline={true}
              rows="1"
              
              onChange={(event) => {
                setTestName(event.target.value);
              }}
            />
            <br></br><br></br>
            <TextField
              id="testPoint"
              label="Điểm Test"
              placeholder="Điểm Test"
              value={testPoint}
              multiline={true}
              rows="1"
              
              onChange={(event) => {
                setTestPoint(event.target.value);
              }}
            />
            <br></br><br></br>
            <label>Select Input file</label>
            <input type="file" onChange={onInputFileChange} /><br></br><br></br>
            
            <label>Select Output file</label>
            <input type="file" onChange={onOutputFileChange} />
            
            
            <br></br><br></br>
            <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "40px" }}
                onClick={onUpload}
            >
                Lưu
            </Button>
            <Button
                variant="contained"
                onClick={() => history.push("/edu/management/contestprogramming")}
            >
                Hủy
            </Button>
            </form>
            </CardContent>
        </Card>
    );
}

export default ContestProblemDetail;