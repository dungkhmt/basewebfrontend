import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {useHistory} from "react-router-dom";

export default function VehicleListDeliveryPlan() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: "Vehicle Id", field: "vehicleId"},
  ];

  const [deliveryPlanId, setDeliveryPlanId] = useState('');
  const [rowSelected, setRowSelected] = useState([]);

  const getDeliveryPlanInfo = () => {
    let url = window.location.href;
    let deliveryPlanId = url.substring(url.lastIndexOf('/') + 1);
    setDeliveryPlanId(deliveryPlanId);
  };

  useEffect(() => getDeliveryPlanInfo(), []);

  function handleSubmit() {
    let vehicleDeliveryPlan = {
      deliveryPlanId,
      vehicleIds: rowSelected.map(value => value['vehicleId'])
    };
    authPost(dispatch, token, '/create-vehicle-delivery-plan', vehicleDeliveryPlan).then(response => {
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
      title={'Chọn xe'}
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
            "/vehicle" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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