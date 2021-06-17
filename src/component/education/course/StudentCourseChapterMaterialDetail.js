import { Card, CardContent } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";
import Player from "../../../utils/Player";

function StudentCourseChapterMaterialDetail() {
  const params = useParams();
  const chapterMaterialId = params.chapterMaterialId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [chapterMaterial, setChapterMaterial] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const [chapterName, setChapterName] = useState(null);

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
    setChapterId(res.eduCourseChapter.chapterId);
    setChapterName(res.eduCourseChapter.chapterName);
  }

  useEffect(() => {
    getCourseChapterMaterialDetail();
    //setSourceId(chapterMaterial.sourceId);
  }, []);

  return (
    <Card>
      <CardContent>
        Quay về chương:{" "}
        <Link to={"/edu/student/course/chapter/detail/" + chapterId}>
          {chapterName}
        </Link>
        <Player id={sourceId} />
      </CardContent>
    </Card>
  );
}

export default StudentCourseChapterMaterialDetail;
