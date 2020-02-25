import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {authPost} from "../../../../api";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {toFormattedDateTime} from "../../../../utils/dateutils";
import {useHistory} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";


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


  const [date, setDate] = useState(new Date());
  const [vehicleList, setVehicleList] = useState([]); // TODO: init
  const [vehicleSelected, setVehicleSelected] = useState(null);

  function handleVehicleSelectedChange(event) {
    setVehicleSelected(event.target.value);
  }

  // const browserHistory = require('react-router/lib/BrowserHistory').default;

  const handleSubmit = () => {
    const deliveryTripInfo = {
      executeDate: toFormattedDateTime(date),
      vehicleId: vehicleSelected
    };
    console.log(deliveryTripInfo);
    authPost(dispatch, token, '/create-delivery-trip', deliveryTripInfo).then(
      response => {
        console.log(response);
        // browserHistory.goBack();
        history.push(process.env.PUBLIC_URL + "/delivery-plan/list")
      },
      error => console.log(error)
    )
  };

  const classes = useStyles();

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới chuyến giao hàng
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="delivery-trip-name"
                       label="Tên chuyến giao hàng"
                       type="disable"
            />
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
            />
            <InputLabel>Chọn xe</InputLabel>
            <Select
              id="demo-simple-select"
              value={vehicleSelected}
              onChange={handleVehicleSelectedChange}
            >
              {
                vehicleList.map(vehicle => <MenuItem value={vehicle['vehicleId']}>{vehicle['vehicleId']}</MenuItem>)
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