import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  MapConsumer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
export default function OSMap() {
  const point = { lat: 21.006015, lng: 105.84368 }; // Bach khoa
  const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  });

  const [markers, setMarkers] = useState([]);
  const points = [
    [21.006015, 105.84368],
    [21.016015, 105.82368],
    [21.026015, 105.74368],
  ];
  function handleClickMarker(idx) {
    //alert("click on ", e);
    console.log("handleClickMarker idx = ", idx);
  }
  return (
    <div>
      <h1>OSM</h1>
      <MapContainer center={point} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((position, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={position}
            eventHandlers={{
              click: (e) => {
                handleClickMarker(idx);
                console.log("marker clicked", e);
              },
            }}
          />
        ))}
        <Polyline
          positions={points}
          eventHandlers={{
            click: (e) => {
              //handleClickMarker(idx);
              console.log("polyline clicked", e);
            },
          }}
        ></Polyline>
        <MapConsumer>
          {(map) => {
            console.log("map center:", map.getCenter());
            map.on("click", function (e) {
              const { lat, lng } = e.latlng;
              //L.marker([lat, lng], { icon }).addTo(map);
              //markers.push({ lat, lng });
              let l = [...markers];
              l.push({ lat, lng });
              setMarkers(l);
            });
            return null;
          }}
        </MapConsumer>
      </MapContainer>
    </div>
  );
}
