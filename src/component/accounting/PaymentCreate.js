import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import {notNegativeIntFilterOnChange, select, textField} from "../../utils/FormUtils";
import {authPost} from "../../api";

export function PaymentCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const [selectedDistributor, setSelectedDistributor] = useState({});
  const [distributorList, setDistributorList] = useState([]);
  const [amount, setAmount] = useState(1);

  async function getDistributorList() {
    let distributorList = (await authPost(dispatch, token, '/get-list-distributor', {}).then(r => r))['lists'];
    setDistributorList(distributorList);
  }

  useEffect(() => {
    getDistributorList().then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {partyId: selectedDistributor['partyId'], amount};
    let response = await authPost(dispatch, token, '/create-payment', body).then(r => r);
    if (response && response['paymentId']) {
      alert('Tạo thành công, paymentId = ' + response['paymentId']);
    }
  }

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tạo mới payment
          </Typography>
          <p/>

          {select('distributor',
            distributorList,
            'distributorCode',
            'distributorName',
            selectedDistributor,
            setSelectedDistributor)}

          {textField('amount',
            'Nhập số tiền',
            'number',
            amount,
            newValue => notNegativeIntFilterOnChange(newValue, setAmount))}


        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" startIcon={<CloudUploadIcon/>} onClick={handleSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  </div>;
}