import { Box, Grid, Paper, Table } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useParams } from "react-router-dom";
import { authGet } from "../../api";

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
  gridContainer: {
    marginBottom: "36px",
  },
  table: {
    // minWidth: "50%",
    // maxWidth: "80%",
  },
  buttonWrapper: {
    width: "100%",
    textAlign: "right",
  },
  button: {
    marginBottom: "6px",
  },
}));

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}

function ProductDetail(props) {
  const history = useHistory();
  const { productId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const classes = useStyles();
  // const [img, setImg] = useState([]);

  const [priceList, setPriceList] = useState([]);
  const priceColumns = [
    { title: "Từ ngày", field: "fromDate" },
    { title: "Đến ngày", field: "thruDate" },
    { title: "Giá", field: "price" },
  ];

  useEffect(() => {
    authGet(dispatch, token, "/product/" + productId).then(
      (res) => {
        setData(res);
      },
      (error) => {
        setData([]);
      }
    );
    authGet(dispatch, token, "/get-product-price-history/" + productId).then(
      (r) => setPriceList(r)
    );
  }, []);

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
        Chi tiết sản phẩm có mã {data.productId}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="productName">
                      <TableCell align="left">
                        <Box fontWeight="fontWeightBold" m={1} fontSize={20}>
                          Tên sản phẩm
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" component="h4">
                          {data === null ? "" : data["productName"]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow key="uom">
                      <TableCell align="left">
                        <Box fontWeight="fontWeightBold" m={1} fontSize={20}>
                          Đơn vị
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" component="h4">
                          {data === null ? "" : data["uom"]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow key="productType">
                      <TableCell align="left">
                        <Box fontWeight="fontWeightBold" m={1} fontSize={20}>
                          Loại sản phẩm
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" component="h4">
                          {data === null ? "" : data["type"]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              {/* <Grid item xs={12}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="productType">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1} fontSize={20}>
                          Loại sản phẩm
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6" component="h6">
                          {data === null ? "" : data["type"]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid> */}
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
              Ảnh kèm theo mô tả sản phẩm
            </Typography>
            <Grid container spacing={4}>
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

        <Grid item xs={12} className={classes.gridContainer}>
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
          <MaterialTable
            title={"Chi tiết giá"}
            columns={priceColumns}
            data={priceList}
            options={{ search: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ProductDetail;
