import React, {useEffect, useState} from "react";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {authGet, authPost} from "../../../../../api";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";


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

export default function DeliveryTripDetailCreate() {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [shipmentItemList, setShipmentItemList] = useState([]);
  const [shipmentItemSelected, setShipmentItemSelected] = useState(null);
  const [quantity, setQuantity] = useState(0);

  function handleShipmentItemSelectedChange(event) {
    setShipmentItemSelected(event.target.value);
  }

  const handleSubmit = () => {
    const deliveryTripInfo = {
      deliveryTripId,
      shipmentItemId: shipmentItemSelected,
      deliveryQuantity: quantity
    };
    console.log(deliveryTripInfo);
    authPost(dispatch, token, '/create-delivery-trip-detail', deliveryTripInfo).then(
      response => {
        console.log(response);
        // browserHistory.goBack();
        history.push(process.env.PUBLIC_URL + "/delivery-trip/" + deliveryTripId)
      },
      error => console.log(error)
    )
  };

  const classes = useStyles();

  const [deliveryTripId, setDeliveryTripId] = useState('');
  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const getDeliveryTripInfo = () => {
    let url = window.location.href;
    let deliveryTripId = url.substring(url.lastIndexOf('/') + 1);
    setDeliveryTripId(deliveryTripId);


    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId).then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      setDeliveryTrip({
        deliveryTripId,
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] == null ? null : response['externalVehicleType']['vehicleTypeId']
      });
      authGet(dispatch, token, '/shipment-item/' + response['deliveryPlan']['deliveryPlanId']).then(response => {
        setShipmentItemList(response);
      }).catch(console.log);
    })
  };

  useEffect(() => getDeliveryTripInfo(), []);

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới chuyến giao hàng
          </Typography>
          <Toolbar>
            <div>
              <div>
                <div style={{padding: '0px 30px'}}>
                  <b>Mã đợt chuyến hàng: </b> {deliveryTripId} <p/>
                  <b>Mã đợt giao hàng: </b> {deliveryTrip === null ? '' : deliveryTrip['deliveryPlanId']} <p/>
                  <b>Ngày tạo: </b> {deliveryTrip === null ? '' : deliveryTrip['executeDate']} <p/>
                  <b>Xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleId']}<p/>
                  <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}
                </div>
              </div>
            </div>
          </Toolbar>
          <form className={classes.root} noValidate autoComplete="off">
            <InputLabel>Chọn đơn hàng</InputLabel>
            <Select
              value={shipmentItemSelected}
              onChange={handleShipmentItemSelectedChange}
            >
              {
                shipmentItemList.map(shipmentItem => <MenuItem value={shipmentItem}>{shipmentItem}</MenuItem>)
              }
            </Select><p/>
            <TextField
              label="Số lượng"
              type="number"
              value={quantity}
              onChange={event => setQuantity(event.target.value)}
            />
          </form>
        </CardContent>
        <CardActions>
          <Button color={'primary'} variant={'contained'} startIcon={<CloudUploadIcon/>} onClick={handleSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  </div>
}