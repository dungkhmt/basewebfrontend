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

  const [maxTripDistance, setMaxTripDistance] = useState(0);
  const [maxDistanceConsecutiveLocationTripAllowed, setMaxDistanceConsecutiveLocationTripAllowed] = useState(0);
  const [maxLocationsPerTripAllowed, setMaxLocationsPerTripAllowed] = useState(0);
  const [fixLoadTime, setFixLoadTime] = useState(0);
  const [fixUnloadTime, setFixUnloadTime] = useState(0);
  const [loadRate, setLoadRate] = useState(0);
  const [manualUnloadTime, setManualUnloadTime] = useState(0);
  const [palletUnloadTime, setPalletUnloadTime] = useState(0);

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

    setMaxTripDistance(solverConfigParam['maxTripDistance']);
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
      maxTripDistance,
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

  const notNegativeIntFilterOnChange = (newValue, setValue) => {
    newValue = parseInt(newValue);
    notNegativeFilterOnChange(newValue, setValue);
  };

  const notNegativeFilterOnChange = (newValue, setValue) => {
    if (newValue >= 0) {
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

          {textField('maxTripDistance',
            'maxTripDistance',
            'number',
            maxTripDistance,
            newValue => notNegativeFilterOnChange(newValue, setMaxTripDistance))}
          {textField('maxDistanceConsecutiveLocationTripAllowed',
            'maxDistanceConsecutiveLocationTripAllowed',
            'number',
            maxDistanceConsecutiveLocationTripAllowed,
            newValue => notNegativeFilterOnChange(newValue, setMaxDistanceConsecutiveLocationTripAllowed))}
          {textField('maxLocationsPerTripAllowed',
            'maxLocationsPerTripAllowed',
            'number',
            maxLocationsPerTripAllowed,
            newValue => notNegativeIntFilterOnChange(newValue, setMaxLocationsPerTripAllowed))}
          {textField('fixLoadTime',
            'fixLoadTime',
            'number',
            fixLoadTime,
            newValue => notNegativeIntFilterOnChange(newValue, setFixLoadTime))}
          {textField('fixUnloadTime',
            'fixUnloadTime',
            'number',
            fixUnloadTime,
            newValue => notNegativeIntFilterOnChange(newValue, setFixUnloadTime))}
          {textField('loadRate',
            'loadRate',
            'number',
            loadRate,
            newValue => notNegativeFilterOnChange(newValue, setLoadRate))}
          {textField('manualUnloadTime',
            'manualUnloadTime',
            'number',
            manualUnloadTime,
            newValue => notNegativeFilterOnChange(newValue, setManualUnloadTime))}
          {textField('palletUnloadTime',
            'palletUnloadTime',
            'number',
            palletUnloadTime,
            newValue => notNegativeFilterOnChange(newValue, setPalletUnloadTime))}

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