import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../../config/config";

function ListDepartment(props) {
  const token = useSelector((state) => state.auth.token);

  const [departments, setDepartments] = useState([]);

  const columns = [
    { field: "departmentId", title: "ID phòng ban" },
    { field: "departmentName", title: "Tên phòng ban" },
  ];
  const requestOptionsGet = {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
  };

  function getDepartmentList() {
    //console.log("getDepartmentList....");
    fetch(API_URL + "/get-all-departments", requestOptionsGet)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let arr = [];
        response.forEach((d) => {
          arr.push(d);
        });
        setDepartments(arr);
        //console.log('getDepartmentList = ',departments);
      });
  }

  useEffect(() => {
    getDepartmentList();
  }, []);

  return (
    <div>
      <MaterialTable
        options={{ search: true }}
        title={"Danh sách phòng ban"}
        columns={columns}
        data={departments}
      />
    </div>
  );
}

export default ListDepartment;
