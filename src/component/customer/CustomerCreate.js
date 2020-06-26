import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {authPost} from "../../api";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {textField} from "../../utils/FormUtils";
import AlertDialog from "../../utils/AlertDialog";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 500
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  }
}));


function CustomerCreate(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [customerCode, setCustomerCode] = useState();
  const [customerName, setCustomerName] = useState();
  const [address, setAddress] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [isRequesting, setIsRequesting] = useState(false);

  const classes = useStyles();

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

  //
  // const handleCustomerCodeChange = event => {
  //   setCustomerCode(event.target.value);
  // }
  //
  // const handleCustomerNameChange = event => {
  //   setCustomerName(event.target.value);
  // }
  //
  // const handleAddressChange = event => {
  //   setAddress(event.target.value);
  // }
  //
  // const handleLatitudeChange = event => {
  //   setLatitude(event.target.value);
  // }
  //
  // const handleLongitudeChange = event => {
  //   setLongitude(event.target.value);
  // }

  function checkStringEmpty(fields) {
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i] || fields[i] === '') {
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!checkStringEmpty([customerCode, customerName, address, latitude, longitude])) {
      showAlert('Lỗi', 'Điền đầy đủ các trường và thử lại!');
      return;
    }
    const data = {
      customerCode: customerCode,
      customerName: customerName,
      address: address,
      latitude: latitude,
      longitude: longitude
    }
    setIsRequesting(true);
    let response = await authPost(dispatch, token, "/create-customer", data).then(r => r.json());
    setIsRequesting(false);
    if (response && response['partyId']) {
      showAlert('Thành công', 'Đã tạo thành công khách hàng có id = ' + response['partyId'],
        ({OK: () => history.push('/customer/list')}));
    } else {
      showAlert('Lỗi', 'Có lỗi xảy ra, có thể mã khách hàng đã được tạo trước đó!');
    }
    // .then(
    //   res => {
    //     console.log(res);
    //     setIsRequesting(false);
    //     if (res.status === 401) {
    //       dispatch(failed());
    //       throw Error("Unauthorized");
    //     } else if (res.status === 409) {
    //       showAlert('Lỗi', "Id exits!!");
    //     } else if (res.status === 201) {
    //       showAlert('Tạo thành công', 'Tạo thành công khách hàng ' + customerCode);
    //       return res.json();
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
    // event.preventDefault();
    // window.location.reload();
  }


  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Create Customer
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
              {textField('customerCode', 'Mã khách hàng', 'search', customerCode, setCustomerCode)}
              {textField('customerName', 'Tên khách hàng', 'search', customerName, setCustomerName)}
              {textField('address', 'Địa chỉ', 'search', address, setAddress)}
              {textField('latitude', 'Kinh độ', 'search', latitude, setLatitude)}
              {textField('longitude', 'Vĩ độ', 'search', longitude, setLongitude)}

              {/*<TextField*/}
              {/*  id="customerCode"*/}
              {/*  label="customerCode"*/}
              {/*  onChange={handleCustomerCodeChange}*/}
              {/*  required*/}
              {/*  helperText="customerCode"*/}
              {/*>*/}

              {/*</TextField>*/}

              {/*<TextField*/}
              {/*  id="customerName"*/}
              {/*  label="customerName"*/}
              {/*  onChange={handleCustomerNameChange}*/}
              {/*  required*/}
              {/*  helperText="customerName"*/}
              {/*>*/}

              {/*</TextField>*/}

              {/*<TextField*/}
              {/*  id="address"*/}
              {/*  label="address"*/}
              {/*  onChange={handleAddressChange}*/}
              {/*  required*/}
              {/*  helperText="address"*/}
              {/*>*/}

              {/*</TextField>*/}


              {/*<TextField*/}
              {/*  id="latitude"*/}
              {/*  label="latitude"*/}
              {/*  onChange={handleLatitudeChange}*/}
              {/*  required*/}
              {/*  helperText="latitude"*/}
              {/*>*/}

              {/*</TextField>*/}


              {/*<TextField*/}
              {/*  id="longitude"*/}
              {/*  label="longitude"*/}
              {/*  onChange={handleLongitudeChange}*/}
              {/*  required*/}
              {/*  helperText="longitude"*/}
              {/*>*/}

              {/*</TextField>*/}

            </form>
          </CardContent>


          <CardActions>
            <Button
              disabled={isRequesting}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isRequesting ? <CircularProgress/> : "Lưu"}
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
  )

}


export default CustomerCreate;
