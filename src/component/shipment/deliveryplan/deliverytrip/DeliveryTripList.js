import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet} from "../../../../api";
import {toFormattedDateTime} from "../../../../utils/dateutils";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import {tableIcons} from "../../../../utils/iconutil";
import {Link} from "react-router-dom";

export default function DeliveryTripList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Sequence Id", field: "deliveryPlanSolutionSeqId"},
    {title: "Delivery Trip Id", field: "deliveryTripId"},
    {title: "Execute Date", field: "executeDate", type: 'date'},
    {title: "Total Distance", field: "totalDistance"},
    {title: "Total Weight", field: "totalWeight"},
    {title: "Vehicle Id", field: "vehicleId"},
    {title: "Max Vehicle Capacity", field: "maxVehicleCapacity"},
    {
      title: "Note",
      field: "note",
      render: rowData => <Link to={'/delivery-trip/' + rowData['deliveryTripId']}>Detail</Link>
    },
  ];

  const [deliveryPlanId, setDeliveryPlanId] = useState('');
  const [deliveryPlan, setDeliveryPlan] = useState(null);

  const getDeliveryPlanInfo = () => {
    let url = window.location.href;
    let deliveryPlanId = url.substring(url.lastIndexOf('/') + 1);
    setDeliveryPlanId(deliveryPlanId);
    authGet(dispatch, token, '/delivery-plan/' + deliveryPlanId).then(response => setDeliveryPlan({
      deliveryPlanId,
      deliveryPlanDate: toFormattedDateTime(response['deliveryDate']),
      description: response['description'],
      createdByUserLoginId: response['createdByUserLoginId']
    }))
  };

  useEffect(() => getDeliveryPlanInfo(), []);

  return <div>
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
      data={query =>
        new Promise((resolve) => {
          console.log(query);
          let sortParam = "";
          if (query.orderBy !== undefined) {
            sortParam = "&sort=" + query.orderBy.field + ',' + query.orderDirection;
          }
          authGet(
            dispatch,
            token,
            "/delivery-trip" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
          ).then(
            response => {
              resolve({
                data: response.content,
                page: response.number,
                totalCount: response.totalElements
              });
            },
            error => {
              console.log("error");
            }
          );
        })
      }
      icons={tableIcons}
    >
    </MaterialTable>
    <Link to={'/create-delivery-trip/' + deliveryPlanId}>
      <Button color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>}> Thêm mới </Button> <p/>
    </Link>
    <Link to={'/vehicle-delivery-plan/' + deliveryPlanId}>
      <Button color={'primary'} variant={'contained'}> Danh sách xe </Button>
    </Link>
    <Link to={'/shipment-item-delivery-plan/' + deliveryPlanId}>
      <Button color={'primary'} variant={'contained'}> Danh sách đơn hàng </Button> <p/>
    </Link>
    <Button color={'default'} variant={'contained'} startIcon={<SaveIcon/>}> Xuất excel </Button>
    <Button color={'default'} variant={'contained'}> Tự động xếp chuyến còn lại </Button> <p/>
    <Button color={'secondary'} variant={'contained'} startIcon={<DeleteIcon/>}> Hủy chuyến </Button> <p/>
  </div>
}