import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import {authGet, authPost} from "../../../api";

export default function SolverConfigParam() {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [maxDistanceConsecutiveLocationTripAllowed, setMaxDistanceConsecutiveLocationTripAllowed] = useState(null);
  const [maxLocationsPerTripAllowed, setMaxLocationsPerTripAllowed] = useState(null);
  const [fixLoadTime, setFixLoadTime] = useState(null);
  const [fixUnloadTime, setFixUnloadTime] = useState(null);
  const [loadRate, setLoadRate] = useState(null);
  const [manualUnloadTime, setManualUnloadTime] = useState(null);
  const [palletUnloadTime, setPalletUnloadTime] = useState(null);

  function textField(id, label, type, value, onChange, readOnly) {
    return <div>
      <TextField id={id}
                 label={label}
                 type={type}
                 fullWidth={true}
                 value={value}
                 onChange={event => onChange(event.target.value)}
                 InputProps={{readOnly: readOnly}}/>
      <p/>
    </div>;
  }

  async function getData() {
    let solverConfigParam = await authGet(dispatch, token, '/get-solver-config-param');

    setMaxDistanceConsecutiveLocationTripAllowed(solverConfigParam['maxDistanceConsecutiveLocationTripAllowed']);
    setMaxLocationsPerTripAllowed(solverConfigParam['maxLocationsPerTripAllowed']);
    setFixLoadTime(solverConfigParam['fixLoadTime']);
    setFixUnloadTime(solverConfigParam['fixUnloadTime']);
    setLoadRate(solverConfigParam['loadRate']);
    setManualUnloadTime(solverConfigParam['manualUnloadTime']);
    setPalletUnloadTime(solverConfigParam['palletUnloadTime']);
  }

  useEffect(() => {
    getData().then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {
      maxDistanceConsecutiveLocationTripAllowed,
      maxLocationsPerTripAllowed,
      fixLoadTime,
      fixUnloadTime,
      loadRate,
      manualUnloadTime,
      palletUnloadTime
    };
    let response = await authPost(dispatch, token, '/set-solver-config-param', body).then(value => value.json());
    if (response) {
      alert('Update successfully');
    }
    window.location.reload();
  }

  const positiveIntFilterOnChange = (newValue, setValue) => {
    newValue = parseInt(newValue);
    positiveFilterOnChange(newValue, setValue);
  };

  const positiveFilterOnChange = (newValue, setValue) => {
    if (newValue > 0) {
      setValue(newValue);
    }
  };

  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tham số cấu hình bộ giải
          </Typography>

          <p/>

          {textField('maxDistanceConsecutiveLocationTripAllowed',
            'maxDistanceConsecutiveLocationTripAllowed',
            'number',
            maxDistanceConsecutiveLocationTripAllowed,
            newValue => positiveFilterOnChange(newValue, setMaxDistanceConsecutiveLocationTripAllowed))}
          {textField('maxLocationsPerTripAllowed',
            'maxLocationsPerTripAllowed',
            'number',
            maxLocationsPerTripAllowed,
            newValue => positiveIntFilterOnChange(newValue, setMaxLocationsPerTripAllowed))}
          {textField('fixLoadTime',
            'fixLoadTime',
            'number',
            fixLoadTime,
            newValue => positiveIntFilterOnChange(newValue, setFixLoadTime))}
          {textField('fixUnloadTime',
            'fixUnloadTime',
            'number',
            fixUnloadTime,
            newValue => positiveIntFilterOnChange(newValue, setFixUnloadTime))}
          {textField('loadRate',
            'loadRate',
            'number',
            loadRate,
            newValue => positiveFilterOnChange(newValue, setLoadRate))}
          {textField('manualUnloadTime',
            'manualUnloadTime',
            'number',
            manualUnloadTime,
            newValue => positiveFilterOnChange(newValue, setManualUnloadTime))}
          {textField('palletUnloadTime',
            'palletUnloadTime',
            'number',
            palletUnloadTime,
            newValue => positiveFilterOnChange(newValue, setPalletUnloadTime))}

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