import React from "react";
import StudentQuizView from "./StudentQuizView";

function StudentCourseQuizList({ quizzList }) {
  return (
    <div>
      {quizzList.map((quizz, index) => (
        <StudentQuizView key={quizz.questionId} quizz={quizz} index={index} />
      ))}
    </div>
  );
}

export default StudentCourseQuizList;
