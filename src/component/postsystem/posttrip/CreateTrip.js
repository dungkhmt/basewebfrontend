import React, { useEffect, useState } from "react";
import { moment } from "moment";
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
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

function CreateTrip(props) {
  const token = useSelector((state) => state.auth.token);
  const [isRequesting, setIsRequesting] = useState(false);
  const history = useHistory();
  const [fromPostOfficeId, setFromPostOfficeId] = useState();
  const [fromPostOfficeName, setFromPostOfficeName] = useState();
  const [fromPostOfficeAddress, setFromPostOfficeAddress] = useState();
  const [fromPostOfficeLat, setFromPostOfficeLat] = useState(-1);
  const [fromPostOfficeLng, setFromPostOfficeLng] = useState(-1);
  const [toPostOfficeId, setToPostOfficeId] = useState();
  const [toPostOfficeName, setToPostOfficeName] = useState();
  const [toPostOfficeAddress, setToPostOfficeAddress] = useState();
  const [toPostOfficeLat, setToPostOfficeLat] = useState(-1);
  const [toPostOfficeLng, setToPostOfficeLng] = useState(-1);
  const [map, setMap] = useState();
  const [sheduleDepatureTime, setSheduleDepatureTime] = useState();
  const [fromDate, setFromDate] = useState();
  const [thruDate, setThruDate] = useState();
  const onCancelHandler = (event) => {
    history.push("/postoffice/triplist");
  };

  const onSaveHandler = (event) => {
    setIsRequesting(true);
    console.log(
      JSON.stringify({
        fromPostOfficeId: fromPostOfficeId,
        toPostOfficeId: toPostOfficeId,
        sheduleDepatureTime: sheduleDepatureTime,
        fromDate: fromDate,
        thruDate: thruDate,
      })
    );
    fetch(API_URL + "/create-post-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify({
        fromPostOfficeId: fromPostOfficeId,
        toPostOfficeId: toPostOfficeId,
        sheduleDepatureTime: sheduleDepatureTime,
        fromDate: fromDate,
        thruDate: thruDate,
      }),
    }).then((res) => {
      if (res.ok) {
        setIsRequesting(false);
        alert("Đã lưu chuyến xe");
        history.push("/postoffice/triplist");
      }
    });
  };

  const handleSheduleDepatureTimeChange = (date) => {
    setSheduleDepatureTime(date);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };
  const handleThruDateChange = (date) => {
    setThruDate(date);
  };

  const handleChooseCallBack = (editting, data) => {
    if (editting === "fromPostOffice") {
      setFromPostOfficeId(data["post_office_id"]);
      setFromPostOfficeName(data["post_office_name"]);
      setFromPostOfficeAddress(data["address"]);
      setFromPostOfficeLat(parseFloat(data["latitude"]));
      setFromPostOfficeLng(parseFloat(data["longitude"]));
    } else {
      setToPostOfficeId(data["post_office_id"]);
      setToPostOfficeName(data["post_office_name"]);
      setToPostOfficeAddress(data["address"]);
      setToPostOfficeLat(parseFloat(data["latitude"]));
      setToPostOfficeLng(parseFloat(data["longitude"]));
    }
  };

  useEffect(() => {
    if (!map) return;
    const bounds = new window.google.maps.LatLngBounds();
    let bounded = false;
    map.props.children.forEach((child) => {
      if (child && child.type === Marker) {
        bounds.extend(
          new window.google.maps.LatLng(
            child.props.position.lat,
            child.props.position.lng
          )
        );
        bounded = true;
      }
    });
    if (bounded) map.map.fitBounds(bounds);
  });

  const style = {
    width: "35%",
    height: "50%",
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <Grid item xs={6}>
          <CardContent>
            <Typography variant="h5">Tạo mới chuyến</Typography>
            <form>
              <div>
                <TextField
                  id="fromPostOfficeName"
                  label="Nhập tên bưu cục xuất phát..."
                  value={fromPostOfficeName ? fromPostOfficeName : ""}
                  style={{ width: 400, margin: 5 }}
                  required={true}
                />
                <SearchButton
                  callback={handleChooseCallBack}
                  data="fromPostOffice"
                />
              </div>
              <div>
                <TextField
                  id="toPostOfficeName"
                  label="Nhập tên bưu cục đích..."
                  value={toPostOfficeName ? toPostOfficeName : ""}
                  style={{ width: 400, margin: 5 }}
                  required={true}
                />
                <SearchButton
                  callback={handleChooseCallBack}
                  data="toPostOffice"
                />
              </div>
              <div>
                <KeyboardTimePicker
                  id="sheduleDepatureTime"
                  label="Thời gian chạy"
                  placeholder="Nhập thời gian chạy..."
                  onChange={handleSheduleDepatureTimeChange}
                  style={{ width: 400, margin: 5 }}
                  required={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={sheduleDepatureTime}
                  format="hh:mm"
                />
              </div>
              <div>
                <KeyboardDatePicker
                  id="fromDate"
                  label="Ngày bắt đầu"
                  placeholder="Nhập ngày bắt đầu..."
                  onChange={handleFromDateChange}
                  style={{ width: 400, margin: 5 }}
                  required={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={fromDate}
                  format="dd/MM/yyyy"
                />
              </div>
              <div>
                <KeyboardDatePicker
                  id="thruDate"
                  label="Ngày kết thúc"
                  placeholder="Nhập ngày kết thúc..."
                  onChange={handleThruDateChange}
                  style={{ width: 400, margin: 5 }}
                  required={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={thruDate}
                  format="dd/MM/yyyy"
                />
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
              lat: 20.999554095105758,
              lng: 105.80370373745424,
            }}
            ref={(ref) => {
              setMap(ref);
            }}
          >
            {fromPostOfficeLat >= 0 && fromPostOfficeLng >= 0 ? (
              <Marker
                title={"Địa chỉ đích"}
                position={{
                  lat: fromPostOfficeLat,
                  lng: fromPostOfficeLng,
                }}
                draggable={false}
              />
            ) : null}

            {toPostOfficeLat >= 0 && toPostOfficeLng >= 0 ? (
              <Marker
                title={"Địa chỉ xuất phát"}
                position={{
                  lat: toPostOfficeLat,
                  lng: toPostOfficeLng,
                }}
                draggable={false}
              />
            ) : null}
          </Map>
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

function SearchButton(props) {
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  const [postOfficeId, setPostOfficeId] = useState();
  const [postOfficeName, setPostOfficeName] = useState();
  const [address, setAddress] = useState();
  const classes = useStyles();
  let searchPostOfficeId;
  let searchPostOfficeName;
  let searchAddress;
  const columns = [
    {
      label: "Mã bưu cục",
      id: "post_office_id",
      minWidth: 150,
      type: "normal",
      align: "left",
    },
    {
      label: "Tên bưu cục",
      id: "post_office_name",
      minWidth: 100,
      type: "normal",
      align: "left",
    },
    {
      label: "Địa chỉ",
      id: "address",
      minWidth: 200,
      type: "normal",
      align: "left",
    },
    { label: "Chọn", id: "choose_button", type: "button", align: "center" },
  ];

  const handleChooseClick = (value) => {
    props.callback(props.data, value);
    setData([]);
    setOpen(false);
  };

  let controller = null;

  const handleElasticsearch = () => {
    if (controller) controller.abort();
    controller = new AbortController();
    let url = "http://localhost:9200/post_office_search/_search";
    let body = {
      size: 10,
      query: {
        bool: {
          must: [],
        },
      },
    };
    if (searchPostOfficeId) {
      body["query"]["bool"]["must"].push({
        match: { post_office_id: searchPostOfficeId },
      });
    }
    if (searchPostOfficeName) {
      body["query"]["bool"]["must"].push({
        match: { post_office_name: searchPostOfficeName },
      });
    }
    if (searchAddress) {
      body["query"]["bool"]["must"].push({ match: { address: searchAddress } });
    }
    if (body["query"]["bool"]["must"].length > 0) {
      fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          setData(
            response["hits"]["hits"].map((x) => {
              return x["_source"];
            })
          );
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handPostOfficeIdChange = (event) => {
    searchPostOfficeId = event.target.value;
    handleElasticsearch();
  };
  const handlePostOfficeNameChange = (event) => {
    searchPostOfficeName = event.target.value;
    handleElasticsearch();
  };
  const handleAddressChange = (event) => {
    searchAddress = event.target.value;
    handleElasticsearch();
  };

  const handleCancel = (event) => {
    setOpen(false);
  };

  const handleOpenDialog = (event) => {
    setOpen(true);
  };

  return (
    <div style={{ display: "inline-block", align: "right" }}>
      <IconButton value="" align="right" onClick={handleOpenDialog}>
        <SearchIcon />
      </IconButton>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{"Tìm kiếm user"}</DialogTitle>
        <DialogActions>
          <form noValidate autoComplete="off">
            <TextField
              id="postOfficeId"
              label="Mã bưu cục"
              value={postOfficeId}
              onChange={handPostOfficeIdChange}
            />
            <TextField
              id="postOfficeName"
              label="Tên bưu cục"
              value={postOfficeName}
              onChange={handlePostOfficeNameChange}
            />
            <TextField
              id="address"
              label="Địa chỉ"
              value={address}
              onChange={handleAddressChange}
            />
          </form>
        </DialogActions>
        <DialogContent>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => {
                  return (
                    <TableRow>
                      {columns.map((column) => {
                        if (column.type === "button")
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <IconButton
                                align="right"
                                onClick={() => handleChooseClick(row)}
                              >
                                <Icon color="primary">add_circle</Icon>
                              </IconButton>
                            </TableCell>
                          );
                        else
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {row[column.id]}
                            </TableCell>
                          );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(CreateTrip);
