import React, {useEffect, useState} from "react";
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
import {
  notNegativeFilterOnChange,
  notNegativeIntFilterOnChange,
  textField,
  textFieldNumberFormat
} from "../../../utils/FormUtils";

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


  return <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Tham số cấu hình bộ giải
          </Typography>

          <p/>

          {textFieldNumberFormat('maxTripDistance',
            'maxTripDistance',
            maxTripDistance,
            newValue => notNegativeFilterOnChange(newValue, setMaxTripDistance))}
          {textFieldNumberFormat('maxDistanceConsecutiveLocationTripAllowed',
            'maxDistanceConsecutiveLocationTripAllowed',
            maxDistanceConsecutiveLocationTripAllowed,
            newValue => notNegativeFilterOnChange(newValue, setMaxDistanceConsecutiveLocationTripAllowed))}
          {textFieldNumberFormat('maxLocationsPerTripAllowed',
            'maxLocationsPerTripAllowed',
            maxLocationsPerTripAllowed,
            newValue => notNegativeIntFilterOnChange(newValue, setMaxLocationsPerTripAllowed))}
          {textFieldNumberFormat('fixLoadTime',
            'fixLoadTime',
            fixLoadTime,
            newValue => notNegativeIntFilterOnChange(newValue, setFixLoadTime))}
          {textFieldNumberFormat('fixUnloadTime',
            'fixUnloadTime',
            fixUnloadTime,
            newValue => notNegativeIntFilterOnChange(newValue, setFixUnloadTime))}
          {textFieldNumberFormat('loadRate',
            'loadRate',
            loadRate,
            newValue => notNegativeFilterOnChange(newValue, setLoadRate))}
          {textFieldNumberFormat('manualUnloadTime',
            'manualUnloadTime',
            manualUnloadTime,
            newValue => notNegativeFilterOnChange(newValue, setManualUnloadTime))}
          {textFieldNumberFormat('palletUnloadTime',
            'palletUnloadTime',
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