import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useHistory, useParams} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Markers from "../../../google/Markers";

export default function ShipmentItemDeliveryPlanList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Số lượng", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Mã địa chỉ", field: "locationCode"},
    {
      title: "Hành động",
      field: "action",
      render: rowData => <Button variant={"contained"}
                                 onClick={() => handleDelete(rowData['shipmentItemId'])}
                                 startIcon={<DeleteIcon/>}>Xóa</Button>
    }
  ];

  const {deliveryPlanId} = useParams();

  const [mapOpen, setMapOpen] = useState(false);

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    authGet(dispatch, token, '/shipment-item-delivery-plan/' + deliveryPlanId + '/all').then(response => {
      setDataTable(response);
    }).catch(console.log);
  }

  useEffect(() => getDataTable(), []);

  function handleDelete(shipmentItemId) {
    let body = {deliveryPlanId, shipmentItemId: shipmentItemId};
    authPost(dispatch, token, '/delete-shipment-item-delivery-plan', body).then(response => {
      if (response.ok) {
        alert("Deleted " + shipmentItemId);
        window.location.reload();
      } else {
        alert("Delete failed");
      }
    }).catch(console.log);
  }

  return <div>
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }
    <MaterialTable
      title={'Danh sách đơn hàng'}
      columns={columns}
      options={{search: false}}
      data={dataTable}
      icons={tableIcons}
    >
    </MaterialTable>
    <Link to={'/shipment-item-delivery-plan/' + deliveryPlanId + '/add'}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}>Thêm mới</Button>
    </Link>
    <p/>

    <Button color={'primary'} variant={'contained'} onClick={() => setMapOpen(true)}>Xem trên bản đồ </Button>

    <Dialog
      fullWidth={'lg'}
      maxWidth={true}
      open={mapOpen}
      onClose={() => setMapOpen(false)}
    >
      <DialogTitle>Vị trí các đơn hàng</DialogTitle>
      <DialogContent>
        {
          mapOpen && dataTable ?
            <Markers
              items={dataTable.map(value => ({
                lat: parseFloat(value['lat']),
                lng: parseFloat(value['lng']),
                infoWindow: value['address']
              }))}
            />
            : ''
        }
      </DialogContent>
    </Dialog>
  </div>;
}