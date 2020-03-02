import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {useHistory, useParams} from "react-router-dom";

export default function ShipmentItemDeliveryPlanAdd() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Số lượng", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Mã địa chỉ", field: "locationCode"},
  ];

  const {deliveryPlanId} = useParams();

  const [pageNumber, setPageNumber] = useState(0);
  const [rowSelectedMap,] = useState({});

  function handleSelectRow(rows) {
    rowSelectedMap[pageNumber] = new Set(rows.map(row => row['shipmentItemId']));
    // console.log(rows);
    // console.log(rowSelectedMap);
  }

  function handleSubmit() {
    let shipmentItemDeliveryPlan = {
      deliveryPlanId,
      shipmentItemIds: Object.values(rowSelectedMap).flatMap(value => [...value])
    };
    authPost(dispatch, token, '/create-shipment-item-delivery-plan', shipmentItemDeliveryPlan).then(response => {
        if (response.ok) {
          alert('Update successful ' + shipmentItemDeliveryPlan['shipmentItemIds'].length + ' items');
          history.push(process.env.PUBLIC_URL + '/shipment-item-delivery-plan/' + deliveryPlanId + '/list');
        } else {
          alert('Update failed: ' + response.error);
        }
      }
    ).catch(console.log);
  }

  return <div>
    <MaterialTable
      title={'Chọn đơn hàng'}
      columns={columns}
      options={{search: false, selection: true}}
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
            "/shipment-item-not-in/" + deliveryPlanId + "?size=" + query.pageSize + "&page=" + query.page + sortParam
          ).then(
            response => {
              setPageNumber(response.number);
              resolve({
                data: response.content.map(row => rowSelectedMap[response.number] &&
                rowSelectedMap[response.number].has(row['shipmentItemId'])
                  ? {...row, tableData: {checked: true}} : row),
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
      onSelectionChange={rows => handleSelectRow(rows)}
    >
    </MaterialTable>
    <Button
      color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>}
      onClick={() => handleSubmit()}>
      Save
    </Button>
  </div>;
}