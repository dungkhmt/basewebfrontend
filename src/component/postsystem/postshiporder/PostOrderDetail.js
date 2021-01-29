import React, { useEffect, useState } from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { GoogleApiWrapper, Map, Marker, Polyline } from 'google-maps-react';
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../../api";
import { errorNoti } from "../../../utils/Notification";

function errHandling(err) {
  if (err.message == "Unauthorized")
    errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
  else
    errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
  console.trace(err);
}
const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: '15px'
  },
  container: {
    maxHeight: 440,
  },
});


const style = {
  width: '100%',
  height: '100%'
}

function PostOrderDetail(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [postShipOrderId, setPostShipOrderId] = useState();
  const [packageName, setPackageName] = useState();
  const [postPackageType, setPostPackageType] = useState();
  const [weight, setWeight] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [fromPostOffice, setFromPostOffice] = useState();
  const [toPostOffice, setToPostOffice] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [fromLat, setFromLat] = useState();
  const [fromLng, setFromLng] = useState();
  const [toLat, setToLat] = useState();
  const [toLng, setToLng] = useState();
  const [map, setMap] = useState();
  const [icon, setIcon] = useState();
  const [toPostOfficeIcon, setToPostOfficeIcon] = useState();
  const [fromPostOfficeIcon, setFromPostOfficeIcon] = useState();
  const { value } = props.location.state;
  const [routes, setRoutes] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const loadData = (postShipOrderId, fromPostOffice, toPostOffice) => {
    authGet(dispatch, token, "/get_post_order_route?postOrderId=" + postShipOrderId)
      .then(response => {
        setRoutes(response);
        let postOffices = []
        response.forEach(route => {
          if (!postOffices.includes(route.fromPostOffice)) {
            postOffices.push(route.fromPostOffice);
          }
          if (!postOffices.includes(route.toPostOffice)) {
            postOffices.push(route.toPostOffice);
          }
        })
        if (fromPostOffice) postOffices.push(fromPostOffice);
        if (toPostOffice) postOffices.push(toPostOffice);
        setPostOffices(postOffices);
      }).catch(err => errHandling(err));
  }

  const arrow = {
    path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
    fillColor: '00ffff',
    fillOpacity: 1.0,
    strokeColor: '00ffff',
    strokeWeight: 1,
  };

  useEffect(() => {
    setPostShipOrderId(value.postShipOrderId);
    setPackageName(value.packageName);
    setPostPackageType(value.postPackageType.postPackageTypeName);
    setWeight(value.weight);
    setDescription(value.description);
    setStatus(value.statusItem.description);
    if ('fromPostOffice' in value) {
      setFromPostOffice(value.fromPostOffice);
    }
    if ('toPostOffice' in value) {
      setToPostOffice(value.toPostOffice);
    }
    setFromAddress(value.fromCustomer.postalAddress.address);
    setToAddress(value.toCustomer.postalAddress.address);
    setFromLat(parseFloat(value.fromCustomer.postalAddress.geoPoint.latitude));
    setFromLng(parseFloat(value.fromCustomer.postalAddress.geoPoint.longitude));
    setToLat(parseFloat(value.toCustomer.postalAddress.geoPoint.latitude));
    setToLng(parseFloat(value.toCustomer.postalAddress.geoPoint.longitude));
    setIcon({
      url: "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png", // url
      scaledSize: new props.google.maps.Size(40, 40), // scaled size
    });
    setFromPostOfficeIcon({
      url: 'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow_v3-2-medium.png,assets/icons/poi/tactile/pinlet_outline_v3-2-medium.png,assets/icons/poi/tactile/pinlet_v3-2-medium.png,assets/icons/poi/quantum/pinlet/postoffice_pinlet-2-medium.png&highlight=ff000000,ffffff,ea4335,ffffff?scale=1',
    });
    setToPostOfficeIcon({
      url: 'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow_v3-2-medium.png,assets/icons/poi/tactile/pinlet_outline_v3-2-medium.png,assets/icons/poi/tactile/pinlet_v3-2-medium.png,assets/icons/poi/quantum/pinlet/postoffice_pinlet-2-medium.png&highlight=ff000000,ffffff,ea4335,ffffff?scale=1',
    });
    loadData(value.postShipOrderId, value.fromPostOffice, value.toPostOffice);
  }, [])

  useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds();
    if (map === undefined) return
    map.props.children.forEach((child) => {
      if (child && child.type === Marker) {
        bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
      }
    })
    map.map.fitBounds(bounds)
  });

  return (
    <div>

      <Grid container spacing={5} xs={12}>
        <Grid item xs={5}>
          <Typography variant="h5" component="h2">
            Chỉnh sửa đơn hàng
          </Typography>
          <Typography variant="h6" component="h2">
            Mã đơn hàng: {'  '} {postShipOrderId}
          </Typography>
          <br />
          <Paper className={classes.root}>
            <TextField
              id="fromAddress"
              value={fromAddress}
              label='Xuất phát'
              fullWidth
            ><br />
            </TextField>
            <TextField
              id="toAddress"
              value={toAddress}
              fullWidth
              label='Đích đến'
            ><br />
            </TextField>
            <TextField
              id="packageName"
              value={packageName}
              fullWidth
              label='Tên hàng'
            ><br />
            </TextField>
            <TextField
              id="postPackageType"
              value={postPackageType}
              fullWidth
              label='Loại hàng'
            ><br />
            </TextField>
            <TextField
              id="weight"
              value={weight}
              fullWidth
              label='Khối lượng'
            ><br />
            </TextField>
            <TextField
              id="description"
              value={description}
              fullWidth
              label='Mô tả'
            ><br />
            </TextField>
            <TextField
              id="status"
              value={status}
              fullWidth
              label='Trạng thái'
            ><br />
            </TextField>
            <TextField
              id="fromPostOffice"
              value={fromPostOffice ? fromPostOffice.postOfficeName : 'Chưa xác định'}
              fullWidth
              label='Bưu cục xuất phát'
            ><br />
            </TextField>
            <TextField
              id="toPostOffice"
              value={toPostOffice ? toPostOffice.postOfficeName : 'Chưa xác định'}
              fullWidth
              label='Bưu cục đích'
            ><br />
            </TextField>
          </Paper>
        </Grid>

        <Grid item xs={7}>
          <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '10px', overflow: 'hidden' }}>
            <Map
              google={props.google}
              zoom={5}
              style={style}
              initialCenter={{ lat: 20, lng: 105, }}
              ref={(ref) => { setMap(ref) }}
            >
              <Marker
                title={'Xuất phát'}
                position={{
                  lat: fromLat,
                  lng: fromLng,
                }}
              />
              <Marker
                title={'Điểm đến'}
                position={{
                  lat: toLat,
                  lng: toLng,
                }}
                icon={icon}
              />
              {
                postOffices.map(postOffice => {
                  return <Marker
                    title={postOffice.postOfficeName}
                    position={{
                      lat: postOffice.postalAddress.geoPoint.latitude,
                      lng: postOffice.postalAddress.geoPoint.longitude,
                    }}
                    icon={fromPostOfficeIcon}
                  />
                })
              }
              {/* {fromPostOffice ?
                <Marker
                  title={'Bưu cục xuất phát'}
                  position={{
                    lat: parseFloat(fromPostOffice.postalAddress.geoPoint.latitude),
                    lng: parseFloat(fromPostOffice.postalAddress.geoPoint.longitude),
                  }}
                  icon={fromPostOfficeIcon}
                />
                : undefined}
              {toPostOffice ?
                <Marker
                  title={'Bưu cục đích'}
                  position={{
                    lat: parseFloat(toPostOffice.postalAddress.geoPoint.latitude),
                    lng: parseFloat(toPostOffice.postalAddress.geoPoint.longitude),
                  }}
                  icon={toPostOfficeIcon}
                />
                : undefined} */}
              {fromPostOffice ?
                <Polyline
                  path={[
                    { lat: fromLat, lng: fromLng },
                    { lat: parseFloat(fromPostOffice.postalAddress.geoPoint.latitude), lng: parseFloat(fromPostOffice.postalAddress.geoPoint.longitude) }
                  ]}
                  icons={
                    [{
                      icon: arrow,
                      offset: '100%',
                    }]
                  }
                  options={{
                    strokeColor: '00ffff',
                    strokeOpacity: 1,
                    strokeWeight: 2
                  }}
                />
                : undefined}
              {toPostOffice ?
                <Polyline
                  path={[
                    { lat: parseFloat(toPostOffice.postalAddress.geoPoint.latitude), lng: parseFloat(toPostOffice.postalAddress.geoPoint.longitude) },
                    { lat: toLat, lng: toLng }
                  ]}
                  icons={
                    [{
                      icon: arrow,
                      offset: '100%',
                    }]
                  }
                  options={{
                    strokeColor: '00ffff',
                    strokeOpacity: 1,
                    strokeWeight: 2
                  }}
                />
                : undefined}
              {routes.map(route => {
                return <Polyline
                  path={[
                    { lat: route.fromPostOffice.postalAddress.geoPoint.latitude, lng: route.fromPostOffice.postalAddress.geoPoint.longitude },
                    { lat: route.toPostOffice.postalAddress.geoPoint.latitude, lng: route.toPostOffice.postalAddress.geoPoint.longitude },
                  ]}
                  icons={
                    [{
                      icon: arrow,
                      offset: '100%',
                    }]
                  }
                  options={{
                    strokeColor: '00ffff',
                    strokeOpacity: 1,
                    strokeWeight: 2
                  }}
                />
              })}
            </Map>
          </div>
        </Grid>
      </Grid>

    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(PostOrderDetail);
