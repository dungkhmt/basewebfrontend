import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
} from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

function StudentCourseChapterList(props) {
  const params = useParams();
  const courseId = props.courseId;
  const classId = props.classId;
  const chapterList = props.chapters;
  const [chapters, setChapters] = useState(() => {
    console.log("StudentCourseChapterList, chapters = ", props.chapters);
    return props.chapters;
  });
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  //const [chapters, setChapters] = useState([]);

  const columns = [
    {
      title: "ChapterId",
      field: "chapterId",
      render: (rowData) => (
        <Link to={"/edu/student/course/chapter/detail/" + rowData["chapterId"]}>
          {rowData["chapterId"]}
        </Link>
      ),
    },
    { title: "Chapter Name", field: "chapterName" },
  ];

  async function getChapterList() {
    let lst = await authGet(
      dispatch,
      token,
      "/edu/class/get-chapters-of-course"
    );
    setChapters(lst);
  }

  useEffect(() => {
    //setChapters(chapterList);
    //getChapterList();
    //console.log('StudentCourseChapterList, courseId = ' + courseId);
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Chương"}
          columns={columns}
          data={props.chapters.map((chap) => (
            <chap.chapterId />
          ))}
        />
      </CardContent>
    </Card>
  );
}

export default StudentCourseChapterList;
