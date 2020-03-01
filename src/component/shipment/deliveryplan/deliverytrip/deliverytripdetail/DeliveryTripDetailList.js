import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet} from "../../../../../api";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import {tableIcons} from "../../../../../utils/iconutil";
import {Link, useParams} from "react-router-dom";

// each shipment item
export default function DeliveryTripDetailList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Delivery Trip Detail Id", field: "deliveryTripDetailId"},
    {title: "Delivery Trip Id", field: "deliveryTripId"},
    {title: "Quantity", field: "deliveryQuantity"},
    {title: "Customer Code", field: "customerCode"},
    {title: "Product Id", field: "productId"},
    {title: "Product Quantity", field: "productQuantity"},
    {
      title: "Note",
      field: "note",
      render: rowData => <Link to={'/delivery-trip-detail/' + rowData['deliveryTripId']}>Detail</Link>
    },
  ];

  const {deliveryTripId} = useParams();

  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const getDeliveryTripInfo = () => {
    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId).then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      setDeliveryTrip({
        deliveryTripId,
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] == null ? null : response['externalVehicleType']['vehicleTypeId']
      });
    })
  };

  useEffect(() => getDeliveryTripInfo(), []);

  return <div>
    <MaterialTable
      title={'Chi tiết chuyến giao hàng'}
      columns={columns}
      options={{search: false}}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div>
              <div style={{padding: '0px 30px'}}>
                <b>Mã đợt chuyến hàng: </b> {deliveryTripId} <p/>
                <b>Mã đợt giao hàng: </b> {deliveryTrip === null ? '' : deliveryTrip['deliveryPlanId']} <p/>
                <b>Ngày tạo: </b> {deliveryTrip === null ? '' : deliveryTrip['executeDate']} <p/>
                <b>Xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleId']}<p/>
                <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}
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
            "/delivery-trip-detail" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
    <Link to={'/create-delivery-trip-detail/' + deliveryTripId}>
      <Button color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>}> Thêm mới </Button> <p/>
    </Link>
    <Button color={'secondary'} variant={'contained'} startIcon={<DeleteIcon/>}> Hủy chi tiết chuyến </Button> <p/>
  </div>
}