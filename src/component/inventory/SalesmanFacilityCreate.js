import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {selectValueCallback} from "../../utils/FormUtils";
import {authGet, authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@material-ui/core";

export function SalesmanFacilityCreate() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {facilityId} = useParams();

  const [userLoginIds, setUserLoginIds] = useState([]);

  const [selectedUserLoginId, setSelectedUserLoginId] = useState('');

  async function getUserLoginIds() {
    let userLoginIds = await authGet(dispatch, token, '/get-all-user-login-ids');
    setUserLoginIds(userLoginIds);
  }

  async function handleSubmit() {
    const body = {userLoginId: selectedUserLoginId, facilityId};
    let response = await authPost(dispatch, token, '/create-facility-role', body);
    if (response && response['facilityRoleId']) {
      history.push('/...') // SalesmanFacilityList
    } else {
      alert('Đã có lỗi xảy ra');
    }
  }

  useEffect(() => {
    getUserLoginIds().then(r => r);
  }, []);

  return (<div>
    <h2>Thêm nhân viên bán hàng vào kho</h2>

    <div>Mã kho: <b>{facilityId}</b></div>
    {selectValueCallback('userLoginId', userLoginIds, e => e, selectedUserLoginId, setSelectedUserLoginId)}

    <Button variant={"contained"} color={"primary"} onClick={() => handleSubmit()}>Lưu</Button>
  </div>);
}
