import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../../config/config";
import {Link} from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useHistory } from "react-router-dom";
import { CardContent, Tooltip, IconButton, BarChartIcon } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ContestUserProblemTable from "./ContestUserProblemTable";
import ProgramSubmissionTable from "./ProgramSubmissionTable";
import ProgrammingContestUserRegistrationTable from "./ProgrammingContestUserRegistrationTable";

import ContestTable from "./ContestTable";

function ManagementProgrammingContest(){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [problems, setProblems] = useState([]);
    //const [programSubmissions, setProgramSubmissions] = useState([]);

    /*
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
      { title: 'ID', field: 'contestProgramSubmissionId', 
        render: rowData => (
          <Link to={"/edu/contest-program-submission/detail/" + rowData["contestProgramSubmissionId"]}>
          {rowData["contestProgramSubmissionId"]}
          </Link>
        )
      },
    ];
    */

    const columns = [
        { title: 'ID bài tập', field: 'problemId', 
          render: rowData => (
            <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
            {rowData["problemId"]}
            </Link>
          )
        },
        { title: 'Tên bài tập', field: 'problemName' },
        { title: 'Mô tả', field: 'problemStatement' },
      ];

    async function getContestProblemList(){
        let problemList = await authGet(dispatch, token, '/contest-problem-list');
        setProblems(problemList);
        console.log(problemList);
    }
    /*
    async function getContestProgramSubmissionList(){
      let submissions = await authGet(dispatch, token, '/get-all-contest-program-submissions');
      setProgramSubmissions(submissions);
     
    }
    */

    useEffect(() => {
        getContestProblemList();
        //getContestProgramSubmissionList();
      }, []);
    
    return(
        <div>
            <ContestTable/>
            <ProgrammingContestUserRegistrationTable/>
            <ContestUserProblemTable

            />
            <ProgramSubmissionTable
            />

            <CardContent>
            
                <MaterialTable
                title={"Danh sách Bài"}
                columns={columns}
                data = {problems}
                actions={[
                    {
                      icon: () => { return <AddIcon color='primary' fontSize='large' /> },
                      tooltip: 'Thêm bài thi',
                      isFreeAction: true,
                      onClick: () => { history.push('create-contest-problem') }
                    },
                  ]}
                />
            </CardContent>
        </div>
    );
}

export default ManagementProgrammingContest;