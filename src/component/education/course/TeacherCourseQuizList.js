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

function TeacherCourseQuizList(props){
    const params = useParams();
    const courseId = props.courseId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [quizs, setQuizs] = useState([]);

    const columns = [
        { title: 'QuestionId', field: 'questionId',
            render: rowData => (
                <Link to={"/edu/teacher/course/quiz/detail/" + rowData["questionId"]}>
                {rowData["questionId"]}
                </Link>
            )
        },
        { title: 'Level', field: 'levelId'}
       
      ];

    async function getQuestionList(){
        let lst = await authGet(dispatch, token, '/get-all-quiz-questions');
        setQuizs(lst);        
    }
  
      useEffect(() => {
          
        getQuestionList();
        
        }, []);
     
    return (
        <Card>
            <CardContent>
            <MaterialTable
                title={"Quizs"}
                columns={columns}
                data = {quizs}    
                actions={[
                    {
                      icon: () => { return <AddIcon color='primary' fontSize='large' /> },
                      tooltip: 'Thêm mới',
                      isFreeAction: true,
                      onClick: () => { history.push('quiz/create/' + courseId) }
                    },
                  ]}
                />                
            </CardContent>
        </Card>
    );

}

export default TeacherCourseQuizList;
