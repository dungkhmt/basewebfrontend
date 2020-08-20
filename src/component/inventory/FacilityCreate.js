import React, {useState} from 'react'
import {textField} from '../../utils/FormUtils'
import Button from '@material-ui/core/Button'
import {authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

export function FacilityCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const history = useHistory();

  const [facilityId, setFacilityId] = useState('')

  const [facilityName, setFacilityName] = useState('')

  const [facilityAddress, setFacilityAddress] = useState('')

  async function handleSubmit() {
    let body = {facilityId, facilityName, address: facilityAddress}
    let response = await authPost(dispatch, token, '/create-facility', body).then(r => r.json());
    if (response && response['facilityId']) {
      alert('Đã tạo thành công kho với mã: ' + response['facilityId']);
      history.push('/facility/list');
    }
  }

  return (<div>
    <h2>Tạo mới kho</h2>

    {textField('facilityId', 'Mã kho', 'search', facilityId, setFacilityId)}
    {textField('facilityName', 'Tên kho', 'search', facilityName, setFacilityName)}
    {textField('facilityAddress', 'Địa chỉ kho', 'search', facilityAddress, setFacilityAddress)}

    <Button color={'primary'} variant={'contained'} onClick={() => handleSubmit()}>
      Lưu
    </Button>

  </div>)
}
