import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../../config/config";
import {Link} from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useHistory } from "react-router-dom";
import { CardContent, Tooltip, IconButton, BarChartIcon } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

function ProgrammingContest(){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [problems, setProblems] = useState([]);

    const columns = [
        { title: 'ID bài tập', field: 'problemId', 
          render: rowData => (
            <Link to={"/edu/contest-problem/detail/submit/" + rowData["problemId"]}>
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
    useEffect(() => {
        getContestProblemList();
      }, []);
    
    return(
        <div>
            <CardContent>
                <MaterialTable
                title={"Danh sách Bài"}
                columns={columns}
                data = {problems}
                
                />
            </CardContent>
        </div>
    );
}

export default ProgrammingContest;