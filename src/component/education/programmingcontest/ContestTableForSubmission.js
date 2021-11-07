import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function ContestTableForRegistration() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [contests, setContests] = useState([]);

  const columns = [
    {
      title: "ID Contest",
      field: "contestId",
      render: (rowData) => (
        <Link
          to={"/edu/contest-problem-for-submission/" + rowData["contestId"]}
        >
          {rowData["contestId"]}
        </Link>
      ),
    },
    { title: "Tên Contest", field: "contestName" },
    { title: "Contest Type", field: "contestTypeId" },
    { title: "Người tạo", field: "createdByUserLoginId" },
  ];

  async function getContesList() {
    let lst = await authGet(
      dispatch,
      token,
      "/get-approved-programming-contests-of-user"
    );
    setContests(lst);
  }

  useEffect(() => {
    getContesList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách Contest để làm bài"}
          columns={columns}
          data={contests}
        />
      </CardContent>
    </Card>
  );
}

export default ContestTableForRegistration;
