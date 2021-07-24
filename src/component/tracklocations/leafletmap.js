import React from "react";
import { Map } from "react-leaflet";

function MyMap() {
  return (
    <div>
      <Map style={{ height: "80vh" }} zoom={2} center={[20, 100]}></Map>
    </div>
  );
}

export default MyMap;
