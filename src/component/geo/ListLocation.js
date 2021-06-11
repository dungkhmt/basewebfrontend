import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import { authGet } from "../../api";
import { tableIcons } from "../../utils/iconutil";

function ListLocation() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const columns = [
    { field: "contactMechId", title: "Mã địa chỉ " },
    { field: "address", title: "Địa chỉ " },
    { field: "coordinates", title: "Tọa độ " },
    {
      title: "",
      render: (rowData) => (
        <Link to={"/geo/location/map/" + rowData.contactMechId}>
          <Button color="primary" variant="contained">
            Sửa
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <MaterialTable
        title="Bảng thông tin địa chỉ "
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
              "/get-list-geo-point-page" +
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

export default ListLocation;
