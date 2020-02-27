import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {authGet, authPost} from "../../../api";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {toFormattedDateTime} from "../../../utils/dateutils";
import {useHistory} from "react-router-dom";


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

export default function DeliveryPlanCreate() {

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();


  const [userName, setUserName] = useState();
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());

  function getUserName() {
    authGet(dispatch, token, '/').then(response => setUserName(response['user'])).catch(console.log)
  }

  useEffect(getUserName, []);

  const handleSubmit = () => {
    const deliveryPlanInfo = {
      description: name,
      createdByUserLoginId: userName,
      deliveryDate: toFormattedDateTime(date)
    };
    console.log(deliveryPlanInfo);
    authPost(dispatch, token, '/create-delivery-plan', deliveryPlanInfo).then(
      response => {
        console.log(response);
        history.push(process.env.PUBLIC_URL + "/delivery-plan-list")
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
            Tạo mới đợt giao hàng
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="delivery-plan-name"
                       label="Tên đợt giao hàng"
                       type="search"
                       onChange={event => setName(event.target.value)}/>
            <KeyboardDatePicker disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id="delivery-plan-date-picker-inline"
                                label="Lựa chọn thời gian thực hiện"
                                value={date}
                                onChange={setDate}
                                KeyboardButtonProps={{
                                  "aria-label": "Thay đổi thời gian"
                                }}
            />
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