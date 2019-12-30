import React from "react";
import GISMap from "../component/tracklocations/gismap";

export default function GMapContainer(){
    return (
        <GISMap
              id="myMap"
              height="95vh"
              options={{
                center: { lat: 10.46, lng: 106.4 },
                zoom: 8
              }}
              
            />
    );
}