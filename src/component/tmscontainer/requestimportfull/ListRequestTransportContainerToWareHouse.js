import React, { useState } from "react";
import MaterialTable from "material-table";
import { authGet } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import { useDispatch, useSelector } from "react-redux";

function ListRequestTransportContainerToWareHouse() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);

  const columns = [
    { field: "customerName", title: "Tên khách hàng " },
    { field: "facilityName", title: "Kho" },
    { field: "address", title: "Địa chỉ" },
    { field: "numberContainers", title: "Số container" },
    { field: "containerType", title: "Loại container" },
    { field: "portName", title: "Tên cảng" },
    { field: "time", title: "Thời gian" },
  ];

  return (
    <div>
      <MaterialTable
        title="Danh sách yêu cầu vận chuyển container đầy đến kho  "
        columns={columns}
        options={{
          filtering: true,
          search: false,
        }}
        data={(query) =>
          new Promise((resolve, reject) => {
            console.log(query);
            let sortParam = "";
            if (query.orderBy !== undefined) {
              sortParam =
                "&sort=" + query.orderBy.field + "," + query.orderDirection;
            }
            let filterParam = "";
            if (query.filters.length > 0) {
              let filter = query.filters;
              filter.forEach((v) => {
                filterParam = v.column.field + "=" + v.value + "&";
              });
              filterParam =
                "&" + filterParam.substring(0, filterParam.length - 1);
            }

            authGet(
              dispatch,
              token,
              "/get-list-cont-request-import-full-page" +
                "?size=" +
                query.pageSize +
                "&page=" +
                query.page +
                sortParam +
                filterParam
            ).then(
              (res) => {
                resolve({
                  data: res.content,
                  page: res.number,
                  totalCount: res.totalElements,
                });
              },
              (error) => {
                console.log("error");
              }
            );
          })
        }
        icons={tableIcons}
        onRowClick={(event, rowData) => {
          console.log("select ", rowData);
        }}
      />
    </div>
  );
}

export default ListRequestTransportContainerToWareHouse;
