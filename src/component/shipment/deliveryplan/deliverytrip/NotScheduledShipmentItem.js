import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {authGet, authPost} from "../../../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import MaterialTable from "material-table";
import {Link, useParams} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {toFormattedTime} from "../../../../utils/dateutils";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import InputLabel from "@material-ui/core/InputLabel";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

export default function NotScheduledShipmentItem() {
  const {deliveryPlanId} = useParams();

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Tổng số lượng", field: "quantity"},
    {title: "Số lượng đã xếp chuyến", field: "scheduledQuantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Mã địa chỉ", field: "locationCode"},
  ];

  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState();

  function getFacilityList() {
    authPost(dispatch, token, '/get-list-facility', {}).then(r => r.json()).then(response => {
      let facilities = response['facilities'];
      setFacilityList(facilities);
      setSelectedFacility(facilities[0]['facilityId']);
      setDataTable(shipmentItemData.filter(shipmentItem => shipmentItem['facilityId'] === facilities[0]['facilityId']))
    }).catch(console.log);
  }

  const [shipmentItemData, setShipmentItemData] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [waitData, setWaitData] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [tripSuggestionOpen, setTripSuggestionOpen] = useState(false);
  const [tripSuggestionList, setTripSuggestionList] = useState([]);
  const [tripSuggestionWait, setTripSuggestionWait] = useState(false);

  async function handleSubmit(deliveryTripId) {
    setTripSuggestionOpen(false);

    let body = selectedRows.map(shipmentItem => ({
      shipmentItemId: shipmentItem['shipmentItemId'],
      deliveryQuantity: (shipmentItem['quantity'] - shipmentItem['scheduledQuantity'])
    }));
    setWaitData(true);
    let numberAddedShipmentItems = await authPost(dispatch, token,
      '/create-delivery-trip-detail/' + deliveryTripId, body).then(r => r.json());
    setWaitData(false);

    numberAddedShipmentItems = parseInt(numberAddedShipmentItems);

    if (numberAddedShipmentItems) {
      alert('Thêm thành công ' + numberAddedShipmentItems + ' vào chuyến ' + deliveryTripId);
    } else {
      alert('Error...');
    }

    window.location.reload();
  }

  async function getShipmentItemData() {
    setWaitData(true);
    let shipmentItems = await authGet(dispatch, token, '/shipment-item-not-scheduled/' + deliveryPlanId);
    setWaitData(false);

    setShipmentItemData(shipmentItems);

    setDataTable(shipmentItems.filter(shipmentItem => shipmentItem['facilityId'] === selectedFacility))
  }

  useEffect(() => {
    getShipmentItemData().then(r => r);
    getFacilityList();
  }, []);

  async function handleSuggest() {
    if (selectedRows.length === 0) {
      alert('Cần chọn ít nhất 1 đơn hàng để sử dụng chức năng này.');
      return;
    }

    let body = {
      deliveryPlanId,
      shipmentItems: selectedRows.map(shipmentItem => ({
        shipmentItemId: shipmentItem['shipmentItemId'],
        deliveryQuantity: (shipmentItem['quantity'] - shipmentItem['scheduledQuantity'])
      }))
    };

    setTripSuggestionWait(true);
    let response = await authPost(dispatch, token, '/suggest-trips', body).then(r => r.json());
    setTripSuggestionWait(false);

    setTripSuggestionList(response['trips']);
    setTripSuggestionOpen(true);
  }

  return <div>
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}> Back</Button>
      </Link>
    }
    <p/>
    {waitData ? <CircularProgress color="secondary"/> :

      <div>
        <InputLabel>Chọn kho</InputLabel>
        <Select
          value={selectedFacility}
          onChange={event => {
            setSelectedFacility(event.target.value);
            setDataTable(shipmentItemData.filter(shipmentItem => shipmentItem['facilityId'] === event.target.value))
          }}
        >
          {
            facilityList.map(value => (
              <MenuItem value={value['facilityId']}>
                {value['facilityId'] + ' (' + value['facilityName'] + ')'}
              </MenuItem>
            ))
          }
        </Select>
        <p/>

        {
          tripSuggestionWait ? <CircularProgress color="secondary"/> :
            <Button color={'primary'} variant={'contained'} onClick={() => handleSuggest()}> Gợi ý chuyến </Button>
        }
        <MaterialTable title={'Danh sách các đơn hàng chưa được xếp chuyến'}
                       columns={columns}
                       data={dataTable}
                       options={{search: false, selection: true}}
                       onSelectionChange={setSelectedRows}/>
      </div>

    }
    <TripSuggestion
      open={tripSuggestionOpen}
      setOpen={setTripSuggestionOpen}
      trips={tripSuggestionList}
      handleSubmit={handleSubmit}
    />
  </div>;
}

function round(n, i) {
  let times = Math.pow(10, i);
  return Math.round(times * n) / times;
}

function TripSuggestion(props) {
  const {open, setOpen, trips, handleSubmit} = props;

  const columns = [
    {title: 'Mã chuyến', render: rowData => rowData['deliveryTripModel']['deliveryTripId']},
    {
      title: 'Tổng khối lượng',
      render: rowData => round(rowData['deliveryTripModel']['totalWeight'], 2) +
        ' (+' + round(rowData['extraTotalWeight'], 2) + ')'
    },
    {
      title: 'Tải trọng',
      render: rowData => rowData['deliveryTripModel']['maxVehicleCapacity']
    },
    {
      title: 'Tỉ lệ tải',
      render: rowData => {
        let oldWeight = rowData['deliveryTripModel']['totalWeight'];
        let extraWeight = rowData['extraTotalWeight'];
        let newWeight = oldWeight + extraWeight;
        let capacity = rowData['deliveryTripModel']['maxVehicleCapacity'];
        let oldRate = oldWeight / capacity;
        let newRate = newWeight / capacity;
        return round(oldRate, 2) + ' (+' + round(newRate - oldRate, 2) + ')'
      }
    },
    {
      title: 'Thời gian vận hành chuyến',
      render: rowData => toFormattedTime(rowData['deliveryTripModel']['totalExecutionTime']) +
        ' (+' + toFormattedTime(rowData['extraTotalTime']) + ')'
    },
    {
      title: 'Quãng đường',
      render: rowData => Math.round(rowData['deliveryTripModel']['totalDistance']) +
        ' (+' + Math.round(rowData['extraTotalDistance']) + ')'
    },
    {title: 'Mã xe', render: rowData => rowData['deliveryTripModel']['vehicleId']},
    {title: 'Loại xe', render: rowData => rowData['deliveryTripModel']['vehicleProductTransportCategoryId']},
    {
      title: '',
      render: rowData => <Button variant={'contained'}
                                 onClick={() => handleSubmit(rowData['deliveryTripModel']['deliveryTripId'])}>
        Thêm vào chuyến này</Button>
    }
  ];

  return <div>

    <Dialog open={open} onClose={() => setOpen(false)} maxWidth={'xl'} fullWidth={false}>

      <DialogTitle title={'Các chuyến được gợi ý'}/>

      <MaterialTable title={'Chi tiết các chuyến được gợi ý'} columns={columns} data={trips} options={{search: false}}/>

    </Dialog>

  </div>;
}