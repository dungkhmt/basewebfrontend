import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {authGet} from "../../../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function ShipmentItemDeliveryTripDetailList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {shipmentItemId} = useParams();

  const [info, setInfo] = useState({});
  const [dataTable, setDataTable] = useState([]);

  const [waiting, setWaiting] = useState(false);


  async function getDataTable() {
    setWaiting(true);
    let shipmentItemInfo = await authGet(dispatch, token, '/shipment-item-info/' + shipmentItemId);
    setWaiting(false);

    setInfo(shipmentItemInfo);
    setDataTable(info['details']);
  }

  useEffect(() => getDataTable(), []);

  const columns = [
    {title: 'Mã đợt giao hàng', field: 'deliveryPlanId'},
    {title: 'Mã chuyến', field: 'deliveryTripId'},
    {title: 'Ngày thực hiện', field: 'executeDate'},
    {title: 'Số lượng xếp trên chuyến', field: 'deliveryQuantity'},
    {title: 'Số xe', field: 'vehicleId'},
    {title: 'Tải trọng', field: 'vehicleCapacity'},
    {title: 'Mã tài xế', field: 'driverId'},
  ];

  return <div>
    {
      <Link to={'/shipment'}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }

    <h2>Chi tiết hàng vận chuyển</h2>

    <Grid container spacing={3}>
      <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
        <b>Mã: </b> {info['shipmentItemId'] ? info['shipmentItemId'] : ''} <p/>
        <b>Mã đơn hàng: </b> {info['orderId'] ? info['orderId'] : ''} <p/>
        <b>Mã kho: </b> {info['facilityId'] ? info['facilityId'] : ''} <p/>

      </Grid>
      <Grid item xs={4}
            style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
        <div style={{textAlign: 'left'}}>
          <b>Mã sản phẩm: </b> {info['productId'] ? info['productId'] : ''} <p/>
          <b>Tên sản phẩm: </b> {info['productName'] ? info['productName'] : ''} <p/>
          <b>Số lượng: </b> {info['quantity'] ? info['quantity'] : ''} <p/>
          <b>Trạng thái: </b> {info['statusId'] ? info['statusId'] : ''} <p/>
        </div>

      </Grid>
    </Grid>

    {
      waiting ? <CircularProgress color={'secondary'}/> :
        <MaterialTable title={'Danh sách chuyến giao hàng được gán'} columns={columns} data={dataTable}
                       options={{search: false}}/>
    }
  </div>
}