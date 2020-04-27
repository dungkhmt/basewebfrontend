import React, {useState} from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {toFormattedDateTime} from "../../utils/dateutils";

function SalesReportByDate(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const [dataTable, setDataTable] = useState();

  const [fromDate, setFromDate] = useState((() => {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  })());
  const [thruDate, setThruDate] = useState(new Date());

  const columns = [
    {title: "Ngày", field: "date",},
    {title: "Doanh thu (VND)", field: "price"},
  ];

  async function onChangeSelected(fromDate, thruDate) {
    let dataTableResponse = await authPost(dispatch, token, '/get-report-date-based-revenue', {
      fromDate: toFormattedDateTime(fromDate), thruDate: toFormattedDateTime(thruDate)
    }).then(r => r.json());

    setDataTable(dataTableResponse['datePrices']);
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}} justify="space-around">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Từ ngày: "
              value={fromDate}
              onChange={date => {
                setFromDate(date);
                onChangeSelected(date, thruDate).then(r => r);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Đến ngày: "
              value={thruDate}
              onChange={date => {
                setThruDate(date);
                onChangeSelected(fromDate, date).then(r => r);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

        </Grid>
        <Grid item xs={4}
              style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
          <Button color={'primary'} variant={'contained'}> Biểu đồ </Button>
        </Grid>


      </Grid>
      <MaterialTable
        options={{search: false}} title={"Doanh số đơn hàng theo ngày"}
        columns={columns}
        data={dataTable}
      />
    </div>
  );
}

export default SalesReportByDate;