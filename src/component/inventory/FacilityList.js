import React, {useState} from "react";
import MaterialTable from "material-table";
import {authGet} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";


export function FacilityList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const history = useHistory();

  const [columns,] = useState(
    [
      {field: 'facilityId', title: 'Mã kho'},
      {field: 'facilityName', title: 'Mã kho'},
      {title: 'Địa chỉ', render: rowData => rowData['postalAddress']['address']},
    ]);

  const [facilities, setFacilities] = useState([]);

  async function getDataTable() {
    let facilities = await authGet(dispatch, token, '/get-list-facility');
    setFacilities(facilities);
  }

  return (<div>
    <div style={{textAlign: "center"}}><h2>Danh sách kho</h2></div>
    <div style={{float: "right"}}>
      <Button color={'primary'} variant={'contained'} onClick={() => history.push('/...')}>Thêm mới</Button>
    </div>
    <MaterialTable columns={columns} data={facilities} title={''}/>
  </div>);
}
