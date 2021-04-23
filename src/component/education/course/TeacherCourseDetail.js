
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
  import TeacherCourseChapterList from "./TeacherCourseChapterList";
import TeacherCourseQuizList from "./TeacherCourseQuizList";

function TeacherCourseDetail(){
    const params = useParams();
    const courseId = params.id;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [course, setCourse] = useState(null);
    
    useEffect(() => {
          
        console.log(courseId);
        }, []);

    return(
        <Card>
            <CardContent>
                <TeacherCourseChapterList courseId={courseId}/>
                <TeacherCourseQuizList courseId={courseId}/>
            </CardContent>
        </Card>
    );
}

export default TeacherCourseDetail;
