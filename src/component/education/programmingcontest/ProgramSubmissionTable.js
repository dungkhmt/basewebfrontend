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
  import {Link} from "react-router-dom";
  
function ProgramSubmissionTable(){
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [programSubmissions, setProgramSubmissions] = useState([]);

    const columnSubmissions = [
        { title: 'ID bài tập', field: 'problemId', 
          render: rowData => (
            <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
            {rowData["problemId"]}
            </Link>
          )
        },
        { title: 'Tên bài tập', field: 'problemName' },
        { title: 'Người nộp', field: 'submittedByUserLoginId' },
        { title: 'Thời gian nộp', field: 'createdStamp' },     
        { title: 'Points', field: 'points' },     
        { title: 'ID', field: 'contestProgramSubmissionId', 
          render: rowData => (
            <Link to={"/edu/contest-program-submission/detail/" + rowData["contestProgramSubmissionId"]}>
            {rowData["contestProgramSubmissionId"]}
            </Link>
          )
        },
      ];

      async function getContestProgramSubmissionList(){
        let submissions = await authGet(dispatch, token, '/get-all-contest-program-submissions');
        setProgramSubmissions(submissions);
        
    }
  
      useEffect(() => {
          
          getContestProgramSubmissionList();
        }, []);
     

    return(
        <Card>
            <CardContent>
            <MaterialTable
                title={"Danh sách Bài nộp"}
                columns={columnSubmissions}
                data = {programSubmissions}    
                />  

                
            </CardContent>
        </Card>
    );
}

export default ProgramSubmissionTable;