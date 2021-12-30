import React from "react";
import { useHistory, useParams } from "react-router";
import LearningSessionTeacherViewQuizTestList from "./LearningSessionTeacherViewQuizTestList";
export default function TeacherViewLearningSessionDetail() {
  const params = useParams();
  const sessionId = params.sessionId;
  return (
    <div>
      <h1>Session detail {sessionId}</h1>
      <LearningSessionTeacherViewQuizTestList sessionId={sessionId} />
    </div>
  );
}
