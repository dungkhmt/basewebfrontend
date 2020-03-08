import React, {useEffect, useState} from "react";
import SimpleMap from "./SimpleMap";

export default function Markers(props) {

  const {
    items  // list of point: [item:{lat,lng,label,title}]
  } = props;

  const [mapOption,] = useState({
    center: {lat: 21.165837, lng: 105.659798},
    zoom: 8
  });
  const [state, rerender] = useState([]);

  useEffect(() => {
    rerender([]);
  }, [items]);


  function updateMarker(map) {
    let bounds = new window.google.maps.LatLngBounds();
    items.forEach(item => {
      let marker = new window.google.maps.Marker({
        position: {lat: item['lat'], lng: item['lng']},
        map: map,
        title: item['title'] ? item['title'] : '',
      });
      bounds.extend(marker.position);
      if (item['infoWindow']) {
        marker.addListener('click', () => new window.google.maps.InfoWindow({content: item['infoWindow']}).open(map, marker));
      }
    });

    map.fitBounds(bounds);
  }

  function update(map) {
    updateMarker(map);
  }

  return <div>
    {
      <SimpleMap
        id={'markers'}
        height="80vh"
        option={mapOption}
        onMapLoad={update}
        flag={state}
      />
    }
  </div>;
}