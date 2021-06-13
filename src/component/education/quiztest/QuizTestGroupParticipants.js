import { Card, CardContent } from "@material-ui/core/";
//import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};

function QuizTestGroupParticipants(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
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
        console.log(res);
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
    <Card>
      <CardContent>
        <MaterialTable
          title={"Phân thí sinh vào các đề"}
          columns={columns}
          data={data}
        />
      </CardContent>
    </Card>
  );
}

export default QuizTestGroupParticipants;
