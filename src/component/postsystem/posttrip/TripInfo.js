import React, { useEffect, useState } from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";

function TripInfo(props) {
    const [fromAddress, setFromAddress] = useState();
    const [toAddress, setToAddress] = useState();
    const [fromLat, setFromLat] = useState();
    const [fromLng, setFromLng] = useState();
    const [toLat, setToLat] = useState();
    const [toLng, setToLng] = useState();
    const [map, setMap] = useState();
    const [tripId, setTripId] = useState();
    const [icon, setIcon] = useState();
    const { value } = props.location.state;

    useEffect(() => {
        setTripId(value.postOfficeFixedTripId)
        setFromAddress(value.fromPostOffice.postalAddress.address)
        setToAddress(value.toPostOffice.postalAddress.address)
        setFromLat(parseFloat(value.fromPostOffice.postalAddress.geoPoint.latitude))
        setFromLng(parseFloat(value.fromPostOffice.postalAddress.geoPoint.longitude))
        setToLat(parseFloat(value.toPostOffice.postalAddress.geoPoint.latitude))
        setToLng(parseFloat(value.toPostOffice.postalAddress.geoPoint.longitude))
        setIcon({
            url: "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png", // url
            scaledSize: new props.google.maps.Size(40, 40), // scaled size
        });
    }, [])

    useEffect(() => {
        const bounds = new window.google.maps.LatLngBounds();
        if (map === undefined) return
        map.props.children.forEach((child) => {
            if (child.type === Marker) {
                bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            }
        })
        map.map.fitBounds(bounds)

    });

    const style = {
        width: '35%',
        height: '50%'
    }
    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={5}>
                    <Typography variant="h5" component="h2">
                        Chỉnh sửa vị trí
                    </Typography>
                    <br />
                    <Typography variant="h6" component="h2">
                        Mã chuyến: {'  '} {tripId}
                    </Typography>
                    <br /><br />
                    <Typography variant="h6">
                        Xuất phát: {' '}
                    </Typography>
                    <TextField
                        id="fromAddress"
                        value={fromAddress}
                        fullWidth
                    >
                    </TextField>
                    <br /><br /><br />
                    <Typography variant="h6">
                        Đích đến: {' '}
                    </Typography>
                    <TextField
                        id="toAddress"
                        value={toAddress}
                        fullWidth
                    >
                    </TextField>
                    <br /><br /><br />
                    <Typography variant="h6">
                        Tọa độ đầu: {' '} {fromLat + ', ' + fromLng}
                    </Typography>
                    <Typography variant="h6">
                        Tọa độ đích: {' '} {toLat + ', ' + toLng}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Map
                        google={props.google}
                        zoom={5}
                        style={style}
                        initialCenter={{ lat: 20, lng: 105, }}
                        ref={(ref) => { setMap(ref) }}
                    >
                        <Marker
                            title={'Xuất phát'}
                            position={{
                                lat: fromLat,
                                lng: fromLng,
                            }}
                        />
                        <Marker
                            title={'Điểm đến'}
                            position={{
                                lat: toLat,
                                lng: toLng,
                            }}
                            icon={icon}
                        />
                    </Map>
                </Grid>
            </Grid>
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(TripInfo);
