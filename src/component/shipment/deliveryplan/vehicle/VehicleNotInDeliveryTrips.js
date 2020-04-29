import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useParams} from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function VehicleNotInDeliveryTrips() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const columns = [
    {title: "Mã xe", field: "vehicleId"},
    {title: "Tải trọng", field: "capacity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mô tả", field: "description"},
  ];

  const {deliveryPlanId} = useParams();

  const [dataTable, setDataTable] = useState();

  function getDataTable() {
    authGet(dispatch, token, "/vehicle-not-in-delivery-trips/" + deliveryPlanId + '/all').
      then(response => setDataTable(response));
  }

  useEffect(() => getDataTable(), []);

  return <div>
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }

    <MaterialTable
      title={'Danh sách xe chưa được gán chuyến'}
      columns={columns}
      options={{search: false, selection: false}}
      data={dataTable}
      icons={tableIcons}
    >
    </MaterialTable>
  </div>;
}