import { Card, CardContent } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";
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
