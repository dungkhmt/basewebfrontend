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
import MaterialTable from "material-table";
import {tableIcons} from "../../../utils/iconutil";


function DeporTruckGoogleMap(props) {
    const [latCenter, setLatCenter] = useState();
    const [lngCenter, setLngCenter] = useState();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [listDeportTruck, setListDeportTruck] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setLatCenter(position.coords.latitude)
            setLngCenter(position.coords.longitude)
        })
    }, []);


    useEffect(() =>{

        authGet(dispatch,token,"/get-list-depot-truck")
            .then(
                res => {
                    console.log("sssssss");
                    console.log(res);
                    setIsRequesting(false);

                    if(res.status === 401){
                        dispatch(failed());
                        throw Error("Unauthorized")
                    }else if(res.status === 200){
                        return res.json();
                    }
                    setListDeportTruck(res.list);

                },
                error => {
                    console.log(error);
                }
            )

    },[]);



    const style = {
        width: '75%',
        height: '60%'
    }
    return(
        <div>
            <Grid container spacing={10}>
                <Grid item xs={10}>

                    <Typography variant="h2" component="h2" >
                        Vị trí các bãi đầu kéo
                    </Typography>




                </Grid>

                <Grid item xs={6}>
                    <Map
                        google={props.google}
                        zoom={11}
                        style={style}
                        initialCenter={{
                            lat: latCenter,
                            lng: lngCenter,
                        }}
                        center={{
                            lat: latCenter,
                            lng: lngCenter,
                        }}
                    >
                        {
                            listDeportTruck.map(deportTruck => (
                                <Marker
                                    title={deportTruck.depotTruckName}
                                    position={{
                                        lat:deportTruck.lat,
                                        lng:deportTruck.lng,
                                    }}
                                />
                            ))
                        }


                    </Map>
                </Grid>

            </Grid>

        </div>
    )

}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(DeporTruckGoogleMap);