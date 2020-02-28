import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../../api";
import {tableIcons} from "../../../utils/iconutil";
import React from "react";
import Upload from "../../../utils/Upload";
import Button from "@material-ui/core/Button";
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Link} from "react-router-dom";

export default function ShipmentItemList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Shipment Item Id", field: "shipmentItemId"},
    {title: "Quantity", field: "quantity"},
    {title: "Pallet", field: "pallet"},
    {title: "Product Id", field: "productId"},
    {title: "Customer Code", field: "customerCode"},
    {title: "Location Code", field: "locationCode"},
  ];

  return <div>
    <MaterialTable
      title="Danh sách đơn hàng vận chuyển"
      columns={columns}
      options={{
        search: false
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

    />
    <Link to={'/create-shipment-item'}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddBoxIcon/>}> Thêm mới </Button>
    </Link>
    <Upload
      url={'shipment/upload'}
      token={token}
      dispatch={dispatch}
      buttonTitle={'Tải lên đơn hàng'}
      handleSaveCallback={() => {
      }}
    />
  </div>
}