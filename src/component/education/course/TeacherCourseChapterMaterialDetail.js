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
import Player from "../../../utils/Player";

function TeacherCourseChapterMaterialDetail() {
  const params = useParams();
  const chapterMaterialId = params.chapterMaterialId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [chapterMaterial, setChapterMaterial] = useState(null);
  const [sourceId, setSourceId] = useState(null);

  async function getCourseChapterMaterialDetail() {
    let res = await authGet(
      dispatch,
      token,
      "/edu/class/get-course-chapter-material-detail/" + chapterMaterialId
    );
    //let res = authGet(dispatch, token, '/edu/class/get-course-chapter-material-detail/' + chapterMaterialId);
    setChapterMaterial(res);
    console.log("getCourseChapterMaterialDetail ", res);
    setSourceId(res.sourceId);
  }

  useEffect(() => {
    getCourseChapterMaterialDetail();
    //setSourceId(chapterMaterial.sourceId);
  }, []);

  return (
    <Card>
      <CardContent>
        MaterialDetail{" "}
        <Link to={"/edu/teacher/course/chapter/detail/" + chapterMaterialId}>
          {chapterMaterialId}
        </Link>
        <Player id={sourceId} />
      </CardContent>
    </Card>
  );
}

export default TeacherCourseChapterMaterialDetail;
