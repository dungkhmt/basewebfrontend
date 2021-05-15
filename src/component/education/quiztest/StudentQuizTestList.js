/* eslint-disable */
import {
    Button, Card, CardActions, CardContent, TextField, Typography,
    MenuItem, Checkbox, 
  } from "@material-ui/core/";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { authPost, request, authPostMultiPart } from "../../../api";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router";
  import MaterialTable from "material-table";
  import AddIcon from '@material-ui/icons/Add';
function StudentQuizList(){
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [ListQuiz, setListQuizs] = useState([]);


    async function onRegisterClick(quizid){
        await registerQuiz(quizid)
        getQuizList()
    }
    const  onClickQuizId = (quizid)=>{
        alert('click ' + quizid)
    }
    const columns = [
        { title: 'Mã Quiz Test', field: 'testId',
        //   render: rowData => (
        //   <Link to={"/edu/programming-contest-detail/" + rowData["testId"]}>
        //   {rowData["contestId"]}
        //   </Link>
        //   )
            render: rowData => (
                <a style = {{ cursor : "pointer", }} onClick={()=> {onClickQuizId(rowData['testId'])}}> {rowData['testId']} </a>
            )
        },
        { title: 'Tên ', field: 'testName' },
        { title: 'Ngày', field: 'scheduleDatetime' },
        { title: 'Trạng thái', field: 'statusId' ,
            render: rowData => (
            (rowData['statusId'] == null) ? <Button variant="contained" color="primary" onClick={() => {  onRegisterClick(rowData['testId']); }}>
                Tham gia
              </Button> :( (rowData['statusId'] == 'STATUS_REGISTERED') ? (<p>Chờ phê duyệt </p> ) :((rowData['statusId'] == 'STATUS_APPROVED') ?<p>Đã phê duyệt </p>:<p>Bị từ chối </p>) ))
                
        },
    ];

    async function getQuizList(){
        request(
            token,
            history,
            "get",
            "/get-all-quiz-test-user",
            (res) => {
                console.log(res);
                setListQuizs(res.data);
            },
            { 401: () => {} }
          );  
        
    };
    async function registerQuiz(quizId){
        let datasend = {'testQuizId' : quizId}
        request(
            token,
            history,
            "post",
            "create-quiz-test-participation-register",
            (res) => {
                console.log(res);
            },
            { 401: () => {} },
            datasend
          );  
        console.log(datasend)
    }
  
      useEffect(() => {
          
        getQuizList();
        }, []);
     

    return(
        <Card>
            <CardContent>
            <MaterialTable
                title={"Danh sách Contest"}
                columns={columns}
                data = {ListQuiz}    
                />                
            </CardContent>
        </Card>
    );
}

export default StudentQuizList;