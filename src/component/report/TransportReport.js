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
import { toFormattedDate } from "../../utils/dateutils";

export function TransportReportByFacility() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div>
      <TransportReport
        filterLabel={"Chọn kho"}
        filterIdOnGetList={"facilityId"}
        filterIdOnGetReports={"facilityId"}
        filterName={"facilityName"}
        selectDataRequest={async () =>
          (
            await authPost(dispatch, token, "/get-list-facility", {}).then(
              (r) => r.json()
            )
          )["facilities"]
        }
        tableTitle={"Báo cáo vận chuyển theo kho"}
      />
    </div>
  );
}

export function TransportReportByPartyCustomer() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div>
      <TransportReport
        filterLabel={"Chọn khách hàng"}
        filterIdOnGetList={"partyCustomerId"}
        filterIdOnGetReports={"customerId"}
        filterName={"customerName"}
        selectDataRequest={async () =>
          await authGet(dispatch, token, "/get-list-party-customers")
        }
        tableTitle={"Báo cáo vận chuyển theo khách hàng"}
      />
    </div>
  );
}

export function TransportReportByDriver() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div>
      <TransportReport
        filterLabel={"Chọn tài xế"}
        filterIdOnGetList={"partyId"}
        filterIdOnGetReports={"driverId"}
        filterName={"fullName"}
        selectDataRequest={async () =>
          await authGet(dispatch, token, "/get-all-drivers")
        }
        tableTitle={"Báo cáo vận chuyển theo tài xế"}
      />
    </div>
  );
}

function TransportReport(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    filterLabel,
    filterIdOnGetList,
    filterIdOnGetReports,
    filterName,
    selectDataRequest,
    tableTitle,
  } = props;

  const columns = [
    { title: "Ngày", field: "date" },
    { title: "Chi phí (VND)", field: "cost" },
    { title: "Quãng đường", field: "totalDistance" },
    { title: "Số chuyến", field: "numberTrips" },
    { title: "Khối lượng hàng giao", field: "totalWeight" },
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
      let selectDataResponse = await selectDataRequest(); // get all driver/facilities/customer....
      setSelectData(selectDataResponse);
      setSelected(selectDataResponse[0][filterIdOnGetList]);
      await onChangeSelected(
        fromDate,
        thruDate,
        selectDataResponse[0][filterIdOnGetList]
      );
    })();
  }, []);

  async function onChangeSelected(fromDate, thruDate, selectedData) {
    let dataTableResponse = await authPost(
      dispatch,
      token,
      "/get-transport-reports",
      {
        fromDate: toFormattedDate(fromDate),
        thruDate: toFormattedDate(thruDate),
        [filterIdOnGetReports]: selectedData, // productId: ... || partyCustomerId: ...
      }
    ).then((r) => r.json());
    setDataTable(dataTableResponse["dateReports"]);
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
              <MenuItem value={value[filterIdOnGetList]}>
                {value[filterName] + " (" + value[filterIdOnGetList] + ")"}{" "}
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
          <Button color={"primary"} variant={"contained"}>
            {" "}
            Xuất Excel{" "}
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
