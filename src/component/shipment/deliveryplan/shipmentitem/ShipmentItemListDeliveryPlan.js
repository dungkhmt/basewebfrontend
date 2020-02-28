import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {useHistory} from "react-router-dom";

export default function ShipmentItemListDeliveryPlan() {
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
    // {
    //   title: "Note",
    //   field: "note",
    //   render: rowData => <Link to={'/delivery-trip/' + rowData['deliveryTripId']}>Detail</Link>
    // },
  ];

  const [deliveryPlanId, setDeliveryPlanId] = useState('');
  // const [deliveryPlan, setDeliveryPlan] = useState(null);
  const [rowSelected, setRowSelected] = useState([]);

  const getDeliveryPlanInfo = () => {
    let url = window.location.href;
    let deliveryPlanId = url.substring(url.lastIndexOf('/') + 1);
    setDeliveryPlanId(deliveryPlanId);
    // authGet(dispatch, token, '/delivery-plan/' + deliveryPlanId).then(response => setDeliveryPlan({
    //   deliveryPlanId,
    //   deliveryPlanDate: toFormattedDateTime(response['deliveryDate']),
    //   description: response['description'],
    //   createdByUserLoginId: response['createdByUserLoginId']
    // }))
  };

  useEffect(() => getDeliveryPlanInfo(), []);

  function handleSubmit() {
    let shipmentItemDeliveryPlan = {
      deliveryPlanId,
      shipmentItemIds: rowSelected.map(value => value['shipmentItemId'])
    };
    authPost(dispatch, token, '/create-shipment-item-delivery-plan', shipmentItemDeliveryPlan).then(response => {
        if (response.ok) {
          alert('Upload successful');
          history.push(process.env.PUBLIC_URL + "/delivery-plan/" + deliveryPlanId)
        } else {
          alert('Upload failed: ' + response.error);
        }
      }
    ).catch(console.log);
  }

  return <div>
    <MaterialTable
      title={'Chọn đơn hàng'}
      columns={columns}
      options={{search: false, selection: true}}
      // components={{
      //   Toolbar: props => (
      //     <div>
      //       <MTableToolbar {...props} />
      //       <div>
      //         <div style={{padding: '0px 30px'}}>
      //           <b>Mã đợt giao hàng: </b> {deliveryPlanId} <p/>
      //           <b>Ngày tạo: </b> {deliveryPlan === null ? '' : deliveryPlan['deliveryPlanDate']} <p/>
      //           <b>Mô tả: </b> {deliveryPlan === null ? '' : deliveryPlan['description']}
      //         </div>
      //       </div>
      //     </div>
      //   )
      // }}
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
            "/shipment-item" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
      onSelectionChange={rows => setRowSelected(rows)}
    >
    </MaterialTable>
    <Button
      color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>}
      onClick={() => handleSubmit()}>
      Save
    </Button>
  </div>;
}