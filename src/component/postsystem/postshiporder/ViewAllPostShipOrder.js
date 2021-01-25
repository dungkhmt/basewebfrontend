import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../../api";
import { failed } from "../../../action";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";



function ViewAllPostOffice(props) {
    const [address, setAddress] = useState();
    const [coordinates, setCoordinates] = useState();

    const [lat, setLat] = useState();
    const [lng, setLng] = useState();

    const handleAddressChange = event => {
        setAddress(event.target.value)
    }

    const { data } = props.location.state
    const bounds = new window.google.maps.LatLngBounds();
    // const bounds = postdata.reduce((prev, cur) => {
    //     prev.push({ lat: cur.postalAddress.geoPoint.latitude, lng: cur.postalAddress.geoPoint.longitude, })
    //     return prev
    // }, [])
    const [map, setMap] = useState();
    useEffect(() => {
        // console.log(data)
        if (map === undefined) return
        map.props.children.forEach((child) => {
            if (child.type === Marker) {
                bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            }
        })
        map.map.fitBounds(bounds)
    })


    const mapClicked = (mapProps, map, event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("lat ", lat);
        console.log("lng ", lng);
        setLng(lng);
        setLat(lat);
        setCoordinates("" + lat + ", " + lng);

    }


    const style = {
        width: '95%',
        height: '90%'
    }
    return (
        <div>
            <Grid item xs={12}>
                <Map
                    google={props.google}
                    zoom={1}
                    style={style}
                    onClick={mapClicked}
                    zoom={5}
                    initialCenter={{ lat: 21.0003842, lng: 105.8331012 }}
                    ref={(ref) => { setMap(ref) }}
                >
                    {data.filter((item) => {
                        return item.statusItem.statusCode !== 'CANCELLED'
                    })
                        .map((item) => {
                            console.log(item)
                            return <Marker
                                title={item.fromCustomer.postCustomerName + ' đến ' + item.toCustomer.postCustomerName}
                                position={{
                                    lat: item.toCustomer.postalAddress.geoPoint.latitude,
                                    lng: item.toCustomer.postalAddress.geoPoint.longitude,
                                }}
                            />
                        })}


                </Map>
            </Grid>

        </div>

    );

}


export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(ViewAllPostOffice);




