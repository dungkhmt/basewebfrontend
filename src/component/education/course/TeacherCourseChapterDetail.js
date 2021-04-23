

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

function TeacherCourseChapterDetail(){
    const params = useParams();
    const chapterId = params.chapterId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [courseChapter, setCourseChapter] = useState(null);
    
    useEffect(() => {
          
        console.log(chapterId);
        }, []);

    return(
        <Card>
            <CardContent>
                <TeacherCourseChapterMaterialList chapterId={chapterId}/>
            </CardContent>
        </Card>
    );
}

export default TeacherCourseChapterDetail;