import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../../../config/config";
import { localization } from "../../../utils/MaterialTableUtils";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});
const columns = [
  { title: "Mã khách hàng", field: "postCustomerId" },
  { title: "Họ tên", field: "postCustomerName" },
  { title: "Số điện thoại", field: "phoneNum" },
  {
    title: "Địa chỉ",
    field: "postalAddress",
    render: (postCustomer) => (
      <Link
        to={"/geo/location/map/" + postCustomer.postalAddress.contactMechId}
      >
        Xem địa chỉ
      </Link>
    ),
    filtering: false,
  },
];
export default function PostCustomerList(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [tableRef, setTableRef] = useState();

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  useEffect(() => {
    fetch(API_URL + "/get-customer-list", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setData(response);
      });
  }, data);

  return (
    <Paper className={classes.root}>
      <Button
        color="primary"
        variant="outlined"
        style={{ marginTop: 10 }}
        onClick={() => {
          console.log(data);
        }}
      >
        Test
      </Button>
      <MaterialTable
        className={classes.table}
        title="Danh sách khách hàng"
        columns={columns}
        options={{
          filtering: true,
          search: true,
          actionsColumnIndex: -1,
          selection: false,
        }}
        localization={localization}
        data={data}
        tableRef={(ref) => setTableRef(ref)}
      />
    </Paper>
  );
}
