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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Geocoder from 'react-native-geocoding';






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

function DepotContainerCreate(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [depotContainerId, setDepotContainerId] = useState();
    const [depotContainerName, setDepotContainerName] = useState();
    const [address, setAddress] = useState();
    const classes = useStyles();
    const [lat,setLat] = useState();
    const [lng,setLng] = useState();
    const [coordinates, setCoordinates] = useState();
    const [suggestionList, setSuggestionList] = useState([]);
    const [contactMechId, setContactMechId] = useState([]);
    const defaultProps = {
        options: suggestionList,
        getOptionLabel: (option) => option.address,
    };


    const handleSuggestAddress = event =>{
        //console.log("handleSuggestAddress ",event.target.address);
        const data = {
            address: address,
        }
        //console.log("handleSuggestAddress ",data.address);
        //console.log("api key ",""+process.env.REACT_APP_GOOGLE_MAP_API_KEY);
        Geocoder.init(process.env.REACT_APP_GOOGLE_MAP_API_KEY);

        Geocoder.from(data.address)
            .then(json => {
                var location = json.results[0].geometry.location;

                setLat(location.lat);
                setLng(location.lng);

                setCoordinates(""+ location.lat + ", " + location.lng);
                setContactMechId(null);

            })
            .catch(error => console.warn(error));

    }



    const checkAddressToChangeLatLng = (event,newValue) =>{
        console.log("checkAddressToChangeLatLng", newValue);
        if(newValue !== null){
            setLat(newValue.lat);
            setLng(newValue.lng);
            setCoordinates("" + newValue.lat + ", " + newValue.lng);
            setContactMechId(newValue.contactMechId);
        }else{
            setContactMechId(null);
        }
        console.log("contactMenchId check....",contactMechId);

    }

    const handleAddressChange = event=>{
        console.log("address", event.target.value)
        setAddress(event.target.value)
        setContactMechId(null);
        console.log("contactMenchId handle....",contactMechId);

        const data = {
            address: event.target.value,
        }
        authPost(dispatch,token,"/get-list-address-suggestion",data)
            .then(
                res => {
                    console.log(res);
                    setIsRequesting(false);
                    if(res.status === 401){
                        dispatch(failed());
                        throw Error("Unauthorized")
                    }else if(res.status === 200){
                        return res.json();
                    }
                },
                error => {
                    console.log(error);
                }
            )
            .then(
                res =>{
                    console.log('res',res.list);
                    setSuggestionList(res.list);

                })

    }

    const handleDepotContainerIdChange = event=>{
        setDepotContainerId(event.target.value)
    }

    const handleDepotContainerNameChange = event=>{
        setDepotContainerName(event.target.value)
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
            depotContainerId: depotContainerId,
            depotContainerName: depotContainerName,
            contactMechId: contactMechId
        }
        setIsRequesting(true);
        authPost(dispatch,token,"/create-depot-container",data)
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
                        Thêm mới bãi container
                    </Typography>


                    <br/>








                    <Typography variant="h6" >
                        Mã bãi: {' '}
                    </Typography>


                    <TextField
                        id="depotContainerId"
                        onChange={handleDepotContainerIdChange}
                        required
                        value={depotContainerId}
                        fullWidth
                    >
                    </TextField>



                    <br/><br/>
                    <Typography variant="h6" >
                        Tên bãi: {' '}
                    </Typography>


                    <TextField
                        id="depotContainerName"
                        onChange={handleDepotContainerNameChange}
                        required
                        value={depotContainerName}
                        fullWidth
                    >
                    </TextField>



                    <br/><br/>

                    <Typography variant="h6" >
                        Địa chỉ: {' '}
                    </Typography>


                    <Autocomplete
                        {...defaultProps}
                        debug
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                margin="normal"
                                id="address"
                                onChange={handleAddressChange}
                                required
                                value={address}
                                fullWidth
                            />
                        }
                        onChange={checkAddressToChangeLatLng}

                    />




                    <br/><br/><br/>

                    <Typography variant="h6" >
                        Tọa độ:  {' '} {coordinates}
                    </Typography>

                    <CardActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSuggestAddress}
                            >
                            Gợi ý tọa độ
                        </Button>

                    </CardActions>


                    <CardActions>
                        <Link to={"/depotcontainerfunc/list"}>
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
})(DepotContainerCreate);