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
import Directions from "../../../../google/Directions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

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
    {title: "Mã chi tiết chuyến giao hàng", field: "deliveryTripDetailId"},
    {title: "Mã chuyến giao hàng", field: "deliveryTripId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Địa chỉ", field: "address"},
    {title: "Tọa độ", field: "latLng", render: rowData => rowData['lat'] + ',' + rowData['lng']},
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

  const [facilityGeoPoint, setFacilityGeoPoint] = useState();

  const getDeliveryTripInfo = () => {
    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId + '/basic-info').then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      setDeliveryTrip({
        deliveryTripId,
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        facility: response['deliveryPlan']['facility'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] ==
        null ? null : response['externalVehicleType']['vehicleTypeId'],
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
      console.log(response);
      setDataTable(response);
    }).catch(console.log);
  }

  const [mapOpen, setMapOpen] = useState(false);


  const [driverList, setDriverList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});

  async function getDriverInfo() {
    Promise.all([authGet(dispatch, token, '/get-all-drivers'),
      authGet(dispatch, token, '/get-driver-in-delivery-trip/' + deliveryTripId)]).
      then(([driverList, selectedDriver]) => {
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
    dataTable.forEach(value => locations[value['locationCode']] = {
      lat: value['lat'],
      lng: value['lng'],
      address: value['address']
    });
    return locations;
  }

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
                        {driver['partyId'] + ' (' + driver['fullName'] + ')'}
                      </MenuItem>)
                  }
                </Select><p/>
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
                <Button color={'primary'} variant={'contained'} onClick={() => {
                  setMapOpen(true);
                  console.log(dataTable);
                }}>
                  Hiển thị bản đồ
                </Button>
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

    <Dialog
      fullWidth={'lg'}
      maxWidth={true}
      open={mapOpen}
      onClose={() => setMapOpen(false)}
    >
      <DialogTitle>Hành trình di chuyển của bưu tá</DialogTitle>
      <DialogContent>
        {
          mapOpen && dataTable ?
            <Directions
              routes={[{
                post: facilityGeoPoint ? {
                  lat: parseFloat(facilityGeoPoint['latitude']), lng: parseFloat(facilityGeoPoint['longitude'])
                } : {},
                items: dataTable[0] ?
                  Object.values(getDistinctLocation()).map(value => ({
                    lat: value['lat'],
                    lng: value['lng'],
                    title: value['address']
                  })) : []
              }]}
            />
            : ''
        }
      </DialogContent>
    </Dialog>

  </div>
}