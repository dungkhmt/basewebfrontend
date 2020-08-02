import React, {useEffect, useState} from "react";
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
import {selectValueByIdName, textField, textFieldNumberFormat} from "../../../utils/FormUtils";


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

  const [orderId, setOrderId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pallet, setPallet] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productList, setProductList] = useState([]);

  async function getProductList() {
    let response = await authPost(dispatch, token, '/get-list-product', {}).then(r => r.json());
    setProductList(response['products']);
    setSelectedProduct(response['products'][0]);
    setWeight(response['products'][0]['weight'] * quantity);
  }

  const [weight, setWeight] = useState(0);

  const [selectedUom, setSelectedUom] = useState(null);
  const [uomList, setUomList] = useState([]);

  async function getUomList() {
    let response = await authPost(dispatch, token, '/get-list-uoms', {statusId: ''}).then(r => r.json());
    setUomList(response['uoms']);
    setSelectedUom(response['uoms'][0]);
  }

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerList, setCustomerList] = useState([]);

  async function getCustomerList() {
    let response = await authPost(dispatch, token, '/get-list-customer', {}).then(r => r.json());
    setCustomerList(response['lists']);
    setSelectedCustomer(response['lists'][0]);
    let location = response['lists'][0]['postalAddress'][0];
    setLocationCode(location['locationCode']);
    setAddress(location['address']);
  }

  const [locationCode, setLocationCode] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    const shipmentItemInfo = {
      orderId,
      quantity,
      pallet,
      productId: selectedProduct['productId'],
      productName: selectedProduct['productName'],
      weight,
      uom: selectedUom['uomId'],
      customerCode: selectedCustomer['customerCode'],
      customerName: selectedCustomer['customerName'],
      locationCode,
      address,
      facilityId: selectedFacility['facilityId']
    };
    authPost(dispatch, token, '/create-shipment-item', shipmentItemInfo).then(
      response => {
        console.log(response);
        history.push(process.env.PUBLIC_URL + "/shipment-group/shipment")
      },
      error => {
        alert('Upload failed: ' + error);
        console.log(error);
      }
    )
  };

  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityList, setFacilityList] = useState([]);

  function getFacilityList() {
    authPost(dispatch, token, '/get-list-facility', {}).then(r => r.json()).then(response => {
      let facilities = response['facilities'];
      setFacilityList(facilities);
      setSelectedFacility(facilities[0]);
    });
  }

  useEffect(() => {
    (async () => {
      getFacilityList();
      getCustomerList().then(r => r);
      getProductList().then(r => r);
      getUomList().then(r => r);
    })();
  }, []);

  const classes = useStyles();

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới đơn hàng vận chuyển
          </Typography>

          <p/>

          {textField("orderId", "Mã đơn hàng", "search", orderId, setOrderId)}
          {textFieldNumberFormat("quantity", "Số lượng", quantity, newValue => {
            if (newValue > 0) {
              setQuantity(newValue);
              setWeight(selectedProduct['weight'] * newValue);
            }
          })}
          {textFieldNumberFormat("pallet", "Số lượng pallet", pallet, newValue => {
            if (newValue >= 0) {
              setPallet(newValue);
            }
          })}

          {selectValueByIdName('Chọn sản phẩm',
            productList,
            'productId',
            'productName',
            selectedProduct,
            newProduct => {
              setSelectedProduct(newProduct);
              setWeight(newProduct['weight'] * quantity);
            })}

          {textField("weight", "Khối lượng (kg)", undefined, weight, undefined, true)}

          {selectValueByIdName('Chọn đơn vị sản phẩm', uomList, 'uomId', 'uomId', selectedUom, setSelectedUom)}


          {selectValueByIdName('Chọn khách hàng',
            customerList,
            'partyId',
            'customerName',
            selectedCustomer,
            newCustomer => {
              setSelectedCustomer(newCustomer);
              let location = newCustomer['postalAddress'][0];
              setLocationCode(location['locationCode']);
              setAddress(location['address']);
            })}

          {textField("locationCode", "Mã địa điểm", undefined, locationCode, undefined, true)}
          {textField("address", "Địa chỉ", undefined, address, undefined, true)}

          {selectValueByIdName('Chọn kho',
            facilityList,
            'facilityId',
            'facilityName',
            selectedFacility,
            setSelectedFacility)}

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
