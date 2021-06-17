import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authDelete, authGet } from "../../../api";
import { localization } from "../../../utils/MaterialTableUtils";
import { errorNoti } from "../../../utils/Notification";
import ConfirmDialog from "../ConfirmDialog";

function errHandling(err) {
  if (err.message == "Unauthorized")
    errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
  else errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
  console.trace(err);
}

function formatDate(date) {
  return (
    date.getDate() +
    "-" +
    parseInt(date.getMonth() + 1) +
    "-" +
    date.getFullYear()
  );
}

const columns = [
  {
    title: "Mã đơn hàng",
    field: "postShipOrderId",
    filtering: false,
    hidden: true,
  },
  { title: "Người gửi", field: "fromCustomer.postCustomerName" },
  { title: "Người nhận", field: "toCustomer.postCustomerName" },
  { title: "Tên hàng", field: "packageName", minWidth: 200 },
  { title: "Khối lượng", field: "weight", minWidth: 150, filtering: false },
  { title: "Trạng thái", field: "statusItem.description" },
  {
    title: "Chi tiết",
    field: "detail",
    render: (row) => (
      <Link
        to={{
          pathname: "/postoffice/shiporderdetail",
          state: {
            value: row,
          },
        }}
      >
        Chi tiết
      </Link>
    ),
    filtering: false,
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
  },
  container: {
    maxHeight: 440,
  },
});

export default function PostShipOrderList(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [comfirmAction, setConfirmAction] = useState({
    open: false,
    handleSuccess: undefined,
    content: undefined,
    title: undefined,
  });
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleFromDateChange = (date) => {
    setFromDate(date);
    loadData(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    loadData(fromDate, date);
  };

  const loadData = (fromDate, toDate) => {
    authGet(
      dispatch,
      token,
      "/get-list-order" +
        "?fromDate=" +
        formatDate(fromDate) +
        "&toDate=" +
        formatDate(toDate)
    )
      .then((response) => {
        setData(response);
      })
      .catch((err) => errHandling(err));
  };

  const deleteOrder = (postOrder) => {
    authDelete(
      dispatch,
      token,
      "/delete-post-ship-order/" + postOrder.postShipOrderId,
      {}
    )
      .then((res) => {
        setConfirmAction({ open: false, content: "xoá đơn hàng" });
        const dataUpdate = [...data];
        const index = postOrder.tableData.id;
        dataUpdate[index].statusId = "ORDER_CANCELLED";
        dataUpdate[index].statusItem.description = "Đã hủy";
        setData([...dataUpdate]);
      })
      .catch((err) => errHandling(err));
  };

  useEffect(() => {
    loadData(fromDate, toDate);
  }, data);

  return (
    <Paper className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          id="fromDate"
          label="Từ ngày"
          style={{ width: 400, margin: 5 }}
          required={true}
          InputLabelProps={{
            shrink: true,
          }}
          format="dd/MM/yyyy"
          onChange={handleFromDateChange}
          value={fromDate}
        />
        <KeyboardDatePicker
          id="toDate"
          label="Đến ngày"
          style={{ width: 400, margin: 5 }}
          required={true}
          InputLabelProps={{
            shrink: true,
          }}
          format="dd/MM/yyyy"
          onChange={handleToDateChange}
          value={toDate}
        />
        <Button
          component={Link}
          to={{
            pathname: "/postoffice/viewallshiporder",
            state: { data: data },
          }}
          variant="contained"
          color="primary"
          style={{ margin: 10, float: "right" }}
        >
          Xem trên bản đồ
        </Button>
        <MaterialTable
          className={classes.table}
          title="Danh sách đơn hàng"
          columns={columns}
          options={{
            filtering: true,
            search: false,
            actionsColumnIndex: -1,
          }}
          localization={localization}
          data={data}
          actions={[
            (postOrder) => ({
              icon: "delete",
              tooltip: "Xóa",
              onClick: (event, postOrder) =>
                setConfirmAction({
                  open: true,
                  handleSuccess: () => deleteOrder(postOrder),
                  content: "huỷ đơn hàng",
                  title: "Huỷ đơn hàng ?",
                }),
              disabled: postOrder.statusId == "ORDER_CANCELLED",
            }),
          ]}
        />
        <ConfirmDialog
          confirmAction={comfirmAction}
          setConfirmAction={setConfirmAction}
        />
      </MuiPickersUtilsProvider>
    </Paper>
  );
}
