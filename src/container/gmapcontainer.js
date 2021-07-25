import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function GMapContainer() {
  const position = [20.81717, 105.33759]; // Hoa Binh position

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>

    // <Map
    //   id="myMap"
    //   height="95vh"
    //   options={{
    //     center: { lat: 10.46, lng: 106.4 },
    //     zoom: 8,
    //   }}
    // />
  );
}
