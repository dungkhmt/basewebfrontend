import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {authGet} from "../../api";
import Button from "@material-ui/core/Button";

export function FacilityDetail() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {facilityId} = useParams();

  const [facility, setFacility] = useState({});

  async function getFacility() {
    let facility = await authGet(dispatch, token, '/get-facility?facilityId=' + facilityId);
    setFacility(facility);
  }

  useEffect(() => {
    getFacility().then(r => r);
  }, []);

  return (<div>
    <h2>Chi tiết kho</h2>

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
        <td>Tên kho:</td>
        <td><b>{facility['facilityName']}</b></td>
      </tr>
      <tr>
        <td>Địa chỉ:</td>
        <td><b>{(facility['postalAddress'] || {})['address']}</b></td>
      </tr>
    </table>

    <br/>
    <div>
      <span>
        <Button color={'primary'} variant={'contained'} onClick={() => history.push('/inventory/list')}>
          Tồn kho
        </Button>
      </span>
      <span>
        <Button color={'primary'} variant={'contained'}
                onClick={() => history.push('/facility/salesman/list/' + facilityId)}>
          Nhân viên bán hàng
        </Button>
      </span>
    </div>
  </div>);
}
