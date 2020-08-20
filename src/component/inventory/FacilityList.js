import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {Link, useHistory} from "react-router-dom";
import {authPost} from "../../api";


export function FacilityList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const history = useHistory();

  const [columns,] = useState(
    [
      {
        field: 'facilityId',
        title: 'Mã kho',
        render: rowData => (<Link to={'/facility/detail/' + rowData['facilityId']}>{rowData['facilityId']}</Link>)
      },
      {field: 'facilityName', title: 'Mã kho'},
      {title: 'Địa chỉ', render: rowData => rowData['postalAddress']['address']},
    ]);

  const [facilities, setFacilities] = useState([]);

  async function getDataTable() {
    let response = await authPost(dispatch, token, '/get-list-facility', {}).then(r => r.json());
    if (response && response['facilities']) {
      setFacilities(response['facilities']);
    }
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);


  return (<div>
    <div style={{textAlign: "center"}}><h2>Danh sách kho</h2></div>
    <div style={{float: "right"}}>
      <Button color={'primary'} variant={'contained'} onClick={() => history.push('/...')}>Thêm mới</Button>
    </div>
    <MaterialTable columns={columns} data={facilities} title={''} options={{search: false}}/>
  </div>);
}
