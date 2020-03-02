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
  import Toolbar from "@material-ui/core/Toolbar";
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
    const [order, setOrder] = useState({});
    const columns = [
        {title: "Tên sản phẩm", field:"productName"},
        {title: "Số lượng", field:"quantity"},
        {title: "Uom", field:"uom"},
        {title: "Giá đơn vị", field:"uniPrice"}
    ];

    useEffect(() => {
      authGet(dispatch, token, "/orders/" + orderId).then(
        res => {
          setData(res);
          setOrder(res);
          console.log('order detail = ',order);
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
         <Card>
          <CardContent>
          <Toolbar>
            <div>
              <div>
                <div style={{padding: '0px 30px'}}>
                  <b>OrderId: </b> {order.orderId} <p/>
                  <b>Customer: </b> {order === null ? '' : order['customerName']} <p/>
                  <b>Vendor: </b> {order === null ? '' : order['vendorName']} <p/>
                  <b>Salesman: </b> {order === null ? '' : order['salesmanName']} <p/>
                  <b>Date: </b> {order === null ? '' : order['orderDate']} <p/>
                  <b>Total: </b> {order === null ? '' : order['total']}<p/>
                  
                </div>
              </div>
            </div>
          </Toolbar>

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
          </CardContent>
        </Card>
      </div>
    );
  }
  
  export default DetailOrder;
  