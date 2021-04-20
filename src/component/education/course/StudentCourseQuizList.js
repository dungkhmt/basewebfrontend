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
  import AddIcon from '@material-ui/icons/Add';

function StudentCourseQuizList(props){
    const params = useParams();
    const courseId = props.courseId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [quizs, setQuizs] = useState([]);

    const columns = [
        { title: 'QuizId', field: 'questionId',
            render: rowData => (
                <Link to={"/edu/student/course/chapter/detail/" + rowData["questionId"]}>
                {rowData["questionId"]}
                </Link>
            )
        },
        { title: 'Statement', field: 'statement'}

       
      ];

    async function getQuizList(){
        let lst = await authGet(dispatch, token, '/get-quiz-of-course/' + courseId);
        setQuizs(lst);   
        console.error('quiz list = ',lst);     
    }
  
      useEffect(() => {
        console.log("StudentCourseQuizList, useEffect, courseId = ",courseId)  
        getQuizList();
        
        }, []);
     
    return (
        <Card>
            <CardContent>
            <MaterialTable
                title={"Quiz"}
                columns={columns}
                data = {quizs}    
                
                />                
            </CardContent>
        </Card>
    );
  
}

export default StudentCourseQuizList;
