import React from "react";
import {tableIcons} from "../../utils/iconutil";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {authGet} from "../../api";

import {Link} from "react-router-dom";


function SalesmanList(props) {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();


  const columns = [
    {
      title: "Mã NVBH",
      field: "partyId",
      render: rowData => <Link to={"/salesman/" + rowData.partyId}>{rowData.partyId}</Link>
    },
    {title: "Tên NVBH", field: "name"},
    {title: "TK đăng nhập", field: "userName"}
  ]


  return (

    <div>
      <MaterialTable
        title="List Salemans"
        columns={columns}
        options={{
          filtering: true,
          search: false
        }}
        data={query =>
          new Promise((resolve, reject) => {
            console.log(query);
            let sortParam = "";
            if (query.orderBy !== undefined) {
              sortParam = "&sort=" + query.orderBy.field + ',' + query.orderDirection;
            }
            let filterParam = "";
            if (query.filters.length > 0) {
              let filter = query.filters;
              filter.forEach(v => {
                filterParam = v.column.field + "=" + v.value + "&"
              })
              filterParam = "&" + filterParam.substring(0, filterParam.length - 1);
            }

            authGet(
              dispatch,
              token,
              "/get-list-salesman" + "?size=" + query.pageSize + "&page=" + query.page + sortParam + filterParam
            ).then(
              res => {

                resolve({
                  data: res.content,
                  page: res.number,
                  totalCount: res.totalElements

                });

              },
              error => {
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

export default SalesmanList;


