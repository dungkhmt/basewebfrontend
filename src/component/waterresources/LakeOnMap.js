import React, { Component, useState } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { useHistory } from "react-router";
const mapStyles = {
    width: "96.4%", // need fix
    height: "100%",
    margin: "1px",
};

function LakeOnMap(props) {
    const history = useHistory();
    const [showingInfoWindow, setShowingInfoWindow] = useState(true);
    const [activeMarker, setActiveMarker] = useState({});
    const [selectedPlace, setSelectedPlace] = useState({}); 
    const [urlInfoMarker, setUrlInfoMarker] = useState(); 
    const onMarkerClick = (props, marker, e) => {
        setShowingInfoWindow(true);
        setActiveMarker(marker);
        setSelectedPlace(props);
        setUrlInfoMarker(marker.url);
    };
    const onClose = (props) => {
        if (showingInfoWindow) {
            setShowingInfoWindow(false);
            setActiveMarker(null);
        }
    };
    console.log(props.lakes);
    let lakes = props.lakes;
    let listMarker;
    if (lakes === [])  listMarker = null;
    else
        listMarker = lakes.map((lake, index) => {
            return (
                <Marker
                    url={"/lake/info/" + lake.lakeId}
                    key={index}
                    onClick={onMarkerClick}
                    name={lake.lakeName}
                    position={{
                        lat: lake.latitude,
                        lng: lake.longitude,
                    }}
                />
            );
        });
    
    return (
        <Map
            google={props.google}
            zoom={7}
            style={mapStyles}
            initialCenter={{
                lat: 21.027763,
                lng: 105.83416,
            }}
        >
            {listMarker}
            <InfoWindow
                marker={activeMarker}
                visible={showingInfoWindow}
                onClose={onClose}
            >
                <Router>
                    <b>{selectedPlace.name}</b>
                    <br />
                    <Link to={urlInfoMarker}> Xem chi tiết </Link>
                </Router>
            </InfoWindow>
        </Map>
    );
}
export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(LakeOnMap);
