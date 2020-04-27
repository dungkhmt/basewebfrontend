import React, {useState} from 'react';
import MaterialTable from "material-table";
import {authGet, authPost} from "../../api";
import {tableIcons} from "../../utils/iconutil";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {CircularProgress} from "@material-ui/core";

function GeoListDistanceInfo(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const [isRequesting, setIsRequesting] = useState(false);

  const columns = [
    {field: 'addressStart', title: 'Địa chỉ đầu'},
    {field: 'addressEnd', title: 'Địa chỉ cuối'},
    {field: 'distance', title: 'Khoảng cách'},
    {field: 'travelTime', title: 'Thời gian di chuyển'},
    {field: 'travelTimeMotorbike', title: 'Thời gian đi bằng xe máy'},
    {field: 'travelTimeTruck', title: 'Thời gian đi bằng xe tải'},
    {field: 'enumID', title: 'Nguồn'},
    {
      title: '', render: rowData => <Link
        to={"/geo/change/distance-detail/" + rowData.idStart + "/" + rowData.idEnd}
      >
        <Button color="primary" variant="contained">Sửa</Button>
      </Link>
    }

  ];

  async function handleSubmit() {
    setIsRequesting(true);

    let cnt = await authPost(dispatch,
      token,
      "/compute-missing-address-distances", {
        distanceSource: 'OPEN_STREET_MAP',
        speedTruck: 30, speedMotorbike: 40, maxElements: 1000000
      }).then(r => r.json());

    console.log('GOT ', cnt);

    setIsRequesting(false);
    window.location.reload();
  }

  return (

    <div>
      <Button
        disabled={isRequesting}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {isRequesting ? <CircularProgress/> : "Bổ sung khoảng cách còn thiếu"}
      </Button>

      <MaterialTable
        title="Bảng thông tin khoảng cách "
        columns={columns}
        options={{
          filtering: false,
          search: true
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
              "/get-list-distance-info" + "?size=" + query.pageSize + "&page=" + query.page + sortParam + filterParam
            ).then(
              res => {

                resolve({
                  data: res.content,
                  page: res.number,
                  totalCount: res.totalElements

                });
                console.log("res", res.content);

              },

              error => {
                console.log("error");
              },
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


export default GeoListDistanceInfo;

