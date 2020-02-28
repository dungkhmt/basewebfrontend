import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    CircularProgress
  } from "@material-ui/core";
  import Card from "@material-ui/core/Card";
  import CardContent from "@material-ui/core/CardContent";
  import { makeStyles } from "@material-ui/core/styles";
  import TextField from "@material-ui/core/TextField";
  import Typography from "@material-ui/core/Typography";
  import DeleteIcon from "@material-ui/icons/Delete";
  import EditIcon from "@material-ui/icons/Edit";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams, useHistory } from "react-router-dom";
  import { authGet, authDelete } from "../../api";
  import MaterialTable from "material-table";
  import { tableIcons } from "../../utils/iconutil";

  const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(4),
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200
      }
    }
  }));
  function DetailOrder(props) {
    
    const { orderId } = useParams();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [orderItems, setOrderItems] = useState([]);  
    const columns = [
        {title: "Product", field:"product.productName"},
        {title: "QTY", field:"quantity"},
        {title: "Uom", field:"product.uom.description"}
    ];

    useEffect(() => {
      authGet(dispatch, token, "/orders/" + orderId).then(
        res => {
          setData(res);
          console.log(res);
          setOrderItems(res.orderItems);
          console.log('order-items = ',orderItems);      
          console.log(res.orderItems);    
        },
        error => {
          setData([]);
        }
      );
    }, []);
    
  
    
    return (
      <div>
        
        <MaterialTable
        title="OrderItems"
        columns={columns}
        options={{
          filtering: true,
          search: false
        }}
        data={orderItems}
        icons={tableIcons}
        onRowClick={(event, rowData) => {
          console.log("select ",rowData);
        }}
      />

      </div>
    );
  }
  
  export default DetailOrder;
  