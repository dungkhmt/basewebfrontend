

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
  import TeacherCourseChapterMaterialList from "./TeacherCourseChapterMaterialList";
  import TeacherCourseQuizChoiceAnswerList from "./TeacherCourseQuizChoiceAnswerList";
  import TeacherCourseQuizContent from "./TeacherCourseQuizContent";
function TeacherCourseQuizDetail(){
    const params = useParams();
    const questionId = params.questionId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [courseChapter, setCourseChapter] = useState(null);
    
    useEffect(() => {
          
        
        }, []);

    return(
        <Card>
            <CardContent>
                <TeacherCourseQuizContent questionId={questionId}/>
                <TeacherCourseQuizChoiceAnswerList questionId={questionId}/>
            </CardContent>
        </Card>
    );
}

export default TeacherCourseQuizDetail;