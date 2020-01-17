import React, { useEffect, useState } from "react";
import { tableIcons } from "../../utils/iconutil";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { authGet } from "../../api";

import { useHistory } from "react-router-dom";

export default function UserList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector(state => state.auth.token);
  const [data, setData] = useState([]);
  const columns = [
    { title: "First Name", field: "firstName" },
    { title: "Middle Name", field: "middleName" },
    { title: "Last Name", field: "lastName" },
    { title: "Birth Date", field: "birthDate" },
    { title: "User Name", field: "userLoginId" }
  ];
  const rowClick = data => {
    console.log(data);
    history.push("/userlogin/" + data.partyId);
  };
  useEffect(() => {
    authGet(dispatch, token, "/rest/userCombineEntities").then(
      res => {
        setData(res._embedded.userCombineEntities);
      },
      error => {
        setData([]);
      }
    );
  }, []);
  return (
    <MaterialTable
      title="List Users"
      columns={columns}
      data={data}
      icons={tableIcons}
      onRowClick={(event, rowData) => {
        rowClick(rowData);
      }}
    />
  );
}
