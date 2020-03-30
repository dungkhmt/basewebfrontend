import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable, {MTableToolbar} from "material-table";
import {authGet} from "../../api";
import {tableIcons} from "../../utils/iconutil";
import Grid from "@material-ui/core/Grid";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

export default function InventoryList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const columns = [
    {title: "Mã sản phẩm", field: "productId",},
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Số lượng tồn", field: "quantity"},
    {title: "Tên kho", field: "facilityName"},
  ];

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    if (selectedFacility) {
      authGet(dispatch, token, '/get-inventory-list/' + selectedFacility).then(response => {
        setDataTable(response);
      }).catch(console.log);
    }
  }

  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState();

  function getAllFacility() {
    authGet(dispatch, token, '/facility/all').then(response => {
      setFacilityList(response);
      setSelectedFacility(response[0]['facilityId']);
    }).catch(console.log);
  }

  useEffect(() => {
    Promise.all([getDataTable(), getAllFacility()]).then(r => r);
  }, []);

  useEffect(() => getDataTable(), [selectedFacility]);

  const components = {
    Toolbar: props => (
      <div>
        <MTableToolbar {...props} />
        <Grid container spacing={3}>
          <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
            {'Chọn kho: '}
            <Select
              value={selectedFacility}
              onChange={event => setSelectedFacility(event.target.value)}
            >
              {facilityList.map(facility => (<MenuItem value={facility['facilityId']}>
                {facility['facilityId'] + '(' + facility['facilityName'] + ')'}
              </MenuItem>))}
            </Select>
          </Grid>
          <Grid item xs={4}
                style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
          </Grid>
        </Grid>
      </div>
    )
  };

  return <div>
    <MaterialTable
      title={"Danh sách tồn kho"}
      columns={columns}
      options={{search: false}}
      components={components}
      data={dataTable}
      icons={tableIcons}
    />
  </div>;

}