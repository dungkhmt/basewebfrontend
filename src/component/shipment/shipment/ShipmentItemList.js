import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../../api";
import {tableIcons} from "../../../utils/iconutil";
import React, {useState} from "react";
import Upload from "../../../utils/Upload";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function ShipmentItemList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Số lượng", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mã sản phẩm", field: "productId"},
    {title: "Mã khách hàng", field: "customerCode"},
    {title: "Mã địa chỉ", field: "locationCode"},
  ];

  function handleCalcDistance() {
    setCalcWaiting(true);
    authGet(dispatch, token, '/calc-distance-travel-time').then(response => {
      if (typeof response === 'number') {
        alert('Tính toán xong ' + response + ' cặp khoảng cách!');
        setCalcWaiting(false);
      } else {
        alert('Có lỗi...');
      }
    }).catch(console.log);
  }

  const [calcWaiting, setCalcWaiting] = useState(false);

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
      <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới </Button>
    </Link>
    <Upload
      url={'shipment/upload'}
      token={token}
      dispatch={dispatch}
      buttonTitle={'Tải lên đơn hàng'}
      handleSaveCallback={() => window.location.reload()}
    />
    {calcWaiting ? <CircularProgress color={'secondary'}/> :
      <Button color={'primary'} variant={'contained'} onClick={() => handleCalcDistance()}> Tính khoảng cách </Button>
    }
  </div>
}