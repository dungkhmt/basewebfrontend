import React, {Component, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authPost} from "../../api";
import {failed} from "../../action";
import {CardText} from "material-ui";
import Typography from "@material-ui/core/Typography";
import {CardContent, CircularProgress} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {GoogleMapReact , MyGreatPlace, GoogleMap} from 'google-map-react';
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";





//const [address, setAddress] = useState();
//const [coordinates, setCoordinates] = useState();
//const token = useSelector(state => state.auth.token);
//const dispatch = useDispatch();
//const { contactMechId } = useParams();





/*
return (
    <div >

        <Typography variant="h5" component="h2">
            Chỉnh sửa vị trí
        </Typography>

        <br/>
        <Typography variant="h6" component="h4">
            Mã địa chỉ:  {'  '}   {contactMechId}
        </Typography>

        <br/>


        <tr>
            <td>
                <Typography variant="h6" >
                    Địa chỉ: {' '}
                </Typography>
            </td>

            <td>
                <TextField
                    id="address"
                    onChange={handleAddressChange}
                    required
                    value={address}
                >
                </TextField>
            </td>
        </tr>


        <br/>
        <tr>
            <td>
                <Typography variant="h6" >
                    Tọa độ:  {' '}
                </Typography>
            </td>
            <td>
                <TextField
                    id="coordinates"
                    onChange={handleAddressChange}
                    required
                    value={coordinates}
                >
                </TextField>
            </td>
        </tr>


        <br/>


    </div>
);

 */







function GeoGoogleMapChangeCoordinates(props) {
    const { contactMechId } = useParams();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [address, setAddress] = useState();
    const [coordinates, setCoordinates] = useState();

    const [lat,setLat] = useState();
    const [lng,setLng] = useState();

    const handleAddressChange = event=>{
        setAddress(event.target.value)
    }


    useEffect(() =>{

        authPost(dispatch,token,"/get-info-postal-to-display-in-map/"+contactMechId,{"statusId":null})
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
                    console.log('res',res);
                    setAddress(res.address);
                    setCoordinates(res.coordinates);
                    setLat(res.lat);
                    setLng(res.lng);

                })
    },[])


    const mapClicked = (mapProps, map, event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("lat ", lat);
        console.log("lng ", lng);
        setLng(lng);
        setLat(lat);
        setCoordinates(""+ lat + ", " +lng);

    }

    const handleSubmit = event =>{
        const data = {
            address: address,
            lat: lat,
            lng: lng
        }
        authPost(dispatch,token,"/geo-change-location-info-with-googlemap/"+contactMechId,data)
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
                    }else if (res.status === 208) {
                        alert('DUPLICTED');
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

    const style = {
        width: '35%',
        height: '50%'
    }
    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={5}>


                    <Typography variant="h5" component="h2" >
                        Chỉnh sửa vị trí
                    </Typography>


                    <br/>


                    <Typography variant="h6" component="h2">
                        Mã địa chỉ:  {'  '}   {contactMechId}
                    </Typography>


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
                        <Button
                            disabled={isRequesting}
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            {isRequesting ? <CircularProgress /> : "Lưu"}
                        </Button>
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
})(GeoGoogleMapChangeCoordinates);




