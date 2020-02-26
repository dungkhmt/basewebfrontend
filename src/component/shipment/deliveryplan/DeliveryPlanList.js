import React from "react";
import MaterialTable from "material-table";
import {authGet} from "../../../api";
import {tableIcons} from "../../../utils/iconutil";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function DeliveryPlanList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Description", field: "description"},
    {title: "Created By", field: "createdByUserLoginId"},
    {title: "Created Date", field: "deliveryDate", type: 'date'},
    {
      title: "Note",
      field: "note",
      render: rowData => <Link to={'/delivery-plan/' + rowData['deliveryPlanId']}>Detail</Link>
    },
  ];

  return <div>
    <MaterialTable
      title="Danh sách đợt giao hàng"
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
            "/delivery-plan" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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