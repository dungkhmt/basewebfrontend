import jsPDF from "jspdf";
import "jspdf-autotable";
import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authGet, authGetImg } from "../../api";
import { tableIcons } from "../../utils/iconutil";
import {Box, Grid, Paper, Table} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Container } from '@material-ui/core/Container';


function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  console.log("binary", window.btoa(binary));

  return window.btoa(binary);
}


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));



function ProductList(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [productList, setProductList] =  useState([]);
  const [page, setPage] =  useState(new Number(0));
  const [listPageSize, setListPageSize] =  useState([10,20,30]);
  const [pageSize, setPageSize] =  useState(new Number(10));
  const [listImg, setListImg] =  useState([]);
  const classes = useStyles();

  useEffect(() => {
    authGet(
      dispatch,
      token,
      "/get-list-product-with-define-page" + "?size=" + pageSize + "&page="+page)
      .then(
        (res) => {

          setProductList(res.content);
          console.log("productList",res.content);
        }
      )
  },[]);


  // useEffect(() => {
  //   let alFetch = [];
  //   for(const p of productList){

  //     if(p.avatarUrl !== undefined){
  //       alFetch.push(
  //         authGetImg(dispatch, token, p.avatarUrl).then(
  //           (res) => {
  //             console.log("resaaaa ", res);
  //             //console.log("res.arrayBuffer() ", res.arrayBuffer());
  //             return res.arrayBuffer();
  //           },
  //           (error) =>{
  //             console.log(error);
  //           }

  //         ).then((p) =>{
  //           console.log("p ", p);
  //           let base64Flag = "data:image/jpeg;base64,";
  //           let imageStr = arrayBufferToBase64(p);
  //           return base64Flag + imageStr;
  //         })
  //       );



  //     }


  //   }
  //   Promise.all(alFetch).then(
  //     (res) => {
  //       console.log("image", res)
  //       setListImg(res);

  //     }
  //   )
  // },[productList])



  // const doc = new jsPDF({
  //   unit: "pt",
  //   orientation: "p",
  //   //lineHeight: 1.2
  // });



  // const columns = [
  //   {
  //     field: "productId",
  //     title: "Id",
  //     render: (rowData) => (
  //       <Link to={"/product/" + rowData.productId}>{rowData.productId}</Link>
  //     ),
  //   },
  //   { field: "productName", title: "Name" },
  //   { field: "productTypeDescription", title: "Type" },
  //   { field: "uomDescription", title: "Uom" },
  // ];

  // const handleSubmit = () => {
  //   doc.save("products.pdf");
  // };

  return (

    <div>


      <Grid container spacing={12}>
        {productList.map((p) => (
          <Grid item xs={3}>
            <Card className={classes.root}>
              <Link to={"/product/" + p.productId}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      R
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
                <img  src={p.avatar} width="100%" height="100%"/>
              </Link>





              <CardContent>
                <Typography>
                  {p.weight + " " + p.uomDescription}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

      </Grid>









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
