import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet} from "../../api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

export default function SupplierList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {title: 'Mã nhà cung cấp', field: 'supplierCode'},
    {title: 'Tên nhà cung cấp', field: 'supplierName'},
  ];

  const [supplierList, setSupplierList] = useState([]);

  async function getSupplierList() {
    let supplierList = await authGet(dispatch, token, '/get-all-supplier');
    setSupplierList(supplierList);
  }

  useEffect(() => {
    getSupplierList().then(r => r);
  }, []);

  return <div>
    <h2>Danh sách nhà cung cấp </h2>

    <Grid container spacing={3}>
      <Grid item xs={8}/>
      <Grid item xs={4} style={{verticalAlign: 'text-bottom', textAlign: 'right'}}>
        <Button color={'primary'} variant={'contained'} onClick={() => history.push('/supplier/create')}>
          Thêm mới
        </Button>
      </Grid>
    </Grid>

    <MaterialTable title={''} columns={columns} data={supplierList} options={{search: false}}/>

  </div>;
}