import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import { GoogleApiWrapper, Map, Marker, Polyline } from "google-maps-react";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authDelete, authGet, authPost } from "../../../api";
import AlertDialog from "../../../utils/AlertDialog";
import { localization, tableIcons } from "../../../utils/MaterialTableUtils";
import { errorNoti } from "../../../utils/notification";
import ConfirmDialog from "../ConfirmDialog";

function errHandling(err) {
  if (err.message == "Unauthorized")
    errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
  else errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
  console.trace(err);
}

const columns = [
  {
    title: "Mã gán",
    field: "postDriverPostOfficeAssignmentId",
    editable: false,
    hidden: true,
  },
  {
    title: "Mã số chuyến",
    field: "postOfficeFixedTripId",
    editable: false,
    hidden: true,
  },
  {
    title: "Từ bưu cục",
    field: "postFixedTrip.postOfficeTrip.fromPostOffice.postOfficeName",
  },
  {
    title: "Đến bưu cục",
    field: "postFixedTrip.postOfficeTrip.toPostOffice.postOfficeName",
  },
  { title: "Giờ khởi hành", field: "postFixedTrip.scheduleDepartureTime" },
];
const tripColumns = [
  { tilte: "Mã số chuyến", field: "postOfficeFixedTripId" },
  { tilte: "Xuất phát", field: "postOfficeTrip.fromPostOffice.postOfficeName" },
  { tilte: "Điểm đến", field: "postOfficeTrip.toPostOffice.postOfficeName" },
  { tilte: "Từ ngày", field: "fromDate" },
  { tilte: "Đến ngày", field: "thruDate" },
  { tilte: "Giờ đi", field: "scheduleDepartureTime" },
];
function extendBoundRecursive(bounds, map, elements) {
  elements.forEach((child) => {
    if (child && child.type === Marker) {
      bounds.extend(
        new window.google.maps.LatLng(
          child.props.position.lat,
          child.props.position.lng
        )
      );
    } else if (Array.isArray(child)) {
      extendBoundRecursive(bounds, map, child);
    }
  });
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 400,
  },
});

const style = {
  width: "100%",
  height: "100%",
};

function PostDriverDetail(props) {
  const classes = useStyles();
  const { postDriverId } = useParams();

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [map, setMap] = useState();
  const [tableRef, setTableRef] = useState();
  const [open, setOpen] = useState(false);
  const [postTripData, setPostTripData] = useState([]);
  const [comfirmAction, setConfirmAction] = useState({
    open: false,
    handleSuccess: undefined,
    content: undefined,
    title: undefined,
  });

  const arrow = {
    path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
    fillColor: "#f00",
    fillOpacity: 1.0,
    strokeColor: "#f00",
    strokeWeight: 1,
  };

  const loadData = async () => {
    await Promise.all([
      authGet(
        dispatch,
        token,
        "/get-office-assignment-list-by-post-driver/" + postDriverId,
        {}
      ).then((response) => {
        setData(response);
      }),
    ]).catch((err) => errHandling(err));
  };

  const [alertAction, setAlertAction] = useState({
    open: false,
    handleSuccess: undefined,
    title: undefined,
    message: undefined,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (map === undefined) return;
    const bounds = new window.google.maps.LatLngBounds();
    extendBoundRecursive(bounds, map, map.props.children);
    if (map.props.children.length > 0) map.map.fitBounds(bounds);
  });

  const deleteTrip = (oldData) => {
    console.log(oldData);
    authDelete(dispatch, token, "/delete-post-driver-post-office-assignment", {
      postDriverPostOfficeAssignmentId:
        oldData.postDriverPostOfficeAssignmentId,
    })
      .then((response) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        setAlertAction({
          open: true,
          message: "Xóa chuyến xe thành công",
          title: "Thông báo",
        });
      })
      .catch((err) => errHandling(err));
  };

  const addTrip = () => {
    setOpen(true);
    authGet(dispatch, token, "/get-post-trip-list/")
      .then((response) => {
        setPostTripData(response);
      })
      .catch((err) => errHandling(err));
  };

  const addPostTrip = (postTrip) => {
    setConfirmAction({
      open: true,
      handleSuccess: () => {
        authPost(dispatch, token, "/add-post-driver-post-office-assignment", {
          postDriverId: postDriverId,
          postOfficeFixedTripId: postTrip.postOfficeFixedTripId,
        })
          .then((response) => {
            setData([...data, response.postDriverPostOfficeAssignment]);
            setConfirmAction({ open: false });
            setAlertAction({
              open: true,
              message: "Thêm mới thành công !",
              title: "Thông báo",
            });
          })
          .catch((err) => errHandling(err));
      },
      content: "Xác nhận thêm chuyến xe này",
    });
  };

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <MaterialTable
            className={classes.table}
            title="Danh sách chuyến xe"
            columns={columns}
            options={{
              filtering: true,
              Materisearch: true,
              actionsColumnIndex: -1,
              selection: false,
            }}
            localization={localization}
            icons={tableIcons}
            data={data}
            tableRef={(ref) => setTableRef(ref)}
            editable={{
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  deleteTrip(oldData);
                  resolve();
                }),
            }}
            actions={[
              {
                icon: "add",
                tooltip: "Thêm chuyến mới",
                isFreeAction: true,
                onClick: () => addTrip(),
              },
            ]}
          />
        </Grid>
        <Grid item xs={7}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Map
              google={props.google}
              zoom={14}
              style={style}
              ref={(ref) => {
                setMap(ref);
              }}
              initialCenter={{
                lat: 21.027763,
                lng: 105.83416,
              }}
            >
              {data.map((assigment) => {
                let postOffice =
                  assigment.postFixedTrip.postOfficeTrip.fromPostOffice;
                return (
                  <Marker
                    title={postOffice.postOfficeName}
                    position={{
                      lat: postOffice.postalAddress.geoPoint.latitude,
                      lng: postOffice.postalAddress.geoPoint.longitude,
                    }}
                  />
                );
              })}
              {data.map((assigment) => {
                let postOffice =
                  assigment.postFixedTrip.postOfficeTrip.toPostOffice;
                return (
                  <Marker
                    title={postOffice.postOfficeName}
                    position={{
                      lat: postOffice.postalAddress.geoPoint.latitude,
                      lng: postOffice.postalAddress.geoPoint.longitude,
                    }}
                  />
                );
              })}
              {data.map((assigment) => {
                let trip = assigment.postFixedTrip.postOfficeTrip;
                return (
                  <Polyline
                    path={[
                      {
                        lat: trip.fromPostOffice.postalAddress.geoPoint
                          .latitude,
                        lng: trip.fromPostOffice.postalAddress.geoPoint
                          .longitude,
                      },
                      {
                        lat: trip.toPostOffice.postalAddress.geoPoint.latitude,
                        lng: trip.toPostOffice.postalAddress.geoPoint.longitude,
                      },
                    ]}
                    options={{
                      strokeColor: "#f00",
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                    icons={[
                      {
                        icon: arrow,
                        offset: "100%",
                      },
                    ]}
                  />
                );
              })}
            </Map>
          </div>
        </Grid>
      </Grid>
      <AlertDialog
        open={alertAction.open}
        setOpen={() =>
          setAlertAction({
            open: false,
          })
        }
        title={alertAction.title}
        message={alertAction.message}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle>{"Tìm kiếm chuyến xe"}</DialogTitle>
        <MaterialTable
          className={classes.table}
          title="Danh sách chuyến xe"
          columns={tripColumns}
          options={{
            filtering: true,
            Materisearch: true,
            actionsColumnIndex: -1,
            selection: false,
          }}
          localization={localization}
          icons={tableIcons}
          data={postTripData}
          actions={[
            (postTrip) => ({
              icon: () => <Icon color="primary">add_circle</Icon>,
              tooltip: "Thêm",
              onClick: (event, postTrip) => {
                addPostTrip(postTrip);
              },
            }),
          ]}
        />
      </Dialog>
      <ConfirmDialog
        confirmAction={comfirmAction}
        setConfirmAction={setConfirmAction}
      />
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(PostDriverDetail);
