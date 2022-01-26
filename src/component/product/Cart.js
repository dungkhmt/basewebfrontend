import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BUY, REMOVE_PRODUCT, UPDATE_PRODUCT } from "../../action/cart";
import { authPost } from "../../api";
import { randomImageName } from "../../utils/FileUpload/covert.js";

const useStyles = makeStyles((theme) => ({
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cart(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [chooseProduct, setChooseProduct] = useState({});

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleOpen = (product) => {
    setChooseProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDisagree = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    dispatch({
      type: REMOVE_PRODUCT,
      payload: {
        productId: chooseProduct.productId,
      },
    });
    handleClose();
  };

  // useEffect(() => {
  //   authGet(
  //     dispatch,
  //     token,
  //     "/get-list-product-with-define-page?size=" + pageSize + "&page=" + page
  //   ).then((response) => {
  //     setProductList(response.products);
  //     setTotalElements(response.totalElements);
  //   });
  // }, [page, pageSize]);

  const handleReduceQuantity = (product) => {
    if (product.quantity - 1 < 0) {
      return;
    }
    dispatch({
      type: UPDATE_PRODUCT,
      payload: {
        productId: product.productId,
        quantity: product.quantity - 1,
      },
    });
  };

  const handleGainQuantity = (product) => {
    dispatch({
      type: UPDATE_PRODUCT,
      payload: {
        productId: product.productId,
        quantity: product.quantity + 1,
      },
    });
  };

  const handleBuy = async () => {
    // handle call buy product API here
    const body = cart.map((item) => ({
      orderId: randomImageName(),
      productId: item.productId,
      quantity: item.quantity,
      storeId: "F0001", // fake storeId
    }));
    try {
      await authPost(dispatch, token, "/create-order", body);
      dispatch({
        type: BUY,
      });
      toast.success("Create order successfully");
    } catch (error) {
      console.error("create order failed: ", error);
    }
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Cart</h1>
      <Grid container className={classes.orderContainer}>
        <Grid item xs={4}>
          Sản phẩm
        </Grid>
        <Grid item xs={2}>
          Đơn giá
        </Grid>
        <Grid item xs={2}>
          Số lượng
        </Grid>
        <Grid item xs={2}>
          Số tiền
        </Grid>
        <Grid item xs={2}>
          Thao tác
        </Grid>
      </Grid>

      {cart.length > 0 ? (
        cart.map((item) => (
          <Grid container className={classes.orderContainer}>
            <Grid item xs={4}>
              <p>{item.name}</p>
            </Grid>
            <Grid item xs={2} className={classes.price}>
              <span>{item.price} đ</span>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.productCountDiv}>
                <div className={classes.productCountWrapper}>
                  <span
                    className={classes.countButton}
                    onClick={() => handleReduceQuantity(item)}
                  >
                    -
                  </span>
                  <span className={classes.productCount}>{item.quantity}</span>
                  <span
                    className={classes.countButton}
                    onClick={() => handleGainQuantity(item)}
                  >
                    +
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <span className={classes.totalPrice}>
                {item.price * item.quantity}đ
              </span>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={() => handleOpen(item)}
              >
                Xóa
              </Button>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography component="h3" variant="h3" className={classes.message}>
          <span>Bạn chưa có sản phẩm nào.</span>
          <Link to="/products/list">Mua ngay</Link>
        </Typography>
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Bạn có chắc chắn muốn xóa sản phẩm này?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            Hủy
          </Button>
          <Button onClick={handleAgree} color="primary">
            Xóa luôn
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleBuy}
        >
          Mua hết
        </Button>
      </div>
    </div>
  );
}

export default Cart;
