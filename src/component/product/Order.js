import { Button, Grid, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UPDATE_STATUS } from "../../action/order";
import { authPut } from "../../api";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  orderContainer: {
    backgroundColor: "#f5f5f5",
    padding: "24px 36px",
    marginBottom: "24px",
  },
  price: {
    color: "red",
    fontSize: "24px",
    fontWeight: 500,
  },
  totalPrice: {
    color: "red",
    fontSize: "26px",
    fontWeight: 500,
  },
  productCountContainer: {
    display: "flex",
    fontSize: "24px",
    alignItems: "center",
  },
  productCountDiv: {
    display: "flex",
    alignItems: "center",
  },
  productAmountTitle: {
    textTransform: "capitalize",
    marginRight: "16px",
  },
  productCountWrapper: {
    display: "flex",
    columnGap: "8px",
    marginRight: "32px",
    alignItems: "center",
    border: "1px solid #ebebeb",
  },
  countButton: {
    padding: "8px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  productCount: {
    padding: "8px 16px",
  },
  message: {
    textAlign: "center",
    marginTop: 80,
  },
  buttonWrapper: {
    textAlign: "right",
    paddingRight: "40px",
  },
}));

const orderStatus = {
  ORDER_CREATED: "Đơn hàng đã được tạo",
  ORDER_CANCELLED: "Đơn hàng đã hủy",
  ORDER_DONE: "Đơn hàng đã giao đến tay người nhận",
  ORDER_DELIVERING: "Đơn hàng đang được giao",
};

function Order(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const handleChangeStatus = async (event, order) => {
    const body = {
      statusId: event.target.value,
    };
    try {
      await authPut(dispatch, token, `/update-order/${order.orderId}`, body);
      toast.success("Update order status successfully");
      dispatch({
        type: UPDATE_STATUS,
        payload: {
          ...order,
          statusId: event.target.value,
        },
      });
    } catch (error) {
      console.error("update order status: ", error);
      toast.error("Update order status failed.");
    }
  };

  const handleUpdate = async () => {};

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Order</h1>
      <Grid container className={classes.orderContainer}>
        <Grid item xs={4}>
          Sản phẩm
        </Grid>
        <Grid item xs={2}>
          Số lượng
        </Grid>
        <Grid item xs={2}>
          Số tiền
        </Grid>
        <Grid item xs={2}>
          Trạng thái
        </Grid>
      </Grid>

      {order.length > 0 ? (
        order.map((item) => (
          <Grid container className={classes.orderContainer} key={item.orderId}>
            <Grid item xs={4}>
              <p>{item.productName}</p>
            </Grid>
            <Grid item xs={2} className={classes.price}>
              <span>{item.quantity * 20000} đ</span>
            </Grid>
            <Grid item xs={2}>
              <span className={classes.productCount}>{item.quantity}</span>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={item.statusId}
                  onChange={(event) => handleChangeStatus(event, item)}
                >
                  <MenuItem value="ORDER_CREATED">
                    {orderStatus.ORDER_CREATED}
                  </MenuItem>
                  <MenuItem value="ORDER_DELIVERING">
                    {orderStatus.ORDER_DELIVERING}
                  </MenuItem>
                  <MenuItem value="ORDER_DONE">
                    {orderStatus.ORDER_DONE}
                  </MenuItem>
                  <MenuItem value="ORDER_CANCELLED">
                    {orderStatus.ORDER_CANCELLED}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography component="h3" variant="h3" className={classes.message}>
          <span>Bạn chưa có sản phẩm nào.</span>
          <Link to="/products/list">Mua ngay</Link>
        </Typography>
      )}

      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleUpdate}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
}

export default Order;
