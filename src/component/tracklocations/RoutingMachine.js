import PropTypes from "prop-types";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const pointsToLatLng = (points) => {
  return points.map((point) => L.latLng(point.lat, point.lng));
};

const createRoutineMachineLayer = (props) => {
  const { waypoints } = props;

  const instance = L.Routing.control({
    waypoints: pointsToLatLng(waypoints),
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 5 }],
    },
    altLineOptions: {
      styles: [{ color: "gray", weight: 5 }],
    },
    // show: true,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: true,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

RoutingMachine.propTypes = {
  waypoints: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default RoutingMachine;
