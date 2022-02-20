import { Grid, Paper, Table, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authGet, authPut } from "../../api";
import TableRowProductInfo from "./TableRowProductInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginBottom: "12px",
  },
  paper: {
    padding: theme.spacing(2),
  },
  // gridContainer: {
  //   margin: "18px 0px",
  // },
  table: {
    // minWidth: "50%",
    // maxWidth: "80%",
  },
  buttonWrapper: {
    width: "100%",
    textAlign: "right",
  },
  button: {
    marginTop: "6px",
    marginBottom: "36px",
  },
}));

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}

const priceColumns = [
  { title: "Từ ngày", field: "fromDate" },
  { title: "Đến ngày", field: "thruDate" },
  { title: "Giá", field: "price" },
];

const saleColumns = [
  { title: "Tên", field: "promoName" },
  { title: "Từ ngày", field: "fromDate" },
  { title: "Đến ngày", field: "thruDate" },
  { title: "Phần trăm giảm", field: "promoPercentageDiscount" },
];

function ProductDetail(props) {
  const history = useHistory();
  const { productId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const classes = useStyles();
  // const [img, setImg] = useState([]);
  const [shouldForceUpdate, setShouldForceUpdate] = useState(false);

  const [priceList, setPriceList] = useState([]);
  const [info, setInfo] = useState({
    weight: 0,
    description: "",
  });
  const { weight, description } = info;

  useEffect(() => {
    authGet(dispatch, token, "/product/" + productId).then(
      (res) => {
        setData(res);
        setInfo((prev) => ({
          ...prev,
          weight: res.weight,
          description: res.description,
        }));
      },
      (error) => {
        setData([]);
      }
    );
    authGet(dispatch, token, "/get-product-price-history/" + productId).then(
      (r) => setPriceList(r)
    );
  }, [shouldForceUpdate]);

  const handleSetProductInfoValue = (e) => {
    setInfo((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProductInfo = async () => {
    try {
      await authPut(dispatch, token, `/update-product/${productId}`, info);
      toast.success("Update product successfully");
      setShouldForceUpdate(!shouldForceUpdate);
    } catch (error) {
      console.error("failed to update product: ", error);
    }
  };

  // useEffect(() => {
  //   let alFetch = [];
  //   if (typeof data.contentUrls !== "undefined") {
  //     for (const url of data.contentUrls) {
  //       alFetch.push(
  //         authGetImg(dispatch, token, url)
  //           .then(
  //             (res) => {
  //               return res.arrayBuffer();
  //             },
  //             (error) => {
  //               // setData([]);
  //             }
  //           )
  //           .then((data) => {
  //             let base64Flag = "data:image/jpeg;base64,";
  //             let imageStr = arrayBufferToBase64(data);
  //             return base64Flag + imageStr;
  //           })
  //       );
  //     }
  //   }
  //   Promise.all(alFetch).then((res) => {
  //     setImg(res);
  //   });
  // }, [data]);

  return (
    <>
      <Typography
        variant="h3"
        component="h1"
        align="left"
        className={classes.title}
      >
        Chi tiết sản phẩm mã {data.productId}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRowProductInfo
                      keyInfo="productName"
                      data={data === null ? "" : data["productName"]}
                      label="Tên"
                    />
                    <TableRowProductInfo
                      keyInfo="productType"
                      data={data === null ? "" : data["type"]}
                      label="Thể loại"
                    />
                    <TableRowProductInfo
                      keyInfo="amount"
                      data={info.weight}
                      label="Số lượng"
                    />
                    <TableRowProductInfo
                      keyInfo="uom"
                      data={data.uom === null ? "" : data["uom"]}
                      label="Đơn vị"
                    />
                    <TableRowProductInfo
                      keyInfo="description"
                      data={
                        info.description === "" ? "Chưa có" : info.description
                      }
                      label="Miêu tả"
                    />
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Typography variant="h6" component="h1" align="left">
              Ảnh đại diện sản phẩm
            </Typography>
            <Grid container>
              {data.avatar ? (
                <img
                  src={`data:image/jpeg;base64,${data.avatar}`}
                  width="50%"
                  height="50%"
                  alt="product"
                />
              ) : (
                <Typography variant="h6" component="h6">
                  Sản phẩm chưa có ảnh hiển thị
                </Typography>
              )}
            </Grid>
          </Paper>
        </Grid>
        <div className={classes.buttonWrapper}>
          <Link
            to={{
              pathname: "/product-group/set-product-primary-img/" + productId,
              state: { data },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Thay đổi ảnh đại diện sản phẩm
            </Button>
          </Link>
        </div>

        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Typography variant="h6" component="h1" align="left">
              Ảnh kèm theo mô tả sản phẩm
            </Typography>
            <Grid
              container
              spacing={
                data.attachmentImages && data.attachmentImages.length > 0
                  ? 4
                  : 0
              }
            >
              {data.attachmentImages && data.attachmentImages.length > 0 ? (
                data.attachmentImages.map((i, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <img
                      src={`data:image/jpeg;base64,${i}`}
                      width="90%"
                      alt="product"
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" component="h6">
                  Sản phẩm chưa có ảnh hiển thị
                </Typography>
              )}
            </Grid>
          </Paper>
        </Grid>
        <div className={classes.buttonWrapper}>
          <Link
            to={{
              pathname: "/product-group/product-add-img/" + productId,
              state: { data },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Thêm ảnh mô tả cho sản phẩm
            </Button>
          </Link>
        </div>

        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Typography variant="h6" component="h1" align="left">
              Cập nhật thông tin khác
            </Typography>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" component="h3" align="left">
                  Số lượng
                </Typography>
                <TextField
                  type="number"
                  name="weight"
                  value={weight}
                  onChange={handleSetProductInfoValue}
                  helperText="Số lượng"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" component="h3" align="left">
                  Mô tả sản phẩm
                </Typography>
                <TextField
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleSetProductInfoValue}
                  helperText="Mô tả"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <div className={classes.buttonWrapper}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleUpdateProductInfo}
          >
            Cập nhật
          </Button>
        </div>

        <Grid item xs={12} className={classes.gridContainer}>
          <MaterialTable
            title={"Chi tiết giá"}
            columns={priceColumns}
            data={priceList}
            options={{ search: false }}
          />
          <div className={classes.buttonWrapper}>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                history.push("/product-group/create-product-price/" + productId)
              }
              className={classes.button}
            >
              Thiết lập giá
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} className={classes.gridContainer}>
          {data.productPromoModels && data.productPromoModels.length > 0 ? (
            <>
              <MaterialTable
                title={"Chi tiết Sale"}
                columns={saleColumns}
                data={data.productPromoModels}
                options={{ search: false }}
              />
              <div className={classes.buttonWrapper}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    history.push(
                      "/product-group/create-product-price/" + productId
                    )
                  }
                  className={classes.button}
                >
                  Tạo chương trình Sale
                </Button>
              </div>
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
}

export default ProductDetail;
