import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { request } from "../../../api";

function QuizTestGroupParticipants(props) {
  const [data, setData] = useState([]);
  let testId = props.testId;
  const columns = [
    { title: "Group Id", field: "quizTestGroupId" },
    { title: "Group Code", field: "quizTestGroupCode" },
    { title: "UserLoginId", field: "participantUserLoginId" },
    { title: "FullName", field: "fullName" },
  ];

  async function getQuizTestGroupParticipants() {
    request(
      // token,
      // history,
      "get",
      "get-all-quiz-test-group-participants/" + testId,
      (res) => {
        // console.log(res);
        //alert('assign students to groups OK');
        setData(res.data);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getQuizTestGroupParticipants();
  }, []);

  return (
    <MaterialTable
      title={"Phân thí sinh vào các đề"}
      columns={columns}
      data={data}
    />
  );
}

export default QuizTestGroupParticipants;
