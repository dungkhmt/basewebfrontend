import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet} from "../../../../../api";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import {tableIcons} from "../../../../../utils/iconutil";
import {Link, useParams} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

// each shipment item
export default function DeliveryTripDetailList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  function handleDelete(deliveryTripDetailId) {
    authGet(dispatch, token, '/delete-delivery-trip-detail/' + deliveryTripDetailId).then(response => {
      if (response) {
        alert("Deleted " + deliveryTripDetailId);
        window.location.reload();
      } else {
        alert("Delete failed");
      }
    }).catch(console.log);
  }

  const columns = [
    {title: "Mã chi tiết chuyến giao hàng", field: "deliveryTripDetailId"},
    {title: "Mã chuyến giao hàng", field: "deliveryTripId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Địa chỉ", field: "address"},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Tổng số lượng sản phẩm trong đơn hàng", field: "shipmentQuantity"},
    {title: "Số lượng sản phẩm đã chọn", field: "deliveryQuantity"},
    {title: "Tổng khối lượng sản phẩm đã chọn", field: "weight"},
    {
      title: "Note",
      field: "note",
      render: rowData => <Button variant={'contained'}
                                 onClick={() => handleDelete(rowData['deliveryTripDetailId'])}
                                 startIcon={<DeleteIcon/>}>Xóa</Button>
    },
  ];

  const {deliveryTripId} = useParams();

  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const getDeliveryTripInfo = () => {
    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId + '/basic-info').then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      setDeliveryTrip({
        deliveryTripId,
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] == null ? null : response['externalVehicleType']['vehicleTypeId'],
        totalDistance: response['distance'],
        totalWeight: response['totalWeight'],
        totalPallet: response['totalPallet'],
      });
    })
  };

  // const [tripCapacityInfo, setTripCapacityInfo] = useState({});

  // function getDeliveryTripCapacityInfo() {
  //   authPost(dispatch, token, '/delivery-trip/' + deliveryTripId + '/capacity-info', []).then(response => response.json()).then(response => {
  //     setTripCapacityInfo(response);
  //   }).catch(console.log);
  // }

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    authGet(dispatch, token, "/delivery-trip-detail/" + deliveryTripId).then(response => {
      setDataTable(response);
    }).catch(console.log);
  }

  useEffect(() => {
    getDeliveryTripInfo();
    // getDeliveryTripCapacityInfo();
    getDataTable();
  }, []);

  return <div>
    {
      deliveryTrip ?
        <Link to={'/delivery-plan/' + deliveryTrip['deliveryPlanId']}>
          <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
            Back</Button>
        </Link> : null
    }
    <MaterialTable
      title={'Chi tiết chuyến giao hàng'}
      columns={columns}
      options={{search: false}}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <Grid container spacing={3}>
              <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
                <b>Mã chuyến hàng: </b> {deliveryTripId} <p/>
                <b>Mã đợt giao hàng: </b> {deliveryTrip === null ? '' : deliveryTrip['deliveryPlanId']} <p/>
                <b>Ngày tạo: </b> {deliveryTrip === null ? '' : deliveryTrip['executeDate']} <p/>
                <b>Xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleId']}<p/>
                <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}
              </Grid>
              <Grid item xs={4}
                    style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
                <div style={{textAlign: 'left'}}>
                  <b>Tổng khoảng cách: </b> {deliveryTrip == null ? 0 : deliveryTrip['totalDistance']} <p/>
                  <b>Tổng khối lượng: </b> {deliveryTrip == null ? 0 : deliveryTrip['totalWeight']} <p/>
                  <b>Tổng số pallet: </b> {deliveryTrip == null ? 0 : deliveryTrip['totalPallet']} <p/>
                </div>
                <Link to={'/create-delivery-trip-detail/' + deliveryTripId}>
                  <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới </Button>
                </Link>
                <Button color={'primary'} variant={'contained'}> Hiển thị bản đồ </Button>
                <Button color={'primary'} variant={'contained'}> Phê duyệt </Button> <p/>
                {/*<Button color={'secondary'} variant={'contained'} startIcon={<DeleteIcon/>}> Hủy chi tiết*/}
                {/*  chuyến </Button>*/}
              </Grid>
            </Grid>
          </div>
        )
      }}
      data={dataTable}
      icons={tableIcons}
    >
    </MaterialTable>

  </div>
}