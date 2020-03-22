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
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        inputProps={selectedIdSet.has(rowData['shipmentItemId']) ? {
          min: "0",
          max: "" + rowData['quantity'],
          step: "1"
        } : {readOnly: true}}
        value={orElse(selectedQuantity[rowData['shipmentItemId']], 0)}
        onChange={event => {
          selectedQuantity[rowData['shipmentItemId']] = event.target.value;
          rerender([]);
          getDeliveryTripCapacityInfo(selectedRows, selectedQuantity);
        }}
      />,
    },
    {
      title: "Tổng khối lượng",
      field: "weight",
      render: rowData => (rowData['weight'] * selectedQuantity[rowData['shipmentItemId']] || 0).toFixed(2)
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
          alert('Đã thêm vào chuyến cho ' + response + ' đơn hàng');
          console.log(response);
          // browserHistory.goBack();
          history.push(process.env.PUBLIC_URL + "/delivery-trip/" + deliveryTripId)
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
        deliveryPlanId: response['deliveryPlan']['deliveryPlanId'],
        vehicleId: response['vehicle']['vehicleId'],
        executeDate: response['executeDate'],
        vehicleTypeId: response['externalVehicleType'] == null ? null : response['externalVehicleType']['vehicleTypeId']
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
    }).
      catch(console.log);
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
                  <b>Tổng khoảng cách: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalDistance']} <p/>
                  <b>Tổng khối lượng: </b> {tripCapacityInfo == null ? 0 : tripCapacityInfo['totalWeight']} <p/>
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


  </div>
}