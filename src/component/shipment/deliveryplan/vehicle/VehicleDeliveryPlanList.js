import React from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet, authPost} from "../../../../api";
import Button from "@material-ui/core/Button";
import {tableIcons} from "../../../../utils/iconutil";
import {Link, useHistory, useParams} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Grid from "@material-ui/core/Grid";

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

    <MaterialTable
      title={'Danh sách xe'}
      columns={columns}
      options={{search: false}}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <Grid container spacing={3}>
              <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
              </Grid>
              <Grid item xs={4}
                    style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
                <Link to={'/vehicle-delivery-plan/' + deliveryPlanId + '/add'}>
                  <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới</Button>
                </Link>
              </Grid>
            </Grid>
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

  </div>;
}