import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { Marker, Popup } from "react-leaflet";

function DraggableMarker(props) {
  const { draggable, position, setPosition, children } = props;
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          // console.log(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      {children && <Popup minWidth={90}>{children}</Popup>}
    </Marker>
  );
}

DraggableMarker.propTypes = {
  draggable: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
  children: PropTypes.element,
};

export default DraggableMarker;
