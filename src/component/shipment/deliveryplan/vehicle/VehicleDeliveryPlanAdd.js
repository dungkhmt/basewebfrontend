import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {Link, useHistory, useParams} from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function VehicleDeliveryPlanAdd() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: "Mã xe", field: "vehicleId"},
    {title: "Tải trọng", field: "capacity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mô tả", field: "description"},
  ];

  const {deliveryPlanId} = useParams();

  const [pageNumber, setPageNumber] = useState(0);
  const [rowSelectedMap,] = useState({});

  function handleSelectRow(rows) {
    rowSelectedMap[pageNumber] = new Set(rows.map(row => row['vehicleId']));
  }

  function handleSubmit() {
    let vehicleDeliveryPlan = {
      deliveryPlanId,
      vehicleIds: Object.values(rowSelectedMap).flatMap(value => [...value])
    };
    authPost(dispatch, token, '/create-vehicle-delivery-plan', vehicleDeliveryPlan).then(response => {
        if (response.ok) {
          alert('Update successful ' + vehicleDeliveryPlan['vehicleIds'].length + ' items');
          history.push(process.env.PUBLIC_URL + '/vehicle-delivery-plan/' + deliveryPlanId + '/list');
        } else {
          alert('Update failed: ' + response.error);
        }
      }
    ).catch(console.log);
  }

  const [dataTable, setDataTable] = useState();

  function getDataTable() {
    authGet(dispatch, token, "/vehicle-not-in/" + deliveryPlanId + '/all').then(response => setDataTable(response));
  }

  useEffect(() => getDataTable(), []);

  return <div>
    {
      <Link to={'/vehicle-delivery-plan/' + deliveryPlanId + '/list'}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }

    <MaterialTable
      title={'Chọn xe'}
      columns={columns}
      options={{search: false, selection: true}}
      data={dataTable}
      icons={tableIcons}
      onSelectionChange={rows => handleSelectRow(rows)}
    >
    </MaterialTable>
    <Button
      color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>}
      onClick={() => handleSubmit()}>
      Save
    </Button>
  </div>;
}