import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {textField} from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";
import {authPost} from "../../api";

export default function SupplierCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const [supplierName, setSupplierName] = useState('');
  const [supplierCode, setSupplierCode] = useState('');

  async function handleSubmit() {
    if (supplierCode === '' || supplierName === '') {
      alert('Nhập đầy đủ mã nhà cung cấp và tên nhà cung cấp rồi thử lại.');
      return;
    }
    let body = {supplierCode, supplierName};
    let supplier = await authPost(dispatch, token, '/create-supplier', body).then(r => r.json());
    if (supplier && supplier['partyId']) {
      alert('Đã tạo thành công nhà cung cấp với mã partyId = ' + supplier['partyId']);
    } else {
      alert('Tạo không thành công, có thể do mã nhà cung cấp đã tồn tại.');
    }
    history.push('/supplier/list/');
  }

  return <div>
    <h2>Thêm mới nhà cung cấp</h2>

    {textField('supplierName', 'Tên nhà cung cấp', 'search', supplierName, setSupplierName)}
    {textField('supplierCode', 'Mã nhà cung cấp', 'search', supplierCode, setSupplierCode)}

    <Button color={'primary'} variant={'contained'} onClick={handleSubmit}>Lưu</Button>
    <Button color={'secondary'} variant={'contained'} onClick={() => history.push('/supplier/list/')}>Hủy</Button>
  </div>
}
