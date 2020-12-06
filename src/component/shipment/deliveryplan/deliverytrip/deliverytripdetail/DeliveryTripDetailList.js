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
import Directions from "../../../../google/Directions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

const STATUS_VN_TRANS = {
  'SHIPMENT_ITEM_CREATED': 'Tạo mới',
  'DELIVERY_TRIP_CREATED': 'Tạo mới',
  'SHIPMENT_ITEM_SCHEDULED_TRIP': 'Đang xếp chuyến',
  'DELIVERY_TRIP_DETAIL_SCHEDULED_TRIP': 'Đang xếp chuyến',
  'DELIVERY_TRIP_APPROVED_TRIP': 'Đã phê duyệt chuyến',
  'DELIVERY_TRIP_DETAIL_APPROVED_TRIP': 'Đã phê duyệt chi tiết chuyến',
  'DELIVERY_TRIP_DETAIL_ON_TRIP': 'Đang thực hiện chuyến',
  'DELIVERY_TRIP_EXECUTED': 'Đang thực hiện chuyến',
  'DELIVERY_TRIP_DETAIL_COMPLETED': 'Hoàn thành giao chi tiết chuyến',
  'SHIPMENT_ITEM_COMPLETED': 'Hoàn thành giao đơn vận chuyển',
  'DELIVERY_TRIP_COMPLETED': 'Hoàn thành giao chuyến',
}

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
    {title: "Thứ tự hành trình", field: "sequence"},
    // {title: "Mã chi tiết chuyến giao hàng", field: "deliveryTripDetailId"},
    // {title: "Mã chuyến giao hàng", field: "deliveryTripId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Địa chỉ", field: "address"},
    {title: "Tọa độ", field: "latLng", render: rowData => rowData['lat'] + ',' + rowData['lng']},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Tổng số lượng sản phẩm trong đơn hàng", field: "shipmentQuantity"},
    {title: "Số lượng sản phẩm đã chọn", field: "deliveryQuantity"},
    {
      title: "Tổng khối lượng sản phẩm đã chọn (kg)",
      field: "weight",
      render: rowData => Math.round(rowData['weight'] * 100) / 100.0
    },
    {
      title: "Note",
      field: "note",
      render: rowData => (deliveryTrip && deliveryTrip['editable'] ?
        <Button variant={'contained'} onClick={() => handleDelete(rowData['deliveryTripDetailId'])}
                startIcon={<DeleteIcon/>}>Xóa</Button> : '')
    },
    {title: "Trạng thái", field: "statusId", render: rowData => STATUS_VN_TRANS[rowData['statusId']]}
  ];

  const {deliveryTripId} = useParams();

  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const [deliveryPlan, setDeliveryPlan] = useState({});

  const [facilityLatLng, setFacilityLatLng] = useState(null);

  const [totalDistance, setTotalDistance] = useState(0);

  const NOT_EDITABLE_TRIP_STATUS = new Set(['DELIVERY_TRIP_APPROVED_TRIP',
                                             'DELIVERY_TRIP_EXECUTED',
                                             'DELIVERY_TRIP_COMPLETED']);

  const getDeliveryTripInfo = () => {
    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId + '/basic-info').then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      let deliveryPlanId = response['deliveryPlanId'];
      setDeliveryTrip({
                        ...response,
                        deliveryTripId,
                        deliveryPlanId: deliveryPlanId,
                        editable: !NOT_EDITABLE_TRIP_STATUS.has(response['statusId'])
                      });
      getDeliveryPlanInfo(deliveryPlanId);
    })
  };

  const getDeliveryPlanInfo = (deliveryPlanId) => {
    authGet(dispatch, token, '/delivery-plan/' + deliveryPlanId).then(response => {
      setDeliveryPlan(response);
    });
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
      console.log(response);
      setDataTable(response['orderItems']);
      setFacilityLatLng({lat: response['depotLat'], lng: response['depotLng']})
    }).catch(console.log);
  }

  const [mapOpen, setMapOpen] = useState(false);


  const [driverList, setDriverList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});

  async function getDriverInfo() {
    Promise.all([authGet(dispatch, token, '/get-all-drivers'),
                  authGet(dispatch, token, '/get-driver-in-delivery-trip/' + deliveryTripId)])
           .then(([driverList, selectedDriver]) => {
             setDriverList(driverList);

             let partyId = selectedDriver['partyId'];
             if (!partyId) {
               setSelectedDriver('unSelected');
             } else {
               setSelectedDriver(partyId);
             }
           })
  }

  useEffect(() => {
    getDeliveryTripInfo();
    getDriverInfo();
    // getDeliveryTripCapacityInfo();
    getDataTable();
  }, []);

  function handleUpdateDriver(driverId) {
    authGet(dispatch, token, '/set-driver-to-delivery-trip/' + deliveryTripId + '/' + driverId).then(response => {
      console.log(response);
    }).catch(console.log);
  }

  function getDistinctLocation() {
    let locations = {};
    dataTable.forEach(value => {
      if (!locations[value['locationCode']]) {
        locations[value['locationCode']] = {
          lat: value['lat'],
          lng: value['lng'],
          address: value['address'],
          seq: value['sequence']
        }
      }
    });
    locations = Object.values(locations).sort((a, b) => a['seq'] - b['seq']);
    console.log(dataTable);
    console.log(locations);
    return locations;
  }

  function getLoadedRate() {
    if (deliveryTrip) {
      return Math.round(10000.0 * deliveryTrip['totalWeight'] / deliveryTrip['maxVehicleCapacity']) / 100.0;
    }
    return 0;
  }

  return <div>
    {/*{*/}
    {/*  deliveryTrip ?*/}
    {/*    <Link to={'/delivery-plan/' + deliveryTrip['deliveryPlanId']}>*/}
    {/*      <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>*/}
    {/*        Back</Button>*/}
    {/*    </Link> : null*/}
    {/*}*/}
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
                <b>Mã chuyến hàng: </b> {deliveryTrip === null ? '' : deliveryTrip['deliveryTripId']} <p/>
                <b>Mã đợt giao hàng: </b> {deliveryTrip === null ? '' : (
                <Link to={`/delivery-plan/${deliveryTrip['deliveryPlanId']}`}>{deliveryTrip['deliveryPlanId']}</Link>)}
                <p/>
                <b>Ngày tạo: </b> {deliveryTrip === null ? '' : deliveryTrip['executeDate']} <p/>
                <b>Xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleId']}<p/>
                <b>Tải trọng: </b> {deliveryTrip === null ? '' : deliveryTrip['maxVehicleCapacity']}<p/>
                <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}<p/>
                <b>Tài xế: </b>
                <Select
                  value={selectedDriver}
                  onChange={event => {
                    setSelectedDriver(event.target.value);
                    if (event.target.value !== 'unSelected') {
                      handleUpdateDriver(event.target.value);
                    }
                  }}
                >
                  <MenuItem value={'unSelected'}>{'Chưa chọn'}</MenuItem>
                  {
                    driverList.map(driver =>
                                     <MenuItem value={driver['partyId']}>
                                       {`${driver['fullName']}`}
                                     </MenuItem>)
                  }
                </Select><p/>
              </Grid>
              <Grid item xs={4}
                    style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
                <div style={{textAlign: 'left'}}>
                  <b>Trạng thái chuyến: </b> {deliveryTrip == null ? 0 : STATUS_VN_TRANS[deliveryTrip['statusId']]} <p/>
                  <b>Tổng khoảng cách: </b> {deliveryTrip == null ? 0 : deliveryTrip['totalDistance']} <p/>
                  <b>Tổng khối lượng (kg): </b> {deliveryTrip == null ? '0 (0 %)' :
                  `${Math.round(deliveryTrip['totalWeight'] * 100) / 100.0} (${getLoadedRate()} %)`} <p/>
                  <b>Tổng số pallet: </b> {deliveryTrip == null ? 0 : deliveryTrip['totalPallet']} <p/>
                </div>

                {deliveryTrip && deliveryTrip['editable'] ?
                  <Link to={'/delivery-group/create-delivery-trip-detail/' + deliveryTripId}>
                    <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới </Button>
                  </Link> : ''}
                <Button color={'primary'} variant={'contained'} onClick={() => {
                  setMapOpen(true);
                  console.log(dataTable);
                }}>
                  Hiển thị bản đồ
                </Button>

                {deliveryTrip && deliveryTrip['editable'] ?
                  <Button color={'primary'} variant={'contained'}
                          onClick={() => {
                            authGet(dispatch, token, '/approve-delivery-trip/' + deliveryTripId).then(r => r);
                            window.location.reload();
                          }}>
                    Phê duyệt </Button> : ''} <p/>
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

    <Dialog
      fullWidth={'lg'}
      maxWidth={true}
      open={mapOpen}
      onClose={() => setMapOpen(false)}
    >
      <DialogTitle>Hành trình chuyến giao hàng</DialogTitle>
      <DialogContent>
        <b>Tổng quãng đường: </b> {totalDistance / 1000 + ' Km'}
        {
          mapOpen && dataTable ?
            <Directions
              routes={[{
                post: facilityLatLng ? {
                  lat: facilityLatLng['lat'], lng: facilityLatLng['lng']
                } : {},
                items: dataTable[0] ?
                  Object.values(getDistinctLocation()).map(value => ({
                    lat: value['lat'],
                    lng: value['lng'],
                    title: value['address']
                  })) : []
              }]}
              settings={{color: ['#0000FF']}}
              setTotalDistance={setTotalDistance}
            />
            : ''
        }
      </DialogContent>
    </Dialog>

  </div>
}
