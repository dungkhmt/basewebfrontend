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
  import { makeStyles } from "@material-ui/core/styles";
  import PositiveButton from "../classmanagement/PositiveButton";

  const useStyles = makeStyles((theme) => ({
    card: {
      marginTop: theme.spacing(2),
      borderRadius: "6px",
    },
    registrationBtn: {},
  }));

function TeacherCourseChapterList(props){
    const params = useParams();
    const classes = useStyles();
    const courseId = props.courseId;
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [chapters, setChapters] = useState([]);

    const columns = [
        { title: 'ChapterId', field: 'chapterId',
            render: rowData => (
                <Link to={"/edu/teacher/course/chapter/detail/" + rowData["chapterId"]}>
                {rowData["chapterId"]}
                </Link>
            )
        },
        { title: 'Chapter Name', field: 'chapterName'},
        { title: 'Status', field: 'statusId'},
       
        {
          field: "",
          title: "",
          cellStyle: { textAlign: "center" },
          render: (rowData) =>
            
              <PositiveButton
                label="Thay đổi trạng thái"
                disableRipple
                className={classes.registrationBtn}
                onClick={() => changeStatus(rowData)}
              />
           
        },

      ];

    const changeStatus = (rowData) => {
      //alert('change status');
      let statusId = authGet(dispatch, token, '/edu/class/change-chapter-status/' + rowData.chapterId);
      console.log('change status, return status = ' + statusId);
      history.push('/edu/course/detail/' + courseId);
    } 

    async function getChapterList(){
        let lst = await authGet(dispatch, token, '/edu/class/get-chapters-of-course/' + courseId);
        setChapters(lst);        
    }
  
      useEffect(() => {
          
        getChapterList();
        console.log('TeacherCourseChapterList, courseId = ' + courseId);
        }, []);
     
    return (
        <Card>
            <CardContent>
            <MaterialTable
                title={"Chương"}
                columns={columns}
                data = {chapters}   
                onRowClick={(event, rowData) => {
                  console.log(rowData);                  
                }} 
                actions={[
                    {
                      icon: () => { return <AddIcon color='primary' fontSize='large' /> },
                      tooltip: 'Thêm mới',
                      isFreeAction: true,
                      onClick: () => { history.push('chapter/create/' + courseId) }
                    },
                  ]}
                />                
            </CardContent>
        </Card>
    );
  
}

export default TeacherCourseChapterList;
