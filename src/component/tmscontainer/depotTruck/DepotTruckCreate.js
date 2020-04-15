import React, {Component, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../../api";
import {failed} from "../../../action";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import Grid from "@material-ui/core/Grid";


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

function DeporTruckCreate(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [depotTruckId, setDepotTruckId] = useState();
    const [depotTruckName, setDepotTruckName] = useState();
    const [address, setAddress] = useState();
    const classes = useStyles();
    const [lat,setLat] = useState();
    const [lng,setLng] = useState();
    const [coordinates, setCoordinates] = useState();


    const handleAddressChange = event=>{
        setAddress(event.target.value)
    }

    const handleDepotTruckIdChange = event=>{
        setDepotTruckId(event.target.value)
    }

    const handleDepotTruckNameChange = event=>{
        setDepotTruckName(event.target.value)
    }
    const mapClicked = (mapProps, map, event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("lat ", lat);
        console.log("lng ", lng);
        setLng(lng);
        setLat(lat);
        setCoordinates(""+ lat + ", " +lng);

    }

    useEffect(() => {

            navigator.geolocation.getCurrentPosition(position => {
                setLat(position.coords.latitude)
                setLng(position.coords.longitude)
                setCoordinates(position.coords.latitude+", "+position.coords.longitude)
            })




        }, []
    )
    const handleSubmit = event => {
        const data = {
            lat: lat,
            lng: lng,
            address: address,
            depotTruckId: depotTruckId,
            depotTruckName: depotTruckName
        }
        setIsRequesting(true);
        authPost(dispatch,token,"/create-depot-truck",data)
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
            );

    }
    const style = {
        width: '35%',
        height: '50%'
    }
    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={5}>


                    <Typography variant="h2" component="h2" >
                        Thêm mới bãi đầu kéo
                    </Typography>


                    <br/>




                    <Typography variant="h6" >
                        Mã bãi: {' '}
                    </Typography>


                    <TextField
                        id="depotTruckId"
                        onChange={handleDepotTruckIdChange}
                        required
                        value={depotTruckId}
                        fullWidth
                    >
                    </TextField>



                    <br/><br/>
                    <Typography variant="h6" >
                        Tên bãi: {' '}
                    </Typography>


                    <TextField
                        id="depotTruckName"
                        onChange={handleDepotTruckNameChange}
                        required
                        value={depotTruckName}
                        fullWidth
                    >
                    </TextField>



                    <br/><br/>

                    <Typography variant="h6" >
                        Địa chỉ: {' '}
                    </Typography>


                    <TextField
                        id="address"
                        onChange={handleAddressChange}
                        required
                        value={address}
                        fullWidth
                    >
                    </TextField>


                    <br/><br/><br/>

                    <Typography variant="h6" >
                        Tọa độ:  {' '} {coordinates}
                    </Typography>

                    <CardActions>
                        <Link to={"/depottruckfunc/list"}>
                            <Button
                                disabled={isRequesting}
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                {isRequesting ? <CircularProgress /> : "Lưu"}
                            </Button>
                        </Link>



                    </CardActions>




                </Grid>

                <Grid item xs={6}>
                    <Map
                        google={props.google}
                        zoom={11}
                        style={style}
                        initialCenter={{
                            lat: lat,
                            lng: lng,
                        }}
                        center={{
                            lat: lat,
                            lng: lng,
                        }}
                        onClick={mapClicked}
                    >
                        <Marker
                            title={'Geolocation'}
                            position={{
                                lat:lat,
                                lng:lng,
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
})(DeporTruckCreate);