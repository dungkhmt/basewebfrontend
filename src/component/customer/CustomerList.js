import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../api";
import MaterialTable from "material-table";
import { tableIcons } from "../../utils/iconutil";

function CustomerList(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const columns = [
    { field: "partyId", title: "Party Id" },
    { field: "type", title: "Type" },
    { field: "customerCode", title: "Customer Code" },
    { field: "customerName", title: "Customer Name" },
  ];

  const [customerList, setCustomerList] = useState([]);

  async function getDataTable() {
    let customerList = await authGet(dispatch, token, `/customers`);
    setCustomerList(customerList);
  }

  useEffect(() => {
    getDataTable().then((r) => r);
  }, []);

  return (
    <MaterialTable
      title="Danh sách khách hàng"
      columns={columns}
      options={{
        filtering: true,
        search: false,
      }}
      data={customerList}
      icons={tableIcons}
      onRowClick={(event, rowData) => {
        console.log("select ", rowData);
      }}
    />
  );
}

export default CustomerList;
