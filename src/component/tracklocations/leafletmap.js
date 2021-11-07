import React, { useCallback, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import DraggableMarker from "./DraggableMarker";
import RoutingMachine from "./RoutingMachine";

const point = { lat: 21.006015, lng: 105.84368 }; // Bach khoa
const waypoints = [
  { lat: 21.005015, lng: 105.84368 },
  { lat: 21.008015, lng: 105.84568 },
];

function LeafletMap() {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(point);

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <MapContainer center={point} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <LayersControl position="topright">
        <LayersControl.Overlay name="Draggable marker">
        </LayersControl.Overlay>
      </LayersControl> */}
      <DraggableMarker
        draggable={draggable}
        position={position}
        setPosition={setPosition}
      >
        <div>
          <button onClick={toggleDraggable}>
            {draggable ? "turn off draggable" : "turn on draggable"}
          </button>
        </div>
      </DraggableMarker>
      <RoutingMachine waypoints={waypoints} />
    </MapContainer>
  );
}

export default LeafletMap;
