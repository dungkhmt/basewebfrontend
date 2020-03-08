import React from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useHistory, useParams} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function VehicleDeliveryPlanList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const columns = [
    {title: "Mã xe", field: "vehicleId"},
    {title: "Tải trọng", field: "capacity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mô tả", field: "description"},
    {
      title: "Hành động",
      field: "action",
      render: rowData => <Button variant={'contained'}
                                 onClick={() => handleDelete(rowData['vehicleId'])}
                                 startIcon={<DeleteIcon/>}>Xóa</Button>
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
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }

    <MaterialTable title={'Danh sách xe'}
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
                         "/vehicle/" + deliveryPlanId + "/page?size=" + query.pageSize + "&page=" + query.page + sortParam
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
      <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới</Button>
    </Link>
  </div>;
}