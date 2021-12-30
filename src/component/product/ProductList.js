import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authGet } from "../../api";

function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  console.log("binary", window.btoa(binary));

  return window.btoa(binary);
}

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    // maxHeight: 345,
  },
  title: {
    fontWeight: 600,
    fontSize: "30px",
    textAlign: "center",
    marginBottom: "24px",
  },
  gridItem: {
    marginBottom: "12px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
    width: "128px",
    height: "128px",
  },
}));

const sampleAvatar =
  "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80";

function ProductList(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(16);
  const [totalElements, setTotalElements] = useState();

  useEffect(() => {
    authGet(
      dispatch,
      token,
      "/get-list-product-with-define-page?size=" + pageSize + "&page=" + page
    ).then((response) => {
      setProductList(response.products);
      setTotalElements(response.totalElements);
    });
  }, [page, pageSize]);

  return (
    <div>
      <h1 className={classes.title}>Tất cả sản phẩm</h1>
      <Grid container spacing={4}>
        {productList.map((p) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            className={classes.gridItem}
            key={p.productId}
          >
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={
                    p.avatar
                      ? `data:image/jpeg;base64,${p.avatar}`
                      : sampleAvatar
                  }
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              <CardHeader
                title={p.productName}
                subheader={`Ngày thêm: ${p.createdStamp.slice(0, 10)}`}
              />
              <CardContent>
                <Typography variant="body1">{p.description}</Typography>
                {p.weight && (
                  <Typography>{p.weight + " " + p.uomDescription}</Typography>
                )}
                <Link to={"/products/" + p.productId}>Admin view</Link>
                <br />
                <Link to={"/products/user-view/" + p.productId}>User view</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <br></br>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onChangePage={(e, p) => setPage(p)}
        rowsPerPage={pageSize}
        onChangeRowsPerPage={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[4, 16, 32, 64]}
      />

      {/*<Grid container spacing={12}>*/}
      {/*  <Grid item xs={3}>*/}

      {/*  </Grid>*/}
      {/*  <Grid item xs={1.5}>*/}

      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      color="primary"*/}
      {/*      onClick={handleFirstPageButton}*/}
      {/*    >*/}
      {/*      <FirstPageIcon></FirstPageIcon>*/}
      {/*    </Button>*/}

      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      color="primary"*/}
      {/*      onClick={handleNavigateBeforeButton}*/}
      {/*    >*/}
      {/*      <NavigateBeforeIcon></NavigateBeforeIcon>*/}
      {/*    </Button>*/}

      {/*  </Grid>*/}

      {/*  <Grid item xs={1}>*/}
      {/*    <Typography variant="h5">*/}
      {/*      {" "}page {page + 1} of {totalPage + 1}*/}
      {/*    </Typography>*/}

      {/*  </Grid>*/}

      {/*  <Grid item xs={1.5}>*/}

      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      color="primary"*/}
      {/*      onClick={handleNavigateNextButton}*/}
      {/*    >*/}
      {/*      <NavigateNextIcon></NavigateNextIcon>*/}

      {/*    </Button>*/}

      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      color="primary"*/}
      {/*      onClick={handleLastPageButton}*/}
      {/*    >*/}
      {/*      <LastPageIcon></LastPageIcon>*/}

      {/*    </Button>*/}

      {/*  </Grid>*/}
      {/*  <Grid item xs={1}>*/}
      {/*    <Typography variant="h5">*/}
      {/*      {" "}page size*/}
      {/*    </Typography>*/}
      {/*  </Grid>*/}

      {/*  <Grid item xs={1}>*/}
      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      color="#f0f8ff"*/}
      {/*    >*/}
      {/*      <TextField*/}
      {/*        value={pageSize}*/}
      {/*        onChange={handlePageSizeChange}*/}
      {/*        select*/}
      {/*      >*/}
      {/*        {listPageSize.map(p => (*/}
      {/*          <MenuItem value={p} key={p}>*/}
      {/*            {p}*/}
      {/*          </MenuItem>*/}
      {/*        ))}*/}

      {/*      </TextField>*/}

      {/*    </Button>*/}

      {/*  </Grid>*/}

      {/*</Grid>*/}
    </div>

    // <div>
    //   <MaterialTable
    //     title="List product"
    //     columns={columns}
    //     options={{
    //       search: false,
    //     }}
    //     data={(query) =>
    //       new Promise((resolve, reject) => {
    //         console.log(query);
    //         let sortParam = "";
    //         if (query.orderBy !== undefined) {
    //           sortParam =
    //             "&sort=" + query.orderBy.field + "," + query.orderDirection;
    //         }
    //         let filterParam = "";
    //         if (query.filters.length > 0) {
    //           let filter = query.filters;
    //           filter.forEach((v) => {
    //             filterParam = v.column.field + "=" + v.value + "&";
    //           });
    //           filterParam =
    //             "&" + filterParam.substring(0, filterParam.length - 1);
    //         }

    //         authGet(
    //           dispatch,
    //           token,
    //           "/get-list-product-frontend" +
    //             "?size=" +
    //             query.pageSize +
    //             "&page=" +
    //             query.page +
    //             sortParam +
    //             filterParam
    //         ).then(
    //           (res) => {
    //             resolve({
    //               data: res.content,
    //               page: res.number,
    //               totalCount: res.totalElements,
    //             });
    //             console.log("res", res.content);
    //             doc.setFont("courier", "italic");

    //             doc.autoTable({
    //               head: [["Id", "Name", "Type", "Uom"]],
    //               body: res.content.map((p) => [
    //                 p.productId,
    //                 p.productName,
    //                 p.productTypeDescription,
    //                 p.uomDescription,
    //               ]),
    //             });
    //           },
    //           (error) => {
    //             console.log("error");
    //           }
    //         );
    //       })
    //     }
    //     icons={tableIcons}
    //     onRowClick={(event, rowData) => {
    //       console.log("select ", rowData);<img key={index} src={i} width="30%" height="30%"/>
    //     }}
    //   />
    //   <button onClick={handleSubmit}>generatepdf</button> */}
    // </div>
  );
}

export default ProductList;
