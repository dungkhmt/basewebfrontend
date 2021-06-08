import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { CardContent, CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { API_URL } from "../../../config/config";

function CreatePostOffice(props) {
  const token = useSelector((state) => state.auth.token);
  const [isRequesting, setIsRequesting] = useState(false);
  const history = useHistory();

  const [values, setValues] = useState({
    postOfficeName: "",
    postOfficeId: "",
    postOfficeLevel: 0,
    address: "",
  });

  const [lat, setLat] = useState(21.02828);
  const [lng, setLng] = useState(105.853882);

  const onChangeHandler = (props) => (event) => {
    setValues({ ...values, [props]: event.target.value });
  };

  const mapClicked = (mapProps, map, event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLat(lat);
    setLng(lng);
  };

  const onCancelHandler = (event) => {
    history.push("/postoffice/list");
  };

  const handleDragMarker = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setLat(lat);
    setLng(lng);
  };

  const onSaveHandler = (event) => {
    if (
      values.postOfficeName === "" ||
      values.postOfficeId === "" ||
      values.address === "" ||
      isNaN(values.postOfficeLevel)
    ) {
      alert("Thông tin nhập không đúng!");
      event.preventDefault();
      return;
    } else {
      setIsRequesting(true);
      console.log(values);
      fetch(API_URL + "/create-post-office", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ ...values, latitude: lat, longitude: lng }),
      }).then((res) => {
        setIsRequesting(false);
        alert("Đã lưu bưu cục " + values.postOfficeName);
        history.push("/postoffice/list");
      });
    }
  };

  const style = {
    width: "35%",
    height: "50%",
  };
  return (
    <Grid container>
      <Grid item xs={6}>
        <CardContent>
          <Typography variant="h5">Tạo mới bưu cục</Typography>
          <form>
            <div>
              <TextField
                id="postOfficeName"
                label="Tên bưu cục"
                placeholder="Nhập tên bưu cục..."
                onChange={onChangeHandler("postOfficeName")}
                style={{ width: 400, margin: 5 }}
                required={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                id="postOfficeId"
                label="Mã bưu cục"
                placeholder="Nhập mã bưu cục..."
                onChange={onChangeHandler("postOfficeId")}
                style={{ width: 400, margin: 5 }}
                required={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                id="postOfficeLevel"
                label="Cấp bưu cục"
                placeholder="Nhập cấp bưu cục..."
                onChange={onChangeHandler("postOfficeLevel")}
                style={{ width: 400, margin: 5 }}
                required={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                id="address"
                label="Địa chỉ"
                placeholder="VD: 75 Đinh Tiên Hoàng, Tràng Tiền, Hoàn Kiếm, Hà Nội"
                onChange={onChangeHandler("address")}
                style={{ width: 400, margin: 5 }}
                required={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <Typography variant="body" style={{ margin: 5 }}>
                Tọa độ: {lat} {" - "} {lng}
              </Typography>
            </div>
          </form>
        </CardContent>
        <CardActions style={{ marginLeft: 280 }}>
          <Button variant="contained" size="small" onClick={onCancelHandler}>
            Hủy
          </Button>
          <Button
            variant="contained"
            disabled={isRequesting}
            color="primary"
            size="small"
            onClick={onSaveHandler}
          >
            {isRequesting ? <CircularProgress /> : "Lưu"}
          </Button>
        </CardActions>
      </Grid>
      <Grid item xs={3}>
        <Map
          google={props.google}
          zoom={11}
          style={style}
          initialCenter={{
            lat: lat,
            lng: lng,
          }}
          center={{
            lat: lat,
            lng: lng,
          }}
          onClick={mapClicked}
        >
          <Marker
            position={{
              lat: lat,
              lng: lng,
            }}
            onDragend={(t, map, coord) => handleDragMarker(coord)}
            draggable={true}
          />
        </Map>
      </Grid>
    </Grid>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(CreatePostOffice);
