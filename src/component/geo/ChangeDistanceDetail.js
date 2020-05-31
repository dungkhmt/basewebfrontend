import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {authPost} from "../../api";
import {failed} from "../../action";
import {useDispatch, useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {CircularProgress} from "@material-ui/core";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import MenuItem from "@material-ui/core/MenuItem";


function ChangeDistanceDetail(props) {
  const {fromContactMechId, toContactMechId} = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [addressStart, setAddressStart] = useState();
  const [addressEnd, setAddressEnd] = useState();
  const [distance, setDistance] = useState();
  const [travelTime, setTravelTime] = useState();
  const [travelTimeTruck, setTravelTimeTruck] = useState();
  const [travelTimeMotobike, setTravelTimeMotobike] = useState();
  const [latStart, setLatStart] = useState();
  const [lngStart, setLngStart] = useState();
  const [latEnd, setLatEnd] = useState();
  const [lngEnd, setLngEnd] = useState();
  const [enumId, setEnumId] = useState();
  const [enumIdList, setEnumIdList] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const style = {
    width: '40%',
    height: '50%'
  }

  const handleDistanceChange = event => {
    setDistance(event.target.value);
  }

  const handleTravelTimeChange = event => {
    setTravelTime(event.target.value);
  }

  const handleTravelTimeTruckChange = event => {
    setTravelTimeTruck(event.target.value);
  }

  const handleTravelTimeMotobikeChange = event => {
    setTravelTimeMotobike(event.target.value);
  }

  const handleEnumIdChange = event => {
    setEnumId(event.target.value);
  }


  const handleSubmit = event => {
    const data = {
      distance: distance,
      travelTime: travelTime,
      travelTimeTruck: travelTimeTruck,
      travelTimeMotobike: travelTimeMotobike,
      enumId: enumId,
      fromContactMechId: fromContactMechId,
      toContactMechId: toContactMechId,
    }

    console.log("data ", data);
    setIsRequesting(true);
    authPost(dispatch, token, "/change-distance-travel-time-postal-address-info", data)
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 409) {
            alert("Id exits!!");
          } else if (res.status === 201) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
    event.preventDefault();
    window.location.reload();

  }


  // get info from start position
  useEffect(() => {
    authPost(dispatch, token, "/get-info-postal-to-display-in-map/" + fromContactMechId, {"statusId": null})
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(
        res => {
          console.log("res start", res);
          setAddressStart(res.address);
          setLatStart(res.lat);
          setLngStart(res.lng);
        })
  }, [])


  //get info from end position
  useEffect(() => {
    authPost(dispatch, token, "/get-info-postal-to-display-in-map/" + toContactMechId, {"statusId": null})
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);

        }
      )
      .then(
        res => {
          console.log("res end", res);
          setAddressEnd(res.address);
          setLatEnd(res.lat);
          setLngEnd(res.lng);
        })
  }, [])

  //get distance postal address info
  useEffect(() => {
    authPost(dispatch, token, "/get-distance-postal-address-info-with-key/" + fromContactMechId + "/" + toContactMechId, {"statusId": null})
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);

        }
      )
      .then(
        res => {
          console.log("res", res);
          setTravelTimeMotobike(res.travelTimeMotobike);
          setTravelTime(res.travelTime);
          setTravelTimeTruck(res.travelTimeTruck);
          setDistance(res.distance);
          setEnumId(res.enumID);
          console.log("enumID", res.enumID);
          console.log()
        })
  }, [])


  useEffect(() => {
    authPost(dispatch, token, "/get-list-enumeration-distance-source", {"statusId": null})
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);

        }
      )
      .then(
        res => {
          setEnumIdList(res.enumerationList);
        })
  }, [])


  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={6}>


          <Typography variant="h3" component="h6">
            Cập nhật thông tin khoảng cách
          </Typography>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Địa chỉ đầu: {' '} {addressStart}
          </Typography>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Địa chỉ cuối: {' '} {addressEnd}
          </Typography>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Khoảng cách:
          </Typography>
          <TextField
            id="distance"
            onChange={handleDistanceChange}
            required
            value={distance}
          >
          </TextField>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Thời gian di chuyển
          </Typography>
          <TextField
            id="travelTime"
            onChange={handleTravelTimeChange}
            required
            value={travelTime}
          >
          </TextField>


          <br/><br/>
          <Typography variant="h6" component="h3">
            Thời gian đi bằng xe máy
          </Typography>
          <TextField
            id="travelTimeMotobike"
            onChange={handleTravelTimeMotobikeChange}
            required
            value={travelTimeMotobike}
          >
          </TextField>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Thời gian đi bằng xe tải
          </Typography>
          <TextField
            id="travelTimeTruck"
            onChange={handleTravelTimeTruckChange}
            required
            value={travelTimeTruck}
          >
          </TextField>

          <br/><br/>
          <Typography variant="h6" component="h3">
            Nguồn
          </Typography>
          <TextField
            select
            required
            onChange={handleEnumIdChange}
            value={enumId}
            label={enumId}
          >
            {enumIdList.map(e => (
              <MenuItem
                key={e.enumId}
                value={e.enumId}
              >
                {e.enumId}
              </MenuItem>
            ))}
          </TextField>


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


        </Grid>

        <Grid item xs={6}>
          <Map
            google={props.google}
            zoom={11}
            style={style}
            initialCenter={{
              lat: (parseFloat(latStart) + parseFloat(latEnd)) / 2,
              lng: (parseFloat(lngStart) + parseFloat(lngEnd)) / 2
            }}
            center={{
              lat: (parseFloat(latStart) + parseFloat(latEnd)) / 2,
              lng: (parseFloat(lngStart) + parseFloat(lngEnd)) / 2
            }}

          >
            <Marker
              title={'marker 1'}
              position={{
                lat: latStart,
                lng: lngStart,
              }}
            />

            <Marker
              title={'marker 2'}
              position={{
                lat: latEnd,
                lng: lngEnd,
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
})(ChangeDistanceDetail);
