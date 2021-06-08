import { Search } from "@material-ui/icons";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../config/config";

function View(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [list, setList] = useState([]);

  const column = [
    { field: "cid", title: "Mã lớp" },
    { field: "acid", title: "Mã lớp kèm" },
    { field: "course_code", title: "Mã học phần" },
    { field: "course_name", title: "Tên học phần" },
    { field: "note", title: "Ghi chú" },
    { field: "course_week", title: "Tuần" },
    { field: "day_of_week", title: "Thứ" },
    { field: "course_time", title: "Thời gian" },
    { field: "shift", title: "Kíp" },
    { field: "room", title: "Phòng" },
    { field: "type_of_class", title: "Loại lớp" },
    { field: "total", title: "Số Lượng" },
    { field: "state", title: "Trạng thái" },
    { field: "experiment", title: "Thí Nghiệm" },
    { field: "course_period", title: "Đợt mở" },
  ];

  const requestOption = {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
  };

  function ViewSchedule() {
    fetch(API_URL + "/view", requestOption)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setList(res);
      });
  }
  useEffect(() => {
    ViewSchedule();
  }, []);
  return (
    <div>
      <MaterialTable
        options={{ search: true }}
        title="Thời khóa biểu"
        columns={column}
        data={list}
      />
    </div>
  );
}

export default View;
