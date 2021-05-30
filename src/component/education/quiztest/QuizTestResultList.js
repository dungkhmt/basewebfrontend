
import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";

//import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';

import ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice from "./ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice";

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const headerProperties = {
    headerStyle: {
        fontSize: 16,
        backgroundColor: 'rgb(63, 81, 181)',
        color: 'white'
    },
    
};

let count = 0;

export default function QuizTestStudentListResult(props) {

    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const columns = [
        {
            field: "userLoginId",
            title: "MSSV",
            ...headerProperties,
        },
        {
            field: "fullName",
            title: "Họ và tên",
            ...headerProperties,
            width: "40%"
        },
        {
            field: "groupId",
            title: "Group",
            ...headerProperties
        },
        {
            field: "questionId",
            title: "Question ID",
            ...headerProperties
        },
        {
            field: "grade",
            title: "Điểm",
            ...headerProperties
        },
    ]
    const generalColumns = [
        {
            field: "fullName",
            title: "Họ và tên",
            ...headerProperties,
            width: "40%"
        },
        {
            field: "groupId",
            title: "Group",
            ...headerProperties
        },
        {
            field: "grade",
            title: "Điểm",
            ...headerProperties
        },
    ]

    let testId = props.testId;
    let isGeneral = props.isGeneral;

    const [studentListResult, setStudentListResult] = useState([]);

    async function getStudentListResultGeneral() {
        let input = {"testId" : testId};
        request(token, history,"Post", '/get-quiz-test-participation-execution-result', (res) => {
            let temp = [];

            let objectResult ={};
            res.data.map((elm, index) => {
                
                if(objectResult[elm.participationUserLoginId]==null){
                    let userObj = { groupId : elm.quizGroupId, fullName: elm.participationFullName ,  grade: elm.grade  }
                    objectResult[elm.participationUserLoginId] = userObj;
                }else{
                    objectResult[elm.participationUserLoginId]['grade'] += elm.grade;
                }
            })
            Object.keys(objectResult).map((ele,ind)=>{
                temp.push(objectResult[ele]);
            })

            console.log(temp);
            setStudentListResult(temp);
        },
        {},
        input
        )
    }

    async function getStudentListResult() {
        let input = {"testId" : testId};
        request(token, history,"Post", '/get-quiz-test-participation-execution-result', (res) => {
            let temp = [];
            res.data.map((elm, index) => {
                temp.push({ userLoginId : elm.participationUserLoginId, fullName: elm.participationFullName, groupId : elm.quizGroupId, questionId : elm.questionId, grade: elm.grade });
            })
            setStudentListResult(temp);
        },
        {},
        input
        )
    }

    useEffect(() => {
        if(isGeneral){
            getStudentListResultGeneral();
        }else{
            getStudentListResult();
        }
        
        return () => {
          
        }
    }, []);

    return(
        <div style={{width: '105%', marginLeft: '-2.5%'}}>
            <MaterialTable
                title=""
                columns={ (isGeneral ? generalColumns : columns ) }
                data={studentListResult}
                //icons={tableIcons}
                localization={{
                    header: {
                        actions: "",
                    },
                    body: {
                        emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                        filterRow: {
                            filterTooltip: "Lọc",
                        },
                    },
                }}
                options={{
                    search: true,
                    actionsColumnIndex: -1,
                    pageSize: 8,
                    tableLayout: "fixed",
                    //selection: true
                }}
                style={{
                    fontSize: 16
                }}
            />
        <ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice testId = {testId}/>   
        </div>
    )
}