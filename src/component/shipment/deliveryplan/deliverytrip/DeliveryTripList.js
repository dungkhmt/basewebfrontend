import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet} from "../../../../api";
import {toFormattedDateTime} from "../../../../utils/dateutils";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useParams} from "react-router-dom";
import ListIcon from '@material-ui/icons/List';
import TableChartIcon from '@material-ui/icons/TableChart';
import AddIcon from '@material-ui/icons/Add';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CircularProgress from "@material-ui/core/CircularProgress";

export default function DeliveryTripList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Thứ tự lời giải", field: "deliveryPlanSolutionSeqId"},
    {
      title: "Mã chuyến giao", field: "deliveryTripId",
      render: rowData => <Link to={'/delivery-trip/' + rowData['deliveryTripId']}>{rowData['deliveryTripId']}</Link>
    },
    {title: "Ngày thực hiện", field: "executeDate", type: 'date'},
    {title: "Tổng khoảng cách", field: "totalDistance"},
    {title: "Tổng khối lượng", field: "totalWeight"},
    {title: "Tổng số pallet", field: "totalPallet"},
    {title: "Mã xe", field: "vehicleId"},
    {title: "Tải trọng tối đa của xe", field: "maxVehicleCapacity"},
    {title: "Mã tài xế", field: "driverId"},
  ];

  const {deliveryPlanId} = useParams();

  const [deliveryPlan, setDeliveryPlan] = useState(null);

  const getDeliveryPlanInfo = () => {
    authGet(dispatch, token, '/delivery-plan/' + deliveryPlanId).then(response => setDeliveryPlan({
      deliveryPlanId,
      deliveryPlanDate: toFormattedDateTime(response['deliveryDate']),
      description: response['description'],
      createdByUserLoginId: response['createdByUserLoginId']
    }))
  };

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    authGet(dispatch, token, '/delivery-trip/' + deliveryPlanId + '/all').then(response => setDataTable(response)).catch(console.log);
  }

  const [solveWaiting, setSolveWaiting] = useState(false);

  useEffect(() => {
    getDeliveryPlanInfo();
    getDataTable();
  }, []);

  function handleSolve() {
    setSolveWaiting(true);
    authGet(dispatch, token, '/solve/' + deliveryPlanId).then(response => {
      if (!response) {
        alert('Đã có lỗi xảy ra...');
      }
      setSolveWaiting(false);
      window.location.reload();
    }).catch(console.log);
  }

  return <div>
    <Link to={'/delivery-plan-list'}>
      <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
        Back</Button>
    </Link>

    <MaterialTable
      title={'Chi tiết đợt giao hàng'}
      columns={columns}
      options={{search: false}}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div>
              <div style={{padding: '0px 30px'}}>
                <b>Mã đợt giao hàng: </b> {deliveryPlanId} <p/>
                <b>Ngày tạo: </b> {deliveryPlan === null ? '' : deliveryPlan['deliveryPlanDate']} <p/>
                <b>Mô tả: </b> {deliveryPlan === null ? '' : deliveryPlan['description']}
              </div>
            </div>
          </div>
        )
      }}
      data={dataTable}
      icons={tableIcons}
    >
    </MaterialTable>
    <Link to={'/create-delivery-trip/' + deliveryPlanId}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới </Button> <p/>
    </Link>
    <Link to={'/vehicle-delivery-plan/' + deliveryPlanId + '/list'}>
      <Button color={'primary'} variant={'contained'} startIcon={<ListIcon/>}> Danh sách xe </Button>
    </Link>
    <Link to={'/shipment-item-delivery-plan/' + deliveryPlanId + '/list'}>
      <Button color={'primary'} variant={'contained'} startIcon={<ListIcon/>}> Danh sách đơn hàng </Button> <p/>
    </Link>
    <Button color={'default'} variant={'contained'} startIcon={<TableChartIcon/>}> Xuất excel </Button><p/>
    <Link to={'/delivery-trip-chart/' + deliveryPlanId}>
      <Button color={'default'} variant={'contained'} startIcon={<InsertChartIcon/>}> Biểu đồ các chuyến </Button>
      <p/>
    </Link>
    <Button color={'default'} variant={'contained'}> DS đơn hàng chưa được xếp chuyến </Button> <p/>
    {
      solveWaiting ? <CircularProgress color={'secondary'}/> :
        <Button color={'default'} variant={'contained'} onClick={() => handleSolve()}>
          Tự động xếp chuyến còn lại </Button>
    } <p/>
    <Button color={'secondary'} variant={'contained'} startIcon={<DeleteIcon/>}> Hủy chuyến </Button> <p/>
  </div>
}