import MaterialTable from "material-table";
import React from "react";
import axios from "axios";
export default function ViewCourseVideo() {
  const columns = [
    { title: "UserName", field: "userLoginId" },
    { title: "MaterialId", field: "eduCourseMaterialId" },
    { title: "Date", field: "createdStamp" },
  ];
  return (
    <div>
      <h1>View Course Video</h1>
      <MaterialTable
        columns={columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url =
              "http://localhost:8080/admin/data/view-course-video?page=" +
              `${query.page}` +
              "&size=" +
              `${query.pageSize}`;
            let token = localStorage.getItem("token");
            axios
              .get(url, { headers: { "x-auth-token": token } })
              .then((res) => res.data)
              .then((res) => {
                resolve({
                  data: res.content,
                  page: query.page,
                  totalCount: res.totalElement,
                });
              })
              .catch((err) => {
                //if (err.response.status === 401) {
                //}
                console.log("exception err = ", err);
              });
          })
        }
      ></MaterialTable>
    </div>
  );
}
