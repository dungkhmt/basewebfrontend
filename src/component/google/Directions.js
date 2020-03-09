import React, {useEffect, useState} from "react";
import SimpleMap from "./SimpleMap";
import {authGet} from "../../api";
import {useDispatch, useSelector} from "react-redux";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Directions(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {
    routes  // list of route: [ {post:{label,lat,lng,title}, items:[item:{lat,lng,label,title}]}]
  } = props;

  const [mapOption,] = useState({
    center: {lat: 21.165837, lng: 105.659798},
    zoom: 8
  });
  const [state, rerender] = useState([]);

  useEffect(() => {
    rerender([]);
  }, [routes]);

  function updateColor() {
    const colors = [];
    for (let i = 0; i < routes.length; ++i) {
      colors.push(getRandomColor());
    }
    let idx = 0;
    routes.forEach(route => {
      if (route['color']) {
        return;
      }
      route['color'] = colors[idx];
      ++idx;
    });
  }

  function updateMarker(map) {
    let bounds = new window.google.maps.LatLngBounds();
    routes.forEach(route => {
      let post = route['post'];
      let postMarker = new window.google.maps.Marker({
        position: {lat: post['lat'], lng: post['lng']},
        map: map,
        title: post['title'] ? post['title'] : '',
        label: {
          color: 'white',
          text: post['label']
        }
      });
      bounds.extend(postMarker.position);

      let items = route['items'];
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
      })
    });

    map.fitBounds(bounds);
  }

  function updateDirection(map) {
    const directionsService = new window.google.maps.DirectionsService();
    routes.forEach((route, index) => {
      let items = route['items'];
      let post = route['post'];
      let postLatLng = post['lat'] + ',' + post['lng'];
      let routeColor = route['color'];

      const wayPoints = [];
      items.forEach(item => wayPoints.push({location: item['lat'] + ',' + item['lng'], stopover: true}))

      directionsService.route({
          origin: postLatLng,
          destination: postLatLng,
          waypoints: wayPoints,
          optimizeWaypoints: false,
          provideRouteAlternatives: true,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            const paths = [];
            response['routes'][0]['legs'].forEach(leg => leg['steps'].forEach(step => paths.push(step['path'])));

            new window.google.maps.DirectionsRenderer({
              polylineOptions: {
                strokeColor: routeColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                // icons: [{
                //   icon: {
                //     path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                //   },
                //   repeat: '30px',
                //   offset: '100%'
                // }],
                path: paths
              },
              suppressMarkers: true,
              draggable: true,
              map: map,
              directions: response,
              routeIndex: index,
            });
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    });
  }

  function update(map) {
    updateColor();
    updateMarker(map);
    updateDirection(map);
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