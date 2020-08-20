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

    <div>Mã kho: <b>{facilityId}</b></div>
    <div>Tên kho: <b>{facility['facilityName']}</b></div>
    <div>Địa chỉ: <b>{facility['postalAddress']['address']}</b></div>

    <div>
      <Button color={'primary'} variant={'contained'} onClick={() => history.push('/...')}>
        Tồn kho
      </Button>
    </div>
    <div>
      <Button color={'primary'} variant={'contained'} onClick={() => history.push('/...')}>
        Nhân viên bán hàng
      </Button>
    </div>
  </div>);
}
