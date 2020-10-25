import React, { useEffect, useState } from 'react';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";



function ViewAllPostOffice(props) {
    const [isRequesting, setIsRequesting] = useState(false);
    const [address, setAddress] = useState();
    const [coordinates, setCoordinates] = useState();

    const [lat, setLat] = useState();
    const [lng, setLng] = useState();

    const { data } = props.location.state
    const bounds = new window.google.maps.LatLngBounds();
    const [map, setMap] = useState();
    useEffect(() => {
        console.log(props.location.state)
        if (map === undefined) return
        map.props.children.forEach((child) => {
            if (child.type === Marker) {
                bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            }
        })
        console.log(map.map.fitBounds(bounds))
    })

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
                    zoom={5}
                    initialCenter={{ lat: 21.0003842, lng: 105.8331012 }}
                    ref={(ref) => { setMap(ref) }}
                >
                    {data.map((item) => {
                        return <Marker
                            title={item.postOfficeName}
                            position={{
                                lat: item.postalAddress.geoPoint.latitude,
                                lng: item.postalAddress.geoPoint.longitude,
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




