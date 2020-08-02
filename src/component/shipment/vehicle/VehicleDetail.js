import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {toFormattedTime} from "../../../utils/dateutils";
import Grid from "@material-ui/core/Grid";
import {authGet} from "../../../api";
import MaterialTable from "material-table";

export default function VehicleDetail() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {vehicleId} = useParams();

  const [vehicle, setVehicle] = useState(null);

  async function getVehicleInfo() {
    let [vehicle, trips] = await Promise.all([
      authGet(dispatch, token, '/get-vehicle-info/' + vehicleId),
      authGet(dispatch, token, '/get-delivery-trips-by-vehicle/' + vehicleId)]);

    setVehicle(vehicle);

    setTrips(trips);
  }

  useEffect(() => {
    getVehicleInfo().then(r => r);
  }, []);

  const [trips, setTrips] = useState([]);

  const columns = [
    {
      title: "Mã chuyến giao",
      field: "deliveryTripId",
      render: rowData => (
        <Link to={"/delivery-group/delivery-trip/" + rowData["deliveryTripId"]}>
          {rowData["deliveryTripId"]}
        </Link>
      )
    },
    {title: "Ngày thực hiện", field: "executeDate", type: "date"},
    {
      title: "Tổng khoảng cách (km)",
      field: "totalDistance",
      render: rowData => rowData['totalDistance'] / 1000.0
    },
    {
      title: "Tổng khối lượng (kg)",
      field: "totalWeight",
      render: rowData => Math.round(rowData['totalWeight'] * 100) / 100.0
    },
    {title: "Tổng số pallet", field: "totalPallet"},
    {
      title: "Tổng thời gian",
      field: "totalExecutionTime",
      render: rowData => toFormattedTime(rowData['totalExecutionTime'])
    },
    {title: "Tổng số điểm", field: "totalLocation"},
    {title: "Mã xe", field: "vehicleId"},
    {
      title: "Tải trọng tối đa của xe (kg)",
      field: "maxVehicleCapacity",
      render: rowData => Math.round(rowData['maxVehicleCapacity'] * 100) / 100.0
    },
    {title: 'Loại xe', field: 'vehicleProductTransportCategoryId'},
    {title: 'Mã trạng thái', field: 'statusId'},
    {title: "Mã tài xế", field: "userLoginId"}
  ];


  return <div>
    <h2>Chi tiết xe</h2>
    <Grid container spacing={3}>
      <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
        <b>Mã xe: </b> {vehicle === null ? '' : vehicle['vehicleId']} <p/>
        <b>Tải trọng: </b> {vehicle === null ? '' : vehicle['capacity']} <p/>
      </Grid>
      <Grid item xs={4}
            style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
      </Grid>
    </Grid>
    <MaterialTable columns={columns} data={trips} options={{search: false}} title={'Danh sách các chuyến sử dụng xe'}/>
  </div>
}
