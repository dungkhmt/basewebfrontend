import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable, { MTableToolbar } from "material-table";
import { tableIcons } from "../../utils/iconutil";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link, useParams } from "react-router-dom";
import { authPost } from "../../api";

export default function InventoryOrderDetail() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { orderId } = useParams();

  const columns = [
    {
      title: "Mã sản phẩm",
      field: "productId",
    },
    { title: "Tên sản phẩm", field: "productName" },
    { title: "Số lượng", field: "quantity" },
    { title: "Số lượng đã xuất", field: "exportedQuantity" },
  ];

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    let body = { orderId };
    authPost(dispatch, token, "/get-inventory-order-detail", body)
      .then((value) => value.json())
      .then((response) => {
        setDataTable(response);
      })
      .catch(console.log);
  }

  useEffect(() => getDataTable(), []);

  return (
    <div>
      <MaterialTable
        title={"Chi tiết đơn hàng " + orderId}
        columns={columns}
        options={{
          search: false,
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={8}
                  style={{ textAlign: "left", padding: "0px 30px 20px 30px" }}
                ></Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    verticalAlign: "text-bottom",
                    textAlign: "right",
                    padding: "0px 50px 10px 30px",
                  }}
                >
                  <Link to={"/inventory/export/" + orderId}>
                    <Button color={"primary"} variant={"contained"}>
                      {" "}
                      Xuất kho{" "}
                    </Button>
                  </Link>{" "}
                  <p />
                </Grid>
              </Grid>
            </div>
          ),
        }}
        data={dataTable}
        icons={tableIcons}
      />
    </div>
  );
}
