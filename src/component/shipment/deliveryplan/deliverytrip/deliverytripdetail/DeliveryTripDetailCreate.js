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
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {tableIcons} from "../../../../../utils/iconutil";
import MaterialTable from "material-table";
import {useParams} from "react-router";
import Grid from "@material-ui/core/Grid";


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

function orElse(a, b) {
  return a ? a : b;
}

export default function DeliveryTripDetailCreate() {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedQuantity,] = useState({});
  const [, rerender] = useState([]);

  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Số lượng sẵn có", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Địa chỉ", field: "address"},
    {
      title: "Chọn số lượng",
      field: "quantitySelection",
      render: rowData => <TextField
        id="quantity"
        // label="Số lượng"
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        inputProps={{min: "0", max: "" + rowData['quantity'], step: "1"}}
        value={orElse(selectedQuantity[rowData['shipmentItemId']], 0)}
        onChange={event => {
          selectedQuantity[rowData['shipmentItemId']] = event.target.value;
          rerender([]);
        }}
      />,
    }
  ];

  // const [shipmentItemList, setShipmentItemList] = useState([]);
  const [shipmentItemSelected, setShipmentItemSelected] = useState(null);

  // const [quantity, setQuantity] = useState(0);

  function handleShipmentItemSelectedChange(event) {
    setShipmentItemSelected(event.target.value);
  }

  const handleSubmit = () => {
    // const deliveryTripInfo = {
    //   deliveryTripId,
    //   shipmentItemId: shipmentItemSelected,
    //   deliveryQuantity: quantity
    // };
    // console.log(deliveryTripInfo);
    // authPost(dispatch, token, '/create-delivery-trip-detail', deliveryTripInfo).then(
    //   response => {
    //     console.log(response);
    //     // browserHistory.goBack();
    //     history.push(process.env.PUBLIC_URL + "/delivery-trip/" + deliveryTripId)
    //   },
    //   error => console.log(error)
    // )
  };

  const classes = useStyles();

  const {deliveryTripId} = useParams();

  const [deliveryPlanId, setDeliveryPlanId] = useState();

  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const [selectedShipmentItem, setSelectedShipmentItem] = useState([]);

  const [tripCapacityInfo, setTripCapacityInfo] = useState({});

  const [dataTable, setDataTable] = useState();

  function getDataTable() {
    authGet(
      dispatch,
      token,
      "/shipment-item/" + deliveryTripId + '/all'
    ).then(
      response => setDataTable(response)
    );
  }

  const getDeliveryTripBasicInfo = () => {
    authGet(dispatch, token, '/delivery-trip/' + deliveryTripId + '/basic-info').then(response => {
      console.log('::getDeliveryTripInfo: ', deliveryTripId);
      console.log(response);
      setDeliveryTrip({
        deliveryTripId,
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] == null ? null : response['externalVehicleType']['vehicleTypeId']
      });
      setDeliveryPlanId(response['deliveryPlan']['deliveryPlanId']);
      // authGet(dispatch, token, '/shipment-item/' + response['deliveryPlan']['deliveryPlanId'] + '/all').then(response => {
      //   setShipmentItemList(response.map(shipmentItem => shipmentItem['shipmentItemId']));
      // }).catch(console.log);
    })
  };

  function getDeliveryTripCapacityInfo() {
    let body = selectedShipmentItem.map(row => ({
      shipmentItemId: row['shipmentItemId'], quantity: orElse(selectedQuantity[row['shipmentItemId']], 0)
    }));
    authPost(dispatch, token, '/delivery-trip/' + deliveryTripId + '/capacity-info', body).then(response => {
      setTripCapacityInfo(response);
    }).catch(console.log);
  }

  useEffect(() => {
    getDeliveryTripBasicInfo();
    getDataTable();
    getDeliveryTripCapacityInfo();
  }, []);

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới chi tiết chuyến giao hàng
          </Typography>
          <Toolbar>
            <Grid container spacing={3}>
              <Grid item xs={7} style={{textAlign: 'left', padding: '30px 30px 20px 10px'}}>
                <div>
                  <b>Mã chuyến hàng: </b> {deliveryTripId} <p/>
                  <b>Mã đợt giao hàng: </b> {deliveryTrip === null ? '' : deliveryTrip['deliveryPlanId']} <p/>
                  <b>Ngày tạo: </b> {deliveryTrip === null ? '' : deliveryTrip['executeDate']} <p/>
                  <b>Xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleId']}<p/>
                  <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}
                </div>
              </Grid>

              <Grid item xs={5}
                    style={{verticalAlign: 'text-bottom', textAlign: 'left', padding: '30px 30px 20px 30px'}}>
                <div>
                  <b>Tổng khoảng cách: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalDistance']} <p/>
                  <b>Tổng khối lượng: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalWeight']} <p/>
                  <b>Tổng số pallet: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalPallet']} <p/>
                </div>
              </Grid>
            </Grid>
          </Toolbar>
          {/*<form className={classes.root} noValidate autoComplete="off">*/}
          {/*  <InputLabel>Chọn đơn hàng</InputLabel>*/}
          {/*  <Select*/}
          {/*    value={shipmentItemSelected}*/}
          {/*    onChange={handleShipmentItemSelectedChange}*/}
          {/*  >*/}
          {/*    {*/}
          {/*      shipmentItemList.map(shipmentItem => <MenuItem value={shipmentItem}>{shipmentItem}</MenuItem>)*/}
          {/*    }*/}
          {/*  </Select><p/>*/}
          {/*  <TextField*/}
          {/*    label="Số lượng"*/}
          {/*    type="number"*/}
          {/*    value={quantity}*/}
          {/*    onChange={event => setQuantity(event.target.value)}*/}
          {/*  />*/}
          {/*</form>*/}

          <MaterialTable
            title={'Chọn đơn hàng vào chuyến'}
            columns={columns}
            options={{search: false, selection: true}}
            data={dataTable}
            icons={tableIcons}
          >
          </MaterialTable>
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