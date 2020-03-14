import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {authGet, authPost} from "../../../../api";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {toFormattedDateTime} from "../../../../utils/dateutils";
import {Link, useHistory, useParams} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
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

export default function DeliveryTripCreate() {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const {deliveryPlanId} = useParams();
  const [date, setDate] = useState(new Date());
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicleSelected, setVehicleSelected] = useState(null);
  const [driverList, setDriverList] = useState([]);
  const [driverSelected, setDriverSelected] = useState(null);

  function getVehicleList() {
    authGet(dispatch, token, '/vehicle/' + deliveryPlanId + '/all').then(response => {
      setVehicleList(response);
    }).catch(console.log);
  }

  function getDriverList() {
    authGet(dispatch, token, '/get-all-drivers').then(response => {
      setDriverList(response);
      console.log('driver: ' + response);
    }).catch(console.log);
  }

  const handleSubmit = () => {
    const deliveryTripInfo = {
      deliveryPlanId,
      executeDate: toFormattedDateTime(date),
      vehicleId: vehicleSelected,
      driverId: driverSelected
    };
    console.log(deliveryTripInfo);
    authPost(dispatch, token, '/create-delivery-trip', deliveryTripInfo).then(
      response => {
        console.log(response);
        // browserHistory.goBack();
        history.push(process.env.PUBLIC_URL + "/delivery-plan/" + deliveryPlanId)
      },
      error => console.log(error)
    )
  };

  const classes = useStyles();

  useEffect(() => {
    getVehicleList();
    getDriverList();
  }, []);

  return <div>
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }

    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới chuyến giao hàng
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="delivery-trip-name"
                       label="Tên kế hoạch giao hàng"
                       value={deliveryPlanId}
                       type="disable"
            />
            {/*<TextField id="delivery-trip-name"*/}
            {/*           label="Tên chuyến giao hàng"*/}
            {/*           type="search"*/}
            {/*/>*/}
            <KeyboardDatePicker disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id="delivery-trip-date-picker-inline"
                                label="Lựa chọn thời gian thực hiện"
                                value={date}
                                onChange={setDate}
                                KeyboardButtonProps={{
                                  "aria-label": "Thay đổi thời gian"
                                }}
            /><p/>
            <InputLabel>Chọn xe</InputLabel>
            <Select
              value={vehicleSelected}
              onChange={event => setVehicleSelected(event.target.value)}
            >
              {
                vehicleList.map(vehicle => <MenuItem
                  value={vehicle['vehicleId']}>{vehicle['vehicleId'] + ' (' + vehicle['capacity'] + ' kg)'}
                </MenuItem>)
              }
            </Select><p/>

            <InputLabel>Chọn tài xế</InputLabel>
            <Select
              value={driverSelected}
              onChange={event => setDriverSelected(event.target.value)}
            >
              {
                driverList.map(driver =>
                  <MenuItem value={driver['partyId']}>
                    {driver['partyId'] + ' (' + driver['fullName'] + ')'}
                  </MenuItem>)
              }
            </Select>
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  </div>
}