import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable, { MTableToolbar } from "material-table";
import { authGet, authPost } from "../../api";
import { tableIcons } from "../../utils/iconutil";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import { Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { NumberFormatCustom } from "../../utils/NumberFormatTextField";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 400,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

function orElse(a, b) {
  return a ? a : b;
}

export default function InventoryOrderExport() {
  const classes = useStyles();

  const [, rerender] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { orderId } = useParams();
  const history = useHistory();

  const columns = [
    {
      title: "Mã sản phẩm",
      field: "productId",
    },
    { title: "Tên sản phẩm", field: "productName" },
    { title: "Số lượng trong đơn", field: "quantity" },
    { title: "Số lượng đã xuất", field: "exportedQuantity" },
    { title: "Số lượng tồn kho", field: "inventoryQuantity" },
    {
      title: "Chọn số lượng",
      field: "quantitySelection",
      render: (rowData) => (
        <TextField
          id="quantity"
          // label="Số lượng"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          inputProps={
            selectedIdSet.has(rowData["orderItemSeqId"])
              ? {
                  min: "1",
                  max:
                    "" +
                    Math.min(rowData["quantity"], rowData["inventoryQuantity"]),
                  step: "1",
                  inputComponent: NumberFormatCustom,
                }
              : { readOnly: true }
          }
          value={orElse(selectedQuantity[rowData["orderItemSeqId"]], 0)}
          onChange={(event) => {
            let newValue = event.target.value;
            let maxValue = Math.min(
              rowData["quantity"],
              rowData["inventoryQuantity"]
            );
            if (newValue <= 0) {
              newValue = 1;
            } else if (newValue > maxValue) {
              newValue = maxValue;
            }
            selectedQuantity[rowData["orderItemSeqId"]] = newValue;
            rerender([]);
          }}
        />
      ),
    },
  ];

  const [dataTable, setDataTable] = useState([]);

  function getDataTable() {
    let body = { orderId, facilityId: selectedFacility };
    authPost(dispatch, token, "/get-inventory-order-detail", body)
      .then((value) => value.json())
      .then((response) => {
        setDataTable(response);
      })
      .catch(console.log);
  }

  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState();

  function getAllFacility() {
    authGet(dispatch, token, "/facility/all")
      .then((response) => {
        setFacilityList(response);
        setSelectedFacility(response[0]["facilityId"]);
      })
      .catch(console.log);
  }

  const [selectedQuantity] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedIdSet, setSelectedIdSet] = useState(new Set());

  function onSelectedRowsChange(selectedRows) {
    let unSelectedRowIds = new Set(Object.keys(selectedQuantity));
    selectedRows.reduce((map, row) => {
      if (!map[row["orderItemSeqId"]]) {
        map[row["orderItemSeqId"]] = Math.min(
          row["quantity"],
          row["inventoryQuantity"]
        );
      }
      unSelectedRowIds.delete(row["orderItemSeqId"]);
      return map;
    }, selectedQuantity);
    unSelectedRowIds.forEach((id) => delete selectedQuantity[id]);
    setSelectedRows(selectedRows);
    setSelectedIdSet(new Set(Object.keys(selectedQuantity)));
  }

  function handleSubmit() {
    let body = {
      inventoryItems: selectedRows
        .filter((rowData) => selectedQuantity[rowData["orderItemSeqId"]] > 0)
        .map((rowData) => ({
          productId: rowData["productId"],
          facilityId: selectedFacility,
          quantity: selectedQuantity[rowData["orderItemSeqId"]],
          orderId: rowData["orderId"],
          orderItemSeqId: rowData["orderItemSeqId"],
        })),
    };
    authPost(dispatch, token, "/export-inventory-items", body)
      .then((response) => {
        history.push(process.env.PUBLIC_URL + "/inventory/export-list");
      })
      .catch(console.log);
  }

  useEffect(() => {
    Promise.all([getDataTable(), getAllFacility()]).then((r) => r);
  }, []);

  useEffect(() => getDataTable(), [selectedFacility]);

  const components = {
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <Grid container spacing={3}>
          <Grid
            item
            xs={8}
            style={{ textAlign: "left", padding: "0px 30px 20px 30px" }}
          >
            {"Chọn kho: "}
            <Select
              value={selectedFacility}
              onChange={(event) => setSelectedFacility(event.target.value)}
            >
              {facilityList.map((facility) => (
                <MenuItem value={facility["facilityId"]}>
                  {facility["facilityId"] +
                    "(" +
                    facility["facilityName"] +
                    ")"}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              verticalAlign: "text-bottom",
              textAlign: "right",
              padding: "0px 50px 10px 30px",
            }}
          ></Grid>
        </Grid>
      </div>
    ),
  };

  return (
    <div>
      <MaterialTable
        title={"Xuất kho đơn hàng " + orderId}
        columns={columns}
        options={{ search: false, selection: true }}
        components={components}
        data={dataTable}
        icons={tableIcons}
        onSelectionChange={(selectedRows) => onSelectedRowsChange(selectedRows)}
      />
      <Button
        color={"primary"}
        variant={"contained"}
        onClick={() => handleSubmit()}
      >
        {" "}
        Xác nhận{" "}
      </Button>{" "}
      <p />
    </div>
  );
}
