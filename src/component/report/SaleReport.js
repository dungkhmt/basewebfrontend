import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { authGet, authPost } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import { toFormattedDateTime } from "../../utils/dateutils";

export function SaleReportByProduct() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div>
      <SaleReport
        filterLabel={"Chọn sản phẩm: "}
        filterId={"productId"}
        filterName={"productName"}
        selectDataRequest={async () =>
          (
            await authPost(dispatch, token, "/get-list-product", {}).then((r) =>
              r.json()
            )
          )["products"]
        }
        tableTitle={"Báo cáo doanh số theo sản phẩm"}
      />
    </div>
  );
}

export function SaleReportByPartyCustomer() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div>
      <SaleReport
        filterLabel={"Chọn khách hàng: "}
        filterId={"partyCustomerId"}
        filterName={"customerName"}
        selectDataRequest={async () =>
          await authGet(dispatch, token, "/get-list-party-customers")
        }
        tableTitle={"Báo cáo doanh số theo khách hàng"}
      />
    </div>
  );
}

function SaleReport(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { filterLabel, filterId, filterName, selectDataRequest, tableTitle } =
    props;

  const columns = [
    { title: "Ngày", field: "date" },
    { title: "Doanh thu (VND)", field: "price" },
  ];

  const [dataTable, setDataTable] = useState();

  const [fromDate, setFromDate] = useState(
    (() => {
      let date = new Date();
      date.setDate(date.getDate() - 7);
      return date;
    })()
  );
  const [thruDate, setThruDate] = useState(new Date());

  const [selected, setSelected] = useState("");
  const [selectData, setSelectData] = useState([]);

  useEffect(() => {
    (async () => {
      let selectDataResponse = await selectDataRequest(); // get all product/customer....
      setSelectData(selectDataResponse);
      setSelected(selectDataResponse[0][filterId]);
      await onChangeSelected(
        fromDate,
        thruDate,
        selectDataResponse[0][filterId]
      );
    })();
  }, []);

  async function onChangeSelected(fromDate, thruDate, selectedData) {
    let dataTableResponse = await authPost(
      dispatch,
      token,
      "/get-sale-reports",
      {
        fromDate: toFormattedDateTime(fromDate),
        thruDate: toFormattedDateTime(thruDate),
        [filterId]: selectedData, // productId: ... || partyCustomerId: ...
      }
    ).then((r) => r.json());
    setDataTable(dataTableResponse["datePrices"]);
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid
          item
          xs={8}
          style={{ textAlign: "left", padding: "0px 30px 20px 30px" }}
          justify="space-around"
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Từ ngày: "
              value={fromDate}
              onChange={(date) => {
                setFromDate(date);
                onChangeSelected(date, thruDate, selected).then((r) => r);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Đến ngày: "
              value={thruDate}
              onChange={(date) => {
                setThruDate(date);
                onChangeSelected(fromDate, date, selected).then((r) => r);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <p />
          {filterLabel + ": "}
          <Select
            value={selected}
            onChange={(event) => {
              setSelected(event.target.value);
              onChangeSelected(fromDate, thruDate, event.target.value).then(
                (r) => r
              );
            }}
          >
            {selectData.map((value) => (
              <MenuItem value={value[filterId]}>
                {value[filterName] + " (" + value[filterId] + ")"}{" "}
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
        >
          <Button color={"primary"} variant={"contained"}>
            {" "}
            Biểu đồ{" "}
          </Button>
        </Grid>
      </Grid>

      <MaterialTable
        options={{ search: false }}
        title={tableTitle}
        columns={columns}
        data={dataTable}
      />
    </div>
  );
}
