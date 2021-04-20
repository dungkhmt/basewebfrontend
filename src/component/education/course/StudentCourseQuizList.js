import React from "react";
import StudentQuizView from "./StudentQuizView";

function StudentCourseQuizList({ quizzList }) {
  return quizzList.map((q) => <StudentQuizView quizz={q} />);
}

export default StudentCourseQuizList;
