import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet} from "../../../api";
import {CircularProgress} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import MaterialTable from "material-table";
import {tableIcons} from "../../../utils/iconutil";

function ListContainer(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);
  const columns = [
    {field: "containerId", title: "Mã container"},
    {field: "containerName", title: "Tên container"},
    {field: "containerType", title: "Thể loại"},
  ]
  return (
    <div>
      <MaterialTable
        title="Danh sách bãi container "
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
              "/get-list-cont-container" + "?size=" + query.pageSize + "&page=" + query.page + sortParam + filterParam
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
      <CardActions>
        <Link to={"/containerfunc/create"}>
          <Button
            variant="contained"
            color="primary"
          >
            {isRequesting ? <CircularProgress/> : "Thêm mới"}
          </Button>
        </Link>


      </CardActions>
    </div>
  );
}


export default ListContainer;
