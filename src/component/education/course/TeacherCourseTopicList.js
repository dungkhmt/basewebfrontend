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

function TeacherCourseTopicList(props){
    const params = useParams();
    const courseId = props.courseId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [topics, setTopics] = useState([]);

    const columns = [
        { title: 'Topic Id', field: 'quizCourseTopicId'},
        { title: 'Topic Name', field: 'quizCourseTopicName'}
       
      ];

    async function getTopicList(){
        let lst = await authGet(dispatch, token, '/get-quiz-course-topics-of-course/' + courseId);
        setTopics(lst);        
    }
  
      useEffect(() => {
          
        getTopicList();
        
        }, []);
     
    return (
        <Card>
            <CardContent>
            <MaterialTable
                title={"Topics"}
                columns={columns}
                data = {topics}    
                actions={[
                    {
                      icon: () => { return <AddIcon color='primary' fontSize='large' /> },
                      tooltip: 'Thêm mới',
                      isFreeAction: true,
                      onClick: () => {history.push('topic/create/' + courseId)}
                    },
                  ]}
                />                
            </CardContent>
        </Card>
    );

}

export default TeacherCourseTopicList;
