import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../../api";
import {tableIcons} from "../../../utils/iconutil";
import React from "react";
import Upload from "../../../utils/Upload";

export default function VehicleList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Mã xe", field: "vehicleId"},
    {title: "Tải trọng", field: "capacity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mô tả", field: "description"},
  ];

  return <div>
    <MaterialTable
      title="Danh sách xe vận chuyển"
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
            "/vehicle/page" + "?size=" + query.pageSize + "&page=" + query.page + sortParam
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
    <Upload
      url={'upload-vehicle'}
      token={token}
      dispatch={dispatch}
      buttonTitle={'Tải lên danh sách xe'}
      handleSaveCallback={() => window.location.reload()}
    />
  </div>
}