import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {authGet} from "../../api";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";

export function SalesmanFacilityList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {facilityId} = useParams();

  const [facility, setFacility] = useState({});

  const [facilityRoles, setFacilityRoles] = useState([]);

  const [facilityRoleColumns,] = useState(
    [
      {field: 'facilityRoleId', title: 'Mã NVBH'},
      {field: 'userLoginName', title: 'Tên NVBH'},
      {field: 'userLoginId', title: 'UserLogin'},
      {
        title: '',
        render: rowData => (<Button color="secondary" variant="contained"
                                    onClick={() => handleDeleteFacilityRole(rowData['facilityRoleId'])}>Xóa</Button>)
      }
    ]);

  async function getFacility() {
    let facility = await authGet(dispatch, token, '/get-facility?facilityId=' + facilityId);
    setFacility(facility);
  }

  async function getFacilityRoles() {
    let facilityRoles = await authGet(dispatch, token, '/get-all-facility-role?facilityId=' + facilityId);
    setFacilityRoles(facilityRoles);
  }

  async function handleDeleteFacilityRole(facilityRoleId) {
    let response = await authGet(dispatch, token, '/delete-facility-role?facilityRoleId=' + facilityRoleId);
    if (!response) {
      alert('Có lỗi xảy ra');
    }
    await getFacilityRoles();
  }

  useEffect(() => {
    getFacility().then(r => r);
    getFacilityRoles().then(r => r);
  }, []);


  return (<div>
    <h2>Danh sách NVBH cho kho</h2>

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

    <div style={{textAlign: "right"}}>
      <Button variant={"contained"} color={"primary"}
              onClick={() => history.push('/facility/salesman/create/' + facilityId)}>Thêm mới</Button>
    </div>
    <MaterialTable columns={facilityRoleColumns} data={facilityRoles} title={''} options={{search: false}}/>
  </div>);
}
