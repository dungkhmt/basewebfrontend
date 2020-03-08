import React, {useEffect, useState} from "react";
import SimpleMap from "./SimpleMap";
import {useDispatch, useSelector} from "react-redux";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Markers(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {
    routes: items  // list of point: [item:{lat,lng,label,title}]
  } = props;

  const [mapOption,] = useState({
    center: {lat: 21.165837, lng: 105.659798},
    zoom: 8
  });
  const [state, rerender] = useState([]);

  useEffect(() => {
    rerender([]);
  }, [items]);

  function updateColor() {
    const colors = [];
    for (let i = 0; i < items.length; ++i) {
      colors.push(getRandomColor());
    }
    let idx = 0;
    items.forEach(route => {
      if (route['color']) {
        return;
      }
      route['color'] = colors[idx];
      ++idx;
    });
  }

  function updateMarker(map) {
    let bounds = new window.google.maps.LatLngBounds();
    let itemId = 0;
    items.forEach(item => {
      let marker = new window.google.maps.Marker({
        position: {lat: item['lat'], lng: item['lng']},
        map: map,
        title: item['title'] ? item['title'] : '',
        icon: {
          url: "http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|" + route['color'].substring(1) + "|1|_|.",
          labelOrigin: new window.google.maps.Point(9, 9)
        },
        label: {
          color: 'white',
          text: itemId + ''
        }
      });
      itemId += 1;
      bounds.extend(marker.position);
      if (item['infoWindow']) {
        marker.addListener('click', () => new window.google.maps.InfoWindow({content: item['infoWindow']}).open(map, marker));
      }
    });

    map.fitBounds(bounds);
  }

  function update(map) {
    updateColor();
    updateMarker(map);
  }

  return <div>
    {
      <SimpleMap
        id={'directions'}
        height="80vh"
        option={mapOption}
        onMapLoad={update}
        flag={state}
      />
    }
  </div>;
}