import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MaterialTable from "material-table";
import { failed } from "../../action/Auth";
import { authGet } from "../../api";
import React, { useEffect, useState } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

import { useHistory } from "react-router-dom";
import { authPost } from "../../api";

import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
function UserCreate(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();
  const [salesman, setSalesman] = useState();
  const [customer, setCustomer] = useState();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState();
  const [salesmans, setSalesmans] = useState([]);
  const [distributor, setDistributor] = useState();
  const [distributors, setDistributors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderDate, setOrderDate] = useState(new Date());
  const [orderItems, setOrderItems] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const classes = useStyles();

  const handleCustomerChange = event => {
    setCustomer(event.target.value);
  };
  const handleSalesmanChange = event => {
    setSalesman(event.target.value);
  };
  const handleOrderDateChange = event => {
    setOrderDate(event.target.value);
  };

  const handleProductChange = event => {
    setProduct(event.target.value);
  };
  const handleQuantityChange = event => {
    setQuantity(event.target.value);
  };
 
  
  const handleCancel = () => {
    //alert('Hủy');
  }
  const handleAddProduct = () => {
    //alert('Thêm Sản Phẩm');
    // add (product, quantity) to products
    //setProducts(products.push({productId:product, quantity:quantity}));
    //products.push({productId:product, quantity:quantity});
    //console.log(products);
    let newArray=[...orderItems];
    newArray.push({"productId":product, "quantity":quantity});
    setOrderItems(newArray);
  }

  const inputProd = {"statusId":null};
  useEffect(() => {
    authPost(dispatch, token, "/get-list-product",inputProd )
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(res => {
        console.log('got products',res);
        setProducts(res.products);
        console.log(products); 
      });
  }, []);
  
  useEffect(() => {
    authPost(dispatch, token, "/get-distributors-of-userlogin",{"statusId":null} )
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(res => {
        console.log('got distributors',res);
        setDistributors(res);
        console.log(distributors); 
      });
  }, []);
  
  useEffect(() => {
    authPost(dispatch, token, "/get-list-salesmans",{"statusId":null} )
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(res => {
        console.log('got distributors',res);
        setSalesmans(res);
        console.log(salesmans); 
      });
  }, []);

  const handleSubmit = () => {
    const data = {
      orderDate: orderDate,
      salesmanId: salesman,
      toCustomerId: customer,
      orderItems: orderItems
    };
    console.log("submit order, data = ",data);

    setIsRequesting(true);
    authPost(dispatch, token, "/create-order-distributor-to-retailoutlet", data)
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 409) {
            alert("User exits!!");
          } else if (res.status === 201) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(res => {
        history.push("/orders/list");
      });
  };

  

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Create Order
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
                           
            <TextField
                id="select-customer"
                select
                label="Select"
                value={customer}
                onChange={handleCustomerChange}
                helperText="Select customer"
              >
                 {distributors.map(distributor => (
                      <MenuItem
                        key={distributor.partyId}
                        value={distributor.partyId}
                      >
                        {distributor.customerName}
                      </MenuItem>
                    ))}
              </TextField>

              <TextField
                id="select-salesman"
                select
                label="Select"
                value={salesman}
                onChange={handleSalesmanChange}
                helperText="Select salesman"
              >
                {salesmans.map(sm => (
                      <MenuItem
                        key={sm.userLoginId}
                        value={sm.userLoginId}
                      >
                        {sm.partySalesman.person.lastName + ' ' + sm.partySalesman.person.middleName + ' ' + sm.partySalesman.person.firstName}
                      </MenuItem>
                    ))}
              </TextField>


              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={orderDate}
                onChange={handleOrderDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </div>

            <div>
            <Card>  
            <CardContent>  
            <TextField
                id="select-product"
                select
                label="Select"
                value={product}
                onChange={handleProductChange}
                helperText="Select product"
              >
               
                
                {products.map(product => (
                      <MenuItem
                        key={product.productId}

                        value={product.productId}
                      >
                        {product.productName}
                      </MenuItem>
                    ))}

            </TextField>

            <TextField
                id="quantity"
                label="Số lượng"
                value={quantity}
                onChange={handleQuantityChange}
            />  
            </CardContent>
            <CardActions>
            <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            >
            Thêm SP   
            </Button>
            </CardActions>

            <MaterialTable
             title="Danh sách sản phẩm"
          columns={[
            { title: 'Tên SP', field: 'productId' },
            { title: 'Số lượng', field: 'quantity' }
            
          ]}
          data={orderItems}
         
            />
            </Card>
            </div>





          </form>
        </CardContent>
        <CardActions>
          <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {isRequesting ? <CircularProgress /> : "Lưu"}
          </Button>
          <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleCancel}
          >
            {isRequesting ? <CircularProgress /> : "Hủy"}
          </Button>

        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  );
}

export default UserCreate;
