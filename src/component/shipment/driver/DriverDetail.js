import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toFormattedTime } from "../../../utils/dateutils";
import Grid from "@material-ui/core/Grid";
import { authGet } from "../../../api";
import MaterialTable from "material-table";

export default function DriverDetail() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { driverId } = useParams();

  const [driver, setDriver] = useState({});

  async function getDriverInfo() {
    let [driver, trips] = await Promise.all([
      authGet(dispatch, token, "/get-driver-info/" + driverId),
      authGet(dispatch, token, "/get-delivery-trips-by-driver/" + driverId),
    ]);

    setDriver(driver);

    setTrips(trips);
  }

  useEffect(() => {
    getDriverInfo().then((r) => r);
  }, []);

  const [trips, setTrips] = useState([]);

  const columns = [
    {
      title: "Mã chuyến giao",
      field: "deliveryTripId",
      render: (rowData) => (
        <Link to={"/delivery-group/delivery-trip/" + rowData["deliveryTripId"]}>
          {rowData["deliveryTripId"]}
        </Link>
      ),
    },
    { title: "Ngày thực hiện", field: "executeDate", type: "date" },
    {
      title: "Tổng khoảng cách (km)",
      field: "totalDistance",
      render: (rowData) => rowData["totalDistance"] / 1000.0,
    },
    {
      title: "Tổng khối lượng (kg)",
      field: "totalWeight",
      render: (rowData) => Math.round(rowData["totalWeight"] * 100) / 100.0,
    },
    { title: "Tổng số pallet", field: "totalPallet" },
    {
      title: "Tổng thời gian",
      field: "totalExecutionTime",
      render: (rowData) => toFormattedTime(rowData["totalExecutionTime"]),
    },
    { title: "Tổng số điểm", field: "totalLocation" },
    { title: "Mã xe", field: "vehicleId" },
    {
      title: "Tải trọng tối đa của xe (kg)",
      field: "maxDriverCapacity",
      render: (rowData) =>
        Math.round(rowData["maxDriverCapacity"] * 100) / 100.0,
    },
    { title: "Loại xe", field: "driverProductTransportCategoryId" },
    { title: "Mã trạng thái", field: "statusId" },
    { title: "Mã tài xế", field: "userLoginId" },
  ];

  return (
    <div>
      <h2>Chi tiết tài xế</h2>
      <Grid container spacing={3}>
        <Grid
          item
          xs={8}
          style={{ textAlign: "left", padding: "0px 30px 20px 30px" }}
        >
          <b>Id tài xế: </b> {driver ? driver["partyId"] : ""} <p />
          <b>Mã tài xế: </b> {driver ? driver["userLoginId"] : ""} <p />
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            verticalAlign: "text-bottom",
            textAlign: "right",
            padding: "0px 50px 10px 30px",
          }}
        ></Grid>
      </Grid>
      <MaterialTable
        columns={columns}
        data={trips}
        options={{ search: false }}
        title={"Danh sách các chuyến tài xế tham gia"}
      />
    </div>
  );
}
