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

function StudentCourseChapterList(props){
    const params = useParams();
    const courseId = props.courseId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [chapters, setChapters] = useState([]);

    const columns = [
        { title: 'ChapterId', field: 'chapterId',
            render: rowData => (
                <Link to={"/edu/student/course/chapter/detail/" + rowData["chapterId"]}>
                {rowData["chapterId"]}
                </Link>
            )
        },
        { title: 'Chapter Name', field: 'chapterName'}
       
      ];

    async function getChapterList(){
        let lst = await authGet(dispatch, token, '/edu/class/get-chapters-of-course');
        setChapters(lst);        
    }
  
      useEffect(() => {
          
        getChapterList();
        console.log('StudentCourseChapterList, courseId = ' + courseId);
        }, []);
     
    return (
        <Card>
            <CardContent>
            <MaterialTable
                title={"Chương"}
                columns={columns}
                data = {chapters}    
                
                />                
            </CardContent>
        </Card>
    );
  
}

export default StudentCourseChapterList;
