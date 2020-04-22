import { Box, Grid, Paper, Table } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authGet, authGetImg } from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  table: {
    minWidth: "50%",
    maxWidth: "80%",
  },
}));
function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}
function ProductDetail(props) {
  const { productId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const classes = useStyles();
  const [img, setImg] = useState([]);

  useEffect(() => {
    authGet(dispatch, token, "/product/" + productId).then(
      (res) => {
        setData(res);
      },
      (error) => {
        setData([]);
      }
    );
  }, []);
  useEffect(() => {
    let alFetch = [];
    if (data.contentUrls !== undefined)
      for (const url of data.contentUrls) {
        alFetch.push(
          authGetImg(dispatch, token, url)
            .then(
              (res) => {
                return res.arrayBuffer();
              },
              (error) => {
                // setData([]);
              }
            )
            .then((data) => {
              let base64Flag = "data:image/jpeg;base64,";
              let imageStr = arrayBufferToBase64(data);
              return base64Flag + imageStr;
            })
        );
      }
    Promise.all(alFetch).then((res) => {
      setImg(res);
    });
  }, [data]);
  

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" align="left">
              Detail Product {data.productId}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="productName">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Product Name
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {data === null ? "" : data["productName"]}
                      </TableCell>
                    </TableRow>
                    <TableRow key="uom">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Uom
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {data === null ? "" : data["uom"]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={6}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="productType">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Product Type
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {data === null ? "" : data["type"]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" component="h2" align="left">
              Images
            </Typography>
            {img.map((i, index) => (
              <img key={index} src={i} width="30%" height="30%"></img>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProductDetail;
