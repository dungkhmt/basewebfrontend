import {
    Button, Card, CardActions, CardContent, TextField, Typography,
    MenuItem, Checkbox, 
  } from "@material-ui/core/";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { authPost, authGet, authPostMultiPart } from "../../../api";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router";
  import MaterialTable from "material-table";

function ContestProblemDetail(props){
    const params = useParams();
    const problemId = params.problemId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [problem, setProblem] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);
    const [problemName, setProblemName] = useState(null);
	const [levelId,setLevelId] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [levelIdList, setLevelIdList] = useState([]);
	const [categoryIdList, setCategoryIdList] = useState([]);


    const [selectedInputFile, setSelectedInputFile] = useState(null);
    const [selectedOutputFile, setSelectedOutputFile] = useState(null);
    const [testName, setTestName] = useState(null);
    const [testPoint, setTestPoint] = useState(null);

    const [problemTests, setProblemTests] = useState([]);

    const columns = [
        { title: 'ID bài tập', field: 'problemId'           
        },
        { title: 'Tên Test', field: 'problemTestFilename' },
        { title: 'Điểm', field: 'problemTestPoint' },
      ];

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

        //getProblemTests();
        history.push("" + problemId);    
    }
    function onInputFileChange(event){
        setSelectedInputFile(event.target.files[0]);
    }
    function onOutputFileChange(event){
        setSelectedOutputFile(event.target.files[0]);
    }
    
    async function getProblemTests(){
        let problemTestList = await authGet(dispatch, token, '/get-contest-problem-test-list/' + problemId);
        setProblemTests(problemTestList);
        console.log('getProblemTests, GOT ',problemTestList);
    }
    async function getContestProblem(){
        let res = await authGet(dispatch, token, '/get-contest-problem/' + problemId);
        setProblem(res);
        console.log(res);
        setTimeLimit(res.timeLimit);
        setProblemName(res.problemName);
        setLevelId(res.levelId);
        setCategoryId(res.categoryId);
        //setProblemStatement(parse(res.problemStatement));
    }
    function handleSubmit(){
        let body = {
            problemId: problemId,
            problemName: problemName,
            timeLimit: timeLimit,
            levelId: levelId,
            categoryId: categoryId
        };

        let formData = new FormData();
        formData.append("inputJson", JSON.stringify(body));
        //formData.append("files",selectedInputFile);
        //formData.append("files",selectedOutputFile);

        authPostMultiPart(dispatch, token, "/update-contest-problem", formData).then(
            res => {
                console.log('res = ',res);
                alert('Update thành công');                
            }
        );
    }
	async function getContestProblemLevels(){
		let lst = await authGet(dispatch,token,'/get-contest-problem-level-list')
		setLevelIdList(lst);
	}  
	async function getContestProblemCategories(){
		let lst = await authGet(dispatch, token,'/get-contest-problem-category-list');
		setCategoryIdList(lst);
	}

    useEffect(() => {
        getContestProblem();
        getProblemTests();
        getContestProblemLevels();
        getContestProblemCategories();
    },[]);
    return(
        <Card>
            <CardContent>
                <form>
                
                <TextField
                  id="problemName"
                  label="Tên bài"
                  placeholder="Tên bài"
                  value={problemName}
                  multiline={true}
                  rows="1"
                  fullWidth
                  onChange={(event) => {
                    setProblemName(event.target.value);
                    }}
                />
                
                <TextField
                  id="timeLimit"
                  label="Giới hạn thời gian"
                  placeholder="Giới hạn thời gian"
                  value={timeLimit}
                  multiline={true}
                  rows="1"
                  fullWidth
                  onChange={(event) => {
                    setTimeLimit(event.target.value);
                    }}
                />
							<TextField
                				required
                				id="levelId"
                				select
                				label="Mức độ bài"
                				value={levelId}
                                fullWidth
                				onChange={(event) => {
                  					setLevelId(event.target.value);
									  //console.log(problemId,event.target.value);
                				}}
              				>
                			{levelIdList.map((item) => (
                  				<MenuItem key={item} value={item}>
                    				{item}
                  				</MenuItem>
                			))}
            				</TextField>
							<TextField
                				required
                				id="levelId"
                				select
                				label="Thể loại"
                				value={categoryId}
                                fullWidth
                				onChange={(event) => {
                  					setCategoryId(event.target.value);
									  //console.log(problemId,event.target.value);
                				}}
              				>
                			{categoryIdList.map((item) => (
                  				<MenuItem key={item} value={item}>
                    				{item}
                  				</MenuItem>
                			))}
            				</TextField>


                <br></br><br></br>
                <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "40px" }}
                onClick={handleSubmit}
                >
                    Lưu
                </Button>
                
            </form>
            </CardContent>
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

            <MaterialTable
                title={"Danh sách Test"}
                columns={columns}
                data = {problemTests}
                
            />

            </CardContent>
        </Card>
    );
}

export default ContestProblemDetail;