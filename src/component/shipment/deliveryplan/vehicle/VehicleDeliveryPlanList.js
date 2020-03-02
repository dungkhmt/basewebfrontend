import React from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useHistory, useParams} from "react-router-dom";
import AddBoxIcon from "@material-ui/icons/AddBox";

export default function VehicleDeliveryPlanList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: "Vehicle Id", field: "vehicleId"},
    {title: "Capacity", field: "capacity"},
    {title: "Pallet", field: "pallet"},
    {title: "Description", field: "description"},
    {
      title: "Action",
      field: "action",
      render: rowData => <Button variant={'contained'} onClick={() => handleDelete(rowData['vehicleId'])}>Xóa</Button>
    }
  ];

  const {deliveryPlanId} = useParams();

  function handleDelete(vehicleId) {
    let body = {deliveryPlanId, vehicleId};
    authPost(dispatch, token, '/delete-vehicle-delivery-plan', body).then(response => {
      if (response.ok) {
        alert("Deleted " + vehicleId);
        window.location.reload();
      } else {
        alert("Delete failed");
      }
    }).catch(console.log);
  }

  return <div>
    <MaterialTable
      title={'Danh sách xe'}
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
            "/vehicle/" + deliveryPlanId + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
    <Link to={'/vehicle-delivery-plan/' + deliveryPlanId + '/add'}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddBoxIcon/>}> Thêm mới</Button>
    </Link>
  </div>;
}