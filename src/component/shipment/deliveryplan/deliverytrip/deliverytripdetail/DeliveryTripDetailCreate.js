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
import {Link, useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {tableIcons} from "../../../../../utils/iconutil";
import MaterialTable from "material-table";
import {useParams} from "react-router";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {NumberFormatCustom} from "../../../../../utils/NumberFormatTextField";
import AlertDialog from "../../../../../utils/AlertDialog";


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
  const [, rerender] = useState([]);

  /*
   * BEGIN: Alert Dialog
   */
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertCallback, setAlertCallback] = useState({});

  function showAlert(title = '', message = '', callback = {}) {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertCallback(callback);
    setOpenAlert(true);
  }

  /*
   * END: Alert Dialog
   */

  const columns = [
    {title: "Mã đơn hàng", field: "shipmentItemId"},
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Số lượng sẵn có", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Địa chỉ", field: "address"},
    {title: "Tọa độ", field: "latLng"},
    {
      title: "Chọn số lượng",
      field: "quantitySelection",
      render: rowData => <TextField
        id="quantity"
        // label="Số lượng"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        inputProps={selectedIdSet.has(rowData['shipmentItemId']) ? {
          min: "1",
          max: "" + rowData['quantity'],
          step: "1",
          inputComponent: NumberFormatCustom,
        } : {readOnly: true}}
        value={orElse(selectedQuantity[rowData['shipmentItemId']], 0)}
        onChange={event => {
          let newValue = event.target.value;
          let maxValue = rowData['quantity'];
          if (newValue <= 0) {
            newValue = 1;
          } else if (newValue > maxValue) {
            newValue = maxValue;
          }
          selectedQuantity[rowData['shipmentItemId']] = newValue;
          rerender([]);
          getDeliveryTripCapacityInfo(selectedRows, selectedQuantity);
        }}
      />,
    },
    {
      title: "Tổng khối lượng (kg)",
      field: "weight",
      render: rowData => Math.round(rowData['weight'] * selectedQuantity[rowData['shipmentItemId']] * 100 || 0) / 100.0
    },
  ];

  const handleSubmit = () => {
    const body = selectedRows.map(shipmentItem => ({
      shipmentItemId: shipmentItem['shipmentItemId'],
      deliveryQuantity: selectedQuantity[shipmentItem['shipmentItemId']]
    }));
    console.log(body);
    authPost(dispatch, token, '/create-delivery-trip-detail/' + deliveryTripId, body).then(response => response.json()).then(
      response => {
        if (typeof response === 'number') {
          showAlert('Thành công', 'Đã thêm vào chuyến cho ' + response + ' đơn hàng',
            ({OK: () => history.push(process.env.PUBLIC_URL + "/delivery-trip/" + deliveryTripId)}));
          console.log(response);
          // browserHistory.goBack();
        }
      },
      error => console.log(error)
    )
  };

  const classes = useStyles();

  const {deliveryTripId} = useParams();

  const [deliveryTrip, setDeliveryTrip] = useState(null);

  const [tripCapacityInfo, setTripCapacityInfo] = useState({});

  const [dataTable, setDataTable] = useState();

  function getDataTable() {
    authGet(
      dispatch,
      token,
      "/shipment-item-delivery-trip/" + deliveryTripId + '/all'
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
        deliveryPlanId: response['deliveryPlanId'],
        vehicleId: response['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['vehicleTypeId']
      });
    })
  };

  function getDeliveryTripCapacityInfo(selectedRows, selectedQuantity) {
    let body = selectedRows.map(shipmentItem => ({
      shipmentItemId: shipmentItem['shipmentItemId'],
      deliveryQuantity: selectedQuantity[shipmentItem['shipmentItemId']]
    }));
    authPost(dispatch, token, '/delivery-trip/' + deliveryTripId + '/capacity-info', body).then(response => response.json()).then(response => {
      setTripCapacityInfo(response);
    }).catch(console.log);
  }

  useEffect(() => {
    getDeliveryTripBasicInfo();
    getDataTable();
    getDeliveryTripCapacityInfo(selectedRows, selectedQuantity);
  }, []);


  const [selectedQuantity,] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedIdSet, setSelectedIdSet] = useState(new Set());

  function onSelectedRowsChange(selectedRows) {
    let unSelectedRowIds = new Set(Object.keys(selectedQuantity));
    selectedRows.reduce((map, row) => {
      if (!map[row['shipmentItemId']]) {
        map[row['shipmentItemId']] = row['quantity'];
      }
      unSelectedRowIds.delete(row['shipmentItemId']);
      return map;
    }, selectedQuantity);
    unSelectedRowIds.forEach(id => delete selectedQuantity[id]);
    setSelectedRows(selectedRows);
    setSelectedIdSet(new Set(Object.keys(selectedQuantity)));
    getDeliveryTripCapacityInfo(selectedRows, selectedQuantity);
  }

  return <div>
    {
      <Link to={'/delivery-trip/' + deliveryTripId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }
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
                  <b>Loại xe: </b> {deliveryTrip === null ? '' : deliveryTrip['vehicleTypeId']}<p/>
                </div>
              </Grid>

              <Grid item xs={5}
                    style={{verticalAlign: 'text-bottom', textAlign: 'left', padding: '30px 30px 20px 30px'}}>
                <div>
                  <b>Tổng khoảng cách dự tính: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalDistance']}
                  <p/>
                  <b>Tổng khối lượng (kg): </b> {tripCapacityInfo == null ? 0 :
                  Math.round(tripCapacityInfo['totalWeight'] * 100) / 100.0} <p/>
                  <b>Tổng số pallet: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalPallet']} <p/>
                </div>
              </Grid>
            </Grid>
          </Toolbar>

          <MaterialTable
            title={'Chọn đơn hàng vào chuyến'}
            columns={columns}
            options={{search: false, selection: true}}
            data={dataTable}
            icons={tableIcons}
            onSelectionChange={selectedRows => onSelectedRowsChange(selectedRows)}
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

    <AlertDialog
      title={alertTitle}
      message={alertMessage}
      open={openAlert}
      setOpen={setOpenAlert}
      afterShowCallback={alertCallback}
    />

  </div>
}
