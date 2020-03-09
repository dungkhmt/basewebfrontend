import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {authPost} from "../../../api";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 400
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

export default function ShipmentItemCreate() {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [quantity, setQuantity] = useState(0);
  const [pallet, setPallet] = useState(0);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);
  const [weight, setWeight] = useState(null);
  const [uom, setUom] = useState(null);
  const [customerCode, setCustomerCode] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [locationCode, setLocationCode] = useState(null);
  const [address, setAddress] = useState(null);

  const handleSubmit = () => {
    const shipmentItemInfo = {
      quantity, pallet, productId, productName, weight, uom, customerCode, customerName, locationCode, address
    };
    console.log(shipmentItemInfo);
    authPost(dispatch, token, '/create-shipment-item', shipmentItemInfo).then(
      response => {
        console.log(response);
        history.push(process.env.PUBLIC_URL + "/shipment")
      },
      error => {
        alert('Upload failed: ' + error);
        console.log(error);
      }
    )
  };

  const classes = useStyles();

  function textField(id, label, type, onChange) {
    return <TextField id={id}
                      label={label}
                      type={type}
                      onChange={event => onChange(event.target.value)}/>;
  }

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới đơn hàng
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            {textField("quantity", "Số lượng", "number", setQuantity)}
            {textField("pallet", "Số lượng pallet", "number", setPallet)}
            {textField("productId", "Mã sản phẩm", "search", setProductId)}
            {textField("productName", "Tên sản phẩm", "search", setProductName)}
            {textField("weight", "Khối lượng", "number", setWeight)}
            {textField("uom", "Uom", "search", setUom)}
            {textField("customerCode", "Mã khách hàng", "search", setCustomerCode)}
            {textField("customerName", "Tên khách hàng", "search", setCustomerName)}
            {textField("locationCode", "Mã địa điểm", "search", setLocationCode)}
            {textField("address", "Địa chỉ", "search", setAddress)}
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" startIcon={<CloudUploadIcon/>} onClick={handleSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  </div>
}