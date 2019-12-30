import React from "react";
import Map from "../component/map";

export default function GMapContainer(){
    return (
        <Map
              id="myMap"
              height="95vh"
              options={{
                center: { lat: 10.46, lng: 106.4 },
                zoom: 8
              }}
              
            />
    );
}