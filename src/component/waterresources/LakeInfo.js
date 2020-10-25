import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet} from "../../api";
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

function LakeInfo(props) {
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
  useEffect(() => {
    authGet(dispatch, token, "/lake/" + lakeId).then(
      res => {
        let lakeData = res;
        setLake(lakeData);
        console.log('lake detail = ', lakeData);
        
      },
    );
  }, []);

  useEffect(() => {
    authGet(dispatch, token, "/lake/" + lakeId).then(
      res => {
        let lakeData = res;
        setLake(lakeData);
        console.log('lake detail = ', lake);
        setCenterLat(lakeData.latitude)
        setCenterLng(lakeData.longitude)
        console.log("center = " + centerLat + "," + centerLng);
      },
    );

      ///navigator.geolocation.getCurrentPosition(position => {
        //setCenterLat(position.coords.latitude)
        //setCenterLng(position.coords.longitude)
        //setCenterLat(lake.latitude)
        //setCenterLng(lake.longitude)
        //console.log("center = " + centerLat + "," + centerLng);
      //})


    }, []
  )
  
  const style = {
    width: '40%',
    height: '60%'
  }
  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={5}>


          <Typography variant="h2" component="h2">
            {lake.lakeName}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Diện tích lưu vực: {lake.dienTichLuuVuc}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Mức đảm bảo tưới: {lake.mucDamBaoTuoi}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Diện tích tưới: {lake.dienTichTuoi}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Mực nước chết: {lake.mucNuocChet}
          </Typography>
          <br/>
          

          



        </Grid>

        <Grid item xs={6}>
          <Map
            google={props.google}
            zoom={11}
            style={style}
            initialCenter={{
              lat: centerLat,
              lng: centerLng,
            }}
            center={{
              lat: centerLat,
              lng: centerLng,
            }}
            onClick={mapClicked}
          >
            <Marker
              title={'Geolocation'}
              position={{
                lat: lat,
                lng: lng,
              }}
            />


          </Map>
        </Grid>

      </Grid>

    </div>

  );


}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(LakeInfo);
