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
    if (userLoginIds) {
      setUserLoginIds(userLoginIds);
      setSelectedUserLoginId(userLoginIds[0]);
    }
  }

  async function handleSubmit() {
    const body = {userLoginId: selectedUserLoginId, facilityId};
    let response = await authPost(dispatch, token, '/create-facility-role', body).then(r => r.json());
    if (response && response['facilityRoleId']) {
      history.push('/facility/salesman/list/' + facilityId) // SalesmanFacilityList
    } else {
      alert('Đã có lỗi xảy ra');
    }
  }

  useEffect(() => {
    getUserLoginIds().then(r => r);
  }, []);

  return (<div>
    <h2>Thêm nhân viên bán hàng vào kho</h2>

    <table style={{width: '100%', border: '0px'}}>
      <tr>
        <td style={{width: '10%'}}/>
        <td style={{width: '90%'}}/>
      </tr>
      <tr>
        <td>Mã kho:</td>
        <td><b>{facilityId}</b></td>
      </tr>

      <tr>
        <td>Chọn nhân viên:</td>
        <td><b>{selectValueCallback('', userLoginIds, e => e, selectedUserLoginId, setSelectedUserLoginId)}</b></td>
      </tr>
    </table>

    <Button variant={"contained"} color={"primary"} onClick={() => handleSubmit()}>Lưu</Button>
  </div>);
}
