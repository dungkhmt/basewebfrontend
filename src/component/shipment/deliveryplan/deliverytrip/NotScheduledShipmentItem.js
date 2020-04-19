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

  const [dataTable, setDataTable] = useState([]);

  const [waitData, setWaitData] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [tripSuggestionOpen, setTripSuggestionOpen] = useState(false);
  const [tripSuggestionList, setTripSuggestionList] = useState([]);
  const [tripSuggestionWait, setTripSuggestionWait] = useState(false);

  async function handleSubmit(deliveryTripId) {
    let body = dataTable.map(shipmentItem => ({
      shipmentItemId: shipmentItem['shipmentItemId'],
      deliveryQuantity: (shipmentItem['quantity'] - shipmentItem['scheduledQuantity'])
    }));
    setWaitData(true);
    let numberAddedShipmentItems = await authPost(dispatch, token,
      '/create-delivery-trip-detail/' + deliveryTripId, body);
    setWaitData(false);

    numberAddedShipmentItems = parseInt(numberAddedShipmentItems);

    if (numberAddedShipmentItems) {
      alert('Thêm thành công ' + numberAddedShipmentItems + ' vào chuyến ' + deliveryTripId);
    } else {
      alert('Error...');
    }
  }

  async function getDataTable() {
    setWaitData(true);
    let shipmentItems = await authGet(dispatch, token, '/shipment-item-not-scheduled/' + deliveryPlanId);
    setWaitData(false);

    setDataTable(shipmentItems);
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  async function handleSuggest() {
    let body = {
      deliveryPlanId,
      shipmentItemIds: selectedRows.map(shipmentItem => ({
        shipmentItemId: shipmentItem['shipmentItemId'],
        deliveryQuantity: (shipmentItem['quantity'] - shipmentItem['scheduledQuantity'])
      }))
    };

    setTripSuggestionWait(true);
    let response = await authPost(dispatch, token, '/suggest-trips', body).then(r => r.json());
    setTripSuggestionWait(false);

    setTripSuggestionList(response);
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

function TripSuggestion(props) {
  const {open, setOpen, trips, handleSubmit} = props;

  const columns = [
    {title: 'Mã chuyến', render: rowData => rowData['deliveryTripModel']['deliveryTripId']},
    {
      title: 'Tổng khối lượng',
      render: rowData => rowData['deliveryTripModel']['totalWeight'] + ' (+' + rowData['extraTotalWeight'] + ')'
    },
    {
      title: 'Tải trọng',
      render: rowData => rowData['deliveryTripModel']['maxVehicleCapacity']
    },
    {
      title: 'Tỉ lệ tải',
      render: rowData => {
        let oldWeight = rowData['extraTotalWeight'];
        let extraWeight = rowData['extraTotalWeight'];
        let newWeight = oldWeight + extraWeight;
        let capacity = rowData['deliveryTripModel']['maxVehicleCapacity'];
        return (oldWeight / capacity) + ' (+' + (newWeight / capacity) + ')'
      }
    },
    {
      title: 'Thời gian vận hành chuyến',
      render: rowData => toFormattedTime(rowData['deliveryTripModel']['totalExecutionTime']) +
        ' (+' + toFormattedTime(rowData['extraTotalTime']) + ')'
    },
    {
      title: 'Quãng đường',
      render: rowData => rowData['deliveryTripModel']['totalDistance'] + ' (+' + rowData['extraTotalDistance'] + ')'
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

      <MaterialTable columns={columns} data={trips} options={{search: false}}/>

    </Dialog>

  </div>;
}