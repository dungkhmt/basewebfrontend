import React, {useEffect, useState, Component} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet} from "../../api";
import { API_URL } from "../../config/config";
import {CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Geocoder from 'react-native-geocoding';
import {useParams} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  }
}));

const style = {
    width: '40%',
    height: '60%'
  }

class LakeLiveInfo extends Component {
    constructor(props) {
        super(props);
        console.log("CONSTRUCTOR LakeLiveInfo");
    }
  
  async componentDidMount(){  
      console.log("componentDidMount LakeLiveInfo");

  const {lakeId} = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);
  
  const classes = useStyles();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [centerLat, setCenterLat] = useState();
  const [centerLng, setCenterLng] = useState();
  const [lake, setLake] = useState({});
  
  const mapClicked = (mapProps, map, event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log("lat ", lat);
    console.log("lng ", lng);
    setLng(lng);
    setLat(lat);
    

  }
  
  try {
    setInterval(async () => {
      const res = await fetch(API_URL + "/lakeinfolive/" + this.lakeId, {
        method: "GET",
        headers: {
          "X-Auth-Token": token,
        },
        }
      );
      const data = await res.json();
      console.log("GOT data " + data);
      this.setLake(data);

    }, 1000);
  } catch(e) {
    console.log("FOUND exception",e);
  }
  

}
  
  render(){
  
  return (
      
    <div>
        LIVE
    </div>

  );
            }

}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(LakeLiveInfo);
