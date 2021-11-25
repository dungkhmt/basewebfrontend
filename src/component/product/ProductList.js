import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
    maxWidth: 345,
    maxHeight: 345,
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

function ProductList(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  // const [listPageSize, setListPageSize] = useState([4, 8, 12]);
  const [pageSize, setPageSize] = useState(16);
  // const [listImg, setListImg] = useState([]);
  const classes = useStyles();
  // const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState();
  // const [change, setChange] = useState(false);

  useEffect(() => {
    authGet(
      dispatch,
      token,
      "/get-list-product-with-define-page?size=" + pageSize + "&page=" + page
    ).then((response) => {
      setProductList(response.products);
      setTotalElements(response.totalElements);

      // if (res.totalElements % pageSize !== 0) {
      // setTotalPage(Math.floor(res.totalElements / pageSize));
      // } else {
      // setTotalPage(Math.floor(res.totalElements / pageSize - 1));
      // }
    });
  }, [page, pageSize]);

  // const handlePageSizeChange = event => {
  //   if ("" + (event.target.value - pageSize) !== "0") {
  //     setPageSize(event.target.value);
  //     setPage(0);
  //   }
  // }
  //
  // const handleNavigateBeforeButton = () => {
  //   if (page > 0) {
  //     setPage(page - 1);
  //   }
  // }
  //
  // const handleNavigateNextButton = () => {
  //   if (page < totalPage) {
  //     setPage(page + 1);
  //   }
  // }
  //
  // const handleFirstPageButton = () => {
  //   setPage(0);
  // }
  //
  // const handleLastPageButton = () => {
  //   setPage(totalPage);
  // }

  return (
    <div>
      <h1 className={classes.title}>Tất cả sản phẩm</h1>
      <Grid container spacing={12}>
        {productList.map((p) => (
          <Grid item xs={12} md={6} lg={4} className={classes.gridItem}>
            <Card className={classes.root}>
              <Link to={"/products/" + p.productId}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      className={classes.avatar}
                      src={p.avatar ? `data:image/jpeg;base64,${p.avatar}` : ""}
                      alt="product avatar"
                    >
                      {/*R*/}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={p.productName}
                  subheader={p.createdStamp}
                />
                {/* <img src={p.avatar} width="100%" height="100%" /> */}
              </Link>
              <CardContent>
                <Typography>{p.weight + " " + p.uomDescription}</Typography>
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
