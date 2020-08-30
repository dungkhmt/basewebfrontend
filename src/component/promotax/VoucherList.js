import React, {useState} from "react";
import MaterialTable from "material-table";
import {authGet} from "../../api";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from "@material-ui/core/Button";
import {dateFnFormat} from "../../utils/dateutils";
import {currencyFormat} from "../../utils/NumberFormat";


export function VoucherList() {

  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [columns,] = useState(
    [
      {
        field: 'code',
        title: 'Mã giảm giá',
        render: rowData => (
          <a href={"#"}
             onClick={() => history.push(`/promo-group/voucher-detail/${rowData['voucherId']}`)}>
            {rowData['code']}
          </a>)
      },
      {field: 'description', title: 'Mô tả'},
      {
        field: 'fromDate',
        title: 'Ngày hiệu lực',
        render: rowData => rowData['fromDate'] ? dateFnFormat(new Date(rowData['fromDate']), 'yyyy-MM-dd') : ''
      },
      {
        field: 'thruDate',
        title: 'Ngày kết thúc',
        render: rowData => rowData['thruDate'] ? dateFnFormat(new Date(rowData['thruDate']), 'yyyy-MM-dd') : ''
      },
      {
        field: 'createdDate',
        title: 'Ngày tạo',
        render: rowData => rowData['createdDate'] ? dateFnFormat(new Date(rowData['createdDate']), 'yyyy-MM-dd') : ''
      },
      {
        field: 'minOrderValue',
        title: 'Đơn tối thiểu áp dụng',
        render: rowData => typeof rowData['minOrderValue'] === 'number' ? currencyFormat(rowData['minOrderValue']) : ''
      },
      {
        field: 'minDiscountAmount',
        title: 'Giá trị giảm tối thiểu',
        render: rowData => typeof rowData['minDiscountAmount'] === 'number' ? currencyFormat(rowData['minDiscountAmount']) : ''
      },
      {
        field: 'maxDiscountAmount',
        title: 'Giá trị giảm tối đa',
        render: rowData => typeof rowData['maxDiscountAmount'] === 'number' ? currencyFormat(rowData['maxDiscountAmount']) : ''
      },
      {field: 'minDiscountRate', title: 'Tỉ lệ giảm tối thiểu'},
      {field: 'maxDiscountRate', title: 'Tỉ lệ giảm tối đa'},
      {field: 'usageLimit', title: 'Số lần sử dụng'},
      {field: 'usageLimitPerCustomer', title: 'Số lần sử dụng từng khách'},
      {field: 'usageCount', title: 'Số lần đã sử dụng'},
      {
        title: '', render: rowData => (
          <div>
            <Button variant={"contained"} color={"primary"} startIcon={<EditIcon/>}
                    onClick={() => history.push(`/promo-group/edit-voucher/${rowData['voucherId']}`)}/>
            <Button variant={"contained"} color={"primary"} startIcon={<DeleteIcon/>}
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá ${rowData['code']} cùng các quy tắc của nó?`)) {
                        authGet(dispatch, token, `/delete-voucher/${rowData['voucherId']}`).then(r => {
                          history.go(0);
                        });
                      }
                    }}/>
          </div>
        )
      },
    ]);

  async function getVoucherList(pageNumber, pageSize) {
    let voucherPage = await authGet(
      dispatch,
      token,
      `/get-voucher-page?page=${pageNumber}&size=${pageSize}&sort=createdDate,desc`);
    return ({data: voucherPage['content'], page: voucherPage['number'], totalCount: voucherPage['totalElements']});
  }

  function handleAdd() {
    history.push(`/promo-group/create-voucher`);
  }

  return (<div>
    <div style={{textAlign: "right"}}>
      <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>} onClick={handleAdd}>Thêm mới</Button>
    </div>
    <div>
      <MaterialTable columns={columns} data={query => getVoucherList(query.page, query.pageSize)}
                     title={'Danh sách mã giảm giá'} options={{search: false}}/>
    </div>
  </div>);
}
