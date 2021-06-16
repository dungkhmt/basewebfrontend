import { Button, Card, CardContent, TextField } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";

function ProgrammingContestUserRegistrationTable() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [contestUserRegistrations, setContestUserRegistrations] = useState([]);
  const [userLoginId, setUserLoginId] = useState(null);

  async function approve(contestId, userLoginId) {
    //alert('approve ' + contestId + ',' + userLoginId);
    let body = {
      contestId: contestId,
      userLoginId: userLoginId,
    };
    //let body = {problemId,problemName,statement};
    let contest = await authPost(
      dispatch,
      token,
      "/approve-programming-contest-registration",
      body
    );
    console.log("return contest registration approve ", contest);
    alert("FINISHED");

    history.push("contestprogramming");
  }
  const columns = [
    { title: "Contest", field: "contestId" },
    { title: "User", field: "userLoginId" },
    { title: "Status", field: "statusId" },
    {
      title: "Action",
      render: (rowData) => (
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "45px" }}
          onClick={() => approve(rowData["contestId"], rowData["userLoginId"])}
        >
          Approve
        </Button>
      ),
    },
  ];

  async function handleSearch() {
    let body = {
      userLoginId: userLoginId,
    };
    let lst = await authPost(
      dispatch,
      token,
      "/search-programming-contest-user-registration",
      body
    );
    setContestUserRegistrations(lst);
  }
  async function getProgrammingContestUserRegistration() {
    let lst = await authGet(
      dispatch,
      token,
      "/get-all-programming-contest-user-registration-list"
    );
    setContestUserRegistrations(lst);
  }
  useEffect(() => {
    getProgrammingContestUserRegistration();
  }, []);

  return (
    <Card>
      <CardContent>
        <TextField
          required
          id="userLoginId"
          label="user"
          placeholder="Nhập ID user"
          value={userLoginId}
          onChange={(event) => {
            setUserLoginId(event.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "45px" }}
          onClick={() => {
            handleSearch();
          }}
        >
          Tìm
        </Button>
        <MaterialTable
          title={"Danh sách user đăng ký Contest"}
          columns={columns}
          data={contestUserRegistrations}
        />
      </CardContent>
    </Card>
  );
}

export default ProgrammingContestUserRegistrationTable;
