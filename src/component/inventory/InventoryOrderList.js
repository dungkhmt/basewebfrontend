import React from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../api";
import {tableIcons} from "../../utils/iconutil";
import {Link} from "react-router-dom";

export default function InventoryOrderList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {
      title: "Mã đơn hàng",
      field: "orderId",
      render: rowData => <Link to={"/inventory/order/" + rowData['orderId']}>{rowData['orderId']}</Link>
    },
    {title: "Tên khách hàng", field: "customerName"},
    {title: "Ngày đơn hàng", field: "orderDate"},
  ];

  return <div>
    <MaterialTable
      title="Danh sách đơn hàng bán"
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
            "/get-inventory-order-header/page" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
  </div>
}