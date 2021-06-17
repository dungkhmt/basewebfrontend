import { Card } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import TeacherCourseQuizChoiceAnswerList from "./TeacherCourseQuizChoiceAnswerList";
import TeacherCourseQuizContent from "./TeacherCourseQuizContent";

function TeacherCourseQuizDetail() {
  const params = useParams();
  const questionId = params.questionId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [courseChapter, setCourseChapter] = useState(null);

  useEffect(() => {}, []);

  return (
    <Card>
      <TeacherCourseQuizContent questionId={questionId} />
      <TeacherCourseQuizChoiceAnswerList questionId={questionId} />
    </Card>
  );
}

export default TeacherCourseQuizDetail;
