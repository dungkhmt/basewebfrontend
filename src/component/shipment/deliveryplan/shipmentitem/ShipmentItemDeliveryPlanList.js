import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useHistory, useParams} from "react-router-dom";
import AddBoxIcon from "@material-ui/icons/AddBox";

export default function ShipmentItemDeliveryPlanList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: "Shipment Item Id", field: "shipmentItemId"},
    {title: "Shipment Id", field: "shipmentId"},
    {title: "Quantity", field: "quantity"},
    {title: "Pallet", field: "pallet"},
    {title: "Product Id", field: "productId"},
    {title: "Customer Code", field: "customerCode"},
    {title: "Location Code", field: "locationCode"},
    {
      title: "Action",
      field: "action",
      render: rowData => <Button variant={"contained"} onClick={() => handleDelete(rowData['shipmentItemId'])}>Xóa</Button>
    }
  ];

  const {deliveryPlanId} = useParams();

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
    <MaterialTable
      title={'Danh sách đơn hàng'}
      columns={columns}
      options={{search: false}}
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
            "/shipment-item/" + deliveryPlanId + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
    <Link to={'/shipment-item-delivery-plan/' + deliveryPlanId + '/add'}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddBoxIcon/>}>Thêm mới</Button>
    </Link>
  </div>;
}