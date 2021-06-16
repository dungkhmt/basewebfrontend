import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     padding: theme.spacing(4),
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       width: "100%",
//       minWidth: 120,
//     },
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//     maxWidth: 300,
//   },
// }));

let reDirect = null;

// const editorStyle = {
//   toolbar: {
//     background: "#90caf9",
//   },
//   editor: {
//     border: "1px solid black",
//     minHeight: "300px",
//   },
// };

function ProblemsOfProgrammingContestAndUser(props) {
  const params = useParams();
  const contestId = params.contestId;
  //const contestId = props.contestId;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  // const classes = useStyles();
  const [problems, setProblems] = useState([]);

  // const [alertMessage, setAlertMessage] = useState({
  //   title: "Vui lòng nhập đầy đủ thông tin cần thiết",
  //   content:
  //     "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại.",
  // });
  // const [alertSeverity, setAlertSeverty] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);
  const history = useHistory();

  const columns = [
    {
      title: "ID bài tập",
      field: "problemId",
      render: (rowData) => (
        <Link
          to={
            "/edu/contest-problem/detail/submit/" +
            rowData["problemId"] +
            "/" +
            contestId
          }
        >
          {rowData["problemId"]}
        </Link>
      ),
    },
    { title: "Tên bài tập", field: "problemName" },
    { title: "Level", field: "levelId" },
    { title: "Thể loại", field: "categoryId" },
  ];

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const onClickAlertBtn = () => {
    setOpenAlert(false);
    if (reDirect != null) {
      history.push(reDirect);
    }
  };

  async function handleSubmit() {
    let body = { contestId: contestId };
    //let body = {problemId,problemName,statement};
    let contest = await authPost(
      dispatch,
      token,
      "/register-programming-contest",
      body
    );
    console.log("return ", contest);

    history.push("contestprogramming");
  }
  async function getProblemsOfTheProgrammingContest() {
    let lst = await authGet(
      dispatch,
      token,
      "/get-problems-of-programming-contest-and-user/" + contestId
    );
    setProblems(lst);
  }
  useEffect(() => {
    getProblemsOfTheProgrammingContest();
  }, []);
  return (
    <MaterialTable title={"Danh sách Bài"} columns={columns} data={problems} />
  );
}

export default ProblemsOfProgrammingContestAndUser;
