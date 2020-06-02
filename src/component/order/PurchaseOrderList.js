import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {authGet} from "../../api";
import MaterialTable from "material-table";

export default function PurchaseOrderList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {
      title: 'Mã đơn mua',
      render: rowData => <Link to={'/orders/detail/' + rowData['orderId']}>{rowData['orderId']}</Link>
    },
    {title: 'Ngày tạo', field: 'createdStamp'},
    {title: 'Nhà cung cấp', field: 'supplierName'},
    {title: 'Thành tiền', field: 'totalAmount'},
  ];

  const [purchaseOrderList, setPurchaseOrderList] = useState([]);

  async function getPurchaseOrderList() {
    let purchaseOrderList = await authGet(dispatch, token, '/get-all-purchase-order');
    setPurchaseOrderList(purchaseOrderList);
  }

  useEffect(() => {
    getPurchaseOrderList().then(r => r);
  }, []);

  return (<div>
    <div style={{textAlign: 'right'}}>
      {/*<Button color="primary" variant="contained" onClick={() => history.push('/purchase-order/create')}>*/}
      {/*  Thêm mới*/}
      {/*</Button>*/}
    </div>
    <MaterialTable columns={columns} data={purchaseOrderList} title={'Danh sách đơn mua'} options={{search: false}}/>
  </div>);

}
